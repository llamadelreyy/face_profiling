import React from 'react'

const Header = ({ title = "Airport Security Command Center" }) => {
  return (
    <div className="homepage-header-container">
      <div className="header-logo">
        <img src="/logo.png" alt="Logo" style={{maxHeight: '60px', width: 'auto'}} />
      </div>
      <h1 className="homepage-header-title">{title}</h1>
    </div>
  )
}

export default Header