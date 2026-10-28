"""
Application Configuration Module
Loads settings from environment variables and provides centralized configuration.
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Base directory for the ai-service
BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables from .env if present
env_path = BASE_DIR / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path)
else:
    load_dotenv()


class Settings:
    """Central configuration for AI Service."""

    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    
    # Model storage path
    MODEL_PATH: str = os.getenv(
        "MODEL_PATH",
        str(BASE_DIR / "models")
    )
    
    # Path for specific serialized model files
    CLASSIFIER_MODEL_FILE: str = os.path.join(MODEL_PATH, "complaint_classifier.joblib")
    DUPLICATE_CORPUS_FILE: str = os.path.join(MODEL_PATH, "duplicate_corpus.joblib")

    # Integration endpoints
    BACKEND_URL: str = os.getenv("BACKEND_URL", "http://localhost:5000/api")
    DEBUG: bool = os.getenv("DEBUG", "true").lower() in ("true", "1", "yes")

    # Service Metadata
    APP_NAME: str = "Smart Civic Complaint AI Service"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = (
        "AI-powered microservice for municipal complaint categorization, "
        "priority & severity assessment, and duplicate complaint detection."
    )


settings = Settings()

# Ensure model directory exists
os.makedirs(settings.MODEL_PATH, exist_ok=True)
