import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import BottomPanel from '../components/BottomPanel';
import '../styles/security.css';

const VehicleTracking = () => {
  const [activeStation, setActiveStation] = useState('ALL');
  const [capturedImage, setCapturedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Ready to scan vehicle');
  
  // Sample vehicle data - in real implementation this would come from database/API
  const [vehicleData, setVehicleData] = useState({
    plateNumber: 'WKL 1234 A',
    vehicleType: 'Sedan',
    make: 'Toyota',
    model: 'Camry',
    year: '2020',
    color: 'Silver',
    engineNumber: 'TC2020-789456',
    chassisNumber: 'JTDKB20U123456789',
    registrationDate: '15/03/2020',
    expiryDate: '14/03/2025',
    roadTaxStatus: 'VALID',
    roadTaxExpiry: '31/12/2024',
    insuranceStatus: 'ACTIVE',
    insuranceExpiry: '28/02/2025',
    insuranceCompany: 'Great Eastern General Insurance',
    policyNumber: 'GE-AUTO-2024-789123',
    lastInspection: '10/01/2024',
    nextInspection: '10/01/2025',
    inspectionStatus: 'PASSED',
    ownershipStatus: 'REGISTERED',
    encumbranceStatus: 'CLEAR',
    blacklistStatus: 'CLEAR',
    stolenStatus: 'CLEAR'
  });

  const [driverData, setDriverData] = useState({
    name: 'Ahmad Bin Abdullah',
    icNumber: '850315-08-1234',
    licenseNumber: 'D12345678',
    licenseClass: 'D, DA',
    licenseIssueDate: '20/06/2018',
    licenseExpiryDate: '19/06/2028',
    licenseStatus: 'VALID',
    address: 'No. 123, Jalan Bukit Bintang, 55100 Kuala Lumpur',
    phoneNumber: '+60123456789',
    emergencyContact: 'Siti Binti Ahmad (+60198765432)',
    dateOfBirth: '15/03/1985',
    nationality: 'Malaysian',
    bloodType: 'O+',
    organDonor: 'Yes',
    restrictions: 'None',
    endorsements: 'None',
    violations: '2 (Speeding)',
    lastViolation: '15/08/2023',
    points: '4/20',
    suspensionHistory: 'None',
    medicalStatus: 'FIT'
  });

  const [scanHistory, setScanHistory] = useState([
    {
      timestamp: '2024-01-08 14:45:32',
      location: 'Main Gate - Entry',
      status: 'AUTHORIZED',
      purpose: 'Visitor Entry',
      officer: 'Sgt. Rahman'
    },
    {
      timestamp: '2024-01-08 09:15:18',
      location: 'Parking Zone A',
      status: 'VERIFIED',
      purpose: 'Employee Parking',
      officer: 'Cpl. Lee'
    },
    {
      timestamp: '2024-01-07 17:30:45',
      location: 'Exit Gate',
      status: 'CLEARED',
      purpose: 'Departure',
      officer: 'Sgt. Kumar'
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
      // Update scan history occasionally
      if (Math.random() > 0.95) {
        const locations = ['Main Gate', 'Parking Zone B', 'Security Checkpoint', 'VIP Area'];
        const statuses = ['AUTHORIZED', 'VERIFIED', 'PENDING', 'CLEARED'];
        const purposes = ['Visitor Entry', 'Employee Access', 'Delivery', 'Maintenance'];
        const officers = ['Sgt. Rahman', 'Cpl. Lee', 'Sgt. Kumar', 'Cpl. Wong'];
        
        const now = new Date();
        const timestamp = now.toISOString().slice(0, 19).replace('T', ' ');
        
        const newScan = {
          timestamp,
          location: locations[Math.floor(Math.random() * locations.length)],
          status: statuses[Math.floor(Math.random() * statuses.length)],
          purpose: purposes[Math.floor(Math.random() * purposes.length)],
          officer: officers[Math.floor(Math.random() * officers.length)]
        };

        setScanHistory(prev => [newScan, ...prev.slice(0, 4)]);
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

  const handleScanVehicle = () => {
    setIsAnalyzing(true);
    setStatusMessage('Scanning vehicle...');
    
    // Simulate scanning process
    setTimeout(() => {
      setIsAnalyzing(false);
      setStatusMessage('Vehicle identified successfully');
      setCapturedImage('/api/placeholder/400/300'); // Placeholder for captured image
    }, 2000);
  };

  const getStatusColor = (status) => {
    switch(status.toUpperCase()) {
      case 'VALID':
      case 'ACTIVE':
      case 'PASSED':
      case 'CLEAR':
      case 'AUTHORIZED':
      case 'VERIFIED':
      case 'CLEARED':
        return '#00ff00';
      case 'EXPIRED':
      case 'SUSPENDED':
      case 'BLACKLISTED':
      case 'STOLEN':
        return '#ff4444';
      case 'PENDING':
      case 'WARNING':
        return '#ffa500';
      default:
        return '#87ceeb';
    }
  };

  const getStatusIcon = (status) => {
    switch(status.toUpperCase()) {
      case 'VALID':
      case 'ACTIVE':
      case 'PASSED':
      case 'CLEAR':
      case 'AUTHORIZED':
      case 'VERIFIED':
      case 'CLEARED':
        return 'OK';
      case 'EXPIRED':
      case 'SUSPENDED':
      case 'BLACKLISTED':
      case 'STOLEN':
        return 'FAIL';
      case 'PENDING':
      case 'WARNING':
        return 'WARN';
      default:
        return 'UNK';
    }
  };

  return (
    <>
      <div className="test-scanlines"></div>
      <div className="test-container">
        <Header title="Vehicle Identification & Tracking System" />
        
        <div style={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden',
          padding: 'clamp(0.25rem, 1vw, 0.75rem)',
          gap: 'clamp(0.5rem, 1.5vw, 1rem)',
          height: 'calc(100vh - clamp(120px, 15vh, 160px))'
        }}>
          {/* Left Panel - Camera Section */}
          <div style={{
            flex: '0 0 clamp(35%, 40vw, 45%)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(0.5rem, 1vw, 0.75rem)'
          }}>
            {/* Camera Feed */}
            <div style={{
              flex: 1,
              background: 'rgba(25, 25, 45, 0.75)',
              borderRadius: '12px',
              border: '2px solid rgba(0, 191, 255, 0.4)',
              boxShadow: '0 0 20px rgba(0, 191, 255, 0.3)',
              padding: 'clamp(0.75rem, 2vw, 1.5rem)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <h2 style={{
                color: '#87ceeb',
                fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
                margin: '0 0 clamp(0.75rem, 2vw, 1rem) 0',
                borderBottom: '2px solid rgba(0, 191, 255, 0.4)',
                paddingBottom: 'clamp(0.25rem, 0.8vw, 0.5rem)',
                textShadow: '0 0 10px rgba(135,206,235,0.6)',
                textAlign: 'center'
              }}>
                VEHICLE SCANNER
              </h2>

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
                minHeight: '300px',
                overflow: 'hidden'
              }}>
                {capturedImage ? (
                  <img 
                    src={capturedImage} 
                    alt="Captured Vehicle" 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <div style={{
                    textAlign: 'center',
                    color: '#87ceeb'
                  }}>
                    <div style={{
                      fontSize: 'clamp(3rem, 8vw, 6rem)',
                      marginBottom: '1rem',
                      opacity: 0.6
                    }}>
                    </div>
                    <div style={{
                      fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
                      fontWeight: 'bold'
                    }}>
                      Position Vehicle in Frame
                    </div>
                    <div style={{
                      fontSize: 'clamp(0.8rem, 1.8vw, 1rem)',
                      marginTop: '0.5rem',
                      opacity: 0.8
                    }}>
                      Ensure license plate is clearly visible
                    </div>
                  </div>
                )}

                {/* Scanning overlay */}
                {isAnalyzing && (
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
                      fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                      fontWeight: 'bold',
                      textShadow: '0 0 10px rgba(0, 191, 255, 0.8)'
                    }}>
                      SCANNING...
                    </div>
                  </div>
                )}

                {/* Crosshair overlay */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '80%',
                  height: '60%',
                  border: '2px dashed rgba(0, 191, 255, 0.5)',
                  borderRadius: '8px',
                  pointerEvents: 'none'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(0, 191, 255, 0.8)',
                    color: '#000',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: 'clamp(0.7rem, 1.5vw, 0.9rem)',
                    fontWeight: 'bold'
                  }}>
                    LICENSE PLATE AREA
                  </div>
                </div>
              </div>

              {/* Control Buttons */}
              <div style={{
                display: 'flex',
                gap: 'clamp(0.5rem, 1.5vw, 1rem)',
                marginTop: 'clamp(0.75rem, 2vw, 1rem)'
              }}>
                <button
                  onClick={handleScanVehicle}
                  disabled={isAnalyzing}
                  style={{
                    flex: 1,
                    padding: 'clamp(0.75rem, 2vw, 1rem)',
                    background: isAnalyzing ? 'rgba(135, 206, 235, 0.3)' : 'linear-gradient(135deg, #00bfff, #87ceeb)',
                    color: isAnalyzing ? '#87ceeb' : '#000',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                    fontWeight: 'bold',
                    cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                    boxShadow: isAnalyzing ? 'none' : '0 0 15px rgba(0, 191, 255, 0.4)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {isAnalyzing ? 'SCANNING...' : 'SCAN VEHICLE'}
                </button>
              </div>

              {/* Status Message */}
              <div style={{
                marginTop: 'clamp(0.5rem, 1.5vw, 0.75rem)',
                padding: 'clamp(0.5rem, 1.5vw, 0.75rem)',
                background: 'rgba(0, 0, 0, 0.5)',
                borderRadius: '6px',
                border: '1px solid rgba(0, 191, 255, 0.3)',
                textAlign: 'center',
                color: '#87ceeb',
                fontSize: 'clamp(0.8rem, 1.8vw, 1rem)'
              }}>
                {statusMessage}
              </div>
            </div>
          </div>

          {/* Right Panel - Vehicle & Driver Details */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(0.5rem, 1vw, 0.75rem)',
            overflowY: 'auto'
          }}>
            {/* Vehicle Information */}
            <div style={{
              background: 'rgba(25, 25, 45, 0.75)',
              borderRadius: '12px',
              border: '2px solid rgba(0, 191, 255, 0.4)',
              boxShadow: '0 0 20px rgba(0, 191, 255, 0.3)',
              padding: 'clamp(0.75rem, 2vw, 1.5rem)'
            }}>
              <h2 style={{
                color: '#87ceeb',
                fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
                margin: '0 0 clamp(0.75rem, 2vw, 1rem) 0',
                borderBottom: '2px solid rgba(0, 191, 255, 0.4)',
                paddingBottom: 'clamp(0.25rem, 0.8vw, 0.5rem)',
                textShadow: '0 0 10px rgba(135,206,235,0.6)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                VEHICLE INFORMATION
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: 'clamp(0.75rem, 2vw, 1rem)'
              }}>
                {/* Basic Vehicle Info */}
                <div style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '8px',
                  padding: 'clamp(0.75rem, 2vw, 1rem)',
                  border: '1px solid rgba(0, 191, 255, 0.2)'
                }}>
                  <h3 style={{
                    color: '#00bfff',
                    fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                    margin: '0 0 0.75rem 0',
                    borderBottom: '1px solid rgba(0, 191, 255, 0.3)',
                    paddingBottom: '0.25rem'
                  }}>
                    Basic Details
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#87ceeb', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>Plate Number:</span>
                      <span style={{ color: '#00bfff', fontWeight: 'bold', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>{vehicleData.plateNumber}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#87ceeb', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>Type:</span>
                      <span style={{ color: '#e0e0e0', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>{vehicleData.vehicleType}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#87ceeb', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>Make/Model:</span>
                      <span style={{ color: '#e0e0e0', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>{vehicleData.make} {vehicleData.model}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#87ceeb', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>Year:</span>
                      <span style={{ color: '#e0e0e0', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>{vehicleData.year}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#87ceeb', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>Color:</span>
                      <span style={{ color: '#e0e0e0', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>{vehicleData.color}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#87ceeb', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>Engine No:</span>
                      <span style={{ color: '#e0e0e0', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>{vehicleData.engineNumber}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#87ceeb', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>Chassis No:</span>
                      <span style={{ color: '#e0e0e0', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>{vehicleData.chassisNumber}</span>
                    </div>
                  </div>
                </div>

                {/* Registration & Tax Info */}
                <div style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '8px',
                  padding: 'clamp(0.75rem, 2vw, 1rem)',
                  border: '1px solid rgba(0, 191, 255, 0.2)'
                }}>
                  <h3 style={{
                    color: '#00bfff',
                    fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                    margin: '0 0 0.75rem 0',
                    borderBottom: '1px solid rgba(0, 191, 255, 0.3)',
                    paddingBottom: '0.25rem'
                  }}>
                    Registration & Tax
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#87ceeb', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>Road Tax:</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: getStatusColor(vehicleData.roadTaxStatus), fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>
                          {getStatusIcon(vehicleData.roadTaxStatus)} {vehicleData.roadTaxStatus}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#87ceeb', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>Expires:</span>
                      <span style={{ color: '#e0e0e0', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>{vehicleData.roadTaxExpiry}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#87ceeb', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>Registered:</span>
                      <span style={{ color: '#e0e0e0', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>{vehicleData.registrationDate}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#87ceeb', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>Reg. Expires:</span>
                      <span style={{ color: '#e0e0e0', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>{vehicleData.expiryDate}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#87ceeb', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>Last Inspection:</span>
                      <span style={{ color: '#e0e0e0', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>{vehicleData.lastInspection}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#87ceeb', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>Inspection:</span>
                      <span style={{ color: getStatusColor(vehicleData.inspectionStatus), fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>
                        {getStatusIcon(vehicleData.inspectionStatus)} {vehicleData.inspectionStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Insurance Info */}
                <div style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '8px',
                  padding: 'clamp(0.75rem, 2vw, 1rem)',
                  border: '1px solid rgba(0, 191, 255, 0.2)'
                }}>
                  <h3 style={{
                    color: '#00bfff',
                    fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                    margin: '0 0 0.75rem 0',
                    borderBottom: '1px solid rgba(0, 191, 255, 0.3)',
                    paddingBottom: '0.25rem'
                  }}>
                    Insurance
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#87ceeb', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>Status:</span>
                      <span style={{ color: getStatusColor(vehicleData.insuranceStatus), fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>
                        {getStatusIcon(vehicleData.insuranceStatus)} {vehicleData.insuranceStatus}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#87ceeb', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>Company:</span>
                      <span style={{ color: '#e0e0e0', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>{vehicleData.insuranceCompany}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#87ceeb', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>Policy:</span>
                      <span style={{ color: '#e0e0e0', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>{vehicleData.policyNumber}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#87ceeb', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>Expires:</span>
                      <span style={{ color: '#e0e0e0', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>{vehicleData.insuranceExpiry}</span>
                    </div>
                  </div>
                </div>

                {/* Security Status */}
                <div style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '8px',
                  padding: 'clamp(0.75rem, 2vw, 1rem)',
                  border: '1px solid rgba(0, 191, 255, 0.2)'
                }}>
                  <h3 style={{
                    color: '#00bfff',
                    fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                    margin: '0 0 0.75rem 0',
                    borderBottom: '1px solid rgba(0, 191, 255, 0.3)',
                    paddingBottom: '0.25rem'
                  }}>
                    Security Status
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#87ceeb', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>Blacklist:</span>
                      <span style={{ color: getStatusColor(vehicleData.blacklistStatus), fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>
                        {getStatusIcon(vehicleData.blacklistStatus)} {vehicleData.blacklistStatus}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#87ceeb', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>Stolen:</span>
                      <span style={{ color: getStatusColor(vehicleData.stolenStatus), fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>
                        {getStatusIcon(vehicleData.stolenStatus)} {vehicleData.stolenStatus}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#87ceeb', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>Encumbrance:</span>
                      <span style={{ color: getStatusColor(vehicleData.encumbranceStatus), fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>
                        {getStatusIcon(vehicleData.encumbranceStatus)} {vehicleData.encumbranceStatus}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#87ceeb', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>Ownership:</span>
                      <span style={{ color: getStatusColor(vehicleData.ownershipStatus), fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>
                        {getStatusIcon(vehicleData.ownershipStatus)} {vehicleData.ownershipStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Driver Information */}
            <div style={{
              background: 'rgba(25, 25, 45, 0.75)',
              borderRadius: '12px',
              border: '2px solid rgba(0, 191, 255, 0.4)',
              boxShadow: '0 0 20px rgba(0, 191, 255, 0.3)',
              padding: 'clamp(0.75rem, 2vw, 1.5rem)'
            }}>
              <h2 style={{
                color: '#87ceeb',
                fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
                margin: '0 0 clamp(0.75rem, 2vw, 1rem) 0',
                borderBottom: '2px solid rgba(0, 191, 255, 0.4)',
                paddingBottom: 'clamp(0.25rem, 0.8vw, 0.5rem)',
                textShadow: '0 0 10px rgba(135,206,235,0.6)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                DRIVER INFORMATION
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: 'clamp(0.75rem, 2vw, 1rem)'
              }}>
                {/* Personal Details */}
                <div style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '8px',
                  padding: 'clamp(0.75rem, 2vw, 1rem)',
                  border: '1px solid rgba(0, 191, 255, 0.2)'
                }}>
                  <h3 style={{
                    color: '#00bfff',
                    fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                    margin: '0 0 0.75rem 0',
                    borderBottom: '1px solid rgba(0, 191, 255, 0.3)',
                    paddingBottom: '0.25rem'
                  }}>
                    Personal Details
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#87ceeb', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>Name:</span>
                      <span style={{ color: '#00bfff', fontWeight: 'bold', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>{driverData.name}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#87ceeb', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>IC Number:</span>
                      <span style={{ color: '#e0e0e0', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>{driverData.icNumber}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#87ceeb', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>Date of Birth:</span>
                      <span style={{ color: '#e0e0e0', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>{driverData.dateOfBirth}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#87ceeb', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>Nationality:</span>
                      <span style={{ color: '#e0e0e0', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>{driverData.nationality}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#87ceeb', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>Blood Type:</span>
                      <span style={{ color: '#e0e0e0', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>{driverData.bloodType}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#87ceeb', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>Phone:</span>
                      <span style={{ color: '#e0e0e0', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>{driverData.phoneNumber}</span>
                    </div>
                  </div>
                </div>

                {/* License Details */}
                <div style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '8px',
                  padding: 'clamp(0.75rem, 2vw, 1rem)',
                  border: '1px solid rgba(0, 191, 255, 0.2)'
                }}>
                  <h3 style={{
                    color: '#00bfff',
                    fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                    margin: '0 0 0.75rem 0',
                    borderBottom: '1px solid rgba(0, 191, 255, 0.3)',
                    paddingBottom: '0.25rem'
                  }}>
                    License Details
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#87ceeb', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>License No:</span>
                      <span style={{ color: '#00bfff', fontWeight: 'bold', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>{driverData.licenseNumber}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#87ceeb', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>Class:</span>
                      <span style={{ color: '#e0e0e0', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>{driverData.licenseClass}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#87ceeb', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>Status:</span>
                      <span style={{ color: getStatusColor(driverData.licenseStatus), fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>
                        {getStatusIcon(driverData.licenseStatus)} {driverData.licenseStatus}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#87ceeb', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>Issued:</span>
                      <span style={{ color: '#e0e0e0', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>{driverData.licenseIssueDate}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#87ceeb', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>Expires:</span>
                      <span style={{ color: '#e0e0e0', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>{driverData.licenseExpiryDate}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#87ceeb', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>Points:</span>
                      <span style={{ color: '#ffa500', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>{driverData.points}</span>
                    </div>
                  </div>
                </div>

                {/* Address & Contact */}
                <div style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '8px',
                  padding: 'clamp(0.75rem, 2vw, 1rem)',
                  border: '1px solid rgba(0, 191, 255, 0.2)',
                  gridColumn: 'span 2'
                }}>
                  <h3 style={{
                    color: '#00bfff',
                    fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                    margin: '0 0 0.75rem 0',
                    borderBottom: '1px solid rgba(0, 191, 255, 0.3)',
                    paddingBottom: '0.25rem'
                  }}>
                    Address & Emergency Contact
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div>
                      <span style={{ color: '#87ceeb', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>Address: </span>
                      <span style={{ color: '#e0e0e0', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>{driverData.address}</span>
                    </div>
                    <div>
                      <span style={{ color: '#87ceeb', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>Emergency Contact: </span>
                      <span style={{ color: '#e0e0e0', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>{driverData.emergencyContact}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#87ceeb', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>Violations:</span>
                      <span style={{ color: '#ffa500', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>{driverData.violations}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#87ceeb', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>Last Violation:</span>
                      <span style={{ color: '#e0e0e0', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>{driverData.lastViolation}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scan History */}
            <div style={{
              background: 'rgba(25, 25, 45, 0.75)',
              borderRadius: '12px',
              border: '2px solid rgba(0, 191, 255, 0.4)',
              boxShadow: '0 0 20px rgba(0, 191, 255, 0.3)',
              padding: 'clamp(0.75rem, 2vw, 1.5rem)'
            }}>
              <h2 style={{
                color: '#87ceeb',
                fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
                margin: '0 0 clamp(0.75rem, 2vw, 1rem) 0',
                borderBottom: '2px solid rgba(0, 191, 255, 0.4)',
                paddingBottom: 'clamp(0.25rem, 0.8vw, 0.5rem)',
                textShadow: '0 0 10px rgba(135,206,235,0.6)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                RECENT SCAN HISTORY
              </h2>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(0.5rem, 1vw, 0.75rem)'
              }}>
                {scanHistory.map((scan, index) => (
                  <div key={index} style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '8px',
                    padding: 'clamp(0.75rem, 2vw, 1rem)',
                    border: `1px solid ${getStatusColor(scan.status)}40`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.25rem'
                      }}>
                        <span style={{
                          color: getStatusColor(scan.status),
                          fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)',
                          fontWeight: 'bold'
                        }}>
                          {getStatusIcon(scan.status)} {scan.status}
                        </span>
                        <span style={{
                          color: '#87ceeb',
                          fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)'
                        }}>
                          {scan.timestamp}
                        </span>
                      </div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)'
                      }}>
                        <span style={{ color: '#e0e0e0' }}>{scan.location}</span>
                        <span style={{ color: '#87ceeb' }}>{scan.purpose}</span>
                        <span style={{ color: '#00bfff' }}>Officer: {scan.officer}</span>
                      </div>
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

export default VehicleTracking;