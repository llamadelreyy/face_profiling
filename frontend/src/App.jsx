import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import FacialRecognition from './pages/FacialRecognition'
import AlarmVerification from './pages/AlarmVerification'
import IntrusionMonitoring from './pages/IntrusionMonitoring'
import ArrivalDeparture from './pages/ArrivalDeparture'
import StatusProcessing from './pages/StatusProcessing'
import VehicleTracking from './pages/VehicleTracking'
import BodyScanner from './pages/BodyScanner'
import VehicleScanner from './pages/VehicleScanner'
import ContainerScanner from './pages/ContainerScanner'
import IdentificationTracking from './pages/IdentificationTracking'
import GateSecurity from './pages/GateSecurity'
import TerminalSecurity from './pages/TerminalSecurity'
import SecurityCheck from './pages/SecurityCheck'
import Test from './pages/Test'

function App() {
  return (
    <div className="App">
      <Routes>
        {/* <Route path="/" element={<Navigate to="/home" replace />} /> */}
        <Route path="/" element={<HomePage />} />
        <Route path="/recognition" element={<FacialRecognition />} />
        <Route path="/test" element={<Test />} />
        <Route path="/alarm-verification" element={<AlarmVerification />} />
        <Route path="/intrusion-monitoring" element={<IntrusionMonitoring />} />
        <Route path="/arrival-departure" element={<ArrivalDeparture />} />
        <Route path="/status-processing" element={<StatusProcessing />} />
        <Route path="/vehicle-tracking" element={<VehicleTracking />} />
        <Route path="/body-scanner" element={<BodyScanner />} />
        <Route path="/vehicle-scanner" element={<VehicleScanner />} />
        <Route path="/container-scanner" element={<ContainerScanner />} />
        <Route path="/identification-tracking" element={<IdentificationTracking />} />
        <Route path="/gate-security" element={<GateSecurity />} />
        <Route path="/terminal-security" element={<TerminalSecurity />} />
        <Route path="/security-check" element={<SecurityCheck />} />
      </Routes>
    </div>
  )
}

export default App