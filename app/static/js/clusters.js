document.addEventListener('DOMContentLoaded', () => {
    const clusteringStatus = document.getElementById('clusteringStatus');
    const triggerClusteringBtn = document.getElementById('triggerClusteringBtn');
    const clusterListContainer = document.getElementById('clusterListContainer');

    // Candidate Cluster Section Elements
    const candidateClustersSection = document.getElementById('candidate-clusters-section');
    const candidateClustersContainer = document.getElementById('candidateClustersContainer');
    const finishReviewingCandidatesBtn = document.getElementById('finishReviewingCandidatesBtn');
    const candidateStatus = document.getElementById('candidateStatus');

    const clusterIdTitle = document.getElementById('clusterIdTitle');
    const clusterImagesContainer = document.getElementById('clusterImagesContainer');
    const clusterNotesText = document.getElementById('clusterNotesText');
    const noteTextarea = document.getElementById('noteTextarea');
    // New fields for cluster details
    const passportNoInput = document.getElementById('passportNoInput');
    const visaInput = document.getElementById('visaInput');
    const expiryInput = document.getElementById('expiryInput');
    const disembarkationInput = document.getElementById('disembarkationInput');
    const airlineInput = document.getElementById('airlineInput');
    const destinationInput = document.getElementById('destinationInput');
    const embarkationInput = document.getElementById('embarkationInput');
    const seatNoInput = document.getElementById('seatNoInput');
    const lastEntryInput = document.getElementById('lastEntryInput');

    const saveDetailsBtn = document.getElementById('saveDetailsBtn'); // Changed from saveNoteBtn
    // const deleteNoteBtn = document.getElementById('deleteNoteBtn'); // Delete note functionality might be removed or integrated
    const detailsStatus = document.getElementById('detailsStatus'); // Changed from noteStatus

    // --- Cluster List Page Logic ---
    if (triggerClusteringBtn) {
        triggerClusteringBtn.addEventListener('click', async () => {
            clusteringStatus.textContent = 'Processing...';
            try {
                const response = await fetch('/api/trigger_clustering', { method: 'POST' });
                const result = await response.json(); // Expects { message, candidate_clusters, embeddings_considered }
                
                if (response.ok) {
                    clusteringStatus.textContent = `Scan complete: ${result.message}`;
                    if (result.candidate_clusters && result.candidate_clusters.length > 0) {
                        displayCandidateClusters(result.candidate_clusters);
                        if(candidateClustersSection) candidateClustersSection.style.display = 'block';
                        if(candidateStatus) candidateStatus.textContent = `Found ${result.candidate_clusters.length} potential new clusters. Review and save them below.`;
                    } else {
                        if(candidateStatus) candidateStatus.textContent = 'No new potential clusters found this time.';
                        if(candidateClustersSection) candidateClustersSection.style.display = 'none'; // Hide if no candidates
                        loadClusters(); // Refresh main list if no candidates to review
                    }
                } else {
                    clusteringStatus.textContent = `Error: ${result.detail || 'Failed to trigger clustering process.'}`;
                }
            } catch (error) {
                console.error('Error identifying candidate clusters:', error);
                clusteringStatus.textContent = 'Error: Could not connect to the server for clustering.';
            }
        });
    }

    function displayCandidateClusters(candidates) {
        if (!candidateClustersContainer || !candidateStatus) return;
        candidateClustersContainer.innerHTML = ''; // Clear previous candidates

        candidates.forEach((candidate, index) => {
            const candidateDiv = document.createElement('div');
            candidateDiv.classList.add('candidate-cluster-item');
            candidateDiv.innerHTML = `
                <h4>Potential Cluster ${index + 1} (ID: ${candidate.candidate_id})</h4>
                ${candidate.representative_image_url ? `<img src="${candidate.representative_image_url}" alt="Rep. image for candidate ${candidate.candidate_id}" class="representative-image">` : '<p>No representative image.</p>'}
                <p>Potential Members: ${candidate.member_image_count}</p>
                <textarea id="note_candidate_${candidate.candidate_id}" placeholder="Add notes for this new cluster..."></textarea>
                <!-- Add inputs for new fields for candidate clusters -->
                <input type="text" id="passport_no_candidate_${candidate.candidate_id}" placeholder="Passport No">
                <input type="text" id="visa_candidate_${candidate.candidate_id}" placeholder="Visa">
                <input type="text" id="expiry_candidate_${candidate.candidate_id}" placeholder="Expiry Date">
                <input type="text" id="disembarkation_candidate_${candidate.candidate_id}" placeholder="Disembarkation">
                <input type="text" id="airline_candidate_${candidate.candidate_id}" placeholder="Airline">
                <input type="text" id="destination_candidate_${candidate.candidate_id}" placeholder="Destination">
                <input type="text" id="embarkation_candidate_${candidate.candidate_id}" placeholder="Embarkation">
                <input type="text" id="seat_no_candidate_${candidate.candidate_id}" placeholder="Seat No">
                <input type="text" id="last_entry_candidate_${candidate.candidate_id}" placeholder="Last Entry Date">
                <button class="saveCandidateBtn" data-candidate-id="${candidate.candidate_id}" data-centroid-b64="${candidate.centroid_embedding_bytes}">Save this Cluster</button>
                <p id="status_candidate_${candidate.candidate_id}" class="candidate-item-status"></p>
            `;
            candidateClustersContainer.appendChild(candidateDiv);
        });

        // Add event listeners to the new save buttons
        document.querySelectorAll('.saveCandidateBtn').forEach(button => {
            button.addEventListener('click', saveCandidateCluster);
        });
    }

    async function saveCandidateCluster(event) {
        const button = event.target;
        const candidateId = button.dataset.candidateId;
        const centroid_embedding_b64 = button.dataset.centroidB64;
        const noteTextarea = document.getElementById(`note_candidate_${candidateId}`);
        const notes = noteTextarea ? noteTextarea.value : '';
        const passport_no = document.getElementById(`passport_no_candidate_${candidateId}`)?.value || null;
        const visa = document.getElementById(`visa_candidate_${candidateId}`)?.value || null;
        const expiry = document.getElementById(`expiry_candidate_${candidateId}`)?.value || null;
        const disembarkation = document.getElementById(`disembarkation_candidate_${candidateId}`)?.value || null;
        const airline = document.getElementById(`airline_candidate_${candidateId}`)?.value || null;
        const destination = document.getElementById(`destination_candidate_${candidateId}`)?.value || null;
        const embarkation = document.getElementById(`embarkation_candidate_${candidateId}`)?.value || null;
        const seat_no = document.getElementById(`seat_no_candidate_${candidateId}`)?.value || null;
        const last_entry = document.getElementById(`last_entry_candidate_${candidateId}`)?.value || null;
        const itemStatusEl = document.getElementById(`status_candidate_${candidateId}`);

        if (!centroid_embedding_b64) {
            if(itemStatusEl) itemStatusEl.textContent = 'Error: Missing centroid data for saving.';
            return;
        }
        if(itemStatusEl) itemStatusEl.textContent = 'Saving...';

        try {
            const response = await fetch('/api/clusters/from_candidate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    centroid_embedding_b64,
                    notes,
                    passport_no,
                    visa,
                    expiry,
                    disembarkation,
                    airline,
                    destination,
                    embarkation,
                    seat_no,
                    last_entry
                })
            });
            const result = await response.json();
            if (response.ok) {
                if(itemStatusEl) itemStatusEl.textContent = `Saved successfully as Cluster ID: ${result.id}!`;
                button.disabled = true; // Prevent re-saving
                button.textContent = 'Saved';
            } else {
                if(itemStatusEl) itemStatusEl.textContent = `Error: ${result.detail || 'Failed to save candidate.'}`;
            }
        } catch (error) {
            console.error('Error saving candidate cluster:', error);
            if(itemStatusEl) itemStatusEl.textContent = 'Error: Could not connect to server.';
        }
    }

    if (finishReviewingCandidatesBtn) {
        finishReviewingCandidatesBtn.addEventListener('click', () => {
            if (candidateClustersSection) candidateClustersSection.style.display = 'none';
            if (candidateClustersContainer) candidateClustersContainer.innerHTML = ''; // Clear candidates
            if (candidateStatus) candidateStatus.textContent = '';
            if (clusteringStatus) clusteringStatus.textContent = 'Review finished. Loading updated cluster list...';
            loadClusters(); // Refresh the main list
        });
    }

    async function loadClusters() {
        if (!clusterListContainer) return;
        clusterListContainer.innerHTML = '<p>Loading clusters...</p>';
        try {
            const response = await fetch('/api/clusters');
            if (!response.ok) {
                const errorResult = await response.json();
                clusterListContainer.innerHTML = `<p>Error loading clusters: ${errorResult.detail || response.statusText}</p>`;
                return;
            }
            const clusters = await response.json();
            if (clusters.length === 0) {
                clusterListContainer.innerHTML = '<p>No clusters found. Try running the clustering algorithm.</p>';
                return;
            }

            clusterListContainer.innerHTML = ''; // Clear loading message
            clusters.forEach(cluster => {
                const clusterDiv = document.createElement('div');
                clusterDiv.classList.add('cluster-item');
                clusterDiv.innerHTML = `
                    <h4>Cluster ID: ${cluster.id}</h4>
                    <img src="${cluster.representative_image_url}" alt="Representative image for cluster ${cluster.id}" class="representative-image">
                    <p>Member Images: ${cluster.member_image_count}</p>
                    <p>Notes: ${cluster.note ? cluster.note.substring(0, 100) + (cluster.note.length > 100 ? '...' : '') : 'No notes yet.'}</p>
                    <p>Passport: ${cluster.passport_no || 'N/A'}</p>
                    <a href="/clusters/${cluster.id}">View Details</a>
                `;
                clusterListContainer.appendChild(clusterDiv);
            });
        } catch (error) {
            console.error('Error fetching clusters:', error);
            clusterListContainer.innerHTML = '<p>Error: Could not fetch clusters from the server.</p>';
        }
    }

    if (clusterListContainer) {
        loadClusters();
    }

    // --- Cluster Detail Page Logic ---
    let currentClusterId = null;
    if (window.location.pathname.includes('/clusters/') && !window.location.pathname.endsWith('/clusters')) {
        const pathParts = window.location.pathname.split('/');
        currentClusterId = pathParts[pathParts.length - 1];
        if (clusterIdTitle) clusterIdTitle.textContent = `Cluster ID: ${currentClusterId}`; // Already set by inline script, but good for consistency
        loadClusterDetails(currentClusterId);
    }
    

    async function loadClusterDetails(clusterId) {
        if (!clusterImagesContainer || !clusterNotesText) return;

        clusterImagesContainer.innerHTML = '<p>Loading images...</p>';
        clusterNotesText.textContent = 'Loading notes...';

        try {
            const response = await fetch(`/api/clusters/${clusterId}`);
            if (!response.ok) {
                const errorResult = await response.json();
                clusterImagesContainer.innerHTML = `<p>Error loading cluster details: ${errorResult.detail || response.statusText}</p>`;
                clusterNotesText.textContent = 'Failed to load notes.';
                return;
            }
            const cluster = await response.json();

            // Display member images
            clusterImagesContainer.innerHTML = ''; // Clear loading
            if (cluster.member_image_urls && cluster.member_image_urls.length > 0) {
                cluster.member_image_urls.forEach(url => {
                    const img = document.createElement('img');
                    img.src = url;
                    img.alt = `Member image of cluster ${clusterId}`;
                    img.classList.add('member-image');
                    clusterImagesContainer.appendChild(img);
                });
            } else {
                clusterImagesContainer.innerHTML = '<p>No member images found for this cluster.</p>';
            }
            

            // Display notes
            clusterNotesText.textContent = cluster.note || 'No notes for this cluster yet.';
            if (noteTextarea) noteTextarea.value = cluster.note || '';
            // Populate new input fields
            if (passportNoInput) passportNoInput.value = cluster.passport_no || '';
            if (visaInput) visaInput.value = cluster.visa || '';
            if (expiryInput) expiryInput.value = cluster.expiry || '';
            if (disembarkationInput) disembarkationInput.value = cluster.disembarkation || '';
            if (airlineInput) airlineInput.value = cluster.airline || '';
            if (destinationInput) destinationInput.value = cluster.destination || '';
            if (embarkationInput) embarkationInput.value = cluster.embarkation || '';
            if (seatNoInput) seatNoInput.value = cluster.seat_no || '';
            if (lastEntryInput) lastEntryInput.value = cluster.last_entry || '';

        } catch (error) {
            console.error(`Error fetching details for cluster ${clusterId}:`, error);
            clusterImagesContainer.innerHTML = '<p>Error: Could not fetch cluster details.</p>';
            clusterNotesText.textContent = 'Error loading notes.';
            if (detailsStatus) detailsStatus.textContent = 'Error loading details.';
        }
    }

    if (saveDetailsBtn) {
        saveDetailsBtn.addEventListener('click', async () => {
            if (!currentClusterId) return;
            
            const payload = {
                notes: noteTextarea ? noteTextarea.value : null,
                passport_no: passportNoInput ? passportNoInput.value : null,
                visa: visaInput ? visaInput.value : null,
                expiry: expiryInput ? expiryInput.value : null,
                disembarkation: disembarkationInput ? disembarkationInput.value : null,
                airline: airlineInput ? airlineInput.value : null,
                destination: destinationInput ? destinationInput.value : null,
                embarkation: embarkationInput ? embarkationInput.value : null,
                seat_no: seatNoInput ? seatNoInput.value : null,
                last_entry: lastEntryInput ? lastEntryInput.value : null
                // centroid_embedding_b64 is not sent as it's not updatable via this UI action
            };

            if(detailsStatus) detailsStatus.textContent = 'Saving...';
            try {
                // Endpoint changed from /notes to just /
                // Method changed from POST to PUT
                const response = await fetch(`/api/clusters/${currentClusterId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const result = await response.json();
                if (response.ok) {
                    if(detailsStatus) detailsStatus.textContent = 'Details saved successfully!';
                    // Update displayed details
                    if(clusterNotesText) clusterNotesText.textContent = payload.notes || 'No notes for this cluster yet.';
                    // Optionally, update other displayed fields if they are shown directly on the page outside inputs
                    // For now, we rely on a page reload or re-fetch to see all updated values if not directly bound.
                    loadClusterDetails(currentClusterId); // Refresh details from server
                } else {
                    if(detailsStatus) detailsStatus.textContent = `Error: ${result.detail || 'Failed to save details.'}`;
                }
            } catch (error) {
                console.error('Error saving details:', error);
                if(detailsStatus) detailsStatus.textContent = 'Error: Could not connect to server to save details.';
            }
        });
    }

    // The deleteNoteBtn functionality is now implicitly handled by saving an empty note
    // If a dedicated "delete all details" or "delete cluster" is needed, that would be a separate button and endpoint.
    // For now, removing the old deleteNoteBtn logic.
    // if (deleteNoteBtn) { ... }
});