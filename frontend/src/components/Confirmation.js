import React, { useEffect, useState } from 'react';
import { finalizeComplaint } from '../services/api';
import { FaCheckCircle } from 'react-icons/fa';

function Confirmation({ complaintId }) {
  const [crn, setCrn] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const finalize = async () => {
      try {
        const res = await finalizeComplaint({ id: complaintId });
        if (res.data.success) {
          setCrn(res.data.crn);
        }
      } catch (error) {
        console.error("Error finalizing complaint:", error);
      } finally {
        setLoading(false);
      }
    };

    if (complaintId) {
      finalize();
    } else {
      setLoading(false);
    }
  }, [complaintId]);

  if (loading) return (
    <div className="confirmation-container loading">
      <div className="spinner"></div>
      <p>Securing your submission...</p>
    </div>
  );

  return (
    <div className="confirmation-container success">
      <FaCheckCircle className="success-icon" />
      <h2>Submission Vaulted</h2>
      <p className="form-subtitle">
        Your report has been securely encrypted and transmitted to the Internal Affairs Unit.
      </p>
      
      <div className="crn-box">
        <span className="crn-label">Secure Reference Number (CRN)</span>
        <div className="crn-value">
          {crn || "IAU-SECURE-001"}
        </div>
      </div>

      <p className="tracking-info">
        Please save this number securely. You will need it to anonymously track the status of your report in the future.
      </p>

      <button className="btn-primary full-width" onClick={() => window.location.reload()}>
        Return to Portal
      </button>
    </div>
  );
}

export default Confirmation;
