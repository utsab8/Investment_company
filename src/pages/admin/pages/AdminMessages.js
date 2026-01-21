import React, { useState, useEffect } from 'react';
import AdminLayout from '../AdminLayout';
import { adminContactsAPI } from '../../../services/adminApi';
import '../Admin.css';

const AdminMessages = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        loadContacts();
    }, []);

    const loadContacts = async () => {
        try {
            setLoading(true);
            const response = await adminContactsAPI.getAll();
            if (response.success) {
                setContacts(response.data || []);
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to load messages' });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div style={{ padding: '50px', textAlign: 'center' }}>
                    <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#0a2540' }}></i>
                    <p>Loading...</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ marginBottom: '30px', borderBottom: '2px solid #e0e0e0', paddingBottom: '20px' }}>
                    <h1 style={{ margin: 0, fontSize: '2rem', color: '#0a2540', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <i className="fas fa-inbox"></i>
                        Contact Messages
                    </h1>
                    <p style={{ margin: '10px 0 0 0', color: '#666' }}>
                        View and manage messages from website visitors
                    </p>
                </div>

                {message.text && (
                    <div style={{
                        padding: '15px 20px',
                        marginBottom: '20px',
                        borderRadius: '5px',
                        background: message.type === 'success' ? '#d4edda' : '#f8d7da',
                        color: message.type === 'success' ? '#155724' : '#721c24',
                        border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <span>{message.text}</span>
                        <button onClick={() => setMessage({ type: '', text: '' })} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                )}

                {contacts.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '40px',
                        background: 'white',
                        borderRadius: '8px',
                        color: '#999'
                    }}>
                        <i className="fas fa-inbox" style={{ fontSize: '3rem', marginBottom: '10px', opacity: 0.3 }}></i>
                        <p>No messages found</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '15px' }}>
                        {contacts.map((contact) => (
                            <div
                                key={contact.id}
                                style={{
                                    background: 'white',
                                    padding: '20px',
                                    borderRadius: '8px',
                                    border: '1px solid #e0e0e0',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                                    <div>
                                        <h4 style={{ margin: 0, color: '#0a2540', marginBottom: '5px' }}>
                                            {contact.name}
                                        </h4>
                                        <div style={{ color: '#666', fontSize: '0.9rem' }}>
                                            {contact.email}
                                        </div>
                                    </div>
                                    <span style={{
                                        padding: '4px 12px',
                                        borderRadius: '12px',
                                        background: contact.status === 'read' ? '#d4edda' : '#fff3cd',
                                        color: contact.status === 'read' ? '#155724' : '#856404',
                                        fontSize: '0.85rem',
                                        fontWeight: '600'
                                    }}>
                                        {contact.status || 'new'}
                                    </span>
                                </div>
                                <div style={{ marginBottom: '10px' }}>
                                    <strong style={{ color: '#0a2540' }}>Subject:</strong> {contact.subject}
                                </div>
                                <div style={{
                                    color: '#666',
                                    marginBottom: '15px',
                                    whiteSpace: 'pre-wrap',
                                    lineHeight: '1.6',
                                    background: '#f8f9fa',
                                    padding: '15px',
                                    borderRadius: '5px'
                                }}>
                                    {contact.message}
                                </div>
                                <div style={{ fontSize: '0.85rem', color: '#999' }}>
                                    <i className="fas fa-clock" style={{ marginRight: '5px' }}></i>
                                    {new Date(contact.created_at).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminMessages;




