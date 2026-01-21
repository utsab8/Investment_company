import React, { useState } from 'react';
import { adminUploadAPI } from '../../../services/adminApi';

/**
 * Reusable component for managing items (services, projects, etc.) with add/edit/delete
 */
const ItemManager = ({ 
    items = [], 
    itemType = 'item',
    fields = [],
    onSave,
    onDelete,
    saving = false
}) => {
    const [editingItem, setEditingItem] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({});
    const [uploading, setUploading] = useState({});
    const [imagePreviews, setImagePreviews] = useState({});

    const initializeFormData = (item = null) => {
        const data = {};
        fields.forEach(field => {
            if (item && item[field.key] !== undefined) {
                // Preserve value even if null (for image_url, we want to allow null initially)
                data[field.key] = item[field.key];
            } else {
                data[field.key] = field.type === 'checkbox' ? false : field.type === 'number' ? 0 : '';
            }
        });
        // Debug: Log initialized form data
        console.log('ItemManager: Initialized formData:', data);
        return data;
    };

    const handleAddNew = () => {
        setFormData(initializeFormData());
        setShowAddForm(true);
        setEditingItem(null);
        setImagePreviews({});
    };

    const handleEdit = (item) => {
        const data = initializeFormData(item);
        setFormData(data);
        setEditingItem(item);
        setShowAddForm(false);
        
        // Set image previews for image_url fields or type: 'image' fields
        const previews = {};
        fields.forEach(field => {
            if ((field.type === 'image' || field.key.includes('image')) && data[field.key]) {
                previews[field.key] = data[field.key];
            }
        });
        setImagePreviews(previews);
    };

    const handleCancel = () => {
        setEditingItem(null);
        setShowAddForm(false);
        setFormData({});
        setImagePreviews({});
    };

    const handleImageUpload = async (e, fieldKey) => {
        const file = e.target.files[0];
        if (!file) return;

        const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
        const allowedDocumentTypes = ['application/pdf'];
        const isImage = allowedImageTypes.includes(file.type);
        const isPdf = allowedDocumentTypes.includes(file.type);

        // Find the field definition to check its type
        const field = fields.find(f => f.key === fieldKey);
        const fieldType = field ? field.type : 'text';

        // Check if this field is for PDF upload (by field key, field type, or itemType)
        const isPdfField = fieldKey.includes('pdf') || fieldKey.includes('file_url') || fieldType === 'file' || itemType === 'document' || itemType === 'report';

        if (isPdfField && !isPdf) {
            alert('Please select a PDF file.');
            e.target.value = '';
            return;
        }
        if (!isPdfField && !isImage) {
            alert('Please select an image file (jpg, png, gif, etc.)');
            e.target.value = '';
            return;
        }

        // Check file size (10MB for PDFs, 5MB for images)
        const maxSize = isPdf ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
        if (file.size > maxSize) {
            alert(`${isPdf ? 'PDF' : 'Image'} size must be less than ${isPdf ? '10MB' : '5MB'}`);
            e.target.value = '';
            return;
        }

        const uploadKey = `upload_${fieldKey}`;
        setUploading(prev => ({ ...prev, [uploadKey]: true }));

        try {
            // Create preview (only for images, not PDFs)
            if (isImage) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreviews(prev => ({ ...prev, [fieldKey]: reader.result }));
                };
                reader.readAsDataURL(file);
            }

            // Determine upload category based on field type
            const uploadCategory = isPdfField ? 'document' : itemType;

            // Upload file
            const response = await adminUploadAPI.upload(file, uploadCategory, fieldKey);
            
            if (response.success && response.data && response.data.url) {
                const fileUrl = response.data.url;
                const fileSize = response.data.size || file.size;
                console.log(`${isPdf ? 'PDF' : 'Image'} uploaded successfully, URL:`, fileUrl, 'Size:', fileSize);
                
                // Update form data with file URL
                setFormData(prev => {
                    const updated = { ...prev, [fieldKey]: fileUrl };
                    // If this is a report and file_url is uploaded, also update file_size
                    if (itemType === 'report' && fieldKey === 'file_url' && fileSize) {
                        updated.file_size = fileSize;
                        updated.file_url_original_size = fileSize; // Store original size for reference
                    }
                    // Also handle for projects with pdf_url
                    if (itemType === 'project' && fieldKey === 'pdf_url' && fileSize) {
                        // Projects don't have file_size field, but we can store it for reference
                        updated.pdf_url_original_size = fileSize;
                    }
                    console.log('Updated formData after file upload:', updated);
                    return updated;
                });
                
                if (isImage) {
                    setImagePreviews(prev => ({ ...prev, [fieldKey]: fileUrl }));
                }
                
                // Show success message
                const successMsg = `${isPdf ? 'PDF document' : 'Image'} uploaded successfully!${fileSize ? ` (${(fileSize / 1024 / 1024).toFixed(2)} MB)` : ''}`;
                alert(successMsg);
            } else {
                alert(response.message || `Failed to upload ${isPdf ? 'PDF' : 'image'}`);
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert(error.message || `Failed to upload ${isPdf ? 'PDF' : 'image'}`);
        } finally {
            setUploading(prev => ({ ...prev, [uploadKey]: false }));
            e.target.value = '';
        }
    };

    const handleInputChange = (key, value) => {
        setFormData(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSave = async () => {
        // Validate required fields (except image_url which can be uploaded)
        const requiredFields = fields.filter(f => f.required && f.type !== 'image');
        for (const field of requiredFields) {
            if (!formData[field.key] || (typeof formData[field.key] === 'string' && !formData[field.key].trim())) {
                alert(`Please fill in the ${field.label} field`);
                return;
            }
        }

        // For image fields, validate if required
        const requiredImageFields = fields.filter(f => f.required && f.type === 'image');
        for (const field of requiredImageFields) {
            if (!formData[field.key] || (typeof formData[field.key] === 'string' && !formData[field.key].trim())) {
                alert(`Please upload or enter a URL for ${field.label}`);
                return;
            }
        }

        // Debug: Log form data being saved
        console.log('=== ItemManager: Saving ===');
        console.log('Form data being saved:', formData);
        console.log('Editing item ID:', editingItem?.id);
        console.log('Image URL value:', formData.image_url);
        console.log('All formData keys:', Object.keys(formData));

        await onSave(formData, editingItem?.id);
        handleCancel();
    };

    const handleDeleteClick = async (item) => {
        const confirmMessage = `Are you sure you want to delete "${item.title || item.name || `${itemType} #${item.id}`}"? This action cannot be undone.`;
        if (window.confirm(confirmMessage)) {
            try {
                console.log(`Deleting ${itemType} with ID:`, item.id);
                await onDelete(item.id);
                console.log(`Successfully deleted ${itemType} with ID:`, item.id);
            } catch (error) {
                console.error(`Error deleting ${itemType}:`, error);
                alert(`Failed to delete ${itemType}. Please try again.`);
            }
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, color: '#0a2540' }}>
                    {itemType.charAt(0).toUpperCase() + itemType.slice(1)}s
                </h3>
                <button
                    onClick={handleAddNew}
                    style={{
                        padding: '8px 16px',
                        background: '#0a2540',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    <i className="fas fa-plus"></i>
                    Add New {itemType.charAt(0).toUpperCase() + itemType.slice(1)}
                </button>
            </div>

            {/* Add/Edit Form */}
            {(showAddForm || editingItem) && (
                <div style={{
                    background: '#fff3cd',
                    padding: '20px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    border: '2px solid #ffc107'
                }}>
                    <h4 style={{ marginTop: 0 }}>
                        {editingItem ? `Edit ${itemType.charAt(0).toUpperCase() + itemType.slice(1)}` : `Add New ${itemType.charAt(0).toUpperCase() + itemType.slice(1)}`}
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
                        {fields.map((field) => (
                            <div 
                                key={field.key}
                                style={field.type === 'textarea' ? { gridColumn: '1 / -1' } : {}}
                            >
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                    {field.label} {field.required && <span style={{ color: 'red' }}>*</span>}
                                </label>
                                
                                {/* File Upload for image_url or document URL fields or type: 'image' or 'file' */}
                                {(field.type === 'image' || field.type === 'file' || (field.key.includes('image') && field.key.includes('url')) || (itemType === 'document' && field.key.includes('url')) || (field.key.includes('pdf') && field.key.includes('url'))) ? (
                                    <div>
                                        {/* Image/File Preview */}
                                        {(imagePreviews[field.key] || formData[field.key]) && !((itemType === 'document' || itemType === 'report' || field.type === 'file' || field.key.includes('pdf') || field.key.includes('file_url')) && formData[field.key] && formData[field.key].toLowerCase().endsWith('.pdf')) ? (
                                            <div style={{
                                                marginBottom: '10px',
                                                padding: '10px',
                                                background: '#f8f9fa',
                                                borderRadius: '6px',
                                                border: '1px solid #e0e0e0'
                                            }}>
                                                <img 
                                                    src={imagePreviews[field.key] || formData[field.key]} 
                                                    alt="Preview" 
                                                    style={{
                                                        maxWidth: '100%',
                                                        maxHeight: '200px',
                                                        borderRadius: '4px',
                                                        border: '1px solid #ddd',
                                                        objectFit: 'contain'
                                                    }}
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                            </div>
                                        ) : ((itemType === 'document' || field.type === 'file' || field.key.includes('pdf')) && formData[field.key] && formData[field.key].toLowerCase().endsWith('.pdf')) ? (
                                            <div style={{
                                                marginBottom: '10px',
                                                padding: '15px',
                                                background: '#f8f9fa',
                                                borderRadius: '6px',
                                                border: '1px solid #e0e0e0',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px'
                                            }}>
                                                <i className="fas fa-file-pdf" style={{ fontSize: '2rem', color: '#dc3545' }}></i>
                                                <div>
                                                    <div style={{ fontWeight: 'bold', color: '#0a2540' }}>PDF Document</div>
                                                    <a 
                                                        href={formData[field.key]} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        style={{ 
                                                            color: '#0a2540', 
                                                            fontSize: '0.85rem',
                                                            textDecoration: 'underline'
                                                        }}
                                                    >
                                                        {formData[field.key]}
                                                    </a>
                                                </div>
                                            </div>
                                        ) : null}
                                        
                                        {/* Upload Button */}
                                        <div style={{ marginBottom: '10px' }}>
                                            <label style={{
                                                display: 'inline-block',
                                                padding: '8px 16px',
                                                background: '#0a2540',
                                                color: 'white',
                                                borderRadius: '5px',
                                                cursor: uploading[`upload_${field.key}`] ? 'not-allowed' : 'pointer',
                                                fontSize: '0.85rem',
                                                fontWeight: '600',
                                                opacity: uploading[`upload_${field.key}`] ? 0.6 : 1
                                            }}>
                                                <i className="fas fa-upload" style={{ marginRight: '6px' }}></i>
                                                {uploading[`upload_${field.key}`] ? 'Uploading...' : (field.type === 'file' || field.key.includes('pdf') || field.key.includes('file_url') || itemType === 'document' || itemType === 'report') ? 'Choose Document (PDF)' : 'Choose Image'}
                                                <input
                                                    type="file"
                                                    accept={(field.type === 'file' || field.key.includes('pdf') || field.key.includes('file_url') || itemType === 'document' || itemType === 'report') ? 'application/pdf,.pdf' : 'image/*'}
                                                    onChange={(e) => handleImageUpload(e, field.key)}
                                                    disabled={uploading[`upload_${field.key}`]}
                                                    style={{ display: 'none' }}
                                                />
                                            </label>
                                            <span style={{ marginLeft: '10px', color: '#666', fontSize: '0.85rem' }}>
                                                or enter URL
                                            </span>
                                        </div>

                                        {/* URL Input */}
                                        <input
                                            type="text"
                                            value={formData[field.key] || ''}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                console.log(`ItemManager: Image URL input changed for ${field.key}:`, value);
                                                handleInputChange(field.key, value);
                                                // Update preview only if it's a valid URL
                                                if (value && (value.startsWith('http') || value.startsWith('/'))) {
                                                    setImagePreviews(prev => ({ ...prev, [field.key]: value }));
                                                }
                                            }}
                                            placeholder={(field.type === 'file' || field.key.includes('pdf') || field.key.includes('file_url') || itemType === 'document' || itemType === 'report') ? 'https://example.com/document.pdf' : 'https://example.com/image.jpg'}
                                            required={field.required}
                                            style={{
                                                width: '100%',
                                                padding: '8px',
                                                border: formData[field.key] ? '2px solid #28a745' : '1px solid #ddd',
                                                borderRadius: '4px',
                                                fontSize: '0.9rem',
                                                boxSizing: 'border-box',
                                                backgroundColor: formData[field.key] ? '#f0fff4' : 'white'
                                            }}
                                        />
                                        {formData[field.key] && (
                                            <div style={{ marginTop: '8px', padding: '8px', background: '#d4edda', borderRadius: '4px', fontSize: '0.85rem', color: '#155724' }}>
                                                <strong>✓ Image URL Set:</strong> {formData[field.key]}
                                            </div>
                                        )}
                                        {!formData[field.key] && field.required && (
                                            <div style={{ marginTop: '5px', fontSize: '0.85rem', color: '#dc3545' }}>
                                                ⚠ This field is required. Please upload an image or enter a URL.
                                            </div>
                                        )}
                                    </div>
                                ) : field.type === 'textarea' ? (
                                    <textarea
                                        value={formData[field.key] || ''}
                                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                                        rows="4"
                                        required={field.required}
                                        style={{
                                            width: '100%',
                                            padding: '8px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            fontSize: '0.9rem',
                                            fontFamily: 'inherit'
                                        }}
                                    />
                                ) : field.type === 'checkbox' ? (
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={formData[field.key] || false}
                                            onChange={(e) => handleInputChange(field.key, e.target.checked)}
                                            style={{ width: 'auto' }}
                                        />
                                        <span>{field.label}</span>
                                    </label>
                                ) : (
                                    <input
                                        type={field.type || 'text'}
                                        value={formData[field.key] || ''}
                                        onChange={(e) => handleInputChange(field.key, field.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
                                        required={field.required}
                                        style={{
                                            width: '100%',
                                            padding: '8px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            fontSize: '0.9rem'
                                        }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            style={{
                                padding: '8px 20px',
                                background: '#0a2540',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: saving ? 'not-allowed' : 'pointer',
                                opacity: saving ? 0.6 : 1
                            }}
                        >
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                        <button
                            onClick={handleCancel}
                            disabled={saving}
                            style={{
                                padding: '8px 20px',
                                background: '#6c757d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Items List */}
            {items.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '40px',
                    background: 'white',
                    borderRadius: '8px',
                    color: '#999'
                }}>
                    <i className="fas fa-inbox" style={{ fontSize: '3rem', marginBottom: '10px', opacity: 0.3 }}></i>
                    <p>No {itemType}s found. Click "Add New" to create one.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '15px' }}>
                    {items.map((item) => (
                        <div
                            key={item.id}
                            style={{
                                background: editingItem?.id === item.id ? '#fff3cd' : 'white',
                                padding: '20px',
                                borderRadius: '8px',
                                border: editingItem?.id === item.id ? '2px solid #ffc107' : '1px solid #e0e0e0',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '20px' }}>
                                {/* Image/Document Preview */}
                                {(item.image_url || item.pdf_url || item.file_url) && (
                                    <div style={{ flexShrink: 0 }}>
                                        {/* Show PDF icon if pdf_url/file_url exists or image_url is a PDF */}
                                        {(item.pdf_url || item.file_url || (item.image_url && item.image_url.toLowerCase().endsWith('.pdf')) || (itemType === 'document' || itemType === 'report')) ? (
                                            <div style={{
                                                width: '100px',
                                                height: '100px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                background: '#f8f9fa',
                                                borderRadius: '8px',
                                                border: '1px solid #e0e0e0',
                                                gap: '5px'
                                            }}>
                                                <i className="fas fa-file-pdf" style={{ fontSize: '2rem', color: '#dc3545' }}></i>
                                                <span style={{ fontSize: '0.7rem', color: '#666' }}>PDF</span>
                                                {(item.pdf_url || item.file_url || (item.image_url && item.image_url.toLowerCase().endsWith('.pdf'))) && (
                                                    <a 
                                                        href={item.file_url || item.pdf_url || item.image_url} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        style={{ fontSize: '0.7rem', color: '#0a2540', textDecoration: 'underline' }}
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        View
                                                    </a>
                                                )}
                                            </div>
                                        ) : item.image_url ? (
                                            <img 
                                                src={item.image_url} 
                                                alt={item.title || itemType}
                                                style={{
                                                    width: '100px',
                                                    height: '100px',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px',
                                                    border: '1px solid #e0e0e0'
                                                }}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        ) : null}
                                    </div>
                                )}
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ margin: 0, color: '#0a2540', marginBottom: '10px' }}>
                                        {item.title || item.name || `${itemType} #${item.id}`}
                                    </h4>
                                    {item.subtitle && (
                                        <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '0.9rem', fontWeight: '600' }}>
                                            {item.subtitle}
                                        </p>
                                    )}
                                    {item.description && (
                                        <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '10px', whiteSpace: 'pre-wrap' }}>
                                            {item.description.length > 200 ? item.description.substring(0, 200) + '...' : item.description}
                                        </div>
                                    )}
                                    {itemType === 'document' && item.image_url && (
                                        <div style={{ marginBottom: '10px' }}>
                                            <a 
                                                href={item.image_url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '5px',
                                                    padding: '5px 12px',
                                                    background: '#dc3545',
                                                    color: 'white',
                                                    borderRadius: '4px',
                                                    fontSize: '0.85rem',
                                                    textDecoration: 'none',
                                                    fontWeight: '600'
                                                }}
                                            >
                                                <i className="fas fa-file-pdf"></i>
                                                View/Download PDF
                                            </a>
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', gap: '15px', fontSize: '0.85rem', color: '#999', flexWrap: 'wrap' }}>
                                        {item.category && <span>Category: {item.category}</span>}
                                        {item.organization && <span>Organization: {item.organization}</span>}
                                        {item.year && <span>Year: {item.year}</span>}
                                        {item.icon && <span>Icon: <i className={item.icon}></i></span>}
                                        <span style={{ color: item.is_active ? '#28a745' : '#dc3545' }}>
                                            {item.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '10px', marginLeft: '15px' }}>
                                    <button
                                        onClick={() => handleEdit(item)}
                                        style={{
                                            padding: '6px 15px',
                                            background: '#0a2540',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            fontSize: '0.85rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}
                                    >
                                        <i className="fas fa-edit"></i>
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(item)}
                                        style={{
                                            padding: '6px 15px',
                                            background: '#dc3545',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            fontSize: '0.85rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}
                                    >
                                        <i className="fas fa-trash"></i>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ItemManager;

