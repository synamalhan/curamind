# 🧠 CuraMind - AI-Powered Mental Health Support

*Empathetic, multilingual mental health chatbot that works offline*

## 🌟 Project Overview

CuraMind is an innovative mental health support chatbot designed to provide accessible, empathetic mental health assistance to users worldwide. Built for inclusivity and accessibility, it supports multiple languages and works offline to ensure help is always available.

## 🎯 Problem We Solve

- **Accessibility**: Mental health support is expensive and not available 24/7
- **Language Barriers**: Most mental health resources are English-only
- **Offline Limitations**: Rural areas with poor internet need offline support
- **Immediate Help**: Crisis situations need instant, empathetic responses
- **Tracking**: Users need to monitor their emotional wellbeing over time

## ✨ Key Features

### 🤖 Intelligent Chatbot
- **Text & Voice Input**: Communicate through typing or speaking
- **Emotion Detection**: Real-time emotion analysis from text and voice
- **Empathetic Responses**: AI-powered responses tailored to user's emotional state
- **Crisis Detection**: Identifies urgent situations and provides appropriate resources

### 🌍 Multilingual Support
- **Local Languages**: Hindi, Tamil, Spanish, and English
- **Cultural Sensitivity**: Responses adapted to cultural contexts
- **Easy Switching**: One-click language switching

### 📱 Offline Capability
- **Local Storage**: Works without internet connection
- **Sync When Online**: Automatically syncs data when connection restored
- **Cached Responses**: Pre-loaded supportive responses for common situations

### 📊 Emotion Tracking
- **Daily Mood Tracking**: Visual dashboard showing emotion patterns
- **Historical Analysis**: 7-day and 30-day emotion trends
- **Progress Insights**: Identify triggers and improvement patterns

### 🧘 Wellness Toolkit
- **Breathing Exercises**: Guided breathing sessions
- **Journaling**: Secure, private digital journaling
- **Calming Sounds**: Ambient sounds for relaxation
- **Mindfulness Tips**: Daily wellness suggestions

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI development
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Responsive, utility-first styling
- **Vite** - Fast development and building
- **IndexedDB** - Client-side storage for offline support

### Backend
- **FastAPI** - High-performance Python web framework
- **Pydantic** - Data validation and serialization
- **Uvicorn** - ASGI server for FastAPI
- **SQLite** - Lightweight database for user data

### AI/ML
- **Ollama** - Local LLM deployment (Mistral/LLaMA2)
- **Transformers** - Emotion detection models
- **Web Speech API** - Voice input and text-to-speech
- **Whisper** - Speech-to-text transcription

### Additional Tools
- **Recharts** - Data visualization for emotion dashboard
- **Lucide React** - Beautiful, consistent icons
- **SpeechSynthesis API** - Text-to-speech responses

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+ and pip
- Ollama installed locally

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/synamalhan/curamind.git
   cd curamind
   ```

2. **Set up the frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Set up the backend**
   ```bash
   cd ../backend
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

4. **Install and run Ollama**
   ```bash
   # Install Ollama (see ollama.com for platform-specific instructions)
   ollama pull mistral
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## 📖 Usage

1. **Start Chatting**: Type or speak your concerns
2. **Choose Language**: Select your preferred language from the dropdown
3. **Voice Input**: Click the microphone icon to speak
4. **View Dashboard**: Track your emotional patterns over time
5. **Use Toolkit**: Access breathing exercises and journaling
6. **Offline Mode**: Continue using even without internet

## 🎥 Demo

![CuraMind Demo](./assets/demo.gif)
*Demo GIF showing the main chat interface and emotion detection*

![Dashboard Demo](./assets/dashboard-demo.gif)
*Demo GIF showing the emotion tracking dashboard*

## 🏗️ Project Structure

```
curamind/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Main application pages
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions
│   │   └── styles/         # Global styles and themes
│   └── public/             # Static assets
├── backend/                 # FastAPI backend server
│   ├── app/
│   │   ├── routes/         # API route handlers
│   │   ├── models/         # Pydantic data models
│   │   ├── services/       # Business logic services
│   │   └── utils/          # Backend utilities
│   └── requirements.txt    # Python dependencies
├── models/                  # AI/ML model implementations
│   ├── emotion_analyzer.py # Emotion detection logic
│   ├── llm_response.py     # LLM integration
│   └── offline_responses.py # Offline fallback responses
├── assets/                  # Images, icons, audio files
└── docs/                    # Additional documentation
```

## 🔮 Future Enhancements

- **Advanced Analytics**: Detailed emotion analysis and insights
- **Group Support**: Community features and peer support
- **Therapist Integration**: Connect with licensed professionals
- **Wearable Integration**: Heart rate and biometric monitoring
- **Gamification**: Wellness challenges and achievement system
- **Enterprise Version**: Workplace mental health solutions

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Mental health professionals who provided guidance
- Open-source AI/ML communities
- Hackathon organizers and participants
- Users who provided feedback during development

---

**Built with ❤️ for mental health awareness and accessibility**

*If you or someone you know is in crisis, please contact your local emergency services or a mental health crisis hotline immediately.*