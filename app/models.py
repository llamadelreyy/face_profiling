from sqlalchemy import Column, Integer, String, LargeBinary, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base


class FaceCluster(Base):
    __tablename__ = "face_clusters"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    centroid_embedding = Column(LargeBinary, nullable=True) # Using LargeBinary like in FaceImage
    note = Column(Text, nullable=True)
    passport_no = Column(String, nullable=True)
    visa = Column(String, nullable=True)
    expiry = Column(String, nullable=True) # Assuming expiry is a date string, adjust if DateTime object is preferred
    disembarkation = Column(String, nullable=True)
    airline = Column(String, nullable=True)
    destination = Column(String, nullable=True)
    embarkation = Column(String, nullable=True)
    seat_no = Column(String, nullable=True)
    last_entry = Column(String, nullable=True) # Assuming last_entry is a date string or similar
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # face_images relationship removed as cluster_id is removed from FaceImage
    # face_images = relationship("FaceImage", back_populates="cluster")

    def __repr__(self):
        return f"<FaceCluster(id={self.id})>"


class FaceImage(Base):
    __tablename__ = "face_images"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    filename = Column(String, unique=True, nullable=False, index=True)
    embedding = Column(LargeBinary, nullable=True)  # For storing face embeddings
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    # cluster_id and relationship to FaceCluster removed
    # cluster_id = Column(Integer, ForeignKey("face_clusters.id"), nullable=True)
    # cluster = relationship("FaceCluster", back_populates="face_images")

    def __repr__(self):
        return f"<FaceImage(id={self.id}, filename='{self.filename}')>"

from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class NotePayload(BaseModel):
    notes: str

class CreateClusterFromCandidatePayload(BaseModel):
    centroid_embedding_b64: str # Serialized centroid, base64 encoded
    notes: Optional[str] = None
    passport_no: Optional[str] = None
    visa: Optional[str] = None
    expiry: Optional[str] = None
    disembarkation: Optional[str] = None
    airline: Optional[str] = None
    destination: Optional[str] = None
    embarkation: Optional[str] = None
    seat_no: Optional[str] = None
    last_entry: Optional[str] = None

class UpdateClusterPayload(BaseModel):
    notes: Optional[str] = None
    passport_no: Optional[str] = None
    visa: Optional[str] = None
    expiry: Optional[str] = None
    disembarkation: Optional[str] = None
    airline: Optional[str] = None
    destination: Optional[str] = None
    embarkation: Optional[str] = None
    seat_no: Optional[str] = None
    last_entry: Optional[str] = None
class ClusterBase(BaseModel):
    note: Optional[str] = None
    passport_no: Optional[str] = None
    visa: Optional[str] = None
    expiry: Optional[str] = None
    disembarkation: Optional[str] = None
    airline: Optional[str] = None
    destination: Optional[str] = None
    embarkation: Optional[str] = None
    seat_no: Optional[str] = None
    last_entry: Optional[str] = None

class ClusterCreate(ClusterBase):
    pass

class ClusterOut(ClusterBase):
    id: int
    created_at: datetime
    updated_at: datetime
    representative_image_url: Optional[str] = None
    member_image_count: Optional[int] = None # Added for dynamic count
    passport_no: Optional[str] = None
    visa: Optional[str] = None
    expiry: Optional[str] = None
    disembarkation: Optional[str] = None
    airline: Optional[str] = None
    destination: Optional[str] = None
    embarkation: Optional[str] = None
    seat_no: Optional[str] = None
    last_entry: Optional[str] = None

    class Config:
        from_attributes = True

class ClusterDetailOut(ClusterOut):
    member_image_urls: List[str] = []

    class Config:
        from_attributes = True