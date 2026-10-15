# # app/services/model_service.py 
# import joblib
# import numpy as np
# import tensorflow as tf
# from app.config import settings

# class ModelService:
#     def __init__(self):
#         self.model = None
#         self.scaler = None
#         self.threshold = settings.DECISION_THRESHOLD

#     def load_artifacts(self):
#         if not settings.MODEL_PATH.exists():
#             print(f"Warning: Model not found at {settings.MODEL_PATH}")
#             return
#         if not settings.SCALER_PATH.exists():
#             print(f"Warning: Scaler not found at {settings.SCALER_PATH}")
#             return

#         self.model = tf.keras.models.load_model(str(settings.MODEL_PATH))
#         self.scaler = joblib.load(str(settings.SCALER_PATH))

#     def predict(self, spectrogram: np.ndarray, feature_vector: np.ndarray) -> tuple[bool, float, str]:
#         if self.model is None or self.scaler is None:
#             raise RuntimeError("Model or Scaler not loaded.")

#         # Expand batch dimension: (1, 128, 128, 1)
#         spec_input = np.expand_dims(spectrogram, axis=0)
        
#         # Scale and expand batch dimension: (1, 36)
#         feat_scaled = self.scaler.transform(np.expand_dims(feature_vector, axis=0))

#         # Forward pass
#         raw_prob = self.model.predict([spec_input, feat_scaled], verbose=0)
#         probability = float(raw_prob[0][0])

#         is_sepsis = probability >= self.threshold

#         # Risk Mapping
#         if probability < 0.30:
#             risk_level = "Low Risk"
#         elif 0.30 <= probability < 0.60:
#             risk_level = "Moderate Risk (Observation Recommended)"
#         else:
#             risk_level = "High Risk (Immediate Screening Required)"

#         return is_sepsis, probability, risk_level

# model_service = ModelService()




import joblib
import numpy as np
import tensorflow as tf
from app.config import settings

class ModelService:
    def __init__(self):
        self.models = {}
        self.scalers = {}
        self.threshold = settings.DECISION_THRESHOLD

    def load_artifacts(self):
        for pipeline in settings.AVAILABLE_PIPELINES:
            model_path = settings.ARTIFACTS_DIR / f"fusion_model_{pipeline}.keras"
            scaler_path = settings.ARTIFACTS_DIR / f"feature_scaler_{pipeline}.joblib"
            
            if model_path.exists() and scaler_path.exists():
                self.models[pipeline] = tf.keras.models.load_model(str(model_path))
                self.scalers[pipeline] = joblib.load(str(scaler_path))
            else:
                print(f"Warning: Artifacts for {pipeline} not found.")

    def predict(self, spectrogram: np.ndarray, feature_vector: np.ndarray, pipeline: str) -> tuple[bool, float, str]:
        if pipeline not in self.models or pipeline not in self.scalers:
            raise RuntimeError(f"Pipeline '{pipeline}' artifacts are missing.")

        model = self.models[pipeline]
        scaler = self.scalers[pipeline]

        spec_input = np.expand_dims(spectrogram, axis=0)
        feat_scaled = scaler.transform(np.expand_dims(feature_vector, axis=0))

        raw_prob = model.predict([spec_input, feat_scaled], verbose=0)
        probability = float(raw_prob[0][0])

        is_sepsis = probability >= self.threshold

        if probability < 0.30:
            risk_level = "Low Risk"
        elif 0.30 <= probability < 0.60:
            risk_level = "Moderate Risk (Observation)"
        else:
            risk_level = "High Risk (Immediate Action)"

        return is_sepsis, probability, risk_level

model_service = ModelService()
