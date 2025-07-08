# app/routers/clusters.py
import logging # Standard logging
import os
import base64
from typing import List, Dict, Any, Optional

from fastapi import APIRouter, Depends, HTTPException, Path, Body
from pydantic import BaseModel # BaseModel is already imported via fastapi
from sqlalchemy.orm import Session
import numpy as np

from app.face_utils import deserialize_embedding # Assuming calculate_embedding_distance might be added here later if complex
from app import config
from app.database import get_db
from app.models import FaceCluster, FaceImage, ClusterOut, ClusterDetailOut, NotePayload, CreateClusterFromCandidatePayload, UpdateClusterPayload # Added CreateClusterFromCandidatePayload and FaceImage

# Pydantic model for the request body of the new endpoint
class EmbeddingPayload(BaseModel): # This is for /related endpoint, not the new one
    embedding: str

class RelatedClusterOut(ClusterOut): # Extend ClusterOut to include distance
    distance: Optional[float] = None
    image_count: Optional[int] = None # This will be calculated dynamically


# Construct the base URL path for profiled images from config
PROFILED_IMAGES_URL_PREFIX = f"/{os.path.basename(config.UPLOADS_DIR)}/{os.path.basename(config.PROFILED_UPLOADS_DIR)}"

router = APIRouter(
    prefix="/api/clusters",
    tags=["clusters"]
)

# New Route: Create a cluster from a candidate
@router.post("/from_candidate", response_model=ClusterOut, status_code=201)
async def create_cluster_from_candidate(
    payload: CreateClusterFromCandidatePayload,
    db: Session = Depends(get_db)
):
    try:
        centroid_bytes = base64.b64decode(payload.centroid_embedding_b64)
        if not centroid_bytes: # Basic validation
            raise HTTPException(status_code=400, detail="Centroid embedding cannot be empty after decoding.")

        expected_dim = 128
        expected_byte_length = expected_dim * 8 # Assuming float64 (np.float64().itemsize)
        if len(centroid_bytes) != expected_byte_length:
             logging.warning(f"Decoded centroid byte length {len(centroid_bytes)} does not match expected {expected_byte_length}. Proceeding, but ensure it's valid.")
             # Consider raising HTTPException if strict validation is required here.

        new_cluster = FaceCluster(
            centroid_embedding=centroid_bytes,
            note=payload.notes,
            passport_no=payload.passport_no,
            visa=payload.visa,
            expiry=payload.expiry,
            disembarkation=payload.disembarkation,
            airline=payload.airline,
            destination=payload.destination,
            embarkation=payload.embarkation,
            seat_no=payload.seat_no,
            last_entry=payload.last_entry
        )
        db.add(new_cluster)
        db.commit()
        db.refresh(new_cluster)
        
        logging.info(f"Successfully created new FaceCluster ID {new_cluster.id} from candidate.")

        # For ClusterOut, representative_image_url will be None here.
        # It's determined dynamically by list_all_clusters or get_cluster_info.
        return ClusterOut(
            id=new_cluster.id,
            note=new_cluster.note,
            passport_no=new_cluster.passport_no,
            visa=new_cluster.visa,
            expiry=new_cluster.expiry,
            disembarkation=new_cluster.disembarkation,
            airline=new_cluster.airline,
            destination=new_cluster.destination,
            embarkation=new_cluster.embarkation,
            seat_no=new_cluster.seat_no,
            last_entry=new_cluster.last_entry,
            created_at=new_cluster.created_at,
            updated_at=new_cluster.updated_at,
            representative_image_url=None
        )
    except HTTPException as http_exc:
        db.rollback()
        raise http_exc
    except Exception as e:
        db.rollback()
        logging.error(f"Error creating cluster from candidate: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Could not create cluster from candidate: {str(e)}")


