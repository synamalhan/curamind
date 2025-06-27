# CuraMind Deployment Guide

## Production Deployment Options

### Option 1: Docker Deployment

1. Create `Dockerfile` for the backend:
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY backend/requirements.txt .
RUN pip install -r requirements.txt

COPY backend/ .
COPY models/ ../models/

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

2. Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  backend:
    build: .
    ports:
      - "8000:8000"
    environment:
      - OLLAMA_URL=http://ollama:11434
    depends_on:
      - ollama
  
  ollama:
    image: ollama/ollama
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    
volumes:
  ollama_data:
```

### Option 2: Cloud Deployment

#### Frontend (Netlify/Vercel)
1. Build the frontend: `npm run build`
2. Deploy the `dist/` folder to Netlify or Vercel
3. Set environment variables for API URL

#### Backend (Railway/Render/DigitalOcean)
1. Deploy the backend to a cloud service
2. Set up environment variables
3. Configure Ollama or use cloud LLM APIs

### Option 3: Self-Hosted

#### Requirements
- Ubuntu 20.04+ or similar Linux distribution
- 4GB+ RAM (8GB recommended for LLM)
- 20GB+ storage
- Domain name and SSL certificate

#### Setup Steps

1. **Install dependencies:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Python
sudo apt install python3 python3-pip python3-venv -y

# Install Nginx
sudo apt install nginx -y
```

2. **Deploy backend:**
```bash
# Clone repository
git clone https://github.com/yourusername/curamind.git
cd curamind

# Set up Python environment
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create systemd service
sudo nano /etc/systemd/system/curamind-backend.service
```

Service file content:
```ini
[Unit]
Description=CuraMind Backend
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/path/to/curamind/backend
Environment=PATH=/path/to/curamind/backend/venv/bin
ExecStart=/path/to/curamind/backend/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

3. **Deploy frontend:**
```bash
# Build frontend
cd ../
npm install
npm run build

# Copy to web directory
sudo cp -r dist/* /var/www/html/
```

4. **Configure Nginx:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

5. **Install SSL certificate:**
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com
```

6. **Start services:**
```bash
sudo systemctl enable curamind-backend
sudo systemctl start curamind-backend
sudo systemctl reload nginx
```

## Environment Variables for Production

### Frontend (.env.production)
```env
VITE_API_URL=https://yourdomain.com/api
VITE_APP_NAME=CuraMind
VITE_VERSION=1.0.0
```

### Backend
```env
ENVIRONMENT=production
OLLAMA_URL=http://localhost:11434
MODEL_NAME=mistral
CORS_ORIGINS=https://yourdomain.com
LOG_LEVEL=INFO
```

## Monitoring and Maintenance

### Health Checks
Implement health check endpoints:

```python
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow(),
        "version": "1.0.0"
    }
```

### Logging
Configure proper logging for production:

```python
import logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/var/log/curamind/app.log'),
        logging.StreamHandler()
    ]
)
```

### Backup Strategy
- Database backups (if using persistent storage)
- Configuration backups
- Model backups
- Regular system snapshots

### Security Considerations
- Enable HTTPS everywhere
- Implement rate limiting
- Add input validation and sanitization
- Regular security updates
- Monitor for suspicious activity
- Implement proper CORS policies