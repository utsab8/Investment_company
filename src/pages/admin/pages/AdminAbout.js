import React, { useState, useEffect } from 'react';
import AdminLayout from '../AdminLayout';
import ItemManager from '../components/ItemManager';
import { adminContentAPI, adminUploadAPI, adminAboutItemsAPI } from '../../../services/adminApi';
import '../Admin.css';

const AdminAbout = () => {
    const [sections, setSections] = useState([]);
    const [awards, setAwards] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [timeline, setTimeline] = useState([]);
    const [documents, setDocuments] = useState([]);
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

    useEffect(() => {
        loadAllData();
    }, []);

    const loadAllData = async () => {
        try {
            setLoading(true);
            const [contentResponse, awardsResponse, certificatesResponse, teamResponse, timelineResponse, documentsResponse] = await Promise.all([
                adminContentAPI.getAll('about'),
                adminAboutItemsAPI.getAll('award'),
                adminAboutItemsAPI.getAll('certificate'),
                adminAboutItemsAPI.getAll('team_member'),
                adminAboutItemsAPI.getAll('timeline'),
                adminAboutItemsAPI.getAll('document')
            ]);

            if (contentResponse.success) {
                const data = contentResponse.data || [];
                setSections(Array.isArray(data) ? data : []);
            }

            if (awardsResponse.success) setAwards(awardsResponse.data || []);
            if (certificatesResponse.success) setCertificates(certificatesResponse.data || []);
            if (teamResponse.success) setTeamMembers(teamResponse.data || []);
            if (timelineResponse.success) setTimeline(timelineResponse.data || []);
            if (documentsResponse.success) setDocuments(documentsResponse.data || []);
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
            const response = await adminContentAPI.update(editForm.key, editForm.value, 'about', editForm.key);
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
            // Note: Delete endpoint may need to be implemented in backend
            setMessage({ type: 'info', text: 'Delete functionality - please contact developer to implement backend delete endpoint' });
            // For now, we can try to clear the content
            const response = await adminContentAPI.update(section.section_key || section.key, '', 'about', section.section_key || section.key);
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
                'about',
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

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.match('image.*')) {
            setMessage({ type: 'error', text: 'Please select an image file (jpg, png, gif, etc.)' });
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setMessage({ type: 'error', text: 'Image size must be less than 5MB' });
            return;
        }

        const uploadKey = `upload_${editForm.key}`;
        setUploading({ [uploadKey]: true });
        setMessage({ type: '', text: '' });

        try {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);

            const response = await adminUploadAPI.upload(file, 'about', editForm.key);
            
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
            e.target.value = '';
        }
    };

    // Handle About Items (Awards, Certificates, Team, Timeline)
    const handleItemSave = async (itemData, itemId, itemType) => {
        setSaving({ [`${itemType}_${itemId || 'new'}`]: true });
        setMessage({ type: '', text: '' });

        try {
            const data = {
                ...itemData,
                type: itemType,
                year: itemData.year ? parseInt(itemData.year) : null,
                display_order: itemData.display_order ? parseInt(itemData.display_order) : 0,
                is_active: Boolean(itemData.is_active)
            };

            let response;
            if (itemId) {
                response = await adminAboutItemsAPI.update(itemId, data);
            } else {
                response = await adminAboutItemsAPI.create(data);
            }

            if (response.success) {
                setMessage({ type: 'success', text: `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} ${itemId ? 'updated' : 'created'} successfully!` });
                await loadAllData();
            } else {
                setMessage({ type: 'error', text: response.message || 'Failed to save' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to save' });
        } finally {
            setSaving({ [`${itemType}_${itemId || 'new'}`]: false });
        }
    };

    const handleItemDelete = async (itemId, itemType) => {
        if (!window.confirm(`Are you sure you want to delete this ${itemType}?`)) return;

        setSaving({ [`delete_${itemType}_${itemId}`]: true });
        try {
            const response = await adminAboutItemsAPI.delete(itemId);
            if (response.success) {
                setMessage({ type: 'success', text: 'Deleted successfully!' });
                await loadAllData();
            } else {
                setMessage({ type: 'error', text: response.message || 'Failed to delete' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to delete' });
        } finally {
            setSaving({ [`delete_${itemType}_${itemId}`]: false });
        }
    };

    // All about page content sections organized by category
    const aboutPageContent = [
        {
            title: 'Page Header',
            description: 'Main header section at the top of the About page',
            icon: 'fas fa-heading',
            color: '#0a2540',
            items: [
                { 
                    key: 'page_title', 
                    label: 'Page Title', 
                    type: 'content', 
                    fieldType: 'text',
                    placeholder: 'e.g., About Us',
                    currentValue: getSectionValue('page_title')
                },
                { 
                    key: 'page_subtitle', 
                    label: 'Page Subtitle', 
                    type: 'content', 
                    fieldType: 'text',
                    placeholder: 'e.g., Learn more about our company',
                    currentValue: getSectionValue('page_subtitle')
                }
            ]
        },
        {
            title: 'Our Story Section',
            description: 'Company background and history section',
            icon: 'fas fa-book',
            color: '#1a4a6a',
            items: [
                { 
                    key: 'story_title', 
                    label: 'Story Title', 
                    type: 'content', 
                    fieldType: 'text',
                    placeholder: 'e.g., Defining the Future of Investment',
                    currentValue: getSectionValue('story_title')
                },
                { 
                    key: 'story_text_1', 
                    label: 'Story Paragraph 1', 
                    type: 'content', 
                    fieldType: 'textarea',
                    placeholder: 'Enter first paragraph of the story...',
                    currentValue: getSectionValue('story_text_1')
                },
                { 
                    key: 'story_text_2', 
                    label: 'Story Paragraph 2', 
                    type: 'content', 
                    fieldType: 'textarea',
                    placeholder: 'Enter second paragraph of the story...',
                    currentValue: getSectionValue('story_text_2')
                }
            ]
        },
        {
            title: 'Mission & Vision Section',
            description: 'Company mission and vision statements',
            icon: 'fas fa-bullseye',
            color: '#28a745',
            items: [
                { 
                    key: 'mission_title', 
                    label: 'Mission Title', 
                    type: 'content', 
                    fieldType: 'text',
                    placeholder: 'e.g., Our Mission',
                    currentValue: getSectionValue('mission_title')
                },
                { 
                    key: 'mission_text', 
                    label: 'Mission Description', 
                    type: 'content', 
                    fieldType: 'textarea',
                    placeholder: 'Enter mission statement...',
                    currentValue: getSectionValue('mission_text')
                },
                { 
                    key: 'vision_title', 
                    label: 'Vision Title', 
                    type: 'content', 
                    fieldType: 'text',
                    placeholder: 'e.g., Our Vision',
                    currentValue: getSectionValue('vision_title')
                },
                { 
                    key: 'vision_text', 
                    label: 'Vision Description', 
                    type: 'content', 
                    fieldType: 'textarea',
                    placeholder: 'Enter vision statement...',
                    currentValue: getSectionValue('vision_text')
                }
            ]
        },
        {
            title: 'Journey Section',
            description: 'Company timeline and journey milestones',
            icon: 'fas fa-road',
            color: '#ffc107',
            items: [
                { 
                    key: 'journey_title', 
                    label: 'Journey Section Title', 
                    type: 'content', 
                    fieldType: 'text',
                    placeholder: 'e.g., Our Journey',
                    currentValue: getSectionValue('journey_title')
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
                        <i className="fas fa-info-circle"></i>
                        About Page Content Management
                    </h1>
                    <p style={{ margin: '10px 0 0 0', color: '#666', fontSize: '1rem' }}>
                        Manage all content sections and items for the About page. Add, edit, update, or delete any content.
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
                        onClick={() => setActiveTab('items')}
                        style={{
                            padding: '12px 25px',
                            background: activeTab === 'items' ? '#0a2540' : 'transparent',
                            color: activeTab === 'items' ? 'white' : '#666',
                            border: 'none',
                            borderBottom: activeTab === 'items' ? '3px solid #0a2540' : '3px solid transparent',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: activeTab === 'items' ? '600' : '400',
                            marginRight: '10px'
                        }}
                    >
                        <i className="fas fa-list" style={{ marginRight: '8px' }}></i>
                        Items (Awards, Certificates, Team, Timeline)
                    </button>
                    <button
                        onClick={() => setActiveTab('documents')}
                        style={{
                            padding: '12px 25px',
                            background: activeTab === 'documents' ? '#0a2540' : 'transparent',
                            color: activeTab === 'documents' ? 'white' : '#666',
                            border: 'none',
                            borderBottom: activeTab === 'documents' ? '3px solid #0a2540' : '3px solid transparent',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: activeTab === 'documents' ? '600' : '400'
                        }}
                    >
                        <i className="fas fa-file-pdf" style={{ marginRight: '8px' }}></i>
                        Documents
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
                        {aboutPageContent.map((category, catIndex) => (
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
                            const predefinedKeys = aboutPageContent.flatMap(cat => cat.items.map(i => i.key));
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
                                            const predefinedKeys = aboutPageContent.flatMap(cat => cat.items.map(i => i.key));
                                            return !predefinedKeys.includes(s.section_key || s.key);
                                        })
                                        .map((section, index) => {
                                            const isEditing = editingItem === (section.id || section.section_key);
                                            const sectionKey = section.section_key || section.key;
                                            const sectionContent = section.content || section.value || '';

                                            return (
                                                <div key={index} style={{
                                                    marginBottom: index < sections.filter(s => {
                                                        const predefinedKeys = aboutPageContent.flatMap(cat => cat.items.map(i => i.key));
                                                        return !predefinedKeys.includes(s.section_key || s.key);
                                                    }).length - 1 ? '20px' : 0,
                                                    paddingBottom: index < sections.filter(s => {
                                                        const predefinedKeys = aboutPageContent.flatMap(cat => cat.items.map(i => i.key));
                                                        return !predefinedKeys.includes(s.section_key || s.key);
                                                    }).length - 1 ? '20px' : 0,
                                                    borderBottom: index < sections.filter(s => {
                                                        const predefinedKeys = aboutPageContent.flatMap(cat => cat.items.map(i => i.key));
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
                ) : activeTab === 'items' ? (
                    <div>
                        {/* Awards */}
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
                                    <i className="fas fa-trophy"></i>
                                    Awards
                                </h3>
                                <p style={{ margin: '8px 0 0 0', opacity: 0.9, fontSize: '0.9rem' }}>
                                    Manage awards and recognitions - Add, Edit, Delete awards
                                </p>
                            </div>
                            <div style={{ padding: '25px' }}>
                                <ItemManager
                                    items={awards}
                                    itemType="award"
                                    fields={[
                                        { key: 'title', label: 'Title', type: 'text', required: true },
                                        { key: 'subtitle', label: 'Subtitle', type: 'text' },
                                        { key: 'organization', label: 'Organization', type: 'text' },
                                        { key: 'description', label: 'Description', type: 'textarea' },
                                        { key: 'image_url', label: 'Image URL', type: 'text' },
                                        { key: 'icon', label: 'Icon (Font Awesome)', type: 'text' },
                                        { key: 'year', label: 'Year', type: 'number' },
                                        { key: 'display_order', label: 'Display Order', type: 'number' },
                                        { key: 'is_active', label: 'Active', type: 'checkbox' }
                                    ]}
                                    onSave={(data, id) => handleItemSave(data, id, 'award')}
                                    onDelete={(id) => handleItemDelete(id, 'award')}
                                    saving={saving}
                                />
                            </div>
                        </div>

                        {/* Certificates */}
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
                                    <i className="fas fa-certificate"></i>
                                    Certificates
                                </h3>
                                <p style={{ margin: '8px 0 0 0', opacity: 0.9, fontSize: '0.9rem' }}>
                                    Manage certificates and accreditations - Add, Edit, Delete certificates
                                </p>
                            </div>
                            <div style={{ padding: '25px' }}>
                                <ItemManager
                                    items={certificates}
                                    itemType="certificate"
                                    fields={[
                                        { key: 'title', label: 'Title', type: 'text', required: true },
                                        { key: 'subtitle', label: 'Subtitle', type: 'text' },
                                        { key: 'organization', label: 'Issuing Organization', type: 'text' },
                                        { key: 'description', label: 'Description', type: 'textarea' },
                                        { key: 'image_url', label: 'Image URL', type: 'text' },
                                        { key: 'year', label: 'Year', type: 'number' },
                                        { key: 'display_order', label: 'Display Order', type: 'number' },
                                        { key: 'is_active', label: 'Active', type: 'checkbox' }
                                    ]}
                                    onSave={(data, id) => handleItemSave(data, id, 'certificate')}
                                    onDelete={(id) => handleItemDelete(id, 'certificate')}
                                    saving={saving}
                                />
                            </div>
                        </div>

                        {/* Team Members */}
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
                                    <i className="fas fa-users"></i>
                                    Team Members
                                </h3>
                                <p style={{ margin: '8px 0 0 0', opacity: 0.9, fontSize: '0.9rem' }}>
                                    Manage team members and staff - Add, Edit, Delete team members
                                </p>
                            </div>
                            <div style={{ padding: '25px' }}>
                                <ItemManager
                                    items={teamMembers}
                                    itemType="team member"
                                    fields={[
                                        { key: 'title', label: 'Name', type: 'text', required: true },
                                        { key: 'subtitle', label: 'Position/Title', type: 'text' },
                                        { key: 'organization', label: 'Department', type: 'text' },
                                        { key: 'description', label: 'Bio/Description', type: 'textarea' },
                                        { key: 'image_url', label: 'Photo URL', type: 'text' },
                                        { key: 'year', label: 'Joined Year', type: 'number' },
                                        { key: 'display_order', label: 'Display Order', type: 'number' },
                                        { key: 'is_active', label: 'Active', type: 'checkbox' }
                                    ]}
                                    onSave={(data, id) => handleItemSave(data, id, 'team_member')}
                                    onDelete={(id) => handleItemDelete(id, 'team_member')}
                                    saving={saving}
                                />
                            </div>
                        </div>

                        {/* Timeline */}
                        <div style={{
                            background: 'white',
                            borderRadius: '10px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            marginBottom: '25px',
                            overflow: 'hidden',
                            border: '1px solid #e0e0e0'
                        }}>
                            <div style={{
                                background: 'linear-gradient(135deg, #6f42c1 0%, #e83e8c 100%)',
                                color: 'white',
                                padding: '20px 25px'
                            }}>
                                <h3 style={{ margin: 0, fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <i className="fas fa-clock"></i>
                                    Timeline Events
                                </h3>
                                <p style={{ margin: '8px 0 0 0', opacity: 0.9, fontSize: '0.9rem' }}>
                                    Manage company timeline and milestones - Add, Edit, Delete timeline events
                                </p>
                            </div>
                            <div style={{ padding: '25px' }}>
                                <ItemManager
                                    items={timeline}
                                    itemType="timeline event"
                                    fields={[
                                        { key: 'title', label: 'Event Title', type: 'text', required: true },
                                        { key: 'subtitle', label: 'Subtitle', type: 'text' },
                                        { key: 'description', label: 'Event Description', type: 'textarea', required: true },
                                        { key: 'image_url', label: 'Image URL', type: 'text' },
                                        { key: 'year', label: 'Year', type: 'number', required: true },
                                        { key: 'display_order', label: 'Display Order', type: 'number' },
                                        { key: 'is_active', label: 'Active', type: 'checkbox' }
                                    ]}
                                    onSave={(data, id) => handleItemSave(data, id, 'timeline')}
                                    onDelete={(id) => handleItemDelete(id, 'timeline')}
                                    saving={saving}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        {/* Documents Section */}
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
                                <h3 style={{ margin: 0, fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <i className="fas fa-file-pdf"></i>
                                    Company Documents
                                </h3>
                                <p style={{ margin: '8px 0 0 0', opacity: 0.9, fontSize: '0.9rem' }}>
                                    Upload and manage company documents (PDFs) - Registration, Licenses, Reports, Terms, Privacy Policy, etc.
                                </p>
                            </div>
                            <div style={{ padding: '25px' }}>
                                <ItemManager
                                    items={documents}
                                    itemType="document"
                                    fields={[
                                        { key: 'title', label: 'Document Title', type: 'text', required: true },
                                        { key: 'subtitle', label: 'Document Subtitle/Description', type: 'textarea' },
                                        { key: 'description', label: 'Full Description', type: 'textarea' },
                                        { key: 'image_url', label: 'Document File URL (PDF)', type: 'text', required: true },
                                        { key: 'icon', label: 'Icon (Font Awesome class)', type: 'text', placeholder: 'e.g., fas fa-file-alt' },
                                        { key: 'organization', label: 'Category/Category Name', type: 'text' },
                                        { key: 'year', label: 'Year (if applicable)', type: 'number' },
                                        { key: 'display_order', label: 'Display Order', type: 'number' },
                                        { key: 'is_active', label: 'Active', type: 'checkbox' }
                                    ]}
                                    onSave={(data, id) => handleItemSave(data, id, 'document')}
                                    onDelete={(id) => handleItemDelete(id, 'document')}
                                    saving={saving}
                                />
                            </div>
                        </div>

                        {/* Document Upload Instructions */}
                        <div style={{
                            background: 'linear-gradient(135deg, #fff3cd 0%, #ffe69c 100%)',
                            padding: '20px',
                            borderRadius: '8px',
                            marginBottom: '25px',
                            border: '2px solid #ffc107'
                        }}>
                            <h4 style={{ margin: '0 0 10px 0', color: '#856404', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <i className="fas fa-info-circle"></i>
                                How to Upload Documents
                            </h4>
                            <ol style={{ margin: 0, paddingLeft: '20px', color: '#856404' }}>
                                <li>Click "Add New Document" button</li>
                                <li>Fill in the document title and description</li>
                                <li>For the "Document File URL" field:
                                    <ul style={{ marginTop: '5px', paddingLeft: '20px' }}>
                                        <li>Click "Choose Image" button (it works for PDFs too)</li>
                                        <li>Select a PDF file from your device</li>
                                        <li>Wait for upload to complete - the URL will be automatically filled</li>
                                        <li>Or manually enter a document URL if already uploaded</li>
                                    </ul>
                                </li>
                                <li>Select an icon (e.g., fas fa-file-alt, fas fa-id-card, fas fa-chart-bar)</li>
                                <li>Set display order and active status</li>
                                <li>Click "Save" to add the document</li>
                            </ol>
                            <p style={{ margin: '15px 0 0 0', color: '#856404', fontSize: '0.9rem', fontStyle: 'italic' }}>
                                <strong>Note:</strong> Supported file types: PDF (max 5MB). The uploaded document will be available for download on the About page.
                            </p>
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
                        <li>Use "Page Content" tab to edit text sections</li>
                        <li>Use "Items" tab to manage Awards, Certificates, Team Members, and Timeline events</li>
                        <li>Use "Documents" tab to upload and manage company documents (PDFs)</li>
                        <li>You can add unlimited custom content sections</li>
                        <li>All changes are saved immediately and appear on the website</li>
                    </ul>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminAbout;
