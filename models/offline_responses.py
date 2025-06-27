"""
Offline Response System for CuraMind
Provides fallback responses when internet connection is not available
"""

import json
import random
from typing import Dict, List

class OfflineResponseSystem:
    def __init__(self):
        self.responses = {
            "en": {
                "happy": [
                    "I'm so glad to hear you're feeling happy! That's wonderful. What's bringing you joy today?",
                    "Your happiness is contagious! It's beautiful to see you in such a positive state.",
                    "That's fantastic! Happy moments are precious. I hope this feeling continues for you.",
                    "I love hearing about your happiness! Would you like to share what's making you feel so good?"
                ],
                "sad": [
                    "I'm sorry you're feeling sad. It's okay to feel this way - your emotions are valid. I'm here to listen.",
                    "Sadness can be really difficult to carry. You don't have to go through this alone. Want to talk about what's troubling you?",
                    "I hear that you're feeling down. It takes courage to acknowledge these feelings. I'm here to support you.",
                    "Thank you for sharing how you're feeling. Sadness is a natural part of life, but you don't have to face it alone."
                ],
                "anxious": [
                    "I understand you're feeling anxious. Anxiety can be overwhelming, but you're not alone. Let's take this one step at a time.",
                    "Anxiety is tough, but you're showing strength by reaching out. Take a deep breath with me - in for 4, hold for 4, out for 8.",
                    "I hear that you're feeling anxious. Your feelings are completely valid. Would some grounding techniques help right now?",
                    "Thank you for trusting me with your anxiety. Remember, this feeling will pass. You've gotten through difficult times before."
                ],
                "angry": [
                    "I can sense your anger, and that's completely valid. Anger often tells us something important. What's behind this feeling?",
                    "Anger can be intense and overwhelming. It's okay to feel this way. Let's work through it together safely.",
                    "I hear your frustration. Anger is a normal emotion, but let's find healthy ways to process it. You're not alone in this.",
                    "Thank you for sharing your anger with me. It takes courage to be vulnerable. What would help you feel better right now?"
                ],
                "calm": [
                    "I'm glad you're feeling calm. This peaceful state is beautiful. How can we help you maintain this sense of tranquility?",
                    "Calmness is such a gift. I'm happy you're experiencing this serenity. What has contributed to this peaceful feeling?",
                    "It's wonderful to hear you're feeling calm. This inner peace is valuable. Would you like to explore what's bringing you this tranquility?",
                    "Your calm energy is lovely. These moments of peace are precious. How are you nurturing this sense of balance?"
                ],
                "neutral": [
                    "I'm here with you in this neutral space. Sometimes it's okay to just be. How are you feeling overall today?",
                    "Neutral feelings are completely valid too. Not every day needs to be intense. What's on your mind right now?",
                    "I appreciate you sharing where you're at emotionally. Sometimes being in a neutral space gives us room to breathe. How can I support you?",
                    "It's perfectly okay to feel neutral. These moments can be peaceful. Is there anything specific you'd like to talk about or explore?"
                ]
            },
            "hi": {
                "happy": [
                    "मुझे खुशी है कि आप खुश महसूस कर रहे हैं! यह अद्भुत है। आज आपको क्या खुशी दे रहा है?",
                    "आपकी खुशी संक्रामक है! आपको इतनी सकारात्मक अवस्था में देखना सुंदर है।",
                    "यह शानदार है! खुशी के पल कीमती हैं। मुझे उम्मीद है कि यह भावना आपके लिए जारी रहेगी।"
                ],
                "sad": [
                    "मुझे खुशी है कि आप दुखी महसूस कर रहे हैं। इस तरह महसूस करना ठीक है - आपकी भावनाएं वैध हैं। मैं सुनने के लिए यहाँ हूँ।",
                    "उदासी वास्तव में ले जाने के लिए कठिन हो सकती है। आपको इससे अकेले नहीं गुजरना है।",
                    "मैं सुनता हूं कि आप नीचे महसूस कर रहे हैं। इन भावनाओं को स्वीकार करने में साहस चाहिए।"
                ],
                "anxious": [
                    "मैं समझता हूं कि आप चिंतित महसूस कर रहे हैं। चिंता अभिभावी हो सकती है, लेकिन आप अकेले नहीं हैं।",
                    "चिंता कठिन है, लेकिन आप पहुंचकर ताकत दिखा रहे हैं। मेरे साथ गहरी सांस लें।",
                    "मैं सुनता हूं कि आप चिंतित महसूस कर रहे हैं। आपकी भावनाएं पूरी तरह से वैध हैं।"
                ],
                "angry": [
                    "मैं आपके गुस्से को महसूस कर सकता हूं, और यह पूरी तरह से वैध है। गुस्सा अक्सर हमें कुछ महत्वपूर्ण बताता है।",
                    "गुस्सा तीव्र और अभिभावी हो सकता है। इस तरह महसूस करना ठीक है।",
                    "मैं आपकी निराशा सुनता हूं। गुस्सा एक सामान्य भावना है।"
                ],
                "calm": [
                    "मुझे खुशी है कि आप शांत महसूस कर रहे हैं। यह शांतिपूर्ण अवस्था सुंदर है।",
                    "शांति इतना उपहार है। मुझे खुशी है कि आप इस शांति का अनुभव कर रहे हैं।",
                    "यह सुनना अद्भुत है कि आप शांत महसूस कर रहे हैं।"
                ],
                "neutral": [
                    "मैं इस तटस्थ स्थान में आपके साथ हूं। कभी-कभी बस होना ठीक है।",
                    "तटस्थ भावनाएं भी पूरी तरह से वैध हैं। अभी आपके मन में क्या है?",
                    "तटस्थ महसूस करना बिल्कुल ठीक है।"
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
                    "நீங்கள் மனமுடைந்து உணர்கிறீர்கள் என்று கேட்கிறேன்।"
                ],
                "anxious": [
                    "நீங்கள் கவலைப்படுகிறீர்கள் என்று புரிகிறது। கவலை அதிகமாக இருக்கலாம், ஆனால் நீங்கள் தனியாக இல்லை।",
                    "கவலை கடினமானது, ஆனால் நீங்கள் தொடர்பு கொள்வதன் மூலம் வலிமையைக் காட்டுகிறீர்கள்।",
                    "நீங்கள் கவலைப்படுகிறீர்கள் என்று கேட்கிறேன்।"
                ],
                "angry": [
                    "உங்கள் கோபத்தை நான் உணர முடிகிறது, அது முற்றிலும் சரியானது।",
                    "கோபம் தீவிரமாகவும் அதிகமாகவும் இருக்கலாம். இப்படி உணர்வது சரியே।",
                    "உங்கள் விரக்தியை நான் கேட்கிறேன்।"
                ],
                "calm": [
                    "நீங்கள் அமைதியாக உணர்கிறீர்கள் என்பதில் மகிழ்ச்சி। இந்த அமைதியான நிலை அழகானது।",
                    "அமைதி ஒரு பரிசு. நீங்கள் இந்த அமைதியை அனுபவிப்பதில் மகிழ்ச்சி।",
                    "நீங்கள் அமைதியாக உணர்கிறீர்கள் என்று கேட்பது அற்புதம்।"
                ],
                "neutral": [
                    "இந்த நடுநிலை இடத்தில் நான் உங்களுடன் இருக்கிறேன். சில நேரங்களில் வெறுமனே இருப்பது சரியே।",
                    "நடுநிலை உணர்வுகளும் முற்றிலும் சரியானவை।",
                    "நடுநிலையில் உணர்வது முற்றிலும் சரியே।"
                ]
            },
            "es": {
                "happy": [
                    "¡Me alegra mucho saber que te sientes feliz! Eso es maravilloso. ¿Qué te está trayendo alegría hoy?",
                    "¡Tu felicidad es contagiosa! Es hermoso verte en un estado tan positivo.",
                    "¡Eso es fantástico! Los momentos felices son preciosos."
                ],
                "sad": [
                    "Lamento que te sientas triste. Está bien sentirse así - tus emociones son válidas.",
                    "La tristeza puede ser realmente difícil de llevar. No tienes que pasar por esto solo.",
                    "Escucho que te sientes deprimido. Se necesita valor para reconocer estos sentimientos."
                ],
                "anxious": [
                    "Entiendo que te sientes ansioso. La ansiedad puede ser abrumadora, pero no estás solo.",
                    "La ansiedad es difícil, pero estás mostrando fortaleza al comunicarte.",
                    "Escucho que te sientes ansioso. Tus sentimientos son completamente válidos."
                ],
                "angry": [
                    "Puedo sentir tu enojo, y eso es completamente válido. La ira a menudo nos dice algo importante.",
                    "La ira puede ser intensa y abrumadora. Está bien sentirse así.",
                    "Escucho tu frustración. La ira es una emoción normal."
                ],
                "calm": [
                    "Me alegra que te sientas calmado. Este estado pacífico es hermoso.",
                    "La calma es un regalo. Me alegra que estés experimentando esta serenidad.",
                    "Es maravilloso escuchar que te sientes calmado."
                ],
                "neutral": [
                    "Estoy aquí contigo en este espacio neutral. A veces está bien simplemente ser.",
                    "Los sentimientos neutrales también son completamente válidos.",
                    "Está perfectamente bien sentirse neutral."
                ]
            }
        }
        
        self.toolkit_suggestions = {
            "happy": [
                "Continue journaling about positive experiences",
                "Practice gratitude meditation",
                "Share your joy with others",
                "Take time to appreciate this moment"
            ],
            "sad": [
                "Try gentle breathing exercises",
                "Write in your journal about your feelings",
                "Listen to calming nature sounds",
                "Reach out to someone you trust"
            ],
            "anxious": [
                "Practice the 4-7-8 breathing technique",
                "Try progressive muscle relaxation",
                "Use grounding techniques (5-4-3-2-1 method)",
                "Take a short walk if possible"
            ],
            "angry": [
                "Take deep breaths and count to 10",
                "Write about your feelings in your journal",
                "Try physical exercise if possible",
                "Practice progressive muscle relaxation"
            ],
            "calm": [
                "Continue your current mindfulness practices",
                "Try meditation or quiet reflection",
                "Practice gratitude",
                "Enjoy this peaceful moment"
            ],
            "neutral": [
                "Explore your feelings through journaling",
                "Try mood tracking",
                "Practice self-reflection",
                "Consider what you'd like to focus on today"
            ]
        }

    def get_response(self, emotion: str, language: str = "en") -> str:
        """Get an appropriate offline response based on emotion and language"""
        emotion_responses = self.responses.get(language, self.responses["en"])
        responses = emotion_responses.get(emotion, emotion_responses["neutral"])
        return random.choice(responses)

    def get_toolkit_suggestions(self, emotion: str) -> List[str]:
        """Get toolkit suggestions based on emotion"""
        return self.toolkit_suggestions.get(emotion, self.toolkit_suggestions["neutral"])

    def get_crisis_keywords(self, language: str = "en") -> List[str]:
        """Get crisis keywords for different languages"""
        crisis_keywords = {
            "en": [
                "suicide", "kill myself", "end it all", "want to die", "hurt myself",
                "self harm", "no point", "hopeless", "can't go on", "better off dead"
            ],
            "hi": [
                "आत्महत्या", "खुद को मारना", "मरना चाहता हूं", "जीना नहीं चाहता",
                "सब खत्म", "निराश", "उम्मीद नहीं"
            ],
            "ta": [
                "தற்கொலை", "சாக விரும்புகிறேன்", "வாழ விரும்பவில்லை",
                "நம்பிக்கையில்லை", "முடிவு"
            ],
            "es": [
                "suicidio", "matarme", "quiero morir", "no quiero vivir",
                "sin esperanza", "acabar con todo", "mejor muerto"
            ]
        }
        return crisis_keywords.get(language, crisis_keywords["en"])

    def get_crisis_response(self, language: str = "en") -> str:
        """Get crisis response in appropriate language"""
        crisis_responses = {
            "en": "I'm very concerned about what you're sharing. Your life has value and there are people who want to help. Please reach out to a crisis helpline: 988 (Suicide & Crisis Lifeline) or text HOME to 741741. If you're in immediate danger, please call 911.",
            "hi": "मैं आपकी बात से बहुत चिंतित हूं। आपका जीवन मूल्यवान है और लोग आपकी मदद करना चाहते हैं। कृपया संकट हेल्पलाइन से संपर्क करें: 91-9152987821 (AASRA)। तत्काल खतरे में 102 पर कॉल करें।",
            "ta": "நீங்கள் பகிர்வதைப் பற்றி நான் மிகவும் கவலைப்படுகிறேன். உங்கள் வாழ்க்கைக்கு மதிப்பு உண்டு. தயவுசெய்து நெருக்கடி உதவி எண்ணை அழைக்கவும்: 91-9152987821 (AASRA)। உடனடி ஆபத்தில் 102 ஐ அழைக்கவும்।",
            "es": "Estoy muy preocupado por lo que compartes. Tu vida tiene valor y hay personas que quieren ayudar. Por favor contacta una línea de crisis: 1-888-628-9454. En peligro inmediato, llama al 911."
        }
        return crisis_responses.get(language, crisis_responses["en"])

    def detect_crisis(self, text: str, language: str = "en") -> bool:
        """Detect if text contains crisis indicators"""
        crisis_keywords = self.get_crisis_keywords(language)
        text_lower = text.lower()
        
        return any(keyword in text_lower for keyword in crisis_keywords)