# Airport Security System

A comprehensive airport security monitoring system with facial recognition, intrusion detection, and various security modules.

## Features

- **Facial Recognition** - Advanced facial recognition system for gate and terminal security
- **Intrusion Monitoring** - Real-time intrusion detection and alerts
- **Vehicle Tracking** - Vehicle identification and tracking system
- **Scanner Systems** - Body, vehicle, and container scanning modules
- **Alarm Verification** - Automated alarm verification system
- **Arrival/Departure Monitoring** - Flight and passenger tracking
- **Status Processing** - Real-time status monitoring and processing

## Architecture

- **Backend**: FastAPI with Python
- **Frontend**: React with Vite
- **Containerization**: Docker & Docker Compose
- **Security**: HTTPS with SSL certificates

## Quick Start

### Using Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd face_profiling
   ```

2. **Build and run the application**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Open your browser and navigate to: `https://localhost:7777`
   - Accept the SSL certificate warning (for development)

### Manual Setup

1. **Backend Setup**
   ```bash
   pip install -r requirements.txt
   python -m uvicorn app.main:app --host 0.0.0.0 --port 7777 --ssl-keyfile=cert/key.pem --ssl-certfile=cert/cert.pem
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## System Modules

### 1. Homepage (`/home`)
Central dashboard with access to all security modules

### 2. Facial Recognition (`/recognition`)
- Real-time facial recognition
- Face capture and analysis
- Similar face matching
- Database integration

### 3. Intrusion Monitoring (`/intrusion`)
- Perimeter monitoring
- Motion detection
- Alert management

### 4. Vehicle Systems (`/vehicles`)
- Vehicle identification
- License plate recognition
- Tracking and logging

### 5. Scanner Systems (`/scanners`)
- Body scanner integration
- Vehicle scanner monitoring
- Container inspection

### 6. Access Control (`/access`)
- Gate security
- Terminal access control
- Identification verification

## Development

### Project Structure
```
├── app/                    # FastAPI backend
│   ├── main.py            # Application entry point
│   ├── routers/           # API routes
│   └── templates/         # Jinja2 templates (legacy)
├── frontend/              # React frontend
│   ├── src/               # Source code
│   ├── public/            # Static assets
│   └── package.json       # Dependencies
├── cert/                  # SSL certificates
├── uploads/               # File uploads
├── Dockerfile             # Container configuration
├── docker-compose.yml     # Multi-service setup
└── requirements.txt       # Python dependencies
```

### Environment Variables

- `PYTHONPATH`: Python module path
- `PYTHONUNBUFFERED`: Python output buffering
- `SSL_KEYFILE`: SSL private key file path
- `SSL_CERTFILE`: SSL certificate file path

## Security Features

- **HTTPS Encryption**: All communications encrypted
- **SSL Certificates**: Secure certificate-based authentication
- **Access Control**: Role-based access management
- **Data Protection**: Secure file upload and storage

## API Endpoints

- `GET /` - Homepage
- `GET /recognition` - Facial recognition interface
- `POST /analyze` - Face analysis endpoint
- `GET /clusters` - Face clustering results
- `POST /upload` - File upload endpoint

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Troubleshooting

### SSL Certificate Issues
If you encounter SSL certificate warnings:
1. Click "Advanced" in your browser
2. Click "Proceed to localhost (unsafe)"
3. This is normal for development environments

### Camera Access
Ensure your browser has camera permissions enabled for the application.

### Port Conflicts
If port 7777 is in use, modify the port in `docker-compose.yml` or run:
```bash
docker-compose up --build -p 8888:7777
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.