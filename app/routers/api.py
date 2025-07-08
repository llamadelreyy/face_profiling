from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import base64
import io
from PIL import Image
import face_recognition
import numpy as np
import os
import uuid
from typing import List, Dict, Any

router = APIRouter(prefix="/api")

class ImageAnalysisRequest(BaseModel):
    image: str

class FaceLocation(BaseModel):
    top: int
    right: int
    bottom: int
    left: int

class FaceResult(BaseModel):
    confidence: float
    location: FaceLocation
    encoding: bool = True

class SimilarFace(BaseModel):
    filename: str
    distance: float

class AnalysisResponse(BaseModel):
    success: bool
    message: str = ""
    faces: List[FaceResult] = []
    similar_faces: List[SimilarFace] = []

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_image(request: ImageAnalysisRequest):
    try:
        # Decode base64 image
        image_data = request.image.split(',')[1] if ',' in request.image else request.image
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Convert to numpy array
        image_array = np.array(image)
        
        # Find face locations and encodings
        face_locations = face_recognition.face_locations(image_array)
        face_encodings = face_recognition.face_encodings(image_array, face_locations)
        
        if not face_locations:
            return AnalysisResponse(
                success=True,
                message="No faces detected in the image",
                faces=[],
                similar_faces=[]
            )
        
        # Process each detected face
        faces = []
        similar_faces = []
        
        for i, (face_location, face_encoding) in enumerate(zip(face_locations, face_encodings)):
            top, right, bottom, left = face_location
            
            face_result = FaceResult(
                confidence=0.95,  # Placeholder confidence
                location=FaceLocation(top=top, right=right, bottom=bottom, left=left),
                encoding=True
            )
            faces.append(face_result)
            
            # Find similar faces (placeholder implementation)
            # In a real implementation, you would compare against a database of known faces
            similar_faces.extend([
                SimilarFace(filename="person_001.jpg", distance=0.85),
                SimilarFace(filename="person_002.jpg", distance=0.72)
            ])
        
        return AnalysisResponse(
            success=True,
            message="Analysis completed successfully",
            faces=faces,
            similar_faces=similar_faces[:5]  # Limit to top 5 matches
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Airport Security API"}

@router.get("/system-status")
async def get_system_status():
    return {
        "modules": {
            "facial_recognition": {"status": "online", "last_check": "2024-01-01T12:00:00Z"},
            "alarm_verification": {"status": "online", "last_check": "2024-01-01T12:00:00Z"},
            "intrusion_monitoring": {"status": "online", "last_check": "2024-01-01T12:00:00Z"},
            "vehicle_tracking": {"status": "online", "last_check": "2024-01-01T12:00:00Z"},
            "body_scanner": {"status": "online", "last_check": "2024-01-01T12:00:00Z"},
            "vehicle_scanner": {"status": "online", "last_check": "2024-01-01T12:00:00Z"},
            "container_scanner": {"status": "online", "last_check": "2024-01-01T12:00:00Z"},
            "identification_tracking": {"status": "online", "last_check": "2024-01-01T12:00:00Z"},
            "gate_security": {"status": "online", "last_check": "2024-01-01T12:00:00Z"},
            "terminal_security": {"status": "online", "last_check": "2024-01-01T12:00:00Z"},
            "security_check": {"status": "online", "last_check": "2024-01-01T12:00:00Z"}
        },
        "overall_status": "operational",
        "active_alerts": 0,
        "system_health": 98
    }