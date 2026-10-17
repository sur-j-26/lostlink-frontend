import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';

const CURRENT_YEAR = 2026;

export default function Footer() {

  return (
    <footer className="footer-root">
      <div className="container footer-container">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-col brand-col">
            <Link to="/" className="footer-brand">
              <div className="footer-brand-icon">
                <Compass size={20} />
              </div>
              <span className="footer-brand-title">Lost<span className="brand-accent">Link</span> <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#94a3b8' }}>— Anurag University</span></span>
            </Link>
            <p className="footer-desc">
              The dedicated lost and found recovery network built for the Anurag University campus community. Securely reconnecting students, faculty, and staff with their belongings.
            </p>
            <div className="footer-badge">
              <ShieldCheck size={16} className="badge-icon" />
              <span>Anurag University Security & Student Affairs Verified</span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="footer-col">
            <h4 className="footer-heading">Platform</h4>
            <ul className="footer-nav-list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/items">Browse All Items</Link></li>
              <li><Link to="/items?type=lost">Report Lost Belongings</Link></li>
              <li><Link to="/items?type=found">Hand in Found Item</Link></li>
              <li><Link to="/register">Student Sign-Up</Link></li>
            </ul>
          </div>

          {/* Help & Support Column */}
          <div className="footer-col">
            <h4 className="footer-heading">Resources</h4>
            <ul className="footer-nav-list">
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#about">About the Initiative</a></li>
              <li><a href="#trust">Claim Verification Rules</a></li>
              <li><a href="#faq">Frequently Asked Questions</a></li>
              <li><Link to="/login">Campus Staff Login</Link></li>
            </ul>
          </div>

          {/* Campus Desk & Contact Column */}
          <div className="footer-col">
            <h4 className="footer-heading">Campus Helpdesk</h4>
            <ul className="footer-contact-list">
              <li>
                <MapPin size={16} className="contact-icon" />
                <span>Anurag University Campus — Security Desk & Student Affairs</span>
              </li>
              <li>
                <Mail size={16} className="contact-icon" />
                <a href="mailto:lostlink@anurag.edu.in">lostlink@anurag.edu.in</a>
              </li>
              <li>
                <Phone size={16} className="contact-icon" />
                <span>Campus Helpline & Support Desk</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p className="footer-copy">
            &copy; {CURRENT_YEAR} LostLink — Anurag University Campus Portal. Built for students, faculty & staff.
          </p>
          <div className="footer-legal-links">
            <a href="#privacy">Privacy Policy</a>
            <span className="legal-dot">&bull;</span>
            <a href="#terms">Terms of Service</a>
            <span className="legal-dot">&bull;</span>
            <a href="#claim-policy">Claim Ethics</a>
            <span className="legal-dot">&bull;</span>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
