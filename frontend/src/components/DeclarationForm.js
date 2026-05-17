import React, { useState } from 'react';
import { saveDeclaration } from '../services/api';
import { FaExclamationTriangle, FaArrowLeft, FaCheck } from 'react-icons/fa';

function DeclarationForm({ onNext, prevStep, complaintId }) {
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!agreed) {
      alert("You must agree to the declaration before continuing.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await saveDeclaration({ declaration: agreed, id: complaintId });
      onNext();
    } catch (error) {
      alert("Error saving declaration.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="standard-form">
      <h2>Official Declaration</h2>
      <p className="form-subtitle">Please verify and confirm the accuracy of your submission.</p>

      <div className="warning-box">
        <FaExclamationTriangle className="warning-icon" />
        <p>
          <strong>Important:</strong> I hereby declare that the information provided in this complaint is true 
          and accurate to the best of my knowledge. I understand that providing 
          false information may result in disciplinary action under SLTMobitel corporate policy.
        </p>
      </div>

      <label className="checkbox-label declaration-label">
        <input 
          type="checkbox" 
          checked={agreed} 
          onChange={e => setAgreed(e.target.checked)} 
          className="custom-checkbox"
        />
        <span>I agree to the above declaration and confirm all details are correct.</span>
      </label>

      <div className="form-actions between">
        <button type="button" className="btn-secondary" onClick={prevStep}>
          <FaArrowLeft className="btn-icon-left" />
          Back
        </button>
        <button type="submit" className="btn-primary submit-btn" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Report"}
          {!isSubmitting && <FaCheck className="btn-icon-right" />}
        </button>
      </div>
    </form>
  );
}

export default DeclarationForm;
