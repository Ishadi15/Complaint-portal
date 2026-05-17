import React, { useState, useEffect } from 'react';
import { FaSignOutAlt, FaChartBar, FaList, FaCheckCircle, FaClock, FaSyncAlt } from 'react-icons/fa';
import './CoverPage.css';

function AdminDashboard({ onLogout }) {
    const [complaints, setComplaints] = useState([]);
    const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, in_progress: 0 });
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    const fetchData = async () => {
        const token = localStorage.getItem('adminToken');
        if (!token) return onLogout();

        try {
            const [compRes, statsRes] = await Promise.all([
                fetch('http://localhost:5000/api/admin/complaints', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('http://localhost:5000/api/admin/stats', { headers: { 'Authorization': `Bearer ${token}` } })
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

    const updateStatus = async (id, newStatus) => {
        const token = localStorage.getItem('adminToken');
        try {
            const response = await fetch('http://localhost:5000/api/admin/update-status', {
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

    const filteredComplaints = filter === 'all' 
        ? complaints 
        : complaints.filter(c => c.status === filter || (filter === 'Under Review' && !c.status));

    if (loading) return <div style={{ padding: '100px', textAlign: 'center', color: 'white' }}>Loading Dashboard...</div>;

    return (
        <div className="admin-dashboard" style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto', color: '#334155' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', background: 'white', padding: '20px 30px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <div>
                    <h2 style={{ color: '#001e3c', margin: 0 }}>IAU Administration</h2>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Complaint Management System</p>
                </div>
                <button onClick={onLogout} style={{ background: '#fef2f2', color: '#dc2626', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
                    <FaSignOutAlt /> Logout
                </button>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
                <div style={{ background: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                    <div style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '10px' }}>Total Complaints</div>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: '#001e3c' }}>{stats.total}</div>
                </div>
                <div style={{ background: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                    <div style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '10px' }}>Pending</div>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: '#eab308' }}>{stats.pending}</div>
                </div>
                <div style={{ background: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                    <div style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '10px' }}>In Progress</div>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: '#3b82f6' }}>{stats.in_progress || 0}</div>
                </div>
                <div style={{ background: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                    <div style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '10px' }}>Resolved</div>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: '#10b981' }}>{stats.resolved || 0}</div>
                </div>
            </div>

            {/* Content Table */}
            <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <div style={{ padding: '25px 30px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, color: 'black' }}>Recent Submissions</h3>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <select 
                            value={filter} 
                            onChange={(e) => setFilter(e.target.value)}
                            style={{ padding: '8px 15px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', color: 'black' }}
                        >
                            <option value="all">All Status</option>
                            <option value="Under Review">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                        </select>
                        <button onClick={fetchData} style={{ background: '#f1f5f9', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }}>
                            <FaSyncAlt />
                        </button>
                    </div>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: '#f8fafc', color: '#64748b', fontSize: '0.85rem' }}>
                            <tr>
                                <th style={{ padding: '15px 30px' }}>CRN / ID</th>
                                <th style={{ padding: '15px 30px' }}>Reporter</th>
                                <th style={{ padding: '15px 30px' }}>Category</th>
                                <th style={{ padding: '15px 30px' }}>Date</th>
                                <th style={{ padding: '15px 30px' }}>Status</th>
                                <th style={{ padding: '15px 30px' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredComplaints.map(comp => (
                                <tr key={comp.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem' }}>
                                    <td style={{ padding: '20px 30px' }}>
                                        <div style={{ fontWeight: '700', color: '#0057b8' }}>{comp.crn || 'N/A'}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ID: {comp.id}</div>
                                    </td>
                                    <td style={{ padding: '20px 30px' }}>
                                        <div>{comp.full_name || 'Anonymous'}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{comp.submission_type}</div>
                                    </td>
                                    <td style={{ padding: '20px 30px' }}>{comp.complaint_category}</td>
                                    <td style={{ padding: '20px 30px' }}>{new Date(comp.created_at).toLocaleDateString()}</td>
                                    <td style={{ padding: '20px 30px' }}>
                                        <span style={{ 
                                            padding: '5px 12px', 
                                            borderRadius: '50px', 
                                            fontSize: '0.75rem', 
                                            fontWeight: '700',
                                            background: comp.status === 'Resolved' ? '#d1fae5' : comp.status === 'In Progress' ? '#dbeafe' : '#fef9c3',
                                            color: comp.status === 'Resolved' ? '#065f46' : comp.status === 'In Progress' ? '#1e40af' : '#854d0e'
                                        }}>
                                            {comp.status || 'Under Review'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '20px 30px' }}>
                                        <select 
                                            value={comp.status || 'Under Review'} 
                                            onChange={(e) => updateStatus(comp.id, e.target.value)}
                                            style={{ padding: '5px 10px', borderRadius: '6px', fontSize: '0.8rem', border: '1px solid #e2e8f0', color: 'black' }}
                                        >
                                            <option value="Under Review">Set Pending</option>
                                            <option value="In Progress">Set In Progress</option>
                                            <option value="Resolved">Set Resolved</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
