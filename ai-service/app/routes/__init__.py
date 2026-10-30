"""
AI Service API Route Blueprints
"""

from .classification import router as classification_router

__all__ = ["classification_router"]
