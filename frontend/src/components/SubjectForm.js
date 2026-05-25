import React, { useState } from 'react';
import { saveSubject } from '../services/api';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';

/* ── helper ───────────────────────────────────────── */
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

function SubjectForm({ onNext, prevStep, complaintId }) {
  const [formData, setFormData] = useState({
    subject_name: '',
    subject_role: '',
    organisation: '',
    senior_involved: false
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  /* ── validation ─────────────────────────────────── */
  const validate = (data) => {
    const errs = {};
    if (!data.subject_name?.trim())
      errs.subject_name = 'Required, please fill this field';
    if (!data.subject_role?.trim())
      errs.subject_role = 'Required, please fill this field';
    if (!data.organisation)
      errs.organisation = 'Required, please fill this field';
    return errs;
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: type === 'checkbox' ? checked : value };
      if (touched[name]) {
        setErrors(validate(updated));
      }
      return updated;
    });
  };

  const handleBlur = e => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(validate(formData));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    // Mark all fields as touched
    setTouched({
      subject_name: true,
      subject_role: true,
      organisation: true
    });
    const errs = validate(formData);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      await saveSubject({ ...formData, id: complaintId });
      onNext();
    } catch (error) {
      alert("Error saving subject information.");
    }
  };

  /* ── input style — red border when error ──────── */
  const inputStyle = name => errors[name]
    ? { borderColor: '#dc2626', background: '#fff5f5' }
    : {};

  return (
    <form onSubmit={handleSubmit} className="standard-form" noValidate>
      <h2>Accused Information</h2>
      <p className="form-subtitle">
        Section 3 of 5 — Fields marked{' '}
        <span style={{ color: '#dc2626', fontWeight: 700 }}>*</span> are required.
      </p>

      <label>Name of Accused <span style={{ color: '#dc2626' }}>*</span></label>
      <input type="text" name="subject_name" placeholder="Full name"
        value={formData.subject_name} onChange={handleChange} onBlur={handleBlur}
        style={inputStyle('subject_name')} required />
      <FieldError msg={touched.subject_name && errors.subject_name} />

      <div className="form-row">
        <div>
          <label>Designation / Role <span style={{ color: '#dc2626' }}>*</span></label>
          <input type="text" name="subject_role" placeholder="e.g. Senior Manager"
            value={formData.subject_role} onChange={handleChange} onBlur={handleBlur}
            style={inputStyle('subject_role')} required />
          <FieldError msg={touched.subject_role && errors.subject_role} />
        </div>
        <div>
          <label>Organisation <span style={{ color: '#dc2626' }}>*</span></label>
          <select name="organisation" value={formData.organisation}
            onChange={handleChange} onBlur={handleBlur}
            style={inputStyle('organisation')} required>
            <option value="">Select Organisation</option>
            <option>SLT</option>
            <option>Mobitel</option>
            <option>External Partner</option>
          </select>
          <FieldError msg={touched.organisation && errors.organisation} />
        </div>
      </div>

      <label className="checkbox-label">
        <input 
          type="checkbox" 
          name="senior_involved" 
          checked={formData.senior_involved} 
          onChange={handleChange} 
          className="custom-checkbox"
        />
        <span>Is a member of senior management involved?</span>
      </label>

      <div className="form-actions between">
        <button type="button" className="btn-secondary" onClick={prevStep}>
          <FaArrowLeft className="btn-icon-left" />
          Back
        </button>
        <button type="submit" className="btn-primary">
          Continue
          <FaArrowRight className="btn-icon-right" />
        </button>
      </div>
    </form>
  );
}

export default SubjectForm;