# Route 1 (now 2): Add/Update notes and other details for a cluster
@router.put("/{cluster_id}", response_model=ClusterOut) # Changed to PUT and path to /
async def update_cluster_details( # Renamed function
    cluster_id: int = Path(..., description="The ID of the cluster", ge=1),
    payload: UpdateClusterPayload = Body(...), # Reusing this payload as it contains all editable fields
    db: Session = Depends(get_db)
):
    try:
        cluster = db.query(FaceCluster).filter(FaceCluster.id == cluster_id).first()
        if not cluster:
            raise HTTPException(status_code=404, detail=f"FaceCluster with id {cluster_id} not found")

        # Update fields from payload if they are provided
        update_data = payload.model_dump(exclude_unset=True) # Pydantic v2

        if "notes" in update_data: # 'notes' from payload maps to 'note' in DB
            cluster.note = update_data["notes"]
        if "passport_no" in update_data:
            cluster.passport_no = update_data["passport_no"]
        if "visa" in update_data:
            cluster.visa = update_data["visa"]
        if "expiry" in update_data:
            cluster.expiry = update_data["expiry"]
        if "disembarkation" in update_data:
            cluster.disembarkation = update_data["disembarkation"]
        if "airline" in update_data:
            cluster.airline = update_data["airline"]
        if "destination" in update_data:
            cluster.destination = update_data["destination"]
        if "embarkation" in update_data:
            cluster.embarkation = update_data["embarkation"]
        if "seat_no" in update_data:
            cluster.seat_no = update_data["seat_no"]
        if "last_entry" in update_data:
            cluster.last_entry = update_data["last_entry"]
        
        # centroid_embedding_b64 is not updatable here, only other metadata

        db.commit()
        db.refresh(cluster)
        
        representative_image_url = None # Keep this logic simple for update endpoint
        # If needed, logic to find representative image can be added, similar to get_cluster_info

        return ClusterOut(
            id=cluster.id,
            note=cluster.note,
            passport_no=cluster.passport_no,
            visa=cluster.visa,
            expiry=cluster.expiry,
            disembarkation=cluster.disembarkation,
            airline=cluster.airline,
            destination=cluster.destination,
            embarkation=cluster.embarkation,
            seat_no=cluster.seat_no,
            last_entry=cluster.last_entry,
            created_at=cluster.created_at,
            updated_at=cluster.updated_at, # This will be auto-updated by onupdate=func.now()
            representative_image_url=representative_image_url,
            member_image_count=None # Not calculated here, can be fetched separately if needed
        )
    except HTTPException as http_exc:
        db.rollback()
        raise http_exc
    except Exception as e:
        db.rollback()
        logging.error(f"Error updating details for cluster {cluster_id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Could not update details for cluster {cluster_id}: {str(e)}")

# Route 2: Delete notes for a cluster - This can be removed if PUT /{cluster_id} handles clearing notes by passing null/empty.
# Or kept if explicit note deletion endpoint is desired. For now, let's assume PUT handles it.
# If you want to keep it, ensure it only targets `note` field.
# For this refactoring, I'll comment it out, assuming the PUT endpoint is sufficient.
# @router.delete("/{cluster_id}/notes", response_model=ClusterOut)
# async def delete_cluster_note( ... ):
    # ... (implementation for deleting only note)

