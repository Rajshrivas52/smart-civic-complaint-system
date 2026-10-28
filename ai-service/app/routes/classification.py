"""
API Endpoints for Complaint Classification, Priority Analysis, and Duplicate Detection
"""

import logging
from typing import Dict, Any, List
from fastapi import APIRouter, HTTPException, Request, Depends, status

from ..schemas import (
    ClassificationRequest,
    ClassificationResponse,
    PriorityRequest,
    PriorityResponse,
    DuplicateRequest,
    DuplicateResponse,
    DuplicateMatch,
    AddComplaintRequest,
    ModelInfoResponse,
)
from ..models.classifier import ComplaintClassifier, CATEGORIES
from ..models.priority_analyzer import PriorityAnalyzer, PRIORITIES, SEVERITIES
from ..models.duplicate_detector import DuplicateDetector
from ..config import settings

logger = logging.getLogger("civic-ai.routes")

router = APIRouter(tags=["AI Civic Services"])

# Module-level singletons (used if app.state not set)
_classifier: ComplaintClassifier = ComplaintClassifier(model_file=settings.CLASSIFIER_MODEL_FILE)
_priority_analyzer: PriorityAnalyzer = PriorityAnalyzer()
_duplicate_detector: DuplicateDetector = DuplicateDetector(corpus_file=settings.DUPLICATE_CORPUS_FILE)


def get_classifier(request: Request) -> ComplaintClassifier:
    """Dependency provider for ComplaintClassifier."""
    if hasattr(request.app.state, "classifier") and request.app.state.classifier is not None:
        return request.app.state.classifier
    return _classifier


def get_priority_analyzer(request: Request) -> PriorityAnalyzer:
    """Dependency provider for PriorityAnalyzer."""
    if hasattr(request.app.state, "priority_analyzer") and request.app.state.priority_analyzer is not None:
        return request.app.state.priority_analyzer
    return _priority_analyzer


def get_duplicate_detector(request: Request) -> DuplicateDetector:
    """Dependency provider for DuplicateDetector."""
    if hasattr(request.app.state, "duplicate_detector") and request.app.state.duplicate_detector is not None:
        return request.app.state.duplicate_detector
    return _duplicate_detector


@router.post(
    "/classify",
    response_model=ClassificationResponse,
    summary="Classify Complaint Category and Urgency",
    description="Analyzes complaint text to predict civic category, priority level, severity, and urgency score."
)
async def classify_complaint(
    payload: ClassificationRequest,
    classifier: ComplaintClassifier = Depends(get_classifier),
    analyzer: PriorityAnalyzer = Depends(get_priority_analyzer)
) -> ClassificationResponse:
    """
    Auto-classify a complaint and determine its urgency metrics.
    """
    try:
        # Predict Category & Probabilities
        prediction = classifier.predict(payload.text)

        # Compute Urgency, Priority, Severity & Keywords
        priority_info = analyzer.analyze(payload.text)

        return ClassificationResponse(
            category=prediction["category"],
            confidence=prediction["confidence"],
            priority=priority_info["priority"],
            severity=priority_info["severity"],
            urgency_score=priority_info["urgency_score"],
            all_categories=prediction["all_probabilities"],
            keywords_found=priority_info["keywords_found"],
            complaint_id=payload.complaint_id
        )
    except Exception as exc:
        logger.error("Error classifying complaint: %s", exc, exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Classification error: {str(exc)}"
        )


@router.post(
    "/analyze-priority",
    response_model=PriorityResponse,
    summary="Analyze Complaint Priority and Severity",
    description="Evaluates urgency keywords, safety risks, and location factors to compute priority and severity."
)
async def analyze_priority(
    payload: PriorityRequest,
    analyzer: PriorityAnalyzer = Depends(get_priority_analyzer)
) -> PriorityResponse:
    """
    Evaluate urgency and severity metrics for complaint text.
    """
    try:
        result = analyzer.analyze(payload.text)
        return PriorityResponse(
            priority=result["priority"],
            severity=result["severity"],
            urgency_score=result["urgency_score"],
            keywords_found=result["keywords_found"]
        )
    except Exception as exc:
        logger.error("Error analyzing priority: %s", exc, exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Priority analysis error: {str(exc)}"
        )


@router.post(
    "/detect-duplicates",
    response_model=DuplicateResponse,
    summary="Detect Potential Duplicate Complaints",
    description="Finds existing complaints in the corpus with high textual and contextual similarity."
)
async def detect_duplicates(
    payload: DuplicateRequest,
    detector: DuplicateDetector = Depends(get_duplicate_detector)
) -> DuplicateResponse:
    """
    Check if a submitted complaint is a duplicate of an existing ticket.
    """
    try:
        similar = detector.find_similar(
            text=payload.text,
            category=payload.category,
            area=payload.area,
            threshold=payload.threshold or 0.60,
            top_k=payload.top_k or 5
        )

        matches = [
            DuplicateMatch(
                complaint_id=item["complaint_id"],
                similarity_score=item["similarity_score"],
                text_preview=item["text_preview"],
                category=item.get("category"),
                area=item.get("area")
            )
            for item in similar
        ]

        highest = matches[0].similarity_score if matches else 0.0
        is_dup = len(matches) > 0 and highest >= (payload.threshold or 0.60)

        return DuplicateResponse(
            duplicates=matches,
            is_likely_duplicate=is_dup,
            highest_similarity=highest
        )
    except Exception as exc:
        logger.error("Error detecting duplicates: %s", exc, exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Duplicate detection error: {str(exc)}"
        )


@router.post(
    "/index-complaint",
    summary="Index New Complaint into Duplicate Corpus",
    description="Adds a newly registered complaint to the vector corpus for future similarity checks."
)
async def index_complaint(
    payload: AddComplaintRequest,
    detector: DuplicateDetector = Depends(get_duplicate_detector)
) -> Dict[str, Any]:
    """
    Add a complaint to the duplicate detector index.
    """
    try:
        detector.add_complaint(
            complaint_id=payload.id,
            text=payload.text,
            category=payload.category,
            area=payload.area
        )
        return {
            "success": True,
            "message": f"Complaint {payload.id} successfully indexed",
            "total_indexed": len(detector.corpus)
        }
    except Exception as exc:
        logger.error("Error indexing complaint: %s", exc, exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to index complaint: {str(exc)}"
        )


@router.get(
    "/model-info",
    response_model=ModelInfoResponse,
    summary="Retrieve AI Model Metadata",
    description="Returns metadata about model architecture, supported categories, priorities, and sample sizes."
)
async def get_model_info(
    classifier: ComplaintClassifier = Depends(get_classifier)
) -> ModelInfoResponse:
    """
    Retrieve model status, training statistics, and supported taxonomy.
    """
    return ModelInfoResponse(
        model_name="TF-IDF + LogisticRegression Multi-Class Classifier",
        categories=CATEGORIES,
        priorities=PRIORITIES,
        severities=SEVERITIES,
        training_samples=classifier.training_sample_count,
        pipeline="TfidfVectorizer(ngram=(1,2), sublinear_tf=True) -> LogisticRegression(C=1.5)",
        is_trained=classifier.is_trained,
        model_path=settings.CLASSIFIER_MODEL_FILE
    )
