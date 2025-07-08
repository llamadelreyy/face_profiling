import React, { useRef, useEffect } from 'react';
import '../styles/CameraSection.css';

const CameraSection = ({ onCaptureImage, onAnalyzeImage, onClearResults, capturedImage, isAnalyzing }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    initializeCamera();
  }, []);

  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        
        videoRef.current.addEventListener('loadedmetadata', () => {
          if (canvasRef.current) {
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
          }
        });
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const handleCaptureImage = () => {
    if (!videoRef.current || videoRef.current.readyState !== 4) {
      alert('Camera not ready. Please wait...');
      return;
    }

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    const dataURL = canvas.toDataURL('image/jpeg');
    onCaptureImage(dataURL);
  };

  return (
    <section className="camera-section">
      {/* User Section */}
      <div className="user-section">
        <div className="user-label">USER</div>
        <div className="user-number">07</div>
      </div>

      {/* Control Buttons */}
      <div className="control-buttons">
        <button className="control-btn" onClick={handleCaptureImage}>
          <div className="control-icon play-icon">
            <div className="play-triangle"></div>
          </div>
          <span className="btn-text-main">CAPTURE</span>
          <span className="btn-text-sub">IMAGE</span>
        </button>
        <button 
          className={`control-btn ${(!capturedImage || isAnalyzing) ? 'disabled' : ''}`}
          onClick={onAnalyzeImage} 
          disabled={!capturedImage || isAnalyzing}
        >
          <div className="control-icon record-icon">
            <div className="record-circle"></div>
          </div>
          <span className="btn-text-main">ANALYZE</span>
          <span className="btn-text-sub">FACE</span>
        </button>
        <button className="control-btn" onClick={onClearResults}>
          <div className="control-icon stop-icon">
            <div className="stop-square"></div>
          </div>
          <span className="btn-text-main">CLEAR</span>
          <span className="btn-text-sub">RESULTS</span>
        </button>
      </div>

      {/* Camera Feeds */}
      <div className="camera-feeds">
        {/* Camera 1 */}
        <div className="camera-feed">
          <video 
            ref={videoRef}
            className="camera-video"
            autoPlay 
            playsInline 
            muted 
          />
          <canvas 
            ref={canvasRef}
            className="camera-video hidden"
          />
          <div className="camera-label">CAMERA 1 - FACIAL RECOGNITION</div>
        </div>

        {/* Camera 2 */}
        <div className="camera-feed">
          <div className="camera-video"></div>
          <div className="camera-label">CAMERA 2</div>
        </div>

        {/* Camera 3 */}
        <div className="camera-feed">
          <div className="camera-video"></div>
          <div className="camera-label">CAMERA 3</div>
        </div>
      </div>
    </section>
  );
};

export default CameraSection;