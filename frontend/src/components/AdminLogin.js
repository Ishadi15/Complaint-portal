import React, { useState } from 'react';
import { FaLock, FaUser, FaShieldAlt } from 'react-icons/fa';
import './CoverPage.css';

// Render deployment එක සඳහා API URL එක dynamic ලෙස සකස් කිරීම
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function AdminLogin({ onLoginSuccess, onBack }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Localhost වෙනුවට `${API_URL}` භාවිතා කර dynamic ලෙස login POST request එක සිදු කිරීම
            const response = await fetch(`${API_URL}/api/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();

            if (data.success) {
                localStorage.setItem('adminToken', data.token);
                onLoginSuccess();
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('Server connection failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-container" style={{ maxWidth: '400px', margin: '100px auto', padding: '20px' }}>
            <div className="login-card" style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#0057b8', fontSize: '1.5rem' }}>
                    <FaShieldAlt style={{ margin: '0 auto' }} />
                </div>
                <h2 style={{ color: '#001e3c', marginBottom: '10px' }}>Admin Access</h2>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '30px' }}>Secure IAU Management Portal</p>

                <form onSubmit={handleSubmit} autoComplete="off" style={{ background: '#001e3c', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', marginBottom: '30px' }}>
                    <div style={{ marginBottom: '20px', position: 'relative' }}>
                        <FaUser style={{ position: 'absolute', left: '15px', top: '15px', color: '#94a3b8' }} />
                        <input 
                            type="text" 
                            placeholder="Username" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{ 
                                width: '100%', 
                                padding: '12px 15px 12px 45px', 
                                borderRadius: '10px', 
                                border: '1px solid #334155', 
                                outline: 'none',
                                backgroundColor: 'transparent',
                                color: 'white',
                                fontSize: '1rem'
                            }}
                            autoComplete="off"
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '25px', position: 'relative' }}>
                        <FaLock style={{ position: 'absolute', left: '15px', top: '15px', color: '#94a3b8' }} />
                        <input 
                            type="password" 
                            placeholder="Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ 
                                width: '100%', 
                                padding: '12px 15px 12px 45px', 
                                borderRadius: '10px', 
                                border: '1px solid #334155', 
                                outline: 'none',
                                backgroundColor: 'transparent',
                                color: 'white',
                                fontSize: '1rem'
                            }}
                            autoComplete="new-password"
                            required
                        />
                    </div>

                    {error && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '20px', fontWeight: '600' }}>{error}</p>}

                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{ 
                            width: '100%', 
                            padding: '14px', 
                            background: '#0057b8', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '10px', 
                            fontWeight: '700', 
                            cursor: 'pointer',
                            fontSize: '1rem',
                            transition: 'all 0.3s'
                        }}
                    >
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>
                <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.9rem', cursor: 'pointer', fontWeight: '600' }}>
                    Back to Portal
                </button>

            </div>
        </div>
    );
}

export default AdminLogin;