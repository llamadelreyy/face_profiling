import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import BottomPanel from '../components/BottomPanel';
import '../styles/security.css';

const ArrivalDeparture = () => {
  const [activeStation, setActiveStation] = useState('ALL');
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [arrivalFlights, setArrivalFlights] = useState([
    {
      id: 'MH1234',
      flight: 'MH 1234',
      from: 'Kota Kinabalu, Sabah (BKI)',
      scheduled: '14:30',
      estimated: '14:35',
      status: 'DELAYED',
      gate: 'A12',
      terminal: '1'
    },
    {
      id: 'AK5678',
      flight: 'AK 5678',
      from: 'Kuching, Sarawak (KCH)',
      scheduled: '14:45',
      estimated: '14:45',
      status: 'ON TIME',
      gate: 'B08',
      terminal: '2'
    },
    {
      id: 'MH9012',
      flight: 'MH 9012',
      from: 'Johor Bahru, Johor (JHB)',
      scheduled: '15:00',
      estimated: '14:55',
      status: 'EARLY',
      gate: 'C15',
      terminal: '3'
    },
    {
      id: 'AK3456',
      flight: 'AK 3456',
      from: 'Penang, Pulau Pinang (PEN)',
      scheduled: '15:15',
      estimated: '15:15',
      status: 'ON TIME',
      gate: 'A05',
      terminal: '1'
    },
    {
      id: 'MH7890',
      flight: 'MH 7890',
      from: 'Miri, Sarawak (MYY)',
      scheduled: '15:30',
      estimated: '15:45',
      status: 'DELAYED',
      gate: 'B12',
      terminal: '2'
    },
    {
      id: 'AK2345',
      flight: 'AK 2345',
      from: 'Langkawi, Kedah (LGK)',
      scheduled: '15:45',
      estimated: '15:40',
      status: 'EARLY',
      gate: 'C03',
      terminal: '3'
    },
    {
      id: 'MH6789',
      flight: 'MH 6789',
      from: 'Tawau, Sabah (TWU)',
      scheduled: '16:00',
      estimated: '16:20',
      status: 'DELAYED',
      gate: 'A18',
      terminal: '1'
    },
    {
      id: 'AK0123',
      flight: 'AK 0123',
      from: 'Alor Setar, Kedah (AOR)',
      scheduled: '16:15',
      estimated: '16:15',
      status: 'ON TIME',
      gate: 'B06',
      terminal: '2'
    }
  ]);

  const [departureFlights, setDepartureFlights] = useState([
    {
      id: 'MH4567',
      flight: 'MH 4567',
      to: 'Kota Kinabalu, Sabah (BKI)',
      scheduled: '14:20',
      estimated: '14:20',
      status: 'BOARDING',
      gate: 'A09',
      terminal: '1'
    },
    {
      id: 'AK8901',
      flight: 'AK 8901',
      to: 'Kuching, Sarawak (KCH)',
      scheduled: '14:35',
      estimated: '14:40',
      status: 'DELAYED',
      gate: 'B14',
      terminal: '2'
    },
    {
      id: 'MH2345',
      flight: 'MH 2345',
      to: 'Ipoh, Perak (IPH)',
      scheduled: '14:50',
      estimated: '14:50',
      status: 'ON TIME',
      gate: 'C07',
      terminal: '3'
    },
    {
      id: 'AK6789',
      flight: 'AK 6789',
      to: 'Penang, Pulau Pinang (PEN)',
      scheduled: '15:05',
      estimated: '15:05',
      status: 'ON TIME',
      gate: 'A16',
      terminal: '1'
    },
    {
      id: 'MH0123',
      flight: 'MH 0123',
      to: 'Sandakan, Sabah (SDK)',
      scheduled: '15:20',
      estimated: '15:35',
      status: 'DELAYED',
      gate: 'B02',
      terminal: '2'
    },
    {
      id: 'AK4567',
      flight: 'AK 4567',
      to: 'Sibu, Sarawak (SBW)',
      scheduled: '15:35',
      estimated: '15:30',
      status: 'EARLY',
      gate: 'C11',
      terminal: '3'
    },
    {
      id: 'MH8901',
      flight: 'MH 8901',
      to: 'Kuantan, Pahang (KUA)',
      scheduled: '15:50',
      estimated: '16:10',
      status: 'DELAYED',
      gate: 'A04',
      terminal: '1'
    },
    {
      id: 'AK2345',
      flight: 'AK 2345',
      to: 'Terengganu, Terengganu (TGG)',
      scheduled: '16:05',
      estimated: '16:05',
      status: 'CHECK-IN',
      gate: 'B09',
      terminal: '2'
    }
  ]);

  const [flightStats, setFlightStats] = useState({
    arrivals: {
      total: 8,
      onTime: 3,
      delayed: 3,
      early: 2,
      cancelled: 0
    },
    departures: {
      total: 8,
      onTime: 3,
      delayed: 3,
      early: 1,
      boarding: 1,
      cancelled: 0
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

    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Simulate flight updates
    const flightInterval = setInterval(() => {
      // Randomly update flight statuses
      if (Math.random() > 0.8) {
        setArrivalFlights(prev => prev.map(flight => {
          if (Math.random() > 0.9) {
            const statuses = ['ON TIME', 'DELAYED', 'EARLY', 'LANDED'];
            const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
            return { ...flight, status: newStatus };
          }
          return flight;
        }));

        setDepartureFlights(prev => prev.map(flight => {
          if (Math.random() > 0.9) {
            const statuses = ['ON TIME', 'DELAYED', 'EARLY', 'BOARDING', 'DEPARTED', 'CHECK-IN'];
            const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
            return { ...flight, status: newStatus };
          }
          return flight;
        }));
      }
    }, 5000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(flightInterval);
    };
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
      case 'ON TIME': return '#00bfff';
      case 'DELAYED': return '#ff4444';
      case 'EARLY': return '#00ff00';
      case 'BOARDING': return '#ffa500';
      case 'LANDED': return '#87ceeb';
      case 'DEPARTED': return '#87ceeb';
      case 'CHECK-IN': return '#00bfff';
      case 'CANCELLED': return '#ff0000';
      default: return '#e0e0e0';
    }
  };

  const formatTime = (time) => {
    return time.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <div className="test-scanlines"></div>
      <div className="test-container">
        <Header title="Arrival & Departure Information System" />
        
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          flex: 1, 
          overflow: 'hidden',
          padding: '1rem',
          gap: '1rem'
        }}>
          {/* Current Time Display */}
          <div style={{
            background: 'rgba(25, 25, 45, 0.75)',
            borderRadius: '8px',
            border: '1px solid rgba(0, 191, 255, 0.3)',
            boxShadow: '0 0 15px rgba(0, 191, 255, 0.2)',
            padding: '1rem',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#00bfff',
              marginBottom: '0.5rem'
            }}>
              {formatTime(currentTime)}
            </div>
            <div style={{
              fontSize: '1rem',
              color: '#87ceeb'
            }}>
              {formatDate(currentTime)}
            </div>
          </div>

          {/* Flight Screens - Side by Side */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            flex: 1,
            minHeight: 0
          }}>
            {/* Arrivals Screen */}
            <div style={{
              flex: 1,
              background: 'rgba(25, 25, 45, 0.75)',
              borderRadius: '8px',
              border: '1px solid rgba(0, 191, 255, 0.3)',
              boxShadow: '0 0 15px rgba(0, 191, 255, 0.2)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{
                background: 'rgba(0, 191, 255, 0.1)',
                padding: '1rem',
                borderBottom: '1px solid rgba(0, 191, 255, 0.3)',
                textAlign: 'center'
              }}>
                <h2 style={{
                  color: '#00bfff',
                  fontSize: '1.5rem',
                  margin: 0,
                  textShadow: '0 0 8px rgba(0,191,255,0.5)'
                }}>
                  ✈️ ARRIVALS
                </h2>
              </div>
              
              {/* Arrivals Header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr 1fr',
                gap: '0.5rem',
                padding: '0.75rem',
                background: 'rgba(0, 191, 255, 0.05)',
                borderBottom: '1px solid rgba(0, 191, 255, 0.2)',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                color: '#87ceeb'
              }}>
                <div>FLIGHT</div>
                <div>FROM</div>
                <div>SCHEDULED</div>
                <div>ESTIMATED</div>
                <div>STATUS</div>
                <div>GATE</div>
              </div>
              
              {/* Arrivals List */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '0.5rem'
              }}>
                {arrivalFlights.map((flight) => (
                  <div key={flight.id} style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr 1fr',
                    gap: '0.5rem',
                    padding: '0.75rem 0.25rem',
                    borderBottom: '1px solid rgba(70, 70, 100, 0.3)',
                    fontSize: '0.85rem',
                    alignItems: 'center'
                  }}>
                    <div style={{ color: '#00bfff', fontWeight: 'bold' }}>
                      {flight.flight}
                    </div>
                    <div style={{ color: '#e0e0e0' }}>
                      {flight.from}
                    </div>
                    <div style={{ color: '#87ceeb' }}>
                      {flight.scheduled}
                    </div>
                    <div style={{ color: '#e0e0e0' }}>
                      {flight.estimated}
                    </div>
                    <div style={{ 
                      color: getStatusColor(flight.status),
                      fontWeight: 'bold',
                      fontSize: '0.8rem'
                    }}>
                      {flight.status}
                    </div>
                    <div style={{ color: '#87ceeb' }}>
                      {flight.gate}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Departures Screen */}
            <div style={{
              flex: 1,
              background: 'rgba(25, 25, 45, 0.75)',
              borderRadius: '8px',
              border: '1px solid rgba(0, 191, 255, 0.3)',
              boxShadow: '0 0 15px rgba(0, 191, 255, 0.2)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{
                background: 'rgba(0, 191, 255, 0.1)',
                padding: '1rem',
                borderBottom: '1px solid rgba(0, 191, 255, 0.3)',
                textAlign: 'center'
              }}>
                <h2 style={{
                  color: '#00bfff',
                  fontSize: '1.5rem',
                  margin: 0,
                  textShadow: '0 0 8px rgba(0,191,255,0.5)'
                }}>
                  🛫 DEPARTURES
                </h2>
              </div>
              
              {/* Departures Header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr 1fr',
                gap: '0.5rem',
                padding: '0.75rem',
                background: 'rgba(0, 191, 255, 0.05)',
                borderBottom: '1px solid rgba(0, 191, 255, 0.2)',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                color: '#87ceeb'
              }}>
                <div>FLIGHT</div>
                <div>TO</div>
                <div>SCHEDULED</div>
                <div>ESTIMATED</div>
                <div>STATUS</div>
                <div>GATE</div>
              </div>
              
              {/* Departures List */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '0.5rem'
              }}>
                {departureFlights.map((flight) => (
                  <div key={flight.id} style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr 1fr',
                    gap: '0.5rem',
                    padding: '0.75rem 0.25rem',
                    borderBottom: '1px solid rgba(70, 70, 100, 0.3)',
                    fontSize: '0.85rem',
                    alignItems: 'center'
                  }}>
                    <div style={{ color: '#00bfff', fontWeight: 'bold' }}>
                      {flight.flight}
                    </div>
                    <div style={{ color: '#e0e0e0' }}>
                      {flight.to}
                    </div>
                    <div style={{ color: '#87ceeb' }}>
                      {flight.scheduled}
                    </div>
                    <div style={{ color: '#e0e0e0' }}>
                      {flight.estimated}
                    </div>
                    <div style={{ 
                      color: getStatusColor(flight.status),
                      fontWeight: 'bold',
                      fontSize: '0.8rem'
                    }}>
                      {flight.status}
                    </div>
                    <div style={{ color: '#87ceeb' }}>
                      {flight.gate}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Flight Statistics */}
          <div style={{
            display: 'flex',
            gap: '1rem'
          }}>
            {/* Arrivals Statistics */}
            <div style={{
              flex: 1,
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
                paddingBottom: '0.5rem',
                textAlign: 'center'
              }}>
                Arrivals Statistics
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                textAlign: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#00bfff' }}>
                    {flightStats.arrivals.total}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#87ceeb' }}>Total</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#00bfff' }}>
                    {flightStats.arrivals.onTime}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#87ceeb' }}>On Time</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ff4444' }}>
                    {flightStats.arrivals.delayed}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#87ceeb' }}>Delayed</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#00ff00' }}>
                    {flightStats.arrivals.early}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#87ceeb' }}>Early</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ff0000' }}>
                    {flightStats.arrivals.cancelled}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#87ceeb' }}>Cancelled</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#87ceeb' }}>
                    {Math.round((flightStats.arrivals.onTime / flightStats.arrivals.total) * 100)}%
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#87ceeb' }}>On-Time Rate</div>
                </div>
              </div>
            </div>

            {/* Departures Statistics */}
            <div style={{
              flex: 1,
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
                paddingBottom: '0.5rem',
                textAlign: 'center'
              }}>
                Departures Statistics
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                textAlign: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#00bfff' }}>
                    {flightStats.departures.total}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#87ceeb' }}>Total</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#00bfff' }}>
                    {flightStats.departures.onTime}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#87ceeb' }}>On Time</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ff4444' }}>
                    {flightStats.departures.delayed}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#87ceeb' }}>Delayed</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#00ff00' }}>
                    {flightStats.departures.early}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#87ceeb' }}>Early</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ffa500' }}>
                    {flightStats.departures.boarding}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#87ceeb' }}>Boarding</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#87ceeb' }}>
                    {Math.round((flightStats.departures.onTime / flightStats.departures.total) * 100)}%
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#87ceeb' }}>On-Time Rate</div>
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

export default ArrivalDeparture;