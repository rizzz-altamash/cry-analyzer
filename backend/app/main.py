# # app/main.py 
# from contextlib import asynccontextmanager
# from fastapi import FastAPI, File, UploadFile, HTTPException, status
# from fastapi.middleware.cors import CORSMiddleware
# from starlette.concurrency import run_in_threadpool

# from app.config import settings
# from app.schemas import PredictionResponse, AudioMetadata
# from app.services.audio_processor import AudioProcessor
# from app.services.model_service import model_service

# # Load ML artifacts into memory on startup
# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     model_service.load_artifacts()
#     yield

# app = FastAPI(
#     title=settings.PROJECT_NAME,
#     lifespan=lifespan
# )

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# audio_processor = AudioProcessor()

# def _run_pipeline(file_bytes: bytes) -> PredictionResponse:
#     # 1. Condition signal
#     audio_signal, orig_duration = audio_processor.load_and_preprocess(file_bytes)

#     # 2. Extract Data
#     spectrogram = audio_processor.extract_mel_spectrogram(audio_signal)
#     feature_vector, metrics = audio_processor.extract_numerical_features(audio_signal)

#     # 3. Model Inference
#     is_sepsis, prob, risk = model_service.predict(spectrogram, feature_vector)

#     # 4. Construct Response
#     return PredictionResponse(
#         has_sepsis=is_sepsis,
#         probability=round(prob, 4),
#         threshold_applied=settings.DECISION_THRESHOLD,
#         risk_level=risk,
#         metadata=AudioMetadata(
#             original_duration_seconds=round(orig_duration, 2),
#             target_sample_rate=settings.SAMPLE_RATE,
#             features_used="mfcc + centroid + pitch",
#             feature_dimension=len(feature_vector),
#             pitch_mean_hz=round(metrics["pitch_mean_hz"], 2)
#         )
#     )

# @app.post(f"{settings.API_V1_STR}/predict", response_model=PredictionResponse)
# async def predict_audio(file: UploadFile = File(...)):
#     valid_extensions = {".wav", ".mp3", ".ogg", ".flac", ".m4a"}
#     if not any(file.filename.lower().endswith(ext) for ext in valid_extensions):
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail=f"Unsupported format. Please upload: {', '.join(valid_extensions)}"
#         )

#     try:
#         audio_bytes = await file.read()
#         if not audio_bytes:
#             raise HTTPException(status_code=400, detail="Empty audio file.")
        
#         # Prevent blocking the main async event loop
#         result = await run_in_threadpool(_run_pipeline, audio_bytes)
#         return result
        
#     except Exception as e:
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=f"Inference failure: {str(e)}"
#         )

# @app.get("/health")
# async def health_check():
#     return {
#         "status": "healthy",
#         "model_ready": model_service.model is not None
#     }






from contextlib import asynccontextmanager
from fastapi import FastAPI, File, UploadFile, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from starlette.concurrency import run_in_threadpool
import numpy as np

from app.config import settings
from app.schemas import MultiPredictionResponse, PipelineResult
from app.services.audio_processor import AudioProcessor
from app.services.model_service import model_service

@asynccontextmanager
async def lifespan(app: FastAPI):
    model_service.load_artifacts()
    yield

app = FastAPI(title=settings.PROJECT_NAME, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

audio_processor = AudioProcessor()

def _run_all_pipelines(file_bytes: bytes) -> MultiPredictionResponse:
    # 1. Condition signal
    audio_signal, orig_duration = audio_processor.load_and_preprocess(file_bytes)
    
    # 2. Extract base features once
    spectrogram = audio_processor.extract_mel_spectrogram(audio_signal)
    feature_dict, metrics = audio_processor.extract_all_features(audio_signal)

    # 3. Iterate through all 5 loaded models
    pipeline_results = []
    for pipeline in settings.AVAILABLE_PIPELINES:
        # Dynamically build the 1D vector for this specific pipeline
        active_keys = pipeline.split("_")
        selected_features = np.concatenate([feature_dict[k] for k in active_keys]).astype(np.float32)
        
        # Inference
        is_sepsis, prob, risk = model_service.predict(spectrogram, selected_features, pipeline)
        
        pipeline_results.append(
            PipelineResult(
                pipeline_name=pipeline.replace("_", " + ").upper(),
                features_used=", ".join(active_keys).upper(),
                feature_dimension=len(selected_features),
                has_sepsis=is_sepsis,
                probability=round(prob, 4),
                risk_level=risk
            )
        )

    # 4. Return combined payload
    return MultiPredictionResponse(
        original_duration_seconds=round(orig_duration, 2),
        target_sample_rate=settings.SAMPLE_RATE,
        pitch_mean_hz=round(metrics["pitch_mean_hz"], 2),
        threshold_applied=settings.DECISION_THRESHOLD,
        results=pipeline_results
    )

@app.post(f"{settings.API_V1_STR}/predict", response_model=MultiPredictionResponse)
async def predict_audio(file: UploadFile = File(...)):
    valid_extensions = {".wav", ".mp3", ".ogg", ".flac", ".m4a"}
    if not any(file.filename.lower().endswith(ext) for ext in valid_extensions):
        raise HTTPException(status_code=400, detail="Unsupported audio format.")

    try:
        audio_bytes = await file.read()
        if not audio_bytes:
            raise HTTPException(status_code=400, detail="Empty audio file.")
        
        result = await run_in_threadpool(_run_all_pipelines, audio_bytes)
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference failure: {str(e)}")

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "models_loaded": list(model_service.models.keys())
    }
