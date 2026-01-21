import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { adminAuthAPI } from '../../services/adminApi';
import './Admin.css';

const AdminLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const userStr = sessionStorage.getItem('admin_user');
        if (userStr) {
            setUser(JSON.parse(userStr));
        }
        
        // Check if user is authenticated
        if (!userStr && location.pathname !== '/admin/login') {
            navigate('/admin/login');
        }
    }, [navigate, location]);

    const handleLogout = async () => {
        try {
            await adminAuthAPI.logout();
            navigate('/admin/login');
        } catch (err) {
            console.error('Logout error:', err);
            navigate('/admin/login');
        }
    };

    const isActive = (path) => {
        if (path === '/admin/home' || path === '/admin/dashboard') {
            return location.pathname === '/admin/home' || location.pathname === '/admin/dashboard';
        }
        return location.pathname === path;
    };

    if (location.pathname === '/admin/login') {
        return children;
    }

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <div className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="admin-sidebar-header">
                    <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <i className="fas fa-cog"></i>
                        Admin Panel
                    </h2>
                    <p style={{ margin: '8px 0 0 0', fontSize: '0.85rem', opacity: 0.8 }}>
                        Content Manager
                    </p>
                </div>

                <nav style={{ flex: 1, padding: '10px 0', overflowY: 'auto', overflowX: 'hidden', minHeight: 0 }}>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        <li>
                            <Link 
                                to="/admin/dashboard" 
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px 20px',
                                    color: 'white',
                                    textDecoration: 'none',
                                    transition: 'all 0.3s',
                                    background: isActive('/admin/home') || isActive('/admin/dashboard') ? 'rgba(255,255,255,0.1)' : 'transparent',
                                    borderLeft: (isActive('/admin/home') || isActive('/admin/dashboard')) ? '3px solid #fff' : '3px solid transparent'
                                }}
                                onClick={() => setSidebarOpen(false)}
                            >
                                <i className="fas fa-tachometer-alt"></i>
                                <span>Dashboard</span>
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/admin/home" 
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px 20px',
                                    color: 'white',
                                    textDecoration: 'none',
                                    transition: 'all 0.3s',
                                    background: isActive('/admin/home') ? 'rgba(255,255,255,0.1)' : 'transparent',
                                    borderLeft: isActive('/admin/home') ? '3px solid #fff' : '3px solid transparent'
                                }}
                                onClick={() => setSidebarOpen(false)}
                            >
                                <i className="fas fa-home"></i>
                                <span>Home Page</span>
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/admin/about" 
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px 20px',
                                    color: 'white',
                                    textDecoration: 'none',
                                    transition: 'all 0.3s',
                                    background: isActive('/admin/about') ? 'rgba(255,255,255,0.1)' : 'transparent',
                                    borderLeft: isActive('/admin/about') ? '3px solid #fff' : '3px solid transparent'
                                }}
                                onClick={() => setSidebarOpen(false)}
                            >
                                <i className="fas fa-info-circle"></i>
                                <span>About Page</span>
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/admin/services" 
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px 20px',
                                    color: 'white',
                                    textDecoration: 'none',
                                    transition: 'all 0.3s',
                                    background: isActive('/admin/services') ? 'rgba(255,255,255,0.1)' : 'transparent',
                                    borderLeft: isActive('/admin/services') ? '3px solid #fff' : '3px solid transparent'
                                }}
                                onClick={() => setSidebarOpen(false)}
                            >
                                <i className="fas fa-briefcase"></i>
                                <span>Services Page</span>
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/admin/process" 
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px 20px',
                                    color: 'white',
                                    textDecoration: 'none',
                                    transition: 'all 0.3s',
                                    background: isActive('/admin/process') ? 'rgba(255,255,255,0.1)' : 'transparent',
                                    borderLeft: isActive('/admin/process') ? '3px solid #fff' : '3px solid transparent'
                                }}
                                onClick={() => setSidebarOpen(false)}
                            >
                                <i className="fas fa-cogs"></i>
                                <span>Process Page</span>
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/admin/projects" 
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px 20px',
                                    color: 'white',
                                    textDecoration: 'none',
                                    transition: 'all 0.3s',
                                    background: isActive('/admin/projects') ? 'rgba(255,255,255,0.1)' : 'transparent',
                                    borderLeft: isActive('/admin/projects') ? '3px solid #fff' : '3px solid transparent'
                                }}
                                onClick={() => setSidebarOpen(false)}
                            >
                                <i className="fas fa-project-diagram"></i>
                                <span>Projects Page</span>
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/admin/reports" 
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px 20px',
                                    color: 'white',
                                    textDecoration: 'none',
                                    transition: 'all 0.3s',
                                    background: isActive('/admin/reports') ? 'rgba(255,255,255,0.1)' : 'transparent',
                                    borderLeft: isActive('/admin/reports') ? '3px solid #fff' : '3px solid transparent'
                                }}
                                onClick={() => setSidebarOpen(false)}
                            >
                                <i className="fas fa-file-alt"></i>
                                <span>Reports Page</span>
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/admin/faq" 
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px 20px',
                                    color: 'white',
                                    textDecoration: 'none',
                                    transition: 'all 0.3s',
                                    background: isActive('/admin/faq') ? 'rgba(255,255,255,0.1)' : 'transparent',
                                    borderLeft: isActive('/admin/faq') ? '3px solid #fff' : '3px solid transparent'
                                }}
                                onClick={() => setSidebarOpen(false)}
                            >
                                <i className="fas fa-question-circle"></i>
                                <span>FAQ Page</span>
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/admin/contact" 
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px 20px',
                                    color: 'white',
                                    textDecoration: 'none',
                                    transition: 'all 0.3s',
                                    background: isActive('/admin/contact') ? 'rgba(255,255,255,0.1)' : 'transparent',
                                    borderLeft: isActive('/admin/contact') ? '3px solid #fff' : '3px solid transparent'
                                }}
                                onClick={() => setSidebarOpen(false)}
                            >
                                <i className="fas fa-envelope"></i>
                                <span>Contact Page</span>
                            </Link>
                        </li>
                        <li style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                            <Link 
                                to="/admin/settings" 
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px 20px',
                                    color: 'white',
                                    textDecoration: 'none',
                                    transition: 'all 0.3s',
                                    background: isActive('/admin/settings') ? 'rgba(255,255,255,0.1)' : 'transparent',
                                    borderLeft: isActive('/admin/settings') ? '3px solid #fff' : '3px solid transparent'
                                }}
                                onClick={() => setSidebarOpen(false)}
                            >
                                <i className="fas fa-cog"></i>
                                <span>Settings</span>
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/admin/messages" 
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px 20px',
                                    color: 'white',
                                    textDecoration: 'none',
                                    transition: 'all 0.3s',
                                    background: isActive('/admin/messages') ? 'rgba(255,255,255,0.1)' : 'transparent',
                                    borderLeft: isActive('/admin/messages') ? '3px solid #fff' : '3px solid transparent'
                                }}
                                onClick={() => setSidebarOpen(false)}
                            >
                                <i className="fas fa-inbox"></i>
                                <span>Messages</span>
                            </Link>
                        </li>
                    </ul>
                </nav>

                <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
                    {user && (
                        <div style={{ marginBottom: '15px', padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                <i className="fas fa-user-circle" style={{ fontSize: '1.5rem' }}></i>
                                <div style={{ minWidth: 0, flex: 1 }}>
                                    <p style={{ margin: 0, fontWeight: '600', fontSize: '0.95rem', wordBreak: 'break-word' }}>{user.full_name || user.username}</p>
                                    <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', opacity: 0.8, wordBreak: 'break-word' }}>{user.email}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    <button 
                        onClick={handleLogout} 
                        style={{ 
                            width: '100%',
                            padding: '10px',
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '5px',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            transition: 'all 0.3s',
                            whiteSpace: 'nowrap'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(255,255,255,0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'rgba(255,255,255,0.1)';
                        }}
                    >
                        <i className="fas fa-sign-out-alt" style={{ marginRight: '8px' }}></i>
                        Logout
                    </button>
                </div>
            </div>

            {/* Mobile sidebar overlay */}
            {sidebarOpen && <div className="admin-sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

            {/* Main Content */}
            <div className="admin-main-content">
                {/* Mobile top bar */}
                <div className="admin-topbar">
                    <button
                        className="admin-mobile-menu-btn"
                        type="button"
                        onClick={() => setSidebarOpen(prev => !prev)}
                    >
                        <i className="fas fa-bars"></i>
                    </button>
                    <span className="admin-topbar-title">Admin Panel</span>
                </div>
                <div style={{ flex: 1, minHeight: 0, width: '100%', maxWidth: '100%' }}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;

