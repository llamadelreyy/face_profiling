import os
import logging

# Base directories
# APP_DIR will be the 'app' directory, where this config.py resides.
APP_DIR = os.path.dirname(os.path.abspath(__file__))
# PROJECT_ROOT_DIR will be the parent of 'app', i.e., the project root.
PROJECT_ROOT_DIR = os.path.dirname(APP_DIR)

# Directory paths
# UPLOADS_DIR is typically in PROJECT_ROOT_DIR/uploads
UPLOADS_DIR = os.path.join(PROJECT_ROOT_DIR, 'uploads')
PROFILED_UPLOADS_DIR = os.path.join(UPLOADS_DIR, 'profiled')
STATIC_DIR_PATH = os.path.join(APP_DIR, 'static')
TEMPLATES_DIR_PATH = os.path.join(APP_DIR, 'templates')

# Database URL
# The database file will be located in the 'app' directory.
DATABASE_URL = f"sqlite:///{os.path.join(APP_DIR, 'face_profiling.db')}"

# Allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Configure logging
# This configures the root logger.
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
# Clustering parameters
DBSCAN_EPS = 0.4
DBSCAN_MIN_SAMPLES = 3

# Related clusters parameters
RELATED_CLUSTER_MAX_DISTANCE = 0.09 # Max distance for a cluster to be considered related
RELATED_CLUSTER_MAX_RESULTS = 20 # Max number of related clusters to return