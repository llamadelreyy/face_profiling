import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import BottomPanel from '../components/BottomPanel';
import '../styles/security.css';

const ContainerScanner = () => {
  const [activeStation, setActiveStation] = useState('ALL');
  const [isScanning, setIsScanning] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Container scanner ready - Position container for X-ray inspection');
  const [currentScan, setCurrentScan] = useState(null);
  const [scanProgress, setScanProgress] = useState(0);

  // Current container scan data
  const [containerData, setContainerData] = useState({
    scanId: 'CS-2024-001',
    timestamp: new Date().toLocaleString(),
    containerNumber: 'MSKU-7834562',
    sealNumber: 'SL-456789',
    origin: 'Port Klang, Malaysia',
    destination: 'Singapore Port',
    carrier: 'Evergreen Marine',
    weight: '24,580 kg',
    dimensions: '40ft x 8ft x 8.5ft',
    cargoType: 'Mixed Goods',
    manifestItems: 156,
    riskLevel: 'LOW',
    clearanceStatus: 'PENDING',
    inspectionRequired: true,
    lastInspection: '2024-01-05 14:30:00',
    customsStatus: 'CLEARED',
    securitySeal: 'INTACT'
  });

  // Detected contents from X-ray scan
  const [detectedContents, setDetectedContents] = useState([
    {
      id: 'ITEM-001',
      category: 'Electronics',
      description: 'Consumer Electronics - Smartphones',
      quantity: 45,
      density: 'Medium',
      suspicionLevel: 'CLEAR',
      location: 'Front Section',
      confidence: 98.2
    },
    {
      id: 'ITEM-002',
      category: 'Textiles',
      description: 'Clothing and Fabric Materials',
      quantity: 78,
      density: 'Low',
      suspicionLevel: 'CLEAR',
      location: 'Middle Section',
      confidence: 95.7
    },
    {
      id: 'ITEM-003',
      category: 'Machinery',
      description: 'Industrial Equipment Parts',
      quantity: 12,
      density: 'High',
      suspicionLevel: 'REVIEW',
      location: 'Rear Section',
      confidence: 87.4
    },
    {
      id: 'ITEM-004',
      category: 'Food Products',
      description: 'Packaged Food Items',
      quantity: 234,
      density: 'Medium',
      suspicionLevel: 'CLEAR',
      location: 'Center Section',
      confidence: 92.1
    }
  ]);

  // Live scanning statistics
  const [scanStats, setScanStats] = useState({
    todayScans: 89,
    cleared: 76,
    flagged: 8,
    pending: 5,
    avgScanTime: '4.2 min',
    systemUptime: '99.7%',
    lastMaintenance: '2024-01-01',
    xrayIntensity: '85%'
  });

  // Alert system for suspicious items
  const [alerts, setAlerts] = useState([
    {
      id: 'ALT-CS-001',
      time: '16:15:23',
      type: 'DENSITY_ANOMALY',
      level: 'MEDIUM',
      message: 'Unusual density pattern detected in rear section',
      container: 'MSKU-7834562',
      status: 'INVESTIGATING'
    },
    {
      id: 'ALT-CS-002',
      time: '16:12:45',
      type: 'MANIFEST_MISMATCH',
      level: 'LOW',
      message: 'Item count variance from manifest',
      container: 'TCLU-9876543',
      status: 'RESOLVED'
    }
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

    // Real-time updates
    const interval = setInterval(() => {
      // Update scan statistics
      setScanStats(prev => ({
        ...prev,
        todayScans: prev.todayScans + Math.floor(Math.random() * 2),
        cleared: prev.cleared + Math.floor(Math.random() * 2),
        pending: Math.max(0, prev.pending + Math.floor(Math.random() * 3) - 1)
      }));

      // Update X-ray intensity
      setScanStats(prev => ({
        ...prev,
        xrayIntensity: `${(80 + Math.random() * 15).toFixed(0)}%`
      }));

      // Occasionally add new alerts
      if (Math.random() > 0.97) {
        const alertTypes = ['DENSITY_ANOMALY', 'MANIFEST_MISMATCH', 'PROHIBITED_ITEM', 'SEAL_BREACH'];
        const alertLevels = ['HIGH', 'MEDIUM', 'LOW'];
        const messages = [
          'Suspicious object detected in container',
          'Manifest discrepancy requires review',
          'Potential prohibited item identified',
          'Container seal integrity compromised'
        ];
        
        const newAlert = {
          id: `ALT-CS-${String(Date.now()).slice(-3)}`,
          time: new Date().toTimeString().slice(0, 8),
          type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
          level: alertLevels[Math.floor(Math.random() * alertLevels.length)],
          message: messages[Math.floor(Math.random() * messages.length)],
          container: `${['MSKU', 'TCLU', 'COSCO'][Math.floor(Math.random() * 3)]}-${Math.floor(Math.random() * 9999999)}`,
          status: 'ACTIVE'
        };

        setAlerts(prev => [newAlert, ...prev.slice(0, 1)]);
      }
    }, 4000);

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
    setScanProgress(0);
    setStatusMessage('Initializing X-ray scanner...');
    
    // Simulate scanning progress
    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        const newProgress = prev + Math.random() * 12;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          setIsScanning(false);
          setStatusMessage('Container scan completed - Contents analyzed');
          setCurrentScan(containerData);
          return 100;
        }
        
        // Update status messages based on progress
        if (newProgress > 80) {
          setStatusMessage('Analyzing detected objects...');
        } else if (newProgress > 60) {
          setStatusMessage('Processing X-ray images...');
        } else if (newProgress > 40) {
          setStatusMessage('Scanning container contents...');
        } else if (newProgress > 20) {
          setStatusMessage('Positioning X-ray beam...');
        }
        
        return newProgress;
      });
    }, 300);
  };

  const getSuspicionColor = (level) => {
    switch(level.toUpperCase()) {
      case 'CLEAR': return '#00ff00';
      case 'REVIEW': return '#ffa500';
      case 'FLAGGED': return '#ff4444';
      case 'PROHIBITED': return '#ff0000';
      default: return '#87ceeb';
    }
  };

  const getStatusColor = (status) => {
    switch(status.toUpperCase()) {
      case 'CLEARED': case 'INTACT': case 'CLEAR': return '#00ff00';
      case 'PENDING': case 'REVIEW': return '#ffa500';
      case 'FLAGGED': case 'BREACH': return '#ff4444';
      case 'LOW': return '#87ceeb';
      case 'MEDIUM': return '#ffa500';
      case 'HIGH': return '#ff4444';
      default: return '#e0e0e0';
    }
  };

  const getAlertColor = (level) => {
    switch(level.toUpperCase()) {
      case 'HIGH': return '#ff4444';
      case 'MEDIUM': return '#ffa500';
      case 'LOW': return '#87ceeb';
      default: return '#e0e0e0';
    }
  };

  return (
    <>
      <div className="test-scanlines"></div>
      <div className="test-container">
        <Header title="Container X-Ray Scanner System" />
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gridTemplateRows: '1fr 200px',
          gap: 'clamp(0.5rem, 1.5vw, 1rem)',
          flex: 1,
          overflow: 'hidden',
          padding: 'clamp(0.5rem, 1.5vw, 1rem)',
          height: 'calc(100vh - clamp(120px, 15vh, 160px))'
        }}>
          {/* Left - X-Ray Scanner Display */}
          <div style={{
            gridColumn: '1',
            gridRow: '1',
            background: 'rgba(25, 25, 45, 0.75)',
            borderRadius: '12px',
            border: '2px solid rgba(0, 191, 255, 0.4)',
            boxShadow: '0 0 20px rgba(0, 191, 255, 0.3)',
            padding: 'clamp(1rem, 2.5vw, 1.5rem)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h2 style={{
              color: '#00bfff',
              fontSize: 'clamp(1.2rem, 2.8vw, 1.8rem)',
              margin: '0 0 clamp(1rem, 2vw, 1.5rem) 0',
              textAlign: 'center',
              borderBottom: '2px solid rgba(0, 191, 255, 0.5)',
              paddingBottom: 'clamp(0.5rem, 1vw, 0.75rem)'
            }}>
              X-RAY CONTAINER SCANNER
            </h2>

            {/* X-Ray Scanner View */}
            <div style={{
              flex: 1,
              background: '#000',
              borderRadius: '8px',
              border: '3px solid rgba(0, 191, 255, 0.4)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '200px',
              overflow: 'hidden'
            }}>
              {/* X-Ray Grid Overlay */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `
                  linear-gradient(rgba(0, 255, 0, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '30px 30px',
                opacity: 0.4
              }} />

              {/* Container Outline */}
              <div style={{
                position: 'absolute',
                top: '20%',
                left: '10%',
                right: '10%',
                height: '60%',
                border: '2px solid rgba(0, 255, 0, 0.6)',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isScanning ? 'rgba(0, 255, 0, 0.05)' : 'transparent'
              }}>
                {/* Container Contents Visualization */}
                <div style={{
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr 1fr',
                  gap: '2px',
                  padding: '4px'
                }}>
                  {detectedContents.map((item, index) => (
                    <div key={item.id} style={{
                      background: `rgba(${item.suspicionLevel === 'CLEAR' ? '0, 255, 0' : item.suspicionLevel === 'REVIEW' ? '255, 165, 0' : '255, 68, 68'}, 0.3)`,
                      border: `1px solid ${getSuspicionColor(item.suspicionLevel)}`,
                      borderRadius: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 'clamp(0.6rem, 1.2vw, 0.8rem)',
                      color: getSuspicionColor(item.suspicionLevel),
                      fontWeight: 'bold',
                      textAlign: 'center',
                      opacity: isScanning ? 0.8 : 0.6
                    }}>
                      {item.category.slice(0, 4).toUpperCase()}
                    </div>
                  ))}
                </div>

                {/* Container Number Display */}
                <div style={{
                  position: 'absolute',
                  bottom: '-30px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  color: '#00ff00',
                  fontSize: 'clamp(1rem, 2vw, 1.3rem)',
                  fontWeight: 'bold',
                  textShadow: '0 0 10px rgba(0, 255, 0, 0.5)'
                }}>
                  {containerData.containerNumber}
                </div>
              </div>

              {/* Scanning Progress Bar */}
              {isScanning && (
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '10px',
                  right: '10px',
                  height: '8px',
                  background: 'rgba(0, 0, 0, 0.7)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${scanProgress}%`,
                    background: 'linear-gradient(90deg, #00ff00, #87ceeb)',
                    borderRadius: '4px',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              )}

              {/* X-Ray Beam Animation */}
              {isScanning && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, transparent, #00ff00, transparent)',
                  animation: 'scan 3s linear infinite'
                }} />
              )}
            </div>

            {/* Control Panel */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 'clamp(1rem, 2vw, 1.5rem)',
              gap: 'clamp(1rem, 2vw, 1.5rem)'
            }}>
              <button
                onClick={handleStartScan}
                disabled={isScanning}
                style={{
                  flex: 1,
                  padding: 'clamp(1rem, 2.5vw, 1.5rem)',
                  background: isScanning ? 'rgba(0, 255, 0, 0.3)' : 'linear-gradient(135deg, #00ff00, #87ceeb)',
                  color: isScanning ? '#00ff00' : '#000',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: 'clamp(1rem, 2.2vw, 1.3rem)',
                  fontWeight: 'bold',
                  cursor: isScanning ? 'not-allowed' : 'pointer',
                  boxShadow: isScanning ? 'none' : '0 0 15px rgba(0, 255, 0, 0.4)',
                  transition: 'all 0.3s ease'
                }}
              >
                {isScanning ? `X-RAY SCANNING... ${scanProgress.toFixed(0)}%` : 'INITIATE X-RAY SCAN'}
              </button>

              <div style={{
                flex: 2,
                textAlign: 'center',
                padding: 'clamp(0.75rem, 2vw, 1rem)',
                background: 'rgba(0, 0, 0, 0.6)',
                borderRadius: '8px',
                border: '1px solid rgba(0, 255, 0, 0.3)'
              }}>
                <div style={{
                  color: '#00ff00',
                  fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                  fontWeight: 'bold'
                }}>
                  {statusMessage}
                </div>
              </div>
            </div>
          </div>

          {/* Right - Container Information */}
          <div style={{
            gridColumn: '2',
            gridRow: '1',
            background: 'rgba(25, 25, 45, 0.75)',
            borderRadius: '12px',
            border: '1px solid rgba(0, 191, 255, 0.3)',
            boxShadow: '0 0 15px rgba(0, 191, 255, 0.2)',
            padding: 'clamp(1rem, 2.5vw, 1.5rem)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h3 style={{
              color: '#87ceeb',
              fontSize: 'clamp(1rem, 2.2vw, 1.3rem)',
              margin: '0 0 clamp(1rem, 2vw, 1.5rem) 0',
              borderBottom: '1px solid rgba(0, 191, 255, 0.3)',
              paddingBottom: 'clamp(0.5rem, 1vw, 0.75rem)',
              textAlign: 'center'
            }}>
              CONTAINER DETAILS
            </h3>

            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(0.75rem, 1.5vw, 1rem)',
              fontSize: 'clamp(0.8rem, 1.6vw, 0.95rem)',
              overflowY: 'auto'
            }}>
              <div style={{
                background: 'rgba(40, 40, 80, 0.6)',
                padding: 'clamp(0.75rem, 1.5vw, 1rem)',
                borderRadius: '8px',
                border: '1px solid rgba(0, 191, 255, 0.2)'
              }}>
                <div style={{ color: '#87ceeb', fontWeight: 'bold', marginBottom: '0.5rem' }}>Container ID</div>
                <div style={{ color: '#00bfff', fontSize: '1.1em', fontWeight: 'bold' }}>{containerData.containerNumber}</div>
                <div style={{ color: '#e0e0e0', fontSize: '0.9em' }}>Seal: {containerData.sealNumber}</div>
              </div>

              <div style={{
                background: 'rgba(40, 40, 80, 0.6)',
                padding: 'clamp(0.75rem, 1.5vw, 1rem)',
                borderRadius: '8px',
                border: '1px solid rgba(0, 191, 255, 0.2)'
              }}>
                <div style={{ color: '#87ceeb', fontWeight: 'bold', marginBottom: '0.5rem' }}>Route</div>
                <div style={{ color: '#e0e0e0' }}>From: {containerData.origin}</div>
                <div style={{ color: '#e0e0e0' }}>To: {containerData.destination}</div>
                <div style={{ color: '#00bfff' }}>Carrier: {containerData.carrier}</div>
              </div>

              <div style={{
                background: 'rgba(40, 40, 80, 0.6)',
                padding: 'clamp(0.75rem, 1.5vw, 1rem)',
                borderRadius: '8px',
                border: '1px solid rgba(0, 191, 255, 0.2)'
              }}>
                <div style={{ color: '#87ceeb', fontWeight: 'bold', marginBottom: '0.5rem' }}>Specifications</div>
                <div style={{ color: '#e0e0e0' }}>Weight: {containerData.weight}</div>
                <div style={{ color: '#e0e0e0' }}>Size: {containerData.dimensions}</div>
                <div style={{ color: '#e0e0e0' }}>Items: {containerData.manifestItems}</div>
              </div>

              <div style={{
                background: 'rgba(40, 40, 80, 0.6)',
                padding: 'clamp(0.75rem, 1.5vw, 1rem)',
                borderRadius: '8px',
                border: '1px solid rgba(0, 191, 255, 0.2)'
              }}>
                <div style={{ color: '#87ceeb', fontWeight: 'bold', marginBottom: '0.5rem' }}>Security Status</div>
                <div style={{
                  color: getStatusColor(containerData.riskLevel),
                  fontWeight: 'bold',
                  fontSize: '1.1em'
                }}>
                  Risk Level: {containerData.riskLevel}
                </div>
                <div style={{ color: getStatusColor(containerData.customsStatus) }}>Customs: {containerData.customsStatus}</div>
                <div style={{ color: getStatusColor(containerData.securitySeal) }}>Seal: {containerData.securitySeal}</div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Detected Contents, Statistics, and Alerts */}
          <div style={{
            gridColumn: '1 / 3',
            gridRow: '2',
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr',
            gap: 'clamp(0.5rem, 1.5vw, 1rem)',
            height: '100%',
            overflow: 'hidden'
          }}>
            {/* Detected Contents */}
            <div style={{
              background: 'rgba(25, 25, 45, 0.75)',
              borderRadius: '8px',
              border: '1px solid rgba(0, 191, 255, 0.3)',
              boxShadow: '0 0 10px rgba(0, 191, 255, 0.2)',
              padding: 'clamp(0.5rem, 1vw, 0.75rem)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}>
              <h3 style={{
                color: '#87ceeb',
                fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)',
                margin: '0 0 clamp(0.5rem, 1vw, 0.75rem) 0',
                borderBottom: '1px solid rgba(0, 191, 255, 0.3)',
                paddingBottom: 'clamp(0.25rem, 0.5vw, 0.5rem)',
                textAlign: 'center'
              }}>
                DETECTED CONTENTS
              </h3>

              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(0.25rem, 0.5vw, 0.5rem)',
                overflowY: 'auto',
                fontSize: 'clamp(0.65rem, 1.2vw, 0.75rem)'
              }}>
                {detectedContents.map((item) => (
                  <div key={item.id} style={{
                    background: 'rgba(40, 40, 80, 0.6)',
                    padding: 'clamp(0.25rem, 0.5vw, 0.5rem)',
                    borderRadius: '4px',
                    border: `1px solid ${getSuspicionColor(item.suspicionLevel)}40`
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.1rem'
                    }}>
                      <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>{item.category}</span>
                      <span style={{
                        color: getSuspicionColor(item.suspicionLevel),
                        fontWeight: 'bold',
                        fontSize: '0.9em'
                      }}>
                        {item.suspicionLevel}
                      </span>
                    </div>
                    <div style={{ color: '#e0e0e0', marginBottom: '0.1rem', lineHeight: '1.2' }}>
                      {item.description}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85em' }}>
                      <span style={{ color: '#87ceeb' }}>Qty: {item.quantity}</span>
                      <span style={{ color: '#00bfff' }}>Conf: {item.confidence.toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Statistics */}
            <div style={{
              background: 'rgba(25, 25, 45, 0.75)',
              borderRadius: '8px',
              border: '1px solid rgba(0, 191, 255, 0.3)',
              boxShadow: '0 0 10px rgba(0, 191, 255, 0.2)',
              padding: 'clamp(0.5rem, 1vw, 0.75rem)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}>
              <h3 style={{
                color: '#87ceeb',
                fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)',
                margin: '0 0 clamp(0.5rem, 1vw, 0.75rem) 0',
                borderBottom: '1px solid rgba(0, 191, 255, 0.3)',
                paddingBottom: 'clamp(0.25rem, 0.5vw, 0.5rem)',
                textAlign: 'center'
              }}>
                SCAN STATISTICS
              </h3>

              <div style={{
                flex: 1,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 'clamp(0.25rem, 0.5vw, 0.5rem)',
                fontSize: 'clamp(0.65rem, 1.2vw, 0.75rem)'
              }}>
                <div style={{
                  background: 'rgba(0, 255, 0, 0.1)',
                  padding: 'clamp(0.25rem, 0.5vw, 0.5rem)',
                  borderRadius: '4px',
                  border: '1px solid rgba(0, 255, 0, 0.3)',
                  textAlign: 'center'
                }}>
                  <div style={{ color: '#00ff00', fontWeight: 'bold', fontSize: '1.3em' }}>{scanStats.cleared}</div>
                  <div style={{ color: '#87ceeb' }}>Cleared</div>
                </div>

                <div style={{
                  background: 'rgba(255, 68, 68, 0.1)',
                  padding: 'clamp(0.25rem, 0.5vw, 0.5rem)',
                  borderRadius: '4px',
                  border: '1px solid rgba(255, 68, 68, 0.3)',
                  textAlign: 'center'
                }}>
                  <div style={{ color: '#ff4444', fontWeight: 'bold', fontSize: '1.3em' }}>{scanStats.flagged}</div>
                  <div style={{ color: '#87ceeb' }}>Flagged</div>
                </div>

                <div style={{
                  background: 'rgba(255, 165, 0, 0.1)',
                  padding: 'clamp(0.25rem, 0.5vw, 0.5rem)',
                  borderRadius: '4px',
                  border: '1px solid rgba(255, 165, 0, 0.3)',
                  textAlign: 'center'
                }}>
                  <div style={{ color: '#ffa500', fontWeight: 'bold', fontSize: '1.3em' }}>{scanStats.pending}</div>
                  <div style={{ color: '#87ceeb' }}>Pending</div>
                </div>

                <div style={{
                  background: 'rgba(0, 191, 255, 0.1)',
                  padding: 'clamp(0.25rem, 0.5vw, 0.5rem)',
                  borderRadius: '4px',
                  border: '1px solid rgba(0, 191, 255, 0.3)',
                  textAlign: 'center'
                }}>
                  <div style={{ color: '#00bfff', fontWeight: 'bold', fontSize: '1.3em' }}>{scanStats.todayScans}</div>
                  <div style={{ color: '#87ceeb' }}>Total</div>
                </div>
              </div>

              <div style={{
                marginTop: 'clamp(0.5rem, 1vw, 0.75rem)',
                padding: 'clamp(0.25rem, 0.5vw, 0.5rem)',
                background: 'rgba(40, 40, 80, 0.6)',
                borderRadius: '6px',
                fontSize: 'clamp(0.65rem, 1.2vw, 0.75rem)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ color: '#87ceeb' }}>X-Ray Intensity:</span>
                  <span style={{ color: '#00ff00' }}>{scanStats.xrayIntensity}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#87ceeb' }}>Avg Scan Time:</span>
                  <span style={{ color: '#00ff00' }}>{scanStats.avgScanTime}</span>
                </div>
              </div>
            </div>

            {/* Security Alerts */}
            <div style={{
              background: 'rgba(25, 25, 45, 0.75)',
              borderRadius: '8px',
              border: '1px solid rgba(0, 191, 255, 0.3)',
              boxShadow: '0 0 10px rgba(0, 191, 255, 0.2)',
              padding: 'clamp(0.5rem, 1vw, 0.75rem)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}>
              <h3 style={{
                color: '#87ceeb',
                fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)',
                margin: '0 0 clamp(0.5rem, 1vw, 0.75rem) 0',
                borderBottom: '1px solid rgba(0, 191, 255, 0.3)',
                paddingBottom: 'clamp(0.25rem, 0.5vw, 0.5rem)',
                textAlign: 'center'
              }}>
                SECURITY ALERTS
              </h3>

              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(0.25rem, 0.5vw, 0.5rem)',
                overflowY: 'auto',
                maxHeight: '100%'
              }}>
                {alerts.map((alert, index) => (
                  <div key={alert.id} style={{
                    background: 'rgba(40, 40, 80, 0.6)',
                    padding: 'clamp(0.25rem, 0.5vw, 0.5rem)',
                    borderRadius: '4px',
                    border: `1px solid ${getAlertColor(alert.level)}40`,
                    fontSize: 'clamp(0.6rem, 1.1vw, 0.7rem)'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.1rem'
                    }}>
                      <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>{alert.id}</span>
                      <span style={{
                        color: getAlertColor(alert.level),
                        fontWeight: 'bold',
                        fontSize: '0.9em'
                      }}>
                        {alert.level}
                      </span>
                    </div>
                    <div style={{ color: '#e0e0e0', marginBottom: '0.1rem', lineHeight: '1.2' }}>
                      {alert.message}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85em' }}>
                      <span style={{ color: '#87ceeb' }}>Time: {alert.time}</span>
                      <span style={{ color: '#00bfff' }}>Container: {alert.container}</span>
                    </div>
                    <div style={{
                      marginTop: '0.1rem',
                      color: alert.status === 'ACTIVE' ? '#ff4444' : alert.status === 'INVESTIGATING' ? '#ffa500' : '#00ff00',
                      fontWeight: 'bold',
                      fontSize: '0.8em'
                    }}>
                      Status: {alert.status}
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

      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default ContainerScanner;