# Route 3: Get details of a specific cluster
@router.get("/{cluster_id}", response_model=ClusterDetailOut)
async def get_cluster_info(
    cluster_id: int = Path(..., description="The ID of the cluster", ge=1),
    db: Session = Depends(get_db)
):
    try:
        cluster = db.query(FaceCluster).filter(FaceCluster.id == cluster_id).first()
        if not cluster:
            raise HTTPException(status_code=404, detail=f"FaceCluster with id {cluster_id} not found")
        if not cluster.centroid_embedding:
            # This case should ideally not happen if clusters are created with centroids.
            logging.warning(f"Cluster {cluster_id} has no centroid embedding. Cannot find members.")
            # Return empty members or raise error, depending on desired behavior.
            # For now, let's return empty, but this indicates a data integrity issue.
            return ClusterDetailOut(
                id=cluster.id,
                note=cluster.note,
                passport_no=cluster.passport_no,
                visa=cluster.visa,
                expiry=cluster.expiry,
                disembarkation=cluster.disembarkation,
                airline=cluster.airline,
                destination=cluster.destination,
                embarkation=cluster.embarkation,
                seat_no=cluster.seat_no,
                last_entry=cluster.last_entry,
                created_at=cluster.created_at,
                updated_at=cluster.updated_at,
                representative_image_url=None,
                member_image_urls=[]
            )

        cluster_centroid_np = deserialize_embedding(cluster.centroid_embedding)
        if cluster_centroid_np is None:
            logging.error(f"Could not deserialize centroid for cluster {cluster_id} in get_cluster_info.")
            raise HTTPException(status_code=500, detail=f"Could not process centroid for cluster {cluster_id}.")

        all_images_db = db.query(FaceImage).filter(FaceImage.embedding != None).all()
        member_image_urls = []
        representative_image_url = None
        
        norm_cluster_centroid = cluster_centroid_np / np.linalg.norm(cluster_centroid_np)
        
        candidate_members_for_rep_image = []

        for img_db in all_images_db:
            img_embedding_np = deserialize_embedding(img_db.embedding)
            if img_embedding_np is None:
                continue
            
            try:
                norm_img_embedding = img_embedding_np / np.linalg.norm(img_embedding_np)
                similarity = np.dot(norm_cluster_centroid, norm_img_embedding)
                distance = 1 - similarity
            except Exception as e:
                logging.error(f"Error calculating distance for image {img_db.id} to cluster {cluster_id} in get_cluster_info: {e}")
                continue

            if distance < config.RELATED_CLUSTER_MAX_DISTANCE:
                img_url = f"{PROFILED_IMAGES_URL_PREFIX}/{img_db.filename}"
                member_image_urls.append(img_url)
                candidate_members_for_rep_image.append({"url": img_url, "distance": distance})
        
        if candidate_members_for_rep_image:
            candidate_members_for_rep_image.sort(key=lambda x: x["distance"])
            representative_image_url = candidate_members_for_rep_image[0]["url"]
        
        return ClusterDetailOut(
            id=cluster.id,
            note=cluster.note,
            passport_no=cluster.passport_no,
            visa=cluster.visa,
            expiry=cluster.expiry,
            disembarkation=cluster.disembarkation,
            airline=cluster.airline,
            destination=cluster.destination,
            embarkation=cluster.embarkation,
            seat_no=cluster.seat_no,
            last_entry=cluster.last_entry,
            created_at=cluster.created_at,
            updated_at=cluster.updated_at,
            representative_image_url=representative_image_url,
            member_image_urls=member_image_urls
        )
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        logging.error(f"Error retrieving cluster {cluster_id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Could not retrieve cluster {cluster_id}: {str(e)}")

