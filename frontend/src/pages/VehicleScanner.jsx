import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import BottomPanel from '../components/BottomPanel';
import '../styles/security.css';

const VehicleScanner = () => {
  const [activeStation, setActiveStation] = useState('ALL');
  const [isScanning, setIsScanning] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Vehicle scanner ready - Position vehicle at checkpoint');
  const [currentScan, setCurrentScan] = useState(null);
  const [scanProgress, setScanProgress] = useState(0);

  // Current vehicle scan data
  const [vehicleData, setVehicleData] = useState({
    scanId: 'VS-2024-001',
    timestamp: new Date().toLocaleString(),
    plateNumber: 'WKL 8888 X',
    plateConfidence: 98.5,
    vehicleType: 'SUV',
    make: 'Honda',
    model: 'CR-V',
    year: 2023,
    color: 'White',
    owner: 'Datuk Ahmad Bin Hassan',
    icNumber: '750612-08-5678',
    registrationStatus: 'VALID',
    insuranceStatus: 'ACTIVE',
    roadTaxStatus: 'VALID',
    securityClearance: 'VIP',
    accessLevel: 'UNRESTRICTED',
    violations: [],
    lastEntry: '2024-01-06 16:45:00',
    entryCount: 89,
    parkingZone: 'VIP Zone A',
    purpose: 'Official Business',
    escort: 'Required',
    validUntil: '31 Dec 2024'
  });

  // Live scanning statistics
  const [scanStats, setScanStats] = useState({
    todayScans: 1247,
    authorized: 1156,
    denied: 23,
    pending: 68,
    violations: 5,
    avgScanTime: '2.3s',
    systemUptime: '99.8%',
    lastMaintenance: '2024-01-01'
  });

  // Alert system
  const [alerts, setAlerts] = useState([
    {
      id: 'ALT-001',
      time: '15:42:18',
      type: 'SECURITY',
      level: 'HIGH',
      message: 'Unauthorized vehicle detected at Gate 3',
      plate: 'ABC 1234 Z',
      status: 'ACTIVE'
    },
    {
      id: 'ALT-002',
      time: '15:38:45',
      type: 'SYSTEM',
      level: 'MEDIUM',
      message: 'Camera 2 requires calibration',
      plate: 'N/A',
      status: 'ACKNOWLEDGED'
    },
    {
      id: 'ALT-003',
      time: '15:35:12',
      type: 'VIOLATION',
      level: 'LOW',
      message: 'Expired road tax detected',
      plate: 'JHR 5555 B',
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
        todayScans: prev.todayScans + Math.floor(Math.random() * 3),
        authorized: prev.authorized + Math.floor(Math.random() * 2),
        pending: Math.max(0, prev.pending + Math.floor(Math.random() * 3) - 1)
      }));

      // Update plate confidence
      setVehicleData(prev => ({
        ...prev,
        plateConfidence: 97.0 + Math.random() * 2.5
      }));

      // Occasionally add new alerts
      if (Math.random() > 0.95) {
        const alertTypes = ['SECURITY', 'SYSTEM', 'VIOLATION'];
        const alertLevels = ['HIGH', 'MEDIUM', 'LOW'];
        const messages = [
          'Suspicious vehicle behavior detected',
          'License plate scanner maintenance required',
          'Vehicle overstay in restricted zone',
          'Unregistered vehicle attempting entry'
        ];
        
        const newAlert = {
          id: `ALT-${String(Date.now()).slice(-3)}`,
          time: new Date().toTimeString().slice(0, 8),
          type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
          level: alertLevels[Math.floor(Math.random() * alertLevels.length)],
          message: messages[Math.floor(Math.random() * messages.length)],
          plate: `${['WKL', 'SGR', 'JHR'][Math.floor(Math.random() * 3)]} ${Math.floor(Math.random() * 9999)} ${['A', 'B', 'C'][Math.floor(Math.random() * 3)]}`,
          status: 'ACTIVE'
        };

        setAlerts(prev => [newAlert, ...prev.slice(0, 2)]);
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
    setStatusMessage('Initializing vehicle scanner...');
    
    // Simulate scanning progress
    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          setIsScanning(false);
          setStatusMessage('Vehicle scan completed - Access granted');
          setCurrentScan(vehicleData);
          return 100;
        }
        
        // Update status messages based on progress
        if (newProgress > 80) {
          setStatusMessage('Verifying security clearance...');
        } else if (newProgress > 60) {
          setStatusMessage('Cross-referencing database...');
        } else if (newProgress > 40) {
          setStatusMessage('Analyzing license plate...');
        } else if (newProgress > 20) {
          setStatusMessage('Capturing vehicle image...');
        }
        
        return newProgress;
      });
    }, 200);
  };

  const getStatusColor = (status) => {
    switch(status.toUpperCase()) {
      case 'VALID': case 'ACTIVE': case 'AUTHORIZED': return '#00ff00';
      case 'EXPIRED': case 'DENIED': case 'INVALID': return '#ff4444';
      case 'PENDING': case 'WARNING': return '#ffa500';
      case 'VIP': case 'UNRESTRICTED': return '#ff6b6b';
      default: return '#87ceeb';
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
        <Header title="Vehicle Scanner System" />
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gridTemplateRows: '1fr 180px',
          gap: 'clamp(0.5rem, 1.5vw, 1rem)',
          flex: 1,
          overflow: 'hidden',
          padding: 'clamp(0.5rem, 1.5vw, 1rem)',
          height: 'calc(100vh - clamp(120px, 15vh, 160px))'
        }}>
          {/* Left - Main Scanner Display */}
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
              VEHICLE CHECKPOINT SCANNER
            </h2>

            {/* Scanner Camera View */}
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
              {/* Scanner Grid Overlay */}
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
                backgroundSize: '20px 20px',
                opacity: 0.3
              }} />

              {/* License Plate Detection Zone */}
              <div style={{
                position: 'absolute',
                top: '30%',
                left: '25%',
                right: '25%',
                height: '40%',
                border: '2px dashed rgba(0, 191, 255, 0.6)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isScanning ? 'rgba(0, 191, 255, 0.1)' : 'transparent'
              }}>
                <div style={{
                  textAlign: 'center',
                  color: '#87ceeb'
                }}>
                  <div style={{
                    fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)',
                    fontWeight: 'bold',
                    marginBottom: '0.5rem'
                  }}>
                    {isScanning ? vehicleData.plateNumber : 'POSITION VEHICLE'}
                  </div>
                  <div style={{
                    fontSize: 'clamp(0.8rem, 1.8vw, 1rem)',
                    opacity: 0.8
                  }}>
                    {isScanning ? `Confidence: ${vehicleData.plateConfidence.toFixed(1)}%` : 'License Plate Detection Zone'}
                  </div>
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
                  height: '3px',
                  background: 'linear-gradient(90deg, transparent, #00bfff, transparent)',
                  animation: 'scan 2s linear infinite'
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
                  background: isScanning ? 'rgba(135, 206, 235, 0.3)' : 'linear-gradient(135deg, #00bfff, #87ceeb)',
                  color: isScanning ? '#87ceeb' : '#000',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: 'clamp(1rem, 2.2vw, 1.3rem)',
                  fontWeight: 'bold',
                  cursor: isScanning ? 'not-allowed' : 'pointer',
                  boxShadow: isScanning ? 'none' : '0 0 15px rgba(0, 191, 255, 0.4)',
                  transition: 'all 0.3s ease'
                }}
              >
                {isScanning ? `SCANNING... ${scanProgress.toFixed(0)}%` : 'INITIATE VEHICLE SCAN'}
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
                  color: '#87ceeb',
                  fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                  fontWeight: 'bold'
                }}>
                  {statusMessage}
                </div>
              </div>
            </div>
          </div>

          {/* Right - Vehicle Information */}
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
              VEHICLE DETAILS
            </h3>

            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(0.75rem, 1.5vw, 1rem)',
              fontSize: 'clamp(0.8rem, 1.6vw, 0.95rem)'
            }}>
              <div style={{
                background: 'rgba(40, 40, 80, 0.6)',
                padding: 'clamp(0.75rem, 1.5vw, 1rem)',
                borderRadius: '8px',
                border: '1px solid rgba(0, 191, 255, 0.2)'
              }}>
                <div style={{ color: '#87ceeb', fontWeight: 'bold', marginBottom: '0.5rem' }}>License Plate</div>
                <div style={{ color: '#00bfff', fontSize: '1.2em', fontWeight: 'bold' }}>{vehicleData.plateNumber}</div>
                <div style={{ color: '#00ff00', fontSize: '0.9em' }}>Confidence: {vehicleData.plateConfidence.toFixed(1)}%</div>
              </div>

              <div style={{
                background: 'rgba(40, 40, 80, 0.6)',
                padding: 'clamp(0.75rem, 1.5vw, 1rem)',
                borderRadius: '8px',
                border: '1px solid rgba(0, 191, 255, 0.2)'
              }}>
                <div style={{ color: '#87ceeb', fontWeight: 'bold', marginBottom: '0.5rem' }}>Vehicle Info</div>
                <div style={{ color: '#e0e0e0' }}>{vehicleData.year} {vehicleData.make} {vehicleData.model}</div>
                <div style={{ color: '#e0e0e0' }}>{vehicleData.vehicleType} - {vehicleData.color}</div>
              </div>

              <div style={{
                background: 'rgba(40, 40, 80, 0.6)',
                padding: 'clamp(0.75rem, 1.5vw, 1rem)',
                borderRadius: '8px',
                border: '1px solid rgba(0, 191, 255, 0.2)'
              }}>
                <div style={{ color: '#87ceeb', fontWeight: 'bold', marginBottom: '0.5rem' }}>Owner</div>
                <div style={{ color: '#e0e0e0' }}>{vehicleData.owner}</div>
                <div style={{ color: '#00bfff' }}>{vehicleData.icNumber}</div>
              </div>

              <div style={{
                background: 'rgba(40, 40, 80, 0.6)',
                padding: 'clamp(0.75rem, 1.5vw, 1rem)',
                borderRadius: '8px',
                border: '1px solid rgba(0, 191, 255, 0.2)'
              }}>
                <div style={{ color: '#87ceeb', fontWeight: 'bold', marginBottom: '0.5rem' }}>Security Status</div>
                <div style={{ 
                  color: getStatusColor(vehicleData.securityClearance), 
                  fontWeight: 'bold',
                  fontSize: '1.1em'
                }}>
                  {vehicleData.securityClearance}
                </div>
                <div style={{ color: getStatusColor(vehicleData.accessLevel) }}>{vehicleData.accessLevel}</div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Statistics, Access Control, and Alerts */}
          <div style={{
            gridColumn: '1 / 3',
            gridRow: '2',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 'clamp(0.5rem, 1.5vw, 1rem)',
            height: '100%',
            overflowY: 'auto',
            minHeight: 0
          }}>
            {/* System Statistics */}
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
              TODAY'S STATISTICS
            </h3>

            <div style={{
              flex: 1,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'clamp(0.5rem, 1vw, 0.75rem)',
              fontSize: 'clamp(0.7rem, 1.4vw, 0.85rem)'
            }}>
              <div style={{
                background: 'rgba(0, 255, 0, 0.1)',
                padding: 'clamp(0.5rem, 1vw, 0.75rem)',
                borderRadius: '6px',
                border: '1px solid rgba(0, 255, 0, 0.3)',
                textAlign: 'center'
              }}>
                <div style={{ color: '#00ff00', fontWeight: 'bold', fontSize: '1.5em' }}>{scanStats.authorized}</div>
                <div style={{ color: '#87ceeb' }}>Authorized</div>
              </div>

              <div style={{
                background: 'rgba(255, 68, 68, 0.1)',
                padding: 'clamp(0.5rem, 1vw, 0.75rem)',
                borderRadius: '6px',
                border: '1px solid rgba(255, 68, 68, 0.3)',
                textAlign: 'center'
              }}>
                <div style={{ color: '#ff4444', fontWeight: 'bold', fontSize: '1.5em' }}>{scanStats.denied}</div>
                <div style={{ color: '#87ceeb' }}>Denied</div>
              </div>

              <div style={{
                background: 'rgba(255, 165, 0, 0.1)',
                padding: 'clamp(0.5rem, 1vw, 0.75rem)',
                borderRadius: '6px',
                border: '1px solid rgba(255, 165, 0, 0.3)',
                textAlign: 'center'
              }}>
                <div style={{ color: '#ffa500', fontWeight: 'bold', fontSize: '1.5em' }}>{scanStats.pending}</div>
                <div style={{ color: '#87ceeb' }}>Pending</div>
              </div>

              <div style={{
                background: 'rgba(0, 191, 255, 0.1)',
                padding: 'clamp(0.5rem, 1vw, 0.75rem)',
                borderRadius: '6px',
                border: '1px solid rgba(0, 191, 255, 0.3)',
                textAlign: 'center'
              }}>
                <div style={{ color: '#00bfff', fontWeight: 'bold', fontSize: '1.5em' }}>{scanStats.todayScans}</div>
                <div style={{ color: '#87ceeb' }}>Total Scans</div>
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
                <span style={{ color: '#87ceeb' }}>Avg Scan Time:</span>
                <span style={{ color: '#00ff00' }}>{scanStats.avgScanTime}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#87ceeb' }}>System Uptime:</span>
                <span style={{ color: '#00ff00' }}>{scanStats.systemUptime}</span>
              </div>
            </div>
          </div>

          {/* Bottom Middle - Access Control */}
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
              ACCESS CONTROL
            </h3>

            <div style={{
              flex: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(0.25rem, 0.5vw, 0.5rem)',
              fontSize: 'clamp(0.65rem, 1.2vw, 0.75rem)'
            }}>
              <div style={{
                background: 'rgba(40, 40, 80, 0.6)',
                padding: 'clamp(0.25rem, 0.5vw, 0.5rem)',
                borderRadius: '6px',
                border: '1px solid rgba(0, 191, 255, 0.2)'
              }}>
                <div style={{ color: '#87ceeb', fontWeight: 'bold', marginBottom: '0.5rem' }}>Registration Status</div>
                <div style={{ color: getStatusColor(vehicleData.registrationStatus), fontWeight: 'bold' }}>
                  {vehicleData.registrationStatus}
                </div>
              </div>

              <div style={{
                background: 'rgba(40, 40, 80, 0.6)',
                padding: 'clamp(0.25rem, 0.5vw, 0.5rem)',
                borderRadius: '6px',
                border: '1px solid rgba(0, 191, 255, 0.2)'
              }}>
                <div style={{ color: '#87ceeb', fontWeight: 'bold', marginBottom: '0.25rem' }}>Insurance & Road Tax</div>
                <div style={{ color: getStatusColor(vehicleData.insuranceStatus) }}>Insurance: {vehicleData.insuranceStatus}</div>
                <div style={{ color: getStatusColor(vehicleData.roadTaxStatus) }}>Road Tax: {vehicleData.roadTaxStatus}</div>
              </div>

              <div style={{
                background: 'rgba(40, 40, 80, 0.6)',
                padding: 'clamp(0.25rem, 0.5vw, 0.5rem)',
                borderRadius: '6px',
                border: '1px solid rgba(0, 191, 255, 0.2)'
              }}>
                <div style={{ color: '#87ceeb', fontWeight: 'bold', marginBottom: '0.25rem' }}>Access Details</div>
                <div style={{ color: '#e0e0e0' }}>Zone: {vehicleData.parkingZone}</div>
                <div style={{ color: '#e0e0e0' }}>Purpose: {vehicleData.purpose}</div>
                <div style={{ color: '#e0e0e0' }}>Valid Until: {vehicleData.validUntil}</div>
              </div>

              <div style={{
                background: 'rgba(40, 40, 80, 0.6)',
                padding: 'clamp(0.25rem, 0.5vw, 0.5rem)',
                borderRadius: '6px',
                border: '1px solid rgba(0, 191, 255, 0.2)'
              }}>
                <div style={{ color: '#87ceeb', fontWeight: 'bold', marginBottom: '0.5rem' }}>Entry History</div>
                <div style={{ color: '#e0e0e0' }}>Last Entry: {vehicleData.lastEntry}</div>
                <div style={{ color: '#00bfff', fontWeight: 'bold' }}>Total Entries: {vehicleData.entryCount}</div>
              </div>
            </div>
          </div>

          {/* Bottom Right - Security Alerts */}
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
                    <span style={{ color: '#00bfff' }}>Plate: {alert.plate}</span>
                  </div>
                  <div style={{
                    marginTop: '0.1rem',
                    color: alert.status === 'ACTIVE' ? '#ff4444' : alert.status === 'ACKNOWLEDGED' ? '#ffa500' : '#00ff00',
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

export default VehicleScanner;