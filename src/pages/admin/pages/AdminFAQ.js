import React, { useState, useEffect } from 'react';
import AdminLayout from '../AdminLayout';
import ContentSectionManager from '../components/ContentSectionManager';
import ItemManager from '../components/ItemManager';
import { adminContentAPI, adminFaqsAPI } from '../../../services/adminApi';
import '../Admin.css';

const AdminFAQ = () => {
    const [sections, setSections] = useState([]);
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState({});
    const [message, setMessage] = useState({ type: '', text: '' });
    const [activeTab, setActiveTab] = useState('content');

    useEffect(() => {
        loadAllData();
    }, []);

    const loadAllData = async () => {
        try {
            setLoading(true);
            const [contentResponse, faqsResponse] = await Promise.all([
                adminContentAPI.getAll('faq'),
                adminFaqsAPI.getAll()
            ]);
            
            if (contentResponse.success) {
                const data = contentResponse.data || [];
                setSections(Array.isArray(data) ? data : []);
            }
            
            if (faqsResponse.success) {
                setFaqs(faqsResponse.data || []);
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to load data' });
        } finally {
            setLoading(false);
        }
    };

    const handleFaqSave = async (faqData, faqId) => {
        const saveKey = `faq_${faqId || 'new'}`;
        setSaving(prev => ({ ...prev, [saveKey]: true }));
        setMessage({ type: '', text: '' });

        try {
            const data = {
                question: faqData.question || '',
                answer: faqData.answer || '',
                category: faqData.category || null,
                display_order: faqData.display_order ? parseInt(faqData.display_order) : 0,
                is_active: Boolean(faqData.is_active !== undefined ? faqData.is_active : true)
            };

            let response;
            if (faqId) {
                response = await adminFaqsAPI.update(faqId, data);
            } else {
                response = await adminFaqsAPI.create(data);
            }

            if (response.success) {
                setMessage({ type: 'success', text: `FAQ ${faqId ? 'updated' : 'created'} successfully!` });
                await loadAllData();
            } else {
                setMessage({ type: 'error', text: response.message || 'Failed to save' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to save' });
        } finally {
            setSaving(prev => ({ ...prev, [saveKey]: false }));
        }
    };

    const handleFaqDelete = async (faqId) => {
        // Confirmation is handled in ItemManager
        const deleteKey = `delete_faq_${faqId}`;
        setSaving(prev => ({ ...prev, [deleteKey]: true }));
        setMessage({ type: '', text: '' });
        
        try {
            const response = await adminFaqsAPI.delete(faqId);
            if (response.success) {
                setMessage({ type: 'success', text: 'FAQ deleted successfully!' });
                await loadAllData();
            } else {
                setMessage({ type: 'error', text: response.message || 'Failed to delete FAQ' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to delete FAQ. Please try again.' });
        } finally {
            setSaving(prev => ({ ...prev, [deleteKey]: false }));
        }
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
                        <i className="fas fa-question-circle"></i>
                        FAQ Page Content Management
                    </h1>
                    <p style={{ margin: '10px 0 0 0', color: '#666', fontSize: '1rem' }}>
                        Manage all content sections and FAQs for the FAQ page. Add, edit, update, or delete any content.
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
                        onClick={() => setActiveTab('faqs')}
                        style={{
                            padding: '12px 25px',
                            background: activeTab === 'faqs' ? '#0a2540' : 'transparent',
                            color: activeTab === 'faqs' ? 'white' : '#666',
                            border: 'none',
                            borderBottom: activeTab === 'faqs' ? '3px solid #0a2540' : '3px solid transparent',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: activeTab === 'faqs' ? '600' : '400'
                        }}
                    >
                        <i className="fas fa-list" style={{ marginRight: '8px' }}></i>
                        FAQs List
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
                                const response = await adminContentAPI.update(sectionKey, content, 'faq', sectionName);
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
                                const response = await adminContentAPI.update(sectionKey, '', 'faq', sectionKey);
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
                        {/* FAQs List */}
                        <div style={{
                            background: 'white',
                            borderRadius: '10px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            marginBottom: '25px',
                            overflow: 'hidden',
                            border: '1px solid #e0e0e0'
                        }}>
                            <div style={{
                                background: 'linear-gradient(135deg, #28a745 0%, #218838 100%)',
                                color: 'white',
                                padding: '20px 25px'
                            }}>
                                <h3 style={{ margin: 0, fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <i className="fas fa-question-circle"></i>
                                    FAQs Management
                                </h3>
                                <p style={{ margin: '8px 0 0 0', opacity: 0.9, fontSize: '0.9rem' }}>
                                    Add, edit, update, or delete FAQs - All active FAQs are displayed on the FAQ page in accordion format.
                                </p>
                            </div>
                            <div style={{ padding: '25px' }}>
                                <ItemManager
                                    items={faqs}
                                    itemType="faq"
                                    fields={[
                                        { key: 'question', label: 'Question', type: 'text', required: true },
                                        { key: 'answer', label: 'Answer', type: 'textarea', required: true },
                                        { key: 'category', label: 'Category (Optional)', type: 'text', placeholder: 'e.g., Investment, Plans, Services' },
                                        { key: 'display_order', label: 'Display Order', type: 'number', placeholder: 'Lower numbers appear first' },
                                        { key: 'is_active', label: 'Active', type: 'checkbox' }
                                    ]}
                                    onSave={(data, id) => handleFaqSave(data, id)}
                                    onDelete={(id) => handleFaqDelete(id)}
                                    saving={Object.values(saving).some(val => val === true)}
                                />
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
                        <li>Click "Delete" to remove content sections or FAQs</li>
                        <li>Use "Page Content" tab to edit text sections (title, subtitle, intro, etc.)</li>
                        <li>Use "FAQs List" tab to manage individual FAQs (add, edit, delete)</li>
                        <li><strong>Display Order:</strong> Lower numbers appear first. Use this to control FAQ ordering</li>
                        <li><strong>Category:</strong> Optional field to group FAQs (e.g., Investment, Plans, Services)</li>
                        <li>Only active FAQs are displayed on the public FAQ page</li>
                        <li>FAQs are displayed in accordion format on the public page</li>
                        <li>All changes are saved immediately - refresh the public page to see updates</li>
                    </ul>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminFAQ;
