import React, { useState } from 'react';
import { saveComplaint } from '../services/api';
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

function ComplaintForm({ onNext, prevStep, complaintId }) {
  const [formData, setFormData] = useState({
    complaint_category: '',
    description: '',
    date_reported: '',
    location: '',
    frequency: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  /* ── validation ─────────────────────────────────── */
  const validate = (data) => {
    const errs = {};
    if (!data.complaint_category)
      errs.complaint_category = 'Required, please fill this field';
    if (!data.description?.trim())
      errs.description = 'Required, please fill this field';
    if (!data.date_reported)
      errs.date_reported = 'Required, please fill this field';
    if (!data.frequency)
      errs.frequency = 'Required, please fill this field';
    if (!data.location?.trim())
      errs.location = 'Required, please fill this field';
    return errs;
  };

  const handleChange = e => {
    if (e.target.name === 'description') {
      const words = e.target.value.trim().split(/\s+/).filter(w => w.length > 0);
      if (words.length > 50) {
        const allowedText = words.slice(0, 50).join(" ");
        setFormData(prev => ({ ...prev, [e.target.name]: allowedText }));
        return;
      }
    }
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
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
      complaint_category: true,
      description: true,
      date_reported: true,
      frequency: true,
      location: true
    });
    const errs = validate(formData);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return; // stop — show errors

    try {
      await saveComplaint({ ...formData, id: complaintId });
      onNext();
    } catch (error) {
      alert("Error saving complaint details.");
    }
  };

  /* ── input style — red border when error ──────── */
  const inputStyle = () => ({});

  const wordCount = formData.description.trim().split(/\s+/).filter(w => w.length > 0).length;

  return (
    <form onSubmit={handleSubmit} className="standard-form" noValidate>
      <h2>Incident Details</h2>
      <p className="form-subtitle">
        Section 2 of 5 — Fields marked{' '}
        <span style={{ color: '#dc2626', fontWeight: 700 }}>*</span> are required.
      </p>

      <label>Complaint Category <span style={{ color: '#dc2626' }}>*</span></label>
      <select name="complaint_category" value={formData.complaint_category}
        onChange={handleChange} onBlur={handleBlur}
        style={inputStyle('complaint_category')} required>
        <option value="">Select Category</option>
        <option>Financial Fraud</option>
        <option>Harassment / Discrimination</option>
        <option>Corruption / Bribery</option>
        <option>Misuse of Assets</option>
        <option>Other</option>
      </select>
      <FieldError msg={touched.complaint_category && errors.complaint_category} />

      <label>Detailed Description <span style={{ color: '#dc2626' }}>*</span></label>
      <textarea 
        name="description" 
        placeholder="Describe what happened, who was involved, and any specific details (Max 50 words)..."
        value={formData.description} 
        onChange={handleChange}
        onBlur={handleBlur}
        style={inputStyle('description')}
        required
        rows="4"
      ></textarea>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
        <FieldError msg={touched.description && errors.description} />
        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
          {wordCount} / 50 words
        </span>
      </div>

      <div className="form-row">
        <div>
          <label>Date of Incident <span style={{ color: '#dc2626' }}>*</span></label>
          <input type="date" name="date_reported" value={formData.date_reported}
            onChange={handleChange} onBlur={handleBlur}
            style={inputStyle('date_reported')} required/>
          <FieldError msg={touched.date_reported && errors.date_reported} />
        </div>
        <div>
          <label>Occurrence Frequency <span style={{ color: '#dc2626' }}>*</span></label>
          <select name="frequency" value={formData.frequency}
            onChange={handleChange} onBlur={handleBlur}
            style={inputStyle('frequency')} required>
            <option value="">Select Frequency</option>
            <option>One-time incident</option>
            <option>Recurring incident</option>
            <option>Ongoing concern</option>
          </select>
          <FieldError msg={touched.frequency && errors.frequency} />
        </div>
      </div>

      <label>Location of Incident <span style={{ color: '#dc2626' }}>*</span></label>
      <input type="text" name="location" placeholder="e.g. Colombo Head Office"
        value={formData.location} onChange={handleChange} onBlur={handleBlur}
        style={inputStyle('location')} required/>
      <FieldError msg={touched.location && errors.location} />

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

export default ComplaintForm;
