const videoElement = document.getElementById('cameraFeed');
const captureButton = document.getElementById('captureButton');
const snapshotCanvas = document.getElementById('snapshotCanvas');
const statusMessages = document.getElementById('statusMessages');
const similarFacesResults = document.getElementById('similarFacesResults');
const similarFacesGrid = document.getElementById('similarFacesGrid'); // Added for new layout
const capturedImageContainer = document.getElementById('captured-image-container'); // Added

// Elements for the new info display
const infoPassportNo = document.getElementById('infoPassportNo');
const infoVisa = document.getElementById('infoVisa');
const infoExpiry = document.getElementById('infoExpiry');
const infoDisembarkation = document.getElementById('infoDisembarkation');
const infoAirline = document.getElementById('infoAirline');
const infoDestination = document.getElementById('infoDestination');
const infoEmbarkation = document.getElementById('infoEmbarkation');
const infoSeatNo = document.getElementById('infoSeatNo');
const infoLastEntry = document.getElementById('infoLastEntry');
const clusterNotesDisplay = document.getElementById('clusterNotesDisplay');
const infoNotes = document.getElementById('infoNotes');


let isCapturing = false;
let requestInProgress = false;
let captureIntervalId = null;
const API_ENDPOINT = '/api/upload_image';

async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoElement.srcObject = stream;
        // Wait for metadata to load to get correct video dimensions
        videoElement.onloadedmetadata = async () => {
            console.log('[DEBUG] Video metadata loaded. Dimensions:', videoElement.videoWidth, 'x', videoElement.videoHeight);
            if (videoElement.videoWidth === 0 || videoElement.videoHeight === 0) {
                console.error('[DEBUG] Video dimensions are still zero after loadedmetadata.');
                statusMessages.textContent = "Error: Camera started but video dimensions are zero.";
                stopCamera(); // Stop if dimensions are invalid
                return;
            }
            isCapturing = true;
            captureButton.textContent = 'Capturing... Click to Stop';
            await captureAndSend(); // Call once immediately now that metadata is loaded
            // Clear any existing interval before setting a new one
            if (captureIntervalId) clearInterval(captureIntervalId);
            captureIntervalId = setInterval(captureAndSend, 5000); // Periodic capture
        };
        videoElement.onerror = () => { // Handle potential errors with the video stream itself
            console.error("Error with video element or stream.");
            statusMessages.textContent = "Error: Could not load video stream.";
            stopCamera();
        };
    } catch (error) {
        console.error("Error accessing camera:", error);
        statusMessages.textContent = "Error accessing camera: " + error.message;
        isCapturing = false; // Ensure isCapturing is reset if camera access fails
        captureButton.textContent = 'Start Camera & Capture'; // Reset button text
    }
}

function stopCamera() {
    if (videoElement.srcObject) {
        videoElement.srcObject.getTracks().forEach(track => track.stop());
    }
    isCapturing = false;
    clearInterval(captureIntervalId);
    captureButton.textContent = 'Start Camera & Capture';
    requestInProgress = false; // Reset request flag when stopping
}

async function captureAndSend() {
    if (requestInProgress || !isCapturing) {
        return;
    }

    requestInProgress = true;
    statusMessages.textContent = "Capturing and sending image...";

    const context = snapshotCanvas.getContext('2d');
    snapshotCanvas.width = videoElement.videoWidth;
    snapshotCanvas.height = videoElement.videoHeight;

    console.log('[DEBUG] Before drawImage - videoElement dimensions:', videoElement.videoWidth, 'x', videoElement.videoHeight);
    console.log('[DEBUG] Before drawImage - snapshotCanvas dimensions:', snapshotCanvas.width, 'x', snapshotCanvas.height);

    context.drawImage(videoElement, 0, 0, snapshotCanvas.width, snapshotCanvas.height);

    console.log('[DEBUG] Before toBlob - snapshotCanvas dimensions:', snapshotCanvas.width, 'x', snapshotCanvas.height);
    // Check if canvas is blank
    if (snapshotCanvas.width === 0 || snapshotCanvas.height === 0) {
        console.error('[DEBUG] Canvas has zero dimensions before toBlob call.');
        statusMessages.textContent = "Error: Canvas has zero dimensions.";
        requestInProgress = false;
        return; // Prevent calling toBlob on a zero-dimension canvas
    }

    snapshotCanvas.toBlob(async (blob) => {
        if (!blob) {
            console.error("Failed to create blob from canvas.");
            statusMessages.textContent = "Error: Failed to create image blob.";
            requestInProgress = false;
            return;
        }

        // Show the captured image container - REMOVED as per user request
        // if (capturedImageContainer) {
        //     capturedImageContainer.style.display = 'block';
        // }

        const formData = new FormData();
        formData.append('image', blob, 'capture.jpg');

        const fetchPromise = fetch(API_ENDPOINT, {
            method: 'POST',
            body: formData
        });

        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('timeout')), 10000) // Increased timeout to 10s
        );

        try {
            const response = await Promise.race([fetchPromise, timeoutPromise]);
            if (!response.ok) {
                let errorData;
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    errorData = await response.json();
                    console.error('[DEBUG] Server error response (JSON):', errorData);
                    if (errorData && errorData.detail) { // FastAPI often uses "detail"
                        errorMessage = errorData.detail;
                    } else if (errorData && errorData.error) {
                         errorMessage = errorData.error;
                    }
                } catch (e) {
                    const responseText = await response.text().catch(() => "Could not retrieve error text.");
                    console.error('[DEBUG] Failed to parse server error as JSON. Raw response text:', responseText);
                    errorMessage = `HTTP error! status: ${response.status}. Server response: ${responseText.substring(0, 100)}`;
                }
                throw new Error(errorMessage);
            }
            const data = await response.json();
            handleApiResponse(data);
        } catch (error) {
            console.error("Error sending image or timeout:", error);
            statusMessages.textContent = "Error: " + error.message;
            clearResultsOnError();
        } finally {
            requestInProgress = false;
        }
    }, 'image/jpeg');
}

