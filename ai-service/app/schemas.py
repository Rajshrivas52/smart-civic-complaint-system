"""
Pydantic Schemas for AI Service Request & Response Validation
"""

from typing import List, Optional, Dict
from pydantic import BaseModel, Field, ConfigDict


# ==========================================
# Health Check Schema
# ==========================================
class HealthResponse(BaseModel):
    model_config = ConfigDict(protected_namespaces=())

    status: str = Field("healthy", description="Service status indicator")
    service: str = Field(..., description="Service name")
    version: str = Field(..., description="Service version")
    model_loaded: bool = Field(..., description="Whether the classification model is loaded")
    training_samples: int = Field(0, description="Total training samples registered")


# ==========================================
# Classification Schemas
# ==========================================
class ClassificationRequest(BaseModel):
    text: str = Field(
        ...,
        min_length=3,
        description="Text description of the civic complaint",
        example="Deep pothole in the middle of Thatipur main road causing frequent two-wheeler accidents"
    )
    complaint_id: Optional[str] = Field(
        None,
        description="Optional identifier of the complaint",
        example="CMP-1024"
    )


class ClassificationResponse(BaseModel):
    category: str = Field(..., description="Predicted category")
    confidence: float = Field(..., description="Prediction confidence score (0.0 to 1.0)")
    priority: str = Field(..., description="Predicted priority: Low, Medium, High")
    severity: str = Field(..., description="Predicted severity: Low, Medium, High, Critical")
    urgency_score: float = Field(..., description="Computed urgency score (0.0 to 1.0)")
    all_categories: Dict[str, float] = Field(
        ...,
        description="Probability distribution across all categories"
    )
    keywords_found: List[str] = Field(
        default_factory=list,
        description="Urgency/hazard keywords identified in the complaint"
    )
    complaint_id: Optional[str] = Field(None, description="Complaint identifier if provided")


# ==========================================
# Priority Analysis Schemas
# ==========================================
class PriorityRequest(BaseModel):
    text: str = Field(
        ...,
        min_length=3,
        description="Text description of the complaint to analyze for priority",
        example="Live electrical wire broken and touching stagnant rainwater near primary school gate"
    )


class PriorityResponse(BaseModel):
    priority: str = Field(..., description="Computed priority: Low, Medium, High")
    severity: str = Field(..., description="Computed severity: Low, Medium, High, Critical")
    urgency_score: float = Field(..., description="Computed urgency score (0.0 to 1.0)")
    keywords_found: List[str] = Field(
        default_factory=list,
        description="Urgency/hazard keywords detected in the text"
    )


# ==========================================
# Duplicate Detection Schemas
# ==========================================
class DuplicateMatch(BaseModel):
    complaint_id: str = Field(..., description="ID of the matching complaint")
    similarity_score: float = Field(..., description="Cosine similarity score (0.0 to 1.0)")
    text_preview: str = Field(..., description="Preview of the matching complaint text")
    category: Optional[str] = Field(None, description="Category of the matching complaint")
    area: Optional[str] = Field(None, description="Area / locality of the matching complaint")


class DuplicateRequest(BaseModel):
    text: str = Field(
        ...,
        min_length=3,
        description="Complaint text to evaluate for potential duplicates",
        example="Massive garbage dump overflowing near Morar market square"
    )
    category: Optional[str] = Field(
        None,
        description="Complaint category filter or weight",
        example="Garbage"
    )
    area: Optional[str] = Field(
        None,
        description="Locality / Area filter or weight",
        example="Morar"
    )
    threshold: Optional[float] = Field(
        0.6,
        ge=0.0,
        le=1.0,
        description="Similarity cutoff threshold"
    )
    top_k: Optional[int] = Field(
        5,
        ge=1,
        le=50,
        description="Maximum duplicate candidates to return"
    )


class DuplicateResponse(BaseModel):
    duplicates: List[DuplicateMatch] = Field(
        default_factory=list,
        description="List of detected similar/duplicate complaints"
    )
    is_likely_duplicate: bool = Field(
        ...,
        description="True if any complaint exceeds the similarity threshold"
    )
    highest_similarity: float = Field(
        0.0,
        description="Highest similarity score among indexed complaints"
    )


class AddComplaintRequest(BaseModel):
    id: str = Field(..., description="Unique complaint ID")
    text: str = Field(..., min_length=3, description="Full complaint text")
    category: Optional[str] = Field(None, description="Complaint category")
    area: Optional[str] = Field(None, description="Complaint area / locality")


# ==========================================
# Model Metadata Schema
# ==========================================
class ModelInfoResponse(BaseModel):
    model_config = ConfigDict(protected_namespaces=())

    model_name: str = Field(..., description="Name of the model architecture")
    categories: List[str] = Field(..., description="List of recognized complaint categories")
    priorities: List[str] = Field(..., description="List of supported priority levels")
    severities: List[str] = Field(..., description="List of supported severity levels")
    training_samples: int = Field(..., description="Number of samples in training dataset")
    pipeline: str = Field(..., description="Pipeline description")
    is_trained: bool = Field(..., description="Whether the model is currently trained and ready")
    model_path: str = Field(..., description="Model storage location")
