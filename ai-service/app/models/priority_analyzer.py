"""
Priority and Urgency Analyzer Model
Evaluates civic complaint severity, urgency score, and priority level
using multi-tier keyword pattern matching and context weights.
"""

import re
from typing import Dict, List, Any, Set, Tuple

# Official Priority and Severity scales
PRIORITIES: List[str] = ["Low", "Medium", "High"]
SEVERITIES: List[str] = ["Low", "Medium", "High", "Critical"]

# Critical keywords that directly trigger High priority and potentially Critical severity
CRITICAL_INDICATORS: Dict[str, float] = {
    "live wire": 0.45,
    "electrical wire": 0.35,
    "electric wire": 0.35,
    "high voltage": 0.45,
    "open wire": 0.40,
    "broken cable": 0.35,
    "exposed wire": 0.40,
    "electric shock": 0.45,
    "current leakage": 0.40,
    "sparking": 0.40,
    "short circuit": 0.40,
    "fire hazard": 0.40,
    "fire": 0.35,
    "explosion": 0.45,
    "fatal": 0.45,
    "casualty": 0.45,
    "accident": 0.35,
    "accidents": 0.35,
    "collision": 0.30,
    "injured": 0.35,
    "injuries": 0.35,
    "injury": 0.35,
    "bleeding": 0.35,
    "death": 0.45,
    "deaths": 0.45,
    "open manhole": 0.45,
    "manhole cover missing": 0.45,
    "missing manhole": 0.45,
    "uncovered manhole": 0.45,
    "sinkhole": 0.45,
    "cave-in": 0.40,
    "cave in": 0.40,
    "caved in": 0.40,
    "collapse": 0.35,
    "collapsing": 0.35,
    "collapsed": 0.35,
    "bridge crack": 0.40,
    "submerged": 0.30,
    "drowning": 0.45,
    "flash flood": 0.35,
    "flooding": 0.30,
    "toxic fumes": 0.40,
    "toxic": 0.35,
    "poisonous": 0.40,
    "gas leak": 0.45,
    "epidemic": 0.35,
    "dengue outbreak": 0.35,
    "emergency": 0.35,
    "urgent": 0.30,
    "urgently": 0.30,
    "immediately": 0.25,
    "critical": 0.30,
    "life threatening": 0.45,
    "extreme hazard": 0.40,
    "dangerous": 0.25,
    "danger": 0.25,
}

# Vulnerable target / sensitive location multipliers
SENSITIVE_LOCATIONS: Dict[str, float] = {
    "school": 0.20,
    "kindergarten": 0.20,
    "children": 0.20,
    "kids": 0.15,
    "playground": 0.15,
    "college": 0.10,
    "hospital": 0.25,
    "clinic": 0.15,
    "ambulance": 0.25,
    "elderly": 0.15,
    "senior citizen": 0.15,
    "disabled": 0.15,
    "handicapped": 0.15,
    "patient": 0.20,
    "pedestrians falling": 0.20,
    "pedestrian": 0.10,
}

# Medium urgency indicators (inconvenience, civic breakdown, sanitation risks)
MEDIUM_INDICATORS: Dict[str, float] = {
    "overflowing": 0.15,
    "overflow": 0.15,
    "blocked": 0.15,
    "choked": 0.15,
    "stagnant": 0.15,
    "leaking": 0.15,
    "leakage": 0.15,
    "pipe burst": 0.20,
    "burst": 0.20,
    "pipeline burst": 0.25,
    "sewage": 0.15,
    "sewer backflow": 0.20,
    "gutter": 0.15,
    "nala": 0.15,
    "drain": 0.12,
    "pothole": 0.15,
    "potholes": 0.15,
    "crater": 0.15,
    "darkness": 0.15,
    "pitch dark": 0.20,
    "dark street": 0.18,
    "not working": 0.12,
    "fused": 0.12,
    "stray dog": 0.15,
    "stray dogs": 0.15,
    "dog bite": 0.25,
    "stray cattle": 0.15,
    "traffic jam": 0.15,
    "gridlock": 0.20,
    "water cut": 0.15,
    "no water": 0.20,
    "contaminated water": 0.25,
    "dirty water": 0.15,
    "foul smell": 0.12,
    "unbearable": 0.15,
    "rotting": 0.15,
    "garbage": 0.12,
    "kachra": 0.12,
    "mosquitoes": 0.15,
    "broken pole": 0.20,
    "malfunctioning": 0.12,
    "signal red light": 0.15,
    "unfilled trench": 0.20,
    "deep ditch": 0.18,
    "tree cutting": 0.15,
    "illegal cutting": 0.20,
    "pollution": 0.15,
    "loud noise": 0.15,
    "loudspeaker": 0.15,
    "smoke": 0.15,
    "waterlogging": 0.18,
    "water logging": 0.18,
}

