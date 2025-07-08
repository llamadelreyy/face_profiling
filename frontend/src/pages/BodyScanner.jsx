import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import BottomPanel from '../components/BottomPanel';
import '../styles/security.css';

const BodyScanner = () => {
  const [activeStation, setActiveStation] = useState('ALL');
  const [isScanning, setIsScanning] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Ready for body scan');
  const [thermalImage, setThermalImage] = useState(null);
  const [normalImage, setNormalImage] = useState(null);
  
  // Body scanner statistics
  const [scanStats, setScanStats] = useState({
    totalScansToday: 1247,
    cleared: 1198,
    flagged: 35,
    rejected: 14,
    averageScanTime: 12, // seconds
    currentThroughput: 89, // scans per hour
    peakThroughput: 125,
    systemEfficiency: 96.1, // percentage
    temperatureAlerts: 3,
    metalDetections: 8,
    organicDetections: 2
  });

  const [currentScan, setCurrentScan] = useState({
    scanId: 'BS-2024-001247',
    timestamp: new Date().toLocaleString(),
    bodyTemperature: 36.8,
    metalDetected: false,
    organicDetected: false,
    threatLevel: 'LOW',
    scanDuration: 0,
    bodyRegions: {
      head: 'CLEAR',
      torso: 'CLEAR',
      arms: 'CLEAR',
      legs: 'CLEAR',
      pockets: 'CLEAR'
    },
    thermalReadings: {
      forehead: 36.8,
      chest: 36.5,
      hands: 35.2,
      feet: 34.8
    }
  });

  const [recentScans, setRecentScans] = useState([
    {
      id: 'BS-001246',
      time: '14:45:23',
      result: 'CLEARED',
      temperature: 36.9,
      threats: 'None',
      duration: 11
    },
    {
      id: 'BS-001245',
      time: '14:43:15',
      result: 'FLAGGED',
      temperature: 37.8,
      threats: 'High Temperature',
      duration: 15
    },
    {
      id: 'BS-001244',
      time: '14:41:08',
      result: 'CLEARED',
      temperature: 36.7,
      threats: 'None',
      duration: 10
    },
    {
      id: 'BS-001243',
      time: '14:38:52',
      result: 'REJECTED',
      temperature: 36.5,
      threats: 'Metal Object',
      duration: 18
    },
    {
      id: 'BS-001242',
      time: '14:36:41',
      result: 'CLEARED',
      temperature: 36.6,
      threats: 'None',
      duration: 12
    }
  ]);

  const [hourlyData] = useState([
    { hour: '08:00', scans: 45, cleared: 43, flagged: 2, rejected: 0 },
    { hour: '09:00', scans: 78, cleared: 75, flagged: 2, rejected: 1 },
    { hour: '10:00', scans: 95, cleared: 91, flagged: 3, rejected: 1 },
    { hour: '11:00', scans: 112, cleared: 107, flagged: 4, rejected: 1 },
    { hour: '12:00', scans: 125, cleared: 118, flagged: 5, rejected: 2 },
    { hour: '13:00', scans: 118, cleared: 112, flagged: 4, rejected: 2 },
    { hour: '14:00', scans: 89, cleared: 84, flagged: 3, rejected: 2 }
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
      // Update scan statistics
      setScanStats(prev => ({
        ...prev,
        totalScansToday: prev.totalScansToday + Math.floor(Math.random() * 2),
        cleared: prev.cleared + Math.floor(Math.random() * 2),
        currentThroughput: 85 + Math.floor(Math.random() * 15)
      }));

      // Update current scan readings
      setCurrentScan(prev => ({
        ...prev,
        bodyTemperature: 36.5 + Math.random() * 1.0,
        thermalReadings: {
          forehead: 36.5 + Math.random() * 1.0,
          chest: 36.2 + Math.random() * 0.8,
          hands: 34.8 + Math.random() * 1.2,
          feet: 34.5 + Math.random() * 1.0
        }
      }));

      // Add new scan occasionally
      if (Math.random() > 0.9) {
        const results = ['CLEARED', 'FLAGGED', 'REJECTED'];
        const threats = ['None', 'High Temperature', 'Metal Object', 'Organic Material'];
        
        const now = new Date();
        const time = now.toTimeString().slice(0, 8);
        
        const newScan = {
          id: `BS-${String(Date.now()).slice(-6)}`,
          time,
          result: results[Math.floor(Math.random() * results.length)],
          temperature: 36.0 + Math.random() * 2.0,
          threats: threats[Math.floor(Math.random() * threats.length)],
          duration: 8 + Math.floor(Math.random() * 12)
        };

        setRecentScans(prev => [newScan, ...prev.slice(0, 4)]);
      }
    }, 3000);

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

  const handleStartScan = () => {
    setIsScanning(true);
    setStatusMessage('Scanning in progress...');
    
    // Simulate scanning process
    setTimeout(() => {
      setIsScanning(false);
      setStatusMessage('Scan completed - Subject cleared');
      setThermalImage('/api/placeholder/300/400'); // Placeholder for thermal image
      setNormalImage('/api/placeholder/300/400'); // Placeholder for normal image
      
      // Update current scan data
      setCurrentScan(prev => ({
        ...prev,
        scanId: `BS-2024-${String(Date.now()).slice(-6)}`,
        timestamp: new Date().toLocaleString(),
        scanDuration: 8 + Math.floor(Math.random() * 8)
      }));
    }, 3000);
  };

  const getResultColor = (result) => {
    switch(result.toUpperCase()) {
      case 'CLEARED': return '#00ff00';
      case 'FLAGGED': return '#ffa500';
      case 'REJECTED': return '#ff4444';
      default: return '#87ceeb';
    }
  };

  const getResultIcon = (result) => {
    switch(result.toUpperCase()) {
      case 'CLEARED': return '[OK]';
      case 'FLAGGED': return '[!]';
      case 'REJECTED': return '[X]';
      default: return '[-]';
    }
  };

  const getThreatLevelColor = (level) => {
    switch(level.toUpperCase()) {
      case 'LOW': return '#00ff00';
      case 'MEDIUM': return '#ffa500';
      case 'HIGH': return '#ff4444';
      case 'CRITICAL': return '#ff0000';
      default: return '#87ceeb';
    }
  };

  const getTemperatureColor = (temp) => {
    if (temp >= 38.0) return '#ff4444';
    if (temp >= 37.5) return '#ffa500';
    if (temp >= 37.0) return '#ffff00';
    return '#00ff00';
  };

  const createBarChart = (data, maxValue) => {
    return data.map((item, index) => {
      const percentage = (item.scans / maxValue) * 100;
      return (
        <div key={index} style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          flex: 1,
          minWidth: 0
        }}>
          <div style={{
            height: '80px',
            width: '100%',
            background: 'rgba(70, 70, 100, 0.3)',
            borderRadius: '4px 4px 0 0',
            position: 'relative',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center'
          }}>
            <div style={{
              width: '80%',
              height: `${percentage}%`,
              background: 'linear-gradient(to top, #00bfff, #87ceeb)',
              borderRadius: '2px',
              position: 'relative',
              minHeight: '5px'
            }}>
              <div style={{
                position: 'absolute',
                top: '-18px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: 'clamp(0.6rem, 1.2vw, 0.7rem)',
                color: '#00bfff',
                fontWeight: 'bold'
              }}>
                {item.scans}
              </div>
            </div>
          </div>
          <div style={{
            fontSize: 'clamp(0.6rem, 1.2vw, 0.7rem)',
            color: '#87ceeb',
            marginTop: '0.25rem',
            textAlign: 'center'
          }}>
            {item.hour}
          </div>
        </div>
      );
    });
  };

  return (
    <>
      <div className="test-scanlines"></div>
      <div className="test-container">
        <Header title="Advanced Body Scanner System" />
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          overflow: 'hidden',
          padding: 'clamp(0.25rem, 1vw, 0.75rem)',
          gap: 'clamp(0.25rem, 0.8vw, 0.5rem)',
          height: 'calc(100vh - clamp(120px, 15vh, 160px))'
        }}>
          {/* Top Section - 2x1 Camera Layout */}
          <div style={{
            flex: '0 0 clamp(45%, 50vh, 55%)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(0.25rem, 0.8vw, 0.5rem)'
          }}>
            <h2 style={{
              color: '#87ceeb',
              fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
              margin: '0 0 clamp(0.25rem, 1vw, 0.5rem) 0',
              borderBottom: '2px solid rgba(0, 191, 255, 0.4)',
              paddingBottom: 'clamp(0.15rem, 0.5vw, 0.3rem)',
              textShadow: '0 0 8px rgba(135,206,235,0.5)',
              textAlign: 'center'
            }}>
              Dual-Mode Body Scanner
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'clamp(0.5rem, 1.5vw, 1rem)',
              flex: 1,
              minHeight: 0
            }}>
              {/* Thermal Scanner */}
              <div style={{
                background: 'rgba(25, 25, 45, 0.75)',
                borderRadius: '12px',
                border: '2px solid rgba(255, 100, 100, 0.4)',
                boxShadow: '0 0 20px rgba(255, 100, 100, 0.3)',
                padding: 'clamp(0.75rem, 2vw, 1.5rem)',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <h3 style={{
                  color: '#ff6464',
                  fontSize: 'clamp(0.9rem, 2vw, 1.2rem)',
                  margin: '0 0 clamp(0.5rem, 1.5vw, 0.75rem) 0',
                  borderBottom: '1px solid rgba(255, 100, 100, 0.3)',
                  paddingBottom: 'clamp(0.15rem, 0.5vw, 0.25rem)',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}>
                  🌡️ Thermal Scanner
                </h3>

                {/* Thermal Display */}
                <div style={{
                  flex: 1,
                  background: '#000',
                  borderRadius: '8px',
                  border: '2px solid rgba(255, 100, 100, 0.3)',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '200px',
                  overflow: 'hidden'
                }}>
                  {thermalImage ? (
                    <img 
                      src={thermalImage} 
                      alt="Thermal Scan" 
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: 'hue-rotate(240deg) saturate(2)'
                      }}
                    />
                  ) : (
                    <div style={{
                      textAlign: 'center',
                      color: '#ff6464'
                    }}>
                      <div style={{
                        fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                        marginBottom: '0.5rem',
                        opacity: 0.6,
                        fontWeight: 'bold'
                      }}>
                        THERMAL
                      </div>
                      <div style={{
                        fontSize: 'clamp(0.8rem, 2vw, 1.1rem)',
                        fontWeight: 'bold'
                      }}>
                        Thermal Imaging
                      </div>
                      <div style={{
                        fontSize: 'clamp(0.7rem, 1.5vw, 0.9rem)',
                        marginTop: '0.25rem',
                        opacity: 0.8
                      }}>
                        Temperature Detection
                      </div>
                    </div>
                  )}

                  {/* Thermal overlay */}
                  {isScanning && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(255, 100, 100, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      animation: 'pulse 1.5s infinite'
                    }}>
                      <div style={{
                        color: '#ff6464',
                        fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
                        fontWeight: 'bold',
                        textShadow: '0 0 10px rgba(255, 100, 100, 0.8)'
                      }}>
                        THERMAL SCANNING...
                      </div>
                    </div>
                  )}
                </div>

                {/* Thermal Readings */}
                <div style={{
                  marginTop: 'clamp(0.5rem, 1.5vw, 0.75rem)',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 'clamp(0.25rem, 0.8vw, 0.5rem)',
                  fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#ff6464' }}>Forehead:</span>
                    <span style={{ color: getTemperatureColor(currentScan.thermalReadings.forehead) }}>
                      {currentScan.thermalReadings.forehead.toFixed(1)}°C
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#ff6464' }}>Chest:</span>
                    <span style={{ color: getTemperatureColor(currentScan.thermalReadings.chest) }}>
                      {currentScan.thermalReadings.chest.toFixed(1)}°C
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#ff6464' }}>Hands:</span>
                    <span style={{ color: getTemperatureColor(currentScan.thermalReadings.hands) }}>
                      {currentScan.thermalReadings.hands.toFixed(1)}°C
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#ff6464' }}>Feet:</span>
                    <span style={{ color: getTemperatureColor(currentScan.thermalReadings.feet) }}>
                      {currentScan.thermalReadings.feet.toFixed(1)}°C
                    </span>
                  </div>
                </div>
              </div>

              {/* Normal Scanner */}
              <div style={{
                background: 'rgba(25, 25, 45, 0.75)',
                borderRadius: '12px',
                border: '2px solid rgba(0, 191, 255, 0.4)',
                boxShadow: '0 0 20px rgba(0, 191, 255, 0.3)',
                padding: 'clamp(0.75rem, 2vw, 1.5rem)',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <h3 style={{
                  color: '#87ceeb',
                  fontSize: 'clamp(0.9rem, 2vw, 1.2rem)',
                  margin: '0 0 clamp(0.5rem, 1.5vw, 0.75rem) 0',
                  borderBottom: '1px solid rgba(0, 191, 255, 0.3)',
                  paddingBottom: 'clamp(0.15rem, 0.5vw, 0.25rem)',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}>
                  X-Ray Scanner
                </h3>

                {/* Normal Display */}
                <div style={{
                  flex: 1,
                  background: '#000',
                  borderRadius: '8px',
                  border: '2px solid rgba(0, 191, 255, 0.3)',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '200px',
                  overflow: 'hidden'
                }}>
                  {normalImage ? (
                    <img 
                      src={normalImage} 
                      alt="X-Ray Scan" 
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: 'invert(1) contrast(1.2)'
                      }}
                    />
                  ) : (
                    <div style={{
                      textAlign: 'center',
                      color: '#87ceeb'
                    }}>
                      <div style={{
                        fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                        marginBottom: '0.5rem',
                        opacity: 0.6,
                        fontWeight: 'bold'
                      }}>
                        X-RAY
                      </div>
                      <div style={{
                        fontSize: 'clamp(0.8rem, 2vw, 1.1rem)',
                        fontWeight: 'bold'
                      }}>
                        X-Ray Imaging
                      </div>
                      <div style={{
                        fontSize: 'clamp(0.7rem, 1.5vw, 0.9rem)',
                        marginTop: '0.25rem',
                        opacity: 0.8
                      }}>
                        Object Detection
                      </div>
                    </div>
                  )}

                  {/* Scanning overlay */}
                  {isScanning && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(0, 191, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      animation: 'pulse 1.5s infinite'
                    }}>
                      <div style={{
                        color: '#00bfff',
                        fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
                        fontWeight: 'bold',
                        textShadow: '0 0 10px rgba(0, 191, 255, 0.8)'
                      }}>
                        X-RAY SCANNING...
                      </div>
                    </div>
                  )}
                </div>

                {/* Body Region Status */}
                <div style={{
                  marginTop: 'clamp(0.5rem, 1.5vw, 0.75rem)',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 'clamp(0.25rem, 0.8vw, 0.5rem)',
                  fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#87ceeb' }}>Head:</span>
                    <span style={{ color: getResultColor(currentScan.bodyRegions.head) }}>
                      {getResultIcon(currentScan.bodyRegions.head)} {currentScan.bodyRegions.head}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#87ceeb' }}>Torso:</span>
                    <span style={{ color: getResultColor(currentScan.bodyRegions.torso) }}>
                      {getResultIcon(currentScan.bodyRegions.torso)} {currentScan.bodyRegions.torso}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#87ceeb' }}>Arms:</span>
                    <span style={{ color: getResultColor(currentScan.bodyRegions.arms) }}>
                      {getResultIcon(currentScan.bodyRegions.arms)} {currentScan.bodyRegions.arms}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#87ceeb' }}>Legs:</span>
                    <span style={{ color: getResultColor(currentScan.bodyRegions.legs) }}>
                      {getResultIcon(currentScan.bodyRegions.legs)} {currentScan.bodyRegions.legs}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Control Panel */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 'clamp(0.5rem, 1.5vw, 1rem)',
              marginTop: 'clamp(0.5rem, 1vw, 0.75rem)'
            }}>
              <button
                onClick={handleStartScan}
                disabled={isScanning}
                style={{
                  padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1.5rem, 4vw, 2rem)',
                  background: isScanning ? 'rgba(135, 206, 235, 0.3)' : 'linear-gradient(135deg, #00bfff, #87ceeb)',
                  color: isScanning ? '#87ceeb' : '#000',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                  fontWeight: 'bold',
                  cursor: isScanning ? 'not-allowed' : 'pointer',
                  boxShadow: isScanning ? 'none' : '0 0 15px rgba(0, 191, 255, 0.4)',
                  transition: 'all 0.3s ease'
                }}
              >
                {isScanning ? 'SCANNING...' : 'START SCAN'}
              </button>
            </div>

            {/* Status Message */}
            <div style={{
              textAlign: 'center',
              padding: 'clamp(0.5rem, 1.5vw, 0.75rem)',
              background: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '6px',
              border: '1px solid rgba(0, 191, 255, 0.3)',
              color: '#87ceeb',
              fontSize: 'clamp(0.8rem, 1.8vw, 1rem)'
            }}>
              {statusMessage}
            </div>
          </div>

          {/* Bottom Section - Statistics and Data */}
          <div style={{
            flex: 1,
            display: 'flex',
            gap: 'clamp(0.5rem, 1.5vw, 1rem)',
            overflowY: 'auto'
          }}>
            {/* Left Panel - Current Scan Info */}
            <div style={{
              flex: '0 0 clamp(30%, 35vw, 40%)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(0.5rem, 1vw, 0.75rem)'
            }}>
              {/* Current Scan Details */}
              <div style={{
                background: 'rgba(25, 25, 45, 0.75)',
                borderRadius: '8px',
                border: '1px solid rgba(0, 191, 255, 0.3)',
                boxShadow: '0 0 15px rgba(0, 191, 255, 0.2)',
                padding: 'clamp(0.75rem, 2vw, 1rem)'
              }}>
                <h3 style={{
                  color: '#87ceeb',
                  fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                  margin: '0 0 clamp(0.5rem, 1.5vw, 0.75rem) 0',
                  borderBottom: '1px solid rgba(0, 191, 255, 0.3)',
                  paddingBottom: 'clamp(0.15rem, 0.5vw, 0.25rem)'
                }}>
                  Current Scan
                </h3>
                
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'clamp(0.25rem, 0.8vw, 0.5rem)',
                  fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#87ceeb' }}>Scan ID:</span>
                    <span style={{ color: '#00bfff', fontWeight: 'bold' }}>{currentScan.scanId}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#87ceeb' }}>Temperature:</span>
                    <span style={{ color: getTemperatureColor(currentScan.bodyTemperature) }}>
                      {currentScan.bodyTemperature.toFixed(1)}°C
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#87ceeb' }}>Threat Level:</span>
                    <span style={{ color: getThreatLevelColor(currentScan.threatLevel) }}>
                      {currentScan.threatLevel}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#87ceeb' }}>Duration:</span>
                    <span style={{ color: '#00bfff' }}>{currentScan.scanDuration}s</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#87ceeb' }}>Metal Detected:</span>
                    <span style={{ color: currentScan.metalDetected ? '#ff4444' : '#00ff00' }}>
                      {currentScan.metalDetected ? 'YES' : 'NO'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#87ceeb' }}>Organic Detected:</span>
                    <span style={{ color: currentScan.organicDetected ? '#ff4444' : '#00ff00' }}>
                      {currentScan.organicDetected ? 'YES' : 'NO'}
                    </span>
                  </div>
                </div>
              </div>

              {/* System Statistics */}
              <div style={{
                background: 'rgba(25, 25, 45, 0.75)',
                borderRadius: '8px',
                border: '1px solid rgba(0, 191, 255, 0.3)',
                boxShadow: '0 0 15px rgba(0, 191, 255, 0.2)',
                padding: 'clamp(0.75rem, 2vw, 1rem)'
              }}>
                <h3 style={{
                  color: '#87ceeb',
                  fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                  margin: '0 0 clamp(0.5rem, 1.5vw, 0.75rem) 0',
                  borderBottom: '1px solid rgba(0, 191, 255, 0.3)',
                  paddingBottom: 'clamp(0.15rem, 0.5vw, 0.25rem)'
                }}>
                  System Statistics
                </h3>
                
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'clamp(0.25rem, 0.8vw, 0.5rem)',
                  fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#87ceeb' }}>Total Scans:</span>
                    <span style={{ color: '#00bfff', fontWeight: 'bold' }}>{scanStats.totalScansToday}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#87ceeb' }}>Cleared:</span>
                    <span style={{ color: '#00ff00' }}>{scanStats.cleared}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#87ceeb' }}>Flagged:</span>
                    <span style={{ color: '#ffa500' }}>{scanStats.flagged}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#87ceeb' }}>Rejected:</span>
                    <span style={{ color: '#ff4444' }}>{scanStats.rejected}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#87ceeb' }}>Efficiency:</span>
                    <span style={{ color: '#00ff00' }}>{scanStats.systemEfficiency}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#87ceeb' }}>Throughput:</span>
                    <span style={{ color: '#00bfff' }}>{scanStats.currentThroughput}/hr</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Center Panel - Recent Scans */}
            <div style={{
              flex: '0 0 clamp(35%, 40vw, 45%)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{
                background: 'rgba(25, 25, 45, 0.75)',
                borderRadius: '8px',
                border: '1px solid rgba(0, 191, 255, 0.3)',
                boxShadow: '0 0 15px rgba(0, 191, 255, 0.2)',
                padding: 'clamp(0.75rem, 2vw, 1rem)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <h3 style={{
                  color: '#87ceeb',
                  fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                  margin: '0 0 clamp(0.5rem, 1.5vw, 0.75rem) 0',
                  borderBottom: '1px solid rgba(0, 191, 255, 0.3)',
                  paddingBottom: 'clamp(0.15rem, 0.5vw, 0.25rem)'
                }}>
                  Recent Scans
                </h3>
                
                <div style={{
                  flex: 1,
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'clamp(0.25rem, 0.8vw, 0.5rem)'
                }}>
                  {recentScans.map((scan, index) => (
                    <div key={scan.id} style={{
                      background: 'rgba(40, 40, 80, 0.6)',
                      borderRadius: '6px',
                      border: `1px solid ${getResultColor(scan.result)}40`,
                      padding: 'clamp(0.5rem, 1.5vw, 0.75rem)',
                      fontSize: 'clamp(0.7rem, 1.4vw, 0.8rem)'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.25rem'
                      }}>
                        <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>{scan.id}</span>
                        <span style={{ color: getResultColor(scan.result), fontWeight: 'bold' }}>
                          {getResultIcon(scan.result)} {scan.result}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.15rem' }}>
                        <span style={{ color: '#87ceeb' }}>Time:</span>
                        <span style={{ color: '#e0e0e0' }}>{scan.time}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.15rem' }}>
                        <span style={{ color: '#87ceeb' }}>Temp:</span>
                        <span style={{ color: getTemperatureColor(scan.temperature) }}>
                          {scan.temperature.toFixed(1)}°C
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.15rem' }}>
                        <span style={{ color: '#87ceeb' }}>Duration:</span>
                        <span style={{ color: '#e0e0e0' }}>{scan.duration}s</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#87ceeb' }}>Threats:</span>
                        <span style={{
                          color: scan.threats === 'None' ? '#00ff00' : '#ff4444',
                          fontSize: 'clamp(0.65rem, 1.3vw, 0.75rem)'
                        }}>
                          {scan.threats}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Panel - Hourly Chart */}
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{
                background: 'rgba(25, 25, 45, 0.75)',
                borderRadius: '8px',
                border: '1px solid rgba(0, 191, 255, 0.3)',
                boxShadow: '0 0 15px rgba(0, 191, 255, 0.2)',
                padding: 'clamp(0.75rem, 2vw, 1rem)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <h3 style={{
                  color: '#87ceeb',
                  fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                  margin: '0 0 clamp(0.5rem, 1.5vw, 0.75rem) 0',
                  borderBottom: '1px solid rgba(0, 191, 255, 0.3)',
                  paddingBottom: 'clamp(0.15rem, 0.5vw, 0.25rem)'
                }}>
                  Hourly Scan Volume
                </h3>
                
                <div style={{
                  flex: '1 1 auto',
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: 'clamp(0.25rem, 0.8vw, 0.5rem)',
                  padding: 'clamp(0.5rem, 1.5vw, 1rem) 0',
                  minHeight: '120px',
                  maxHeight: '40%'
                }}>
                  {createBarChart(hourlyData, 125)}
                </div>

                {/* Chart Legend */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 'clamp(0.5rem, 1.5vw, 1rem)',
                  margin: 'clamp(0.5rem, 1vw, 0.75rem) 0',
                  fontSize: 'clamp(0.7rem, 1.4vw, 0.8rem)',
                  flex: '0 0 auto'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      background: 'linear-gradient(to top, #00bfff, #87ceeb)',
                      borderRadius: '2px'
                    }}></div>
                    <span style={{ color: '#87ceeb' }}>Total Scans</span>
                  </div>
                </div>

                {/* Detection Summary */}
                <div style={{
                  flex: '0 0 auto',
                  padding: 'clamp(0.5rem, 1.5vw, 0.75rem)',
                  background: 'rgba(40, 40, 80, 0.4)',
                  borderRadius: '6px',
                  border: '1px solid rgba(0, 191, 255, 0.2)',
                  marginTop: 'auto'
                }}>
                  <h4 style={{
                    color: '#87ceeb',
                    fontSize: 'clamp(0.8rem, 1.8vw, 1rem)',
                    margin: '0 0 clamp(0.5rem, 1vw, 0.75rem) 0'
                  }}>
                    Detection Summary
                  </h4>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 'clamp(0.25rem, 0.8vw, 0.5rem)',
                    fontSize: 'clamp(0.7rem, 1.4vw, 0.8rem)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#87ceeb' }}>Temperature Alerts:</span>
                      <span style={{ color: '#ffa500' }}>{scanStats.temperatureAlerts}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#87ceeb' }}>Metal Detections:</span>
                      <span style={{ color: '#ff4444' }}>{scanStats.metalDetections}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#87ceeb' }}>Organic Detections:</span>
                      <span style={{ color: '#ff4444' }}>{scanStats.organicDetections}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#87ceeb' }}>Avg Scan Time:</span>
                      <span style={{ color: '#00bfff' }}>{scanStats.averageScanTime}s</span>
                    </div>
                  </div>
                </div>
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

export default BodyScanner;