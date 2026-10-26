# # app/services/model_service.py 
# import joblib
# import numpy as np
# import tensorflow as tf
# from app.config import settings

# class ModelService:
#     def __init__(self):
#         self.models = {}
#         self.scalers = {}
#         self.threshold = settings.DECISION_THRESHOLD

#     def load_artifacts(self):
#         for pipeline in settings.AVAILABLE_PIPELINES:
#             model_path = settings.ARTIFACTS_DIR / f"fusion_model_{pipeline}.keras"
#             scaler_path = settings.ARTIFACTS_DIR / f"feature_scaler_{pipeline}.joblib"
            
#             if model_path.exists() and scaler_path.exists():
#                 self.models[pipeline] = tf.keras.models.load_model(str(model_path))
#                 self.scalers[pipeline] = joblib.load(str(scaler_path))
#             else:
#                 print(f"Warning: Artifacts for {pipeline} not found.")

#     def predict(self, spectrogram: np.ndarray, feature_vector: np.ndarray, pipeline: str) -> tuple[bool, float, str]:
#         if pipeline not in self.models or pipeline not in self.scalers:
#             raise RuntimeError(f"Pipeline '{pipeline}' artifacts are missing.")

#         model = self.models[pipeline]
#         scaler = self.scalers[pipeline]

#         spec_input = np.expand_dims(spectrogram, axis=0)
#         feat_scaled = scaler.transform(np.expand_dims(feature_vector, axis=0))

#         raw_prob = model.predict([spec_input, feat_scaled], verbose=0)
#         probability = float(raw_prob[0][0])

#         is_sepsis = probability >= self.threshold

#         if probability < 0.30:
#             risk_level = "Low Risk"
#         elif 0.30 <= probability < 0.60:
#             risk_level = "Moderate Risk (Observation)"
#         else:
#             risk_level = "High Risk (Immediate Action)"

#         return is_sepsis, probability, risk_level

# model_service = ModelService()




import gc
from threading import Lock

import joblib
import numpy as np
import tensorflow as tf

from app.config import settings


class ModelService:
    def __init__(self):
        # Only the small scalers remain loaded in memory.
        # Keras models will be loaded one at a time.
        self.scalers = {}
        self.available_pipelines = []

        self.threshold = settings.DECISION_THRESHOLD

        # Prevent concurrent requests from loading multiple
        # Keras models into memory simultaneously.
        self.inference_lock = Lock()

    def load_artifacts(self):
        """
        Validate artifact files and load the scalers.
        Do not load all five Keras models during startup.
        """
        self.scalers.clear()
        self.available_pipelines.clear()

        missing_artifacts = []

        for pipeline in settings.AVAILABLE_PIPELINES:
            model_path = (
                settings.ARTIFACTS_DIR
                / f"fusion_model_{pipeline}.keras"
            )

            scaler_path = (
                settings.ARTIFACTS_DIR
                / f"feature_scaler_{pipeline}.joblib"
            )

            if not model_path.is_file() or not scaler_path.is_file():
                missing_artifacts.append(pipeline)
                continue

            # Scalers are small, so keep them loaded.
            self.scalers[pipeline] = joblib.load(str(scaler_path))

            # Record which pipelines have the required files.
            self.available_pipelines.append(pipeline)

        if missing_artifacts:
            raise FileNotFoundError(
                "Missing model or scaler artifacts for pipelines: "
                + ", ".join(missing_artifacts)
            )

        print(
            f"Validated {len(self.available_pipelines)} pipelines. "
            "Keras models will be loaded on demand."
        )

    def predict(
        self,
        spectrogram: np.ndarray,
        feature_vector: np.ndarray,
        pipeline: str,
    ) -> tuple[bool, float, str]:

        if pipeline not in self.available_pipelines:
            raise RuntimeError(
                f"Pipeline '{pipeline}' is unavailable."
            )

        model_path = (
            settings.ARTIFACTS_DIR
            / f"fusion_model_{pipeline}.keras"
        )

        scaler = self.scalers[pipeline]

        with self.inference_lock:
            model = None

            try:
                # 1. Load only the model needed for this prediction.
                model = tf.keras.models.load_model(
                    str(model_path),
                    compile=False,
                )

                # 2. Prepare the model inputs.
                spec_input = np.expand_dims(
                    spectrogram,
                    axis=0,
                ).astype(np.float32, copy=False)

                feat_scaled = scaler.transform(
                    np.expand_dims(feature_vector, axis=0)
                )

                # 3. Run inference.
                # Calling the model directly avoids the additional
                # prediction data-adapter machinery used by predict().
                raw_prob = model(
                    [spec_input, feat_scaled],
                    training=False,
                )

                probability = float(
                    np.asarray(raw_prob).reshape(-1)[0]
                )

                # 4. Interpret the prediction.
                is_sepsis = probability >= self.threshold

                if probability < 0.30:
                    risk_level = "Low Risk"

                elif probability < 0.60:
                    risk_level = "Moderate Risk (Observation)"

                else:
                    risk_level = "High Risk (Immediate Action)"

                return is_sepsis, probability, risk_level

            finally:
                # 5. Release this model before the next pipeline runs.
                if model is not None:
                    del model

                tf.keras.backend.clear_session()
                gc.collect()


model_service = ModelService()