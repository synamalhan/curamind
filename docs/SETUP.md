# CuraMind Setup Guide

## Prerequisites

- Node.js 18+ and npm
- Python 3.8+ and pip
- Ollama (for local LLM)

## Frontend Setup

1. Navigate to the project root:
   ```bash
   cd curamind
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the FastAPI server:
   ```bash
   python main.py
   ```

The backend API will be available at `http://localhost:8000`

## Ollama Setup

1. Install Ollama from https://ollama.com

2. Pull the Mistral model:
   ```bash
   ollama pull mistral
   ```

3. Verify the model is running:
   ```bash
   ollama list
   ```

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:8000
OLLAMA_URL=http://localhost:11434
MODEL_NAME=mistral
```

## Development Workflow

1. Start Ollama service
2. Start the backend server (`python backend/main.py`)
3. Start the frontend dev server (`npm run dev`)
4. Open `http://localhost:5173` in your browser

## Production Build

1. Build the frontend:
   ```bash
   npm run build
   ```

2. The built files will be in the `dist/` directory

## Troubleshooting

### Common Issues

1. **Ollama not connecting**: Ensure Ollama is running and the model is pulled
2. **CORS errors**: Check that the backend allows the frontend origin
3. **Emotion detection failing**: The app will fallback to rule-based detection
4. **Voice input not working**: Ensure HTTPS or localhost for Web Speech API

### Logs

- Frontend: Check browser console
- Backend: Check terminal output
- Ollama: Check Ollama logs with `ollama logs`