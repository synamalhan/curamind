"""
LLM Response Generation Module for CuraMind
Generates empathetic responses using local LLM (Ollama) or fallback responses
"""

import json
import logging
from typing import Dict, Optional
import requests

class CuraMindLLM:
    def __init__(self):
        self.ollama_url = "http://localhost:11434"
        self.model_name = "mistral"  # or "llama2"
        self.available = self._check_ollama_availability()
        
        # Fallback responses for when LLM is not available
        self.fallback_responses = {
            "en": {
                "happy": [
                    "I'm so glad to hear you're feeling happy! That's wonderful. What's bringing you joy today?",
                    "Your happiness is contagious! It's beautiful to see you in such a positive state.",
                    "That's fantastic! Happy moments are precious. I hope this feeling continues for you."
                ],
                "sad": [
                    "I'm sorry you're feeling sad. It's okay to feel this way - your emotions are valid. I'm here to listen.",
                    "Sadness can be really difficult to carry. You don't have to go through this alone.",
                    "Thank you for sharing how you're feeling. I'm here to support you through this."
                ],
                "anxious": [
                    "I understand you're feeling anxious. Anxiety can be overwhelming, but you're not alone.",
                    "Anxiety is tough, but you're showing strength by reaching out. Let's take this one step at a time.",
                    "Your feelings are completely valid. Would some grounding techniques help right now?"
                ],
                "angry": [
                    "I can sense your anger, and that's completely valid. Anger often tells us something important.",
                    "Anger can be intense and overwhelming. It's okay to feel this way. Let's work through it together.",
                    "I hear your frustration. Let's find healthy ways to process these feelings."
                ],
                "calm": [
                    "I'm glad you're feeling calm. This peaceful state is beautiful. How can we help you maintain this tranquility?",
                    "Calmness is such a gift. I'm happy you're experiencing this serenity.",
                    "Your calm energy is lovely. These moments of peace are precious."
                ],
                "neutral": [
                    "I'm here with you in this neutral space. Sometimes it's okay to just be.",
                    "Neutral feelings are completely valid too. What's on your mind right now?",
                    "It's perfectly okay to feel neutral. Is there anything you'd like to explore?"
                ]
            },
            "hi": {
                "happy": [
                    "मुझे खुशी है कि आप खुश महसूस कर रहे हैं! यह अद्भुत है। आज आपको क्या खुशी दे रहा है?",
                    "आपकी खुशी संक्रामक है! आपको इतनी सकारात्मक अवस्था में देखना सुंदर है।",
                    "यह शानदार है! खुशी के पल कीमती हैं। मुझे उम्मीद है कि यह भावना आपके लिए जारी रहेगी।"
                ],
                "sad": [
                    "मुझे खुशी है कि आप दुखी महसूस कर रहे हैं। इस तरह महसूस करना ठीक है - आपकी भावनाएं वैध हैं।",
                    "उदासी वास्तव में ले जाने के लिए कठिन हो सकती है। आपको इससे अकेले नहीं गुजरना है।",
                    "आप कैसा महसूस कर रहे हैं, इसे साझा करने के लिए धन्यवाद। मैं इसके माध्यम से आपका समर्थन करने के लिए यहाँ हूँ।"
                ],
                "anxious": [
                    "मैं समझता हूं कि आप चिंतित महसूस कर रहे हैं। चिंता अभिभावी हो सकती है, लेकिन आप अकेले नहीं हैं।",
                    "चिंता कठिन है, लेकिन आप पहुंचकर ताकत दिखा रहे हैं। आइए इसे एक कदम पर एक समय में करते हैं।",
                    "आपकी भावनाएं पूरी तरह से वैध हैं। क्या कुछ ग्राउंडिंग तकनीकें अभी मदद करेंगी?"
                ],
                "angry": [
                    "मैं आपके गुस्से को महसूस कर सकता हूं, और यह पूरी तरह से वैध है। गुस्सा अक्सर हमें कुछ महत्वपूर्ण बताता है।",
                    "गुस्सा तीव्र और अभिभावी हो सकता है। इस तरह महसूस करना ठीक है। आइए इसे एक साथ काम करते हैं।",
                    "मैं आपकी निराशा सुनता हूं। आइए इन भावनाओं को संसाधित करने के लिए स्वस्थ तरीके खोजें।"
                ],
                "calm": [
                    "मुझे खुशी है कि आप शांत महसूस कर रहे हैं। यह शांतिपूर्ण अवस्था सुंदर है।",
                    "शांति इतना उपहार है। मुझे खुशी है कि आप इस शांति का अनुभव कर रहे हैं।",
                    "आपकी शांत ऊर्जा प्यारी है। शांति के ये पल कीमती हैं।"
                ],
                "neutral": [
                    "मैं इस तटस्थ स्थान में आपके साथ हूं। कभी-कभी बस होना ठीक है।",
                    "तटस्थ भावनाएं भी पूरी तरह से वैध हैं। अभी आपके मन में क्या है?",
                    "तटस्थ महसूस करना बिल्कुल ठीक है। क्या कोई चीज़ है जिसे आप जानना चाहेंगे?"
                ]
            },
            "ta": {
                "happy": [
                    "நீங்கள் மகிழ்ச்சியாக உணர்கிறீர்கள் என்று கேட்பதில் மிகவும் மகிழ்ச்சி! அது அற்புதமானது।",
                    "உங்கள் மகிழ்ச்சி தொற்றக்கூடியது! இவ்வளவு நேர்மறையான நிலையில் உங்களைப் பார்ப்பது அழகானது।",
                    "அது அருமை! மகிழ்ச்சியான தருணங்கள் விலைமதிப்பற்றவை।"
                ],
                "sad": [
                    "நீங்கள் சோகமாக உணர்கிறீர்கள் என்று கெட்டவுக்கு வருந்துகிறேன். இப்படி உணர்வது சரியே।",
                    "சோகம் உண்மையில் சுமக்க கடினமாக இருக்கலாம். நீங்கள் இதை தனியாக கடந்து செல்ல வேண்டியதில்லை।",
                    "நீங்கள் எப்படி உணர்கிறீர்கள் என்பதை பகிர்ந்ததற்கு நன்றி। இதன் மூலம் உங்களுக்கு ஆதரவு அளிக்க நான் இங்கே இருக்கிறேன்."
                ],
                "anxious": [
                    "நீங்கள் கவலைப்படுகிறீர்கள் என்று புரிகிறது। கவலை அதிகமாக இருக்கலாம், ஆனால் நீங்கள் தனியாக இல்லை।",
                    "கவலை கடினமானது, ஆனால் நீங்கள் தொடர்பு கொள்வதன் மூலம் வலிமையைக் காட்டுகிறீர்கள்।",
                    "உங்கள் உணர்வுகள் முற்றிலும் சரியானவை। சில அடிப்படை நுட்பங்கள் இப்போது உதவுமா?"
                ],
                "angry": [
                    "உங்கள் கோபத்தை நான் உணர முடிகிறது, அது முற்றிலும் சரியானது।",
                    "கோபம் தீவிரமாகவும் அதிகமாகவும் இருக்கலாம். இப்படி உணர்வது சரியே।",
                    "உங்கள் விரக்தியை நான் கேட்கிறேன். இந்த உணர்வுகளை செயலாக்க ஆரோக்கியமான வழிகளைக் கண்டுபிடிப்போம்."
                ],
                "calm": [
                    "நீங்கள் அமைதியாக உணர்கிறீர்கள் என்பதில் மகிழ்ச்சி। இந்த அமைதியான நிலை அழகானது।",
                    "அமைதி ஒரு பரிசு. நீங்கள் இந்த அமைதியை அனுபவிப்பதில் மகிழ்ச்சி।",
                    "உங்கள் அமைதியான ஆற்றல் அழகானது। அமைதியின் இந்த தருணங்கள் விலைமதிப்பற்றவை."
                ],
                "neutral": [
                    "இந்த நடுநிலை இடத்தில் நான் உங்களுடன் இருக்கிறேன். சில நேரங்களில் வெறுமனே இருப்பது சரியே।",
                    "நடுநிலை உணர்வுகளும் முற்றிலும் சரியானவை. இப்போது உங்கள் மனதில் என்ன இருக்கிறது?",
                    "நடுநிலையில் உணர்வது முற்றிலும் சரியே. நீங்கள் ஆராய விரும்பும் ஏதாவது இருக்கிறதா?"
                ]
            },
            "es": {
                "happy": [
                    "¡Me alegra mucho saber que te sientes feliz! Eso es maravilloso. ¿Qué te está trayendo alegría hoy?",
                    "¡Tu felicidad es contagiosa! Es hermoso verte en un estado tan positivo.",
                    "¡Eso es fantástico! Los momentos felices son preciosos. Espero que este sentimiento continúe para ti."
                ],
                "sad": [
                    "Lamento que te sientas triste. Está bien sentirse así - tus emociones son válidas. Estoy aquí para escuchar.",
                    "La tristeza puede ser realmente difícil de llevar. No tienes que pasar por esto solo.",
                    "Gracias por compartir cómo te sientes. Estoy aquí para apoyarte en esto."
                ],
                "anxious": [
                    "Entiendo que te sientes ansioso. La ansiedad puede ser abrumadora, pero no estás solo.",
                    "La ansiedad es difícil, pero estás mostrando fortaleza al comunicarte. Tomemos esto paso a paso.",
                    "Tus sentimientos son completamente válidos. ¿Te ayudarían algunas técnicas de relajación ahora?"
                ],
                "angry": [
                    "Puedo sentir tu enojo, y eso es completamente válido. La ira a menudo nos dice algo importante.",
                    "La ira puede ser intensa y abrumadora. Está bien sentirse así. Trabajemos juntos.",
                    "Escucho tu frustración. Encontremos formas saludables de procesar estos sentimientos."
                ],
                "calm": [
                    "Me alegra que te sientas calmado. Este estado pacífico es hermoso.",
                    "La calma es un regalo. Me alegra que estés experimentando esta serenidad.",
                    "Tu energía calmada es encantadora. Estos momentos de paz son preciosos."
                ],
                "neutral": [
                    "Estoy aquí contigo en este espacio neutral. A veces está bien simplemente ser.",
                    "Los sentimientos neutrales también son completamente válidos. ¿Qué tienes en mente ahora?",
                    "Está perfectamente bien sentirse neutral. ¿Hay algo que te gustaría explorar?"
                ]
            }
        }

    def _check_ollama_availability(self) -> bool:
        """Check if Ollama is running and model is available"""
        try:
            response = requests.get(f"{self.ollama_url}/api/tags", timeout=5)
            if response.status_code == 200:
                models = response.json().get("models", [])
                available_models = [model["name"] for model in models]
                if any(self.model_name in model for model in available_models):
                    logging.info(f"Ollama is available with model: {self.model_name}")
                    return True
                else:
                    logging.warning(f"Model {self.model_name} not found in Ollama")
                    return False
            return False
        except Exception as e:
            logging.warning(f"Ollama not available: {e}")
            return False

    def generate_response(self, message: str, emotion: str, language: str = "en") -> str:
        """
        Generate empathetic response based on user message and detected emotion
        
        Args:
            message: User's input message
            emotion: Detected emotion
            language: Language code (en, hi, ta, es)
            
        Returns:
            Generated response string
        """
        if self.available:
            try:
                return self._generate_with_ollama(message, emotion, language)
            except Exception as e:
                logging.error(f"Ollama generation failed: {e}")
        
        # Fallback to predefined responses
        return self._get_fallback_response(emotion, language)

    def _generate_with_ollama(self, message: str, emotion: str, language: str) -> str:
        """Generate response using Ollama LLM"""
        
        # Create culturally appropriate prompt based on language
        prompts = {
            "en": self._create_english_prompt(message, emotion),
            "hi": self._create_hindi_prompt(message, emotion),
            "ta": self._create_tamil_prompt(message, emotion),
            "es": self._create_spanish_prompt(message, emotion)
        }
        
        prompt = prompts.get(language, prompts["en"])
        
        payload = {
            "model": self.model_name,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": 0.7,
                "top_p": 0.9,
                "max_tokens": 200
            }
        }
        
        response = requests.post(
            f"{self.ollama_url}/api/generate",
            json=payload,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            return result.get("response", "").strip()
        else:
            raise Exception(f"Ollama API error: {response.status_code}")

    def _create_english_prompt(self, message: str, emotion: str) -> str:
        return f"""You are CuraMind, a compassionate mental health support chatbot. You provide empathetic, supportive responses to users sharing their feelings.

User's message: "{message}"
Detected emotion: {emotion}

Guidelines:
- Be warm, empathetic, and non-judgmental
- Validate their feelings
- Offer gentle support and encouragement
- Keep responses concise (2-3 sentences)
- Use "I" statements to show presence
- Avoid giving medical advice
- If the emotion suggests crisis, gently suggest professional help

Respond supportively:"""

    def _create_hindi_prompt(self, message: str, emotion: str) -> str:
        return f"""आप CuraMind हैं, एक दयालु मानसिक स्वास्थ्य सहायता चैटबॉट। आप उपयोगकर्ताओं को सहानुभूतिपूर्ण, सहायक प्रतिक्रियाएं प्रदान करते हैं।

उपयोगकर्ता का संदेश: "{message}"
पहचानी गई भावना: {emotion}

दिशानिर्देश:
- गर्मजोशी, सहानुभूति और गैर-न्यायिक बनें
- उनकी भावनाओं को मान्य करें
- कोमल समर्थन और प्रोत्साहन प्रदान करें
- प्रतिक्रियाओं को संक्षिप्त रखें (2-3 वाक्य)
- उपस्थिति दिखाने के लिए "मैं" कथन का उपयोग करें

हिंदी में सहायक प्रतिक्रिया दें:"""

    def _create_tamil_prompt(self, message: str, emotion: str) -> str:
        return f"""நீங்கள் CuraMind, ஒரு இரக்கமுள்ள மன நல ஆதரவு சாட்பாட். நீங்கள் பயனர்களுக்கு அனுதாபமான, ஆதரவான பதில்களை வழங்குகிறீர்கள்.

பயனரின் செய்தி: "{message}"
கண்டறியப்பட்ட உணர்ச்சி: {emotion}

வழிகாட்டுதல்கள்:
- அன்பானவராகவும், அனுதாபமுள்ளவராகவும், தீர்ப்பு வழங்காதவராகவும் இருங்கள்
- அவர்களின் உணர்வுகளை ஏற்றுக்கொள்ளுங்கள்
- மென்மையான ஆதரவு மற்றும் ஊக்கம் வழங்குங்கள்
- பதில்களை சுருக்கமாக வைத்திருங்கள் (2-3 வாக்கியங்கள்)

தமிழில் ஆதரவான பதில் அளியுங்கள்:"""

    def _create_spanish_prompt(self, message: str, emotion: str) -> str:
        return f"""Eres CuraMind, un chatbot compasivo de apoyo de salud mental. Proporcionas respuestas empáticas y de apoyo a los usuarios que comparten sus sentimientos.

Mensaje del usuario: "{message}"
Emoción detectada: {emotion}

Pautas:
- Sé cálido, empático y sin juzgar
- Valida sus sentimientos
- Ofrece apoyo y aliento gentil
- Mantén las respuestas concisas (2-3 oraciones)
- Usa declaraciones "yo" para mostrar presencia

Responde de manera solidaria en español:"""

    def _get_fallback_response(self, emotion: str, language: str) -> str:
        """Get fallback response when LLM is not available"""
        responses = self.fallback_responses.get(language, self.fallback_responses["en"])
        emotion_responses = responses.get(emotion, responses["neutral"])
        
        import random
        return random.choice(emotion_responses)

    def get_crisis_resources(self, language: str = "en") -> Dict[str, str]:
        """Get crisis resources based on language/region"""
        resources = {
            "en": {
                "hotline": "988 (Suicide & Crisis Lifeline)",
                "text": "Text HOME to 741741 (Crisis Text Line)",
                "emergency": "911 for immediate emergency"
            },
            "hi": {
                "hotline": "91-9152987821 (AASRA)",
                "text": "iCall: 9152987821",
                "emergency": "102 for immediate emergency"
            },
            "ta": {
                "hotline": "91-9152987821 (AASRA)",
                "text": "iCall: 9152987821", 
                "emergency": "102 for immediate emergency"
            },
            "es": {
                "hotline": "1-888-628-9454 (Línea Nacional de Prevención del Suicidio)",
                "text": "Text HOLA to 741741",
                "emergency": "911 for immediate emergency"
            }
        }
        
        return resources.get(language, resources["en"])