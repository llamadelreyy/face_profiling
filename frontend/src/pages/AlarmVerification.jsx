import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import BottomPanel from '../components/BottomPanel';
import '../styles/security.css';

const AlarmVerification = () => {
  const [activeStation, setActiveStation] = useState('ALL');
  const [alarmLogs, setAlarmLogs] = useState([
    {
      id: 1,
      timestamp: '2024-01-08 14:23:15',
      camera: 'Office 1',
      status: 'ALARM',
      description: 'Human detected in restricted area',
      severity: 'HIGH'
    },
    {
      id: 2,
      timestamp: '2024-01-08 14:18:42',
      camera: 'Warehouse A',
      status: 'CLEARED',
      description: 'Motion detected - authorized personnel',
      severity: 'LOW'
    },
    {
      id: 3,
      timestamp: '2024-01-08 14:15:30',
      camera: 'Storage Room',
      status: 'ALARM',
      description: 'Unauthorized access detected',
      severity: 'CRITICAL'
    },
    {
      id: 4,
      timestamp: '2024-01-08 14:12:18',
      camera: 'Main Entrance',
      status: 'MONITORING',
      description: 'Normal surveillance mode',
      severity: 'INFO'
    },
    {
      id: 5,
      timestamp: '2024-01-08 14:08:55',
      camera: 'Office 1',
      status: 'ALARM',
      description: 'Multiple persons detected',
      severity: 'MEDIUM'
    }
  ]);

  const [cameraFeeds] = useState([
    { id: 1, label: 'Office 1', status: 'ALARM', lastDetection: '2 min ago' },
    { id: 2, label: 'Warehouse A', status: 'NORMAL', lastDetection: '15 min ago' },
    { id: 3, label: 'Storage Room', status: 'ALARM', lastDetection: '5 min ago' },
    { id: 4, label: 'Main Entrance', status: 'NORMAL', lastDetection: '1 min ago' }
  ]);

  useEffect(() => {
    document.body.className = 'test-body';
    document.documentElement.style.fontFamily = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
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

    // Simulate real-time updates
    const interval = setInterval(() => {
      const now = new Date();
      const timestamp = now.toISOString().slice(0, 19).replace('T', ' ');
      
      // Randomly add new alarm logs
      if (Math.random() > 0.7) {
        const cameras = ['Office 1', 'Warehouse A', 'Storage Room', 'Main Entrance'];
        const statuses = ['ALARM', 'CLEARED', 'MONITORING'];
        const severities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
        const descriptions = [
          'Human detected in area',
          'Motion sensor triggered',
          'Unauthorized access attempt',
          'Normal patrol detected',
          'Multiple persons detected'
        ];

        const newLog = {
          id: Date.now(),
          timestamp,
          camera: cameras[Math.floor(Math.random() * cameras.length)],
          status: statuses[Math.floor(Math.random() * statuses.length)],
          description: descriptions[Math.floor(Math.random() * descriptions.length)],
          severity: severities[Math.floor(Math.random() * severities.length)]
        };

        setAlarmLogs(prev => [newLog, ...prev.slice(0, 9)]); // Keep only 10 latest logs
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleStationClick = (station) => {
    setActiveStation(station);
  };

  const handleControlPanelClick = (buttonText) => {
    switch(buttonText) {
      case 'ADMIN':
        break;
      case 'RESULTS':
        window.location.href = '/clusters';
        break;
      case 'PARAMETER':
        break;
      default:
        break;
    }
  };

  const handleBackClick = () => {
    window.location.href = '/';
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'ALARM': return '#ff4444';
      case 'CLEARED': return '#00bfff';
      case 'MONITORING': return '#87ceeb';
      default: return '#e0e0e0';
    }
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'CRITICAL': return '#ff0000';
      case 'HIGH': return '#ff4444';
      case 'MEDIUM': return '#ffa500';
      case 'LOW': return '#87ceeb';
      case 'INFO': return '#00bfff';
      default: return '#e0e0e0';
    }
  };

  const getCameraStatusColor = (status) => {
    switch(status) {
      case 'ALARM': return '#ff4444';
      case 'NORMAL': return '#00bfff';
      default: return '#87ceeb';
    }
  };

  return (
    <>
      <div className="test-scanlines"></div>
      <div className="test-container">
        <Header title="Alarm Verification System" />
        
        <div style={{ 
          display: 'flex', 
          flex: 1, 
          overflow: 'hidden',
          padding: '1rem',
          gap: '1rem'
        }}>
          {/* Left Panel - 2x2 Camera Grid */}
          <div style={{
            flex: '0 0 50%',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <h2 style={{
              color: '#87ceeb',
              fontSize: '1.5rem',
              margin: '0 0 1rem 0',
              borderBottom: '2px solid rgba(0, 191, 255, 0.4)',
              paddingBottom: '0.5rem',
              textShadow: '0 0 8px rgba(135,206,235,0.5)'
            }}>
              Camera Surveillance
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gridTemplateRows: '1fr 1fr',
              gap: '1rem',
              flex: 1,
              minHeight: 0
            }}>
              {cameraFeeds.map((camera) => (
                <div key={camera.id} style={{
                  background: 'rgba(25, 25, 45, 0.75)',
                  borderRadius: '8px',
                  border: `2px solid ${getCameraStatusColor(camera.status)}`,
                  boxShadow: `0 0 15px ${getCameraStatusColor(camera.status)}40`,
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  {/* Camera Feed Area */}
                  <div style={{
                    flex: 1,
                    background: '#000',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {/* Simulated camera feed */}
                    <div style={{
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(45deg, #1a1a2e 25%, transparent 25%), linear-gradient(-45deg, #1a1a2e 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1a1a2e 75%), linear-gradient(-45deg, transparent 75%, #1a1a2e 75%)',
                      backgroundSize: '20px 20px',
                      backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                      opacity: 0.3
                    }} />
                    
                    {/* Camera Status Overlay */}
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center',
                      color: '#e0e0e0'
                    }}>
                      <div style={{
                        fontSize: '3rem',
                        marginBottom: '0.5rem',
                        color: getCameraStatusColor(camera.status)
                      }}>
                        📹
                      </div>
                      <div style={{ fontSize: '0.9rem' }}>
                        {camera.status === 'ALARM' ? 'HUMAN DETECTED' : 'MONITORING'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Camera Info Panel */}
                  <div style={{
                    padding: '0.75rem',
                    background: 'rgba(0, 0, 0, 0.7)',
                    borderTop: `1px solid ${getCameraStatusColor(camera.status)}`
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.25rem'
                    }}>
                      <span style={{
                        color: '#00bfff',
                        fontWeight: 'bold',
                        fontSize: '0.9rem'
                      }}>
                        {camera.label}
                      </span>
                      <span style={{
                        color: getCameraStatusColor(camera.status),
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                      }}>
                        {camera.status}
                      </span>
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#87ceeb'
                    }}>
                      Last: {camera.lastDetection}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Alarm Logs Table */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <h2 style={{
              color: '#87ceeb',
              fontSize: '1.5rem',
              margin: '0 0 1rem 0',
              borderBottom: '2px solid rgba(0, 191, 255, 0.4)',
              paddingBottom: '0.5rem',
              textShadow: '0 0 8px rgba(135,206,235,0.5)'
            }}>
              Alarm Logs
            </h2>
            
            <div style={{
              flex: 1,
              background: 'rgba(25, 25, 45, 0.75)',
              borderRadius: '8px',
              border: '1px solid rgba(0, 191, 255, 0.3)',
              boxShadow: '0 0 15px rgba(0, 191, 255, 0.2)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Table Header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 2fr 1fr',
                gap: '1rem',
                padding: '1rem',
                background: 'rgba(0, 191, 255, 0.1)',
                borderBottom: '1px solid rgba(0, 191, 255, 0.3)',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                color: '#00bfff'
              }}>
                <div>Time</div>
                <div>Camera</div>
                <div>Status</div>
                <div>Description</div>
                <div>Severity</div>
              </div>
              
              {/* Table Body */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '0.5rem'
              }}>
                {alarmLogs.map((log) => (
                  <div key={log.id} style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr 2fr 1fr',
                    gap: '1rem',
                    padding: '0.75rem 0.5rem',
                    borderBottom: '1px solid rgba(70, 70, 100, 0.3)',
                    fontSize: '0.85rem',
                    transition: 'background-color 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0, 191, 255, 0.05)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    <div style={{ color: '#c0c0c0' }}>
                      {log.timestamp.split(' ')[1]}
                    </div>
                    <div style={{ color: '#e0e0e0', fontWeight: '500' }}>
                      {log.camera}
                    </div>
                    <div style={{ 
                      color: getStatusColor(log.status),
                      fontWeight: 'bold'
                    }}>
                      {log.status}
                    </div>
                    <div style={{ color: '#e0e0e0' }}>
                      {log.description}
                    </div>
                    <div style={{
                      color: getSeverityColor(log.severity),
                      fontWeight: 'bold',
                      textAlign: 'center'
                    }}>
                      {log.severity}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

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

export default AlarmVerification;