function handleApiResponse(data) {
    statusMessages.textContent = data.message || 'Processing complete.';
    
    // Clear previous similar faces
    if (similarFacesGrid) {
        similarFacesGrid.innerHTML = '';
    } else {
        console.error("similarFacesGrid element not found");
    }
    
    // Clear previous cluster details
    clearClusterDetailsDisplay();

    // Prioritize displaying details from data.matched_cluster if available
    if (data.matched_cluster) {
        console.log('[DEBUG] Direct matched cluster found in API response:', data.matched_cluster);
        updateClusterDetailsDisplay(data.matched_cluster);
    } else if (data.captured_face_embedding) {
        // Fallback: if no direct match, but an embedding was captured, try to find related clusters
        console.log('[DEBUG] No direct match from upload, but captured face embedding found. Fetching related clusters.');
        fetchAndDisplayRelatedClusters(data.captured_face_embedding);
    } else {
        // No matched cluster and no embedding to search with
        console.log('[DEBUG] No captured face embedding or matched cluster in API response.');
        if (similarFacesGrid) similarFacesGrid.innerHTML = '<p class="placeholder-text">No face detected or embedding not generated.</p>';
        updateClusterDetailsDisplay(null); // Clear cluster details display
    }

    // Display similar individual faces, if any
    if (data.similar_faces && data.similar_faces.length > 0) {
        data.similar_faces.forEach(face => {
            const faceItem = document.createElement('div');
            faceItem.classList.add('face-item'); // Use existing .face-item styling

            const img = document.createElement('img');
            // Assuming image URLs are now relative to a base path or fully qualified
            // For now, let's assume they are still in /uploads/PROFILED_UPLOADS_DIR/
            // The backend should provide the correct relative or absolute URL.
            // If `face.url` is provided by backend:
            // img.src = face.url;
            // If still using filename and constructing path:
            img.src = face.filename.startsWith('http') ? face.filename : `/uploads/profiled/${face.filename}`;
            img.alt = `Similar face: ${face.filename}`;
            // Styles for img are in CSS, but can override here if needed

            const distanceText = document.createElement('p');
            distanceText.innerHTML = `Dist: <strong>${face.distance.toFixed(3)}</strong>`;
            
            faceItem.appendChild(img);
            faceItem.appendChild(distanceText);

            // Add click listener to load this face's cluster details
            faceItem.addEventListener('click', () => {
                if (face.cluster_id) {
                    fetchAndDisplaySpecificClusterDetails(face.cluster_id);
                } else {
                    // If a similar face isn't part of a known cluster,
                    // we might clear the details or show a message.
                    // For now, let's assume we only show details for known clusters.
                    console.log(`Clicked similar face ${face.filename} not associated with a cluster_id.`);
                    updateClusterDetailsDisplay(null); // Clear details if no cluster_id
                }
            });

            if (similarFacesGrid) similarFacesGrid.appendChild(faceItem);
        });
    } else if (data.similar_faces && similarFacesGrid) { // similar_faces exists but is empty
        similarFacesGrid.innerHTML = '<p class="placeholder-text">No similar faces found.</p>';
    }
    // If no face was detected in the uploaded image, data.similar_faces might be undefined or null
    else if (!data.similar_faces && similarFacesGrid && !data.captured_face_embedding) {
         similarFacesGrid.innerHTML = '<p class="placeholder-text">No face detected in the captured image.</p>';
    }
}

