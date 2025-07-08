import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import BottomPanel from '../components/BottomPanel';
import '../styles/security.css';

const StatusProcessing = () => {
  const [activeStation, setActiveStation] = useState('ALL');
  
  const [processingAreas] = useState([
    { 
      id: 1, 
      label: 'Baggage Screening Area', 
      zone: 'Security Zone A',
      status: 'ACTIVE', 
      itemsProcessed: 1247,
      currentLoad: 23,
      maxCapacity: 50,
      lastUpdate: '2 sec ago',
      alerts: 2
    },
    { 
      id: 2, 
      label: 'X-Ray Processing Station', 
      zone: 'Security Zone B',
      status: 'BUSY', 
      itemsProcessed: 892,
      currentLoad: 45,
      maxCapacity: 50,
      lastUpdate: '1 sec ago',
      alerts: 0
    },
    { 
      id: 3, 
      label: 'Manual Inspection Area', 
      zone: 'Security Zone C',
      status: 'NORMAL', 
      itemsProcessed: 456,
      currentLoad: 12,
      maxCapacity: 30,
      lastUpdate: '3 sec ago',
      alerts: 1
    }
  ]);

  const [processingStats, setProcessingStats] = useState({
    totalItemsToday: 2595,
    cleared: 2387,
    flagged: 156,
    rejected: 52,
    averageProcessingTime: 45, // seconds
    peakHourThroughput: 180, // items per hour
    currentThroughput: 145,
    efficiency: 92 // percentage
  });

  const [hourlyData] = useState([
    { hour: '08:00', items: 120, cleared: 115, flagged: 4, rejected: 1 },
    { hour: '09:00', items: 145, cleared: 138, flagged: 5, rejected: 2 },
    { hour: '10:00', items: 180, cleared: 170, flagged: 8, rejected: 2 },
    { hour: '11:00', items: 165, cleared: 155, flagged: 7, rejected: 3 },
    { hour: '12:00', items: 190, cleared: 175, flagged: 12, rejected: 3 },
    { hour: '13:00', items: 175, cleared: 162, flagged: 10, rejected: 3 },
    { hour: '14:00', items: 145, cleared: 135, flagged: 8, rejected: 2 }
  ]);

  const [recentAlerts, setRecentAlerts] = useState([
    {
      id: 1,
      timestamp: '14:41:30',
      area: 'Baggage Screening',
      alert: 'Suspicious item detected',
      severity: 'HIGH',
      status: 'INVESTIGATING'
    },
    {
      id: 2,
      timestamp: '14:39:15',
      area: 'X-Ray Processing',
      alert: 'Queue capacity exceeded',
      severity: 'MEDIUM',
      status: 'RESOLVED'
    },
    {
      id: 3,
      timestamp: '14:36:42',
      area: 'Manual Inspection',
      alert: 'Extended processing time',
      severity: 'LOW',
      status: 'MONITORING'
    },
    {
      id: 4,
      timestamp: '14:34:18',
      area: 'Baggage Screening',
      alert: 'Equipment calibration needed',
      severity: 'MEDIUM',
      status: 'SCHEDULED'
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
      // Update processing stats
      setProcessingStats(prev => ({
        ...prev,
        totalItemsToday: prev.totalItemsToday + Math.floor(Math.random() * 3),
        cleared: prev.cleared + Math.floor(Math.random() * 2),
        currentThroughput: 140 + Math.floor(Math.random() * 20)
      }));

      // Add new alerts occasionally
      if (Math.random() > 0.85) {
        const areas = ['Baggage Screening', 'X-Ray Processing', 'Manual Inspection'];
        const alerts = ['Queue building up', 'Processing delay', 'Equipment check needed', 'Suspicious item flagged'];
        const severities = ['LOW', 'MEDIUM', 'HIGH'];
        const statuses = ['ACTIVE', 'INVESTIGATING', 'RESOLVED'];
        
        const now = new Date();
        const timestamp = now.toTimeString().slice(0, 8);
        
        const newAlert = {
          id: Date.now(),
          timestamp,
          area: areas[Math.floor(Math.random() * areas.length)],
          alert: alerts[Math.floor(Math.random() * alerts.length)],
          severity: severities[Math.floor(Math.random() * severities.length)],
          status: statuses[Math.floor(Math.random() * statuses.length)]
        };

        setRecentAlerts(prev => [newAlert, ...prev.slice(0, 3)]);
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

  const getStatusColor = (status) => {
    switch(status) {
      case 'ACTIVE': return '#00bfff';
      case 'BUSY': return '#ffa500';
      case 'NORMAL': return '#87ceeb';
      case 'ALERT': return '#ff4444';
      case 'OFFLINE': return '#666';
      default: return '#e0e0e0';
    }
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'HIGH': return '#ff4444';
      case 'MEDIUM': return '#ffa500';
      case 'LOW': return '#87ceeb';
      default: return '#e0e0e0';
    }
  };

  const getLoadPercentage = (current, max) => {
    return Math.min((current / max) * 100, 100);
  };

  const getLoadColor = (percentage) => {
    if (percentage >= 90) return '#ff4444';
    if (percentage >= 70) return '#ffa500';
    if (percentage >= 50) return '#87ceeb';
    return '#00bfff';
  };

  const createBarChart = (data, maxValue) => {
    return data.map((item, index) => {
      const percentage = (item.items / maxValue) * 100;
      return (
        <div key={index} style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          flex: 1,
          minWidth: 0
        }}>
          <div style={{
            height: '100px',
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
                top: '-20px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '0.7rem',
                color: '#00bfff',
                fontWeight: 'bold'
              }}>
                {item.items}
              </div>
            </div>
          </div>
          <div style={{
            fontSize: '0.7rem',
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

  const createPieChart = () => {
    const total = processingStats.cleared + processingStats.flagged + processingStats.rejected;
    const clearedAngle = (processingStats.cleared / total) * 360;
    const flaggedAngle = (processingStats.flagged / total) * 360;
    const rejectedAngle = (processingStats.rejected / total) * 360;

    return (
      <div style={{
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        background: `conic-gradient(
          #00bfff 0deg ${clearedAngle}deg,
          #ffa500 ${clearedAngle}deg ${clearedAngle + flaggedAngle}deg,
          #ff4444 ${clearedAngle + flaggedAngle}deg 360deg
        )`,
        position: 'relative',
        margin: '0 auto'
      }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: '#1a1a2e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.8rem',
          fontWeight: 'bold',
          color: '#00bfff'
        }}>
          {total}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="test-scanlines"></div>
      <div className="test-container">
        <Header title="Status Processing Area System" />
        
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
          {/* 3x1 Camera Grid */}
          <div style={{
            flex: '0 0 clamp(25%, 30vh, 35%)',
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
              textShadow: '0 0 8px rgba(135,206,235,0.5)'
            }}>
              Processing Area Surveillance
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'clamp(0.25rem, 0.8vw, 0.5rem)',
              flex: 1,
              minHeight: 0
            }}>
              {processingAreas.map((area) => (
                <div key={area.id} style={{
                  background: 'rgba(25, 25, 45, 0.75)',
                  borderRadius: '8px',
                  border: `2px solid ${getStatusColor(area.status)}`,
                  boxShadow: `0 0 15px ${getStatusColor(area.status)}40`,
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
                    justifyContent: 'center',
                    minHeight: '120px'
                  }}>
                    {/* Simulated processing area feed */}
                    <div style={{
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(45deg, #1a1a2e 25%, transparent 25%), linear-gradient(-45deg, #1a1a2e 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1a1a2e 75%), linear-gradient(-45deg, transparent 75%, #1a1a2e 75%)',
                      backgroundSize: '20px 20px',
                      backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                      opacity: 0.3
                    }} />
                    
                    {/* Processing status overlay */}
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center',
                      color: '#e0e0e0'
                    }}>
                      <div style={{
                        fontSize: '2.5rem',
                        marginBottom: '0.5rem',
                        color: getStatusColor(area.status)
                      }}>
                        📦
                      </div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#00bfff' }}>
                        {area.currentLoad}/{area.maxCapacity}
                      </div>
                      <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
                        {area.status}
                      </div>
                    </div>

                    {/* Alert indicator */}
                    {area.alerts > 0 && (
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: '#ff4444',
                        color: '#fff',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: 'bold'
                      }}>
                        {area.alerts} ALERT{area.alerts > 1 ? 'S' : ''}
                      </div>
                    )}

                    {/* Load indicator */}
                    <div style={{
                      position: 'absolute',
                      bottom: '10px',
                      left: '10px',
                      right: '10px',
                      height: '4px',
                      background: 'rgba(70, 70, 100, 0.5)',
                      borderRadius: '2px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${getLoadPercentage(area.currentLoad, area.maxCapacity)}%`,
                        height: '100%',
                        background: getLoadColor(getLoadPercentage(area.currentLoad, area.maxCapacity)),
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                  </div>
                  
                  {/* Area Info Panel */}
                  <div style={{
                    padding: '0.75rem',
                    background: 'rgba(0, 0, 0, 0.7)',
                    borderTop: `2px solid ${getStatusColor(area.status)}`,
                    marginTop: '0.5rem'
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
                        fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)'
                      }}>
                        {area.label}
                      </span>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 'clamp(0.65rem, 1.2vw, 0.75rem)',
                      color: '#87ceeb',
                      marginBottom: '0.5rem'
                    }}>
                      <span>Zone: {area.zone}</span>
                      <span>Processed: {area.itemsProcessed}</span>
                    </div>
                    <div style={{
                      fontSize: 'clamp(0.6rem, 1vw, 0.7rem)',
                      color: '#87ceeb'
                    }}>
                      Updated: {area.lastUpdate}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Statistics and Charts */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            minHeight: 0,
            display: 'flex',
            flexDirection: window.innerWidth < 768 ? 'column' : 'row',
            gap: 'clamp(0.25rem, 0.8vw, 0.5rem)'
          }}>
            {/* Left Panel - Overall Statistics */}
            <div style={{
              flex: window.innerWidth < 768 ? '1' : '0 0 clamp(25%, 28vw, 32%)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(0.25rem, 0.8vw, 0.5rem)',
              minWidth: window.innerWidth < 768 ? 'auto' : '200px'
            }}>
              {/* Key Metrics */}
              <div style={{
                background: 'rgba(25, 25, 45, 0.75)',
                borderRadius: '8px',
                border: '1px solid rgba(0, 191, 255, 0.3)',
                boxShadow: '0 0 15px rgba(0, 191, 255, 0.2)',
                padding: '0.75rem'
              }}>
                <h3 style={{
                  color: '#87ceeb',
                  fontSize: 'clamp(0.8rem, 2vw, 1.1rem)',
                  margin: '0 0 clamp(0.5rem, 1.5vw, 0.75rem) 0',
                  borderBottom: '1px solid rgba(0, 191, 255, 0.3)',
                  paddingBottom: 'clamp(0.15rem, 0.5vw, 0.3rem)'
                }}>
                  Today's Statistics
                </h3>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                  gap: 'clamp(0.5rem, 1.5vw, 0.75rem)'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 'clamp(1.2rem, 3.5vw, 2rem)', fontWeight: 'bold', color: '#00bfff' }}>
                      {processingStats.totalItemsToday}
                    </div>
                    <div style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.9rem)', color: '#87ceeb' }}>Total Items</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 'clamp(1rem, 3vw, 1.6rem)', fontWeight: 'bold', color: '#00ff00' }}>
                      {processingStats.cleared}
                    </div>
                    <div style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.9rem)', color: '#87ceeb' }}>Cleared</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 'clamp(1rem, 3vw, 1.6rem)', fontWeight: 'bold', color: '#ffa500' }}>
                      {processingStats.flagged}
                    </div>
                    <div style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.9rem)', color: '#87ceeb' }}>Flagged</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 'clamp(1rem, 3vw, 1.6rem)', fontWeight: 'bold', color: '#ff4444' }}>
                      {processingStats.rejected}
                    </div>
                    <div style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.9rem)', color: '#87ceeb' }}>Rejected</div>
                  </div>
                </div>
              </div>

              {/* Pie Chart */}
              <div style={{
                background: 'rgba(25, 25, 45, 0.75)',
                borderRadius: '8px',
                border: '1px solid rgba(0, 191, 255, 0.3)',
                boxShadow: '0 0 15px rgba(0, 191, 255, 0.2)',
                padding: '0.75rem',
                flex: 1
              }}>
                <h3 style={{
                  color: '#87ceeb',
                  fontSize: '1rem',
                  margin: '0 0 0.75rem 0',
                  borderBottom: '1px solid rgba(0, 191, 255, 0.3)',
                  paddingBottom: '0.25rem',
                  textAlign: 'center'
                }}>
                  Processing Results
                </h3>
                
                {createPieChart()}
                
                <div style={{
                  marginTop: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  fontSize: '0.8rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '12px', height: '12px', background: '#00bfff', borderRadius: '2px' }}></div>
                    <span style={{ color: '#e0e0e0' }}>Cleared ({Math.round((processingStats.cleared / processingStats.totalItemsToday) * 100)}%)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '12px', height: '12px', background: '#ffa500', borderRadius: '2px' }}></div>
                    <span style={{ color: '#e0e0e0' }}>Flagged ({Math.round((processingStats.flagged / processingStats.totalItemsToday) * 100)}%)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '12px', height: '12px', background: '#ff4444', borderRadius: '2px' }}></div>
                    <span style={{ color: '#e0e0e0' }}>Rejected ({Math.round((processingStats.rejected / processingStats.totalItemsToday) * 100)}%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Center Panel - Hourly Bar Chart */}
            <div style={{
              flex: 1,
              height: '100%',
              background: 'rgba(25, 25, 45, 0.75)',
              borderRadius: '8px',
              border: '1px solid rgba(0, 191, 255, 0.3)',
              boxShadow: '0 0 15px rgba(0, 191, 255, 0.2)',
              padding: '0.75rem',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <h3 style={{
                color: '#87ceeb',
                fontSize: '1rem',
                margin: '0 0 0.75rem 0',
                borderBottom: '1px solid rgba(0, 191, 255, 0.3)',
                paddingBottom: '0.25rem',
                textAlign: 'center'
              }}>
                Hourly Processing Volume
              </h3>
              
              <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'flex-end',
                gap: '0.5rem',
                padding: '0.5rem 0'
              }}>
                {createBarChart(hourlyData, 200)}
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.75rem',
                color: '#87ceeb',
                marginTop: '0.25rem'
              }}>
                <span>Current: {processingStats.currentThroughput}/hr</span>
                <span>Peak: {processingStats.peakHourThroughput}/hr</span>
                <span>Avg Time: {processingStats.averageProcessingTime}s</span>
              </div>
            </div>

            {/* Right Panel - Recent Alerts */}
            <div style={{
              flex: window.innerWidth < 768 ? '1' : '0 0 clamp(25%, 28vw, 32%)',
              height: '100%',
              background: 'rgba(25, 25, 45, 0.75)',
              borderRadius: '8px',
              border: '1px solid rgba(0, 191, 255, 0.3)',
              boxShadow: '0 0 15px rgba(0, 191, 255, 0.2)',
              padding: 'clamp(0.5rem, 1.5vw, 0.75rem)',
              display: 'flex',
              flexDirection: 'column',
              minWidth: window.innerWidth < 768 ? 'auto' : '200px'
            }}>
              <h3 style={{
                color: '#87ceeb',
                fontSize: 'clamp(0.8rem, 2vw, 1.1rem)',
                margin: '0 0 clamp(0.5rem, 1.5vw, 0.75rem) 0',
                borderBottom: '1px solid rgba(0, 191, 255, 0.3)',
                paddingBottom: 'clamp(0.15rem, 0.5vw, 0.3rem)'
              }}>
                Recent Alerts
              </h3>
              
              <div style={{
                flex: 1,
                overflowY: 'auto'
              }}>
                {recentAlerts.map((alert) => (
                  <div key={alert.id} style={{
                    marginBottom: 'clamp(0.25rem, 1vw, 0.5rem)',
                    padding: 'clamp(0.4rem, 1vw, 0.6rem)',
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '6px',
                    border: `1px solid ${getSeverityColor(alert.severity)}40`
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 'clamp(0.15rem, 0.5vw, 0.3rem)'
                    }}>
                      <span style={{
                        color: getSeverityColor(alert.severity),
                        fontSize: 'clamp(0.65rem, 1.5vw, 0.8rem)',
                        fontWeight: 'bold'
                      }}>
                        {alert.severity}
                      </span>
                      <span style={{
                        color: '#87ceeb',
                        fontSize: 'clamp(0.6rem, 1.2vw, 0.7rem)'
                      }}>
                        {alert.timestamp}
                      </span>
                    </div>
                    
                    <div style={{
                      color: '#e0e0e0',
                      fontSize: 'clamp(0.65rem, 1.4vw, 0.8rem)',
                      marginBottom: 'clamp(0.1rem, 0.3vw, 0.2rem)'
                    }}>
                      {alert.alert}
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 'clamp(0.6rem, 1.2vw, 0.7rem)'
                    }}>
                      <span style={{ color: '#87ceeb' }}>{alert.area}</span>
                      <span style={{ color: '#00bfff' }}>{alert.status}</span>
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

export default StatusProcessing;