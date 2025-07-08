import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import BottomPanel from '../components/BottomPanel';
import '../styles/security.css';

const TerminalSecurity = () => {
  const [activeStation, setActiveStation] = useState('ALL');
  const [isScanning, setIsScanning] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Terminal security system active - Monitoring all areas');
  const [currentScan, setCurrentScan] = useState(null);
  const [scanProgress, setScanProgress] = useState(0);

  // Live security statistics
  const [securityStats, setSecurityStats] = useState({
    totalDetections: 1247,
    suspiciousIndividuals: 23,
    wantedPersons: 3,
    bannedItems: 15,
    behaviorAlerts: 8,
    faceMatches: 156,
    crowdDensity: 'MODERATE',
    threatLevel: 'LOW',
    systemUptime: '99.9%',
    camerasOnline: 48,
    totalCameras: 50,
    lastUpdate: new Date().toLocaleTimeString()
  });

  // Detected threats and alerts
  const [detectedThreats, setDetectedThreats] = useState([
    {
      id: 'THREAT-001',
      type: 'WANTED_PERSON',
      severity: 'HIGH',
      description: 'Individual matches wanted person database',
      location: 'Gate 3 - Immigration',
      confidence: 94.7,
      timestamp: '16:23:15',
      status: 'ACTIVE',
      action: 'SECURITY_DISPATCHED'
    },
    {
      id: 'THREAT-002',
      type: 'SUSPICIOUS_BEHAVIOR',
      severity: 'MEDIUM',
      description: 'Loitering detected in restricted area',
      location: 'Terminal B - Departure Lounge',
      confidence: 87.3,
      timestamp: '16:18:42',
      status: 'MONITORING',
      action: 'UNDER_OBSERVATION'
    },
    {
      id: 'THREAT-003',
      type: 'PROHIBITED_ITEM',
      severity: 'MEDIUM',
      description: 'Unattended baggage detected',
      location: 'Terminal A - Check-in Area',
      confidence: 91.2,
      timestamp: '16:15:28',
      status: 'RESOLVED',
      action: 'ITEM_REMOVED'
    },
    {
      id: 'THREAT-004',
      type: 'CROWD_ANOMALY',
      severity: 'LOW',
      description: 'Unusual crowd gathering pattern',
      location: 'Food Court - Level 2',
      confidence: 76.8,
      timestamp: '16:12:03',
      status: 'MONITORING',
      action: 'CROWD_CONTROL_NOTIFIED'
    }
  ]);

  // Advanced analytics data
  const [analyticsData, setAnalyticsData] = useState({
    faceRecognition: {
      totalScans: 15847,
      matches: 156,
      watchlistHits: 3,
      accuracy: 98.7
    },
    behaviorAnalysis: {
      normalBehavior: 92.3,
      suspiciousBehavior: 6.2,
      aggressiveBehavior: 1.5,
      alertsGenerated: 23
    },
    objectDetection: {
      prohibitedItems: 15,
      unattendedBaggage: 7,
      weaponDetection: 0,
      falsePositives: 2.1
    },
    crowdAnalysis: {
      currentOccupancy: 2847,
      maxCapacity: 5000,
      densityLevel: 'MODERATE',
      flowRate: 'NORMAL'
    }
  });

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
      // Update security statistics
      setSecurityStats(prev => ({
        ...prev,
        totalDetections: prev.totalDetections + Math.floor(Math.random() * 5),
        suspiciousIndividuals: Math.max(0, prev.suspiciousIndividuals + Math.floor(Math.random() * 3) - 1),
        faceMatches: prev.faceMatches + Math.floor(Math.random() * 3),
        lastUpdate: new Date().toLocaleTimeString()
      }));

      // Update analytics
      setAnalyticsData(prev => ({
        ...prev,
        faceRecognition: {
          ...prev.faceRecognition,
          totalScans: prev.faceRecognition.totalScans + Math.floor(Math.random() * 10),
          matches: prev.faceRecognition.matches + Math.floor(Math.random() * 2)
        },
        crowdAnalysis: {
          ...prev.crowdAnalysis,
          currentOccupancy: Math.max(1000, prev.crowdAnalysis.currentOccupancy + Math.floor(Math.random() * 20) - 10)
        }
      }));

      // Occasionally add new threats
      if (Math.random() > 0.95) {
        const threatTypes = ['SUSPICIOUS_BEHAVIOR', 'PROHIBITED_ITEM', 'CROWD_ANOMALY', 'UNAUTHORIZED_ACCESS'];
        const severityLevels = ['HIGH', 'MEDIUM', 'LOW'];
        const locations = [
          'Gate 1 - Security Check',
          'Terminal A - Departure',
          'Terminal B - Arrival',
          'Baggage Claim Area',
          'Immigration Counter',
          'Duty Free Zone'
        ];
        const descriptions = [
          'Suspicious movement pattern detected',
          'Unattended item requires investigation',
          'Unusual crowd behavior observed',
          'Unauthorized area access attempt'
        ];
        
        const newThreat = {
          id: `THREAT-${String(Date.now()).slice(-3)}`,
          type: threatTypes[Math.floor(Math.random() * threatTypes.length)],
          severity: severityLevels[Math.floor(Math.random() * severityLevels.length)],
          description: descriptions[Math.floor(Math.random() * descriptions.length)],
          location: locations[Math.floor(Math.random() * locations.length)],
          confidence: 70 + Math.random() * 25,
          timestamp: new Date().toTimeString().slice(0, 8),
          status: 'ACTIVE',
          action: 'INVESTIGATING'
        };

        setDetectedThreats(prev => [newThreat, ...prev.slice(0, 3)]);
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
    setScanProgress(0);
    setStatusMessage('Initiating comprehensive security scan...');
    
    // Simulate scanning progress
    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          setIsScanning(false);
          setStatusMessage('Security scan completed - All areas monitored');
          setCurrentScan(securityStats);
          return 100;
        }
        
        // Update status messages based on progress
        if (newProgress > 80) {
          setStatusMessage('Analyzing behavioral patterns...');
        } else if (newProgress > 60) {
          setStatusMessage('Processing facial recognition...');
        } else if (newProgress > 40) {
          setStatusMessage('Scanning for prohibited items...');
        } else if (newProgress > 20) {
          setStatusMessage('Monitoring crowd dynamics...');
        }
        
        return newProgress;
      });
    }, 250);
  };

  const getSeverityColor = (severity) => {
    switch(severity.toUpperCase()) {
      case 'HIGH': return '#ff4444';
      case 'MEDIUM': return '#ffa500';
      case 'LOW': return '#87ceeb';
      default: return '#e0e0e0';
    }
  };

  const getStatusColor = (status) => {
    switch(status.toUpperCase()) {
      case 'ACTIVE': return '#ff4444';
      case 'MONITORING': return '#ffa500';
      case 'RESOLVED': return '#00ff00';
      case 'NORMAL': return '#00ff00';
      case 'MODERATE': return '#ffa500';
      case 'HIGH': return '#ff4444';
      case 'LOW': return '#87ceeb';
      default: return '#e0e0e0';
    }
  };

  const getThreatTypeIcon = (type) => {
    switch(type) {
      case 'WANTED_PERSON': return 'WANTED';
      case 'SUSPICIOUS_BEHAVIOR': return 'BEHAVIOR';
      case 'PROHIBITED_ITEM': return 'ITEM';
      case 'CROWD_ANOMALY': return 'CROWD';
      case 'UNAUTHORIZED_ACCESS': return 'ACCESS';
      default: return 'ALERT';
    }
  };

  return (
    <>
      <div className="test-scanlines"></div>
      <div className="test-container">
        <Header title="Terminal Security Monitoring System" />
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(0.5rem, 1.5vw, 1rem)',
          flex: 1,
          overflow: 'hidden',
          padding: 'clamp(0.5rem, 1.5vw, 1rem)',
          height: 'calc(100vh - clamp(120px, 15vh, 160px))'
        }}>
          {/* Main Security Camera Display */}
          <div style={{
            flex: '2',
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
              ADVANCED TERMINAL SECURITY MONITORING
            </h2>

            {/* Main Camera View */}
            <div style={{
              flex: 1,
              background: '#000',
              borderRadius: '8px',
              border: '3px solid rgba(0, 191, 255, 0.4)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '300px',
              overflow: 'hidden'
            }}>
              {/* Security Grid Overlay */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `
                  linear-gradient(rgba(0, 191, 255, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0, 191, 255, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '25px 25px',
                opacity: 0.3
              }} />

              {/* Terminal Layout Visualization */}
              <div style={{
                position: 'absolute',
                top: '10%',
                left: '10%',
                right: '10%',
                bottom: '10%',
                border: '2px solid rgba(0, 191, 255, 0.6)',
                borderRadius: '8px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gridTemplateRows: '1fr 1fr',
                gap: '4px',
                padding: '8px'
              }}>
                {/* Security Zones */}
                {[
                  { name: 'GATE 1', status: 'CLEAR', count: 45 },
                  { name: 'GATE 2', status: 'ALERT', count: 23 },
                  { name: 'GATE 3', status: 'CLEAR', count: 67 },
                  { name: 'DEPARTURE', status: 'MODERATE', count: 234 },
                  { name: 'ARRIVAL', status: 'CLEAR', count: 156 },
                  { name: 'BAGGAGE', status: 'CLEAR', count: 89 }
                ].map((zone, index) => (
                  <div key={index} style={{
                    background: `rgba(${zone.status === 'CLEAR' ? '0, 255, 0' : zone.status === 'ALERT' ? '255, 68, 68' : '255, 165, 0'}, 0.2)`,
                    border: `1px solid ${getStatusColor(zone.status)}`,
                    borderRadius: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'clamp(0.7rem, 1.4vw, 0.9rem)',
                    color: getStatusColor(zone.status),
                    fontWeight: 'bold',
                    textAlign: 'center',
                    opacity: isScanning ? 0.9 : 0.7
                  }}>
                    <div>{zone.name}</div>
                    <div style={{ fontSize: '0.8em', marginTop: '2px' }}>{zone.count}</div>
                  </div>
                ))}
              </div>

              {/* Threat Indicators */}
              <div style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{
                  background: 'rgba(255, 68, 68, 0.8)',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: 'clamp(0.8rem, 1.6vw, 1rem)',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  border: '1px solid #ff4444'
                }}>
                  THREATS: {securityStats.suspiciousIndividuals + securityStats.wantedPersons}
                </div>
                <div style={{
                  background: 'rgba(0, 191, 255, 0.8)',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  color: '#000',
                  fontSize: 'clamp(0.8rem, 1.6vw, 1rem)',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  border: '1px solid #00bfff'
                }}>
                  CAMERAS: {securityStats.camerasOnline}/{securityStats.totalCameras}
                </div>
              </div>

              {/* Scanning Progress Bar */}
              {isScanning && (
                <div style={{
                  position: 'absolute',
                  bottom: '15px',
                  left: '15px',
                  right: '15px',
                  height: '8px',
                  background: 'rgba(0, 0, 0, 0.7)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${scanProgress}%`,
                    background: 'linear-gradient(90deg, #00bfff, #87ceeb)',
                    borderRadius: '4px',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              )}

              {/* Scanning Animation */}
              {isScanning && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, transparent, #00bfff, transparent)',
                  animation: 'scan 2.5s linear infinite'
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
                  background: isScanning ? 'rgba(0, 191, 255, 0.3)' : 'linear-gradient(135deg, #00bfff, #87ceeb)',
                  color: isScanning ? '#00bfff' : '#000',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: 'clamp(1rem, 2.2vw, 1.3rem)',
                  fontWeight: 'bold',
                  cursor: isScanning ? 'not-allowed' : 'pointer',
                  boxShadow: isScanning ? 'none' : '0 0 15px rgba(0, 191, 255, 0.4)',
                  transition: 'all 0.3s ease'
                }}
              >
                {isScanning ? `SCANNING... ${scanProgress.toFixed(0)}%` : 'INITIATE SECURITY SCAN'}
              </button>

              <div style={{
                flex: 2,
                textAlign: 'center',
                padding: 'clamp(0.75rem, 2vw, 1rem)',
                background: 'rgba(0, 0, 0, 0.6)',
                borderRadius: '8px',
                border: '1px solid rgba(0, 191, 255, 0.3)'
              }}>
                <div style={{
                  color: '#00bfff',
                  fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                  fontWeight: 'bold'
                }}>
                  {statusMessage}
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Security Analytics */}
          <div style={{
            flex: '1',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr',
            gap: 'clamp(0.5rem, 1.5vw, 1rem)',
            overflow: 'hidden'
          }}>
            {/* Threat Detection */}
            <div style={{
              background: 'rgba(25, 25, 45, 0.75)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 68, 68, 0.3)',
              boxShadow: '0 0 10px rgba(255, 68, 68, 0.2)',
              padding: 'clamp(0.5rem, 1vw, 0.75rem)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}>
              <h3 style={{
                color: '#ff4444',
                fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)',
                margin: '0 0 clamp(0.5rem, 1vw, 0.75rem) 0',
                borderBottom: '1px solid rgba(255, 68, 68, 0.3)',
                paddingBottom: 'clamp(0.25rem, 0.5vw, 0.5rem)',
                textAlign: 'center'
              }}>
                THREAT DETECTION
              </h3>

              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(0.25rem, 0.5vw, 0.5rem)',
                fontSize: 'clamp(0.65rem, 1.2vw, 0.75rem)'
              }}>
                <div style={{
                  background: 'rgba(255, 68, 68, 0.1)',
                  padding: 'clamp(0.25rem, 0.5vw, 0.5rem)',
                  borderRadius: '4px',
                  border: '1px solid rgba(255, 68, 68, 0.3)',
                  textAlign: 'center'
                }}>
                  <div style={{ color: '#ff4444', fontWeight: 'bold', fontSize: '1.5em' }}>{securityStats.wantedPersons}</div>
                  <div style={{ color: '#87ceeb' }}>Wanted Persons</div>
                </div>

                <div style={{
                  background: 'rgba(255, 165, 0, 0.1)',
                  padding: 'clamp(0.25rem, 0.5vw, 0.5rem)',
                  borderRadius: '4px',
                  border: '1px solid rgba(255, 165, 0, 0.3)',
                  textAlign: 'center'
                }}>
                  <div style={{ color: '#ffa500', fontWeight: 'bold', fontSize: '1.5em' }}>{securityStats.suspiciousIndividuals}</div>
                  <div style={{ color: '#87ceeb' }}>Suspicious</div>
                </div>

                <div style={{
                  background: 'rgba(255, 68, 68, 0.1)',
                  padding: 'clamp(0.25rem, 0.5vw, 0.5rem)',
                  borderRadius: '4px',
                  border: '1px solid rgba(255, 68, 68, 0.3)',
                  textAlign: 'center'
                }}>
                  <div style={{ color: '#ff4444', fontWeight: 'bold', fontSize: '1.5em' }}>{securityStats.bannedItems}</div>
                  <div style={{ color: '#87ceeb' }}>Banned Items</div>
                </div>

                <div style={{
                  background: 'rgba(255, 165, 0, 0.1)',
                  padding: 'clamp(0.25rem, 0.5vw, 0.5rem)',
                  borderRadius: '4px',
                  border: '1px solid rgba(255, 165, 0, 0.3)',
                  textAlign: 'center'
                }}>
                  <div style={{ color: '#ffa500', fontWeight: 'bold', fontSize: '1.5em' }}>{securityStats.behaviorAlerts}</div>
                  <div style={{ color: '#87ceeb' }}>Behavior Alerts</div>
                </div>
              </div>
            </div>

            {/* Face Recognition Analytics */}
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
                color: '#00bfff',
                fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)',
                margin: '0 0 clamp(0.5rem, 1vw, 0.75rem) 0',
                borderBottom: '1px solid rgba(0, 191, 255, 0.3)',
                paddingBottom: 'clamp(0.25rem, 0.5vw, 0.5rem)',
                textAlign: 'center'
              }}>
                FACE RECOGNITION
              </h3>

              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(0.25rem, 0.5vw, 0.5rem)',
                fontSize: 'clamp(0.65rem, 1.2vw, 0.75rem)'
              }}>
                <div style={{
                  background: 'rgba(0, 191, 255, 0.1)',
                  padding: 'clamp(0.25rem, 0.5vw, 0.5rem)',
                  borderRadius: '4px',
                  border: '1px solid rgba(0, 191, 255, 0.3)',
                  textAlign: 'center'
                }}>
                  <div style={{ color: '#00bfff', fontWeight: 'bold', fontSize: '1.5em' }}>{analyticsData.faceRecognition.totalScans}</div>
                  <div style={{ color: '#87ceeb' }}>Total Scans</div>
                </div>

                <div style={{
                  background: 'rgba(0, 255, 0, 0.1)',
                  padding: 'clamp(0.25rem, 0.5vw, 0.5rem)',
                  borderRadius: '4px',
                  border: '1px solid rgba(0, 255, 0, 0.3)',
                  textAlign: 'center'
                }}>
                  <div style={{ color: '#00ff00', fontWeight: 'bold', fontSize: '1.5em' }}>{analyticsData.faceRecognition.matches}</div>
                  <div style={{ color: '#87ceeb' }}>Matches</div>
                </div>

                <div style={{
                  background: 'rgba(255, 68, 68, 0.1)',
                  padding: 'clamp(0.25rem, 0.5vw, 0.5rem)',
                  borderRadius: '4px',
                  border: '1px solid rgba(255, 68, 68, 0.3)',
                  textAlign: 'center'
                }}>
                  <div style={{ color: '#ff4444', fontWeight: 'bold', fontSize: '1.5em' }}>{analyticsData.faceRecognition.watchlistHits}</div>
                  <div style={{ color: '#87ceeb' }}>Watchlist Hits</div>
                </div>

                <div style={{
                  background: 'rgba(0, 191, 255, 0.1)',
                  padding: 'clamp(0.25rem, 0.5vw, 0.5rem)',
                  borderRadius: '4px',
                  border: '1px solid rgba(0, 191, 255, 0.3)',
                  textAlign: 'center'
                }}>
                  <div style={{ color: '#00bfff', fontWeight: 'bold', fontSize: '1.5em' }}>{analyticsData.faceRecognition.accuracy}%</div>
                  <div style={{ color: '#87ceeb' }}>Accuracy</div>
                </div>
              </div>
            </div>

            {/* Crowd Analysis */}
            <div style={{
              background: 'rgba(25, 25, 45, 0.75)',
              borderRadius: '8px',
              border: '1px solid rgba(0, 255, 0, 0.3)',
              boxShadow: '0 0 10px rgba(0, 255, 0, 0.2)',
              padding: 'clamp(0.5rem, 1vw, 0.75rem)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}>
              <h3 style={{
                color: '#00ff00',
                fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)',
                margin: '0 0 clamp(0.5rem, 1vw, 0.75rem) 0',
                borderBottom: '1px solid rgba(0, 255, 0, 0.3)',
                paddingBottom: 'clamp(0.25rem, 0.5vw, 0.5rem)',
                textAlign: 'center'
              }}>
                CROWD ANALYSIS
              </h3>

              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
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
                  <div style={{ color: '#00ff00', fontWeight: 'bold', fontSize: '1.5em' }}>{analyticsData.crowdAnalysis.currentOccupancy}</div>
                  <div style={{ color: '#87ceeb' }}>Current People</div>
                </div>

                <div style={{
                  background: 'rgba(255, 165, 0, 0.1)',
                  padding: 'clamp(0.25rem, 0.5vw, 0.5rem)',
                  borderRadius: '4px',
                  border: '1px solid rgba(255, 165, 0, 0.3)',
                  textAlign: 'center'
                }}>
                  <div style={{ color: '#ffa500', fontWeight: 'bold', fontSize: '1.5em' }}>{analyticsData.crowdAnalysis.maxCapacity}</div>
                  <div style={{ color: '#87ceeb' }}>Max Capacity</div>
                </div>

                <div style={{
                  background: 'rgba(0, 255, 0, 0.1)',
                  padding: 'clamp(0.25rem, 0.5vw, 0.5rem)',
                  borderRadius: '4px',
                  border: '1px solid rgba(0, 255, 0, 0.3)',
                  textAlign: 'center'
                }}>
                  <div style={{ color: getStatusColor(analyticsData.crowdAnalysis.densityLevel), fontWeight: 'bold', fontSize: '1.2em' }}>{analyticsData.crowdAnalysis.densityLevel}</div>
                  <div style={{ color: '#87ceeb' }}>Density Level</div>
                </div>

                <div style={{
                  background: 'rgba(0, 191, 255, 0.1)',
                  padding: 'clamp(0.25rem, 0.5vw, 0.5rem)',
                  borderRadius: '4px',
                  border: '1px solid rgba(0, 191, 255, 0.3)',
                  textAlign: 'center'
                }}>
                  <div style={{ color: getStatusColor(analyticsData.crowdAnalysis.flowRate), fontWeight: 'bold', fontSize: '1.2em' }}>{analyticsData.crowdAnalysis.flowRate}</div>
                  <div style={{ color: '#87ceeb' }}>Flow Rate</div>
                </div>
              </div>
            </div>

            {/* Active Threats */}
            <div style={{
              background: 'rgba(25, 25, 45, 0.75)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 165, 0, 0.3)',
              boxShadow: '0 0 10px rgba(255, 165, 0, 0.2)',
              padding: 'clamp(0.5rem, 1vw, 0.75rem)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}>
              <h3 style={{
                color: '#ffa500',
                fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)',
                margin: '0 0 clamp(0.5rem, 1vw, 0.75rem) 0',
                borderBottom: '1px solid rgba(255, 165, 0, 0.3)',
                paddingBottom: 'clamp(0.25rem, 0.5vw, 0.5rem)',
                textAlign: 'center'
              }}>
                ACTIVE THREATS
              </h3>

              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(0.25rem, 0.5vw, 0.5rem)',
                overflowY: 'auto',
                fontSize: 'clamp(0.6rem, 1.1vw, 0.7rem)'
              }}>
                {detectedThreats.map((threat) => (
                  <div key={threat.id} style={{
                    background: 'rgba(40, 40, 80, 0.6)',
                    padding: 'clamp(0.25rem, 0.5vw, 0.5rem)',
                    borderRadius: '4px',
                    border: `1px solid ${getSeverityColor(threat.severity)}40`
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.1rem'
                    }}>
                      <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>{getThreatTypeIcon(threat.type)}</span>
                      <span style={{
                        color: getSeverityColor(threat.severity),
                        fontWeight: 'bold',
                        fontSize: '0.9em'
                      }}>
                        {threat.severity}
                      </span>
                    </div>
                    <div style={{ color: '#e0e0e0', marginBottom: '0.1rem', lineHeight: '1.2' }}>
                      {threat.description}
                    </div>
                    <div style={{ color: '#87ceeb', fontSize: '0.85em', marginBottom: '0.1rem' }}>
                      {threat.location}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8em' }}>
                      <span style={{ color: '#00bfff' }}>Conf: {threat.confidence.toFixed(1)}%</span>
                      <span style={{ color: getStatusColor(threat.status) }}>{threat.status}</span>
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

export default TerminalSecurity;