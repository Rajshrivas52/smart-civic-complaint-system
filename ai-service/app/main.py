"""
FastAPI Main Application Entry Point
Initializes CORS, lifecycle management, ML model loading, and API routing.
"""

import os
import logging
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .config import settings
from .schemas import HealthResponse
from .routes.classification import router as classification_router
from .models.classifier import ComplaintClassifier
from .models.priority_analyzer import PriorityAnalyzer
from .models.duplicate_detector import DuplicateDetector

# Configure structured logging
logging.basicConfig(
    level=logging.DEBUG if settings.DEBUG else logging.INFO,
    format="%(asctime)s [%(levelname)s] [%(name)s]: %(message)s"
)
logger = logging.getLogger("civic-ai.main")


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    Application lifespan manager.
    Initializes and trains/loads ML models on startup and cleans up on shutdown.
    """
    logger.info("Initializing Smart Civic Complaint AI Microservice...")
    os.makedirs(settings.MODEL_PATH, exist_ok=True)

    # 1. Initialize Complaint Classifier
    classifier = ComplaintClassifier(model_file=settings.CLASSIFIER_MODEL_FILE)
    if os.path.exists(settings.CLASSIFIER_MODEL_FILE):
        logger.info("Existing model file detected. Loading from %s", settings.CLASSIFIER_MODEL_FILE)
        loaded = classifier.load(settings.CLASSIFIER_MODEL_FILE)
        if not loaded:
            logger.warning("Failed to load existing model. Training fresh model...")
            classifier.train()
            classifier.save(settings.CLASSIFIER_MODEL_FILE)
    else:
        logger.info("No serialized model found. Training initial model from built-in civic dataset...")
        classifier.train()
        classifier.save(settings.CLASSIFIER_MODEL_FILE)

    # 2. Initialize Priority Analyzer
    priority_analyzer = PriorityAnalyzer()

    # 3. Initialize Duplicate Detector
    duplicate_detector = DuplicateDetector(corpus_file=settings.DUPLICATE_CORPUS_FILE)

    # Attach instances to application state for dependency injection
    app.state.classifier = classifier
    app.state.priority_analyzer = priority_analyzer
    app.state.duplicate_detector = duplicate_detector

    logger.info(
        "AI Models initialized successfully! Ready to accept requests on port %d.",
        settings.PORT
    )

    yield

    logger.info("Shutting down Smart Civic Complaint AI Microservice...")


# Initialize FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    description=settings.DESCRIPTION,
    version=settings.VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Configure CORS for dev and frontend/backend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get(
    "/health",
    response_model=HealthResponse,
    tags=["System"],
    summary="Microservice Health Status"
)
async def health_check() -> HealthResponse:
    """
    Verify microservice status and model readiness.
    """
    classifier: ComplaintClassifier = getattr(app.state, "classifier", None)
    is_loaded = classifier is not None and classifier.is_trained
    samples = classifier.training_sample_count if classifier else 0

    return HealthResponse(
        status="healthy",
        service=settings.APP_NAME,
        version=settings.VERSION,
        model_loaded=is_loaded,
        training_samples=samples
    )


@app.get("/", tags=["System"])
async def root():
    """
    Root endpoint redirect / info.
    """
    return {
        "service": settings.APP_NAME,
        "version": settings.VERSION,
        "status": "online",
        "docs": "/docs",
        "health": "/health"
    }


# Mount classification routes at root (e.g. /classify) and with /api prefix (e.g. /api/classify)
app.include_router(classification_router)
app.include_router(classification_router, prefix="/api")
