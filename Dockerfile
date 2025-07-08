# Multi-stage build for the application
FROM node:18-alpine as frontend-build

# Build frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Python backend
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    cmake \
    libopenblas-dev \
    liblapack-dev \
    pkg-config \
    libhdf5-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend application
COPY app/ ./app/
COPY cert/ ./cert/
COPY uploads/ ./uploads/

# Copy built frontend
COPY --from=frontend-build /app/frontend/dist ./app/static/

# Create uploads directory if it doesn't exist
RUN mkdir -p uploads/profiled

# Expose port
EXPOSE 7777

# Set environment variables
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

# Run the application
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7777", "--ssl-keyfile=cert/key.pem", "--ssl-certfile=cert/cert.pem"]