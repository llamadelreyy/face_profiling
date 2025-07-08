import React from 'react';

const FooterPage = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <p>&copy; 2024 Airport Security System. All rights reserved.</p>
        </div>
        <div className="footer-center">
          <div className="footer-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#support">Support</a>
          </div>
        </div>
        <div className="footer-right">
          <p>Version 2.1.0 | Build 20241201</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterPage;