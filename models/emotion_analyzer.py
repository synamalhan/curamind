"""
Emotion Analysis Module for CuraMind
Detects emotions from text input using transformer models or rule-based fallback
"""

import re
from typing import Dict, List, Optional
import logging

try:
    from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
    TRANSFORMERS_AVAILABLE = True
except ImportError:
    TRANSFORMERS_AVAILABLE = False
    logging.warning("Transformers not available. Using rule-based emotion detection.")

class EmotionAnalyzer:
    def __init__(self, debug: bool = False):
        self.debug = debug
        self.emotion_classifier = None

        if TRANSFORMERS_AVAILABLE:
            try:
                model_name = "j-hartmann/emotion-english-distilroberta-base"
                self.emotion_classifier = pipeline(
                    "text-classification",
                    model=model_name,
                    tokenizer=model_name,
                    return_all_scores=True
                )
                if self.debug:
                    logging.info("Loaded transformer model for emotion classification.")
            except Exception as e:
                logging.warning(f"Could not load transformer model: {e}")
                self.emotion_classifier = None


        # Rule-based emotion keywords for fallback
        self.emotion_keywords = {
            "happy": [
                "happy", "joy", "joyful", "excited", "great", "wonderful", "amazing", 
                "fantastic", "excellent", "good", "glad", "pleased", "delighted",
                "cheerful", "elated", "thrilled", "content", "satisfied", "grateful",
                "blessed", "lucky", "awesome", "brilliant", "perfect", "love"
            ],
            "sad": [
                "sad", "depressed", "down", "unhappy", "miserable", "awful", "terrible",
                "bad", "upset", "crying", "tears", "hurt", "pain", "lonely", "empty",
                "hopeless", "devastated", "heartbroken", "disappointed", "grief",
                "sorrow", "melancholy", "blue", "gloomy", "despair", "died", "death",
            ],
            "angry": [
                "angry", "mad", "furious", "annoyed", "frustrated", "irritated", "rage",
                "hate", "bitter", "resentful", "outraged", "livid", "enraged", "pissed",
                "aggravated", "hostile", "violent", "aggressive", "fuming", "seething",
                "indignant", "irate", "wrathful"
            ],
            "anxious": [
                "anxious", "worried", "nervous", "scared", "afraid", "panic", "stress",
                "stressed", "overwhelmed", "tense", "uneasy", "restless", "agitated",
                "apprehensive", "fearful", "terrified", "paranoid", "insecure",
                "uncertain", "doubtful", "concerned", "troubled", "distressed"
            ],
            "calm": [
                "calm", "peaceful", "relaxed", "serene", "content", "tranquil",
                "comfortable", "settled", "balanced", "centered", "composed",
                "collected", "cool", "steady", "stable", "quiet", "still",
                "harmonious", "zen", "mindful", "meditative"
            ]
        }
        
        # Emotion intensity modifiers
        self.intensity_modifiers = {
            "very": 1.3,
            "extremely": 1.5,
            "really": 1.2,
            "quite": 1.1,
            "somewhat": 0.8,
            "a bit": 0.7,
            "slightly": 0.6,
            "not": -5.0,
            "never": -1.0,
            "barely": 0.3,
            "don't": -5.0,
        }

        self.label_mapping = {
            "joy": "happy",
            "happiness": "happy",
            "love": "happy",
            "sadness": "sad",
            "anger": "angry",
            "fear": "anxious",
            "surprise": "neutral",
            "neutral": "neutral",
            "disgust": "angry"
        }

        self.nonverbal_cues = {
            "[sigh]": "sad",
            "[crying]": "sad",
            "[laugh]": "happy",
            "[chuckle]": "happy",
            "[gasp]": "anxious"
        }

    def analyze_text(self, text: str) -> Dict[str, any]:
        if not text or not text.strip():
            return {"emotion": "neutral", "confidence": 0.5}

        text = text.strip()

        # Transformer model
        if self.emotion_classifier:
            try:
                return self._analyze_with_transformer(text)
            except Exception as e:
                logging.warning(f"Transformer model failed: {e}")

        return self._analyze_with_rules(text)

    def _analyze_with_transformer(self, text: str) -> Dict[str, any]:
        results = self.emotion_classifier(text)
        if results and isinstance(results[0], list):
            top_result = max(results[0], key=lambda x: x["score"])
            emotion = self.label_mapping.get(top_result["label"].lower(), "neutral")
            confidence = float(top_result["score"])
            if self.debug:
                logging.info(f"[Transformer] {emotion} ({confidence:.2f})")
            return {"emotion": emotion, "confidence": confidence}
        return {"emotion": "neutral", "confidence": 0.5}

    def _analyze_with_rules(self, text: str) -> Dict[str, any]:
        text_lower = text.lower()
        
        for cue, emotion in self.nonverbal_cues.items():
            if cue in text_lower:
                return {"emotion": emotion, "confidence": 0.9}

        emotion_scores = {e: 0.0 for e in self.emotion_keywords}
        words = re.findall(r'\b\w+\b', text_lower)

        for emotion, keywords in self.emotion_keywords.items():
            for keyword in keywords:
                if keyword in text_lower:
                    score = 1.0
                    for mod, weight in self.intensity_modifiers.items():
                        if mod in text_lower and self._words_are_close(words, mod, keyword):
                            score *= weight
                    emotion_scores[emotion] += score

        if max(emotion_scores.values()) == 0:
            return {"emotion": "neutral", "confidence": 0.5}

        dominant = max(emotion_scores, key=emotion_scores.get)
        confidence = min(emotion_scores[dominant] / (sum(emotion_scores.values()) + 1e-6), 1.0)
        if emotion_scores[dominant] > 1.5:
            confidence = min(confidence * 1.2, 1.0)

        if self.debug:
            logging.info(f"[Rule-based] {dominant} ({confidence:.2f})")

        return {"emotion": dominant, "confidence": confidence}

    def _words_are_close(self, words: List[str], w1: str, w2: str, dist: int = 3) -> bool:
        pos1 = [i for i, w in enumerate(words) if w == w1]
        pos2 = [i for i, w in enumerate(words) if w == w2]
        return any(abs(i - j) <= dist for i in pos1 for j in pos2)

    def analyze_voice_transcript(self, transcript: str) -> Dict[str, any]:
        return self.analyze_text(transcript)

    def get_emotion_suggestions(self, emotion: str) -> List[str]:
        suggestions = {
            "happy": ["Keep up the positive energy!", "Share your joy with someone today!"],
            "sad": ["It's okay to feel sad.", "Take a deep breath, try journaling."],
            "angry": ["Take a moment to breathe.", "Try writing your thoughts down."],
            "anxious": ["Ground yourself with your senses.", "Take a short walk or meditate."],
            "calm": ["Enjoy the peace.", "Consider a moment of reflection."],
            "neutral": ["Pause and reflect how you're feeling.", "Maybe try journaling."]
        }
        return suggestions.get(emotion, suggestions["neutral"])