// Function to fetch and display clusters related to an embedding
async function fetchAndDisplayRelatedClusters(embedding) {
    // This function will now primarily decide which cluster's details to show.
    // The "most related" cluster will be displayed.
    console.log('[DEBUG] Fetching related clusters for embedding...');
    clearClusterDetailsDisplay(); // Clear previous details first

    try {
        const response = await fetch('/api/clusters/related', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ embedding: embedding }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: 'Unknown server error.' }));
            throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }
        const clusters = await response.json();
        
        if (clusters && clusters.length > 0) {
            // Display details of the *first* (most similar) cluster
            const mostSimilarCluster = clusters[0];
            console.log('[DEBUG] Most similar cluster found:', mostSimilarCluster);
            updateClusterDetailsDisplay(mostSimilarCluster);
            // Optionally, highlight this cluster if it's also in the "similar faces" list
        } else {
            console.log('[DEBUG] No closely related clusters found for the captured face.');
            updateClusterDetailsDisplay(null); // Show placeholder or "no data"
        }
    } catch (error) {
        console.error('Error fetching related clusters:', error);
        statusMessages.textContent = `Error loading related cluster: ${error.message}`;
        updateClusterDetailsDisplay(null); // Show placeholder on error
    }
}

function clearResultsOnError() {
    if (similarFacesGrid) {
        similarFacesGrid.innerHTML = '<p class="placeholder-text">Error processing image.</p>';
    }
    if (capturedImageContainer) {
        // Optionally hide or clear the canvas
        // capturedImageContainer.style.display = 'none';
    }
    clearClusterDetailsDisplay();
}


function clearClusterDetailsDisplay() {
    if (infoPassportNo) infoPassportNo.textContent = '-';
    if (infoVisa) infoVisa.textContent = '-';
    if (infoExpiry) infoExpiry.textContent = '-';
    if (infoDisembarkation) infoDisembarkation.textContent = '-';
    if (infoAirline) infoAirline.textContent = '-';
    if (infoDestination) infoDestination.textContent = '-';
    if (infoEmbarkation) infoEmbarkation.textContent = '-';
    if (infoSeatNo) infoSeatNo.textContent = '-';
    if (infoLastEntry) infoLastEntry.textContent = '-';
    if (infoNotes) infoNotes.textContent = '-';
    if (clusterNotesDisplay) clusterNotesDisplay.style.display = 'none';
}

// Function to update the new cluster details display area
function updateClusterDetailsDisplay(clusterData) {
    console.log("[DEBUG] updateClusterDetailsDisplay received clusterData:", JSON.stringify(clusterData, null, 2)); // Log the received data
    if (clusterData) {
        console.log("[DEBUG] Updating display with cluster data:", clusterData);
        if (infoPassportNo) infoPassportNo.textContent = clusterData.passport_no || '-';
        if (infoVisa) infoVisa.textContent = clusterData.visa || '-';
        if (infoExpiry) infoExpiry.textContent = clusterData.expiry || '-';
        if (infoDisembarkation) infoDisembarkation.textContent = clusterData.disembarkation || '-';
        if (infoAirline) infoAirline.textContent = clusterData.airline || '-';
        if (infoDestination) infoDestination.textContent = clusterData.destination || '-';
        if (infoEmbarkation) infoEmbarkation.textContent = clusterData.embarkation || '-';
        if (infoSeatNo) infoSeatNo.textContent = clusterData.seat_no || '-';
        if (infoLastEntry) infoLastEntry.textContent = clusterData.last_entry || '-';
        
        if (clusterData.note) {
            if (infoNotes) infoNotes.textContent = clusterData.note;
            if (clusterNotesDisplay) clusterNotesDisplay.style.display = 'block';
        } else {
            if (infoNotes) infoNotes.textContent = '-';
            if (clusterNotesDisplay) clusterNotesDisplay.style.display = 'none';
        }
    } else {
        console.log("[DEBUG] Clearing cluster details display (no data).");
        clearClusterDetailsDisplay();
        // Optionally show a placeholder in the main details area
        // For example, if you have a general placeholder element for the #cluster-details-display
    }
}


async function fetchAndDisplaySpecificClusterDetails(clusterId) {
    console.log(`[DEBUG] Fetching details for specific cluster ID: ${clusterId}`);
    clearClusterDetailsDisplay(); // Clear previous details

    try {
        const response = await fetch(`/api/clusters/${clusterId}`);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: 'Unknown server error.' }));
            throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }
        const clusterDetails = await response.json();
        updateClusterDetailsDisplay(clusterDetails);
    } catch (error) {
        console.error(`Error fetching details for cluster ${clusterId}:`, error);
        statusMessages.textContent = `Error loading details for cluster ${clusterId}: ${error.message}`;
        updateClusterDetailsDisplay(null); // Show placeholder on error
    }
}


captureButton.addEventListener('click', () => {
    if (isCapturing) {
        stopCamera();
        if (capturedImageContainer) capturedImageContainer.style.display = 'none'; // Hide captured image when stopping
        clearResultsOnError(); // Clear all results when camera stops
    } else {
        startCamera();
    }
});


window.addEventListener('load', () => {
    // Initial state: hide captured image container and clear details
    if (capturedImageContainer) capturedImageContainer.style.display = 'none';
    clearClusterDetailsDisplay();
    if (similarFacesGrid) { // Initial placeholder for similar faces
        similarFacesGrid.innerHTML = '<p class="placeholder-text">Start camera and capture an image.</p>';
    }
});

window.addEventListener('beforeunload', () => {
    if (isCapturing) {
        stopCamera();
    }
});