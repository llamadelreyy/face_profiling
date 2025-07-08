import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import BottomPanel from '../components/BottomPanel';
import '../styles/security.css';

const VehicleScanner = () => {
  const [activeStation, setActiveStation] = useState('ALL');
  const [isScanning, setIsScanning] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Vehicle scanner system ready');
  const [scannedVehicle, setScannedVehicle] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);

  // Sample vehicle data (Malaysian context)
  const [currentVehicle, setCurrentVehicle] = useState({
    id: 'VS-2024-001',
    timestamp: new Date().toLocaleString(),
    confidence: 96.8,
    status: 'AUTHORIZED',
    vehicle: {
      licensePlate: 'WKL 1234 A',
      state: 'Kuala Lumpur',
      vehicleType: 'Sedan',
      make: 'Toyota',
      model: 'Camry',
      year: 2022,
      color: 'Silver',
      engineCapacity: '2.5L',
      fuelType: 'Petrol',
      transmission: 'Automatic'
    },
    registration: {
      registrationNumber: 'WKL 1234 A',
      registeredOwner: 'Ahmad Bin Abdullah',
      registrationDate: '15 March 2022',
      expiryDate: '14 March 2025',
      roadTaxExpiry: '31 December 2024',
      insuranceCompany: 'Great Eastern General Insurance',
      insuranceExpiry: '15 March 2025',
      policyNumber: 'GE-AUTO-2024-567890'
    },
    driver: {
      fullName: 'Ahmad Bin Abdullah',
      icNumber: '850315-08-1234',
      licenseNumber: 'D1234567890',
      licenseClass: 'D, DA',
      licenseExpiry: '15 March 2027',
      phoneNumber: '+60 12-345 6789',
      address: 'No. 123, Jalan Bukit Bintang, 55100 Kuala Lumpur'
    },
    security: {
      clearanceLevel: 'AUTHORIZED',
      accessType: 'EMPLOYEE',
      department: 'Airport Operations',
      validUntil: '31 December 2024',
      parkingZone: 'Staff Parking Zone A',
      lastEntry: '2024-01-07 08:30:00',
      entryCount: 156,
      violations: 'None'
    },
    inspection: {
      lastInspection: '2024-01-01',
      inspectionStatus: 'PASSED',
      nextInspection: '2025-01-01',
      inspectedBy: 'Security Officer Rahman',
      notes: 'Vehicle cleared for airport access'
    }
  });

  const [recentScans, setRecentScans] = useState([
    {
      id: 'VS-001',
      time: '14:45:23',
      plate: 'WKL 1234 A',
      driver: 'Ahmad Bin Abdullah',
      status: 'AUTHORIZED',
      clearance: 'EMPLOYEE'
    },
    {
      id: 'VS-002',
      time: '14:43:15',
      plate: 'SGR 5678 B',
      driver: 'Siti Binti Rahman',
      status: 'AUTHORIZED',
      clearance: 'VISITOR'
    },
    {
      id: 'VS-003',
      time: '14:41:08',
      plate: 'JHR 9876 C',
      driver: 'Unknown',
      status: 'DENIED',
      clearance: 'NONE'
    },
    {
      id: 'VS-004',
      time: '14:38:52',
      plate: 'PEN 2468 D',
      driver: 'Lim Wei Ming',
      status: 'AUTHORIZED',
      clearance: 'CONTRACTOR'
    },
    {
      id: 'VS-005',
      time: '14:36:41',
      plate: 'SBH 1357 E',
      driver: 'John Smith',
      status: 'PENDING',
      clearance: 'VISITOR'
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

    // Simulate real-time updates
    const interval = setInterval(() => {
      // Update confidence slightly
      setCurrentVehicle(prev => ({
        ...prev,
        confidence: 95.0 + Math.random() * 3.0
      }));

      // Add new scan occasionally
      if (Math.random() > 0.92) {
        const plates = ['WKL 1234 A', 'SGR 5678 B', 'JHR 9876 C', 'PEN 2468 D', 'SBH 1357 E'];
        const drivers = ['Ahmad Bin Abdullah', 'Siti Binti Rahman', 'Lim Wei Ming', 'John Smith', 'Unknown'];
        const statuses = ['AUTHORIZED', 'DENIED', 'PENDING'];
        const clearances = ['EMPLOYEE', 'VISITOR', 'CONTRACTOR', 'NONE'];
        
        const now = new Date();
        const time = now.toTimeString().slice(0, 8);
        const randomIndex = Math.floor(Math.random() * plates.length);
        
        const newScan = {
          id: `VS-${String(Date.now()).slice(-3)}`,
          time,
          plate: plates[randomIndex],
          driver: drivers[randomIndex],
          status: statuses[Math.floor(Math.random() * statuses.length)],
          clearance: clearances[randomIndex]
        };

        setRecentScans(prev => [newScan, ...prev.slice(0, 4)]);
      }
    }, 5000);

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
    setStatusMessage('Scanning vehicle and license plate...');
    
    // Simulate scanning process
    setTimeout(() => {
      setIsScanning(false);
      setStatusMessage('Vehicle scan completed successfully');
      setScannedVehicle(currentVehicle);
      
      // Update current vehicle data
      setCurrentVehicle(prev => ({
        ...prev,
        id: `VS-2024-${String(Date.now()).slice(-3)}`,
        timestamp: new Date().toLocaleString()
      }));
    }, 4000);
  };

  const getStatusColor = (status) => {
    switch(status.toUpperCase()) {
      case 'AUTHORIZED': return '#00ff00';
      case 'DENIED': return '#ff4444';
      case 'PENDING': return '#ffa500';
      case 'EXPIRED': return '#ff6b6b';
      default: return '#87ceeb';
    }
  };

  const getClearanceColor = (clearance) => {
    switch(clearance.toUpperCase()) {
      case 'EMPLOYEE': return '#4ecdc4';
      case 'VISITOR': return '#96ceb4';
      case 'CONTRACTOR': return '#45b7d1';
      case 'VIP': return '#ff6b6b';
      case 'NONE': return '#95a5a6';
      default: return '#87ceeb';
    }
  };

  return (
    <>
      <div className="test-scanlines"></div>
      <div className="test-container">
        <Header title="Vehicle Scanner System" />
        
        <div style={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden',
          paddingTop: 'clamp(0.25rem, 1vw, 0.75rem)',
          paddingBottom: 'clamp(0.25rem, 1vw, 0.75rem)',
          paddingLeft: 'clamp(0.25rem, 1vw, 0.75rem)',
          paddingRight: 'clamp(0.25rem, 1vw, 0.75rem)',
          gap: 'clamp(0.5rem, 1.5vw, 1rem)',
          height: 'calc(100vh - clamp(120px, 15vh, 160px))'
        }}>
          {/* Left Panel - Vehicle Scanner */}
          <div style={{
            flex: '0 0 40%',
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(0.5rem, 1vw, 0.75rem)',
            minHeight: 0
          }}>
            {/* Scanner Camera */}
            <div style={{
              flex: '0 0 clamp(55%, 60vh, 65%)',
              background: 'rgba(25, 25, 45, 0.75)',
              borderRadius: '8px',
              border: '1px solid rgba(0, 191, 255, 0.3)',
              boxShadow: '0 0 15px rgba(0, 191, 255, 0.2)',
              padding: 'clamp(0.75rem, 2vw, 1rem)',
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0
            }}>
              <h3 style={{
                color: '#87ceeb',
                fontSize: 'clamp(1rem, 2.2vw, 1.3rem)',
                margin: '0 0 clamp(0.5rem, 1.5vw, 0.75rem) 0',
                borderBottom: '1px solid rgba(0, 191, 255, 0.3)',
                paddingBottom: 'clamp(0.15rem, 0.5vw, 0.25rem)',
                textAlign: 'center'
              }}>
                Vehicle Scanner Camera
              </h3>

              {/* Camera Display */}
              <div style={{
                flex: 1,
                background: '#000',
                borderRadius: '8px',
                border: '2px solid rgba(0, 191, 255, 0.3)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '250px',
                overflow: 'hidden'
              }}>
                <div style={{
                  textAlign: 'center',
                  color: '#87ceeb'
                }}>
                  <div style={{
                    fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                    marginBottom: '0.5rem',
                    opacity: 0.6,
                    fontWeight: 'bold'
                  }}>
                    SCANNER
                  </div>
                  <div style={{
                    fontSize: 'clamp(0.8rem, 2vw, 1.1rem)',
                    fontWeight: 'bold'
                  }}>
                    License Plate Recognition
                  </div>
                  <div style={{
                    fontSize: 'clamp(0.7rem, 1.5vw, 0.9rem)',
                    marginTop: '0.25rem',
                    opacity: 0.8
                  }}>
                    Vehicle Identification System
                  </div>
                </div>

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
                      SCANNING VEHICLE...
                    </div>
                  </div>
                )}
              </div>

              {/* Control Button */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: 'clamp(0.5rem, 1.5vw, 0.75rem)'
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
                  {isScanning ? 'SCANNING...' : 'START VEHICLE SCAN'}
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
                fontSize: 'clamp(0.8rem, 1.8vw, 1rem)',
                marginTop: 'clamp(0.5rem, 1vw, 0.75rem)'
              }}>
                {statusMessage}
              </div>
            </div>

            {/* Recent Scans */}
            <div style={{
              flex: '1 1 auto',
              background: 'rgba(25, 25, 45, 0.75)',
              borderRadius: '8px',
              border: '1px solid rgba(0, 191, 255, 0.3)',
              boxShadow: '0 0 15px rgba(0, 191, 255, 0.2)',
              padding: 'clamp(0.75rem, 2vw, 1rem)',
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0,
              maxHeight: 'clamp(200px, 35vh, 350px)'
            }}>
              <h3 style={{
                color: '#87ceeb',
                fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                margin: '0 0 clamp(0.5rem, 1.5vw, 0.75rem) 0',
                borderBottom: '1px solid rgba(0, 191, 255, 0.3)',
                paddingBottom: 'clamp(0.15rem, 0.5vw, 0.25rem)'
              }}>
                Recent Vehicle Scans
              </h3>
              
              <div style={{
                flex: '1 1 auto',
                overflowY: 'auto',
                overflowX: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(0.25rem, 0.8vw, 0.5rem)',
                minHeight: 0,
                maxHeight: '100%',
                paddingRight: '0.25rem'
              }}>
                {recentScans.map((scan, index) => (
                  <div key={scan.id} style={{
                    background: 'rgba(40, 40, 80, 0.6)',
                    borderRadius: '6px',
                    border: `1px solid ${getStatusColor(scan.status)}40`,
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
                      <span style={{ color: getStatusColor(scan.status), fontWeight: 'bold' }}>
                        {scan.status}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.15rem' }}>
                      <span style={{ color: '#87ceeb' }}>Time:</span>
                      <span style={{ color: '#e0e0e0' }}>{scan.time}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.15rem' }}>
                      <span style={{ color: '#87ceeb' }}>Plate:</span>
                      <span style={{ color: '#00bfff', fontWeight: 'bold' }}>{scan.plate}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.15rem' }}>
                      <span style={{ color: '#87ceeb' }}>Driver:</span>
                      <span style={{ color: '#e0e0e0' }}>{scan.driver}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#87ceeb' }}>Access:</span>
                      <span style={{
                        color: getClearanceColor(scan.clearance),
                        fontSize: 'clamp(0.65rem, 1.3vw, 0.75rem)',
                        fontWeight: 'bold'
                      }}>
                        {scan.clearance}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Vehicle Details */}
          <div style={{
            flex: '0 0 60%',
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(0.5rem, 1vw, 0.75rem)',
            overflowY: 'auto',
            marginRight: 'clamp(0.25rem, 1vw, 0.75rem)'
          }}>
            {/* Vehicle Information */}
            <div style={{
              background: 'rgba(25, 25, 45, 0.75)',
              borderRadius: '8px',
              border: '1px solid rgba(0, 191, 255, 0.3)',
              boxShadow: '0 0 15px rgba(0, 191, 255, 0.2)',
              padding: 'clamp(0.75rem, 2vw, 1rem)'
            }}>
              <h3 style={{
                color: '#87ceeb',
                fontSize: 'clamp(1rem, 2.2vw, 1.3rem)',
                margin: '0 0 clamp(0.5rem, 1.5vw, 0.75rem) 0',
                borderBottom: '2px solid rgba(0, 191, 255, 0.4)',
                paddingBottom: 'clamp(0.15rem, 0.5vw, 0.25rem)',
                textAlign: 'center'
              }}>
                Vehicle Information
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: 'clamp(0.5rem, 1.5vw, 0.75rem)',
                fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)'
              }}>
                <div>
                  <div style={{ marginBottom: 'clamp(0.25rem, 0.8vw, 0.5rem)' }}>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>License Plate:</span>
                    <div style={{ color: '#00bfff', marginTop: '0.15rem', fontWeight: 'bold', fontSize: '1.1em' }}>
                      {currentVehicle.vehicle.licensePlate}
                    </div>
                  </div>
                  <div style={{ marginBottom: 'clamp(0.25rem, 0.8vw, 0.5rem)' }}>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>State:</span>
                    <div style={{ color: '#e0e0e0', marginTop: '0.15rem' }}>{currentVehicle.vehicle.state}</div>
                  </div>
                  <div style={{ marginBottom: 'clamp(0.25rem, 0.8vw, 0.5rem)' }}>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>Vehicle Type:</span>
                    <div style={{ color: '#e0e0e0', marginTop: '0.15rem' }}>{currentVehicle.vehicle.vehicleType}</div>
                  </div>
                </div>
                <div>
                  <div style={{ marginBottom: 'clamp(0.25rem, 0.8vw, 0.5rem)' }}>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>Make & Model:</span>
                    <div style={{ color: '#e0e0e0', marginTop: '0.15rem' }}>
                      {currentVehicle.vehicle.make} {currentVehicle.vehicle.model}
                    </div>
                  </div>
                  <div style={{ marginBottom: 'clamp(0.25rem, 0.8vw, 0.5rem)' }}>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>Year:</span>
                    <div style={{ color: '#e0e0e0', marginTop: '0.15rem' }}>{currentVehicle.vehicle.year}</div>
                  </div>
                  <div style={{ marginBottom: 'clamp(0.25rem, 0.8vw, 0.5rem)' }}>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>Color:</span>
                    <div style={{ color: '#e0e0e0', marginTop: '0.15rem' }}>{currentVehicle.vehicle.color}</div>
                  </div>
                </div>
                <div>
                  <div style={{ marginBottom: 'clamp(0.25rem, 0.8vw, 0.5rem)' }}>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>Engine:</span>
                    <div style={{ color: '#e0e0e0', marginTop: '0.15rem' }}>{currentVehicle.vehicle.engineCapacity}</div>
                  </div>
                  <div style={{ marginBottom: 'clamp(0.25rem, 0.8vw, 0.5rem)' }}>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>Fuel Type:</span>
                    <div style={{ color: '#e0e0e0', marginTop: '0.15rem' }}>{currentVehicle.vehicle.fuelType}</div>
                  </div>
                  <div style={{ marginBottom: 'clamp(0.25rem, 0.8vw, 0.5rem)' }}>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>Confidence:</span>
                    <div style={{ color: '#00ff00', marginTop: '0.15rem', fontWeight: 'bold' }}>
                      {currentVehicle.confidence.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Registration & Driver Information */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'clamp(0.5rem, 1.5vw, 1rem)'
            }}>
              {/* Registration Details */}
              <div style={{
                background: 'rgba(25, 25, 45, 0.75)',
                borderRadius: '8px',
                border: '1px solid rgba(0, 191, 255, 0.3)',
                boxShadow: '0 0 15px rgba(0, 191, 255, 0.2)',
                padding: 'clamp(0.75rem, 2vw, 1rem)'
              }}>
                <h4 style={{
                  color: '#87ceeb',
                  fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                  margin: '0 0 clamp(0.5rem, 1.5vw, 0.75rem) 0',
                  borderBottom: '1px solid rgba(0, 191, 255, 0.3)',
                  paddingBottom: 'clamp(0.15rem, 0.5vw, 0.25rem)'
                }}>
                  Registration Details
                </h4>
                
                <div style={{ fontSize: 'clamp(0.7rem, 1.4vw, 0.8rem)' }}>
                  <div style={{ marginBottom: 'clamp(0.25rem, 0.8vw, 0.5rem)' }}>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>Owner:</span>
                    <div style={{ color: '#e0e0e0', marginTop: '0.15rem' }}>{currentVehicle.registration.registeredOwner}</div>
                  </div>
                  <div style={{ marginBottom: 'clamp(0.25rem, 0.8vw, 0.5rem)' }}>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>Registration Date:</span>
                    <div style={{ color: '#e0e0e0', marginTop: '0.15rem' }}>{currentVehicle.registration.registrationDate}</div>
                  </div>
                  <div style={{ marginBottom: 'clamp(0.25rem, 0.8vw, 0.5rem)' }}>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>Expiry Date:</span>
                    <div style={{ color: '#e0e0e0', marginTop: '0.15rem' }}>{currentVehicle.registration.expiryDate}</div>
                  </div>
                  <div style={{ marginBottom: 'clamp(0.25rem, 0.8vw, 0.5rem)' }}>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>Road Tax Expiry:</span>
                    <div style={{ color: '#e0e0e0', marginTop: '0.15rem' }}>{currentVehicle.registration.roadTaxExpiry}</div>
                  </div>
                  <div>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>Insurance:</span>
                    <div style={{ color: '#e0e0e0', marginTop: '0.15rem' }}>{currentVehicle.registration.insuranceCompany}</div>
                    <div style={{ color: '#e0e0e0', marginTop: '0.1rem', fontSize: '0.9em' }}>
                      Expires: {currentVehicle.registration.insuranceExpiry}
                    </div>
                  </div>
                </div>
              </div>

              {/* Driver Information */}
              <div style={{
                background: 'rgba(25, 25, 45, 0.75)',
                borderRadius: '8px',
                border: '1px solid rgba(0, 191, 255, 0.3)',
                boxShadow: '0 0 15px rgba(0, 191, 255, 0.2)',
                padding: 'clamp(0.75rem, 2vw, 1rem)'
              }}>
                <h4 style={{
                  color: '#87ceeb',
                  fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                  margin: '0 0 clamp(0.5rem, 1.5vw, 0.75rem) 0',
                  borderBottom: '1px solid rgba(0, 191, 255, 0.3)',
                  paddingBottom: 'clamp(0.15rem, 0.5vw, 0.25rem)'
                }}>
                  Driver Information
                </h4>
                
                <div style={{ fontSize: 'clamp(0.7rem, 1.4vw, 0.8rem)' }}>
                  <div style={{ marginBottom: 'clamp(0.25rem, 0.8vw, 0.5rem)' }}>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>Full Name:</span>
                    <div style={{ color: '#e0e0e0', marginTop: '0.15rem' }}>{currentVehicle.driver.fullName}</div>
                  </div>
                  <div style={{ marginBottom: 'clamp(0.25rem, 0.8vw, 0.5rem)' }}>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>IC Number:</span>
                    <div style={{ color: '#00bfff', marginTop: '0.15rem', fontWeight: 'bold' }}>{currentVehicle.driver.icNumber}</div>
                  </div>
                  <div style={{ marginBottom: 'clamp(0.25rem, 0.8vw, 0.5rem)' }}>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>License Number:</span>
                    <div style={{ color: '#e0e0e0', marginTop: '0.15rem' }}>{currentVehicle.driver.licenseNumber}</div>
                  </div>
                  <div style={{ marginBottom: 'clamp(0.25rem, 0.8vw, 0.5rem)' }}>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>License Class:</span>
                    <div style={{ color: '#e0e0e0', marginTop: '0.15rem' }}>{currentVehicle.driver.licenseClass}</div>
                  </div>
                  <div style={{ marginBottom: 'clamp(0.25rem, 0.8vw, 0.5rem)' }}>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>License Expiry:</span>
                    <div style={{ color: '#e0e0e0', marginTop: '0.15rem' }}>{currentVehicle.driver.licenseExpiry}</div>
                  </div>
                  <div>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>Phone:</span>
                    <div style={{ color: '#e0e0e0', marginTop: '0.15rem' }}>{currentVehicle.driver.phoneNumber}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security & Inspection Information */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'clamp(0.5rem, 1.5vw, 1rem)'
            }}>
              {/* Security Clearance */}
              <div style={{
                background: 'rgba(25, 25, 45, 0.75)',
                borderRadius: '8px',
                border: '1px solid rgba(0, 191, 255, 0.3)',
                boxShadow: '0 0 15px rgba(0, 191, 255, 0.2)',
                padding: 'clamp(0.75rem, 2vw, 1rem)'
              }}>
                <h4 style={{
                  color: '#87ceeb',
                  fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                  margin: '0 0 clamp(0.5rem, 1.5vw, 0.75rem) 0',
                  borderBottom: '1px solid rgba(0, 191, 255, 0.3)',
                  paddingBottom: 'clamp(0.15rem, 0.5vw, 0.25rem)'
                }}>
                  Security Clearance
                </h4>
                
                <div style={{ fontSize: 'clamp(0.7rem, 1.4vw, 0.8rem)' }}>
                  <div style={{ marginBottom: 'clamp(0.25rem, 0.8vw, 0.5rem)' }}>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>Access Level:</span>
                    <div style={{ color: getStatusColor(currentVehicle.security.clearanceLevel), marginTop: '0.15rem', fontWeight: 'bold' }}>
                      {currentVehicle.security.clearanceLevel}
                    </div>
                  </div>
                  <div style={{ marginBottom: 'clamp(0.25rem, 0.8vw, 0.5rem)' }}>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>Access Type:</span>
                    <div style={{ color: getClearanceColor(currentVehicle.security.accessType), marginTop: '0.15rem', fontWeight: 'bold' }}>
                      {currentVehicle.security.accessType}
                    </div>
                  </div>
                  <div style={{ marginBottom: 'clamp(0.25rem, 0.8vw, 0.5rem)' }}>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>Department:</span>
                    <div style={{ color: '#e0e0e0', marginTop: '0.15rem' }}>{currentVehicle.security.department}</div>
                  </div>
                  <div style={{ marginBottom: 'clamp(0.25rem, 0.8vw, 0.5rem)' }}>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>Valid Until:</span>
                    <div style={{ color: '#e0e0e0', marginTop: '0.15rem' }}>{currentVehicle.security.validUntil}</div>
                  </div>
                  <div style={{ marginBottom: 'clamp(0.25rem, 0.8vw, 0.5rem)' }}>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>Parking Zone:</span>
                    <div style={{ color: '#e0e0e0', marginTop: '0.15rem' }}>{currentVehicle.security.parkingZone}</div>
                  </div>
                  <div>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>Entry Count:</span>
                    <div style={{ color: '#00bfff', marginTop: '0.15rem', fontWeight: 'bold' }}>{currentVehicle.security.entryCount}</div>
                  </div>
                </div>
              </div>

              {/* Inspection Status */}
              <div style={{
                background: 'rgba(25, 25, 45, 0.75)',
                borderRadius: '8px',
                border: '1px solid rgba(0, 191, 255, 0.3)',
                boxShadow: '0 0 15px rgba(0, 191, 255, 0.2)',
                padding: 'clamp(0.75rem, 2vw, 1rem)'
              }}>
                <h4 style={{
                  color: '#87ceeb',
                  fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                  margin: '0 0 clamp(0.5rem, 1.5vw, 0.75rem) 0',
                  borderBottom: '1px solid rgba(0, 191, 255, 0.3)',
                  paddingBottom: 'clamp(0.15rem, 0.5vw, 0.25rem)'
                }}>
                  Inspection Status
                </h4>
                
                <div style={{ fontSize: 'clamp(0.7rem, 1.4vw, 0.8rem)' }}>
                  <div style={{ marginBottom: 'clamp(0.25rem, 0.8vw, 0.5rem)' }}>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>Last Inspection:</span>
                    <div style={{ color: '#e0e0e0', marginTop: '0.15rem' }}>{currentVehicle.inspection.lastInspection}</div>
                  </div>
                  <div style={{ marginBottom: 'clamp(0.25rem, 0.8vw, 0.5rem)' }}>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>Status:</span>
                    <div style={{ color: getStatusColor(currentVehicle.inspection.inspectionStatus), marginTop: '0.15rem', fontWeight: 'bold' }}>
                      {currentVehicle.inspection.inspectionStatus}
                    </div>
                  </div>
                  <div style={{ marginBottom: 'clamp(0.25rem, 0.8vw, 0.5rem)' }}>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>Next Inspection:</span>
                    <div style={{ color: '#e0e0e0', marginTop: '0.15rem' }}>{currentVehicle.inspection.nextInspection}</div>
                  </div>
                  <div style={{ marginBottom: 'clamp(0.25rem, 0.8vw, 0.5rem)' }}>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>Inspected By:</span>
                    <div style={{ color: '#e0e0e0', marginTop: '0.15rem' }}>{currentVehicle.inspection.inspectedBy}</div>
                  </div>
                  <div>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>Notes:</span>
                    <div style={{ color: '#e0e0e0', marginTop: '0.15rem', lineHeight: '1.3' }}>{currentVehicle.inspection.notes}</div>
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

export default VehicleScanner;