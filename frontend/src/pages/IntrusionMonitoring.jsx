import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import BottomPanel from '../components/BottomPanel';
import '../styles/security.css';

const IntrusionMonitoring = () => {
  const [activeStation, setActiveStation] = useState('ALL');
  const [terminalStats, setTerminalStats] = useState({
    totalPeople: 1247,
    securityPersonnel: 45,
    passengers: 1156,
    staff: 46,
    alertLevel: 'NORMAL',
    activeZones: 12,
    restrictedAreas: 3
  });

  const [cameraFeeds] = useState([
    { 
      id: 1, 
      label: 'Terminal Main Hall', 
      zone: 'Public Area',
      status: 'ACTIVE', 
      peopleCount: 89,
      lastUpdate: '2 sec ago',
      alerts: 0
    },
    { 
      id: 2, 
      label: 'Security Checkpoint', 
      zone: 'Restricted Access',
      status: 'MONITORING', 
      peopleCount: 23,
      lastUpdate: '1 sec ago',
      alerts: 1
    }
  ]);

  const [recentEvents, setRecentEvents] = useState([
    {
      id: 1,
      timestamp: '14:28:15',
      zone: 'Terminal Main Hall',
      event: 'High density detected',
      severity: 'INFO',
      peopleCount: 89
    },
    {
      id: 2,
      timestamp: '14:27:42',
      zone: 'Security Checkpoint',
      event: 'Unauthorized access attempt',
      severity: 'WARNING',
      peopleCount: 1
    },
    {
      id: 3,
      timestamp: '14:26:18',
      zone: 'Baggage Claim',
      event: 'Normal crowd flow',
      severity: 'INFO',
      peopleCount: 34
    },
    {
      id: 4,
      timestamp: '14:25:55',
      zone: 'Gate Area B',
      event: 'Boarding in progress',
      severity: 'INFO',
      peopleCount: 67
    },
    {
      id: 5,
      timestamp: '14:24:30',
      zone: 'Restricted Area C',
      event: 'Perimeter breach detected',
      severity: 'CRITICAL',
      peopleCount: 2
    }
  ]);

  const [terminalOverview] = useState({
    zones: [
      { name: 'Main Terminal', people: 456, status: 'NORMAL', capacity: 800 },
      { name: 'Security Checkpoints', people: 89, status: 'BUSY', capacity: 120 },
      { name: 'Gate Areas', people: 234, status: 'NORMAL', capacity: 400 },
      { name: 'Baggage Claim', people: 67, status: 'LOW', capacity: 200 },
      { name: 'Retail Areas', people: 123, status: 'NORMAL', capacity: 300 },
      { name: 'Restricted Zones', people: 12, status: 'SECURE', capacity: 50 }
    ]
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

    // Simulate real-time updates
    const interval = setInterval(() => {
      // Update people counts randomly
      setTerminalStats(prev => ({
        ...prev,
        totalPeople: prev.totalPeople + Math.floor(Math.random() * 10 - 5),
        passengers: prev.passengers + Math.floor(Math.random() * 8 - 4),
        staff: prev.staff + Math.floor(Math.random() * 2 - 1)
      }));

      // Add new events occasionally
      if (Math.random() > 0.8) {
        const zones = ['Terminal Main Hall', 'Security Checkpoint', 'Gate Area A', 'Baggage Claim', 'Restricted Area'];
        const events = ['Person detected', 'Crowd density change', 'Normal movement', 'Security scan', 'Area cleared'];
        const severities = ['INFO', 'WARNING', 'NORMAL'];
        
        const now = new Date();
        const timestamp = now.toTimeString().slice(0, 8);
        
        const newEvent = {
          id: Date.now(),
          timestamp,
          zone: zones[Math.floor(Math.random() * zones.length)],
          event: events[Math.floor(Math.random() * events.length)],
          severity: severities[Math.floor(Math.random() * severities.length)],
          peopleCount: Math.floor(Math.random() * 50) + 1
        };

        setRecentEvents(prev => [newEvent, ...prev.slice(0, 4)]);
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

  const getStatusColor = (status) => {
    switch(status) {
      case 'ACTIVE': return '#00bfff';
      case 'MONITORING': return '#87ceeb';
      case 'ALERT': return '#ff4444';
      case 'NORMAL': return '#00bfff';
      case 'BUSY': return '#ffa500';
      case 'LOW': return '#87ceeb';
      case 'SECURE': return '#00ff00';
      default: return '#e0e0e0';
    }
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'CRITICAL': return '#ff0000';
      case 'WARNING': return '#ffa500';
      case 'INFO': return '#00bfff';
      case 'NORMAL': return '#87ceeb';
      default: return '#e0e0e0';
    }
  };

  const getCapacityPercentage = (people, capacity) => {
    return Math.min((people / capacity) * 100, 100);
  };

  const getCapacityColor = (percentage) => {
    if (percentage >= 90) return '#ff4444';
    if (percentage >= 70) return '#ffa500';
    if (percentage >= 50) return '#87ceeb';
    return '#00bfff';
  };

  return (
    <>
      <div className="test-scanlines"></div>
      <div className="test-container">
        <Header title="Intrusion Monitoring System" />
        
        <div style={{ 
          display: 'flex', 
          flex: 1, 
          overflow: 'hidden',
          padding: '1rem',
          gap: '1rem'
        }}>
          {/* Left Panel - 2x1 Camera Grid */}
          <div style={{
            flex: '0 0 45%',
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
              Live Camera Feeds
            </h2>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              flex: 1,
              minHeight: 0
            }}>
              {cameraFeeds.map((camera) => (
                <div key={camera.id} style={{
                  background: 'rgba(25, 25, 45, 0.75)',
                  borderRadius: '8px',
                  border: `2px solid ${getStatusColor(camera.status)}`,
                  boxShadow: `0 0 15px ${getStatusColor(camera.status)}40`,
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1
                }}>
                  {/* Camera Feed Area */}
                  <div style={{
                    flex: 1,
                    background: '#000',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '200px'
                  }}>
                    {/* Simulated camera feed with people icons */}
                    <div style={{
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(45deg, #1a1a2e 25%, transparent 25%), linear-gradient(-45deg, #1a1a2e 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1a1a2e 75%), linear-gradient(-45deg, transparent 75%, #1a1a2e 75%)',
                      backgroundSize: '20px 20px',
                      backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                      opacity: 0.3
                    }} />
                    
                    {/* People detection overlay */}
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center',
                      color: '#e0e0e0'
                    }}>
                      <div style={{
                        fontSize: '1.2rem',
                        marginBottom: '0.5rem',
                        color: getStatusColor(camera.status),
                        fontWeight: 'bold'
                      }}>
                        CROWD
                      </div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#00bfff' }}>
                        {camera.peopleCount} People
                      </div>
                      <div style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                        {camera.status === 'MONITORING' ? 'SCANNING AREA' : 'LIVE FEED'}
                      </div>
                    </div>

                    {/* Alert indicator */}
                    {camera.alerts > 0 && (
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: '#ff4444',
                        color: '#fff',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        animation: 'pulse 1s infinite'
                      }}>
                        {camera.alerts} ALERT{camera.alerts > 1 ? 'S' : ''}
                      </div>
                    )}
                  </div>
                  
                  {/* Camera Info Panel */}
                  <div style={{
                    padding: '1rem',
                    background: 'rgba(0, 0, 0, 0.7)',
                    borderTop: `1px solid ${getStatusColor(camera.status)}`
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.5rem'
                    }}>
                      <span style={{
                        color: '#00bfff',
                        fontWeight: 'bold',
                        fontSize: '1rem'
                      }}>
                        {camera.label}
                      </span>
                      <span style={{
                        color: getStatusColor(camera.status),
                        fontSize: '0.9rem',
                        fontWeight: 'bold'
                      }}>
                        {camera.status}
                      </span>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.85rem',
                      color: '#87ceeb'
                    }}>
                      <span>Zone: {camera.zone}</span>
                      <span>Updated: {camera.lastUpdate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Statistics and Overview */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            {/* Terminal Statistics */}
            <div style={{
              background: 'rgba(25, 25, 45, 0.75)',
              borderRadius: '8px',
              border: '1px solid rgba(0, 191, 255, 0.3)',
              boxShadow: '0 0 15px rgba(0, 191, 255, 0.2)',
              padding: '1rem'
            }}>
              <h3 style={{
                color: '#87ceeb',
                fontSize: '1.2rem',
                margin: '0 0 1rem 0',
                borderBottom: '1px solid rgba(0, 191, 255, 0.3)',
                paddingBottom: '0.5rem'
              }}>
                Terminal Statistics
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#00bfff' }}>
                    {terminalStats.totalPeople}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#87ceeb' }}>Total People</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#00ff00' }}>
                    {terminalStats.securityPersonnel}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#87ceeb' }}>Security Staff</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffa500' }}>
                    {terminalStats.passengers}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#87ceeb' }}>Passengers</div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.9rem'
              }}>
                <span>Alert Level: <span style={{ color: getStatusColor(terminalStats.alertLevel), fontWeight: 'bold' }}>{terminalStats.alertLevel}</span></span>
                <span>Active Zones: <span style={{ color: '#00bfff' }}>{terminalStats.activeZones}</span></span>
              </div>
            </div>

            {/* Terminal Overview */}
            <div style={{
              background: 'rgba(25, 25, 45, 0.75)',
              borderRadius: '8px',
              border: '1px solid rgba(0, 191, 255, 0.3)',
              boxShadow: '0 0 15px rgba(0, 191, 255, 0.2)',
              padding: '1rem',
              flex: 1,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <h3 style={{
                color: '#87ceeb',
                fontSize: '1.2rem',
                margin: '0 0 1rem 0',
                borderBottom: '1px solid rgba(0, 191, 255, 0.3)',
                paddingBottom: '0.5rem'
              }}>
                Airport Terminal Overview
              </h3>
              
              <div style={{
                flex: 1,
                overflowY: 'auto'
              }}>
                {terminalOverview.zones.map((zone, index) => {
                  const percentage = getCapacityPercentage(zone.people, zone.capacity);
                  return (
                    <div key={index} style={{
                      marginBottom: '1rem',
                      padding: '0.75rem',
                      background: 'rgba(0, 0, 0, 0.3)',
                      borderRadius: '6px',
                      border: `1px solid ${getStatusColor(zone.status)}40`
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.5rem'
                      }}>
                        <span style={{ color: '#e0e0e0', fontWeight: '500' }}>{zone.name}</span>
                        <span style={{ 
                          color: getStatusColor(zone.status),
                          fontSize: '0.8rem',
                          fontWeight: 'bold'
                        }}>
                          {zone.status}
                        </span>
                      </div>
                      
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.85rem',
                        marginBottom: '0.5rem'
                      }}>
                        <span style={{ color: '#87ceeb' }}>
                          {zone.people} / {zone.capacity} people
                        </span>
                        <span style={{ color: getCapacityColor(percentage) }}>
                          {percentage.toFixed(0)}%
                        </span>
                      </div>
                      
                      {/* Capacity bar */}
                      <div style={{
                        width: '100%',
                        height: '6px',
                        background: 'rgba(70, 70, 100, 0.5)',
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${percentage}%`,
                          height: '100%',
                          background: getCapacityColor(percentage),
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Events */}
            <div style={{
              background: 'rgba(25, 25, 45, 0.75)',
              borderRadius: '8px',
              border: '1px solid rgba(0, 191, 255, 0.3)',
              boxShadow: '0 0 15px rgba(0, 191, 255, 0.2)',
              padding: '1rem',
              maxHeight: '200px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <h3 style={{
                color: '#87ceeb',
                fontSize: '1.2rem',
                margin: '0 0 1rem 0',
                borderBottom: '1px solid rgba(0, 191, 255, 0.3)',
                paddingBottom: '0.5rem'
              }}>
                Recent Events
              </h3>
              
              <div style={{
                flex: 1,
                overflowY: 'auto'
              }}>
                {recentEvents.map((event) => (
                  <div key={event.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.5rem 0',
                    borderBottom: '1px solid rgba(70, 70, 100, 0.3)',
                    fontSize: '0.8rem'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#e0e0e0', marginBottom: '0.25rem' }}>
                        {event.event} - {event.zone}
                      </div>
                      <div style={{ color: '#87ceeb' }}>
                        {event.timestamp} | {event.peopleCount} people
                      </div>
                    </div>
                    <div style={{
                      color: getSeverityColor(event.severity),
                      fontWeight: 'bold',
                      fontSize: '0.75rem'
                    }}>
                      {event.severity}
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

export default IntrusionMonitoring;