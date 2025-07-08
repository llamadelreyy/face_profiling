import numpy as np
from sklearn.cluster import DBSCAN
from sqlalchemy.orm import Session
import pickle # For serializing/deserializing embeddings
import os # Added for path manipulation
import base64 # Added for encoding bytes to string

from .database import SessionLocal
from .models import FaceImage, FaceCluster # FaceCluster is still needed to read existing centroids
import logging
from .face_utils import deserialize_embedding
from . import config # Import the config module

# Logging is configured in config.py
logger = logging.getLogger(__name__)

# Construct the base URL path for profiled images, similar to routers/clusters.py
PROFILED_IMAGES_URL_PREFIX_UTIL = f"/{os.path.basename(config.UPLOADS_DIR)}/{os.path.basename(config.PROFILED_UPLOADS_DIR)}"

def get_unclustered_embeddings(db: Session):
    """
    Fetches face embeddings that are not sufficiently similar to any existing cluster's centroid.
    (Option B from user feedback)
    """
    all_face_images_db = db.query(FaceImage).filter(FaceImage.embedding != None).all()
    existing_clusters_db = db.query(FaceCluster).filter(FaceCluster.centroid_embedding != None).all()

    unclustered_embeddings_list = []
    unclustered_image_ids = [] # Store original FaceImage IDs

    if not existing_clusters_db:
        # If no clusters exist, all images with embeddings are considered "unclustered"
        logger.info("No existing clusters found. All valid face images will be considered for clustering.")
        for fi in all_face_images_db:
            embedding_array = deserialize_embedding(fi.embedding)
            if embedding_array is not None:
                unclustered_embeddings_list.append(embedding_array)
                unclustered_image_ids.append(fi.id)
            else:
                logger.warning(f"Could not deserialize embedding for FaceImage ID: {fi.id} during initial unclustered fetch. Skipping.")
        if not unclustered_embeddings_list:
            return np.array([]), []
        return np.array(unclustered_embeddings_list), unclustered_image_ids

    # Deserialize all existing cluster centroids once
    existing_centroids = []
    for cluster in existing_clusters_db:
        centroid_emb = deserialize_embedding(cluster.centroid_embedding)
        if centroid_emb is not None:
            existing_centroids.append(centroid_emb)
        else:
            logger.warning(f"Could not deserialize centroid for existing FaceCluster ID: {cluster.id}. Skipping this centroid for comparison.")
    
    if not existing_centroids:
        logger.info("No valid existing cluster centroids found after deserialization. All valid face images will be considered for clustering.")
        for fi in all_face_images_db:
            embedding_array = deserialize_embedding(fi.embedding)
            if embedding_array is not None:
                unclustered_embeddings_list.append(embedding_array)
                unclustered_image_ids.append(fi.id)
            else:
                logger.warning(f"Could not deserialize embedding for FaceImage ID: {fi.id} (no valid centroids path). Skipping.")
        if not unclustered_embeddings_list:
            return np.array([]), []
        return np.array(unclustered_embeddings_list), unclustered_image_ids

    existing_centroids_matrix = np.array(existing_centroids)

    for fi in all_face_images_db:
        img_embedding_array = deserialize_embedding(fi.embedding)
        if img_embedding_array is None:
            logger.warning(f"Could not deserialize embedding for FaceImage ID: {fi.id} when checking against existing clusters. Skipping.")
            continue

        is_sufficiently_clustered = False
        # Calculate distance to all existing cluster centroids
        # Using cosine similarity, then converting to a distance-like measure (1 - similarity)
        # Higher similarity = smaller distance
        try:
            # Normalize image embedding and centroids for cosine similarity
            norm_img_embedding = img_embedding_array / np.linalg.norm(img_embedding_array)
            norm_centroids_matrix = existing_centroids_matrix / np.linalg.norm(existing_centroids_matrix, axis=1, keepdims=True)
            
            similarities = np.dot(norm_centroids_matrix, norm_img_embedding)
            distances = 1 - similarities # Convert similarity to distance

            min_distance = np.min(distances)

            if min_distance < config.RELATED_CLUSTER_MAX_DISTANCE:
                is_sufficiently_clustered = True
        except Exception as e:
            logger.error(f"Error calculating distance for FaceImage ID {fi.id} against existing centroids: {e}. Treating as unclustered for safety.")
            # Default to not clustered if distance calculation fails

        if not is_sufficiently_clustered:
            unclustered_embeddings_list.append(img_embedding_array)
            unclustered_image_ids.append(fi.id) # Store original FaceImage ID
            
    if not unclustered_embeddings_list:
        return np.array([]), []
        
    return np.array(unclustered_embeddings_list), unclustered_image_ids


