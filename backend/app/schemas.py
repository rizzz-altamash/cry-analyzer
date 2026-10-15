# # app/schemas.py 
# from pydantic import BaseModel, Field

# class AudioMetadata(BaseModel):
#     original_duration_seconds: float
#     target_sample_rate: int
#     features_used: str
#     feature_dimension: int
#     pitch_mean_hz: float

# class PredictionResponse(BaseModel):
#     has_sepsis: bool = Field(..., description="True if sepsis is detected, False otherwise")
#     probability: float = Field(..., ge=0.0, le=1.0, description="Raw prediction probability")
#     threshold_applied: float = Field(..., description="Decision boundary used")
#     risk_level: str = Field(..., description="Clinical risk interpretation")
#     metadata: AudioMetadata



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
