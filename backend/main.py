from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import uvicorn
import sys
import os

# Add the models directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'models'))

from emotion_analyzer import EmotionAnalyzer
from llm_response import CuraMindLLM

app = FastAPI(title="CuraMind API", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AI components
emotion_analyzer = EmotionAnalyzer()
llm = CuraMindLLM()

# Request/Response Models
class ChatRequest(BaseModel):
    message: str
    emotion: Optional[str] = None
    language: str = "en"

class ChatResponse(BaseModel):
    message: str
    emotion: str
    suggestions: Optional[List[str]] = None

class EmotionRequest(BaseModel):
    text: str

class EmotionResponse(BaseModel):
    emotion: str
    confidence: float

class TrackingRequest(BaseModel):
    emotion: str
    score: float
    timestamp: str
    text: str

class ToolkitResponse(BaseModel):
    suggestions: List[str]

@app.get("/")
async def root():
    return {"message": "CuraMind API is running!", "version": "1.0.0"}

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Main chat endpoint that processes user messages and returns empathetic responses
    """
    try:
        # Detect emotion if not provided
        if not request.emotion:
            emotion_result = emotion_analyzer.analyze_text(request.message)
            emotion = emotion_result["emotion"]
        else:
            emotion = request.emotion
        
        # Generate response using LLM
        response_text = llm.generate_response(
            message=request.message,
            emotion=emotion,
            language=request.language
        )
        
        # Get toolkit suggestions
        suggestions = get_toolkit_suggestions(emotion)
        
        return ChatResponse(
            message=response_text,
            emotion=emotion,
            suggestions=suggestions
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing chat: {str(e)}")

@app.post("/emotion", response_model=EmotionResponse)
async def detect_emotion(request: EmotionRequest):
    """
    Endpoint to detect emotion from text input
    """
    try:
        result = emotion_analyzer.analyze_text(request.text)
        return EmotionResponse(
            emotion=result["emotion"],
            confidence=result["confidence"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error detecting emotion: {str(e)}")

@app.get("/toolkit", response_model=ToolkitResponse)
async def get_toolkit(emotion: str):
    """
    Get toolkit suggestions based on detected emotion
    """
    try:
        suggestions = get_toolkit_suggestions(emotion)
        return ToolkitResponse(suggestions=suggestions)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting toolkit: {str(e)}")

@app.post("/track")
async def track_emotion(request: TrackingRequest):
    """
    Track user emotion for analytics (simple file-based storage for now)
    """
    try:
        # In a production app, this would save to a proper database
        # For now, we'll just acknowledge the tracking request
        return {"status": "success", "message": "Emotion tracked successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error tracking emotion: {str(e)}")

def get_toolkit_suggestions(emotion: str) -> List[str]:
    """
    Get appropriate toolkit suggestions based on emotion
    """
    suggestions_map = {
        "happy": [
            "Continue journaling about positive experiences",
            "Practice gratitude meditation",
            "Share your joy with others"
        ],
        "sad": [
            "Try gentle breathing exercises",
            "Write in your journal about your feelings",
            "Listen to calming nature sounds"
        ],
        "anxious": [
            "Practice the 4-7-8 breathing technique",
            "Try progressive muscle relaxation",
            "Use grounding techniques (5-4-3-2-1 method)"
        ],
        "angry": [
            "Take deep breaths and count to 10",
            "Write about your feelings in your journal",
            "Try physical exercise if possible"
        ],
        "calm": [
            "Continue your current mindfulness practices",
            "Try meditation or quiet reflection",
            "Practice gratitude"
        ],
        "neutral": [
            "Explore your feelings through journaling",
            "Try mood tracking",
            "Practice self-reflection"
        ]
    }
    
    return suggestions_map.get(emotion, suggestions_map["neutral"])

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)