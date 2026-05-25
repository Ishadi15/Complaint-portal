import React, { useState } from 'react';
import { saveReporter } from '../services/api';
import { FaUser, FaUserSecret, FaArrowRight, FaEnvelope, FaPhone, FaBan } from 'react-icons/fa';

/* ── helpers ─────────────────────────────────────────── */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Sri Lankan phone: +94 7X XXX XXXX or 07X XXX XXXX (10 digits local, 12 with country code)
const PHONE_RE = /^(?:\+94\s?7[0-9]\s?\d{3}\s?\d{4}|07[0-9]\s?\d{3}\s?\d{4})$/;

function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <p style={{
      color: '#dc2626',
      fontSize: '0.8rem',
      fontWeight: '600',
      marginTop: '5px',
      display: 'flex',
      alignItems: 'center',
      gap: '5px'
    }}>
      <span style={{ fontSize: '1rem' }}>⚠</span> {msg}
    </p>
  );
}

/* ── component ───────────────────────────────────────── */
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

  // Track touched fields and errors separately
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const isAnonymous = formData.submission_type === 'Anonymous';

  /* ── validation logic ──────────────────────────────── */
  const validate = (data, anon) => {
    const errs = {};
    if (!data.reporter_category)
      errs.reporter_category = 'Required, please fill this field';

    if (!anon) {
      if (!data.full_name?.trim())
        errs.full_name = 'Required, please fill this field';
      if (!data.email?.trim())
        errs.email = 'Required, please fill this field';
      else if (!EMAIL_RE.test(data.email.trim()))
        errs.email = 'Please enter a valid email address (e.g. name@example.com)';
      if (data.phone && !PHONE_RE.test(data.phone.trim()))
        errs.phone = 'Please enter a valid Sri Lankan phone number (e.g. +94 77 123 4567 or 077 123 4567)';
    }
    return errs;
  };

  /* ── handlers ──────────────────────────────────────── */
  const handleChange = e => {
    const { name, value } = e.target;

    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'submission_type' && value === 'Anonymous') {
        updated.full_name = '';
        updated.employee_id = '';
        updated.email = '';
        updated.phone = '';
        updated.preferred_contact = '';
      }
      // Re-validate the changed field immediately (if it was already touched)
      if (touched[name]) {
        const errs = validate(updated, value === 'Anonymous' || (name !== 'submission_type' && prev.submission_type === 'Anonymous'));
        setErrors(errs);
      }
      return updated;
    });
  };

  const handleBlur = e => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(validate(formData, isAnonymous));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    // Mark all relevant fields as touched
    setTouched({ reporter_category: true, full_name: true, email: true, phone: true });
    const errs = validate(formData, isAnonymous);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return; // stop — show errors

    try {
      const payload = { ...formData };
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

  /* ── shared field props to attach blur handler ─────── */
  const field = name => ({
    name,
    onBlur: handleBlur,
    onChange: handleChange
  });

  /* ── input style — red border when error ────────────── */
  const inputStyle = () => ({});

  /* ── render ─────────────────────────────────────────── */
  return (
    <form onSubmit={handleSubmit} className="standard-form" noValidate>
      <h2>Reporter Information</h2>

      {/* ── Submission Type (standard radio buttons) ── */}
      <label style={{ marginBottom: '8px' }}>
        Submission Type <span style={{ color: '#dc2626' }}>*</span>
      </label>
      <div style={{ display: 'flex', gap: '28px', marginBottom: '20px', marginTop: '6px' }}>
        <label style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          cursor: 'pointer', fontSize: '0.95rem', fontWeight: 600, color: '#1e293b'
        }}>
          <input type="radio" {...field('submission_type')} value="Named"
            checked={formData.submission_type === 'Named'}
            style={{ width: '18px', height: '18px', accentColor: '#0057b8', cursor: 'pointer' }} />
          <FaUser style={{ color: formData.submission_type === 'Named' ? '#0057b8' : '#94a3b8', fontSize: '0.95rem' }} />
          Named
        </label>

        <label style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          cursor: 'pointer', fontSize: '0.95rem', fontWeight: 600, color: '#1e293b'
        }}>
          <input type="radio" {...field('submission_type')} value="Anonymous"
            checked={isAnonymous}
            style={{ width: '18px', height: '18px', accentColor: '#0057b8', cursor: 'pointer' }} />
          <FaUserSecret style={{ color: isAnonymous ? '#0057b8' : '#94a3b8', fontSize: '0.95rem' }} />
          Anonymous
        </label>
      </div>

      {isAnonymous && (
        <div style={{
          background: 'rgba(250,205,5,0.08)', border: '1px solid rgba(250,205,5,0.4)',
          borderRadius: '10px', padding: '12px 18px', marginBottom: '10px',
          fontSize: '0.85rem', color: '#b45309', display: 'flex', alignItems: 'center', gap: '10px'
        }}>
          <FaUserSecret style={{ flexShrink: 0 }} />
          Anonymous mode: personal identity fields are disabled and will not be recorded.
        </div>
      )}

      {/* ── Reporter Category ────────────────────────── */}
      <label>Reporter Category <span style={{ color: '#dc2626' }}>*</span></label>
      <select {...field('reporter_category')} value={formData.reporter_category}
        style={inputStyle('reporter_category')} required>
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
      <FieldError msg={touched.reporter_category && errors.reporter_category} />

      {/* ── Full Name ────────────────────────────────── */}
      <label style={{ marginTop: '15px' }}>
        Full Name{' '}
        {!isAnonymous
          ? <span style={{ color: '#dc2626' }}>*</span>
          : <span style={{ color: '#000000', fontWeight: 400, fontSize: '0.8rem' }}> (disabled – Anonymous)</span>}
      </label>
      <input type="text" {...field('full_name')} value={formData.full_name}
        placeholder={isAnonymous ? 'Not applicable for Anonymous submissions' : 'Full legal name'}
        disabled={isAnonymous}
        style={{ ...inputStyle('full_name'), ...(isAnonymous ? { background: '#f1f5f9', color: '#000000', cursor: 'not-allowed' } : {}) }} />
      <FieldError msg={!isAnonymous && touched.full_name && errors.full_name} />

      {/* ── Employee ID + Division ───────────────────── */}
      <div className="form-row" style={{ marginTop: '0' }}>
        <div>
          <label>
            Employee / Staff ID
            {isAnonymous
              ? <span style={{ color: '#000000', fontWeight: 400, fontSize: '0.8rem' }}> (disabled)</span>
              : <span style={{ color: '#000000', fontWeight: 400, fontSize: '0.8rem' }}> (if applicable)</span>}
          </label>
          <input type="text" {...field('employee_id')} value={formData.employee_id}
            placeholder={isAnonymous ? 'N/A' : 'e.g. SLT-12345'} disabled={isAnonymous}
            style={isAnonymous ? { background: '#f1f5f9', color: '#000000', cursor: 'not-allowed' } : {}} />
        </div>
        <div>
          <label>
            Division / Department
            <span style={{ color: '#000000', fontWeight: 400, fontSize: '0.8rem' }}> (if applicable)</span>
          </label>
          <input type="text" {...field('division')} value={formData.division}
            placeholder="e.g. Finance, IT, Operations" />
        </div>
      </div>

      {/* ── Designation ─────────────────────────────── */}
      <label>
        Designation
        <span style={{ color: '#000000', fontWeight: 400, fontSize: '0.8rem' }}> (if applicable)</span>
      </label>
      <input type="text" {...field('designation')} value={formData.designation}
        placeholder="e.g. Senior Manager, Engineer" />

      {/* ── Email + Phone ────────────────────────────── */}
      <div className="form-row" style={{ marginTop: '0' }}>
        <div>
          <label>
            Contact Email Address{' '}
            {!isAnonymous
              ? <span style={{ color: '#dc2626' }}>*</span>
              : <span style={{ color: '#000000', fontWeight: 400, fontSize: '0.8rem' }}> (disabled)</span>}
          </label>
          <input type="email" {...field('email')} value={formData.email}
            placeholder={isAnonymous ? 'N/A' : 'your.email@sltmobitel.lk'}
            disabled={isAnonymous}
            style={{ ...inputStyle('email'), ...(isAnonymous ? { background: '#f1f5f9', color: '#000000', cursor: 'not-allowed' } : {}) }} />
          {!isAnonymous && (
            <p style={{ fontSize: '0.75rem', color: '#000000', marginTop: '4px' }}>
              Used for CRN acknowledgement and follow-up.
            </p>
          )}
          <FieldError msg={!isAnonymous && touched.email && errors.email} />
        </div>
        <div>
          <label>
            Contact Telephone
            {isAnonymous
              ? <span style={{ color: '#000000', fontWeight: 400, fontSize: '0.8rem' }}> (disabled)</span>
              : <span style={{ color: '#000000', fontWeight: 400, fontSize: '0.8rem' }}> (optional)</span>}
          </label>
          <input type="tel" {...field('phone')} value={formData.phone}
            placeholder={isAnonymous ? 'N/A' : '+94 77 XXX XXXX'}
            disabled={isAnonymous}
            style={{ ...inputStyle('phone'), ...(isAnonymous ? { background: '#f1f5f9', color: '#000000', cursor: 'not-allowed' } : {}) }} />
          {!isAnonymous && (
            <p style={{ fontSize: '0.75rem', color: '#000000', marginTop: '4px' }}>
              Sri Lankan format: +94 7X XXX XXXX or 07X XXX XXXX
            </p>
          )}
          <FieldError msg={!isAnonymous && touched.phone && errors.phone} />
        </div>
      </div>

      {/* ── Preferred Contact Method ─────────────────── */}
      <label style={{ marginTop: '15px' }}>
        Preferred Contact Method
        {isAnonymous
          ? <span style={{ color: '#000000', fontWeight: 400, fontSize: '0.8rem' }}> (disabled)</span>
          : <span style={{ color: '#000000', fontWeight: 400, fontSize: '0.8rem' }}> (optional)</span>}
      </label>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '8px' }}>
        {[
          { value: 'Email', label: 'Email', icon: <FaEnvelope /> },
          { value: 'Phone', label: 'Phone', icon: <FaPhone /> },
          { value: 'No contact preferred', label: 'No Contact Preferred', icon: <FaBan /> }
        ].map(opt => (
          <label key={opt.value} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', borderRadius: '50px',
            border: `2px solid ${formData.preferred_contact === opt.value ? '#0057b8' : '#e2e8f0'}`,
            background: formData.preferred_contact === opt.value ? '#0057b8' : '#f8fafc',
            color: formData.preferred_contact === opt.value ? '#fff' : '#334155',
            fontWeight: 600, fontSize: '0.88rem',
            cursor: isAnonymous ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s', opacity: isAnonymous ? 0.5 : 1
          }}>
            <input type="radio" name="preferred_contact" value={opt.value}
              checked={formData.preferred_contact === opt.value}
              onChange={handleChange} disabled={isAnonymous} style={{ display: 'none' }} />
            {opt.icon} {opt.label}
          </label>
        ))}
      </div>

      {/* ── Submit ───────────────────────────────────── */}
      <div className="form-actions right" style={{ marginTop: '35px' }}>
        <button type="submit" className="btn-primary">
          Continue <FaArrowRight className="btn-icon-right" />
        </button>
      </div>
    </form>
  );
}

export default ReporterForm;