def perform_dbscan_clustering(embeddings_matrix: np.ndarray, eps: float = config.DBSCAN_EPS, min_samples: int = config.DBSCAN_MIN_SAMPLES):
    """
    Performs DBSCAN clustering on the provided embeddings matrix.
    Uses DBSCAN_EPS and DBSCAN_MIN_SAMPLES from config.py as defaults.
    """
    if embeddings_matrix.ndim == 1: # Handle case with a single embedding or incorrect shape
        if embeddings_matrix.size == 0:
            return np.array([]), np.array([]) # No data to cluster
        # Reshape if it's a single embedding vector
        embeddings_matrix = embeddings_matrix.reshape(1, -1)
    
    if embeddings_matrix.shape[0] < min_samples:
        # Not enough samples to form a cluster according to min_samples
        # Treat all as noise or handle as per specific strategy
        logger.warning(f"Not enough samples ({embeddings_matrix.shape[0]}) for DBSCAN with min_samples={min_samples}. Marking all as noise.")
        return np.array([-1] * embeddings_matrix.shape[0]), embeddings_matrix # All noise

    dbscan = DBSCAN(eps=eps, min_samples=min_samples, metric='euclidean')
    try:
        labels = dbscan.fit_predict(embeddings_matrix)
    except ValueError as e:
        logger.error(f"Error during DBSCAN fitting: {e}. This might be due to incompatible data.")
        # Fallback: treat all as noise
        labels = np.array([-1] * embeddings_matrix.shape[0])
        
    return labels, embeddings_matrix


def calculate_centroid(cluster_embeddings_list: np.ndarray):
    """
    Calculates the centroid of a list of embeddings.
    """
    if cluster_embeddings_list.ndim == 1: # Single embedding in cluster
        return cluster_embeddings_list
    return np.mean(cluster_embeddings_list, axis=0)