# Low urgency indicators (cosmetic, routine, suggestions, queries)
LOW_INDICATORS: Dict[str, float] = {
    "suggestion": -0.15,
    "feedback": -0.15,
    "request": -0.10,
    "request for": -0.10,
    "inquiry": -0.20,
    "cosmetic": -0.20,
    "paint": -0.15,
    "painting": -0.15,
    "repaint": -0.15,
    "repainting": -0.15,
    "cleaning required": -0.05,
    "minor": -0.15,
    "beautification": -0.20,
    "information": -0.20,
    "garden bench": -0.15,
    "sign board": -0.10,
    "name plate": -0.15,
    "certificate delay": -0.10,
    "slow": -0.05,
    "routine": -0.15,
}


class PriorityAnalyzer:
    """
    Heuristic and rule-weighted priority / severity analyzer.
    """

    def __init__(self):
        self.critical_patterns = self._compile_patterns(CRITICAL_INDICATORS)
        self.location_patterns = self._compile_patterns(SENSITIVE_LOCATIONS)
        self.medium_patterns = self._compile_patterns(MEDIUM_INDICATORS)
        self.low_patterns = self._compile_patterns(LOW_INDICATORS)

    def _compile_patterns(self, indicator_dict: Dict[str, float]) -> List[Tuple[re.Pattern, str, float]]:
        """
        Pre-compile regex patterns for word boundary matching.
        """
        compiled = []
        for phrase, weight in indicator_dict.items():
            pattern = re.compile(rf"\b{re.escape(phrase)}\b", re.IGNORECASE)
            compiled.append((pattern, phrase, weight))
        return compiled

    def analyze(self, text: str) -> Dict[str, Any]:
        """
        Analyze text to compute priority, severity, urgency score, and detected keywords.
        """
        if not text or not text.strip():
            return {
                "priority": "Low",
                "severity": "Low",
                "urgency_score": 0.1,
                "keywords_found": []
            }

        text_lower = text.lower()
        score = 0.25  # baseline score for a reported civic complaint
        detected_keywords: Set[str] = set()

        has_critical_trigger = False
        has_severe_danger = False

        # 1. Match Critical Indicators
        for pattern, phrase, weight in self.critical_patterns:
            if pattern.search(text_lower):
                score += weight
                detected_keywords.add(phrase)
                has_critical_trigger = True
                if weight >= 0.40:
                    has_severe_danger = True

        # 2. Match Sensitive Location / Vulnerable Pop Indicators
        location_found = False
        for pattern, phrase, weight in self.location_patterns:
            if pattern.search(text_lower):
                score += weight
                detected_keywords.add(phrase)
                location_found = True

        # Multiplier effect: Danger near school/hospital/kids elevates hazard
        if has_critical_trigger and location_found:
            score += 0.20

        # 3. Match Medium Indicators
        for pattern, phrase, weight in self.medium_patterns:
            if pattern.search(text_lower):
                score += weight
                detected_keywords.add(phrase)

        # 4. Match Low Indicators
        for pattern, phrase, weight in self.low_patterns:
            if pattern.search(text_lower):
                score += weight
                detected_keywords.add(phrase)

        # Clamp score between 0.05 and 1.0
        normalized_score = max(0.05, min(1.0, round(score, 4)))

        # Determine Priority & Severity
        # Severity hierarchy: Low -> Medium -> High -> Critical
        # Priority hierarchy: Low -> Medium -> High

        if has_severe_danger or normalized_score >= 0.85:
            severity = "Critical"
            priority = "High"
        elif normalized_score >= 0.60 or has_critical_trigger:
            severity = "High"
            priority = "High"
        elif normalized_score >= 0.35:
            severity = "Medium"
            priority = "Medium"
        else:
            severity = "Low"
            priority = "Low"

        # Edge case guard: If critical trigger is present, priority must be High
        if has_critical_trigger and priority != "High":
            priority = "High"
            if severity == "Low":
                severity = "Medium"

        return {
            "priority": priority,
            "severity": severity,
            "urgency_score": normalized_score,
            "keywords_found": sorted(list(detected_keywords))
        }
