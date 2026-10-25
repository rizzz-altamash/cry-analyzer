# app/schemas.py 
from pydantic import BaseModel, Field
from typing import List

class PipelineResult(BaseModel):
    pipeline_name: str
    features_used: str
    feature_dimension: int
    has_sepsis: bool
    probability: float
    risk_level: str

class MultiPredictionResponse(BaseModel):
    original_duration_seconds: float
    target_sample_rate: int
    pitch_mean_hz: float
    threshold_applied: float
    results: List[PipelineResult]
