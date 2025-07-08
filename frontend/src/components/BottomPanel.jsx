import React from 'react';
import '../styles/BottomPanel.css';

const BottomPanel = ({ activeStation, onStationClick, onControlPanelClick, onBackClick }) => {
  const stations = ['01', '02', '03', '04', '05', '06', '07'];

  return (
    <div className="bottom-panel">
      {/* Back Button */}
      <button className="back-button" onClick={onBackClick}>
        <span className="btn-main-text">BACK</span>
        <span className="btn-sub-text">MAIN MENU</span>
      </button>

      {/* Station Selection */}
      <div className="station-controls">
        <button
          className={`station-btn ${activeStation === 'ALL' ? 'active' : ''}`}
          onClick={() => onStationClick('ALL')}
        >
          <div className="btn-main-text">SELECT</div>
          <div className="btn-sub-text">ALL</div>
        </button>
        
        {stations.map(station => (
          <button
            key={station}
            className={`station-btn ${activeStation === station ? 'active' : ''}`}
            onClick={() => onStationClick(station)}
          >
            <div className="btn-main-text">{station}</div>
            <div className="btn-sub-text">STATION</div>
          </button>
        ))}
      </div>

      {/* Right Controls */}
      <div className="right-controls">
        <button className="control-panel-btn" onClick={() => onControlPanelClick('ADMIN')}>
          <div className="btn-main-text">ADMIN</div>
          <div className="btn-sub-text">USER</div>
        </button>
        <button className="control-panel-btn" onClick={() => onControlPanelClick('RESULTS')}>
          <div className="btn-main-text">RESULTS</div>
        </button>
        <button className="control-panel-btn" onClick={() => onControlPanelClick('PARAMETER')}>
          <div className="btn-main-text">PARAMETER</div>
          <div className="btn-sub-text">SETUP</div>
        </button>
      </div>
    </div>
  );
};

export default BottomPanel;