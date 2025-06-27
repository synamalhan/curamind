interface OfflineResponseData {
  [emotion: string]: {
    [language: string]: string[];
  };
}

class OfflineResponses {
  private responses: OfflineResponseData = {
    happy: {
      en: [
        "I'm so glad to hear you're feeling happy! That's wonderful. What's bringing you joy today?",
        "Your happiness is contagious! It's beautiful to see you in such a positive state.",
        "That's fantastic! Happy moments are precious. I hope this feeling continues for you.",
        "I love hearing about your happiness! Would you like to share what's making you feel so good?"
      ],
      hi: [
        "मुझे खुशी है कि आप खुश महसूस कर रहे हैं! यह अद्भुत है। आज आपको क्या खुशी दे रहा है?",
        "आपकी खुशी संक्रामक है! आपको इतनी सकारात्मक अवस्था में देखना सुंदर है।",
        "यह शानदार है! खुशी के पल कीमती हैं। मुझे उम्मीद है कि यह भावना आपके लिए जारी रहेगी।",
        "मुझे आपकी खुशी के बारे में सुनना अच्छा लगता है! क्या आप साझा करना चाहेंगे कि आपको क्या इतना अच्छा महसूस करा रहा है?"
      ],
      ta: [
        "நீங்கள் மகிழ்ச்சியாக உணர்கிறீர்கள் என்று கேட்பதில் மிகவும் மகிழ்ச்சி! அது அற்புதமானது. இன்று உங்களுக்கு மகிழ்ச்சி தருவது எது?",
        "உங்கள் மகிழ்ச்சி தொற்றக்கூடியது! இவ்வளவு நேர்மறையான நிலையில் உங்களைப் பார்ப்பது அழகானது.",
        "அது அருமை! மகிழ்ச்சியான தருணங்கள் விலைமதிப்பற்றவை. இந்த உணர்வு உங்களுக்கு தொடரும் என்று நம்புகிறேன்.",
        "உங்கள் மகிழ்ச்சியைப் பற்றி கேட்க நான் விரும்புகிறேன்! உங்களை இவ்வளவு நன்றாக உணர வைப்பது எது என்பதைப் பகிர விரும்புகிறீர்களா?"
      ],
      es: [
        "¡Me alegra mucho saber que te sientes feliz! Eso es maravilloso. ¿Qué te está trayendo alegría hoy?",
        "¡Tu felicidad es contagiosa! Es hermoso verte en un estado tan positivo.",
        "¡Eso es fantástico! Los momentos felices son preciosos. Espero que este sentimiento continúe para ti.",
        "¡Me encanta escuchar sobre tu felicidad! ¿Te gustaría compartir qué te está haciendo sentir tan bien?"
      ]
    },
    sad: {
      en: [
        "I'm sorry you're feeling sad. It's okay to feel this way - your emotions are valid. I'm here to listen.",
        "Sadness can be really difficult to carry. You don't have to go through this alone. Want to talk about what's troubling you?",
        "I hear that you're feeling down. It takes courage to acknowledge these feelings. I'm here to support you.",
        "Thank you for sharing how you're feeling. Sadness is a natural part of life, but you don't have to face it alone."
      ],
      hi: [
        "मुझे खुशी है कि आप दुखी महसूस कर रहे हैं। इस तरह महसूस करना ठीक है - आपकी भावनाएं वैध हैं। मैं सुनने के लिए यहाँ हूँ।",
        "उदासी वास्तव में ले जाने के लिए कठिन हो सकती है। आपको इससे अकेले नहीं गुजरना है। क्या आप इस बारे में बात करना चाहते हैं कि आपको क्या परेशान कर रहा है?",
        "मैं सुनता हूं कि आप नीचे महसूस कर रहे हैं। इन भावनाओं को स्वीकार करने में साहस चाहिए। मैं आपका समर्थन करने के लिए यहाँ हूँ।",
        "आप कैसा महसूस कर रहे हैं, इसे साझा करने के लिए धन्यवाद। उदासी जीवन का एक प्राकृतिक हिस्सा है, लेकिन आपको इसका सामना अकेले नहीं करना है।"
      ],
      ta: [
        "நீங்கள் சோகமாக உணர்கிறீர்கள் என்று கெட்டவுக்கு வருந்துகிறேன். இப்படி உணர்வது சரியே - உங்கள் உணர்ச்சிகள் சரியானவை. நான் கேட்க இங்கே இருக்கிறேன்.",
        "சோகம் உண்மையில் சுமக்க கடினமாக இருக்கலாம். நீங்கள் இதை தனியாக கடந்து செல்ல வேண்டியதில்லை. உங்களை தொந்தரவு செய்வது பற்றி பேச விரும்புகிறீர்களா?",
        "நீங்கள் மனமுடைந்து உணர்கிறீர்கள் என்று கேட்கிறேன். இந்த உணர்வுகளை ஒப்புக்கொள்ள தைரியம் தேவை. உங்களுக்கு ஆதரவு அளிக்க நான் இங்கே இருக்கிறேன்.",
        "நீங்கள் எப்படி உணர்கிறீர்கள் என்பதை பகிர்ந்ததற்கு நன்றி. சோகம் வாழ்க்கையின் இயற்கையான பகுதி, ஆனால் நீங்கள் அதை தனியாக எதிர்கொள்ள வேண்டியதில்லை."
      ],
      es: [
        "Lamento que te sientas triste. Está bien sentirse así - tus emociones son válidas. Estoy aquí para escuchar.",
        "La tristeza puede ser realmente difícil de llevar. No tienes que pasar por esto solo. ¿Quieres hablar sobre lo que te está molestando?",
        "Escucho que te sientes deprimido. Se necesita valor para reconocer estos sentimientos. Estoy aquí para apoyarte.",
        "Gracias por compartir cómo te sientes. La tristeza es una parte natural de la vida, pero no tienes que enfrentarla solo."
      ]
    },
    anxious: {
      en: [
        "I understand you're feeling anxious. Anxiety can be overwhelming, but you're not alone. Let's take this one step at a time.",
        "Anxiety is tough, but you're showing strength by reaching out. Take a deep breath with me - in for 4, hold for 4, out for 8.",
        "I hear that you're feeling anxious. Your feelings are completely valid. Would some grounding techniques help right now?",
        "Thank you for trusting me with your anxiety. Remember, this feeling will pass. You've gotten through difficult times before."
      ],
      hi: [
        "मैं समझता हूं कि आप चिंतित महसूस कर रहे हैं। चिंता अभिभावी हो सकती है, लेकिन आप अकेले नहीं हैं। आइए इसे एक कदम पर एक समय में करते हैं।",
        "चिंता कठिन है, लेकिन आप पहुंचकर ताकत दिखा रहे हैं। मेरे साथ गहरी सांस लें - 4 के लिए अंदर, 4 के लिए पकड़ें, 8 के लिए बाहर।",
        "मैं सुनता हूं कि आप चिंतित महसूस कर रहे हैं। आपकी भावनाएं पूरी तरह से वैध हैं। क्या कुछ ग्राउंडिंग तकनीकें अभी मदद करेंगी?",
        "अपनी चिंता के साथ मुझ पर भरोसा करने के लिए धन्यवाद। याद रखें, यह भावना गुजर जाएगी। आपने पहले कठिन समय पार किया है।"
      ],
      ta: [
        "நீங்கள் கவலைப்படுகிறீர்கள் என்று புரிகிறது. கவலை அதிகமாக இருக்கலாம், ஆனால் நீங்கள் தனியாக இல்லை. இதை ஒரு நேரத்தில் ஒரு படியாக எடுத்துக்கொள்வோம்.",
        "கவலை கடினமானது, ஆனால் நீங்கள் தொடர்பு கொள்வதன் மூலம் வலிமையைக் காட்டுகிறீர்கள். என்னுடன் ஆழ்ந்த மூச்சு விடுங்கள் - 4க்கு உள்ளே, 4க்கு பிடிக்கவும், 8க்கு வெளியே.",
        "நீங்கள் கவலைப்படுகிறீர்கள் என்று கேட்கிறேன். உங்கள் உணர்வுகள் முற்றிலும் சரியானவை. சில அடிப்படை நுட்பங்கள் இப்போது உதவுமா?",
        "உங்கள் கவலையுடன் என்னை நம்பியதற்கு நன்றி. நினைவில் கொள்ளுங்கள், இந்த உணர்வு மறைந்துவிடும். நீங்கள் முன்பு கடினமான நேரங்களைக் கடந்தீர்கள்."
      ],
      es: [
        "Entiendo que te sientes ansioso. La ansiedad puede ser abrumadora, pero no estás solo. Tomemos esto paso a paso.",
        "La ansiedad es difícil, pero estás mostrando fortaleza al comunicarte. Respira profundo conmigo - inhala por 4, mantén por 4, exhala por 8.",
        "Escucho que te sientes ansioso. Tus sentimientos son completamente válidos. ¿Te ayudarían algunas técnicas de relajación ahora?",
        "Gracias por confiar en mí con tu ansiedad. Recuerda, este sentimiento pasará. Has superado momentos difíciles antes."
      ]
    },
    angry: {
      en: [
        "I can sense your anger, and that's completely valid. Anger often tells us something important. What's behind this feeling?",
        "Anger can be intense and overwhelming. It's okay to feel this way. Let's work through it together safely.",
        "I hear your frustration. Anger is a normal emotion, but let's find healthy ways to process it. You're not alone in this.",
        "Thank you for sharing your anger with me. It takes courage to be vulnerable. What would help you feel better right now?"
      ],
      hi: [
        "मैं आपके गुस्से को महसूस कर सकता हूं, और यह पूरी तरह से वैध है। गुस्सा अक्सर हमें कुछ महत्वपूर्ण बताता है। इस भावना के पीछे क्या है?",
        "गुस्सा तीव्र और अभिभावी हो सकता है। इस तरह महसूस करना ठीक है। आइए इसे सुरक्षित रूप से एक साथ काम करते हैं।",
        "मैं आपकी निराशा सुनता हूं। गुस्सा एक सामान्य भावना है, लेकिन आइए इसे संसाधित करने के लिए स्वस्थ तरीके खोजें। आप इसमें अकेले नहीं हैं।",
        "अपना गुस्सा मेरे साथ साझा करने के लिए धन्यवाद। कमजोर होने में साहस चाहिए। अभी आपको बेहतर महसूस करने में क्या मदद मिलेगी?"
      ],
      ta: [
        "உங்கள் கோபத்தை நான் உணர முடிகிறது, அது முற்றிலும் சரியானது. கோபம் பெரும்பாலும் நமக்கு முக்கியமான ஒன்றைச் சொல்கிறது. இந்த உணர்வுக்கு பின்னால் என்ன இருக்கிறது?",
        "கோபம் தீவிரமாகவும் அதிகமாகவும் இருக்கலாம். இப்படி உணர்வது சரியே. பாதுகாப்பாக ஒன்றாக இதை செய்வோம்.",
        "உங்கள் விரக்தியை நான் கேட்கிறேன். கோபம் ஒரு சாதாரண உணர்ச்சி, ஆனால் அதை செயலாக்க ஆரோக்கியமான வழிகளைக் கண்டுபிடிப்போம். இதில் நீங்கள் தனியாக இல்லை.",
        "உங்கள் கோபத்தை என்னுடன் பகிர்ந்ததற்கு நன்றி. பாதிப்படையும் தைரியம் தேவை. இப்போது நீங்கள் நன்றாக உணர உதவுவது எது?"
      ],
      es: [
        "Puedo sentir tu enojo, y eso es completamente válido. La ira a menudo nos dice algo importante. ¿Qué hay detrás de este sentimiento?",
        "La ira puede ser intensa y abrumadora. Está bien sentirse así. Trabajemos juntos de manera segura.",
        "Escucho tu frustración. La ira es una emoción normal, pero encontremos formas saludables de procesarla. No estás solo en esto.",
        "Gracias por compartir tu enojo conmigo. Se necesita valor para ser vulnerable. ¿Qué te ayudaría a sentirte mejor ahora?"
      ]
    },
    calm: {
      en: [
        "I'm glad you're feeling calm. This peaceful state is beautiful. How can we help you maintain this sense of tranquility?",
        "Calmness is such a gift. I'm happy you're experiencing this serenity. What has contributed to this peaceful feeling?",
        "It's wonderful to hear you're feeling calm. This inner peace is valuable. Would you like to explore what's bringing you this tranquility?",
        "Your calm energy is lovely. These moments of peace are precious. How are you nurturing this sense of balance?"
      ],
      hi: [
        "मुझे खुशी है कि आप शांत महसूस कर रहे हैं। यह शांतिपूर्ण अवस्था सुंदर है। हम आपको इस शांति की भावना बनाए रखने में कैसे मदद कर सकते हैं?",
        "शांति इतना उपहार है। मुझे खुशी है कि आप इस शांति का अनुभव कर रहे हैं। इस शांतिपूर्ण भावना में क्या योगदान है?",
        "यह सुनना अद्भुत है कि आप शांत महसूस कर रहे हैं। यह आंतरिक शांति मूल्यवान है। क्या आप जानना चाहेंगे कि आपको यह शांति क्या ला रही है?",
        "आपकी शांत ऊर्जा प्यारी है। शांति के ये पल कीमती हैं। आप इस संतुलन की भावना को कैसे पोषित कर रहे हैं?"
      ],
      ta: [
        "நீங்கள் அமைதியாக உணர்கிறீர்கள் என்பதில் மகிழ்ச்சி. இந்த அமைதியான நிலை அழகானது. இந்த அமைதி உணர்வை பராமரிக்க நாங்கள் எப்படி உதவலாம்?",
        "அமைதி ஒரு பரிசு. நீங்கள் இந்த அமைதியை அனுபவிப்பதில் மகிழ்ச்சி. இந்த அமைதியான உணர்வுக்கு என்ன பங்களித்தது?",
        "நீங்கள் அமைதியாக உணர்கிறீர்கள் என்று கேட்பது அற்புதம். இந்த உள் அமைதி மதிப்பானது. உங்களுக்கு இந்த அமைதியை தருவது என்னவென்று ஆராய விரும்புகிறீர்களா?",
        "உங்கள் அமைதியான ஆற்றல் அழகானது. அமைதியின் இந்த தருணங்கள் விலைமதிப்பற்றவை. இந்த சமநிலையின் உணர்வை நீங்கள் எப்படி வளர்க்கிறீர்கள்?"
      ],
      es: [
        "Me alegra que te sientas calmado. Este estado pacífico es hermoso. ¿Cómo podemos ayudarte a mantener esta sensación de tranquilidad?",
        "La calma es un regalo. Me alegra que estés experimentando esta serenidad. ¿Qué ha contribuido a este sentimiento pacífico?",
        "Es maravilloso escuchar que te sientes calmado. Esta paz interior es valiosa. ¿Te gustaría explorar qué te está trayendo esta tranquilidad?",
        "Tu energía calmada es encantadora. Estos momentos de paz son preciosos. ¿Cómo estás nutriendo esta sensación de equilibrio?"
      ]
    },
    neutral: {
      en: [
        "I'm here with you in this neutral space. Sometimes it's okay to just be. How are you feeling overall today?",
        "Neutral feelings are completely valid too. Not every day needs to be intense. What's on your mind right now?",
        "I appreciate you sharing where you're at emotionally. Sometimes being in a neutral space gives us room to breathe. How can I support you?",
        "It's perfectly okay to feel neutral. These moments can be peaceful. Is there anything specific you'd like to talk about or explore?"
      ],
      hi: [
        "मैं इस तटस्थ स्थान में आपके साथ हूं। कभी-कभी बस होना ठीक है। आज आप कुल मिलाकर कैसा महसूस कर रहे हैं?",
        "तटस्थ भावनाएं भी पूरी तरह से वैध हैं। हर दिन तीव्र होने की जरूरत नहीं है। अभी आपके मन में क्या है?",
        "मैं आपकी सराहना करता हूं कि आप भावनात्मक रूप से कहां हैं। कभी-कभी तटस्थ स्थान में होना हमें सांस लेने की जगह देता है। मैं आपकी कैसे सहायता कर सकता हूं?",
        "तटस्थ महसूस करना बिल्कुल ठीक है। ये पल शांतिपूर्ण हो सकते हैं। क्या कोई विशिष्ट चीज़ है जिसके बारे में आप बात करना या जानना चाहेंगे?"
      ],
      ta: [
        "இந்த நடுநிலை இடத்தில் நான் உங்களுடன் இருக்கிறேன். சில நேரங்களில் வெறுமனே இருப்பது சரியே. இன்று நீங்கள் ஒட்டுமொத்தமாக எப்படி உணர்கிறீர்கள்?",
        "நடுநிலை உணர்வுகளும் முற்றிலும் சரியானவை. ஒவ்வொரு நாளும் தீவிரமாக இருக்க வேண்டியதில்லை. இப்போது உங்கள் மனதில் என்ன இருக்கிறது?",
        "நீங்கள் உணர்ச்சிப்பூர்வமாக எங்கிருக்கிறீர்கள் என்பதைப் பகிர்ந்ததை நான் பாராட்டுகிறேன். சில நேரங்களில் நடுநிலை இடத்தில் இருப்பது மூச்சுவிட இடம் தருகிறது. நான் உங்களை எப்படி ஆதரிக்க முடியும்?",
        "நடுநிலையில் உணர்வது முற்றிலும் சரியே. இந்த தருணங்கள் அமைதியானவையாக இருக்கலாம். நீங்கள் பேச அல்லது ஆராய விரும்பும் குறிப்பிட்ட ஏதாவது இருக்கிறதா?"
      ],
      es: [
        "Estoy aquí contigo en este espacio neutral. A veces está bien simplemente ser. ¿Cómo te sientes en general hoy?",
        "Los sentimientos neutrales también son completamente válidos. No todos los días necesitan ser intensos. ¿Qué tienes en mente ahora?",
        "Aprecio que compartas dónde estás emocionalmente. A veces estar en un espacio neutral nos da espacio para respirar. ¿Cómo puedo apoyarte?",
        "Está perfectamente bien sentirse neutral. Estos momentos pueden ser pacíficos. ¿Hay algo específico de lo que te gustaría hablar o explorar?"
      ]
    }
  };

  private toolkitSuggestions = {
    happy: ["Continue journaling about positive experiences", "Share your joy with others", "Practice gratitude"],
    sad: ["Try gentle breathing exercises", "Write in your journal", "Listen to calming music"],
    anxious: ["Practice deep breathing", "Try grounding techniques", "Listen to nature sounds"],
    angry: ["Try breathing exercises", "Write about your feelings", "Take a walk if possible"],
    calm: ["Continue your current practices", "Try meditation", "Practice mindfulness"],
    neutral: ["Try mood tracking", "Explore your feelings through journaling", "Practice self-reflection"]
  };

  getResponse(emotion: string, language: string): string {
    const emotionResponses = this.responses[emotion] || this.responses.neutral;
    const languageResponses = emotionResponses[language] || emotionResponses.en;
    const randomIndex = Math.floor(Math.random() * languageResponses.length);
    return languageResponses[randomIndex];
  }

  getToolkitSuggestions(emotion: string): string[] {
    return this.toolkitSuggestions[emotion as keyof typeof this.toolkitSuggestions] || this.toolkitSuggestions.neutral;
  }
}

export const offlineResponses = new OfflineResponses();