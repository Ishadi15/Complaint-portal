import React, { useState } from 'react';
import { saveReporter } from '../services/api';
import { FaUser, FaUserSecret, FaArrowRight } from 'react-icons/fa';

function ReporterForm({ onNext }) {
  const [formData, setFormData] = useState({
    submission_type: 'Named',
    reporter_category: '',
    full_name: '',
    email: '',
    phone: ''
  });

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await saveReporter(formData);
      onNext(res.data);
    } catch (error) {
      alert("Error saving reporter details.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="standard-form">
      <h2>Reporter Details</h2>
      <p className="form-subtitle">Help us identify how to handle your submission securely.</p>

      {/* Styled Radio Buttons for Submission Type */}
      <div className="radio-group-grid">
        <label className={`radio-card ${formData.submission_type === 'Named' ? 'active-named' : ''}`}>
          <input type="radio" name="submission_type" value="Named" checked={formData.submission_type === 'Named'} onChange={handleChange} style={{ display: 'none' }}/> 
          <FaUser className="radio-icon named-icon" />
          <span className="radio-title">Named</span>
          <span className="radio-desc">Standard report</span>
        </label>
        
        <label className={`radio-card ${formData.submission_type === 'Anonymous' ? 'active-anonymous' : ''}`}>
          <input type="radio" name="submission_type" value="Anonymous" checked={formData.submission_type === 'Anonymous'} onChange={handleChange} style={{ display: 'none' }}/> 
          <FaUserSecret className="radio-icon anon-icon" />
          <span className="radio-title">Anonymous</span>
          <span className="radio-desc">Private report</span>
        </label>
      </div>

      <label>Your Category</label>
      <select name="reporter_category" value={formData.reporter_category} onChange={handleChange} required>
        <option value="">Select Category</option>
        <option>Staff - SLT</option>
        <option>Staff - Mobitel</option>
        <option>Partner / Vendor</option>
        <option>Customer</option>
        <option>Other</option>
      </select>

      {formData.submission_type === 'Named' && (
        <div className="fade-in-section">
          <label>Full Name</label>
          <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} placeholder="John Doe" required/>
          
          <div className="form-row">
            <div>
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" required/>
            </div>
            <div>
              <label>Phone</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="+94 77 XXX XXXX" required/>
            </div>
          </div>
        </div>
      )}

      <div className="form-actions right">
        <button type="submit" className="btn-primary">
          Continue
          <FaArrowRight className="btn-icon-right" />
        </button>
      </div>
    </form>
  );
}

export default ReporterForm;
