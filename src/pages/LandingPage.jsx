import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  PlusCircle,
  FileQuestion,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  Clock,
  MapPin,
  Lock,
  Layers,
  Award,
  Users,
} from 'lucide-react';
import Button from '../components/common/Button';
import './LandingPage.css';

export default function LandingPage({ onOpenReportModal }) {
  const navigate = useNavigate();

  const handleReportClick = () => {
    if (onOpenReportModal) {
      onOpenReportModal();
    } else {
      navigate('/items?action=report');
    }
  };

  return (
    <div className="landing-page">
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <div className="hero-pill-badge">
              <span className="hero-pill-dot" />
              <span className="hero-pill-text">ANURAG UNIVERSITY CAMPUS PORTAL</span>
            </div>

            <h1 className="hero-headline">
              Anurag University <br />
              <span className="hero-headline-accent">Lost & Found Portal</span>
            </h1>

            <p className="hero-description">
              A centralized campus platform to report, search, and recover lost belongings within Anurag University.
            </p>

            <div className="hero-cta-group">
              <Button
                variant="primary"
                size="lg"
                icon={PlusCircle}
                onClick={handleReportClick}
                className="hero-primary-btn"
              >
                Report an Item
              </Button>

              <Link to="/items">
                <Button
                  variant="secondary"
                  size="lg"
                  icon={Search}
                  className="hero-secondary-btn"
                >
                  Browse Items
                </Button>
              </Link>
            </div>

            <div className="hero-trust-indicators">
              <div className="indicator-item">
                <ShieldCheck size={18} className="indicator-icon" />
                <span>Verified Campus IDs</span>
              </div>
              <div className="indicator-item">
                <Sparkles size={18} className="indicator-icon" />
                <span>Intelligent AI Matching</span>
              </div>
              <div className="indicator-item">
                <Lock size={18} className="indicator-icon" />
                <span>Zero Public PII Exposure</span>
              </div>
            </div>
          </div>

          {/* Visual Showcase Area */}
          <div className="hero-visual">
            <div className="hero-cards-stack">
              {/* Sample Card 1: Found Item */}
              <div className="showcase-card showcase-found">
                <div className="showcase-header">
                  <span className="badge badge-found">
                    <span className="badge-dot" /> Found Item
                  </span>
                  <span className="showcase-time">Today, 11:20 AM</span>
                </div>
                <h4 className="showcase-title">Apple MacBook Air (Space Gray)</h4>
                <div className="showcase-meta">
                  <MapPin size={14} />
                  <span>Library, 2nd Floor Study Pods</span>
                </div>
                <div className="showcase-ai-tag">
                  <Sparkles size={13} />
                  <span>94% match with report #L-102</span>
                </div>
              </div>

              {/* Sample Card 2: Lost Item */}
              <div className="showcase-card showcase-lost">
                <div className="showcase-header">
                  <span className="badge badge-lost">
                    <span className="badge-dot" /> Lost Item
                  </span>
                  <span className="showcase-time">Yesterday</span>
                </div>
                <h4 className="showcase-title">Student ID Card & Dorm Keys</h4>
                <div className="showcase-meta">
                  <MapPin size={14} />
                  <span>Dining Hall / Science Quad</span>
                </div>
                <div className="showcase-status">
                  <Clock size={13} />
                  <span>Open for community claims</span>
                </div>
              </div>

              {/* Sample Card 3: Recovery Badge */}
              <div className="showcase-recovery-pill">
                <div className="recovery-avatar">
                  <CheckCircle size={20} className="recovery-icon" />
                </div>
                <div className="recovery-text">
                  <span className="recovery-title">Secure Match Confirmed</span>
                  <span className="recovery-sub">Verified at Campus Security Hub</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURES SECTION */}
      <section className="features-section" id="features">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-eyebrow">Key Capabilities</span>
            <h2 className="section-title">Built for Modern Campus Needs</h2>
            <p className="section-subtitle">
              LostLink connects students, staff, and campus security into a coordinated network to maximize the recovery rate of lost property.
            </p>
          </div>

          <div className="features-grid">
            {/* Feature 1 */}
            <div className="feature-card card">
              <div className="feature-icon-wrapper icon-lost">
                <FileQuestion size={24} />
              </div>
              <h3 className="feature-card-title">Report Lost Items</h3>
              <p className="feature-card-desc">
                Log detailed lost reports in seconds with campus locations, timestamps, and item characteristics for fast retrieval.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="feature-card card">
              <div className="feature-icon-wrapper icon-found">
                <PlusCircle size={24} />
              </div>
              <h3 className="feature-card-title">Report Found Items</h3>
              <p className="feature-card-desc">
                Found a misplaced item? Record its handoff details or drop-off location at designated campus security stations.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="feature-card card">
              <div className="feature-icon-wrapper icon-ai">
                <Sparkles size={24} />
              </div>
              <h3 className="feature-card-title">Smart AI Matching</h3>
              <p className="feature-card-desc">
                Intelligent NLP algorithms compare lost descriptions against turned-in items, identifying high-confidence matches instantly.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="feature-card card">
              <div className="feature-icon-wrapper icon-claim">
                <ShieldCheck size={24} />
              </div>
              <h3 className="feature-card-title">Secure Ownership Claims</h3>
              <p className="feature-card-desc">
                Prevent false handovers with structured ownership verification, secret distinguishing marks, and student ID checks.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="feature-card card">
              <div className="feature-icon-wrapper icon-track">
                <Layers size={24} />
              </div>
              <h3 className="feature-card-title">Track Item Recovery</h3>
              <p className="feature-card-desc">
                Monitor status updates from initial report through security inspection and final physical pickup at the campus center.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="how-it-works-section" id="how-it-works">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-eyebrow">Simple 4-Step Process</span>
            <h2 className="section-title">How LostLink Works</h2>
            <p className="section-subtitle">
              From loss to recovery, follow a streamlined four-step path designed for transparency and security.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number-bubble">01</div>
              <div className="step-card-content">
                <h4 className="step-title">Report an Item</h4>
                <p className="step-desc">
                  Report a lost or found item with location, date, and distinguishing descriptors.
                </p>
              </div>
            </div>

            <div className="step-card">
              <div className="step-number-bubble">02</div>
              <div className="step-card-content">
                <h4 className="step-title">Discover Matches</h4>
                <p className="step-desc">
                  Discover potential matches through real-time directory search and AI similarity ranking.
                </p>
              </div>
            </div>

            <div className="step-card">
              <div className="step-number-bubble">03</div>
              <div className="step-card-content">
                <h4 className="step-title">Submit a Claim</h4>
                <p className="step-desc">
                  Submit an ownership claim specifying unique identifiers only the true owner would know.
                </p>
              </div>
            </div>

            <div className="step-card">
              <div className="step-number-bubble">04</div>
              <div className="step-card-content">
                <h4 className="step-title">Verify & Recover</h4>
                <p className="step-desc">
                  Verify ownership at the campus helpdesk with your student ID and recover your item.
                </p>
              </div>
            </div>
          </div>

          <div className="steps-cta-wrapper">
            <Link to="/items">
              <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
                Explore Campus Directory
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. TRUST & SECURITY SECTION */}
      <section className="trust-section" id="about">
        <div className="container trust-container">
          <div className="trust-content">
            <span className="section-eyebrow">Trust & Integrity</span>
            <h2 className="section-title">Campus-Grade Privacy & Responsible Recovery</h2>
            <p className="trust-lead">
              LostLink helps members of the Anurag University campus community report, discover, and recover lost belongings.
            </p>

            <div className="trust-points-list">
              <div className="trust-point">
                <div className="point-icon-box">
                  <Lock size={20} />
                </div>
                <div>
                  <h4 className="point-title">Privacy by Design</h4>
                  <p className="point-desc">
                    Personal contact details and student IDs are never published openly. Communication happens safely through the verified portal.
                  </p>
                </div>
              </div>

              <div className="trust-point">
                <div className="point-icon-box">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="point-title">Responsible Ownership Claims</h4>
                  <p className="point-desc">
                    Claims require specific verification marks. Fraudulent attempts are flagged and tied to authenticated campus accounts.
                  </p>
                </div>
              </div>

              <div className="trust-point">
                <div className="point-icon-box">
                  <Award size={20} />
                </div>
                <div>
                  <h4 className="point-title">Secure Campus Helpdesk Handover</h4>
                  <p className="point-desc">
                    Valuables such as laptops, wallets, and keys can be securely dropped off and collected at authorized Anurag University security desks.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="trust-card-panel card">
            <div className="trust-panel-badge">
              <Users size={16} />
              <span>Campus Community Guidelines</span>
            </div>
            <h3 className="trust-panel-title">Found an item on campus?</h3>
            <p className="trust-panel-body">
              Help your fellow classmates by logging it immediately or bringing it to the Anurag University Security Hub or Student Affairs Reception.
            </p>

            <div className="trust-panel-actions">
              <Button
                variant="teal"
                size="md"
                icon={PlusCircle}
                onClick={handleReportClick}
                className="w-full"
              >
                Log a Found Item
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
