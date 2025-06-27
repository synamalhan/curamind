# CuraMind API Documentation

## Base URL
`http://localhost:8000`

## Endpoints

### POST /chat
Send a message to the chatbot and receive an empathetic response.

**Request Body:**
```json
{
  "message": "I'm feeling really anxious today",
  "emotion": "anxious",  // optional
  "language": "en"       // en, hi, ta, es
}
```

**Response:**
```json
{
  "message": "I understand you're feeling anxious. Anxiety can be overwhelming, but you're not alone. Let's take this one step at a time.",
  "emotion": "anxious",
  "suggestions": [
    "Practice the 4-7-8 breathing technique",
    "Try progressive muscle relaxation",
    "Use grounding techniques (5-4-3-2-1 method)"
  ]
}
```

### POST /emotion
Detect emotion from text input.

**Request Body:**
```json
{
  "text": "I'm feeling really down today"
}
```

**Response:**
```json
{
  "emotion": "sad",
  "confidence": 0.85
}
```

### GET /toolkit
Get toolkit suggestions based on detected emotion.

**Query Parameters:**
- `emotion` (required): The detected emotion

**Response:**
```json
{
  "suggestions": [
    "Try gentle breathing exercises",
    "Write in your journal about your feelings",
    "Listen to calming nature sounds"
  ]
}
```

### POST /track
Track user emotion for analytics.

**Request Body:**
```json
{
  "emotion": "happy",
  "score": 4.2,
  "timestamp": "2024-01-15T10:30:00Z",
  "text": "I'm feeling great today!"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Emotion tracked successfully"
}
```

## Error Responses

All endpoints return errors in this format:

```json
{
  "detail": "Error message describing what went wrong"
}
```

Common HTTP status codes:
- `400`: Bad Request (invalid input)
- `500`: Internal Server Error (server-side issue)

## Rate Limiting

Currently no rate limiting is implemented, but in production you should implement appropriate rate limiting for the chat endpoint.

## Authentication

Currently no authentication is required. In production, implement appropriate authentication and authorization.