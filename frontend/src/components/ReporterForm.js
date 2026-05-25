import React, { useState } from 'react';
import { saveReporter } from '../services/api';
import { FaUser, FaUserSecret, FaArrowRight, FaEnvelope, FaPhone, FaBan } from 'react-icons/fa';

function ReporterForm({ onNext }) {
  const [formData, setFormData] = useState({
    submission_type: 'Named',
    reporter_category: '',
    full_name: '',
    employee_id: '',
    division: '',
    designation: '',
    email: '',
    phone: '',
    preferred_contact: ''
  });

  const isAnonymous = formData.submission_type === 'Anonymous';

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      // Clear personal fields when switching to Anonymous
      if (name === 'submission_type' && value === 'Anonymous') {
        updated.full_name = '';
        updated.employee_id = '';
        updated.email = '';
        updated.phone = '';
        updated.preferred_contact = '';
      }
      return updated;
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      // For anonymous submissions, strip personal fields before sending
      if (isAnonymous) {
        payload.full_name = '';
        payload.employee_id = '';
        payload.email = '';
        payload.phone = '';
        payload.preferred_contact = '';
      }
      const res = await saveReporter(payload);
      onNext(res.data);
    } catch (error) {
      console.error('Reporter form error:', error.response?.data || error.message);
      alert('Error saving reporter details: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="standard-form">
      <h2>Reporter Information</h2>
      <p className="form-subtitle">
        Section 1 of 5 — Help us identify how to handle your submission securely.
        Fields marked <span style={{ color: '#dc2626', fontWeight: 700 }}>*</span> are required.
      </p>

      {/* ── Submission Type ── */}
      <label style={{ marginBottom: '8px' }}>
        Submission Type <span style={{ color: '#dc2626' }}>*</span>
      </label>
      <div className="radio-group-grid">
        <label className={`radio-card ${formData.submission_type === 'Named' ? 'active-named' : ''}`}>
          <input
            type="radio"
            name="submission_type"
            value="Named"
            checked={formData.submission_type === 'Named'}
            onChange={handleChange}
            style={{ display: 'none' }}
          />
          <FaUser className="radio-icon named-icon" />
          <span className="radio-title">Named</span>
          <span className="radio-desc">Standard identified report</span>
        </label>

        <label className={`radio-card ${isAnonymous ? 'active-anonymous' : ''}`}>
          <input
            type="radio"
            name="submission_type"
            value="Anonymous"
            checked={isAnonymous}
            onChange={handleChange}
            style={{ display: 'none' }}
          />
          <FaUserSecret className="radio-icon anon-icon" />
          <span className="radio-title">Anonymous</span>
          <span className="radio-desc">Private confidential report</span>
        </label>
      </div>

      {isAnonymous && (
        <div style={{
          background: 'rgba(250, 205, 5, 0.08)',
          border: '1px solid rgba(250, 205, 5, 0.4)',
          borderRadius: '10px',
          padding: '12px 18px',
          marginBottom: '10px',
          fontSize: '0.85rem',
          color: '#b45309',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <FaUserSecret style={{ flexShrink: 0 }} />
          Anonymous mode: personal identity fields are disabled and will not be recorded.
        </div>
      )}

      {/* ── Reporter Category ── */}
      <label>
        Reporter Category <span style={{ color: '#dc2626' }}>*</span>
      </label>
      <select
        name="reporter_category"
        value={formData.reporter_category}
        onChange={handleChange}
        required
      >
        <option value="">— Select Category —</option>
        <option value="Employee - SLT">Employee – SLT</option>
        <option value="Employee - Mobitel">Employee – Mobitel</option>
        <option value="Employee - SLTS">Employee – SLTS</option>
        <option value="Vendor / Supplier">Vendor / Supplier</option>
        <option value="Contractor">Contractor</option>
        <option value="Customer">Customer</option>
        <option value="Shareholder / Investor">Shareholder / Investor</option>
        <option value="General Public">General Public</option>
        <option value="Other">Other</option>
      </select>

      {/* ── Full Name ── */}
      <label style={{ marginTop: '15px' }}>
        Full Name{' '}
        {!isAnonymous && <span style={{ color: '#dc2626' }}>*</span>}
        {isAnonymous && <span style={{ color: '#94a3b8', fontWeight: 400, fontSize: '0.8rem' }}> (disabled – Anonymous)</span>}
      </label>
      <input
        type="text"
        name="full_name"
        value={formData.full_name}
        onChange={handleChange}
        placeholder={isAnonymous ? 'Not applicable for Anonymous submissions' : 'Full legal name'}
        disabled={isAnonymous}
        required={!isAnonymous}
        style={isAnonymous ? { background: '#f1f5f9', color: '#94a3b8', cursor: 'not-allowed' } : {}}
      />

      {/* ── Employee ID and Division ── */}
      <div className="form-row" style={{ marginTop: '0' }}>
        <div>
          <label>
            Employee / Staff ID
            {isAnonymous && <span style={{ color: '#94a3b8', fontWeight: 400, fontSize: '0.8rem' }}> (disabled)</span>}
            {!isAnonymous && <span style={{ color: '#64748b', fontWeight: 400, fontSize: '0.8rem' }}> (if applicable)</span>}
          </label>
          <input
            type="text"
            name="employee_id"
            value={formData.employee_id}
            onChange={handleChange}
            placeholder={isAnonymous ? 'N/A' : 'e.g. SLT-12345'}
            disabled={isAnonymous}
            style={isAnonymous ? { background: '#f1f5f9', color: '#94a3b8', cursor: 'not-allowed' } : {}}
          />
        </div>
        <div>
          <label>
            Division / Department
            <span style={{ color: '#64748b', fontWeight: 400, fontSize: '0.8rem' }}> (if applicable)</span>
          </label>
          <input
            type="text"
            name="division"
            value={formData.division}
            onChange={handleChange}
            placeholder="e.g. Finance, IT, Operations"
          />
        </div>
      </div>

      {/* ── Designation ── */}
      <label>
        Designation
        <span style={{ color: '#64748b', fontWeight: 400, fontSize: '0.8rem' }}> (if applicable)</span>
      </label>
      <input
        type="text"
        name="designation"
        value={formData.designation}
        onChange={handleChange}
        placeholder="e.g. Senior Manager, Engineer"
      />

      {/* ── Contact Email and Phone ── */}
      <div className="form-row" style={{ marginTop: '0' }}>
        <div>
          <label>
            Contact Email Address{' '}
            {!isAnonymous && <span style={{ color: '#dc2626' }}>*</span>}
            {isAnonymous && <span style={{ color: '#94a3b8', fontWeight: 400, fontSize: '0.8rem' }}> (disabled)</span>}
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={isAnonymous ? 'N/A' : 'your.email@sltmobitel.lk'}
            disabled={isAnonymous}
            required={!isAnonymous}
            style={isAnonymous ? { background: '#f1f5f9', color: '#94a3b8', cursor: 'not-allowed' } : {}}
          />
          {!isAnonymous && (
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
              Used for CRN acknowledgement and follow-up.
            </p>
          )}
        </div>
        <div>
          <label>
            Contact Telephone
            {isAnonymous && <span style={{ color: '#94a3b8', fontWeight: 400, fontSize: '0.8rem' }}> (disabled)</span>}
            {!isAnonymous && <span style={{ color: '#64748b', fontWeight: 400, fontSize: '0.8rem' }}> (optional)</span>}
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder={isAnonymous ? 'N/A' : '+94 77 XXX XXXX'}
            disabled={isAnonymous}
            style={isAnonymous ? { background: '#f1f5f9', color: '#94a3b8', cursor: 'not-allowed' } : {}}
          />
          {!isAnonymous && (
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
              International format accepted.
            </p>
          )}
        </div>
      </div>

      {/* ── Preferred Contact Method ── */}
      <label style={{ marginTop: '15px' }}>
        Preferred Contact Method
        {isAnonymous && <span style={{ color: '#94a3b8', fontWeight: 400, fontSize: '0.8rem' }}> (disabled)</span>}
        {!isAnonymous && <span style={{ color: '#64748b', fontWeight: 400, fontSize: '0.8rem' }}> (optional)</span>}
      </label>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '8px' }}>
        {[
          { value: 'Email', label: 'Email', icon: <FaEnvelope /> },
          { value: 'Phone', label: 'Phone', icon: <FaPhone /> },
          { value: 'No contact preferred', label: 'No Contact Preferred', icon: <FaBan /> }
        ].map(opt => (
          <label
            key={opt.value}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '50px',
              border: `2px solid ${formData.preferred_contact === opt.value ? '#0057b8' : '#e2e8f0'}`,
              background: formData.preferred_contact === opt.value ? '#0057b8' : '#f8fafc',
              color: formData.preferred_contact === opt.value ? '#fff' : '#334155',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: isAnonymous ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              opacity: isAnonymous ? 0.5 : 1
            }}
          >
            <input
              type="radio"
              name="preferred_contact"
              value={opt.value}
              checked={formData.preferred_contact === opt.value}
              onChange={handleChange}
              disabled={isAnonymous}
              style={{ display: 'none' }}
            />
            {opt.icon}
            {opt.label}
          </label>
        ))}
      </div>

      <div className="form-actions right" style={{ marginTop: '35px' }}>
        <button type="submit" className="btn-primary">
          Continue
          <FaArrowRight className="btn-icon-right" />
        </button>
      </div>
    </form>
  );
}

export default ReporterForm;
