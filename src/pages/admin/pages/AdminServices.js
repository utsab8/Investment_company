import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '../AdminLayout';
import ItemManager from '../components/ItemManager';
import { adminContentAPI, adminUploadAPI, adminServicesAPI } from '../../../services/adminApi';
import '../Admin.css';

const AdminServices = () => {
    const [sections, setSections] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState({});
    const [message, setMessage] = useState({ type: '', text: '' });
    const [editingItem, setEditingItem] = useState(null);
    const [editForm, setEditForm] = useState({ key: '', value: '', type: '' });
    const [uploading, setUploading] = useState({});
    const [imagePreview, setImagePreview] = useState(null);
    const [activeTab, setActiveTab] = useState('content');
    const [showAddSection, setShowAddSection] = useState(false);
    const [newSectionForm, setNewSectionForm] = useState({ key: '', content: '' });
    const fileInputRef = useRef(null);

    useEffect(() => {
        loadAllData();
    }, []);

    const loadAllData = async () => {
        try {
            setLoading(true);
            const [contentResponse, servicesResponse] = await Promise.all([
                adminContentAPI.getAll('services'),
                adminServicesAPI.getAll()
            ]);

            if (contentResponse.success) {
                const data = contentResponse.data || [];
                setSections(Array.isArray(data) ? data : []);
            }

            if (servicesResponse.success) {
                setServices(servicesResponse.data || []);
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to load data' });
        } finally {
            setLoading(false);
        }
    };

    const getSectionValue = (key) => {
        const section = sections.find(s => (s.section_key || s.key) === key);
        return section ? (section.content || section.value || '') : '';
    };

    const handleEdit = (key, value, type) => {
        setEditingItem(key);
        setEditForm({ key, value: value || '', type });
        setImagePreview(value || null);
    };

    const handleCancel = () => {
        setEditingItem(null);
        setEditForm({ key: '', value: '', type: '' });
        setImagePreview(null);
    };

    const handleSave = async () => {
        if (!editForm.value.trim() && editForm.type !== 'image') {
            setMessage({ type: 'error', text: 'Please enter a value' });
            return;
        }

        const saveKey = `save_${editForm.key}`;
        setSaving({ [saveKey]: true });
        setMessage({ type: '', text: '' });

        try {
            const response = await adminContentAPI.update(editForm.key, editForm.value, 'services', editForm.key);
            if (response.success) {
                setMessage({ type: 'success', text: 'Content updated successfully!' });
                handleCancel();
                await loadAllData();
            } else {
                setMessage({ type: 'error', text: response.message || 'Failed to save' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to save' });
        } finally {
            setSaving({ [saveKey]: false });
        }
    };

    const handleDelete = async (section) => {
        if (!window.confirm(`Are you sure you want to delete "${section.section_key || section.key}"?`)) {
            return;
        }

        const deleteKey = `delete_${section.id || section.section_key}`;
        setSaving({ [deleteKey]: true });
        try {
            const response = await adminContentAPI.update(section.section_key || section.key, '', 'services', section.section_key || section.key);
            if (response.success) {
                setMessage({ type: 'success', text: 'Content cleared. To fully delete, backend delete endpoint is needed.' });
                await loadAllData();
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to delete' });
        } finally {
            setSaving({ [deleteKey]: false });
        }
    };

    const handleAddSection = () => {
        setShowAddSection(true);
        setNewSectionForm({ key: '', content: '' });
    };

    const handleCancelAddSection = () => {
        setShowAddSection(false);
        setNewSectionForm({ key: '', content: '' });
    };

    const handleSaveNewSection = async () => {
        if (!newSectionForm.key.trim()) {
            setMessage({ type: 'error', text: 'Please enter a section key' });
            return;
        }

        setSaving({ newSection: true });
        setMessage({ type: '', text: '' });

        try {
            const response = await adminContentAPI.update(
                newSectionForm.key,
                newSectionForm.content,
                'services',
                newSectionForm.key
            );

            if (response.success) {
                setMessage({ type: 'success', text: 'Content section added successfully!' });
                handleCancelAddSection();
                await loadAllData();
            } else {
                setMessage({ type: 'error', text: response.message || 'Failed to save' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to save' });
        } finally {
            setSaving({ newSection: false });
        }
    };

    const handleImageUpload = async (itemKey, file) => {
        if (!file) {
            setMessage({ type: 'error', text: 'No file selected for upload.' });
            return;
        }

        setSaving({ [`upload_${itemKey}`]: true });
        setMessage({ type: '', text: '' });

        try {
            const response = await adminUploadAPI.upload(file, 'services', itemKey);
            if (response.success && response.data.url) {
                setEditForm(prev => ({ ...prev, value: response.data.url }));
                setImagePreview(response.data.url);
                setMessage({ type: 'success', text: 'Image uploaded successfully! Click Save to update.' });
            } else {
                setMessage({ type: 'error', text: response.message || 'Image upload failed.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Image upload failed.' });
        } finally {
            setSaving({ [`upload_${itemKey}`]: false });
        }
    };

    // Handle Services Items
    const handleServiceSave = async (serviceData, serviceId) => {
        const saveKey = `service_${serviceId || 'new'}`;
        setSaving(prev => ({ ...prev, [saveKey]: true }));
        setMessage({ type: '', text: '' });

        try {
            // Explicitly include all fields, especially image_url
            // Make sure to preserve image_url even if it's an empty string (convert to null)
            const imageUrlValue = serviceData.image_url;
            const processedImageUrl = (imageUrlValue && typeof imageUrlValue === 'string' && imageUrlValue.trim()) 
                ? imageUrlValue.trim() 
                : null;

            const data = {
                title: serviceData.title || '',
                description: serviceData.description || '',
                slug: serviceData.slug || '',
                icon: serviceData.icon || null,
                image_url: processedImageUrl, // Explicitly include image_url (null if empty)
                display_order: serviceData.display_order ? parseInt(serviceData.display_order) : 0,
                is_active: Boolean(serviceData.is_active !== undefined ? serviceData.is_active : true)
            };

            // Debug logging
            console.log('=== SAVING SERVICE ===');
            console.log('Raw serviceData:', JSON.stringify(serviceData, null, 2));
            console.log('serviceData.image_url (raw):', serviceData.image_url);
            console.log('serviceData.image_url (type):', typeof serviceData.image_url);
            console.log('Processed data to save:', JSON.stringify(data, null, 2));
            console.log('Final image_url value:', data.image_url);
            console.log('Image URL will be sent?', data.image_url !== null && data.image_url !== undefined);

            let response;
            if (serviceId) {
                response = await adminServicesAPI.update(serviceId, data);
            } else {
                response = await adminServicesAPI.create(data);
            }

            if (response.success) {
                setMessage({ type: 'success', text: `Service ${serviceId ? 'updated' : 'created'} successfully!` });
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

    const handleServiceDelete = async (serviceId) => {
        // Confirmation is handled in ItemManager, so no need for duplicate confirmation here
        const deleteKey = `delete_service_${serviceId}`;
        setSaving(prev => ({ ...prev, [deleteKey]: true }));
        setMessage({ type: '', text: '' });
        
        try {
            console.log('Deleting service with ID:', serviceId);
            const response = await adminServicesAPI.delete(serviceId);
            if (response.success) {
                setMessage({ type: 'success', text: 'Service deleted successfully!' });
                // Reload data to update the list
                await loadAllData();
            } else {
                setMessage({ type: 'error', text: response.message || 'Failed to delete service' });
            }
        } catch (error) {
            console.error('Error deleting service:', error);
            setMessage({ type: 'error', text: error.message || 'Failed to delete service. Please try again.' });
        } finally {
            setSaving(prev => ({ ...prev, [deleteKey]: false }));
        }
    };

    // All services page content sections organized by category
    const servicesPageContent = [
        {
            title: 'Page Header',
            description: 'Main header section at the top of the Services page',
            icon: 'fas fa-heading',
            color: '#0a2540',
            items: [
                { 
                    key: 'page_title', 
                    label: 'Page Title', 
                    type: 'content', 
                    fieldType: 'text',
                    placeholder: 'e.g., Our Services',
                    currentValue: getSectionValue('page_title')
                },
                { 
                    key: 'page_subtitle', 
                    label: 'Page Subtitle', 
                    type: 'content', 
                    fieldType: 'text',
                    placeholder: 'e.g., Discover our comprehensive investment solutions',
                    currentValue: getSectionValue('page_subtitle')
                }
            ]
        }
    ];

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
                        <i className="fas fa-briefcase"></i>
                        Services Page Content Management
                    </h1>
                    <p style={{ margin: '10px 0 0 0', color: '#666', fontSize: '1rem' }}>
                        Manage all content sections and services for the Services page. Add, edit, update, or delete any content.
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
                        onClick={() => setActiveTab('services')}
                        style={{
                            padding: '12px 25px',
                            background: activeTab === 'services' ? '#0a2540' : 'transparent',
                            color: activeTab === 'services' ? 'white' : '#666',
                            border: 'none',
                            borderBottom: activeTab === 'services' ? '3px solid #0a2540' : '3px solid transparent',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: activeTab === 'services' ? '600' : '400'
                        }}
                    >
                        <i className="fas fa-list" style={{ marginRight: '8px' }}></i>
                        Services List
                    </button>
                </div>

                {activeTab === 'content' ? (
                    <>
                        {/* Add New Section Button */}
                        <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                            <div style={{ flex: 1, minWidth: '200px' }}>
                                <h2 style={{ margin: 0, color: '#0a2540', fontSize: '1.5rem' }}>Content Sections</h2>
                                <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '0.9rem' }}>
                                    Manage predefined sections or add custom content sections
                                </p>
                            </div>
                            <button
                                onClick={handleAddSection}
                                style={{
                                    padding: '10px 20px',
                                    background: '#0a2540',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontSize: '0.95rem',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                    transition: 'all 0.3s',
                                    whiteSpace: 'nowrap'
                                }}
                                onMouseEnter={(e) => e.target.style.background = '#1a4a6a'}
                                onMouseLeave={(e) => e.target.style.background = '#0a2540'}
                            >
                                <i className="fas fa-plus"></i>
                                Add Custom Section
                            </button>
                        </div>

                        {/* Add New Section Form */}
                        {showAddSection && (
                            <div style={{
                                background: 'linear-gradient(135deg, #fff3cd 0%, #ffe69c 100%)',
                                padding: '25px',
                                borderRadius: '8px',
                                marginBottom: '30px',
                                border: '2px solid #ffc107',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}>
                                <h3 style={{ marginTop: 0, color: '#856404', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <i className="fas fa-plus-circle"></i>
                                    Add New Custom Content Section
                                </h3>
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#856404' }}>
                                        Section Key * (e.g., custom_section_1, new_feature_title)
                                    </label>
                                    <input
                                        type="text"
                                        value={newSectionForm.key}
                                        onChange={(e) => setNewSectionForm({ ...newSectionForm, key: e.target.value })}
                                        placeholder="custom_section_1"
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '2px solid #ffc107',
                                            borderRadius: '5px',
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                    <small style={{ color: '#856404', fontSize: '0.85rem', display: 'block', marginTop: '5px' }}>
                                        Use lowercase letters, numbers, and underscores only
                                    </small>
                                </div>
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#856404' }}>
                                        Content *
                                    </label>
                                    <textarea
                                        value={newSectionForm.content}
                                        onChange={(e) => setNewSectionForm({ ...newSectionForm, content: e.target.value })}
                                        rows="8"
                                        placeholder="Enter content here... (HTML is supported)"
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            border: '2px solid #ffc107',
                                            borderRadius: '5px',
                                            fontSize: '0.95rem',
                                            fontFamily: 'inherit',
                                            resize: 'vertical'
                                        }}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        onClick={handleSaveNewSection}
                                        disabled={saving.newSection || !newSectionForm.key.trim() || !newSectionForm.content.trim()}
                                        style={{
                                            padding: '10px 25px',
                                            background: '#28a745',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '5px',
                                            cursor: saving.newSection ? 'not-allowed' : 'pointer',
                                            fontSize: '0.95rem',
                                            fontWeight: '600',
                                            opacity: saving.newSection ? 0.6 : 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}
                                    >
                                        <i className="fas fa-save"></i>
                                        {saving.newSection ? 'Saving...' : 'Save Section'}
                                    </button>
                                    <button
                                        onClick={handleCancelAddSection}
                                        disabled={saving.newSection}
                                        style={{
                                            padding: '10px 25px',
                                            background: '#6c757d',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            fontSize: '0.95rem',
                                            fontWeight: '600'
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Predefined Content Sections */}
                        {servicesPageContent.map((category, catIndex) => (
                            <div key={catIndex} style={{
                                background: 'white',
                                borderRadius: '10px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                marginBottom: '25px',
                                overflow: 'hidden',
                                border: '1px solid #e0e0e0'
                            }}>
                                {/* Category Header */}
                                <div style={{
                                    background: `linear-gradient(135deg, ${category.color} 0%, ${category.color}dd 100%)`,
                                    color: 'white',
                                    padding: '20px 25px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '15px'
                                }}>
                                    <div style={{
                                        width: '50px',
                                        height: '50px',
                                        background: 'rgba(255,255,255,0.2)',
                                        borderRadius: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.5rem'
                                    }}>
                                        <i className={category.icon}></i>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '600' }}>
                                            {category.title}
                                        </h3>
                                        <p style={{ margin: '5px 0 0 0', opacity: 0.9, fontSize: '0.9rem' }}>
                                            {category.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Category Items */}
                                <div style={{ padding: '25px' }}>
                                    {category.items.map((item, itemIndex) => {
                                        const isEditing = editingItem === item.key;
                                        const currentValue = item.currentValue || '';

                                        return (
                                            <div key={itemIndex} style={{
                                                marginBottom: itemIndex < category.items.length - 1 ? '25px' : 0,
                                                paddingBottom: itemIndex < category.items.length - 1 ? '25px' : 0,
                                                borderBottom: itemIndex < category.items.length - 1 ? '1px solid #e0e0e0' : 'none'
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '20px', flexWrap: 'wrap' }}>
                                                    <div style={{ flex: 1, minWidth: '300px' }}>
                                                        <label style={{ 
                                                            display: 'block', 
                                                            marginBottom: '10px', 
                                                            fontWeight: 'bold', 
                                                            color: '#0a2540',
                                                            fontSize: '1rem'
                                                        }}>
                                                            {item.label}
                                                            <span style={{ 
                                                                marginLeft: '10px', 
                                                                padding: '3px 10px', 
                                                                background: '#fff3cd', 
                                                                color: '#856404', 
                                                                borderRadius: '4px', 
                                                                fontSize: '0.75rem',
                                                                fontWeight: '600'
                                                            }}>
                                                                CONTENT
                                                            </span>
                                                        </label>

                                                        {isEditing ? (
                                                            <div>
                                                                {item.fieldType === 'textarea' ? (
                                                                    <textarea
                                                                        value={editForm.value}
                                                                        onChange={(e) => setEditForm({ ...editForm, value: e.target.value })}
                                                                        rows="6"
                                                                        placeholder={item.placeholder}
                                                                        style={{
                                                                            width: '100%',
                                                                            padding: '12px',
                                                                            border: '2px solid #0a2540',
                                                                            borderRadius: '6px',
                                                                            fontSize: '0.95rem',
                                                                            fontFamily: 'inherit',
                                                                            resize: 'vertical',
                                                                            boxSizing: 'border-box'
                                                                        }}
                                                                    />
                                                                ) : item.fieldType === 'image' ? (
                                                                    <div>
                                                                        <input
                                                                            type="file"
                                                                            ref={fileInputRef}
                                                                            style={{ display: 'none' }}
                                                                            accept="image/*"
                                                                            onChange={(e) => handleImageUpload(item.key, e.target.files[0])}
                                                                        />
                                                                        <button
                                                                            onClick={() => fileInputRef.current.click()}
                                                                            disabled={saving[`upload_${item.key}`]}
                                                                            style={{
                                                                                padding: '10px 20px',
                                                                                background: '#0a2540',
                                                                                color: 'white',
                                                                                border: 'none',
                                                                                borderRadius: '6px',
                                                                                cursor: saving[`upload_${item.key}`] ? 'not-allowed' : 'pointer',
                                                                                fontSize: '0.9rem',
                                                                                fontWeight: '600',
                                                                                opacity: saving[`upload_${item.key}`] ? 0.6 : 1,
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                gap: '8px',
                                                                                whiteSpace: 'nowrap',
                                                                                marginBottom: '10px'
                                                                            }}
                                                                        >
                                                                            <i className="fas fa-upload"></i>
                                                                            {saving[`upload_${item.key}`] ? 'Uploading...' : 'Choose Image from Device'}
                                                                        </button>
                                                                        <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: '#666' }}>
                                                                            or enter URL below:
                                                                        </p>
                                                                        <input
                                                                            type="text"
                                                                            value={editForm.value}
                                                                            onChange={(e) => setEditForm({ ...editForm, value: e.target.value })}
                                                                            placeholder={item.placeholder}
                                                                            style={{
                                                                                width: '100%',
                                                                                padding: '12px',
                                                                                border: '2px solid #0a2540',
                                                                                borderRadius: '6px',
                                                                                fontSize: '0.95rem',
                                                                                boxSizing: 'border-box'
                                                                            }}
                                                                        />
                                                                        {imagePreview && (
                                                                            <div style={{ marginTop: '10px' }}>
                                                                                <img 
                                                                                    src={imagePreview} 
                                                                                    alt="Preview" 
                                                                                    style={{
                                                                                        maxWidth: '100%',
                                                                                        maxHeight: '200px',
                                                                                        borderRadius: '6px',
                                                                                        border: '1px solid #ddd'
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <input
                                                                        type="text"
                                                                        value={editForm.value}
                                                                        onChange={(e) => setEditForm({ ...editForm, value: e.target.value })}
                                                                        placeholder={item.placeholder}
                                                                        style={{
                                                                            width: '100%',
                                                                            padding: '12px',
                                                                            border: '2px solid #0a2540',
                                                                            borderRadius: '6px',
                                                                            fontSize: '0.95rem',
                                                                            boxSizing: 'border-box'
                                                                        }}
                                                                    />
                                                                )}
                                                                <div style={{ display: 'flex', gap: '10px', marginTop: '12px', flexWrap: 'wrap' }}>
                                                                    <button
                                                                        onClick={handleSave}
                                                                        disabled={saving[`save_${item.key}`]}
                                                                        style={{
                                                                            padding: '10px 20px',
                                                                            background: '#28a745',
                                                                            color: 'white',
                                                                            border: 'none',
                                                                            borderRadius: '6px',
                                                                            cursor: saving[`save_${item.key}`] ? 'not-allowed' : 'pointer',
                                                                            fontSize: '0.9rem',
                                                                            fontWeight: '600',
                                                                            opacity: saving[`save_${item.key}`] ? 0.6 : 1,
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            gap: '8px',
                                                                            whiteSpace: 'nowrap'
                                                                        }}
                                                                    >
                                                                        <i className="fas fa-save"></i>
                                                                        {saving[`save_${item.key}`] ? 'Saving...' : 'Save Changes'}
                                                                    </button>
                                                                    <button
                                                                        onClick={handleCancel}
                                                                        disabled={saving[`save_${item.key}`]}
                                                                        style={{
                                                                            padding: '10px 20px',
                                                                            background: '#6c757d',
                                                                            color: 'white',
                                                                            border: 'none',
                                                                            borderRadius: '6px',
                                                                            cursor: 'pointer',
                                                                            fontSize: '0.9rem',
                                                                            fontWeight: '600',
                                                                            whiteSpace: 'nowrap'
                                                                        }}
                                                                    >
                                                                        <i className="fas fa-times"></i> Cancel
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div style={{
                                                                color: '#666',
                                                                fontSize: '0.95rem',
                                                                whiteSpace: 'pre-wrap',
                                                                lineHeight: '1.6',
                                                                background: '#f8f9fa',
                                                                padding: '15px',
                                                                borderRadius: '6px',
                                                                border: '1px solid #e0e0e0',
                                                                minHeight: item.fieldType === 'textarea' ? '80px' : 'auto',
                                                                wordBreak: 'break-word'
                                                            }}>
                                                                {currentValue || (
                                                                    <span style={{ color: '#999', fontStyle: 'italic' }}>
                                                                        <i className="fas fa-exclamation-circle" style={{ marginRight: '5px' }}></i>
                                                                        Not set - click Edit to add content
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                    {!isEditing && (
                                                        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                                                            <button
                                                                onClick={() => handleEdit(item.key, currentValue, item.type)}
                                                                style={{
                                                                    padding: '10px 20px',
                                                                    background: '#0a2540',
                                                                    color: 'white',
                                                                    border: 'none',
                                                                    borderRadius: '6px',
                                                                    cursor: 'pointer',
                                                                    fontSize: '0.9rem',
                                                                    fontWeight: '600',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '8px',
                                                                    whiteSpace: 'nowrap',
                                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                                    transition: 'all 0.3s'
                                                                }}
                                                                onMouseEnter={(e) => e.target.style.background = '#1a4a6a'}
                                                                onMouseLeave={(e) => e.target.style.background = '#0a2540'}
                                                            >
                                                                <i className="fas fa-edit"></i>
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    const section = sections.find(s => (s.section_key || s.key) === item.key);
                                                                    if (section) {
                                                                        handleDelete(section);
                                                                    }
                                                                }}
                                                                disabled={saving[`delete_${sections.find(s => (s.section_key || s.key) === item.key)?.id || item.key}`]}
                                                                style={{
                                                                    padding: '10px 20px',
                                                                    background: '#dc3545',
                                                                    color: 'white',
                                                                    border: 'none',
                                                                    borderRadius: '6px',
                                                                    cursor: 'pointer',
                                                                    fontSize: '0.9rem',
                                                                    fontWeight: '600',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '8px',
                                                                    whiteSpace: 'nowrap',
                                                                    opacity: saving[`delete_${sections.find(s => (s.section_key || s.key) === item.key)?.id || item.key}`] ? 0.6 : 1
                                                                }}
                                                            >
                                                                <i className="fas fa-trash"></i>
                                                                Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}

                        {/* Custom Sections */}
                        {sections.filter(s => {
                            const predefinedKeys = servicesPageContent.flatMap(cat => cat.items.map(i => i.key));
                            return !predefinedKeys.includes(s.section_key || s.key);
                        }).length > 0 && (
                            <div style={{
                                background: 'white',
                                borderRadius: '10px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                marginTop: '30px',
                                overflow: 'hidden',
                                border: '1px solid #e0e0e0'
                            }}>
                                <div style={{
                                    background: 'linear-gradient(135deg, #6c757d 0%, #5a6268 100%)',
                                    color: 'white',
                                    padding: '20px 25px'
                                }}>
                                    <h3 style={{ margin: 0, fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <i className="fas fa-code"></i>
                                        Custom Content Sections
                                    </h3>
                                    <p style={{ margin: '8px 0 0 0', opacity: 0.9, fontSize: '0.9rem' }}>
                                        Additional custom sections you've added
                                    </p>
                                </div>
                                <div style={{ padding: '25px' }}>
                                    {sections
                                        .filter(s => {
                                            const predefinedKeys = servicesPageContent.flatMap(cat => cat.items.map(i => i.key));
                                            return !predefinedKeys.includes(s.section_key || s.key);
                                        })
                                        .map((section, index) => {
                                            const isEditing = editingItem === (section.id || section.section_key);
                                            const sectionKey = section.section_key || section.key;
                                            const sectionContent = section.content || section.value || '';

                                            return (
                                                <div key={index} style={{
                                                    marginBottom: index < sections.filter(s => {
                                                        const predefinedKeys = servicesPageContent.flatMap(cat => cat.items.map(i => i.key));
                                                        return !predefinedKeys.includes(s.section_key || s.key);
                                                    }).length - 1 ? '20px' : 0,
                                                    paddingBottom: index < sections.filter(s => {
                                                        const predefinedKeys = servicesPageContent.flatMap(cat => cat.items.map(i => i.key));
                                                        return !predefinedKeys.includes(s.section_key || s.key);
                                                    }).length - 1 ? '20px' : 0,
                                                    borderBottom: index < sections.filter(s => {
                                                        const predefinedKeys = servicesPageContent.flatMap(cat => cat.items.map(i => i.key));
                                                        return !predefinedKeys.includes(s.section_key || s.key);
                                                    }).length - 1 ? '1px solid #e0e0e0' : 'none',
                                                    background: isEditing ? '#fff3cd' : '#f8f9fa',
                                                    padding: '20px',
                                                    borderRadius: '5px',
                                                    border: isEditing ? '2px solid #ffc107' : '1px solid #e0e0e0'
                                                }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '20px', flexWrap: 'wrap' }}>
                                                        <div style={{ flex: 1, minWidth: '300px' }}>
                                                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#0a2540' }}>
                                                                {sectionKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                            </label>
                                                            {isEditing ? (
                                                                <div>
                                                                    <input
                                                                        type="text"
                                                                        value={editForm.key}
                                                                        disabled
                                                                        style={{
                                                                            width: '100%',
                                                                            padding: '8px',
                                                                            border: '1px solid #ddd',
                                                                            borderRadius: '4px',
                                                                            background: '#f5f5f5',
                                                                            marginBottom: '10px',
                                                                            fontSize: '0.9rem'
                                                                        }}
                                                                    />
                                                                    <textarea
                                                                        value={editForm.value}
                                                                        onChange={(e) => setEditForm({ ...editForm, value: e.target.value })}
                                                                        rows="6"
                                                                        style={{
                                                                            width: '100%',
                                                                            padding: '12px',
                                                                            border: '2px solid #0a2540',
                                                                            borderRadius: '5px',
                                                                            fontSize: '0.95rem',
                                                                            fontFamily: 'inherit',
                                                                            resize: 'vertical'
                                                                        }}
                                                                    />
                                                                    <div style={{ display: 'flex', gap: '10px', marginTop: '12px', flexWrap: 'wrap' }}>
                                                                        <button
                                                                            onClick={handleSave}
                                                                            disabled={saving[`save_${sectionKey}`]}
                                                                            style={{
                                                                                padding: '8px 20px',
                                                                                background: '#28a745',
                                                                                color: 'white',
                                                                                border: 'none',
                                                                                borderRadius: '5px',
                                                                                cursor: saving[`save_${sectionKey}`] ? 'not-allowed' : 'pointer',
                                                                                fontSize: '0.9rem',
                                                                                fontWeight: '600',
                                                                                opacity: saving[`save_${sectionKey}`] ? 0.6 : 1
                                                                            }}
                                                                        >
                                                                            <i className="fas fa-save"></i> Save
                                                                        </button>
                                                                        <button
                                                                            onClick={handleCancel}
                                                                            disabled={saving[`save_${sectionKey}`]}
                                                                            style={{
                                                                                padding: '8px 20px',
                                                                                background: '#6c757d',
                                                                                color: 'white',
                                                                                border: 'none',
                                                                                borderRadius: '5px',
                                                                                cursor: 'pointer',
                                                                                fontSize: '0.9rem'
                                                                            }}
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div style={{
                                                                    color: '#666',
                                                                    fontSize: '0.95rem',
                                                                    whiteSpace: 'pre-wrap',
                                                                    lineHeight: '1.6',
                                                                    background: 'white',
                                                                    padding: '15px',
                                                                    borderRadius: '5px',
                                                                    border: '1px solid #e0e0e0',
                                                                    minHeight: '60px'
                                                                }}>
                                                                    {sectionContent || '(Empty)'}
                                                                </div>
                                                            )}
                                                        </div>
                                                        {!isEditing && (
                                                            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                                                                <button
                                                                    onClick={() => handleEdit(sectionKey, sectionContent, 'content')}
                                                                    style={{
                                                                        padding: '8px 16px',
                                                                        background: '#0a2540',
                                                                        color: 'white',
                                                                        border: 'none',
                                                                        borderRadius: '5px',
                                                                        cursor: 'pointer',
                                                                        fontSize: '0.85rem',
                                                                        fontWeight: '600',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: '6px',
                                                                        whiteSpace: 'nowrap'
                                                                    }}
                                                                >
                                                                    <i className="fas fa-edit"></i>
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(section)}
                                                                    disabled={saving[`delete_${section.id || sectionKey}`]}
                                                                    style={{
                                                                        padding: '8px 16px',
                                                                        background: '#dc3545',
                                                                        color: 'white',
                                                                        border: 'none',
                                                                        borderRadius: '5px',
                                                                        cursor: 'pointer',
                                                                        fontSize: '0.85rem',
                                                                        fontWeight: '600',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: '6px',
                                                                        opacity: saving[`delete_${section.id || sectionKey}`] ? 0.6 : 1,
                                                                        whiteSpace: 'nowrap'
                                                                    }}
                                                                >
                                                                    <i className="fas fa-trash"></i>
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div>
                        {/* Services List */}
                        <div style={{
                            background: 'white',
                            borderRadius: '10px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            marginBottom: '25px',
                            overflow: 'hidden',
                            border: '1px solid #e0e0e0'
                        }}>
                            <div style={{
                                background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                                color: 'white',
                                padding: '20px 25px'
                            }}>
                                <h3 style={{ margin: 0, fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <i className="fas fa-briefcase"></i>
                                    Services Management
                                </h3>
                                <p style={{ margin: '8px 0 0 0', opacity: 0.9, fontSize: '0.9rem' }}>
                                    Add, edit, update, or delete services - All services are displayed on the Services page. Images are required for each service (icons have been removed).
                                </p>
                            </div>
                            <div style={{ padding: '25px' }}>
                                <ItemManager
                                    items={services}
                                    itemType="service"
                                    fields={[
                                        { key: 'title', label: 'Service Title', type: 'text', required: true },
                                        { key: 'description', label: 'Service Description', type: 'textarea', required: true },
                                        { key: 'image_url', label: 'Service Image', type: 'image', required: true },
                                        { key: 'display_order', label: 'Display Order', type: 'number' },
                                        { key: 'is_active', label: 'Active', type: 'checkbox' }
                                    ]}
                                    onSave={(data, id) => handleServiceSave(data, id)}
                                    onDelete={(id) => handleServiceDelete(id)}
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
                        <li>Click "Delete" to remove content sections or services</li>
                        <li>Use "Page Content" tab to edit text sections (title, subtitle, etc.)</li>
                        <li>Use "Services List" tab to manage individual services (add, edit, delete)</li>
                        <li><strong>Important:</strong> Service Image URL is required - use "Choose Image" button to upload images</li>
                        <li>You can add unlimited custom content sections</li>
                        <li>All changes are saved immediately and appear on the website</li>
                    </ul>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminServices;
