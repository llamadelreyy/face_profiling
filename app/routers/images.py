# app/routers/images.py

import os
import shutil
import uuid
import logging
import base64 # Added for Base64 encoding

from fastapi import APIRouter, File, UploadFile, Depends, HTTPException, Path
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from werkzeug.utils import secure_filename

# Relative imports for modules within the 'app' package
from ..database import get_db
from ..models import FaceImage as DBImage, FaceCluster # Renamed FaceImage to DBImage
from ..face_utils import (
    get_image_path,
    detect_faces,
    get_face_embeddings,
    serialize_embedding,
    deserialize_embedding,
    is_face_similar,
    get_top_similar_faces,
    find_most_similar_cluster
)
from ..config import UPLOADS_DIR, PROFILED_UPLOADS_DIR # Assuming these are in app.config
from ..utils import allowed_file # Assuming this is in app.utils

router = APIRouter(
    tags=["images"]
)

# Route from main.py lines 68-73
@router.get("/uploads/{filename:path}")
async def serve_upload(filename: str = Path(..., description="The path to the file in the uploads directory")):
    file_path = os.path.join(UPLOADS_DIR, filename) # Using UPLOADS_DIR from app.config
    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path)

# Route from main.py lines 75-80
@router.get("/uploads/profiled/{filename:path}")
async def serve_profiled_upload(filename: str = Path(..., description="The path to the file in the profiled uploads directory")):
    file_path = os.path.join(PROFILED_UPLOADS_DIR, filename) # Using PROFILED_UPLOADS_DIR from app.config
    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path)

