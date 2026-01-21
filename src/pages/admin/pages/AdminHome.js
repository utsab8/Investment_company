import React, { useState, useEffect } from 'react';
import AdminLayout from '../AdminLayout';
import { adminContentAPI, adminSettingsAPI, adminUploadAPI } from '../../../services/adminApi';
import '../Admin.css';

const AdminHome = () => {
    const [sections, setSections] = useState([]);
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState({});
    const [message, setMessage] = useState({ type: '', text: '' });
    const [editingItem, setEditingItem] = useState(null);
    const [editForm, setEditForm] = useState({ key: '', value: '', type: '' });
    const [uploading, setUploading] = useState({});
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        loadAllData();
    }, []);

    const loadAllData = async () => {
        try {
            setLoading(true);
            const [contentResponse, settingsResponse] = await Promise.all([
                adminContentAPI.getAll('home'),
                adminSettingsAPI.getAll()
            ]);

            if (contentResponse.success) {
                const data = contentResponse.data || [];
                setSections(Array.isArray(data) ? data : []);
            }

            if (settingsResponse.success) {
                const settingsObj = {};
                if (Array.isArray(settingsResponse.data)) {
                    settingsResponse.data.forEach(setting => {
                        settingsObj[setting.setting_key] = setting.setting_value;
                    });
                } else if (settingsResponse.data) {
                    Object.assign(settingsObj, settingsResponse.data);
                }
                setSettings(settingsObj);
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

    const getSettingValue = (key) => {
        return settings[key] || '';
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

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.match('image.*')) {
            setMessage({ type: 'error', text: 'Please select an image file (jpg, png, gif, etc.)' });
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            setMessage({ type: 'error', text: 'Image size must be less than 5MB' });
            return;
        }

        const uploadKey = `upload_${editForm.key}`;
        setUploading({ [uploadKey]: true });
        setMessage({ type: '', text: '' });

        try {
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);

            // Upload file
            const response = await adminUploadAPI.upload(file, 'homepage', editForm.key);
            
            if (response.success && response.data && response.data.url) {
                setEditForm({ ...editForm, value: response.data.url });
                setMessage({ type: 'success', text: 'Image uploaded successfully! Click Save to update.' });
            } else {
                setMessage({ type: 'error', text: response.message || 'Failed to upload image' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to upload image' });
        } finally {
            setUploading({ [uploadKey]: false });
            // Reset file input
            e.target.value = '';
        }
    };

    const handleSave = async () => {
        if (!editForm.value.trim() && editForm.type !== 'image') {
            setMessage({ type: 'error', text: 'Please enter a value' });
            return;
        }

        const saveKey = editForm.type === 'setting' ? editForm.key : `save_${editForm.key}`;
        setSaving({ [saveKey]: true });
        setMessage({ type: '', text: '' });

        try {
            let response;
            if (editForm.type === 'setting') {
                response = await adminSettingsAPI.update(editForm.key, editForm.value);
            } else {
                response = await adminContentAPI.update(editForm.key, editForm.value, 'home', editForm.key);
            }

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

    // All home page content sections organized by category
    const homePageContent = [
        {
            title: 'Hero Section (Banner)',
            description: 'Main banner at the top of the home page',
            icon: 'fas fa-image',
            color: '#0a2540',
            items: [
                { 
                    key: 'homepage_hero_subtitle', 
                    label: 'Hero Subtitle', 
                    type: 'setting', 
                    fieldType: 'text',
                    placeholder: 'e.g., Welcome to Our Investment Platform',
                    currentValue: getSettingValue('homepage_hero_subtitle')
                },
                { 
                    key: 'homepage_hero_title', 
                    label: 'Hero Main Title', 
                    type: 'setting', 
                    fieldType: 'text',
                    placeholder: 'e.g., Grow Your Wealth with Confidence',
                    currentValue: getSettingValue('homepage_hero_title')
                },
                { 
                    key: 'homepage_hero_text', 
                    label: 'Hero Description Text', 
                    type: 'setting', 
                    fieldType: 'textarea',
                    placeholder: 'Enter the main description text for the hero section...',
                    currentValue: getSettingValue('homepage_hero_text')
                },
                { 
                    key: 'homepage_hero_image', 
                    label: 'Hero Background Image', 
                    type: 'setting', 
                    fieldType: 'image',
                    placeholder: 'https://example.com/image.jpg',
                    currentValue: getSettingValue('homepage_hero_image'),
                    help: 'Upload an image from your device or enter image URL'
                }
            ]
        },
        {
            title: 'Company Overview Section',
            description: 'About company section with image and description',
            icon: 'fas fa-building',
            color: '#1a4a6a',
            items: [
                { 
                    key: 'homepage_about_title', 
                    label: 'About Section Title', 
                    type: 'setting', 
                    fieldType: 'text',
                    placeholder: 'e.g., Leading the Way in Investment Excellence',
                    currentValue: getSettingValue('homepage_about_title')
                },
                { 
                    key: 'about_intro', 
                    label: 'About Introduction Text', 
                    type: 'content', 
                    fieldType: 'textarea',
                    placeholder: 'Enter the introduction text about your company...',
                    currentValue: getSectionValue('about_intro')
                },
                { 
                    key: 'homepage_about_text', 
                    label: 'About Description', 
                    type: 'setting', 
                    fieldType: 'textarea',
                    placeholder: 'Enter detailed description about your company...',
                    currentValue: getSettingValue('homepage_about_text')
                }
            ]
        },
        {
            title: 'Why Choose Us Section',
            description: 'Key value proposition section',
            icon: 'fas fa-star',
            color: '#28a745',
            items: [
                { 
                    key: 'why_choose_title', 
                    label: 'Why Choose Us Title', 
                    type: 'content', 
                    fieldType: 'text',
                    placeholder: 'e.g., Why Choose Us',
                    currentValue: getSectionValue('why_choose_title')
                },
                { 
                    key: 'why_choose_desc', 
                    label: 'Why Choose Us Description', 
                    type: 'content', 
                    fieldType: 'textarea',
                    placeholder: 'Enter description explaining why customers should choose you...',
                    currentValue: getSectionValue('why_choose_desc')
                }
            ]
        },
        {
            title: 'Features Section',
            description: 'Three feature cards displayed on the home page',
            icon: 'fas fa-th-large',
            color: '#ffc107',
            items: [
                { 
                    key: 'feature_1_title', 
                    label: 'Feature 1 - Title', 
                    type: 'content', 
                    fieldType: 'text',
                    placeholder: 'e.g., Secure & Safe',
                    currentValue: getSectionValue('feature_1_title')
                },
                { 
                    key: 'feature_1_text', 
                    label: 'Feature 1 - Description', 
                    type: 'content', 
                    fieldType: 'textarea',
                    placeholder: 'Enter description for feature 1...',
                    currentValue: getSectionValue('feature_1_text')
                },
                { 
                    key: 'feature_2_title', 
                    label: 'Feature 2 - Title', 
                    type: 'content', 
                    fieldType: 'text',
                    placeholder: 'e.g., High Returns',
                    currentValue: getSectionValue('feature_2_title')
                },
                { 
                    key: 'feature_2_text', 
                    label: 'Feature 2 - Description', 
                    type: 'content', 
                    fieldType: 'textarea',
                    placeholder: 'Enter description for feature 2...',
                    currentValue: getSectionValue('feature_2_text')
                },
                { 
                    key: 'feature_3_title', 
                    label: 'Feature 3 - Title', 
                    type: 'content', 
                    fieldType: 'text',
                    placeholder: 'e.g., Expert Support',
                    currentValue: getSectionValue('feature_3_title')
                },
                { 
                    key: 'feature_3_text', 
                    label: 'Feature 3 - Description', 
                    type: 'content', 
                    fieldType: 'textarea',
                    placeholder: 'Enter description for feature 3...',
                    currentValue: getSectionValue('feature_3_text')
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
                        <i className="fas fa-home"></i>
                        Home Page Content Management
                    </h1>
                    <p style={{ margin: '10px 0 0 0', color: '#666', fontSize: '1rem' }}>
                        Manage all content sections for the Home page. Click "Edit" on any field to update content.
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

                {/* Content Sections */}
                {homePageContent.map((category, catIndex) => (
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
                                                    {item.type === 'setting' && (
                                                        <span style={{ 
                                                            marginLeft: '10px', 
                                                            padding: '3px 10px', 
                                                            background: '#e3f2fd', 
                                                            color: '#1976d2', 
                                                            borderRadius: '4px', 
                                                            fontSize: '0.75rem',
                                                            fontWeight: '600'
                                                        }}>
                                                            SETTING
                                                        </span>
                                                    )}
                                                    {item.type === 'content' && (
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
                                                    )}
                                                </label>
                                                
                                                {item.help && (
                                                    <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: '#666', fontStyle: 'italic' }}>
                                                        <i className="fas fa-info-circle" style={{ marginRight: '5px' }}></i>
                                                        {item.help}
                                                    </p>
                                                )}

                                                {isEditing ? (
                                                    <div>
                                                        {item.fieldType === 'image' ? (
                                                            <div>
                                                                {/* Image Preview */}
                                                                {(imagePreview || editForm.value) && (
                                                                    <div style={{
                                                                        marginBottom: '15px',
                                                                        padding: '15px',
                                                                        background: '#f8f9fa',
                                                                        borderRadius: '8px',
                                                                        border: '1px solid #e0e0e0'
                                                                    }}>
                                                                        <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#0a2540' }}>
                                                                            Image Preview:
                                                                        </label>
                                                                        <img 
                                                                            src={imagePreview || editForm.value} 
                                                                            alt="Preview" 
                                                                            style={{
                                                                                maxWidth: '100%',
                                                                                maxHeight: '300px',
                                                                                borderRadius: '6px',
                                                                                border: '1px solid #ddd',
                                                                                objectFit: 'contain'
                                                                            }}
                                                                            onError={(e) => {
                                                                                e.target.style.display = 'none';
                                                                            }}
                                                                        />
                                                                    </div>
                                                                )}
                                                                
                                                                {/* Upload Button */}
                                                                <div style={{ marginBottom: '15px' }}>
                                                                    <label style={{
                                                                        display: 'inline-block',
                                                                        padding: '10px 20px',
                                                                        background: '#0a2540',
                                                                        color: 'white',
                                                                        borderRadius: '6px',
                                                                        cursor: uploading[`upload_${item.key}`] ? 'not-allowed' : 'pointer',
                                                                        fontSize: '0.9rem',
                                                                        fontWeight: '600',
                                                                        opacity: uploading[`upload_${item.key}`] ? 0.6 : 1,
                                                                        transition: 'all 0.3s'
                                                                    }}
                                                                    onMouseEnter={(e) => {
                                                                        if (!uploading[`upload_${item.key}`]) {
                                                                            e.target.style.background = '#1a4a6a';
                                                                        }
                                                                    }}
                                                                    onMouseLeave={(e) => {
                                                                        if (!uploading[`upload_${item.key}`]) {
                                                                            e.target.style.background = '#0a2540';
                                                                        }
                                                                    }}>
                                                                        <i className="fas fa-upload" style={{ marginRight: '8px' }}></i>
                                                                        {uploading[`upload_${item.key}`] ? 'Uploading...' : 'Choose Image from Device'}
                                                                        <input
                                                                            type="file"
                                                                            accept="image/*"
                                                                            onChange={handleImageUpload}
                                                                            disabled={uploading[`upload_${item.key}`]}
                                                                            style={{ display: 'none' }}
                                                                        />
                                                                    </label>
                                                                    <span style={{ marginLeft: '15px', color: '#666', fontSize: '0.85rem' }}>
                                                                        or enter URL below
                                                                    </span>
                                                                </div>

                                                                {/* URL Input */}
                                                                <input
                                                                    type="text"
                                                                    value={editForm.value}
                                                                    onChange={(e) => {
                                                                        setEditForm({ ...editForm, value: e.target.value });
                                                                        setImagePreview(e.target.value);
                                                                    }}
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
                                                            </div>
                                                        ) : item.fieldType === 'textarea' ? (
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
                                                                disabled={saving[`save_${item.key}`] || saving[item.key]}
                                                                style={{
                                                                    padding: '10px 20px',
                                                                    background: '#28a745',
                                                                    color: 'white',
                                                                    border: 'none',
                                                                    borderRadius: '6px',
                                                                    cursor: saving[`save_${item.key}`] || saving[item.key] ? 'not-allowed' : 'pointer',
                                                                    fontSize: '0.9rem',
                                                                    fontWeight: '600',
                                                                    opacity: saving[`save_${item.key}`] || saving[item.key] ? 0.6 : 1,
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '8px',
                                                                    whiteSpace: 'nowrap'
                                                                }}
                                                            >
                                                                <i className="fas fa-save"></i>
                                                                {saving[`save_${item.key}`] || saving[item.key] ? 'Saving...' : 'Save Changes'}
                                                            </button>
                                                            <button
                                                                onClick={handleCancel}
                                                                disabled={saving[`save_${item.key}`] || saving[item.key]}
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
                                                    <div>
                                                        {item.fieldType === 'image' && currentValue ? (
                                                            <div style={{
                                                                background: '#f8f9fa',
                                                                padding: '15px',
                                                                borderRadius: '6px',
                                                                border: '1px solid #e0e0e0'
                                                            }}>
                                                                <img 
                                                                    src={currentValue} 
                                                                    alt="Current" 
                                                                    style={{
                                                                        maxWidth: '100%',
                                                                        maxHeight: '200px',
                                                                        borderRadius: '6px',
                                                                        border: '1px solid #ddd',
                                                                        objectFit: 'contain',
                                                                        marginBottom: '10px'
                                                                    }}
                                                                    onError={(e) => {
                                                                        e.target.style.display = 'none';
                                                                    }}
                                                                />
                                                                <div style={{
                                                                    fontSize: '0.85rem',
                                                                    color: '#666',
                                                                    wordBreak: 'break-all',
                                                                    padding: '8px',
                                                                    background: 'white',
                                                                    borderRadius: '4px',
                                                                    fontFamily: 'monospace'
                                                                }}>
                                                                    {currentValue}
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
                                                )}
                                            </div>
                                            {!isEditing && (
                                                <div style={{ flexShrink: 0 }}>
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
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}

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
                        <li>Fields marked "SETTING" are stored in website settings</li>
                        <li>Fields marked "CONTENT" are stored as page content</li>
                        <li>Changes are saved immediately and appear on the website</li>
                        <li>You can use HTML tags in textarea fields for formatting</li>
                    </ul>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminHome;
