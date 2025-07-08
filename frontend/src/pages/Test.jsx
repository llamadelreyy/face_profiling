import React, { useState, useEffect } from 'react';
import CameraSection from '../components/CameraSection';
import SimilarFaces from '../components/SimilarFaces';
import AnalysisInfo from '../components/AnalysisInfo';
import BottomPanel from '../components/BottomPanel';
import Header from '../components/Header';
import '../styles/Test.css';

const Test = () => {
  const [statusMessage, setStatusMessage] = useState('Ready to capture image.');
  const [capturedImage, setCapturedImage] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeStation, setActiveStation] = useState('ALL');
  const [analysisStartTime, setAnalysisStartTime] = useState(null);

  useEffect(() => {
    // Apply body styles to document body
    document.body.className = 'test-body';
    
    // Apply styles to html and root
    document.documentElement.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    document.documentElement.style.backgroundColor = '#1a1a2e';
    document.documentElement.style.color = '#e0e0e0';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    document.documentElement.style.height = '100vh';
    document.documentElement.style.overflow = 'hidden';
    
    const root = document.getElementById('root');
    if (root) {
      root.className = 'test-body';
    }
  }, []);

  const handleCaptureImage = (dataURL) => {
    setCapturedImage(dataURL);
    setStatusMessage('Image captured. Click ANALYZE to process.');
  };

  const analyzeImage = async () => {
    if (!capturedImage) return;
    
    setIsAnalyzing(true);
    setStatusMessage('Analyzing image...');
    const startTime = Date.now();
    setAnalysisStartTime(startTime);

    try {
      const response = await fetch('/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: capturedImage })
      });

      const result = await response.json();
      const processingTime = Date.now() - startTime;
      
      if (result.success) {
        setAnalysisResults({ ...result, processingTime });
        displayResults(result, processingTime);
        setStatusMessage('Analysis complete.');
      } else {
        setStatusMessage(result.message || 'Analysis failed.');
      }
    } catch (error) {
      console.error('Error during analysis:', error);
      setStatusMessage('Error during analysis.');
    }

    setIsAnalyzing(false);
  };

  const displayResults = (result, processingTime) => {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    // Update info panels
    document.getElementById('faces-count').textContent = result.faces ? result.faces.length : 0;
    document.getElementById('processing-time').textContent = `${processingTime}ms`;
    
    if (result.faces && result.faces.length > 0) {
      const firstFace = result.faces[0];
      document.getElementById('confidence-level').textContent = `${(firstFace.confidence * 100).toFixed(1)}%`;
      
      // Display face results
      result.faces.forEach((face, index) => {
        const faceDiv = document.createElement('div');
        faceDiv.className = 'face-result';
        faceDiv.style.cssText = 'margin-bottom: 15px; padding: 10px; background-color: rgba(40,40,80,0.8); border-radius: 8px; border: 1px solid rgba(0,191,255,0.4);';
        faceDiv.innerHTML = `
          <h4 style="color: #00bfff; margin-top: 0;">Face ${index + 1}</h4>
          <p><strong>Confidence:</strong> ${(face.confidence * 100).toFixed(1)}%</p>
          <p><strong>Location:</strong> (${face.location.left}, ${face.location.top})</p>
          ${face.encoding ? '<p><strong>Encoding:</strong> Generated</p>' : ''}
        `;
        resultsDiv.appendChild(faceDiv);
      });

      if (result.similar_faces && result.similar_faces.length > 0) {
        document.getElementById('similar-count').textContent = result.similar_faces.length;
        
        const bestMatch = result.similar_faces[0];
        document.getElementById('best-match').textContent = bestMatch.filename;
        document.getElementById('similarity-score').textContent = `${(bestMatch.distance * 100).toFixed(1)}%`;
        
        const similarDiv = document.createElement('div');
        similarDiv.className = 'similar-faces';
        similarDiv.style.cssText = 'margin-top: 20px; padding: 15px; background-color: rgba(30,30,60,0.9); border-radius: 8px; border: 1px solid rgba(0,191,255,0.3);';
        similarDiv.innerHTML = '<h4 style="color: #87ceeb; margin-top: 0;">Similar Faces Found:</h4>';
        
        result.similar_faces.forEach(similar => {
          const similarFaceDiv = document.createElement('div');
          similarFaceDiv.style.cssText = 'margin-bottom: 10px; padding: 8px; background-color: rgba(50,50,90,0.7); border-radius: 6px;';
          similarFaceDiv.innerHTML = `
            <p><strong>Match:</strong> ${similar.filename}</p>
            <p><strong>Similarity:</strong> ${(similar.distance * 100).toFixed(1)}%</p>
          `;
          similarDiv.appendChild(similarFaceDiv);
        });
        
        resultsDiv.appendChild(similarDiv);
      } else {
        document.getElementById('similar-count').textContent = '0';
        document.getElementById('best-match').textContent = 'N/A';
        document.getElementById('similarity-score').textContent = 'N/A';
      }
    } else {
      resultsDiv.innerHTML = '<p style="color: #888; font-style: italic; text-align: center; padding: 20px;">No faces detected in the image.</p>';
      document.getElementById('confidence-level').textContent = 'N/A';
      document.getElementById('similar-count').textContent = '0';
      document.getElementById('best-match').textContent = 'N/A';
      document.getElementById('similarity-score').textContent = 'N/A';
    }
  };

  const clearResults = () => {
    document.getElementById('results').innerHTML = '<div class="placeholder-text">No analysis performed yet. Capture an image and click Analyze to begin.</div>';
    setStatusMessage('Ready to capture image.');
    
    // Hide captured image
    setCapturedImage(null);
    
    // Reset info panels
    document.getElementById('faces-count').textContent = '0';
    document.getElementById('confidence-level').textContent = 'N/A';
    document.getElementById('processing-time').textContent = 'N/A';
    document.getElementById('similar-count').textContent = '0';
    document.getElementById('best-match').textContent = 'N/A';
    document.getElementById('similarity-score').textContent = 'N/A';
    
    setAnalysisResults(null);
  };

  const handleStationClick = (station) => {
    setActiveStation(station);
    console.log('Selected station:', station);
    updateStationDisplay(station);
  };

  const updateStationDisplay = (station) => {
    if (station === '01' || station === 'ALL') {
      setStatusMessage('Facial Recognition Station - Ready to capture image.');
    } else {
      setStatusMessage(`Monitoring Station ${station} - Surveillance mode active.`);
    }
  };

  const handleControlPanelClick = (buttonText) => {
    console.log('Control panel button clicked:', buttonText);
    switch(buttonText) {
      case 'ADMIN':
        // Navigate to admin panel
        break;
      case 'RESULTS':
        // Navigate to results page
        window.location.href = '/clusters';
        break;
      case 'PARAMETER':
        // Navigate to parameter setup
        break;
      default:
        break;
    }
  };

  const handleBackClick = () => {
    window.location.href = '/';
  };

  return (
    <>
      <div className="test-scanlines"></div>
      <div className="test-container">
        {/* Header */}
        <Header title="Facial Recognition System" />
        
        <div className="test-main-content-layout">
          {/* Left Panel */}
          <CameraSection
            onCaptureImage={handleCaptureImage}
            onAnalyzeImage={analyzeImage}
            onClearResults={clearResults}
            capturedImage={capturedImage}
            isAnalyzing={isAnalyzing}
          />

          {/* Main Display - Facial Recognition Results */}
          <section className="test-results-section-wrapper">
            <h2 className="test-h2">Analysis Results</h2>
            <div id="statusMessages" className="test-status-messages">{statusMessage}</div>
            
            <div className="test-results-internal-layout">
              {/* Analysis Results */}
              <div className="test-results-right-column">
                {/* Similar Faces Results */}
                <SimilarFaces results={analysisResults} />
                
                {/* Face Details Display */}
                <AnalysisInfo />
              </div>
            </div>
          </section>
        </div>

        {/* Bottom Control Panel */}
        <BottomPanel
          activeStation={activeStation}
          onStationClick={handleStationClick}
          onControlPanelClick={handleControlPanelClick}
          onBackClick={handleBackClick}
        />
        
      </div>
    </>
  );
};

export default Test;