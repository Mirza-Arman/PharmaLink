import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/pharmacy-logo.png";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-col footer-left">
          <div className="brand">
            <img src={logo} alt="PharmacyConnect" className="brand-logo" />
            <span className="brand-name">PharmacyConnect</span>
          </div>
          <p className="brand-desc">
            Your trusted bridge between customers and local pharmacies. Compare prices,
            check availability, and order with confidence.
          </p>
        </div>

        <div className="footer-col footer-links">
          <h4 className="col-title">Pages</h4>
          <nav className="links-list">
            <Link to="/">Home</Link>
            <a href="/#how-it-works">How it works</a>
            <a href="/#features">Features</a>
            <a href="/#faq">FAQ</a>
            <a href="mailto:support@pharmacyconnect.app">Contact</a>
          </nav>
        </div>

        <div className="footer-col footer-social">
          <h4 className="col-title">Connect</h4>
          <div className="social-list">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="social-item">
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path fill="#fff" d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H7zm5 3a5 5 0 110 10 5 5 0 010-10zm0 2.2a2.8 2.8 0 100 5.6 2.8 2.8 0 000-5.6zM18 6.8a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/>
              </svg>
              <span>Instagram</span>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="social-item">
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path fill="#fff" d="M13 22v-8h3l1-4h-4V7.5A1.5 1.5 0 0114.5 6H17V2h-2.5A5.5 5.5 0 009 7.5V10H6v4h3v8h4z"/>
              </svg>
              <span>Facebook</span>
            </a>
            <a href="https://wa.me/923001234567" target="_blank" rel="noreferrer" aria-label="WhatsApp" className="social-item">
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <circle cx="12" cy="12" r="12" fill="#25D366"/>
                <path fill="#fff" d="M16.7 14.8c-.2.5-1 .9-1.4 1.1-.4.2-.8.2-1.3.1s-1.2-.4-2-.8c-.8-.4-1.5-.9-2.1-1.4-.6-.5-1.1-1.2-1.5-1.9-.3-.7-.6-1.6-.6-2.1 0-.5.1-.9.3-1.3.2-.3.6-.8 1-.9.3-.2.7-.1.9 0l.7 1.6c.1.2 0 .4-.1.6l-.3.4c-.2.2-.2.4 0 .7.2.4.9 1.4 2 2s1.6.7 1.9.5l.5-.3c.2-.2.4-.2.6 0l1.3.8c.2.1.3.3.2.5z"/>
              </svg>
              <span>WhatsApp</span>
            </a>
            <a href="tel:+923001234567" className="social-item">
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path fill="#fff" d="M6.6 10.8a15.5 15.5 0 006.6 6.6l2.2-2.2a1 1 0 011-.26 11.5 11.5 0 003.6.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.5 11.5 0 00.57 3.6 1 1 0 01-.26 1l-2.2 2.2z"/>
              </svg>
              <span>+92 300 1234567</span>
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">© {new Date().getFullYear()} PharmacyConnect</div>
    </footer>
  );
};

export default Footer;


