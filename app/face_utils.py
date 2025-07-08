import sys
import os
print(f"DEBUG: Current sys.path for face_utils: {sys.path}")
try:
    import face_recognition_models
    print(f"DEBUG: Successfully imported face_recognition_models")
    if hasattr(face_recognition_models, '__path__'):
        print(f"DEBUG: face_recognition_models.__path__: {face_recognition_models.__path__}")
        model_dir_from_pkg = face_recognition_models.__path__[0]
        print(f"DEBUG: face_recognition_models base directory: {model_dir_from_pkg}")
        # The actual model files are in a 'models' subdirectory within the package
        specific_model_path = os.path.join(model_dir_from_pkg, "models", "dlib_face_recognition_resnet_model_v1.dat")
        print(f"DEBUG: Attempting to find model at: {specific_model_path}")
        print(f"DEBUG: Does model file exist at that path? {os.path.exists(specific_model_path)}")
    else:
        print(f"DEBUG: face_recognition_models does not have __path__ (might be a single file module, unexpected for this pkg)")

except ImportError as e:
    print(f"DEBUG: FAILED to import face_recognition_models directly. Error: {e}")
except Exception as e_general:
    print(f"DEBUG: An unexpected error occurred trying to inspect face_recognition_models: {e_general}")
import face_recognition
import os
import numpy as np # Added for numpy array operations
import logging # Added for logging
from typing import Optional # Added for Optional type hint
from app import config

# Initialize logger
logger = logging.getLogger(__name__)

# Ensure the configured directories exist from app.config
# config.UPLOADS_DIR points to PROJECT_ROOT_DIR/uploads
if not os.path.exists(config.UPLOADS_DIR):
    os.makedirs(config.UPLOADS_DIR, exist_ok=True)

# config.PROFILED_UPLOADS_DIR points to PROJECT_ROOT_DIR/uploads/profiled
if not os.path.exists(config.PROFILED_UPLOADS_DIR):
    os.makedirs(config.PROFILED_UPLOADS_DIR, exist_ok=True)

# --- Serialization Helpers ---
def serialize_embedding(embedding_array: Optional[np.ndarray]) -> Optional[bytes]:
    """
    Serializes a numpy array (face embedding) to bytes with validation.
    Returns None if the embedding is invalid or serialization fails.
    """
    if embedding_array is None:
        logger.debug("Input embedding_array is None. Returning None.")
        return None

    if not isinstance(embedding_array, np.ndarray):
        logger.error(f"Input is not a numpy array, but {type(embedding_array)}. Returning None.")
        return None

    if embedding_array.size == 0:
        logger.warning("Input embedding_array is empty. Returning None to avoid storing empty bytes.")
        return None

    # Validate shape, size, and dtype (assuming 128-dimensional float64 embeddings)
    if not (embedding_array.ndim == 1 and embedding_array.size == 128 and embedding_array.dtype == np.float64):
        logger.error(
            f"Input embedding_array has unexpected shape, size, or dtype. "
            f"Expected 1D float64 array of 128 elements, "
            f"got ndim={embedding_array.ndim}, size={embedding_array.size}, dtype={embedding_array.dtype}. "
            f"Returning None."
        )
        return None

    try:
        return embedding_array.tobytes()
    except Exception as e:
        logger.error(f"Unexpected error during serialization of embedding: {e}", exc_info=True)
        return None

def deserialize_embedding(embedding_bytes: bytes) -> Optional[np.ndarray]:
    """Deserializes bytes back into a numpy array (face embedding) with robust error handling."""
    if embedding_bytes is None or not embedding_bytes:
        logger.warning("Attempted to deserialize None or empty embedding_bytes. Returning None.")
        return None

    item_size = np.dtype(np.float64).itemsize
    if len(embedding_bytes) % item_size != 0:
        logger.error(
            f"Buffer size {len(embedding_bytes)} is not a multiple of item size {item_size} for np.float64. "
            f"Cannot deserialize. Returning None."
        )
        return None

    try:
        embedding_array = np.frombuffer(embedding_bytes, dtype=np.float64)

        # Validate shape and size (assuming 128-dimensional embeddings)
        if embedding_array.ndim == 1 and embedding_array.size == 128:
            return embedding_array
        else:
            logger.error(
                f"Deserialized array has unexpected shape/size. "
                f"Expected 1D array with 128 elements, got ndim={embedding_array.ndim}, size={embedding_array.size}. "
                f"Returning None."
            )
            return None
    except Exception as e:
        logger.error(f"Unexpected error during deserialization of embedding: {e}", exc_info=True)
        return None


def detect_faces(image_path: str) -> bool:
    """
    Detects faces in an image.

    Args:
        image_path: The path to the image file.

    Returns:
        True if one or more faces are detected, False otherwise.
    """
    try:
        image = face_recognition.load_image_file(image_path)
        face_locations = face_recognition.face_locations(image)
        return len(face_locations) > 0
    except Exception as e:
        print(f"Error detecting faces in {image_path}: {e}")
        return False

def get_image_path(filename: str) -> str:
    """
    Returns the full path to an image in the uploads directory.
    """
    return os.path.join(config.UPLOADS_DIR, filename)