def identify_candidate_clusters(db: Session, eps: float = config.DBSCAN_EPS, min_samples: int = config.DBSCAN_MIN_SAMPLES):
    """
    Identifies potential new clusters from unclustered face embeddings.
    Does NOT create FaceCluster records in the database.
    Returns a list of candidate clusters, each with its centroid, representative image URL, and member count.
    """
    logger.info(f"Starting candidate cluster identification with eps={eps} and min_samples={min_samples}...")
    
    # original_image_ids corresponds to the FaceImage.id for each embedding in embeddings_matrix
    embeddings_matrix, original_image_ids = get_unclustered_embeddings(db)

    if embeddings_matrix.size == 0:
        logger.info("No unclustered embeddings found to process for candidate identification.")
        return {
            "message": "No unclustered embeddings found to process.",
            "candidate_clusters": [],
            "embeddings_considered": 0
        }

    embeddings_considered_count = embeddings_matrix.shape[0]
    logger.info(f"Retrieved {embeddings_considered_count} unclustered embeddings for candidate identification.")

    # Ensure embeddings_matrix is 2D
    if embeddings_matrix.ndim == 1:
        if embeddings_matrix.size > 0 :
             embeddings_matrix = embeddings_matrix.reshape(1, -1)
        else: # Should not happen if size check above is robust
            logger.warning("Embeddings matrix is 1D but also empty after initial checks for candidate identification.")
            return {
                "message": "Embeddings matrix became empty unexpectedly.",
                "candidate_clusters": [],
                "embeddings_considered": 0
            }

    cluster_labels, processed_embeddings = perform_dbscan_clustering(embeddings_matrix, eps=eps, min_samples=min_samples)
    
    unique_labels = set(cluster_labels)
    num_potential_clusters_found = len(unique_labels) - (1 if -1 in unique_labels else 0)
    num_noise_points = np.sum(cluster_labels == -1)
    logger.info(f"DBSCAN identified {num_potential_clusters_found} potential new clusters and {num_noise_points} noise points from the unclustered set.")

    candidate_clusters_list = []

    for label in unique_labels:
        if label == -1:  # Skip noise points
            continue

        # These indices are relative to the `processed_embeddings` (and `original_image_ids`)
        cluster_member_indices = np.where(cluster_labels == label)[0]
        
        if cluster_member_indices.size == 0:
            logger.warning(f"Potential cluster label {label} has no members. Skipping.")
            continue

        current_potential_cluster_embeddings = processed_embeddings[cluster_member_indices]
        
        if current_potential_cluster_embeddings.size == 0:
            logger.warning(f"No embeddings found for potential cluster label {label} after indexing. Skipping.")
            continue

        centroid = calculate_centroid(current_potential_cluster_embeddings)
        
        # Validate centroid (type, dtype, shape)
        if not isinstance(centroid, np.ndarray):
            logger.error(f"Centroid for potential cluster {label} is not a numpy array (type: {type(centroid)}). Skipping.")
            continue
        if centroid.dtype != np.float64: # Assuming float64 is standard
            try:
                centroid = centroid.astype(np.float64)
            except Exception as e:
                logger.error(f"Failed to cast centroid for potential cluster {label} to np.float64: {e}. Skipping.")
                continue
        
        expected_embedding_dim = 128 # Assuming 128-dim embeddings
        if not (centroid.ndim == 1 and centroid.size == expected_embedding_dim):
            logger.error(
                f"Centroid for potential cluster {label} has unexpected shape/size. "
                f"Expected 1D float64 array of {expected_embedding_dim} elements, got ndim={centroid.ndim}, size={centroid.size}. Skipping."
            )
            continue
        
        serialized_centroid = centroid.tobytes() # For potential storage if user confirms

        # Select a representative image for this candidate cluster
        # The first image in the group (by original_image_ids index)
        representative_original_image_id = original_image_ids[cluster_member_indices[0]]
        representative_image_db = db.get(FaceImage, representative_original_image_id)
        
        rep_image_url = None
        if representative_image_db and representative_image_db.filename:
            rep_image_url = f"{PROFILED_IMAGES_URL_PREFIX_UTIL}/{representative_image_db.filename}"
        else:
            logger.warning(f"Could not find filename for representative image ID {representative_original_image_id} for candidate cluster {label}.")


        candidate_clusters_list.append({
            "candidate_id": f"candidate_{label}", # Temporary ID for UI
            "centroid_embedding_bytes": base64.b64encode(serialized_centroid).decode('utf-8'), # Encode to base64 string
            "representative_image_url": rep_image_url,
            "member_image_count": len(cluster_member_indices)
            # We could also include IDs of member images if needed by UI:
            # "member_original_image_ids": [original_image_ids[i] for i in cluster_member_indices]
        })
        logger.info(f"Identified candidate cluster (label {label}) with {len(cluster_member_indices)} members. Rep image ID: {representative_original_image_id}")

    message = (
        f"Candidate identification completed. Considered {embeddings_considered_count} embeddings. "
        f"Found {len(candidate_clusters_list)} potential new clusters."
    )
    logger.info(message)
    return {
        "message": message,
        "candidate_clusters": candidate_clusters_list,
        "embeddings_considered": embeddings_considered_count
    }


# The old calculate_clustering_centroid function is removed as its core logic
# (finding centroids and representative images from unclustered data)
# is now part of identify_candidate_clusters, and it no longer creates DB entries.
# The user's new flow is:
# 1. Identify candidates (this file)
# 2. User selects candidates and provides notes (UI + new endpoint in main.py/routers)
# 3. Selected candidates are saved as FaceCluster records (new endpoint)


if __name__ == "__main__":
    # This is for standalone testing of the clustering logic.
    logger.info("Running candidate cluster identification as a standalone script...")
    db_session = SessionLocal()
    try:
        # Ensure you have FaceImage entries with embeddings.
        # Example of how to populate for testing:
        # from app.models import FaceImage
        # import numpy as np
        # dummy_embedding_1 = np.random.rand(128).astype(np.float64).tobytes()
        # dummy_embedding_2 = np.random.rand(128).astype(np.float64).tobytes()
        # # ... add more ...
        # fi1 = FaceImage(filename="test1.jpg", embedding=dummy_embedding_1)
        # fi2 = FaceImage(filename="test2.jpg", embedding=dummy_embedding_2)
        # db_session.add_all([fi1, fi2])
        # db_session.commit()

        # Also, optionally, have some existing FaceCluster entries to test the "unclustered" logic.
        # from app.models import FaceCluster
        # existing_centroid_1 = np.random.rand(128).astype(np.float64).tobytes()
        # fc1 = FaceCluster(centroid_embedding=existing_centroid_1, note="Existing Cluster 1")
        # db_session.add(fc1)
        # db_session.commit()
        
        results = identify_candidate_clusters(db_session)
        logger.info(f"Standalone script finished. Results: {results}")
    finally:
        db_session.close()