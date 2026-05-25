import React, { useState } from 'react';
import { saveEvidence } from '../services/api';
import { FaCloudUploadAlt, FaArrowRight, FaArrowLeft } from 'react-icons/fa';

function EvidenceForm({ onNext, prevStep, complaintId }) {
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = e => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!file) {
      onNext();
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('evidence', file);
    formData.append('id', complaintId);
    if (category) {
      formData.append('category', category);
    }

    try {
      await saveEvidence(formData);
      onNext();
    } catch (error) {
      alert("Error uploading evidence.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="standard-form">
      <h2>Supporting Evidence</h2>
      <p className="form-subtitle">Section 4 of 5 — Upload documents, photos, or recordings that support your claim. (Optional)</p>

      <div style={{ marginBottom: '25px' }}>
        <label htmlFor="evidence-category">Evidence Category</label>
        <select 
          id="evidence-category" 
          value={category} 
          onChange={(e) => {
            setCategory(e.target.value);
            setFile(null); // Clear selected file when category changes
          }}
          style={{ marginTop: '10px' }}
        >
          <option value="">-- Select Category (Optional) --</option>
          <option value="Document">Document (PDF, DOCX, TXT)</option>
          <option value="Photo">Photo / Image (JPG, PNG)</option>
          <option value="Video">Video (MP4, AVI)</option>
          <option value="Audio">Audio (MP3, WAV)</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="file-upload-box" onClick={() => document.getElementById('file-upload').click()}>
        <input 
          type="file" 
          id="file-upload" 
          onChange={handleFileChange} 
          style={{ display: 'none' }}
          accept={
            category === 'Document' ? '.pdf,.doc,.docx,.txt' :
            category === 'Photo' ? '.jpg,.jpeg,.png' :
            category === 'Video' ? '.mp4,.avi,.mkv' :
            category === 'Audio' ? '.mp3,.wav' : '*'
          }
        />
        <FaCloudUploadAlt className="upload-icon" />
        <p className="upload-title">
          {file ? file.name : "Click to select or drag and drop a file"}
        </p>
        <p className="upload-desc">
          {category === 'Document' ? 'PDF, DOC, DOCX, or TXT (Max 25MB)' :
           category === 'Photo' ? 'JPG, JPEG, or PNG (Max 25MB)' :
           category === 'Video' ? 'MP4, AVI, or MKV (Max 25MB)' :
           category === 'Audio' ? 'MP3 or WAV (Max 25MB)' :
           'PDF, JPG, PNG, or MP4 (Max 25MB)'}
        </p>
      </div>

      <div className="form-actions between">
        <button type="button" className="btn-secondary" onClick={prevStep}>
          <FaArrowLeft className="btn-icon-left" />
          Back
        </button>
        <button type="submit" className="btn-primary" disabled={isUploading}>
          {isUploading ? "Uploading..." : "Continue"}
          {!isUploading && <FaArrowRight className="btn-icon-right" />}
        </button>
      </div>
    </form>
  );
}

export default EvidenceForm;