# Route 4: Get all clusters
@router.get("", response_model=List[ClusterOut]) # Path is "" for /api/clusters
async def list_all_clusters(db: Session = Depends(get_db)):
    try:
        clusters_db = db.query(FaceCluster).all()
        response_data = []
        # Fetch all images with embeddings once to avoid repeated DB calls inside the loop
        all_images_db = db.query(FaceImage).filter(FaceImage.embedding != None).all()

        for cluster_item in clusters_db:
            representative_image_url = None
            member_image_count = 0 # Initialize count for this cluster

            if cluster_item.centroid_embedding:
                cluster_centroid_np = deserialize_embedding(cluster_item.centroid_embedding)
                if cluster_centroid_np is not None:
                    norm_cluster_centroid = cluster_centroid_np / np.linalg.norm(cluster_centroid_np)
                    
                    closest_distance_for_rep = float('inf')
                    
                    # Count members for the current cluster_item
                    current_cluster_member_count = 0
                    for img_db in all_images_db:
                        if current_cluster_member_count >= 100: # Stop counting if limit is reached
                            break

                        img_embedding_np = deserialize_embedding(img_db.embedding)
                        if img_embedding_np is None:
                            continue
                        
                        try:
                            norm_img_embedding = img_embedding_np / np.linalg.norm(img_embedding_np)
                            similarity = np.dot(norm_cluster_centroid, norm_img_embedding)
                            distance = 1 - similarity
                        except Exception as e:
                            logging.warning(f"Could not calculate distance for image {img_db.id} to cluster {cluster_item.id} in list_all_clusters: {e}")
                            continue

                        if distance < config.RELATED_CLUSTER_MAX_DISTANCE:
                            current_cluster_member_count += 1
                            if distance < closest_distance_for_rep: # Still find best representative
                                closest_distance_for_rep = distance
                                representative_image_url = f"{PROFILED_IMAGES_URL_PREFIX}/{img_db.filename}"
                    member_image_count = current_cluster_member_count
            
            response_data.append(ClusterOut(
                id=cluster_item.id,
                note=cluster_item.note,
                passport_no=cluster_item.passport_no,
                visa=cluster_item.visa,
                expiry=cluster_item.expiry,
                disembarkation=cluster_item.disembarkation,
                airline=cluster_item.airline,
                destination=cluster_item.destination,
                embarkation=cluster_item.embarkation,
                seat_no=cluster_item.seat_no,
                last_entry=cluster_item.last_entry,
                created_at=cluster_item.created_at,
                updated_at=cluster_item.updated_at,
                representative_image_url=representative_image_url,
                member_image_count=member_image_count
            ))
        return response_data
    except Exception as e:
        logging.error(f"Error retrieving all clusters: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Could not retrieve all clusters: {str(e)}")

