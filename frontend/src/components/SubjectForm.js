import React, { useState } from 'react';
import { saveSubject } from '../services/api';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';

function SubjectForm({ onNext, prevStep, complaintId }) {
  const [formData, setFormData] = useState({
    subject_name: '',
    subject_role: '',
    organisation: '',
    senior_involved: false
  });

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await saveSubject({ ...formData, id: complaintId });
      onNext();
    } catch (error) {
      alert("Error saving subject information.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="standard-form">
      <h2>Accused Information</h2>
      <p className="form-subtitle">Details about the individual(s) involved in the reported incident.</p>

      <label>Name of Accused</label>
      <input type="text" name="subject_name" placeholder="Full name" value={formData.subject_name} onChange={handleChange} required />

      <div className="form-row">
        <div>
          <label>Designation / Role</label>
          <input type="text" name="subject_role" placeholder="e.g. Senior Manager" value={formData.subject_role} onChange={handleChange} required />
        </div>
        <div>
          <label>Organisation</label>
          <select name="organisation" value={formData.organisation} onChange={handleChange} required>
            <option value="">Select Organisation</option>
            <option>SLT</option>
            <option>Mobitel</option>
            <option>External Partner</option>
          </select>
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