def get_face_embeddings(image_path: str) -> np.ndarray | None:
    """
    Loads an image, detects faces, and returns the first face embedding.

    Args:
        image_path: The path to the image file.

    Returns:
        A numpy array representing the face embedding (128 dimensions) if a face is found,
        otherwise None.
    """
    try:
        image = face_recognition.load_image_file(image_path)
        face_locations = face_recognition.face_locations(image)

        if face_locations:
            # Get face encodings for all faces in the image
            # face_encodings returns a list of 128-dimensional face encodings (one for each face in the image)
            face_encodings = face_recognition.face_encodings(image, known_face_locations=face_locations)
            if face_encodings:
                return face_encodings[0]  # Return the first embedding
        return None
    except Exception as e:
        print(f"Error getting face embeddings from {image_path}: {e}")
        return None

def is_face_similar(new_embedding: np.ndarray, known_embeddings: list[np.ndarray], tolerance: float = 0.6) -> bool:
    """
    Compares a new face embedding against a list of known embeddings.

    Args:
        new_embedding: A numpy array for the new face.
        known_embeddings: A list of numpy arrays for known faces.
        tolerance: How much distance between faces to consider them a match.
                   Lower is stricter (0.6 is a common default).

    Returns:
        True if the new face is similar to any of the known faces, False otherwise.
    """
    if not known_embeddings: # Handles empty list
        return False
    if new_embedding is None: # Should not happen if called correctly, but good to check
        return False

    try:
        # compare_faces returns a list of True/False values.
        matches = face_recognition.compare_faces(known_embeddings, new_embedding, tolerance=tolerance)
        return any(matches) # True if any of the comparisons are True
    except Exception as e:
        print(f"Error comparing faces: {e}")
        return False # Or raise the exception, depending on desired error handling
def get_top_similar_faces(new_embedding: np.ndarray, known_faces_data: list, top_n: int = 5, tolerance: float = 0.6) -> list[dict]:
    """
    Finds the top N most similar faces to a new embedding from a list of known faces.

    Args:
        new_embedding: A numpy array for the new face embedding.
        known_faces_data: A list of dictionaries or objects, where each item
                          must have 'embedding' (deserialized numpy array),
                          'filename' (str), and 'id' (int).
        top_n: The maximum number of similar faces to return.
        tolerance: The maximum distance for a face to be considered similar.

    Returns:
        A list of dictionaries, each representing a similar face, sorted by distance.
        e.g., [{"filename": "image.jpg", "distance": 0.5, "id": 1}, ...]
    """
    if new_embedding is None or not known_faces_data:
        return []

    known_embeddings = []
    face_identifiers = []

    for face_data in known_faces_data:
        # Assuming face_data is a dictionary or an object with attributes
        embedding = face_data.get('embedding') if isinstance(face_data, dict) else getattr(face_data, 'embedding', None)
        filename = face_data.get('filename') if isinstance(face_data, dict) else getattr(face_data, 'filename', None)
        face_id = face_data.get('id') if isinstance(face_data, dict) else getattr(face_data, 'id', None)

        if embedding is not None and filename is not None and face_id is not None:
            known_embeddings.append(embedding)
            face_identifiers.append({"filename": filename, "id": face_id})

    if not known_embeddings:
        return []

    try:
        # Calculate distances between the new embedding and all known embeddings
        distances = face_recognition.face_distance(known_embeddings, new_embedding)
    except Exception as e:
        print(f"Error calculating face distances: {e}")
        return []

    similar_faces = []
    for i, distance in enumerate(distances):
        if distance <= tolerance:
            similar_faces.append({
                "filename": face_identifiers[i]["filename"],
                "id": face_identifiers[i]["id"],
                "distance": round(float(distance), 4) # Store distance as float, rounded
            })

    # Sort by distance (ascending)
    similar_faces.sort(key=lambda x: x["distance"])

    return similar_faces[:top_n]
def find_most_similar_cluster(new_embedding: np.ndarray, clusters_data: list, tolerance: float = 0.6) -> dict | None:
    """
    Finds the most similar cluster to a new face embedding.

    Args:
        new_embedding: A numpy array for the new face embedding.
        clusters_data: A list of dictionaries, where each item must have
                       'id' (int), 'centroid_embedding' (deserialized numpy array),
                       and 'note' (str).
        tolerance: The maximum distance for a cluster to be considered a match.

    Returns:
        A dictionary containing 'cluster_id', 'note', and 'distance' of the most similar cluster
        if a match is found within tolerance, otherwise None.
    """
    if new_embedding is None or not clusters_data:
        return None

    best_match = None
    min_distance = float('inf')

    for cluster_info in clusters_data:
        cluster_id = cluster_info.get('id')
        centroid_embedding = cluster_info.get('centroid_embedding')
        note = cluster_info.get('note')

        if cluster_id is None or centroid_embedding is None: # Note can be None
            print(f"Warning: Skipping cluster due to missing id or centroid_embedding: {cluster_info}")
            continue

        try:
            # face_distance expects a list of known embeddings, so we wrap the centroid
            distance = face_recognition.face_distance([centroid_embedding], new_embedding)[0]
        except Exception as e:
            print(f"Error calculating distance for cluster {cluster_id}: {e}")
            continue

        if distance < min_distance and distance <= tolerance:
            min_distance = distance
            # best_match = {
            #     "cluster_id": cluster_id,
            #     "note": note,
            #     "distance": round(float(distance), 4)
            # }
            # Instead of creating a new dict, copy the original cluster_info
            # and add/update the distance.
            best_match = cluster_info.copy() # Copy all original fields
            best_match["distance"] = round(float(distance), 4) # Add/update distance

    return best_match