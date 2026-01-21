import React, { useState, useEffect } from 'react';
import AdminLayout from '../AdminLayout';
import ContentSectionManager from '../components/ContentSectionManager';
import { adminContentAPI, adminContactsAPI } from '../../../services/adminApi';
import '../Admin.css';

const AdminContact = () => {
    const [sections, setSections] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState({});
    const [message, setMessage] = useState({ type: '', text: '' });
    const [activeTab, setActiveTab] = useState('content');
    const [selectedStatus, setSelectedStatus] = useState('all');

    useEffect(() => {
        loadAllData();
    }, [selectedStatus]);

    const loadAllData = async () => {
        try {
            setLoading(true);
            const [contentResponse, contactsResponse] = await Promise.all([
                adminContentAPI.getAll('contact'),
                adminContactsAPI.getAll(selectedStatus !== 'all' ? { status: selectedStatus } : {})
            ]);
            
            if (contentResponse.success) {
                const data = contentResponse.data || [];
                setSections(Array.isArray(data) ? data : []);
            }
            
            if (contactsResponse.success) {
                setContacts(contactsResponse.data || []);
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to load data' });
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (contactId, newStatus) => {
        const updateKey = `update_${contactId}`;
        setSaving(prev => ({ ...prev, [updateKey]: true }));
        setMessage({ type: '', text: '' });

        try {
            const response = await adminContactsAPI.updateStatus(contactId, newStatus);
            if (response.success) {
                setMessage({ type: 'success', text: 'Contact status updated successfully!' });
                await loadAllData();
            } else {
                setMessage({ type: 'error', text: response.message || 'Failed to update status' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to update status' });
        } finally {
            setSaving(prev => ({ ...prev, [updateKey]: false }));
        }
    };

    const handleContactDelete = async (contactId) => {
        if (!window.confirm('Are you sure you want to delete this contact message? This action cannot be undone.')) {
            return;
        }

        const deleteKey = `delete_${contactId}`;
        setSaving(prev => ({ ...prev, [deleteKey]: true }));
        setMessage({ type: '', text: '' });

        try {
            const response = await adminContactsAPI.delete(contactId);
            if (response.success) {
                setMessage({ type: 'success', text: 'Contact message deleted successfully!' });
                await loadAllData();
            } else {
                setMessage({ type: 'error', text: response.message || 'Failed to delete contact' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to delete contact. Please try again.' });
        } finally {
            setSaving(prev => ({ ...prev, [deleteKey]: false }));
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'new': return '#007bff';
            case 'read': return '#6c757d';
            case 'replied': return '#28a745';
            case 'archived': return '#dc3545';
            default: return '#6c757d';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <AdminLayout>
                <div style={{ padding: '50px', textAlign: 'center' }}>
                    <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#0a2540' }}></i>
                    <p>Loading content...</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div style={{ 
                padding: '30px', 
                paddingBottom: '50px', 
                maxWidth: '1400px', 
                margin: '0 auto', 
                width: '100%', 
                boxSizing: 'border-box'
            }}>
                {/* Header */}
                <div style={{ marginBottom: '30px', borderBottom: '2px solid #e0e0e0', paddingBottom: '20px' }}>
                    <h1 style={{ margin: 0, fontSize: '2rem', color: '#0a2540', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <i className="fas fa-envelope"></i>
                        Contact Page Content Management
                    </h1>
                    <p style={{ margin: '10px 0 0 0', color: '#666', fontSize: '1rem' }}>
                        Manage page content and view/manage contact form submissions from visitors.
                    </p>
                </div>

                {/* Message Display */}
                {message.text && (
                    <div style={{
                        padding: '15px 20px',
                        marginBottom: '25px',
                        borderRadius: '8px',
                        background: message.type === 'success' ? '#d4edda' : message.type === 'error' ? '#f8d7da' : '#d1ecf1',
                        color: message.type === 'success' ? '#155724' : message.type === 'error' ? '#721c24' : '#0c5460',
                        border: `1px solid ${message.type === 'success' ? '#c3e6cb' : message.type === 'error' ? '#f5c6cb' : '#bee5eb'}`,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : message.type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}`}></i>
                            {message.text}
                        </span>
                        <button 
                            onClick={() => setMessage({ type: '', text: '' })} 
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'inherit', padding: '0 5px' }}
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                )}

                {/* Tabs */}
                <div style={{ marginBottom: '25px', borderBottom: '2px solid #e0e0e0' }}>
                    <button
                        onClick={() => setActiveTab('content')}
                        style={{
                            padding: '12px 25px',
                            background: activeTab === 'content' ? '#0a2540' : 'transparent',
                            color: activeTab === 'content' ? 'white' : '#666',
                            border: 'none',
                            borderBottom: activeTab === 'content' ? '3px solid #0a2540' : '3px solid transparent',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: activeTab === 'content' ? '600' : '400',
                            marginRight: '10px'
                        }}
                    >
                        <i className="fas fa-file-alt" style={{ marginRight: '8px' }}></i>
                        Page Content
                    </button>
                    <button
                        onClick={() => setActiveTab('messages')}
                        style={{
                            padding: '12px 25px',
                            background: activeTab === 'messages' ? '#0a2540' : 'transparent',
                            color: activeTab === 'messages' ? 'white' : '#666',
                            border: 'none',
                            borderBottom: activeTab === 'messages' ? '3px solid #0a2540' : '3px solid transparent',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: activeTab === 'messages' ? '600' : '400'
                        }}
                    >
                        <i className="fas fa-inbox" style={{ marginRight: '8px' }}></i>
                        Contact Messages ({contacts.length})
                    </button>
                </div>

                {activeTab === 'content' ? (
                    <ContentSectionManager
                        sections={sections}
                        onSave={async (sectionKey, content, sectionId) => {
                            try {
                                const saveKey = `save_${sectionKey}`;
                                setSaving(prev => ({ ...prev, [saveKey]: true }));
                                setMessage({ type: '', text: '' });
                                
                                const sectionName = sections.find(s => (s.section_key || s.key) === sectionKey)?.section_name || sectionKey;
                                const response = await adminContentAPI.update(sectionKey, content, 'contact', sectionName);
                                if (response.success) {
                                    setMessage({ type: 'success', text: 'Content saved successfully! Page will refresh to show updates.' });
                                    setTimeout(async () => {
                                        await loadAllData();
                                    }, 500);
                                } else {
                                    setMessage({ type: 'error', text: response.message || 'Failed to save' });
                                }
                                setSaving(prev => ({ ...prev, [saveKey]: false }));
                            } catch (error) {
                                setMessage({ type: 'error', text: error.message || 'Failed to save' });
                                setSaving(prev => ({ ...prev, [`save_${sectionKey}`]: false }));
                            }
                        }}
                        onDelete={async (sectionKey) => {
                            try {
                                const deleteKey = `delete_${sectionKey}`;
                                setSaving(prev => ({ ...prev, [deleteKey]: true }));
                                const response = await adminContentAPI.update(sectionKey, '', 'contact', sectionKey);
                                if (response.success) {
                                    setMessage({ type: 'success', text: 'Content cleared successfully!' });
                                    await loadAllData();
                                } else {
                                    setMessage({ type: 'error', text: response.message || 'Failed to delete' });
                                }
                                setSaving(prev => ({ ...prev, [deleteKey]: false }));
                            } catch (error) {
                                setMessage({ type: 'error', text: error.message || 'Failed to delete' });
                                setSaving(prev => ({ ...prev, [`delete_${sectionKey}`]: false }));
                            }
                        }}
                        saving={Object.values(saving).some(val => val === true)}
                        sectionLabel="Content Section"
                    />
                ) : (
                    <div>
                        {/* Contact Messages List */}
                        <div style={{
                            background: 'white',
                            borderRadius: '10px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            marginBottom: '25px',
                            overflow: 'hidden',
                            border: '1px solid #e0e0e0'
                        }}>
                            <div style={{
                                background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                                color: 'white',
                                padding: '20px 25px'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <i className="fas fa-inbox"></i>
                                            Contact Messages
                                        </h3>
                                        <p style={{ margin: '8px 0 0 0', opacity: 0.9, fontSize: '0.9rem' }}>
                                            View and manage contact form submissions from visitors. Update status or delete messages.
                                        </p>
                                    </div>
                                    <select
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        style={{
                                            padding: '8px 15px',
                                            borderRadius: '5px',
                                            border: 'none',
                                            background: 'rgba(255,255,255,0.2)',
                                            color: 'white',
                                            fontSize: '0.9rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <option value="all" style={{ color: '#000' }}>All Messages</option>
                                        <option value="new" style={{ color: '#000' }}>New</option>
                                        <option value="read" style={{ color: '#000' }}>Read</option>
                                        <option value="replied" style={{ color: '#000' }}>Replied</option>
                                        <option value="archived" style={{ color: '#000' }}>Archived</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ padding: '25px' }}>
                                {contacts.length === 0 ? (
                                    <div style={{
                                        textAlign: 'center',
                                        padding: '60px 20px',
                                        color: '#999'
                                    }}>
                                        <i className="fas fa-inbox" style={{ fontSize: '4rem', marginBottom: '20px', opacity: 0.3, display: 'block' }}></i>
                                        <h3 style={{ color: '#999', marginBottom: '10px' }}>No Contact Messages</h3>
                                        <p>No contact messages found{selectedStatus !== 'all' ? ` with status "${selectedStatus}"` : ''}.</p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'grid', gap: '20px' }}>
                                        {contacts.map((contact) => (
                                            <div
                                                key={contact.id}
                                                style={{
                                                    background: contact.status === 'new' ? '#e7f3ff' : 'white',
                                                    border: `2px solid ${contact.status === 'new' ? '#007bff' : '#e0e0e0'}`,
                                                    borderRadius: '8px',
                                                    padding: '20px',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                                }}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '15px', marginBottom: '15px' }}>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px', flexWrap: 'wrap' }}>
                                                            <h4 style={{ margin: 0, color: '#0a2540', fontSize: '1.2rem' }}>{contact.name}</h4>
                                                            <span style={{
                                                                padding: '4px 12px',
                                                                borderRadius: '12px',
                                                                fontSize: '0.75rem',
                                                                fontWeight: '600',
                                                                background: getStatusColor(contact.status),
                                                                color: 'white',
                                                                textTransform: 'uppercase'
                                                            }}>
                                                                {contact.status}
                                                            </span>
                                                        </div>
                                                        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '0.9rem', color: '#666' }}>
                                                            <div>
                                                                <i className="fas fa-envelope" style={{ marginRight: '5px' }}></i>
                                                                <a href={`mailto:${contact.email}`} style={{ color: '#0a2540', textDecoration: 'none' }}>
                                                                    {contact.email}
                                                                </a>
                                                            </div>
                                                            <div>
                                                                <i className="fas fa-calendar" style={{ marginRight: '5px' }}></i>
                                                                {formatDate(contact.created_at)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                                        <select
                                                            value={contact.status}
                                                            onChange={(e) => handleStatusUpdate(contact.id, e.target.value)}
                                                            disabled={saving[`update_${contact.id}`]}
                                                            style={{
                                                                padding: '6px 12px',
                                                                borderRadius: '5px',
                                                                border: '1px solid #e0e0e0',
                                                                fontSize: '0.85rem',
                                                                cursor: saving[`update_${contact.id}`] ? 'not-allowed' : 'pointer',
                                                                opacity: saving[`update_${contact.id}`] ? 0.6 : 1
                                                            }}
                                                        >
                                                            <option value="new">New</option>
                                                            <option value="read">Read</option>
                                                            <option value="replied">Replied</option>
                                                            <option value="archived">Archived</option>
                                                        </select>
                                                        <button
                                                            onClick={() => handleContactDelete(contact.id)}
                                                            disabled={saving[`delete_${contact.id}`]}
                                                            style={{
                                                                padding: '6px 12px',
                                                                background: '#dc3545',
                                                                color: 'white',
                                                                border: 'none',
                                                                borderRadius: '5px',
                                                                cursor: saving[`delete_${contact.id}`] ? 'not-allowed' : 'pointer',
                                                                fontSize: '0.85rem',
                                                                opacity: saving[`delete_${contact.id}`] ? 0.6 : 1
                                                            }}
                                                        >
                                                            {saving[`delete_${contact.id}`] ? (
                                                                <i className="fas fa-spinner fa-spin"></i>
                                                            ) : (
                                                                <><i className="fas fa-trash" style={{ marginRight: '5px' }}></i> Delete</>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                                <div style={{ marginBottom: '10px' }}>
                                                    <strong style={{ color: '#0a2540', fontSize: '0.9rem' }}>Subject:</strong>
                                                    <span style={{ marginLeft: '10px', color: '#555' }}>{contact.subject}</span>
                                                </div>
                                                <div style={{
                                                    background: '#f8f9fa',
                                                    padding: '15px',
                                                    borderRadius: '5px',
                                                    marginTop: '10px',
                                                    border: '1px solid #e0e0e0'
                                                }}>
                                                    <strong style={{ color: '#0a2540', fontSize: '0.9rem', display: 'block', marginBottom: '8px' }}>Message:</strong>
                                                    <p style={{ margin: 0, lineHeight: '1.6', color: '#555', whiteSpace: 'pre-wrap' }}>{contact.message}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Info Box */}
                <div style={{
                    background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                    padding: '20px',
                    borderRadius: '8px',
                    marginTop: '30px',
                    border: '1px solid #90caf9'
                }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#0d47a1', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <i className="fas fa-lightbulb"></i>
                        Quick Tips
                    </h4>
                    <ul style={{ margin: 0, paddingLeft: '20px', color: '#1565c0' }}>
                        <li>Click "Edit" on any field to update the content</li>
                        <li>Click "Delete" to remove content sections</li>
                        <li>Use "Page Content" tab to edit text sections (title, subtitle, contact info, map embed, etc.)</li>
                        <li>Use "Contact Messages" tab to view and manage contact form submissions</li>
                        <li><strong>Status Management:</strong> Update message status (New → Read → Replied → Archived)</li>
                        <li><strong>Filter Messages:</strong> Use the dropdown to filter by status</li>
                        <li>New messages are highlighted with a blue border</li>
                        <li>Click on email addresses to open your email client</li>
                        <li>All changes are saved immediately - refresh the public page to see updates</li>
                    </ul>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminContact;
