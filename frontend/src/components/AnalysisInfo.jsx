import React from 'react';
import '../styles/AnalysisInfo.css';

const AnalysisInfo = () => {
  return (
    <div className="cluster-details-display">
      <div className="info-row">
        <div className="info-group">
          <h4 className="info-group-h4">Detection Info</h4>
          <div className="info-item">
            <span className="info-item-label">Faces Detected:</span>
            <span id="faces-count" className="info-item-value">0</span>
          </div>
          <div className="info-item">
            <span className="info-item-label">Confidence:</span>
            <span id="confidence-level" className="info-item-value">N/A</span>
          </div>
          <div className="info-item-last">
            <span className="info-item-label">Processing Time:</span>
            <span id="processing-time" className="info-item-value">N/A</span>
          </div>
        </div>
        
        <div className="info-group">
          <h4 className="info-group-h4">Match Results</h4>
          <div className="info-item">
            <span className="info-item-label">Similar Faces:</span>
            <span id="similar-count" className="info-item-value">0</span>
          </div>
          <div className="info-item">
            <span className="info-item-label">Best Match:</span>
            <span id="best-match" className="info-item-value">N/A</span>
          </div>
          <div className="info-item-last">
            <span className="info-item-label">Similarity Score:</span>
            <span id="similarity-score" className="info-item-value">N/A</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisInfo;