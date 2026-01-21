import React, { useState, useEffect } from 'react';
import AdminLayout from '../AdminLayout';
import ContentSectionManager from '../components/ContentSectionManager';
import ItemManager from '../components/ItemManager';
import { adminContentAPI, adminProjectsAPI } from '../../../services/adminApi';
import '../Admin.css';

const AdminProjects = () => {
    const [sections, setSections] = useState([]);
    const [projects, setProjects] = useState([]);
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
            const [contentResponse, projectsResponse] = await Promise.all([
                adminContentAPI.getAll('projects'),
                adminProjectsAPI.getAll()
            ]);
            
            if (contentResponse.success) {
                const data = contentResponse.data || [];
                setSections(Array.isArray(data) ? data : []);
            }
            
            if (projectsResponse.success) {
                setProjects(projectsResponse.data || []);
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to load data' });
        } finally {
            setLoading(false);
        }
    };

    const handleProjectSave = async (projectData, projectId) => {
        const saveKey = `project_${projectId || 'new'}`;
        setSaving(prev => ({ ...prev, [saveKey]: true }));
        setMessage({ type: '', text: '' });

        try {
            // Process image and PDF URLs - ensure they're not empty strings
            const imageUrl = (projectData.image_url && typeof projectData.image_url === 'string' && projectData.image_url.trim()) 
                ? projectData.image_url.trim() 
                : null;
            const pdfUrl = (projectData.pdf_url && typeof projectData.pdf_url === 'string' && projectData.pdf_url.trim()) 
                ? projectData.pdf_url.trim() 
                : null;

            const data = {
                title: projectData.title || '',
                client: projectData.client || '',
                category: projectData.category || '',
                year: projectData.year ? parseInt(projectData.year) : new Date().getFullYear(),
                description: projectData.description || '',
                image_url: imageUrl,
                pdf_url: pdfUrl,
                amount_managed: projectData.amount_managed ? parseFloat(projectData.amount_managed) : null,
                roi_percentage: projectData.roi_percentage ? parseFloat(projectData.roi_percentage) : null,
                is_featured: Boolean(projectData.is_featured !== undefined ? projectData.is_featured : false),
                is_active: Boolean(projectData.is_active !== undefined ? projectData.is_active : true)
            };

            let response;
            if (projectId) {
                response = await adminProjectsAPI.update(projectId, data);
            } else {
                response = await adminProjectsAPI.create(data);
            }

            if (response.success) {
                setMessage({ type: 'success', text: `Project ${projectId ? 'updated' : 'created'} successfully!` });
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

    const handleProjectDelete = async (projectId) => {
        // Confirmation is handled in ItemManager
        const deleteKey = `delete_project_${projectId}`;
        setSaving(prev => ({ ...prev, [deleteKey]: true }));
        setMessage({ type: '', text: '' });
        
        try {
            const response = await adminProjectsAPI.delete(projectId);
            if (response.success) {
                setMessage({ type: 'success', text: 'Project deleted successfully!' });
                await loadAllData();
            } else {
                setMessage({ type: 'error', text: response.message || 'Failed to delete project' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to delete project. Please try again.' });
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
                        <i className="fas fa-project-diagram"></i>
                        Projects Page Content Management
                    </h1>
                    <p style={{ margin: '10px 0 0 0', color: '#666', fontSize: '1rem' }}>
                        Manage all content sections and projects for the Projects page. Add, edit, update, or delete any content.
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
                        onClick={() => setActiveTab('projects')}
                        style={{
                            padding: '12px 25px',
                            background: activeTab === 'projects' ? '#0a2540' : 'transparent',
                            color: activeTab === 'projects' ? 'white' : '#666',
                            border: 'none',
                            borderBottom: activeTab === 'projects' ? '3px solid #0a2540' : '3px solid transparent',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: activeTab === 'projects' ? '600' : '400'
                        }}
                    >
                        <i className="fas fa-list" style={{ marginRight: '8px' }}></i>
                        Projects List
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
                                const response = await adminContentAPI.update(sectionKey, content, 'projects', sectionName);
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
                                const response = await adminContentAPI.update(sectionKey, '', 'projects', sectionKey);
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
                        {/* Projects List */}
                        <div style={{
                            background: 'white',
                            borderRadius: '10px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            marginBottom: '25px',
                            overflow: 'hidden',
                            border: '1px solid #e0e0e0'
                        }}>
                            <div style={{
                                background: 'linear-gradient(135deg, #6f42c1 0%, #5a32a3 100%)',
                                color: 'white',
                                padding: '20px 25px'
                            }}>
                                <h3 style={{ margin: 0, fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <i className="fas fa-project-diagram"></i>
                                    Projects Management
                                </h3>
                                <p style={{ margin: '8px 0 0 0', opacity: 0.9, fontSize: '0.9rem' }}>
                                    Add, edit, update, or delete projects - All projects are displayed on the Projects page. Upload project images and PDF documents.
                                </p>
                            </div>
                            <div style={{ padding: '25px' }}>
                                <ItemManager
                                    items={projects}
                                    itemType="project"
                                    fields={[
                                        { key: 'title', label: 'Project Title', type: 'text', required: true },
                                        { key: 'client', label: 'Client Name', type: 'text', required: true },
                                        { key: 'category', label: 'Category', type: 'text', required: true, placeholder: 'e.g., Venture Capital, Real Estate' },
                                        { key: 'year', label: 'Year', type: 'number', required: true },
                                        { key: 'description', label: 'Project Description', type: 'textarea', required: true },
                                        { key: 'image_url', label: 'Project Image', type: 'image' },
                                        { key: 'pdf_url', label: 'Project PDF Document', type: 'file', placeholder: 'Upload project PDF document' },
                                        { key: 'amount_managed', label: 'Amount Managed ($)', type: 'number', placeholder: 'e.g., 50000000' },
                                        { key: 'roi_percentage', label: 'ROI Percentage (%)', type: 'number', placeholder: 'e.g., 35.5' },
                                        { key: 'is_featured', label: 'Featured Project', type: 'checkbox' },
                                        { key: 'is_active', label: 'Active', type: 'checkbox' }
                                    ]}
                                    onSave={(data, id) => handleProjectSave(data, id)}
                                    onDelete={(id) => handleProjectDelete(id)}
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
                        <li>Click "Delete" to remove content sections or projects</li>
                        <li>Use "Page Content" tab to edit text sections (title, subtitle, intro, etc.)</li>
                        <li>Use "Projects List" tab to manage individual projects (add, edit, delete)</li>
                        <li><strong>Image Upload:</strong> Use "Choose Image" button to upload project images</li>
                        <li><strong>PDF Upload:</strong> Use "Choose Document" button to upload project PDF documents</li>
                        <li>Featured projects are highlighted on the public Projects page</li>
                        <li>Only active projects are displayed on the public page</li>
                        <li>All changes are saved immediately - refresh the public page to see updates</li>
                    </ul>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminProjects;
