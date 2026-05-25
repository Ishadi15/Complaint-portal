import React, { useState } from 'react';
import CoverPage from '../components/CoverPage';
import ReporterForm from '../components/ReporterForm';
import ComplaintForm from '../components/ComplaintForm';
import SubjectForm from '../components/SubjectForm';
import EvidenceForm from '../components/EvidenceForm';
import DeclarationForm from '../components/DeclarationForm';
import Confirmation from '../components/Confirmation';
import TrackComplaint from '../components/TrackComplaint';
import AdminLogin from '../components/AdminLogin';
import AdminDashboard from '../components/AdminDashboard';
import { FaMoon, FaEnvelope, FaPhoneAlt, FaLock } from 'react-icons/fa';
import '../components/CoverPage.css';

function Portal() {
  const [step, setStep] = useState(0);
  const [complaintId, setComplaintId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const nextStep = (id) => {
    if (id) setComplaintId(id);
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const goToTrack = () => setStep(10);
  const goToHome = () => { setStep(0); setIsAdmin(false); };
  const goToAdminLogin = () => setStep(20);
  const onAdminLoginSuccess = () => { setIsAdmin(true); setStep(21); };
  const onAdminLogout = () => { localStorage.removeItem('adminToken'); setIsAdmin(false); setStep(0); };

  const TOTAL_STEPS = 5;

  return (
    <div className="cover-page-wrapper" style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
      {/* Header (Top Navigation Bar) */}
      <header className="navbar-portal">
        <div className="nav-left" onClick={goToHome} style={{ cursor: 'pointer' }}>
          <img src="/logo_mobitel.png" alt="SLTMOBITEL Logo" className="nav-logo-portal" />
        </div>

        <div className="nav-right">
          {step === 0 && (
            <nav className="nav-menu-portal">
              <a href="#home" className="nav-link-portal">Home</a>
              <a href="#track" className="nav-link-portal" onClick={goToTrack}>Track</a>
              <a href="#admin" onClick={(e) => { e.preventDefault(); goToAdminLogin(); }} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                color: '#0057b8',
                background: '#f1f5f9',
                padding: '12px 40px',
                borderRadius: '50px',
                fontSize: '1rem',
                fontWeight: '700',
                border: '1px solid #e2e8f0',
                transition: 'all 0.3s'
              }} className="nav-admin-btn">
                <FaLock style={{ fontSize: '0.9rem' }} /> Admin Access
              </a>
            </nav>
          )}

          <div className="nav-controls">
            {step === 21 && (
              <span style={{ color: '#0057b8', fontWeight: '700', marginRight: '15px' }}>Admin Mode</span>
            )}
            <div className="theme-toggle" style={{ cursor: 'pointer' }}>
              <FaMoon />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: (step > 0 && step < 10) ? '40px 20px' : '0' }}>
        {/* Step Indicator — dynamic "Step X of 5" label only */}
        {step > 0 && step < 6 && (
          <div style={{ maxWidth: '1400px', margin: '0 auto 18px', display: 'flex', justifyContent: 'flex-end' }}>
            <span style={{
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '50px',
              padding: '6px 20px',
              color: '#ffffff',
              fontWeight: '700',
              fontSize: '0.9rem',
              letterSpacing: '0.5px'
            }}>
              Step {step} of 5
            </span>
          </div>
        )}

        {/* Dynamic Component Rendering — wider 1280px container for form steps */}
        <div style={(step > 0 && step < 7) ? { maxWidth: '1400px', margin: '0 auto', width: '100%' } : {}}>
          {step === 0 && <CoverPage onStart={() => setStep(1)} onTrack={goToTrack} />}
          {step === 1 && <ReporterForm onNext={(data) => nextStep(data.id)} />}
          {step === 2 && <ComplaintForm onNext={nextStep} prevStep={prevStep} complaintId={complaintId} />}
          {step === 3 && <SubjectForm onNext={nextStep} prevStep={prevStep} complaintId={complaintId} />}
          {step === 4 && <EvidenceForm onNext={nextStep} prevStep={prevStep} complaintId={complaintId} />}
          {step === 5 && <DeclarationForm onNext={nextStep} prevStep={prevStep} complaintId={complaintId} />}
          {step === 6 && <Confirmation complaintId={complaintId} />}
          {step === 10 && <TrackComplaint onBack={goToHome} />}
          {step === 20 && <AdminLogin onLoginSuccess={onAdminLoginSuccess} onBack={goToHome} />}
          {step === 21 && <AdminDashboard onLogout={onAdminLogout} />}
        </div>
      </div>

      {/* Footer */}
      <footer id="contact" className="footer-portal">
        <div className="footer-content">
          <div className="footer-brand">
            <h2>SLT<span>MOBITEL</span></h2>
            <p>Internal Affairs Unit</p>
            <p style={{ marginTop: '20px', fontSize: '0.9rem' }}>
              Strengthening integrity and transparency across our organization.
            </p>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#about">About IAU</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Use</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Contact Us</h4>
            <ul>
              <li><FaEnvelope style={{ marginRight: '10px' }} /> iau@sltmobitel.lk</li>
              <li><FaPhoneAlt style={{ marginRight: '10px' }} /> +94 11 234 5678</li>
              <li>IAU Headquarters, Colombo, Sri Lanka</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} SLTMOBITEL Internal Affairs Unit. All Rights Reserved.</p>
          <div className="footer-legal">
            <a href="#privacy" style={{ marginRight: '20px' }}>Privacy Policy</a>
            <a href="#terms">Terms of Use</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Portal;
