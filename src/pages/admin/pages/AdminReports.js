import React, { useState, useEffect } from 'react';
import AdminLayout from '../AdminLayout';
import ContentSectionManager from '../components/ContentSectionManager';
import ItemManager from '../components/ItemManager';
import { adminContentAPI, adminReportsAPI } from '../../../services/adminApi';
import '../Admin.css';

const AdminReports = () => {
    const [sections, setSections] = useState([]);
    const [reports, setReports] = useState([]);
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
            const [contentResponse, reportsResponse] = await Promise.all([
                adminContentAPI.getAll('reports'),
                adminReportsAPI.getAll()
            ]);
            
            if (contentResponse.success) {
                const data = contentResponse.data || [];
                setSections(Array.isArray(data) ? data : []);
            }
            
            if (reportsResponse.success) {
                setReports(reportsResponse.data || []);
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to load data' });
        } finally {
            setLoading(false);
        }
    };

    const handleReportSave = async (reportData, reportId) => {
        const saveKey = `report_${reportId || 'new'}`;
        setSaving(prev => ({ ...prev, [saveKey]: true }));
        setMessage({ type: '', text: '' });

        try {
            // Process file URL - ensure it's not empty string
            const fileUrl = (reportData.file_url && typeof reportData.file_url === 'string' && reportData.file_url.trim()) 
                ? reportData.file_url.trim() 
                : null;

            // Process file_size - get from reportData or calculate if file_url exists
            let fileSize = null;
            if (reportData.file_size) {
                fileSize = parseInt(reportData.file_size);
            } else if (fileUrl && reportData.file_url_original_size) {
                // Try to get size from original upload
                fileSize = parseInt(reportData.file_url_original_size);
            }

            const data = {
                title: reportData.title || '',
                description: reportData.description || '',
                report_type: reportData.report_type || '',
                file_url: fileUrl,
                file_size: fileSize,
                year: reportData.year ? parseInt(reportData.year) : new Date().getFullYear(),
                quarter: reportData.quarter ? parseInt(reportData.quarter) : null,
                is_public: Boolean(reportData.is_public !== undefined ? reportData.is_public : true)
            };

            let response;
            if (reportId) {
                response = await adminReportsAPI.update(reportId, data);
            } else {
                response = await adminReportsAPI.create(data);
            }

            if (response.success) {
                setMessage({ type: 'success', text: `Report ${reportId ? 'updated' : 'created'} successfully!` });
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

    const handleReportDelete = async (reportId) => {
        // Confirmation is handled in ItemManager
        const deleteKey = `delete_report_${reportId}`;
        setSaving(prev => ({ ...prev, [deleteKey]: true }));
        setMessage({ type: '', text: '' });
        
        try {
            const response = await adminReportsAPI.delete(reportId);
            if (response.success) {
                setMessage({ type: 'success', text: 'Report deleted successfully!' });
                await loadAllData();
            } else {
                setMessage({ type: 'error', text: response.message || 'Failed to delete report' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to delete report. Please try again.' });
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
                        <i className="fas fa-file-alt"></i>
                        Reports Page Content Management
                    </h1>
                    <p style={{ margin: '10px 0 0 0', color: '#666', fontSize: '1rem' }}>
                        Manage all content sections and reports for the Reports page. Add, edit, update, or delete any content.
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
                        onClick={() => setActiveTab('reports')}
                        style={{
                            padding: '12px 25px',
                            background: activeTab === 'reports' ? '#0a2540' : 'transparent',
                            color: activeTab === 'reports' ? 'white' : '#666',
                            border: 'none',
                            borderBottom: activeTab === 'reports' ? '3px solid #0a2540' : '3px solid transparent',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: activeTab === 'reports' ? '600' : '400'
                        }}
                    >
                        <i className="fas fa-list" style={{ marginRight: '8px' }}></i>
                        Reports List
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
                                const response = await adminContentAPI.update(sectionKey, content, 'reports', sectionName);
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
                                const response = await adminContentAPI.update(sectionKey, '', 'reports', sectionKey);
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
                        {/* Reports List */}
                        <div style={{
                            background: 'white',
                            borderRadius: '10px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            marginBottom: '25px',
                            overflow: 'hidden',
                            border: '1px solid #e0e0e0'
                        }}>
                            <div style={{
                                background: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)',
                                color: 'white',
                                padding: '20px 25px'
                            }}>
                                <h3 style={{ margin: 0, fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <i className="fas fa-file-alt"></i>
                                    Reports Management
                                </h3>
                                <p style={{ margin: '8px 0 0 0', opacity: 0.9, fontSize: '0.9rem' }}>
                                    Add, edit, update, or delete reports - All public reports are displayed on the Reports page. Upload PDF documents for each report.
                                </p>
                            </div>
                            <div style={{ padding: '25px' }}>
                                <ItemManager
                                    items={reports}
                                    itemType="report"
                                    fields={[
                                        { key: 'title', label: 'Report Title', type: 'text', required: true },
                                        { key: 'description', label: 'Report Description', type: 'textarea' },
                                        { key: 'report_type', label: 'Report Type', type: 'text', required: true, placeholder: 'e.g., Annual, Quarterly, Monthly, Market Outlook' },
                                        { key: 'file_url', label: 'Report PDF File', type: 'file', required: true, placeholder: 'Upload report PDF document' },
                                        { key: 'year', label: 'Year', type: 'number', required: true },
                                        { key: 'quarter', label: 'Quarter (Optional)', type: 'number', placeholder: '1-4 (for quarterly reports)' },
                                        { key: 'file_size', label: 'File Size (bytes)', type: 'number', placeholder: 'Auto-calculated on upload' },
                                        { key: 'is_public', label: 'Public', type: 'checkbox' }
                                    ]}
                                    onSave={(data, id) => handleReportSave(data, id)}
                                    onDelete={(id) => handleReportDelete(id)}
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
                        <li>Click "Delete" to remove content sections or reports</li>
                        <li>Use "Page Content" tab to edit text sections (title, subtitle, intro, etc.)</li>
                        <li>Use "Reports List" tab to manage individual reports (add, edit, delete)</li>
                        <li><strong>PDF Upload:</strong> Use "Choose Document (PDF)" button to upload report PDF documents</li>
                        <li>Report Type examples: "Annual Report", "Quarterly Report", "Market Outlook", "Investor Presentation"</li>
                        <li>Quarter field is optional - only needed for quarterly reports (1-4)</li>
                        <li>Only public reports are displayed on the public Reports page</li>
                        <li>All changes are saved immediately - refresh the public page to see updates</li>
                        <li><strong>Need sample data?</strong> Visit <a href="/admin/seed-reports-data" style={{ color: '#0d47a1', textDecoration: 'underline' }}>/admin/seed-reports-data</a> to create sample content</li>
                    </ul>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminReports;
