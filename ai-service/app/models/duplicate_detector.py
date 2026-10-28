"""
Duplicate Complaint Detection Engine
Uses TF-IDF vectorization and Cosine Similarity to find similar or duplicate
civic complaint submissions based on textual content, category, and area.
"""

import os
import logging
from typing import Dict, List, Any, Optional

import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from .classifier import clean_text

logger = logging.getLogger("civic-ai.duplicates")

# Initial seeded complaints from Gwalior municipal database
DEFAULT_CORPUS: List[Dict[str, Any]] = [
    {
        "id": "CMP-1024",
        "text": "Large pothole on main road near Thatipur Crossing causing frequent two wheeler skids and accidents",
        "category": "Road Damage",
        "area": "Thatipur"
    },
    {
        "id": "CMP-1025",
        "text": "Overflowing community garbage container in Morar Bazar spreading foul smell and flies",
        "category": "Garbage",
        "area": "Morar"
    },
    {
        "id": "CMP-1026",
        "text": "Broken streetlights along main avenue Lashkar Pole 34 dark street safety hazard",
        "category": "Streetlight",
        "area": "Lashkar"
    },
    {
        "id": "CMP-1028",
        "text": "Blocked storm drainage causing water logging on residential road Thatipur",
        "category": "Drainage",
        "area": "Thatipur"
    },
    {
        "id": "CMP-1031",
        "text": "Deep potholes and broken asphalt on Thatipur Crossing causing heavy traffic jam",
        "category": "Road Damage",
        "area": "Thatipur"
    },
    {
        "id": "CMP-1019",
        "text": "Road asphalt cracked and worn out after monsoon rains near Main Market",
        "category": "Road Damage",
        "area": "Main Market"
    },
    {
        "id": "CMP-1035",
        "text": "Municipal drinking water pipeline leakage wasting clean water on Railway Road",
        "category": "Water",
        "area": "Railway Road"
    },
    {
        "id": "CMP-1040",
        "text": "Traffic light signal malfunctioning at Phool Bagh intersection showing red light permanently",
        "category": "Traffic",
        "area": "Phool Bagh"
    },
    {
        "id": "CMP-1042",
        "text": "Open burning of garbage and plastic waste in vacant plot City Center creating smog",
        "category": "Environment",
        "area": "City Center"
    },
    {
        "id": "CMP-1045",
        "text": "Open manhole cover missing on Hazira main street very dangerous for school children",
        "category": "Drainage",
        "area": "Hazira"
    }
]


class DuplicateDetector:
    """
    Detects potential duplicate complaints using TF-IDF and Cosine Similarity.
    """

    def __init__(self, corpus_file: Optional[str] = None):
        self.corpus_file = corpus_file
        self.corpus: List[Dict[str, Any]] = []
        self.vectorizer: Optional[TfidfVectorizer] = None
        self.tfidf_matrix = None
        self._initialize_corpus()

    def _initialize_corpus(self):
        """
        Load corpus from disk if exists, otherwise initialize with default seeds.
        """
        loaded = False
        if self.corpus_file and os.path.exists(self.corpus_file):
            loaded = self.load(self.corpus_file)

        if not loaded:
            self.corpus = [dict(c) for c in DEFAULT_CORPUS]
            self._rebuild_index()

    def _rebuild_index(self):
        """
        Recompute TF-IDF matrix for all indexed complaints.
        """
        if not self.corpus:
            self.vectorizer = None
            self.tfidf_matrix = None
            return

        texts = [clean_text(c["text"]) for c in self.corpus]
        self.vectorizer = TfidfVectorizer(
            ngram_range=(1, 2),
            stop_words="english",
            sublinear_tf=True
        )
        self.tfidf_matrix = self.vectorizer.fit_transform(texts)

    def add_complaint(
        self,
        complaint_id: str,
        text: str,
        category: Optional[str] = None,
        area: Optional[str] = None
    ):
        """
        Add a complaint to the duplicate detection index.
        """
        if not complaint_id or not text:
            return

        # Check if complaint already indexed
        for c in self.corpus:
            if c["id"] == complaint_id:
                c["text"] = text
                c["category"] = category
                c["area"] = area
                self._rebuild_index()
                return

        self.corpus.append({
            "id": complaint_id,
            "text": text,
            "category": category,
            "area": area
        })
        self._rebuild_index()

        # Save if corpus_file set
        if self.corpus_file:
            self.save(self.corpus_file)

    def find_similar(
        self,
        text: str,
        category: Optional[str] = None,
        area: Optional[str] = None,
        threshold: float = 0.60,
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Find complaints similar to the input text.
        Applies area and category boosts to rank closer matches higher.
        """
        if not self.corpus or self.vectorizer is None or self.tfidf_matrix is None:
            return []

        cleaned = clean_text(text)
        if not cleaned:
            return []

        query_vec = self.vectorizer.transform([cleaned])
        sim_scores = cosine_similarity(query_vec, self.tfidf_matrix)[0]

        results = []
        for idx, base_score in enumerate(sim_scores):
            score = float(base_score)
            item = self.corpus[idx]

            # Boost score if area matches
            if area and item.get("area") and area.lower() == item["area"].lower():
                score = min(1.0, score + 0.10)

            # Boost score if category matches
            if category and item.get("category") and category.lower() == item["category"].lower():
                score = min(1.0, score + 0.05)

            score = round(score, 4)
            if score >= threshold:
                preview = item["text"][:120] + "..." if len(item["text"]) > 120 else item["text"]
                results.append({
                    "complaint_id": item["id"],
                    "similarity_score": score,
                    "text_preview": preview,
                    "category": item.get("category"),
                    "area": item.get("area")
                })

        # Sort descending by similarity score
        results.sort(key=lambda x: x["similarity_score"], reverse=True)
        return results[:top_k]

    def save(self, path: Optional[str] = None) -> str:
        """
        Serialize corpus to disk.
        """
        target_path = path or self.corpus_file
        if not target_path:
            return ""

        os.makedirs(os.path.dirname(os.path.abspath(target_path)), exist_ok=True)
        joblib.dump(self.corpus, target_path)
        logger.info("Saved duplicate corpus (%d items) to %s", len(self.corpus), target_path)
        return target_path

    def load(self, path: Optional[str] = None) -> bool:
        """
        Load corpus from disk.
        """
        target_path = path or self.corpus_file
        if not target_path or not os.path.exists(target_path):
            return False

        try:
            self.corpus = joblib.load(target_path)
            self._rebuild_index()
            logger.info("Loaded duplicate corpus (%d items) from %s", len(self.corpus), target_path)
            return True
        except Exception as exc:
            logger.error("Failed to load duplicate corpus from %s: %s", target_path, exc)
            return False
