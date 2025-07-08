import React from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'

const HomePage = () => {
  const securityModules = [
    {
      id: 'alarm-verification',
      title: 'Alarm Verification',
      description: 'Monitor and verify security alarms across all terminals',
      path: '/alarm-verification',
      status: 'active'
    },
    {
      id: 'intrusion-monitoring',
      title: 'Intrusion Monitoring',
      description: 'Real-time perimeter and restricted area monitoring',
      path: '/intrusion-monitoring',
      status: 'active'
    },
    {
      id: 'arrival-departure',
      title: 'Arrival and Departure',
      description: 'Flight status and passenger flow management',
      path: '/arrival-departure',
      status: 'active'
    },
    {
      id: 'status-processing',
      title: 'Status Processing Area',
      description: 'Central processing and status coordination hub',
      path: '/status-processing',
      status: 'active'
    },
    {
      id: 'vehicle-tracking',
      title: 'Vehicle Identification Tracking',
      description: 'Track and monitor all vehicles in airport premises',
      path: '/vehicle-tracking',
      status: 'active'
    },
    {
      id: 'body-scanner',
      title: 'Body Scanner',
      description: 'Advanced body scanning security checkpoint',
      path: '/body-scanner',
      status: 'active'
    },
    {
      id: 'vehicle-scanner',
      title: 'Vehicle Scanner',
      description: 'Comprehensive vehicle inspection and scanning',
      path: '/vehicle-scanner',
      status: 'active'
    },
    {
      id: 'container-scanner',
      title: 'Container Scanner',
      description: 'Cargo and container security screening',
      path: '/container-scanner',
      status: 'active'
    },
    {
      id: 'identification-tracking',
      title: 'Identification Tracking',
      description: 'Personnel and visitor identification management',
      path: '/identification-tracking',
      status: 'active'
    },
    {
      id: 'facial-recognition',
      title: 'Facial Recognition at Gate',
      description: 'Advanced facial recognition for gate security',
      path: '/recognition',
      status: 'active'
    },
    {
      id: 'terminal-security',
      title: 'Terminal Security',
      description: 'Comprehensive terminal security monitoring',
      path: '/terminal-security',
      status: 'active'
    },
    {
      id: 'security-check',
      title: 'Security Check',
      description: 'General security checkpoint management',
      path: '/security-check',
      status: 'active'
    }
  ]

  return (
    <div className="homepage">
      <div className="scanlines"></div>
      <div className="homepage-container">
        {/* Header */}
        <Header title="AIRPORT SECURITY COMMAND CENTER" />
        
        <main className="homepage-main">
          <div className="system-overview">
            <h2>System Overview</h2>
            <div className="stats-grid">
              <div className="stat-card online">
                <div className="stat-value">12</div>
                <div className="stat-label">Active Stations</div>
              </div>
              <div className="stat-card warning">
                <div className="stat-value">3</div>
                <div className="stat-label">Alerts Today</div>
              </div>
              <div className="stat-card success">
                <div className="stat-value">OPERATIONAL</div>
                <div className="stat-label">System Status</div>
              </div>
              <div className="stat-card info">
                <div className="stat-value">2 min ago</div>
                <div className="stat-label">Last Update</div>
              </div>
            </div>
          </div>

          <div className="modules-section">
            <h2>Security Modules</h2>
            <div className="modules-grid">
              {securityModules.map((module) => (
                <Link key={module.id} to={module.path} className="module-card">
                  <h3>{module.title}</h3>
                  <p>{module.description}</p>
                  <div className="module-status">
                    <span className="status-indicator active"></span>
                    <span>OPERATIONAL</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default HomePage