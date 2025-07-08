import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import BottomPanel from '../components/BottomPanel';
import '../styles/security.css';

const SecurityCheck = () => {
  const [activeStation, setActiveStation] = useState('ALL');
  const [currentScan, setCurrentScan] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const [threatAlerts, setThreatAlerts] = useState([]);
  const [scanStats, setScanStats] = useState({
    totalScans: 1247,
    threatsDetected: 23,
    clearItems: 1198,
    flaggedItems: 26,
    avgScanTime: 12.5,
    systemUptime: '99.7%'
  });

  const [detectedItems] = useState([
    {
      id: 1,
      type: 'LIQUID',
      description: 'Liquid container >100ml',
      location: { x: 45, y: 32 },
      threatLevel: 'MEDIUM',
      confidence: 87.3,
      action: 'MANUAL_INSPECTION'
    },
    {
      id: 2,
      type: 'METAL',
      description: 'Dense metallic object',
      location: { x: 78, y: 56 },
      threatLevel: 'HIGH',
      confidence: 94.1,
      action: 'IMMEDIATE_REVIEW'
    },
    {
      id: 3,
      type: 'ORGANIC',
      description: 'Organic material - food items',
      location: { x: 23, y: 71 },
      threatLevel: 'LOW',
      confidence: 76.8,
      action: 'CLEARED'
    }
  ]);

  const [recentScans] = useState([
    {
      id: 'BAG-2024-001247',
      timestamp: '14:42:15',
      passenger: 'Ahmad bin Hassan',
      flightNo: 'MH370',
      status: 'CLEARED',
      scanTime: 11.2,
      itemsDetected: 5,
      threats: 0
    },
    {
      id: 'BAG-2024-001246',
      timestamp: '14:41:58',
      passenger: 'Sarah Lee Wei Ming',
      flightNo: 'AK6285',
      status: 'FLAGGED',
      scanTime: 15.7,
      itemsDetected: 8,
      threats: 1
    },
    {
      id: 'BAG-2024-001245',
      timestamp: '14:41:33',
      passenger: 'Raj Kumar Patel',
      flightNo: 'MH103',
      status: 'MANUAL_CHECK',
      scanTime: 18.3,
      itemsDetected: 12,
      threats: 2
    },
    {
      id: 'BAG-2024-001244',
      timestamp: '14:41:09',
      passenger: 'Fatimah binti Ali',
      flightNo: 'OD1502',
      status: 'CLEARED',
      scanTime: 9.8,
      itemsDetected: 3,
      threats: 0
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

    // Simulate real-time scanning
    const interval = setInterval(() => {
      setScanStats(prev => ({
        ...prev,
        totalScans: prev.totalScans + Math.floor(Math.random() * 2),
        avgScanTime: 10 + Math.random() * 8
      }));

      // Add new threat alerts occasionally
      if (Math.random() > 0.9) {
        const threats = [
          'Suspicious liquid detected in carry-on',
          'Metal object requires inspection',
          'Oversized battery pack flagged',
          'Unknown organic material detected',
          'Dense object blocking X-ray view'
        ];
        
        const newAlert = {
          id: Date.now(),
          timestamp: new Date().toTimeString().slice(0, 8),
          message: threats[Math.floor(Math.random() * threats.length)],
          level: ['LOW', 'MEDIUM', 'HIGH'][Math.floor(Math.random() * 3)],
          bagId: `BAG-2024-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`
        };

        setThreatAlerts(prev => [newAlert, ...prev.slice(0, 4)]);
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

  const getThreatColor = (level) => {
    switch(level) {
      case 'HIGH': return '#ff4444';
      case 'MEDIUM': return '#ffa500';
      case 'LOW': return '#87ceeb';
      default: return '#e0e0e0';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'CLEARED': return '#00ff00';
      case 'FLAGGED': return '#ffa500';
      case 'MANUAL_CHECK': return '#ff4444';
      case 'SCANNING': return '#00bfff';
      default: return '#e0e0e0';
    }
  };

  return (
    <>
      <div className="test-scanlines"></div>
      <div className="test-container">
        <Header title="Baggage Security Screening System" />
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          overflow: 'hidden',
          padding: 'clamp(0.25rem, 1vw, 0.75rem)',
          gap: 'clamp(0.25rem, 0.8vw, 0.5rem)',
          paddingBottom: '0.25rem',
          height: 'calc(100vh - clamp(120px, 15vh, 160px))'
        }}>
          {/* Top Section - X-Ray Scanner Display */}
          <div style={{
            flex: '0 0 clamp(35%, 40vh, 45%)',
            display: 'flex',
            gap: 'clamp(0.25rem, 0.8vw, 0.5rem)'
          }}>
            {/* Main X-Ray Display */}
            <div style={{
              flex: '0 0 65%',
              background: 'rgba(25, 25, 45, 0.75)',
              borderRadius: '8px',
              border: '2px solid #00bfff',
              boxShadow: '0 0 15px rgba(0, 191, 255, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}>
              <div style={{
                padding: 'clamp(0.5rem, 1vw, 0.75rem)',
                borderBottom: '1px solid rgba(0, 191, 255, 0.3)',
                background: 'rgba(0, 0, 0, 0.5)'
              }}>
                <h2 style={{
                  color: '#00bfff',
                  fontSize: 'clamp(1rem, 2vw, 1.3rem)',
                  margin: 0,
                  textAlign: 'center'
                }}>
                  X-RAY SCANNER - STATION 01
                </h2>
              </div>
              
              {/* X-Ray Image Display */}
              <div style={{
                flex: 1,
                background: '#000',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {/* Simulated X-Ray baggage view */}
                <div style={{
                  width: '90%',
                  height: '80%',
                  background: 'linear-gradient(45deg, #1a1a2e 25%, #2a2a4e 25%, #2a2a4e 50%, #1a1a2e 50%, #1a1a2e 75%, #2a2a4e 75%)',
                  backgroundSize: '20px 20px',
                  border: '2px solid #00bfff',
                  borderRadius: '8px',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {/* Baggage outline */}
                  <div style={{
                    position: 'absolute',
                    top: '20%',
                    left: '15%',
                    width: '70%',
                    height: '60%',
                    border: '2px solid #87ceeb',
                    borderRadius: '12px',
                    background: 'rgba(135, 206, 235, 0.1)'
                  }}>
                    {/* Detected items overlay */}
                    {detectedItems.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          position: 'absolute',
                          left: `${item.location.x}%`,
                          top: `${item.location.y}%`,
                          width: '12px',
                          height: '12px',
                          background: getThreatColor(item.threatLevel),
                          border: `2px solid ${getThreatColor(item.threatLevel)}`,
                          borderRadius: '50%',
                          boxShadow: `0 0 10px ${getThreatColor(item.threatLevel)}`,
                          animation: 'pulse 2s infinite'
                        }}
                        title={`${item.type}: ${item.description}`}
                      />
                    ))}
                  </div>
                  
                  {/* Scanning line animation */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '2px',
                    height: '100%',
                    background: 'linear-gradient(to bottom, transparent, #00bfff, transparent)',
                    animation: 'scanLine 3s linear infinite'
                  }} />
                </div>
                
                {/* Status overlay */}
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  background: 'rgba(0, 0, 0, 0.8)',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  border: '1px solid #00bfff'
                }}>
                  <div style={{ color: '#00bfff', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    SCANNING: BAG-2024-001248
                  </div>
                  <div style={{ color: '#87ceeb', fontSize: '0.7rem' }}>
                    Passenger: Lim Chong Wei
                  </div>
                </div>
              </div>
            </div>

            {/* Scan Controls & Info */}
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(0.25rem, 0.8vw, 0.5rem)'
            }}>
              {/* Current Scan Info */}
              <div style={{
                background: 'rgba(25, 25, 45, 0.75)',
                borderRadius: '8px',
                border: '1px solid rgba(0, 191, 255, 0.3)',
                boxShadow: '0 0 10px rgba(0, 191, 255, 0.2)',
                padding: 'clamp(0.5rem, 1vw, 0.75rem)',
                flex: 1
              }}>
                <h3 style={{
                  color: '#87ceeb',
                  fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)',
                  margin: '0 0 clamp(0.5rem, 1vw, 0.75rem) 0',
                  borderBottom: '1px solid rgba(0, 191, 255, 0.3)',
                  paddingBottom: 'clamp(0.25rem, 0.5vw, 0.5rem)',
                  textAlign: 'center'
                }}>
                  CURRENT SCAN
                </h3>
                
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'clamp(0.25rem, 0.5vw, 0.5rem)',
                  fontSize: 'clamp(0.7rem, 1.3vw, 0.8rem)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#87ceeb' }}>Bag ID:</span>
                    <span style={{ color: '#00bfff', fontWeight: 'bold' }}>BAG-2024-001248</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#87ceeb' }}>Flight:</span>
                    <span style={{ color: '#e0e0e0' }}>MH2058</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#87ceeb' }}>Scan Time:</span>
                    <span style={{ color: '#00ff00' }}>14.2s</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#87ceeb' }}>Items Detected:</span>
                    <span style={{ color: '#ffa500', fontWeight: 'bold' }}>{detectedItems.length}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#87ceeb' }}>Threat Level:</span>
                    <span style={{ color: '#ff4444', fontWeight: 'bold' }}>HIGH</span>
                  </div>
                </div>
              </div>

              {/* System Stats */}
              <div style={{
                background: 'rgba(25, 25, 45, 0.75)',
                borderRadius: '8px',
                border: '1px solid rgba(0, 191, 255, 0.3)',
                boxShadow: '0 0 10px rgba(0, 191, 255, 0.2)',
                padding: 'clamp(0.5rem, 1vw, 0.75rem)',
                flex: 1
              }}>
                <h3 style={{
                  color: '#87ceeb',
                  fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)',
                  margin: '0 0 clamp(0.5rem, 1vw, 0.75rem) 0',
                  borderBottom: '1px solid rgba(0, 191, 255, 0.3)',
                  paddingBottom: 'clamp(0.25rem, 0.5vw, 0.5rem)',
                  textAlign: 'center'
                }}>
                  SYSTEM STATUS
                </h3>
                
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'clamp(0.25rem, 0.5vw, 0.5rem)',
                  fontSize: 'clamp(0.7rem, 1.3vw, 0.8rem)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#87ceeb' }}>Total Scans:</span>
                    <span style={{ color: '#00bfff', fontWeight: 'bold' }}>{scanStats.totalScans}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#87ceeb' }}>Threats Found:</span>
                    <span style={{ color: '#ff4444', fontWeight: 'bold' }}>{scanStats.threatsDetected}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#87ceeb' }}>Clear Rate:</span>
                    <span style={{ color: '#00ff00' }}>{Math.round((scanStats.clearItems / scanStats.totalScans) * 100)}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#87ceeb' }}>Avg Scan Time:</span>
                    <span style={{ color: '#87ceeb' }}>{scanStats.avgScanTime.toFixed(1)}s</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#87ceeb' }}>Uptime:</span>
                    <span style={{ color: '#00ff00' }}>{scanStats.systemUptime}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Analysis & History */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            minHeight: 0,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 'clamp(0.25rem, 0.8vw, 0.5rem)'
          }}>
            {/* Detected Items Analysis */}
            <div style={{
              background: 'rgba(25, 25, 45, 0.75)',
              borderRadius: '8px',
              border: '1px solid rgba(0, 191, 255, 0.3)',
              boxShadow: '0 0 10px rgba(0, 191, 255, 0.2)',
              padding: 'clamp(0.5rem, 1vw, 0.75rem)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <h3 style={{
                color: '#87ceeb',
                fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)',
                margin: '0 0 clamp(0.5rem, 1vw, 0.75rem) 0',
                borderBottom: '1px solid rgba(0, 191, 255, 0.3)',
                paddingBottom: 'clamp(0.25rem, 0.5vw, 0.5rem)',
                textAlign: 'center'
              }}>
                DETECTED ITEMS
              </h3>
              
              <div style={{
                flex: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(0.25rem, 0.5vw, 0.5rem)'
              }}>
                {detectedItems.map((item) => (
                  <div key={item.id} style={{
                    background: 'rgba(40, 40, 80, 0.6)',
                    padding: 'clamp(0.25rem, 0.5vw, 0.5rem)',
                    borderRadius: '6px',
                    border: `1px solid ${getThreatColor(item.threatLevel)}40`,
                    fontSize: 'clamp(0.65rem, 1.2vw, 0.75rem)'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.25rem'
                    }}>
                      <span style={{ color: '#00bfff', fontWeight: 'bold' }}>{item.type}</span>
                      <span style={{
                        color: getThreatColor(item.threatLevel),
                        fontWeight: 'bold',
                        fontSize: '0.9em'
                      }}>
                        {item.threatLevel}
                      </span>
                    </div>
                    <div style={{ color: '#e0e0e0', marginBottom: '0.25rem' }}>
                      {item.description}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9em' }}>
                      <span style={{ color: '#87ceeb' }}>Confidence: {item.confidence}%</span>
                      <span style={{ color: '#87ceeb' }}>Pos: ({item.location.x}, {item.location.y})</span>
                    </div>
                    <div style={{
                      marginTop: '0.25rem',
                      color: item.action === 'CLEARED' ? '#00ff00' : item.action === 'MANUAL_INSPECTION' ? '#ffa500' : '#ff4444',
                      fontWeight: 'bold',
                      fontSize: '0.85em'
                    }}>
                      Action: {item.action.replace('_', ' ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Scans History */}
            <div style={{
              background: 'rgba(25, 25, 45, 0.75)',
              borderRadius: '8px',
              border: '1px solid rgba(0, 191, 255, 0.3)',
              boxShadow: '0 0 10px rgba(0, 191, 255, 0.2)',
              padding: 'clamp(0.5rem, 1vw, 0.75rem)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <h3 style={{
                color: '#87ceeb',
                fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)',
                margin: '0 0 clamp(0.5rem, 1vw, 0.75rem) 0',
                borderBottom: '1px solid rgba(0, 191, 255, 0.3)',
                paddingBottom: 'clamp(0.25rem, 0.5vw, 0.5rem)',
                textAlign: 'center'
              }}>
                RECENT SCANS
              </h3>
              
              <div style={{
                flex: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(0.25rem, 0.5vw, 0.5rem)'
              }}>
                {recentScans.map((scan) => (
                  <div key={scan.id} style={{
                    background: 'rgba(40, 40, 80, 0.6)',
                    padding: 'clamp(0.25rem, 0.5vw, 0.5rem)',
                    borderRadius: '6px',
                    border: `1px solid ${getStatusColor(scan.status)}40`,
                    fontSize: 'clamp(0.65rem, 1.2vw, 0.75rem)'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.25rem'
                    }}>
                      <span style={{ color: '#00bfff', fontWeight: 'bold', fontSize: '0.9em' }}>
                        {scan.id.slice(-6)}
                      </span>
                      <span style={{
                        color: getStatusColor(scan.status),
                        fontWeight: 'bold',
                        fontSize: '0.8em'
                      }}>
                        {scan.status}
                      </span>
                    </div>
                    <div style={{ color: '#e0e0e0', marginBottom: '0.25rem', fontSize: '0.9em' }}>
                      {scan.passenger}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85em' }}>
                      <span style={{ color: '#87ceeb' }}>{scan.flightNo}</span>
                      <span style={{ color: '#87ceeb' }}>{scan.timestamp}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8em', marginTop: '0.25rem' }}>
                      <span style={{ color: '#87ceeb' }}>Items: {scan.itemsDetected}</span>
                      <span style={{ color: scan.threats > 0 ? '#ff4444' : '#00ff00' }}>
                        Threats: {scan.threats}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Threat Alerts */}
            <div style={{
              background: 'rgba(25, 25, 45, 0.75)',
              borderRadius: '8px',
              border: '1px solid rgba(0, 191, 255, 0.3)',
              boxShadow: '0 0 10px rgba(0, 191, 255, 0.2)',
              padding: 'clamp(0.5rem, 1vw, 0.75rem)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <h3 style={{
                color: '#87ceeb',
                fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)',
                margin: '0 0 clamp(0.5rem, 1vw, 0.75rem) 0',
                borderBottom: '1px solid rgba(0, 191, 255, 0.3)',
                paddingBottom: 'clamp(0.25rem, 0.5vw, 0.5rem)',
                textAlign: 'center'
              }}>
                THREAT ALERTS
              </h3>
              
              <div style={{
                flex: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(0.25rem, 0.5vw, 0.5rem)'
              }}>
                {threatAlerts.length === 0 ? (
                  <div style={{
                    color: '#87ceeb',
                    textAlign: 'center',
                    fontStyle: 'italic',
                    padding: '1rem',
                    fontSize: 'clamp(0.7rem, 1.3vw, 0.8rem)'
                  }}>
                    No active threat alerts
                  </div>
                ) : (
                  threatAlerts.map((alert) => (
                    <div key={alert.id} style={{
                      background: 'rgba(40, 40, 80, 0.6)',
                      padding: 'clamp(0.25rem, 0.5vw, 0.5rem)',
                      borderRadius: '6px',
                      border: `1px solid ${getThreatColor(alert.level)}40`,
                      fontSize: 'clamp(0.65rem, 1.2vw, 0.75rem)'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.25rem'
                      }}>
                        <span style={{
                          color: getThreatColor(alert.level),
                          fontWeight: 'bold',
                          fontSize: '0.9em'
                        }}>
                          {alert.level}
                        </span>
                        <span style={{ color: '#87ceeb', fontSize: '0.8em' }}>
                          {alert.timestamp}
                        </span>
                      </div>
                      <div style={{ color: '#e0e0e0', marginBottom: '0.25rem', lineHeight: '1.2' }}>
                        {alert.message}
                      </div>
                      <div style={{ color: '#00bfff', fontSize: '0.8em' }}>
                        Bag: {alert.bagId}
                      </div>
                    </div>
                  ))
                )}
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
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.2); }
        }
        
        @keyframes scanLine {
          0% { left: 0; }
          100% { left: calc(100% - 2px); }
        }
      `}</style>
    </>
  );
};

export default SecurityCheck;