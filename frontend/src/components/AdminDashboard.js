import React, { useState, useEffect } from 'react';
import { FaSignOutAlt, FaSyncAlt, FaSearch, FaFilter, FaTimes, FaFilePdf, FaBell, FaChevronDown, FaUserCircle } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import './CoverPage.css';

// Dynamic API URL config for local testing and production deployment
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const CATEGORIES = [
    'All Categories',
    'Financial Fraud',
    'Harassment / Discrimination',
    'Corruption / Bribery',
    'Misuse of Assets',
    'Other',
];

const STATUS_OPTIONS = [
    { value: 'all', label: 'All Status' },
    { value: 'Under Review', label: 'Under Review' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Resolved', label: 'Resolved' },
];

function AdminDashboard({ onLogout }) {
    const [complaints, setComplaints] = useState([]);
    const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, in_progress: 0 });
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Filter states
    const [filters, setFilters] = useState({
        crn: '',
        status: 'all',
        category: 'All Categories',
        dateFrom: '',
        dateTo: '',
        reporter: '',
    });

    // Fetch complaints and system analytics metrics
    const fetchData = async () => {
        const token = localStorage.getItem('adminToken');
        if (!token) return onLogout();

        try {
            const [compRes, statsRes] = await Promise.all([
                fetch(`${API_URL}/api/admin/complaints`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${API_URL}/api/admin/stats`, { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            const compData = await compRes.json();
            const statsData = await statsRes.json();

            if (compData.success) setComplaints(compData.complaints);
            if (statsData.success) setStats(statsData.stats);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // Update case lifecycle status handler
    const updateStatus = async (id, newStatus) => {
        const token = localStorage.getItem('adminToken');
        try {
            const response = await fetch(`${API_URL}/api/admin/update-status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ id, status: newStatus })
            });
            if (response.ok) fetchData();
        } catch (err) {
            console.error('Update error:', err);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({ crn: '', status: 'all', category: 'All Categories', dateFrom: '', dateTo: '', reporter: '' });
    };

    const activeFilterCount = [
        filters.crn,
        filters.status !== 'all',
        filters.category !== 'All Categories',
        filters.dateFrom,
        filters.dateTo,
        filters.reporter,
    ].filter(Boolean).length;

    // Advanced search evaluation matrix
    const filteredComplaints = complaints.filter(comp => {
        const status = comp.status || 'Under Review';
        const compDate = new Date(comp.created_at);

        if (filters.status !== 'all' && status !== filters.status) return false;

        if (filters.crn) {
            const query = filters.crn.toLowerCase();
            const crnMatch = (comp.crn || '').toLowerCase().includes(query);
            const idMatch = String(comp.id).includes(query);
            if (!crnMatch && !idMatch) return false;
        }

        if (filters.category !== 'All Categories') {
            if ((comp.complaint_category || '') !== filters.category) return false;
        }

        if (filters.dateFrom) {
            const from = new Date(filters.dateFrom);
            from.setHours(0, 0, 0, 0);
            if (compDate < from) return false;
        }

        if (filters.dateTo) {
            const to = new Date(filters.dateTo);
            to.setHours(23, 59, 59, 999);
            if (compDate > to) return false;
        }

        if (filters.reporter) {
            const query = filters.reporter.toLowerCase();
            if (!(comp.full_name || 'anonymous').toLowerCase().includes(query)) return false;
        }

        return true;
    });

    // Generate executive system reporting printouts
    const downloadPDF = () => {
        try {
            const doc = new jsPDF();
            doc.setFontSize(18);
            doc.text('IAU Complaint Records', 14, 22);
            
            doc.setFontSize(10);
            doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
            doc.text(`Total Records: ${filteredComplaints.length}`, 14, 36);

            const tableColumn = ["CRN / ID", "Reporter", "Category", "Date Submitted", "Status"];
            const tableRows = [];

            filteredComplaints.forEach(comp => {
                const compData = [
                    comp.crn || String(comp.id),
                    comp.full_name || 'Anonymous',
                    comp.complaint_category || 'N/A',
                    new Date(comp.created_at).toLocaleDateString(),
                    comp.status || 'Under Review'
                ];
                tableRows.push(compData);
            });

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 42,
                styles: { fontSize: 8, cellPadding: 3 },
                headStyles: { fillColor: [0, 87, 184] },
                alternateRowStyles: { fillColor: [248, 250, 252] },
            });

            doc.save('IAU_Complaint_Records.pdf');
        } catch (error) {
            console.error("PDF generation error:", error);
            alert("Failed to generate PDF. Check console for details.");
        }
    };

    // Shared UI Style Objects
    const inputStyle = {
        padding: '9px 13px',
        borderRadius: '8px',
        border: '1.5px solid #e2e8f0',
        outline: 'none',
        color: '#334155',
        fontSize: '0.85rem',
        background: 'white',
        width: '100%',
        boxSizing: 'border-box',
        transition: 'border-color 0.2s',
    };

    const labelStyle = {
        fontSize: '0.75rem',
        fontWeight: '600',
        color: '#64748b',
        marginBottom: '5px',
        display: 'block',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    };

    if (loading) return <div style={{ padding: '100px', textAlign: 'center', color: 'white' }}>Loading Dashboard...</div>;

    return (
        <div className="admin-dashboard" style={{ padding: '30px', maxWidth: '1300px', margin: '0 auto', color: '#334155' }}>

            {/* Advanced Glassmorphism Header Element */}
            <div style={{
                background: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(30, 41, 59, 0.8)',
                padding: '16px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '32px',
                borderRadius: '16px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1' }}>
                    <span style={{ fontWeight: '600', color: '#f1f5f9', fontSize: '1.125rem', letterSpacing: '0.025em' }}>IAU Admin</span>
                    <span style={{ color: '#64748b' }}>/</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#60a5fa' }}>Case Management</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ position: 'relative', cursor: 'pointer', color: '#94a3b8', transition: 'color 0.2s' }} 
                         onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                         onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}>
                        <FaBell style={{ fontSize: '1.25rem' }} />
                        <span style={{ position: 'absolute', top: '-4px', right: '-4px', display: 'flex', height: '12px', width: '12px' }}>
                            <span style={{ position: 'absolute', display: 'inline-flex', height: '100%', width: '100%', borderRadius: '50%', background: '#f87171', opacity: '0.75' }}></span>
                            <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '50%', height: '12px', width: '12px', background: '#ef4444', border: '2px solid rgba(15, 23, 42, 1)' }}></span>
                        </span>
                    </div>

                    <div style={{ position: 'relative' }}>
                        <div 
                            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '8px', borderRadius: '8px', transition: 'all 0.2s', border: '1px solid transparent', background: isProfileOpen ? 'rgba(30, 41, 59, 0.5)' : 'transparent', borderColor: isProfileOpen ? 'rgba(51, 65, 85, 1)' : 'transparent' }}
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(30, 41, 59, 0.5)'; e.currentTarget.style.borderColor = 'rgba(51, 65, 85, 1)'; }}
                            onMouseLeave={(e) => { if(!isProfileOpen) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; } }}
                        >
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', boxShadow: '0 10px 15px -3px rgba(30, 58, 138, 0.5)' }}>
                                <FaUserCircle style={{ fontSize: '1.5rem' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#f1f5f9', lineHeight: '1.25' }}>Admin User</span>
                                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Chief Investigator</span>
                            </div>
                            <FaChevronDown style={{ color: '#64748b', fontSize: '0.875rem', transition: 'transform 0.3s', transform: isProfileOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                        </div>

                        {isProfileOpen && (
                            <div style={{ position: 'absolute', right: '0', marginTop: '12px', width: '224px', background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '8px 0', zIndex: '50' }}>
                                <div style={{ padding: '8px 16px', borderBottom: '1px solid #334155', marginBottom: '4px' }}>
                                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600', marginBottom: '4px' }}>Signed in as</p>
                                    <p style={{ fontSize: '0.875rem', fontWeight: '700', color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>admin@iau.sltmobitel.lk</p>
                                </div>
                                <button 
                                    onClick={onLogout}
                                    style={{ width: '100%', textAlign: 'left', padding: '10px 16px', fontSize: '0.875rem', color: '#f87171', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', transition: 'all 0.2s' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(51, 65, 85, 0.5)'; e.currentTarget.style.color = '#fca5a5'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#f87171'; }}
                                >
                                    <FaSignOutAlt /> Secure Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Matrix Analytic Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
                <div style={{ background: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderTop: '4px solid #0057b8' }}>
                    <div style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '8px' }}>Total Complaints</div>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: '#001e3c' }}>{stats.total}</div>
                </div>
                <div style={{ background: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderTop: '4px solid #eab308' }}>
                    <div style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '8px' }}>Under Review</div>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: '#eab308' }}>{stats.pending}</div>
                </div>
                <div style={{ background: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderTop: '4px solid #3b82f6' }}>
                    <div style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '8px' }}>In Progress</div>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: '#3b82f6' }}>{stats.in_progress || 0}</div>
                </div>
                <div style={{ background: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderTop: '4px solid #10b981' }}>
                    <div style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '8px' }}>Resolved</div>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: '#10b981' }}>{stats.resolved || 0}</div>
                </div>
            </div>

            {/* Complaints Data Grid Structure */}
            <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                <div style={{ padding: '20px 30px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifycontent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                        <h3 style={{ margin: 0, color: '#001e3c' }}>Complaint Records</h3>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
                            Showing {filteredComplaints.length} of {complaints.length} complaints
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <button onClick={downloadPDF} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '9px 15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px', fontWeight: '600', fontSize: '0.85rem', transition: 'all 0.2s' }}>
                            <FaFilePdf /> Export PDF
                        </button>
                        <button onClick={() => setShowFilters(v => !v)} style={{ background: showFilters ? '#0057b8' : '#f1f5f9', color: showFilters ? 'white' : '#334155', border: 'none', padding: '9px 18px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px', fontWeight: '600', fontSize: '0.85rem', transition: 'all 0.2s', position: 'relative' }}>
                            <FaFilter /> Filters
                            {activeFilterCount > 0 && (
                                <span style={{ background: '#ef4444', color: 'white', borderRadius: '50%', width: '18px', height: '18px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', position: 'absolute', top: '-7px', right: '-7px' }}>
                                    {activeFilterCount}
                                </span>
                            )}
                        </button>
                        <button onClick={fetchData} title="Refresh" style={{ background: '#f1f5f9', border: 'none', padding: '9px 13px', borderRadius: '8px', cursor: 'pointer', color: '#334155', display: 'flex', alignItems: 'center' }}>
                            <FaSyncAlt />
                        </button>
                    </div>
                </div>

                {/* Filter Sub-Panel UI component */}
                {showFilters && (
                    <div style={{ padding: '20px 30px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', animation: 'fadeIn 0.2s ease' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <span style={{ fontWeight: '700', color: '#001e3c', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '7px' }}>
                                <FaFilter style={{ color: '#0057b8' }} /> Filter Complaints
                            </span>
                            {activeFilterCount > 0 && (
                                <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <FaTimes /> Clear All Filters
                                </button>
                            )}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                            <div>
                                <label style={labelStyle}>Ref / CRN Number</label>
                                <div style={{ position: 'relative' }}>
                                    <FaSearch style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.75rem' }} />
                                    <input type="text" placeholder="e.g. CRN-2024-001" value={filters.crn} onChange={e => handleFilterChange('crn', e.target.value)} style={{ ...inputStyle, paddingLeft: '30px' }} />
                                </div>
                            </div>
                            <div>
                                <label style={labelStyle}>Reporter Name</label>
                                <div style={{ position: 'relative' }}>
                                    <FaSearch style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.75rem' }} />
                                    <input type="text" placeholder="Search by name..." value={filters.reporter} onChange={e => handleFilterChange('reporter', e.target.value)} style={{ ...inputStyle, paddingLeft: '30px' }} />
                                </div>
                            </div>
                            <div>
                                <label style={labelStyle}>Status</label>
                                <select value={filters.status} onChange={e => handleFilterChange('status', e.target.value)} style={inputStyle}>
                                    {STATUS_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Category</label>
                                <select value={filters.category} onChange={e => handleFilterChange('category', e.target.value)} style={inputStyle}>
                                    {CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Date From</label>
                                <input type="date" value={filters.dateFrom} onChange={e => handleFilterChange('dateFrom', e.target.value)} style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Date To</label>
                                <input type="date" value={filters.dateTo} onChange={e => handleFilterChange('dateTo', e.target.value)} style={inputStyle} />
                            </div>
                        </div>

                        {activeFilterCount > 0 && (
                            <div style={{ marginTop: '14px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {filters.crn && <FilterChip label={`CRN: ${filters.crn}`} onRemove={() => handleFilterChange('crn', '')} />}
                                {filters.reporter && <FilterChip label={`Reporter: ${filters.reporter}`} onRemove={() => handleFilterChange('reporter', '')} />}
                                {filters.status !== 'all' && <FilterChip label={`Status: ${filters.status}`} onRemove={() => handleFilterChange('status', 'all')} />}
                                {filters.category !== 'All Categories' && <FilterChip label={`Category: ${filters.category}`} onRemove={() => handleFilterChange('category', 'All Categories')} />}
                                {filters.dateFrom && <FilterChip label={`From: ${filters.dateFrom}`} onRemove={() => handleFilterChange('dateFrom', '')} />}
                                {filters.dateTo && <FilterChip label={`To: ${filters.dateTo}`} onRemove={() => handleFilterChange('dateTo', '')} />}
                            </div>
                        )}
                    </div>
                )}

                {/* Tabular Records Matrix Container */}
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: '#f8fafc', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            <tr>
                                <th style={{ padding: '14px 25px', fontWeight: '700' }}>CRN / ID</th>
                                <th style={{ padding: '14px 25px', fontWeight: '700' }}>Reporter</th>
                                <th style={{ padding: '14px 25px', fontWeight: '700' }}>Category</th>
                                <th style={{ padding: '14px 25px', fontWeight: '700' }}>Date Submitted</th>
                                <th style={{ padding: '14px 25px', fontWeight: '700' }}>Status</th>
                                <th style={{ padding: '14px 25px', fontWeight: '700' }}>Update Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredComplaints.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ padding: '50px', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
                                        <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🔍</div>
                                        No complaints match your filters.{' '}
                                        <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: '#0057b8', cursor: 'pointer', textDecoration: 'underline', fontWeight: '600' }}>
                                            Clear filters
                                        </button>
                                    </td>
                                </tr>
                            ) : (
                                filteredComplaints.map((comp, idx) => (
                                    <tr key={comp.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.875rem', background: idx % 2 === 0 ? 'white' : '#fafbfc', transition: 'background 0.15s' }} onMouseEnter={e => e.currentTarget.style.background = '#f0f7ff'} onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? 'white' : '#fafbfc'}>
                                        <td style={{ padding: '18px 25px' }}>
                                            <div style={{ fontWeight: '700', color: '#0057b8', fontFamily: 'monospace', fontSize: '0.85rem' }}>{comp.crn || 'N/A'}</div>
                                            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>ID: {comp.id}</div>
                                        </td>
                                        <td style={{ padding: '18px 25px' }}>
                                            <div style={{ fontWeight: '600', color: '#334155' }}>{comp.full_name || 'Anonymous'}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px', textTransform: 'capitalize' }}>{comp.submission_type}</div>
                                        </td>
                                        <td style={{ padding: '18px 25px' }}>
                                            <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '3px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600' }}>
                                                {comp.complaint_category || '—'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '18px 25px', color: '#475569' }}>
                                            <div>{new Date(comp.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                                            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{new Date(comp.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</div>
                                        </td>
                                        <td style={{ padding: '18px 25px' }}>
                                            <StatusBadge status={comp.status} />
                                        </td>
                                        <td style={{ padding: '18px 25px' }}>
                                            <select value={comp.status || 'Under Review'} onChange={(e) => updateStatus(comp.id, e.target.value)} style={{ padding: '6px 10px', borderRadius: '6px', fontSize: '0.8rem', border: '1.5px solid #e2e8f0', color: '#334155', outline: 'none', cursor: 'pointer', background: 'white' }}>
                                                <option value="Under Review">Under Review</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Resolved">Resolved</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-6px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}

function StatusBadge({ status }) {
    const cfg = {
        'Resolved':     { bg: '#d1fae5', color: '#065f46' },
        'In Progress':  { bg: '#dbeafe', color: '#1e40af' },
        'Under Review': { bg: '#fef9c3', color: '#854d0e' },
    };
    const s = status || 'Under Review';
    const { bg, color } = cfg[s] || { bg: '#f1f5f9', color: '#334155' };
    return (
        <span style={{ padding: '5px 12px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: '700', background: bg, color }}>
            {s}
        </span>
    );
}

function FilterChip({ label, onRemove }) {
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#dbeafe', color: '#1e40af', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' }}>
            {label}
            <FaTimes onClick={onRemove} style={{ cursor: 'pointer', fontSize: '0.65rem', opacity: 0.7 }} />
        </span>
    );
}

export default AdminDashboard;