# Route 5: Get clusters related to a given embedding
@router.post("/related", response_model=List[RelatedClusterOut])
async def get_related_clusters(
    payload: EmbeddingPayload = Body(...),
    db: Session = Depends(get_db)
):
    try:
        input_embedding_str = payload.embedding
        if not input_embedding_str:
            raise HTTPException(status_code=400, detail="Embedding string cannot be empty.")

        try:
            embedding_bytes = base64.b64decode(input_embedding_str)
        except Exception as e:
            logging.error(f"Base64 decoding failed for input embedding: {e}")
            raise HTTPException(status_code=400, detail="Invalid Base64 encoding for embedding.")

        input_embedding = deserialize_embedding(embedding_bytes)
        if input_embedding is None:
            # The deserialize_embedding function logs details, so a generic message here is fine.
            raise HTTPException(status_code=400, detail="Invalid input embedding format or content after decoding.")

        clusters_db = db.query(FaceCluster).filter(FaceCluster.centroid_embedding.isnot(None)).all()
        
        related_clusters_data = []
        for cluster_item in clusters_db:
            centroid_emb_str = cluster_item.centroid_embedding
            if not centroid_emb_str:
                continue
            
            logging.info(f"DEBUG: Retrieved centroid_embedding for cluster ID {cluster_item.id}. Byte length: {len(centroid_emb_str)}") # ADDED LOG

            centroid_embedding = deserialize_embedding(centroid_emb_str)
            if centroid_embedding is None:
                # The deserialize_embedding function itself logs the "not a multiple" error,
                # so the warning here is for the higher-level context.
                logging.warning(f"Could not deserialize centroid embedding for cluster ID {cluster_item.id} (deserialize_embedding returned None).")
                continue
            
            # Calculate distance (e.g., Euclidean distance)
            # Ensure both embeddings are numpy arrays for this calculation
            try:
                # distance = np.linalg.norm(input_embedding - centroid_embedding)
                # Using cosine similarity, then converting to a distance-like measure (1 - similarity)
                # Higher similarity = smaller distance
                similarity = np.dot(input_embedding, centroid_embedding) / (np.linalg.norm(input_embedding) * np.linalg.norm(centroid_embedding))
                distance = 1 - similarity # Convert similarity to distance (0 means identical, 2 means opposite)

            except Exception as e:
                logging.error(f"Error calculating distance for cluster {cluster_item.id}: {str(e)}")
                distance = float('inf') # Assign a large distance if calculation fails

            representative_image_url = None # To be determined for this related cluster
            image_count = 0 # To be determined for this related cluster

            if cluster_item.centroid_embedding:
                # This is the centroid of the `cluster_item` (one of the related clusters)
                cluster_item_centroid_np = deserialize_embedding(cluster_item.centroid_embedding)
                if cluster_item_centroid_np is not None:
                    norm_cluster_item_centroid = cluster_item_centroid_np / np.linalg.norm(cluster_item_centroid_np)
                    
                    # We need all_images_db again here. It was fetched at the start of get_related_clusters.
                    # Let's assume `all_face_images_for_related` is the variable holding them from the outer scope.
                    # If not, it would need to be db.query(FaceImage)...all() again, which is inefficient.
                    # The current code for get_related_clusters does not pre-fetch all_images_db.
                    # For correctness and to avoid NameError, let's fetch it here, but note inefficiency.
                    # A better approach would be to pass `all_images_db` if fetched once.
                    temp_all_images_for_related_member_check = db.query(FaceImage).filter(FaceImage.embedding != None).all()


                    closest_img_dist_related = float('inf')
                    
                    for img_db_related in temp_all_images_for_related_member_check:
                        img_emb_np_related = deserialize_embedding(img_db_related.embedding)
                        if img_emb_np_related is None: continue
                        
                        try:
                            norm_img_emb_related = img_emb_np_related / np.linalg.norm(img_emb_np_related)
                            sim_to_item_centroid = np.dot(norm_cluster_item_centroid, norm_img_emb_related)
                            dist_to_item_centroid = 1 - sim_to_item_centroid
                        except Exception as e:
                            logging.warning(f"Dist calc error for img {img_db_related.id} vs cluster {cluster_item.id} in related: {e}")
                            continue

                        if dist_to_item_centroid < config.RELATED_CLUSTER_MAX_DISTANCE:
                            image_count += 1
                            if dist_to_item_centroid < closest_img_dist_related:
                                closest_img_dist_related = dist_to_item_centroid
                                representative_image_url = f"{PROFILED_IMAGES_URL_PREFIX}/{img_db_related.filename}"
            else:
                logging.warning(f"Cluster item {cluster_item.id} in related search has no centroid. Cannot determine rep image/count.")


            related_clusters_data.append(RelatedClusterOut(
                id=cluster_item.id,
                note=cluster_item.note,
                passport_no=cluster_item.passport_no,
                visa=cluster_item.visa,
                expiry=cluster_item.expiry,
                disembarkation=cluster_item.disembarkation,
                airline=cluster_item.airline,
                destination=cluster_item.destination,
                embarkation=cluster_item.embarkation,
                seat_no=cluster_item.seat_no,
                last_entry=cluster_item.last_entry,
                created_at=cluster_item.created_at,
                updated_at=cluster_item.updated_at,
                representative_image_url=representative_image_url,
                distance=distance,
                image_count=image_count
            ))
        
        # Sort clusters by distance (ascending)
        related_clusters_data.sort(key=lambda x: x.distance if x.distance is not None else float('inf'))

        # Filter by distance and limit results
        filtered_clusters = [
            cluster for cluster in related_clusters_data
            if cluster.distance is not None and cluster.distance < config.RELATED_CLUSTER_MAX_DISTANCE
        ]
        
        return filtered_clusters[:config.RELATED_CLUSTER_MAX_RESULTS]

    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        logging.error(f"Error retrieving related clusters: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Could not retrieve related clusters: {str(e)}")
