import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '../AdminLayout';
import ContentSectionManager from '../components/ContentSectionManager';
import ItemManager from '../components/ItemManager';
import { adminContentAPI, adminProcessItemsAPI } from '../../../services/adminApi';
import '../Admin.css';

const AdminProcess = () => {
    const [sections, setSections] = useState([]);
    const [processSteps, setProcessSteps] = useState([]);
    const [riskManagementItems, setRiskManagementItems] = useState([]);
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
            const [contentResponse, stepsResponse, riskResponse] = await Promise.all([
                adminContentAPI.getAll('process'),
                adminProcessItemsAPI.getAll('step'),
                adminProcessItemsAPI.getAll('risk_management')
            ]);

            if (contentResponse.success) {
                const data = contentResponse.data || [];
                setSections(Array.isArray(data) ? data : []);
            }

            if (stepsResponse.success) {
                setProcessSteps(stepsResponse.data || []);
            }

            if (riskResponse.success) {
                setRiskManagementItems(riskResponse.data || []);
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to load data' });
        } finally {
            setLoading(false);
        }
    };

    const handleProcessItemSave = async (itemData, itemId, itemType) => {
        const saveKey = `${itemType}_${itemId || 'new'}`;
        setSaving(prev => ({ ...prev, [saveKey]: true }));
        setMessage({ type: '', text: '' });

        try {
            const data = {
                item_type: itemType,
                title: itemData.title || '',
                subtitle: itemData.subtitle || null,
                description: itemData.description || null,
                image_url: itemData.image_url || null,
                icon: itemData.icon || null,
                step_number: itemData.step_number ? parseInt(itemData.step_number) : null,
                display_order: itemData.display_order ? parseInt(itemData.display_order) : 0,
                is_active: Boolean(itemData.is_active !== undefined ? itemData.is_active : true)
            };

            let response;
            if (itemId) {
                response = await adminProcessItemsAPI.update(itemId, data);
            } else {
                response = await adminProcessItemsAPI.create(data);
            }

            if (response.success) {
                setMessage({ type: 'success', text: `Process item ${itemId ? 'updated' : 'created'} successfully!` });
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

    const handleProcessItemDelete = async (itemId, itemType) => {
        const deleteKey = `delete_${itemType}_${itemId}`;
        setSaving(prev => ({ ...prev, [deleteKey]: true }));
        setMessage({ type: '', text: '' });
        
        try {
            const response = await adminProcessItemsAPI.delete(itemId);
            if (response.success) {
                setMessage({ type: 'success', text: 'Process item deleted successfully!' });
                await loadAllData();
            } else {
                setMessage({ type: 'error', text: response.message || 'Failed to delete' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to delete. Please try again.' });
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
                        <i className="fas fa-cogs"></i>
                        Process Page Content Management
                    </h1>
                    <p style={{ margin: '10px 0 0 0', color: '#666', fontSize: '1rem' }}>
                        Manage all content sections, process steps, and risk management items for the Process page. Add, edit, update, or delete any content.
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
                        onClick={() => setActiveTab('steps')}
                        style={{
                            padding: '12px 25px',
                            background: activeTab === 'steps' ? '#0a2540' : 'transparent',
                            color: activeTab === 'steps' ? 'white' : '#666',
                            border: 'none',
                            borderBottom: activeTab === 'steps' ? '3px solid #0a2540' : '3px solid transparent',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: activeTab === 'steps' ? '600' : '400',
                            marginRight: '10px'
                        }}
                    >
                        <i className="fas fa-list-ol" style={{ marginRight: '8px' }}></i>
                        Process Steps
                    </button>
                    <button
                        onClick={() => setActiveTab('risk')}
                        style={{
                            padding: '12px 25px',
                            background: activeTab === 'risk' ? '#0a2540' : 'transparent',
                            color: activeTab === 'risk' ? 'white' : '#666',
                            border: 'none',
                            borderBottom: activeTab === 'risk' ? '3px solid #0a2540' : '3px solid transparent',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: activeTab === 'risk' ? '600' : '400'
                        }}
                    >
                        <i className="fas fa-shield-alt" style={{ marginRight: '8px' }}></i>
                        Risk Management
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
                                
                                // Get section name for display
                                const sectionName = sections.find(s => (s.section_key || s.key) === sectionKey)?.section_name || sectionKey;
                                
                                const response = await adminContentAPI.update(sectionKey, content, 'process', sectionName);
                                if (response.success) {
                                    setMessage({ type: 'success', text: 'Content saved successfully! Page will refresh to show updates.' });
                                    // Reload data after a short delay to ensure backend is updated
                                    setTimeout(async () => {
                                        await loadAllData();
                                    }, 500);
                                } else {
                                    setMessage({ type: 'error', text: response.message || 'Failed to save' });
                                }
                                setSaving(prev => ({ ...prev, [saveKey]: false }));
                            } catch (error) {
                                console.error('Error saving content:', error);
                                setMessage({ type: 'error', text: error.message || 'Failed to save' });
                                setSaving(prev => ({ ...prev, [`save_${sectionKey}`]: false }));
                            }
                        }}
                        onDelete={async (sectionKey) => {
                            try {
                                const deleteKey = `delete_${sectionKey}`;
                                setSaving(prev => ({ ...prev, [deleteKey]: true }));
                                const response = await adminContentAPI.update(sectionKey, '', 'process', sectionKey);
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
                ) : activeTab === 'steps' ? (
                    <div>
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
                                    <i className="fas fa-list-ol"></i>
                                    Process Steps Management
                                </h3>
                                <p style={{ margin: '8px 0 0 0', opacity: 0.9, fontSize: '0.9rem' }}>
                                    Add, edit, update, or delete process steps - All steps are displayed in sequence on the Process page. Step numbers determine the order.
                                </p>
                            </div>
                            <div style={{ padding: '25px' }}>
                                <ItemManager
                                    items={processSteps}
                                    itemType="process_step"
                                    fields={[
                                        { key: 'title', label: 'Step Title', type: 'text', required: true },
                                        { key: 'description', label: 'Step Description', type: 'textarea', required: true },
                                        { key: 'step_number', label: 'Step Number', type: 'number', placeholder: 'e.g., 1, 2, 3, 4' },
                                        { key: 'image_url', label: 'Step Image (Optional)', type: 'image' },
                                        { key: 'display_order', label: 'Display Order', type: 'number' },
                                        { key: 'is_active', label: 'Active', type: 'checkbox' }
                                    ]}
                                    onSave={(data, id) => handleProcessItemSave(data, id, 'step')}
                                    onDelete={(id) => handleProcessItemDelete(id, 'step')}
                                    saving={Object.values(saving).some(val => val === true)}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div style={{
                            background: 'white',
                            borderRadius: '10px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            marginBottom: '25px',
                            overflow: 'hidden',
                            border: '1px solid #e0e0e0'
                        }}>
                            <div style={{
                                background: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)',
                                color: 'white',
                                padding: '20px 25px'
                            }}>
                                <h3 style={{ margin: 0, fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <i className="fas fa-shield-alt"></i>
                                    Risk Management Items
                                </h3>
                                <p style={{ margin: '8px 0 0 0', opacity: 0.9, fontSize: '0.9rem' }}>
                                    Add, edit, update, or delete risk management items - These items are displayed in the Risk Management section of the Process page.
                                </p>
                            </div>
                            <div style={{ padding: '25px' }}>
                                <ItemManager
                                    items={riskManagementItems}
                                    itemType="risk_management"
                                    fields={[
                                        { key: 'title', label: 'Item Title', type: 'text', required: true },
                                        { key: 'description', label: 'Item Description', type: 'textarea', required: true },
                                        { key: 'subtitle', label: 'Subtitle (Optional)', type: 'text' },
                                        { key: 'image_url', label: 'Item Image (Optional)', type: 'image' },
                                        { key: 'display_order', label: 'Display Order', type: 'number' },
                                        { key: 'is_active', label: 'Active', type: 'checkbox' }
                                    ]}
                                    onSave={(data, id) => handleProcessItemSave(data, id, 'risk_management')}
                                    onDelete={(id) => handleProcessItemDelete(id, 'risk_management')}
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
                        <li>Click "Delete" to remove content sections or items</li>
                        <li>Use "Page Content" tab to edit text sections (title, subtitle, intro, etc.)</li>
                        <li>Use "Process Steps" tab to manage individual process steps (add, edit, delete)</li>
                        <li>Use "Risk Management" tab to manage risk management items</li>
                        <li>Step numbers determine the display order for process steps</li>
                        <li>Display order can be used to customize the order of items</li>
                        <li>All changes are saved immediately - refresh the public page to see updates</li>
                        <li><strong>Need dummy data?</strong> Visit <a href="/admin/seed-process-data" style={{ color: '#0d47a1', textDecoration: 'underline' }}>/admin/seed-process-data</a> to create sample content</li>
                    </ul>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminProcess;
