"""
Standalone Model Training Script
Trains the ComplaintClassifier on the civic dataset, evaluates classification
performance using stratified train/test split, and serializes the trained model.
"""

import os
import sys
from pathlib import Path

# Add project root to sys.path so app modules can be imported
BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))

from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score

from app.models.classifier import (
    ComplaintClassifier,
    BUILTIN_TRAINING_DATA,
    CATEGORIES,
    clean_text
)
from app.models.priority_analyzer import PriorityAnalyzer
from app.models.duplicate_detector import DuplicateDetector
from app.config import settings


def run_training():
    print("=" * 70)
    print(" Smart Civic Complaint System — AI Model Training & Evaluation")
    print("=" * 70)

    texts = [item[0] for item in BUILTIN_TRAINING_DATA]
    labels = [item[1] for item in BUILTIN_TRAINING_DATA]

    print(f"\n[*] Total civic complaint dataset size: {len(texts)} samples")
    print(f"[*] Target categories ({len(CATEGORIES)}):")
    for cat in CATEGORIES:
        count = labels.count(cat)
        print(f"    - {cat:<15}: {count} samples")

    # 1. Stratified Train / Test Split for accurate validation
    print("\n[*] Splitting dataset (80% train, 20% test, stratified)...")
    X_train, X_test, y_train, y_test = train_test_split(
        texts,
        labels,
        test_size=0.20,
        random_state=42,
        stratify=labels
    )

    print(f"    - Training set size : {len(X_train)}")
    print(f"    - Testing set size  : {len(X_test)}")

    # 2. Train Evaluation Classifier
    print("\n[*] Training TF-IDF + Logistic Regression pipeline on training set...")
    eval_classifier = ComplaintClassifier()
    eval_classifier.train(texts=X_train, labels=y_train)

    # 3. Evaluate Predictions
    y_pred = [eval_classifier.predict(t)["category"] for t in X_test]
    acc = accuracy_score(y_test, y_pred)
    print(f"\n[+] Validation Accuracy: {acc * 100:.2f}%\n")
    print("Classification Report:")
    print("-" * 70)
    print(classification_report(y_test, y_pred, zero_division=0))
    print("-" * 70)

    # 4. Train Final Model on 100% of the dataset
    print("\n[*] Retraining final model on full dataset (100% data)...")
    final_classifier = ComplaintClassifier(model_file=settings.CLASSIFIER_MODEL_FILE)
    final_classifier.train(texts=texts, labels=labels)

    # 5. Serialize to disk
    os.makedirs(settings.MODEL_PATH, exist_ok=True)
    saved_path = final_classifier.save(settings.CLASSIFIER_MODEL_FILE)
    print(f"[+] Model saved successfully to: {saved_path}")

    # 6. Initialize & Save Duplicate Detector Corpus
    print("\n[*] Initializing Duplicate Detector default corpus...")
    detector = DuplicateDetector(corpus_file=settings.DUPLICATE_CORPUS_FILE)
    detector.save(settings.DUPLICATE_CORPUS_FILE)
    print(f"[+] Duplicate corpus saved to: {settings.DUPLICATE_CORPUS_FILE}")

    # 7. Test sample real-world scenarios
    print("\n[*] Running Verification Inferences on Realistic Samples:")
    print("=" * 70)
    priority_analyzer = PriorityAnalyzer()

    test_queries = [
        "Major water pipeline burst on main road causing severe flooding and wasting thousands of liters",
        "Live high voltage electrical cable broken and sparking near Thatipur primary school playground",
        "Deep pothole near railway station causing two-wheelers to fall during night",
        "Illegal tree cutting and loud noise in public park",
        "Request for minor park bench repaint in colony garden"
    ]

    for query in test_queries:
        pred = final_classifier.predict(query)
        prio = priority_analyzer.analyze(query)
        dups = detector.find_similar(query, category=pred["category"], threshold=0.5)

        print(f"\nText: \"{query}\"")
        print(f"  -> Predicted Category: {pred['category']} (confidence: {pred['confidence']:.2%})")
        print(f"  -> Priority: {prio['priority']} | Severity: {prio['severity']} | Urgency Score: {prio['urgency_score']}")
        print(f"  -> Keywords Detected: {prio['keywords_found']}")
        if dups:
            print(f"  -> Top Similar Complaint: [{dups[0]['complaint_id']}] {dups[0]['text_preview']} (score: {dups[0]['similarity_score']})")
        else:
            print("  -> No duplicates found above threshold.")

    print("\n" + "=" * 70)
    print(" Training and Verification Complete! AI Service is ready for production.")
    print("=" * 70)


if __name__ == "__main__":
    run_training()
