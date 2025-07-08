import React from 'react';
import '../styles/SimilarFaces.css';

const SimilarFaces = ({ results }) => {
  return (
    <div className="similar-faces-results">
      <h3 className="similar-faces-title">Similar Faces</h3>
      <div id="results" className="similar-faces-content">
        {!results ? (
          <div className="placeholder-text">
            No analysis performed yet. Capture an image and click Analyze to begin.
          </div>
        ) : (
          <div className="results-content">
            {/* Results will be populated by displayResults function */}
          </div>
        )}
      </div>
    </div>
  );
};

export default SimilarFaces;