# Route from main.py lines 90-228
@router.post("/api/upload_image")
async def upload_image(image: UploadFile = File(...), db: Session = Depends(get_db)):
    if not image.filename:
        raise HTTPException(status_code=400, detail="No selected file (filename is empty)")

    original_filename_for_logging = image.filename
    if not allowed_file(image.filename): # allowed_file from app.utils
        logging.warning(f"File type not allowed for {original_filename_for_logging}")
        raise HTTPException(status_code=400, detail="File type not allowed")

    original_filename = secure_filename(image.filename)
    name, ext = os.path.splitext(original_filename)
    unique_id = uuid.uuid4().hex
    filename = f"{name}_{unique_id}{ext}"
    
    file_path = get_image_path(filename) # This uses UPLOADS_DIR from app.face_utils or app.config
    
    try:
        if not os.path.exists(UPLOADS_DIR): # UPLOADS_DIR from app.config
            os.makedirs(UPLOADS_DIR, exist_ok=True)
        
        with open(file_path, "wb") as local_file_buffer:
            shutil.copyfileobj(image.file, local_file_buffer) # Use image.file
        logging.info(f"File {filename} (original: {original_filename_for_logging}) saved to {file_path}")

        face_detected_initial = detect_faces(file_path)
        embedding_generated = False
        is_new_face_stored = False
        message = ""
        db_image_id = None
        similar_faces_list = []
        matched_cluster_info = None
        db_image_record = None # Renamed from db_image in original main.py snippet
        captured_face_embedding = None # Add this line
    
        if face_detected_initial:
            logging.debug(f"Face detected for {filename}. Attempting to get embeddings.")
            new_embedding_array = get_face_embeddings(file_path)
            
            if new_embedding_array is not None:
                logging.debug(f"Successfully got embedding array for {filename}.")
                embedding_generated = True
                serialized_new_embedding = serialize_embedding(new_embedding_array)
                captured_face_embedding = serialized_new_embedding # Ensure this assignment is correct
                
                if serialized_new_embedding:
                    logging.debug(f"Successfully serialized embedding for {filename}.")
                    db_image_record = DBImage(filename=filename, embedding=serialized_new_embedding) # Using DBImage
                    db.add(db_image_record)
                    db.commit()
                    db.refresh(db_image_record)
                    db_image_id = db_image_record.id
                    is_new_face_stored = True
                    logging.info(f"Stored {filename} with embedding. DB ID: {db_image_id}")

                    try:
                        if not os.path.exists(PROFILED_UPLOADS_DIR): # PROFILED_UPLOADS_DIR from app.config
                            os.makedirs(PROFILED_UPLOADS_DIR, exist_ok=True)
                            logging.info(f"Created directory: {PROFILED_UPLOADS_DIR}")
                        profiled_image_path = os.path.join(PROFILED_UPLOADS_DIR, filename)
                        shutil.copy2(file_path, profiled_image_path)
                        logging.info(f"Saved profiled image {filename} to {profiled_image_path}")
                    except Exception as copy_e:
                        logging.error(f"Failed to save profiled image {filename} to {PROFILED_UPLOADS_DIR}: {str(copy_e)}", exc_info=True)

                    all_face_images_with_embeddings = db.query(DBImage).filter(DBImage.embedding.isnot(None)).all() # Using DBImage
                    known_faces_data_for_similarity_check = []
                    known_embeddings_for_initial_check = []

                    for db_face_image_item in all_face_images_with_embeddings:
                        if db_face_image_item.id == db_image_id:
                            continue
                        deserialized_emb = deserialize_embedding(db_face_image_item.embedding)
                        if deserialized_emb is not None:
                            known_embeddings_for_initial_check.append(deserialized_emb)
                            known_faces_data_for_similarity_check.append({
                                "id": db_face_image_item.id,
                                "filename": db_face_image_item.filename,
                                "embedding": deserialized_emb
                            })
                    
                    if not known_embeddings_for_initial_check or not is_face_similar(new_embedding_array, known_embeddings_for_initial_check):
                        message = "New unique face profile stored with embedding."
                    else:
                        message = "Face stored with embedding. It is similar to existing profiles."
                        similar_faces_list = get_top_similar_faces(new_embedding_array, known_faces_data_for_similarity_check)
                    logging.info(f"Message for {filename}: {message}")

                    all_clusters = db.query(FaceCluster).filter(FaceCluster.centroid_embedding.isnot(None)).all() # Using FaceCluster
                    clusters_data_for_matching = []
                    for cluster_obj in all_clusters:
                        deserialized_centroid = deserialize_embedding(cluster_obj.centroid_embedding)
                        if deserialized_centroid is not None:
                            clusters_data_for_matching.append({
                                "id": cluster_obj.id,
                                "centroid_embedding": deserialized_centroid,
                                "note": cluster_obj.note,
                                "passport_no": cluster_obj.passport_no,
                                "visa": cluster_obj.visa,
                                "expiry": cluster_obj.expiry,
                                "disembarkation": cluster_obj.disembarkation,
                                "airline": cluster_obj.airline,
                                "destination": cluster_obj.destination,
                                "embarkation": cluster_obj.embarkation,
                                "seat_no": cluster_obj.seat_no,
                                "last_entry": cluster_obj.last_entry
                            })
                    
                    if clusters_data_for_matching:
                        matched_cluster_info = find_most_similar_cluster(new_embedding_array, clusters_data_for_matching)
                        if matched_cluster_info:
                            # Log the main info, the full details are in matched_cluster_info
                            logging.info(f"New face matched cluster ID {matched_cluster_info['id']} with note: '{matched_cluster_info.get('note', 'N/A')}' and passport: '{matched_cluster_info.get('passport_no', 'N/A')}'")
                            # Remove non-serializable fields before returning to client
                            if 'centroid_embedding' in matched_cluster_info:
                                del matched_cluster_info['centroid_embedding']
                    else:
                        logging.info("No clusters with embeddings available for matching.")
                else:
                    message = "Failed to serialize the new face embedding. Record not created."
                    logging.warning(f"Serialization failed for {filename}. No DB record created.")
            else:
                embedding_generated = False
                message = "Could not generate face embedding from the image. Record not created."
                logging.warning(f"Embedding generation failed for {filename}. No DB record created.")
        else:
            embedding_generated = False
            message = "No face detected in the uploaded image. Record not created."
            logging.info(f"No face detected in {filename}. No DB record created.")

        # Determine image_url: prefer profiled if available, else original upload
        # For simplicity now, always return the original upload path as the primary display image
        # The frontend can decide if it wants to show a version with drawn boxes if that feature is added later
        image_url = f"/uploads/{filename}" # Path to serve the initially saved image

        return {
            "filename": filename,
            "face_detected": face_detected_initial,
            "embedding_generated": embedding_generated,
            "is_new_face_stored": is_new_face_stored,
            "message": message,
            "db_id": db_image_id,
            "similar_faces": similar_faces_list,
            "matched_cluster": matched_cluster_info,
            "captured_face_embedding": base64.b64encode(captured_face_embedding).decode('utf-8') if embedding_generated and captured_face_embedding else None,
            "image_url": image_url
        }
        
    except FileNotFoundError:
         logging.error(f"File not found after saving {filename}.", exc_info=True)
         raise HTTPException(status_code=500, detail="File not found after saving. Check permissions or disk space.")
    except HTTPException as http_exc:
        if db_image_record and db_image_record.id and not is_new_face_stored : db.rollback()
        raise http_exc
    except Exception as e:
        logging.error(f"Could not process file {filename if 'filename' in locals() else original_filename_for_logging}: {str(e)}", exc_info=True)
        if db_image_record and db_image_record.id and not is_new_face_stored: db.rollback()
        raise HTTPException(status_code=500, detail=f"Could not process file: {str(e)}")
    finally:
        await image.close()