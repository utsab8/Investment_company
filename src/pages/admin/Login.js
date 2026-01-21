import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAuthAPI } from '../../services/adminApi';
import './Admin.css';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const hasCheckedRef = useRef(false); // Use ref to persist across renders

    useEffect(() => {
        // Prevent multiple checks
        if (hasCheckedRef.current) return;
        hasCheckedRef.current = true;
        
        let isMounted = true;
        
        // Check if already logged in (silently - don't show errors for 401)
        const checkAuth = async () => {
            
            try {
                const response = await adminAuthAPI.checkAuth();
                if (response.success && isMounted) {
                    navigate('/admin/dashboard');
                    return;
                }
            } catch (err) {
                // 401 (Not authenticated) is expected on login page - don't show error
                if (err.message && (err.message.includes('401') || err.message.includes('Not authenticated'))) {
                    // This is normal - user is not logged in
                    return;
                }
                
                // Only show error for actual connection issues
                if (err.message && (err.message.includes('Failed to fetch') || err.message.includes('Cannot connect'))) {
                    // Test backend connection
                    try {
                        const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
                        const testUrl = `${baseUrl}/admin/test.php`;
                        const response = await fetch(testUrl);
                        const data = await response.json();
                        console.log('Backend test successful:', data);
                        // Backend is working - clear any previous errors
                        if (isMounted) {
                            setError('');
                        }
                    } catch (testErr) {
                        console.error('Backend connection test failed:', testErr);
                        if (isMounted) {
                            const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
                            setError(`Cannot connect to backend API at ${baseUrl}\n\nPlease check:\n1. PHP server is running on port 8000\n2. Backend URL is correct in .env file\n3. Check browser console for details`);
                        }
                    }
                }
            }
        };
        
        // Small delay to prevent rapid-fire checks
        const timeoutId = setTimeout(() => {
            checkAuth();
        }, 100);
        
        // Cleanup function
        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
        };
    }, []); // Empty dependency array - only run once on mount

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            console.log('🔐 Attempting login with:', formData.username);
            const response = await adminAuthAPI.login(formData.username, formData.password);
            console.log('✅ Login response:', response);
            
            if (response && response.success) {
                console.log('✅ Login successful, navigating to dashboard...');
                console.log('✅ Response data:', response.data);
                
                // Ensure session is saved
                if (response.data && response.data.token) {
                    console.log('✅ Token received, session should be saved');
                }
                
                // Clear any previous errors
                setError('');
                setLoading(false);
                
                // Navigate to dashboard
                console.log('✅ Navigating to /admin/dashboard');
                navigate('/admin/dashboard', { replace: true });
            } else {
                const errorMsg = response?.message || 'Login failed. Please check your credentials.';
                console.error('❌ Login failed:', errorMsg, response);
                setError(errorMsg);
                setLoading(false);
            }
        } catch (err) {
            console.error('❌ Login error:', err);
            const errorMsg = err.message || 'An error occurred during login. Please check your connection.';
            setError(errorMsg);
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-box">
                <div className="admin-login-header">
                    <h1>MRB International</h1>
                    <p>Admin Panel</p>
                </div>
                
                <form onSubmit={handleSubmit} className="admin-login-form">
                    {error && (
                        <div className="admin-error-message">
                            {error}
                        </div>
                    )}
                    
                    <div className="admin-form-group">
                        <label>Username or Email</label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                            autoFocus
                        />
                    </div>
                    
                    <div className="admin-form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>
                    
                    <button type="submit" className="admin-btn admin-btn-primary" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                
                <div className="admin-login-footer">
                    <p>Default credentials: admin / admin123</p>
                    <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '10px' }}>
                        Please change password after first login
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;

