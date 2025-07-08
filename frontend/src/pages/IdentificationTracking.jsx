import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import BottomPanel from '../components/BottomPanel';
import '../styles/security.css';

const IdentificationTracking = () => {
  const [activeStation, setActiveStation] = useState('ALL');
  const [isScanning, setIsScanning] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Identification system ready');
  const [identifiedPerson, setIdentifiedPerson] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);

  // Sample identified person data (Malaysian context)
  const [currentPerson, setCurrentPerson] = useState({
    id: 'ID-2024-001',
    timestamp: new Date().toLocaleString(),
    confidence: 94.7,
    status: 'IDENTIFIED',
    personalInfo: {
      fullName: 'Ahmad Bin Abdullah',
      icNumber: '850315-08-1234',
      nationality: 'Malaysian',
      gender: 'Male',
      dateOfBirth: '15 March 1985',
      age: 39,
      placeOfBirth: 'Kuala Lumpur',
      religion: 'Islam',
      maritalStatus: 'Married'
    },
    address: {
      current: 'No. 123, Jalan Bukit Bintang, 55100 Kuala Lumpur, Wilayah Persekutuan',
      permanent: 'No. 456, Kampung Baru, 50300 Kuala Lumpur, Wilayah Persekutuan'
    },
    contact: {
      phoneNumber: '+60 12-345 6789',
      email: 'ahmad.abdullah@email.com',
      emergencyContact: 'Siti Binti Ahmad (+60 13-456 7890)'
    },
    identification: {
      passportNumber: 'A12345678',
      passportExpiry: '15 March 2029',
      drivingLicense: 'D1234567890',
      licenseClass: 'D, DA',
      licenseExpiry: '15 March 2027'
    },
    security: {
      clearanceLevel: 'STANDARD',
      watchlistStatus: 'CLEAR',
      lastScreening: '2024-01-07 09:30:00',
      riskAssessment: 'LOW',
      flaggedReasons: 'None',
      authorizedAreas: ['Public Terminal', 'Departure Gates', 'Retail Areas']
    },
    travel: {
      frequentFlyer: 'Malaysia Airlines Enrich Gold',
      membershipNumber: 'MH123456789',
      lastFlight: 'MH370 - KUL to SIN (2024-01-05)',
      travelHistory: '15 international trips in 2023',
      preferredDestinations: ['Singapore', 'Bangkok', 'Jakarta']
    },
    biometric: {
      faceMatch: '94.7%',
      fingerprintMatch: 'Not Available',
      irisMatch: 'Not Available',
      lastBiometricUpdate: '2023-12-15'
    }
  });

  const [recentIdentifications, setRecentIdentifications] = useState([
    {
      id: 'ID-001',
      time: '14:45:23',
      name: 'Ahmad Bin Abdullah',
      ic: '850315-08-1234',
      confidence: 94.7,
      status: 'IDENTIFIED',
      clearance: 'STANDARD'
    },
    {
      id: 'ID-002',
      time: '14:43:15',
      name: 'Siti Binti Rahman',
      ic: '920822-14-5678',
      confidence: 89.2,
      status: 'IDENTIFIED',
      clearance: 'VIP'
    },
    {
      id: 'ID-003',
      time: '14:41:08',
      name: 'Unknown Person',
      ic: 'N/A',
      confidence: 0,
      status: 'UNIDENTIFIED',
      clearance: 'NONE'
    },
    {
      id: 'ID-004',
      time: '14:38:52',
      name: 'John Smith',
      ic: 'PP-A9876543',
      confidence: 91.5,
      status: 'IDENTIFIED',
      clearance: 'VISITOR'
    },
    {
      id: 'ID-005',
      time: '14:36:41',
      name: 'Lim Wei Ming',
      ic: '881205-10-9876',
      confidence: 96.3,
      status: 'IDENTIFIED',
      clearance: 'STAFF'
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
      setCurrentPerson(prev => ({
        ...prev,
        confidence: 94.0 + Math.random() * 2.0
      }));

      // Add new identification occasionally
      if (Math.random() > 0.95) {
        const names = ['Ahmad Bin Abdullah', 'Siti Binti Rahman', 'Lim Wei Ming', 'Unknown Person', 'John Smith'];
        const ics = ['850315-08-1234', '920822-14-5678', '881205-10-9876', 'N/A', 'PP-A9876543'];
        const statuses = ['IDENTIFIED', 'UNIDENTIFIED'];
        const clearances = ['STANDARD', 'VIP', 'VISITOR', 'STAFF', 'NONE'];
        
        const now = new Date();
        const time = now.toTimeString().slice(0, 8);
        const randomIndex = Math.floor(Math.random() * names.length);
        
        const newIdentification = {
          id: `ID-${String(Date.now()).slice(-3)}`,
          time,
          name: names[randomIndex],
          ic: ics[randomIndex],
          confidence: names[randomIndex] === 'Unknown Person' ? 0 : 85 + Math.random() * 15,
          status: names[randomIndex] === 'Unknown Person' ? 'UNIDENTIFIED' : 'IDENTIFIED',
          clearance: clearances[randomIndex]
        };

        setRecentIdentifications(prev => [newIdentification, ...prev.slice(0, 4)]);
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
    setStatusMessage('Scanning for identification...');
    
    // Simulate scanning process
    setTimeout(() => {
      setIsScanning(false);
      setStatusMessage('Person identified successfully');
      setIdentifiedPerson(currentPerson);
      
      // Update current person data
      setCurrentPerson(prev => ({
        ...prev,
        id: `ID-2024-${String(Date.now()).slice(-3)}`,
        timestamp: new Date().toLocaleString()
      }));
    }, 3000);
  };

  const getStatusColor = (status) => {
    switch(status.toUpperCase()) {
      case 'IDENTIFIED': return '#00ff00';
      case 'UNIDENTIFIED': return '#ff4444';
      case 'PENDING': return '#ffa500';
      default: return '#87ceeb';
    }
  };

  const getClearanceColor = (clearance) => {
    switch(clearance.toUpperCase()) {
      case 'VIP': return '#ff6b6b';
      case 'STAFF': return '#4ecdc4';
      case 'STANDARD': return '#45b7d1';
      case 'VISITOR': return '#96ceb4';
      case 'NONE': return '#95a5a6';
      default: return '#87ceeb';
    }
  };

  const getRiskColor = (risk) => {
    switch(risk.toUpperCase()) {
      case 'LOW': return '#00ff00';
      case 'MEDIUM': return '#ffa500';
      case 'HIGH': return '#ff4444';
      case 'CRITICAL': return '#ff0000';
      default: return '#87ceeb';
    }
  };

  return (
    <>
      <div className="test-scanlines"></div>
      <div className="test-container">
        <Header title="Identification & Tracking System" />
        
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
          {/* Left Panel - Person Details */}
          <div style={{
            flex: '0 0 60%',
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(0.5rem, 1vw, 0.75rem)',
            overflowY: 'auto'
          }}>
            {/* Personal Information */}
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
                Personal Information
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 'clamp(0.5rem, 1.5vw, 0.75rem)',
                fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)'
              }}>
                <div>
                  <div style={{ marginBottom: 'clamp(0.25rem, 0.8vw, 0.5rem)' }}>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>Full Name:</span>
                    <div style={{ color: '#e0e0e0', marginTop: '0.15rem' }}>{currentPerson.personalInfo.fullName}</div>
                  </div>
                  <div style={{ marginBottom: 'clamp(0.25rem, 0.8vw, 0.5rem)' }}>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>IC Number:</span>
                    <div style={{ color: '#00bfff', marginTop: '0.15rem', fontWeight: 'bold' }}>{currentPerson.personalInfo.icNumber}</div>
                  </div>
                  <div style={{ marginBottom: 'clamp(0.25rem, 0.8vw, 0.5rem)' }}>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>Nationality:</span>
                    <div style={{ color: '#e0e0e0', marginTop: '0.15rem' }}>{currentPerson.personalInfo.nationality}</div>
                  </div>
                  <div style={{ marginBottom: 'clamp(0.25rem, 0.8vw, 0.5rem)' }}>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>Gender:</span>
                    <div style={{ color: '#e0e0e0', marginTop: '0.15rem' }}>{currentPerson.personalInfo.gender}</div>
                  </div>
                  <div style={{ marginBottom: 'clamp(0.25rem, 0.8vw, 0.5rem)' }}>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>Religion:</span>
                    <div style={{ color: '#e0e0e0', marginTop: '0.15rem' }}>{currentPerson.personalInfo.religion}</div>
                  </div>
                </div>
                <div>
                  <div style={{ marginBottom: 'clamp(0.25rem, 0.8vw, 0.5rem)' }}>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>Date of Birth:</span>
                    <div style={{ color: '#e0e0e0', marginTop: '0.15rem' }}>{currentPerson.personalInfo.dateOfBirth}</div>
                  </div>
                  <div style={{ marginBottom: 'clamp(0.25rem, 0.8vw, 0.5rem)' }}>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>Age:</span>
                    <div style={{ color: '#e0e0e0', marginTop: '0.15rem' }}>{currentPerson.personalInfo.age} years</div>
                  </div>
                  <div style={{ marginBottom: 'clamp(0.25rem, 0.8vw, 0.5rem)' }}>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>Place of Birth:</span>
                    <div style={{ color: '#e0e0e0', marginTop: '0.15rem' }}>{currentPerson.personalInfo.placeOfBirth}</div>
                  </div>
                  <div style={{ marginBottom: 'clamp(0.25rem, 0.8vw, 0.5rem)' }}>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>Marital Status:</span>
                    <div style={{ color: '#e0e0e0', marginTop: '0.15rem' }}>{currentPerson.personalInfo.maritalStatus}</div>
                  </div>
                  <div style={{ marginBottom: 'clamp(0.25rem, 0.8vw, 0.5rem)' }}>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>Confidence:</span>
                    <div style={{ color: '#00ff00', marginTop: '0.15rem', fontWeight: 'bold' }}>{currentPerson.confidence.toFixed(1)}%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Address & Contact Information */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'clamp(0.5rem, 1.5vw, 1rem)'
            }}>
              {/* Address */}
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
                  Address
                </h4>
                
                <div style={{ fontSize: 'clamp(0.7rem, 1.4vw, 0.8rem)' }}>
                  <div style={{ marginBottom: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>Current:</span>
                    <div style={{ color: '#e0e0e0', marginTop: '0.25rem', lineHeight: '1.4' }}>{currentPerson.address.current}</div>
                  </div>
                  <div>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>Permanent:</span>
                    <div style={{ color: '#e0e0e0', marginTop: '0.25rem', lineHeight: '1.4' }}>{currentPerson.address.permanent}</div>
                  </div>
                </div>
              </div>

              {/* Contact */}
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
                  Contact Information
                </h4>
                
                <div style={{ fontSize: 'clamp(0.7rem, 1.4vw, 0.8rem)' }}>
                  <div style={{ marginBottom: 'clamp(0.25rem, 0.8vw, 0.5rem)' }}>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>Phone:</span>
                    <div style={{ color: '#e0e0e0', marginTop: '0.15rem' }}>{currentPerson.contact.phoneNumber}</div>
                  </div>
                  <div style={{ marginBottom: 'clamp(0.25rem, 0.8vw, 0.5rem)' }}>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>Email:</span>
                    <div style={{ color: '#e0e0e0', marginTop: '0.15rem' }}>{currentPerson.contact.email}</div>
                  </div>
                  <div>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>Emergency:</span>
                    <div style={{ color: '#e0e0e0', marginTop: '0.15rem' }}>{currentPerson.contact.emergencyContact}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security & Travel Information */}
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
                  Security Status
                </h4>
                
                <div style={{ fontSize: 'clamp(0.7rem, 1.4vw, 0.8rem)' }}>
                  <div style={{ marginBottom: 'clamp(0.25rem, 0.8vw, 0.5rem)' }}>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>Clearance Level:</span>
                    <div style={{ color: getClearanceColor(currentPerson.security.clearanceLevel), marginTop: '0.15rem', fontWeight: 'bold' }}>
                      {currentPerson.security.clearanceLevel}
                    </div>
                  </div>
                  <div style={{ marginBottom: 'clamp(0.25rem, 0.8vw, 0.5rem)' }}>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>Watchlist Status:</span>
                    <div style={{ color: getStatusColor(currentPerson.security.watchlistStatus), marginTop: '0.15rem', fontWeight: 'bold' }}>
                      {currentPerson.security.watchlistStatus}
                    </div>
                  </div>
                  <div style={{ marginBottom: 'clamp(0.25rem, 0.8vw, 0.5rem)' }}>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>Risk Assessment:</span>
                    <div style={{ color: getRiskColor(currentPerson.security.riskAssessment), marginTop: '0.15rem', fontWeight: 'bold' }}>
                      {currentPerson.security.riskAssessment}
                    </div>
                  </div>
                  <div>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>Last Screening:</span>
                    <div style={{ color: '#e0e0e0', marginTop: '0.15rem' }}>{currentPerson.security.lastScreening}</div>
                  </div>
                </div>
              </div>

              {/* Travel Information */}
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
                  Travel Profile
                </h4>
                
                <div style={{ fontSize: 'clamp(0.7rem, 1.4vw, 0.8rem)' }}>
                  <div style={{ marginBottom: 'clamp(0.25rem, 0.8vw, 0.5rem)' }}>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>Frequent Flyer:</span>
                    <div style={{ color: '#e0e0e0', marginTop: '0.15rem' }}>{currentPerson.travel.frequentFlyer}</div>
                  </div>
                  <div style={{ marginBottom: 'clamp(0.25rem, 0.8vw, 0.5rem)' }}>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>Membership:</span>
                    <div style={{ color: '#e0e0e0', marginTop: '0.15rem' }}>{currentPerson.travel.membershipNumber}</div>
                  </div>
                  <div style={{ marginBottom: 'clamp(0.25rem, 0.8vw, 0.5rem)' }}>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>Last Flight:</span>
                    <div style={{ color: '#e0e0e0', marginTop: '0.15rem' }}>{currentPerson.travel.lastFlight}</div>
                  </div>
                  <div>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>Travel History:</span>
                    <div style={{ color: '#e0e0e0', marginTop: '0.15rem' }}>{currentPerson.travel.travelHistory}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Identification Documents */}
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
                Identification Documents
              </h4>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: 'clamp(0.5rem, 1.5vw, 0.75rem)',
                fontSize: 'clamp(0.7rem, 1.4vw, 0.8rem)'
              }}>
                <div>
                  <div style={{ marginBottom: 'clamp(0.25rem, 0.8vw, 0.5rem)' }}>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>Passport Number:</span>
                    <div style={{ color: '#e0e0e0', marginTop: '0.15rem' }}>{currentPerson.identification.passportNumber}</div>
                  </div>
                  <div>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>Passport Expiry:</span>
                    <div style={{ color: '#e0e0e0', marginTop: '0.15rem' }}>{currentPerson.identification.passportExpiry}</div>
                  </div>
                </div>
                <div>
                  <div style={{ marginBottom: 'clamp(0.25rem, 0.8vw, 0.5rem)' }}>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>Driving License:</span>
                    <div style={{ color: '#e0e0e0', marginTop: '0.15rem' }}>{currentPerson.identification.drivingLicense}</div>
                  </div>
                  <div>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>License Class:</span>
                    <div style={{ color: '#e0e0e0', marginTop: '0.15rem' }}>{currentPerson.identification.licenseClass}</div>
                  </div>
                </div>
                <div>
                  <div style={{ marginBottom: 'clamp(0.25rem, 0.8vw, 0.5rem)' }}>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>License Expiry:</span>
                    <div style={{ color: '#e0e0e0', marginTop: '0.15rem' }}>{currentPerson.identification.licenseExpiry}</div>
                  </div>
                  <div>
                    <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>Face Match:</span>
                    <div style={{ color: '#00ff00', marginTop: '0.15rem', fontWeight: 'bold' }}>{currentPerson.biometric.faceMatch}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Camera and Recent Identifications */}
          <div style={{
            flex: '0 0 40%',
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(0.5rem, 1vw, 0.75rem)',
            minHeight: 0,
            marginRight: 'clamp(0.25rem, 1vw, 0.75rem)'
          }}>
            {/* Camera Section */}
            <div style={{
              flex: '0 0 clamp(50%, 55vh, 60%)',
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
                Identification Camera
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
                minHeight: '300px',
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
                    CAMERA
                  </div>
                  <div style={{
                    fontSize: 'clamp(0.8rem, 2vw, 1.1rem)',
                    fontWeight: 'bold'
                  }}>
                    Face Recognition
                  </div>
                  <div style={{
                    fontSize: 'clamp(0.7rem, 1.5vw, 0.9rem)',
                    marginTop: '0.25rem',
                    opacity: 0.8
                  }}>
                    Live Identification Feed
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
                      SCANNING...
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
                  {isScanning ? 'SCANNING...' : 'START IDENTIFICATION'}
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

            {/* Recent Identifications */}
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
              maxHeight: 'clamp(200px, 40vh, 400px)'
            }}>
              <h3 style={{
                color: '#87ceeb',
                fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                margin: '0 0 clamp(0.5rem, 1.5vw, 0.75rem) 0',
                borderBottom: '1px solid rgba(0, 191, 255, 0.3)',
                paddingBottom: 'clamp(0.15rem, 0.5vw, 0.25rem)'
              }}>
                Recent Identifications
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
                {recentIdentifications.map((person, index) => (
                  <div key={person.id} style={{
                    background: 'rgba(40, 40, 80, 0.6)',
                    borderRadius: '6px',
                    border: `1px solid ${getStatusColor(person.status)}40`,
                    padding: 'clamp(0.5rem, 1.5vw, 0.75rem)',
                    fontSize: 'clamp(0.7rem, 1.4vw, 0.8rem)'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.25rem'
                    }}>
                      <span style={{ color: '#87ceeb', fontWeight: 'bold' }}>{person.id}</span>
                      <span style={{ color: getStatusColor(person.status), fontWeight: 'bold' }}>
                        {person.status}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.15rem' }}>
                      <span style={{ color: '#87ceeb' }}>Time:</span>
                      <span style={{ color: '#e0e0e0' }}>{person.time}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.15rem' }}>
                      <span style={{ color: '#87ceeb' }}>Name:</span>
                      <span style={{ color: '#e0e0e0' }}>{person.name}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.15rem' }}>
                      <span style={{ color: '#87ceeb' }}>IC/Passport:</span>
                      <span style={{ color: '#00bfff' }}>{person.ic}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.15rem' }}>
                      <span style={{ color: '#87ceeb' }}>Confidence:</span>
                      <span style={{ color: person.confidence > 90 ? '#00ff00' : person.confidence > 70 ? '#ffa500' : '#ff4444' }}>
                        {person.confidence > 0 ? `${person.confidence.toFixed(1)}%` : 'N/A'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#87ceeb' }}>Clearance:</span>
                      <span style={{
                        color: getClearanceColor(person.clearance),
                        fontSize: 'clamp(0.65rem, 1.3vw, 0.75rem)',
                        fontWeight: 'bold'
                      }}>
                        {person.clearance}
                      </span>
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

export default IdentificationTracking;