# app/config.py 
from pathlib import Path
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Neonatal Sepsis Detection API"
    API_V1_STR: str = "/api/v1"
    
    # Audio Specs
    SAMPLE_RATE: int = 16000
    TARGET_LENGTH: int = 16000 
    N_MELS: int = 128
    SPEC_IMAGE_SIZE: int = 128
    N_MFCC: int = 16
    PITCH_FMIN: float = 50.0
    PITCH_FMAX: float = 1000.0
    
    # Paths
    BASE_DIR: Path = Path(__file__).resolve().parent.parent
    ARTIFACTS_DIR: Path = BASE_DIR / "artifacts"
    
    # Registered Pipelines
    AVAILABLE_PIPELINES: List[str] = [
        "mfcc_centroid_pitch",
        "mfcc_rms_pitch",
        "mfcc_pitch",
        "mfcc_centroid_rms_zcr",
        "mfcc_rms_zcr"
    ]
    
    # Clinical Decision Boundary
    DECISION_THRESHOLD: float = 0.40

settings = Settings()
