import React, { useState } from 'react';
import { FaShieldAlt, FaBolt, FaUserSecret, FaArrowRight, FaFileAlt, FaCheckCircle, FaBuilding, FaLock, FaCertificate, FaChevronDown, FaChevronUp } from 'react-icons/fa';

function Landing({ onStart }) {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "Can I report anonymously?",
      answer: "Yes. You may choose to submit your complaint as an anonymous reporter. In that case, no personally identifiable information is required or recorded. Your identity will never be disclosed to the subject of the complaint or any third party."
    },
    {
      question: "What happens after submission?",
      answer: "Once submitted, your complaint is encrypted and securely forwarded to the Internal Affairs Unit (IAU). You will receive a unique Complaint Reference Number (CRN). The IAU will review the report, conduct a preliminary assessment, and initiate a formal investigation if warranted. You can monitor progress using your CRN."
    },
    {
      question: "Can I upload evidence?",
      answer: "Yes. The portal supports uploading supporting documents, images (JPG/PNG), and video files (MP4) up to 25 MB per file. Evidence such as financial records, emails, screenshots, or photographs significantly strengthens the investigation process."
    },
    {
      question: "How do I track my complaint?",
      answer: "Click the <strong>\"Track Complaint\"</strong> button on the home page and enter your Complaint Reference Number (CRN). The system will display the current status of your case — whether it is Under Review, In Progress, or Resolved — in real time."
    }
  ];

  return (
    <div style={{ animation: 'slideUp 0.8s ease', display: 'flex', flexDirection: 'column', gap: '40px' }}>
      
      {/* Hero Section / Cover Page */}
      <div style={{
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(30px)',
        borderRadius: '30px',
        padding: '40px',
        margin: '0 auto',
        width: '100%',
        boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        border: '1px solid var(--glass-border)',
        display: 'flex',
        alignItems: 'center',
        gap: '50px',
        flexWrap: 'wrap'
      }}>
        {/* Left Side: Text Content */}
        <div style={{ flex: '1 1 400px', padding: '10px' }}>
          
          <h1 style={{ 
            fontSize: '2.5rem', 
            color: '#f8fafc', 
            marginBottom: '15px',
            lineHeight: '1.2',
            fontWeight: '800',
            letterSpacing: '-0.5px'
          }}>
            Internal Affairs Unit (IAU) <br />
            <span style={{ background: 'linear-gradient(to right, var(--slt-light-blue), var(--slt-green))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '2rem' }}>
              Complaint & Concern Reporting Portal
            </span>
          </h1>

          <p style={{ fontSize: '0.95rem', color: '#94a3b8', marginBottom: '20px', lineHeight: '1.6' }}>
            This portal operates in coordination with CIABOC and within the framework of the Anti-Corruption Act, Public Property Act, and the Penal Code to strengthen public sector integrity. All data is vaulted behind military-grade encryption.
          </p>

          {/* BOX DETAILS for Specifications */}
          <div style={{
            background: 'rgba(0, 174, 239, 0.05)',
            border: '1px solid rgba(0, 174, 239, 0.2)',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '25px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px',
            boxShadow: 'inset 0 0 20px rgba(0, 174, 239, 0.05)'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--slt-light-blue)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '1px', marginBottom: '4px' }}>Document Ref</div>
              <div style={{ fontSize: '0.85rem', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '6px' }}><FaFileAlt /> SLT-AU-PORTAL-SPEC-001</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--slt-light-blue)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '1px', marginBottom: '4px' }}>Classification</div>
              <div style={{ fontSize: '0.85rem', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '6px' }}><FaShieldAlt style={{ color: 'var(--slt-green)' }}/> CONFIDENTIAL</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--slt-light-blue)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '1px', marginBottom: '4px' }}>Authority</div>
              <div style={{ fontSize: '0.85rem', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '6px' }}><FaCheckCircle /> CEO Circular No. 23/2026</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--slt-light-blue)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '1px', marginBottom: '4px' }}>Prepared By</div>
              <div style={{ fontSize: '0.85rem', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '6px' }}><FaBuilding /> IAU - SLTMobitel</div>
            </div>
          </div>

          <button onClick={onStart} style={{ padding: '14px 32px', fontSize: '0.95rem', borderRadius: '12px', margin: 0, boxShadow: '0 8px 25px rgba(0, 174, 239, 0.4)' }}>
            Proceed to Report
            <FaArrowRight style={{ marginLeft: '10px' }} />
          </button>
        </div>
        
        {/* Right Side: Cover Image */}
        <div style={{ flex: '1 1 350px', textAlign: 'center', position: 'relative' }}>
           <img 
              src="/cover_image.png" 
              alt="Secure Corporate Portal" 
              style={{ 
                width: '100%', 
                maxWidth: '450px', 
                borderRadius: '24px', 
                filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.6))', 
                animation: 'float 6s ease-in-out infinite',
                border: '1px solid rgba(255,255,255,0.05)'
              }} 
            />
        </div>
      </div>

      {/* Trust Elements */}
      <div className="trust-badges">
        <div className="trust-badge">
          <FaLock style={{ color: 'var(--slt-light-blue)' }}/> AES-256 Encrypted
        </div>
        <div className="trust-badge">
          <FaCertificate style={{ color: 'var(--slt-green)' }}/> ISO 27001 Certified
        </div>
        <div className="trust-badge">
          <FaShieldAlt style={{ color: 'var(--slt-blue)' }}/> CIABOC Compliant
        </div>
      </div>

      {/* Features Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '25px',
        width: '100%'
      }}>
        
        {/* Feature 1 - Brand Green Accent */}
        <div style={{ background: 'var(--glass-bg)', padding: '35px 25px', borderRadius: '24px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', border: '1px solid var(--glass-border)', transition: 'all 0.4s ease', backdropFilter: 'blur(20px)' }} className="feature-card brand-green-card">
          <div style={{ background: 'linear-gradient(135deg, rgba(122, 193, 67, 0.1), rgba(122, 193, 67, 0.3))', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '1px solid rgba(122, 193, 67, 0.4)', boxShadow: 'var(--neon-glow-green)' }}>
            <FaUserSecret style={{ fontSize: '2.2rem', color: 'var(--slt-green)' }} />
          </div>
          <h3 style={{ color: '#f8fafc', marginBottom: '10px', fontSize: '1.2rem', fontWeight: '700' }}>100% Anonymous</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.5' }}>Submit reports without revealing your identity. Advanced routing protects your privacy completely.</p>
        </div>

        {/* Feature 2 - Brand Cyan Accent */}
        <div style={{ background: 'var(--glass-bg)', padding: '35px 25px', borderRadius: '24px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', border: '1px solid var(--glass-border)', transition: 'all 0.4s ease', backdropFilter: 'blur(20px)' }} className="feature-card brand-cyan-card">
          <div style={{ background: 'linear-gradient(135deg, rgba(0, 174, 239, 0.1), rgba(0, 174, 239, 0.3))', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '1px solid rgba(0, 174, 239, 0.4)', boxShadow: 'var(--neon-glow-blue)' }}>
            <FaBolt style={{ fontSize: '2.2rem', color: 'var(--slt-light-blue)' }} />
          </div>
          <h3 style={{ color: '#f8fafc', marginBottom: '10px', fontSize: '1.2rem', fontWeight: '700' }}>Fast Action</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.5' }}>Direct integration with the Internal Affairs Unit ensures immediate evaluation of your complaint.</p>
        </div>

        {/* Feature 3 - Brand Dark Blue/Gradient Accent */}
        <div style={{ background: 'var(--glass-bg)', padding: '35px 25px', borderRadius: '24px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', border: '1px solid var(--glass-border)', transition: 'all 0.4s ease', backdropFilter: 'blur(20px)' }} className="feature-card brand-blue-card">
          <div style={{ background: 'linear-gradient(135deg, rgba(0, 87, 184, 0.2), rgba(0, 45, 114, 0.5))', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '1px solid rgba(0, 87, 184, 0.4)', boxShadow: '0 0 20px rgba(0, 87, 184, 0.4)' }}>
            <FaShieldAlt style={{ fontSize: '2.2rem', color: '#60a5fa' }} />
          </div>
          <h3 style={{ color: '#f8fafc', marginBottom: '10px', fontSize: '1.2rem', fontWeight: '700' }}>Total Security</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.5' }}>All data and attached evidence are vaulted behind military-grade encryption standards.</p>
        </div>

      </div>

      {/* FAQ Section */}
      <div id="faq" style={{ marginTop: '40px' }}>
        <h2 className="section-title">Frequently Asked Questions</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                style={{ 
                  background: 'var(--glass-bg)', 
                  borderRadius: '10px', 
                  boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                  overflow: 'hidden',
                  border: '1px solid var(--glass-border)'
                }}
              >
                <div 
                  onClick={() => toggleFaq(index)}
                  style={{
                    padding: '20px 25px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    background: openFaq === index ? 'rgba(255,255,255,0.05)' : 'transparent',
                    transition: 'background 0.3s ease'
                  }}
                >
                  <h4 style={{ margin: 0, color: '#f8fafc', fontSize: '1.1rem', fontWeight: '600' }}>{faq.question}</h4>
                  {openFaq === index ? <FaChevronUp color="#94a3b8" /> : <FaChevronDown color="#94a3b8" />}
                </div>
                {openFaq === index && (
                  <div style={{ 
                    padding: '0 25px 25px 25px', 
                    color: '#cbd5e1', 
                    lineHeight: '1.6', 
                    fontSize: '0.95rem', 
                    background: 'rgba(255,255,255,0.05)',
                    borderTop: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    <div style={{ marginTop: '15px' }}>
                        <p dangerouslySetInnerHTML={{ __html: faq.answer }} style={{ margin: 0 }}></p>
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        .brand-green-card:hover {
          transform: translateY(-10px) scale(1.02);
          border-color: rgba(122, 193, 67, 0.5);
          box-shadow: 0 25px 50px rgba(0,0,0,0.6), 0 0 20px rgba(122, 193, 67, 0.15);
        }
        .brand-cyan-card:hover {
          transform: translateY(-10px) scale(1.02);
          border-color: rgba(0, 174, 239, 0.5);
          box-shadow: 0 25px 50px rgba(0,0,0,0.6), 0 0 20px rgba(0, 174, 239, 0.15);
        }
        .brand-blue-card:hover {
          transform: translateY(-10px) scale(1.02);
          border-color: rgba(0, 87, 184, 0.5);
          box-shadow: 0 25px 50px rgba(0,0,0,0.6), 0 0 20px rgba(0, 87, 184, 0.15);
        }
      `}</style>
    </div>
  );
}

export default Landing;

