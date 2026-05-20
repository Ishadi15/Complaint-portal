import React, { useState } from 'react';
import { saveComplaint } from '../services/api';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';

function ComplaintForm({ onNext, prevStep, complaintId }) {
  const [formData, setFormData] = useState({
    complaint_category: '',
    description: '',
    date_reported: '',
    location: '',
    frequency: ''
  });

  const handleChange = e => {
    if (e.target.name === 'description') {
      const words = e.target.value.trim().split(/\s+/).filter(w => w.length > 0);
      if (words.length > 50) {
        const allowedText = words.slice(0, 50).join(" ");
        setFormData({ ...formData, [e.target.name]: allowedText });
        return;
      }
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await saveComplaint({ ...formData, id: complaintId });
      onNext();
    } catch (error) {
      alert("Error saving complaint details.");
    }
  };

  const wordCount = formData.description.trim().split(/\s+/).filter(w => w.length > 0).length;

  return (
    <form onSubmit={handleSubmit} className="standard-form">
      <h2>Incident Details</h2>
      <p className="form-subtitle">Please provide clear and specific information regarding the incident.</p>

      <label>Complaint Category</label>
      <select name="complaint_category" value={formData.complaint_category} onChange={handleChange} required>
        <option value="">Select Category</option>
        <option>Financial Fraud</option>
        <option>Harassment / Discrimination</option>
        <option>Corruption / Bribery</option>
        <option>Misuse of Assets</option>
        <option>Other</option>
      </select>

      <label>Detailed Description</label>
      <textarea 
        name="description" 
        placeholder="Describe what happened, who was involved, and any specific details (Max 50 words)..."
        value={formData.description} 
        onChange={handleChange} 
        required
        rows="4"
      ></textarea>
      <div style={{ fontSize: '0.8rem', color: '#64748b', textAlign: 'right', marginTop: '5px' }}>
        {wordCount} / 50 words
      </div>

      <div className="form-row">
        <div>
          <label>Date of Incident</label>
          <input type="date" name="date_reported" value={formData.date_reported} onChange={handleChange} required/>
        </div>
        <div>
          <label>Occurrence Frequency</label>
          <select name="frequency" value={formData.frequency} onChange={handleChange} required>
            <option value="">Select Frequency</option>
            <option>One-time incident</option>
            <option>Recurring incident</option>
            <option>Ongoing concern</option>
          </select>
        </div>
      </div>

      <label>Location of Incident</label>
      <input type="text" name="location" placeholder="e.g. Colombo Head Office" value={formData.location} onChange={handleChange} required/>

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
