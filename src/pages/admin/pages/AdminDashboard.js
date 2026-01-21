import React, { useState, useEffect } from 'react';
import AdminLayout from '../AdminLayout';
import { adminDashboardAPI } from '../../../services/adminApi';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../Admin.css';

const COLORS = ['#0a2540', '#17a2b8', '#28a745', '#ffc107', '#dc3545', '#6f42c1'];

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadDashboardStats();
    }, []);

    const loadDashboardStats = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await adminDashboardAPI.getStats();
            if (response.success) {
                setStats(response.data);
            } else {
                setError(response.message || 'Failed to load dashboard statistics');
            }
        } catch (err) {
            setError(err.message || 'Failed to load dashboard statistics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div style={{ padding: '50px', textAlign: 'center' }}>
                    <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#0a2540' }}></i>
                    <p>Loading dashboard...</p>
                </div>
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout>
                <div style={{ padding: '50px', textAlign: 'center' }}>
                    <div style={{ color: '#dc3545', marginBottom: '20px' }}>
                        <i className="fas fa-exclamation-triangle" style={{ fontSize: '2rem', marginBottom: '10px' }}></i>
                        <p>{error}</p>
                    </div>
                    <button onClick={loadDashboardStats} className="btn btn-primary">Retry</button>
                </div>
            </AdminLayout>
        );
    }

    if (!stats) {
        return null;
    }

    const StatCard = ({ title, value, icon, color, subtitle }) => (
        <div style={{
            background: 'white',
            padding: '25px',
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            transition: 'transform 0.2s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
            <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '10px',
                background: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.8rem',
                flexShrink: 0
            }}>
                <i className={icon}></i>
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '5px' }}>{title}</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0a2540' }}>{value}</div>
                {subtitle && <div style={{ color: '#999', fontSize: '0.85rem', marginTop: '5px' }}>{subtitle}</div>}
            </div>
        </div>
    );

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <AdminLayout>
            <div style={{ padding: '30px', paddingBottom: '50px', maxWidth: '1600px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
                <div style={{ marginBottom: '30px', borderBottom: '2px solid #e0e0e0', paddingBottom: '20px' }}>
                    <h1 style={{ margin: 0, fontSize: '2rem', color: '#0a2540', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <i className="fas fa-tachometer-alt"></i>
                        Dashboard
                    </h1>
                    <p style={{ margin: '10px 0 0 0', color: '#666', fontSize: '1rem' }}>
                        Overview of your website statistics and activity
                    </p>
                </div>

                {/* Quick Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                    <StatCard
                        title="Total Projects"
                        value={stats.totals?.projects || 0}
                        icon="fas fa-project-diagram"
                        color="#0a2540"
                        subtitle={`${stats.status_breakdown?.projects?.featured || 0} featured`}
                    />
                    <StatCard
                        title="Total Services"
                        value={stats.totals?.services || 0}
                        icon="fas fa-briefcase"
                        color="#17a2b8"
                        subtitle={`${stats.status_breakdown?.services?.active || 0} active`}
                    />
                    <StatCard
                        title="Total FAQs"
                        value={stats.totals?.faqs || 0}
                        icon="fas fa-question-circle"
                        color="#28a745"
                    />
                    <StatCard
                        title="Total Reports"
                        value={stats.totals?.reports || 0}
                        icon="fas fa-file-alt"
                        color="#ffc107"
                        subtitle={`${stats.status_breakdown?.reports?.public || 0} public`}
                    />
                    <StatCard
                        title="Contact Messages"
                        value={stats.totals?.contacts || 0}
                        icon="fas fa-envelope"
                        color="#dc3545"
                        subtitle={`${stats.totals?.unread_messages || 0} unread`}
                    />
                    <StatCard
                        title="Process Steps"
                        value={stats.totals?.process_steps || 0}
                        icon="fas fa-list-ol"
                        color="#6f42c1"
                    />
                </div>

                {/* Recent Activity */}
                <div style={{ background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
                    <h2 style={{ margin: '0 0 20px 0', fontSize: '1.5rem', color: '#0a2540', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <i className="fas fa-chart-line"></i>
                        Recent Activity (Last 7 Days)
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
                        <div style={{ textAlign: 'center', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#0a2540' }}>{stats.recent_activity?.new_projects || 0}</div>
                            <div style={{ color: '#666', fontSize: '0.9rem' }}>New Projects</div>
                        </div>
                        <div style={{ textAlign: 'center', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#17a2b8' }}>{stats.recent_activity?.new_services || 0}</div>
                            <div style={{ color: '#666', fontSize: '0.9rem' }}>New Services</div>
                        </div>
                        <div style={{ textAlign: 'center', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#28a745' }}>{stats.recent_activity?.new_faqs || 0}</div>
                            <div style={{ color: '#666', fontSize: '0.9rem' }}>New FAQs</div>
                        </div>
                        <div style={{ textAlign: 'center', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#ffc107' }}>{stats.recent_activity?.new_reports || 0}</div>
                            <div style={{ color: '#666', fontSize: '0.9rem' }}>New Reports</div>
                        </div>
                        <div style={{ textAlign: 'center', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#dc3545' }}>{stats.recent_activity?.new_contacts || 0}</div>
                            <div style={{ color: '#666', fontSize: '0.9rem' }}>New Contacts</div>
                        </div>
                    </div>
                </div>

                {/* Charts Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                    {/* Monthly Trends Line Chart */}
                    {stats.monthly_trends && stats.monthly_trends.length > 0 && (
                        <div style={{ background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ margin: '0 0 20px 0', fontSize: '1.3rem', color: '#0a2540' }}>Monthly Trends (Last 6 Months)</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={stats.monthly_trends}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="projects" stroke="#0a2540" strokeWidth={2} name="Projects" />
                                    <Line type="monotone" dataKey="services" stroke="#17a2b8" strokeWidth={2} name="Services" />
                                    <Line type="monotone" dataKey="contacts" stroke="#dc3545" strokeWidth={2} name="Contacts" />
                                    <Line type="monotone" dataKey="reports" stroke="#ffc107" strokeWidth={2} name="Reports" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {/* Status Breakdown Bar Chart */}
                    <div style={{ background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ margin: '0 0 20px 0', fontSize: '1.3rem', color: '#0a2540' }}>Status Breakdown</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={[
                                { name: 'Projects', Active: stats.status_breakdown?.projects?.active || 0, Inactive: stats.status_breakdown?.projects?.inactive || 0, Featured: stats.status_breakdown?.projects?.featured || 0 },
                                { name: 'Services', Active: stats.status_breakdown?.services?.active || 0, Inactive: stats.status_breakdown?.services?.inactive || 0 },
                                { name: 'Contacts', New: stats.status_breakdown?.contacts?.new || 0, Read: stats.status_breakdown?.contacts?.read || 0, Replied: stats.status_breakdown?.contacts?.replied || 0 },
                            ]}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Active" fill="#28a745" />
                                <Bar dataKey="Inactive" fill="#6c757d" />
                                <Bar dataKey="Featured" fill="#ffc107" />
                                <Bar dataKey="New" fill="#dc3545" />
                                <Bar dataKey="Read" fill="#17a2b8" />
                                <Bar dataKey="Replied" fill="#28a745" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Project Metrics */}
                {stats.project_metrics && stats.project_metrics.total_projects > 0 && (
                    <div style={{ background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
                        <h2 style={{ margin: '0 0 20px 0', fontSize: '1.5rem', color: '#0a2540', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <i className="fas fa-chart-pie"></i>
                            Project Performance Metrics
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                            <div style={{ textAlign: 'center', padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0a2540' }}>{stats.project_metrics.average_roi}%</div>
                                <div style={{ color: '#666', fontSize: '0.9rem' }}>Average ROI</div>
                            </div>
                            <div style={{ textAlign: 'center', padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745' }}>${(stats.project_metrics.total_amount_managed / 1000000).toFixed(2)}M</div>
                                <div style={{ color: '#666', fontSize: '0.9rem' }}>Total Amount Managed</div>
                            </div>
                            <div style={{ textAlign: 'center', padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#17a2b8' }}>{stats.project_metrics.max_roi}%</div>
                                <div style={{ color: '#666', fontSize: '0.9rem' }}>Max ROI</div>
                            </div>
                            <div style={{ textAlign: 'center', padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffc107' }}>{stats.project_metrics.min_roi}%</div>
                                <div style={{ color: '#666', fontSize: '0.9rem' }}>Min ROI</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Recent Items */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
                    {/* Recent Projects */}
                    {stats.recent_items?.projects && stats.recent_items.projects.length > 0 && (
                        <div style={{ background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ margin: '0 0 20px 0', fontSize: '1.3rem', color: '#0a2540', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <i className="fas fa-project-diagram"></i>
                                Recent Projects
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {stats.recent_items.projects.map((project) => (
                                    <div key={project.id} style={{ padding: '12px', background: '#f8f9fa', borderRadius: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: '500', color: '#0a2540' }}>{project.title || 'Untitled'}</span>
                                        <span style={{ color: '#666', fontSize: '0.85rem' }}>{formatDate(project.created_at)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recent Services */}
                    {stats.recent_items?.services && stats.recent_items.services.length > 0 && (
                        <div style={{ background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ margin: '0 0 20px 0', fontSize: '1.3rem', color: '#0a2540', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <i className="fas fa-briefcase"></i>
                                Recent Services
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {stats.recent_items.services.map((service) => (
                                    <div key={service.id} style={{ padding: '12px', background: '#f8f9fa', borderRadius: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: '500', color: '#0a2540' }}>{service.title || 'Untitled'}</span>
                                        <span style={{ color: '#666', fontSize: '0.85rem' }}>{formatDate(service.created_at)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recent Contacts */}
                    {stats.recent_items?.contacts && stats.recent_items.contacts.length > 0 && (
                        <div style={{ background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ margin: '0 0 20px 0', fontSize: '1.3rem', color: '#0a2540', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <i className="fas fa-envelope"></i>
                                Recent Contact Messages
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {stats.recent_items.contacts.map((contact) => (
                                    <div key={contact.id} style={{ padding: '12px', background: '#f8f9fa', borderRadius: '5px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                            <span style={{ fontWeight: '500', color: '#0a2540' }}>{contact.name}</span>
                                            <span style={{
                                                padding: '2px 8px',
                                                borderRadius: '4px',
                                                fontSize: '0.75rem',
                                                background: contact.status === 'new' ? '#dc3545' : contact.status === 'replied' ? '#28a745' : '#17a2b8',
                                                color: 'white'
                                            }}>
                                                {contact.status}
                                            </span>
                                        </div>
                                        <div style={{ color: '#666', fontSize: '0.85rem' }}>{contact.email}</div>
                                        <div style={{ color: '#666', fontSize: '0.85rem', marginTop: '3px' }}>{contact.subject}</div>
                                        <div style={{ color: '#999', fontSize: '0.8rem', marginTop: '5px' }}>{formatDate(contact.created_at)}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;




