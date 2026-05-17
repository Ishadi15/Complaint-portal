import React, { useState } from 'react';
import { FaSearch, FaArrowLeft, FaInfoCircle, FaCheckCircle, FaClock, FaExclamationCircle } from 'react-icons/fa';
import './CoverPage.css';

function TrackComplaint({ onBack }) {
    const [crn, setCrn] = useState('');
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleTrack = async (e) => {
        e.preventDefault();
        if (!crn.trim()) return;

        setLoading(true);
        setError(null);
        setComplaint(null);

        try {
            const response = await fetch(`http://localhost:5000/api/complaints/track/${crn}`);
            const data = await response.json();

            if (data.success) {
                setComplaint(data.complaint);
            } else {
                setError(data.error || 'Complaint not found. Please check your tracking number.');
            }
        } catch (err) {
            setError('Unable to connect to the server. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="track-container" style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
            <button className="btn-back-portal" onClick={onBack} style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#0057b8', fontWeight: '700', cursor: 'pointer' }}>
                <FaArrowLeft /> Back to Home
            </button>

            <div className="track-card-main" style={{ background: 'white', borderRadius: '16px', padding: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
                <h2 style={{ color: '#001e3c', marginBottom: '10px', fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <FaSearch style={{ color: '#0057b8' }} /> Track Your Complaint
                </h2>
                <p style={{ color: '#64748b', marginBottom: '30px' }}>
                    Enter the Complaint Reference Number (CRN) you received during submission to view its current status and updates.
                </p>

                <form onSubmit={handleTrack} style={{ display: 'flex', gap: '10px', marginBottom: '30px', background: '#001e3c', padding: '20px', borderRadius: '16px' }}>
                    <input 
                        type="text" 
                        placeholder="Enter CRN (e.g. IAU-2026-123456)" 
                        value={crn}
                        onChange={(e) => setCrn(e.target.value)}
                        style={{ 
                            flex: 1, 
                            padding: '15px 20px', 
                            borderRadius: '12px', 
                            border: '2px solid #334155', 
                            fontSize: '1rem',
                            outline: 'none',
                            backgroundColor: 'white',
                            color: '#001e3c',
                            transition: 'border-color 0.3s'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#0057b8'}
                        onBlur={(e) => e.target.style.borderColor = '#334155'}
                    />
                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{ 
                            backgroundColor: '#0057b8', 
                            color: 'white', 
                            border: 'none', 
                            padding: '0 30px', 
                            borderRadius: '12px', 
                            fontWeight: '700', 
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                    >
                        {loading ? '...' : 'Track Status'}
                    </button>
                </form>


                {error && (
                    <div style={{ backgroundColor: '#fff1f2', color: '#be123c', padding: '20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid #fecdd3' }}>
                        <FaExclamationCircle /> {error}
                    </div>
                )}

                {complaint && (
                    <div className="status-results" style={{ marginTop: '40px', borderTop: '1px solid #e2e8f0', paddingTop: '30px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                            <div>
                                <span style={{ fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>Reference Number</span>
                                <h3 style={{ color: '#001e3c', margin: '5px 0 0 0', fontSize: '1.5rem' }}>{complaint.crn}</h3>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>Current Status</span>
                                <div style={{ 
                                    marginTop: '5px',
                                    padding: '8px 16px', 
                                    borderRadius: '50px', 
                                    backgroundColor: '#f0fdf4', 
                                    color: '#16a34a', 
                                    fontWeight: '700',
                                    fontSize: '0.9rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    border: '1px solid #dcfce7'
                                }}>
                                    <FaClock /> {complaint.status || 'Under Review'}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px' }}>
                                <h4 style={{ color: '#001e3c', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <FaInfoCircle style={{ color: '#0057b8' }} /> Complaint Info
                                </h4>
                                <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '8px' }}>
                                    <strong>Category:</strong> {complaint.complaint_category}
                                </p>
                                <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '8px' }}>
                                    <strong>Date Reported:</strong> {new Date(complaint.created_at).toLocaleDateString()}
                                </p>
                                <p style={{ fontSize: '0.9rem', color: '#475569' }}>
                                    <strong>Submission:</strong> {complaint.submission_type}
                                </p>
                            </div>

                            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px' }}>
                                <h4 style={{ color: '#001e3c', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <FaCheckCircle style={{ color: '#71bf44' }} /> Progress
                                </h4>
                                <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', marginBottom: '15px' }}>
                                    <div style={{ width: '25%', height: '100%', background: '#71bf44' }}></div>
                                </div>
                                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                    Your complaint has been successfully received and is currently being screened by the IAU team.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TrackComplaint;
