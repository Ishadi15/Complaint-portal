import React from 'react';
import './CoverPage.css';
import { 
  FaShieldAlt, 
  FaFileSignature, 
  FaSearch, 
  FaUserSecret, 
  FaLock, 
  FaExclamationTriangle, 
  FaHandshake
} from 'react-icons/fa';

function CoverPage({ onStart, onTrack }) {
  return (
    <>

      {/* 2. Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Complaint & Concern <br />
            Reporting Portal
          </h1>
          <p className="hero-subtitle">
            A secure and confidential platform for employees, stakeholders, and the public to report bribery, corruption, fraud, misconduct, or other concerns to the Internal Affairs Unit (IAU).
          </p>
          <div className="hero-actions">
            <button className="btn-report" onClick={onStart}>
              <FaFileSignature /> Report a Complaint
            </button>
            <button className="btn-track" onClick={onTrack}>
              <FaSearch /> Track Complaint
            </button>
          </div>
        </div>

        <div className="hero-illustration-container">
          <img src="/security_illustration.png" alt="Secure Portal Illustration" className="hero-img" />
        </div>
      </section>

      {/* 3. Trust Information Cards */}
      <section className="trust-section">
        <div className="trust-card">
          <FaLock className="trust-icon" />
          <h3>Secure Encryption</h3>
          <p>Your data is protected with military-grade AES-256 encryption standards.</p>
        </div>
        <div className="trust-card">
          <FaUserSecret className="trust-icon" />
          <h3>100% Anonymous</h3>
          <p>You can choose to remain fully anonymous throughout the reporting process.</p>
        </div>
        <div className="trust-card">
          <FaShieldAlt className="trust-icon" />
          <h3>Privacy Protected</h3>
          <p>We adhere to strict data protection regulations to keep your identity safe.</p>
        </div>
        <div className="trust-card">
          <FaHandshake className="trust-icon" />
          <h3>IAU Integrity</h3>
          <p>Managed directly by the IAU to ensure impartial and fair investigations.</p>
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section id="how-it-works" className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">1</div>
            <h4>Reporter Info</h4>
            <p>Provide your details or choose to remain anonymous.</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h4>Complaint Details</h4>
            <p>Describe the incident and provide necessary context.</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h4>Add Evidence</h4>
            <p>Upload documents, images, or videos to support your claim.</p>
          </div>
          <div className="step-card">
            <div className="step-number">4</div>
            <h4>Declaration</h4>
            <p>Review your submission and sign the final declaration.</p>
          </div>
          <div className="step-card">
            <div className="step-number">5</div>
            <h4>Receive CRN</h4>
            <p>Get a unique reference number to track your case status.</p>
          </div>
        </div>
      </section>

      {/* 5. Important Notice / Warning Box */}
      <section className="warning-container">
        <div className="warning-box">
          <FaExclamationTriangle className="warning-icon" />
          <div className="warning-text">
            <p>IMPORTANT NOTICE: All submissions are handled with strict confidentiality. False or malicious reporting is a serious offense and may result in disciplinary action.</p>
          </div>
        </div>
      </section>

      {/* 6 & 7. About & FAQ Section */}
      <section className="info-section">
        <div id="about" className="about-unit">
          <h2>About the Internal Affairs Unit</h2>
          <p>
            The Internal Affairs Unit (IAU) is an independent body within SLTMOBITEL responsible for maintaining the highest standards of integrity. Our mission is to receive and review complaints related to corruption, fraud, abuse of authority, and misconduct, ensuring a transparent and accountable corporate environment.
          </p>
          <p style={{ marginTop: '15px' }}>
            We coordinate with national authorities including CIABOC to ensure compliance with the Anti-Corruption Act and other legal frameworks.
          </p>
        </div>
        
        <div id="faq" className="faq-preview">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-item">
            <h4>Can I report anonymously?</h4>
          </div>
          <div className="faq-item">
            <h4>What happens after submission?</h4>
          </div>
          <div className="faq-item">
            <h4>Can I upload evidence?</h4>
          </div>
          <div className="faq-item">
            <h4>How do I track my complaint?</h4>
          </div>
        </div>
      </section>

    </>
  );
}

export default CoverPage;
