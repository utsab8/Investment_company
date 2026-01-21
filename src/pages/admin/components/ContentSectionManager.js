import React, { useState } from 'react';

/**
 * Reusable component for managing content sections with add/edit/delete
 */
const ContentSectionManager = ({ 
    sections = [], 
    onSave, 
    onDelete, 
    saving = false,
    sectionLabel = 'Section'
}) => {
    const [editingId, setEditingId] = useState(null);
    const [editingContent, setEditingContent] = useState('');
    const [editingKey, setEditingKey] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [newSectionKey, setNewSectionKey] = useState('');
    const [newSectionContent, setNewSectionContent] = useState('');

    const handleEdit = (section) => {
        setEditingId(section.id || section.section_key);
        setEditingKey(section.section_key || section.key);
        setEditingContent(section.content || section.value || '');
        setShowAddForm(false);
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditingContent('');
        setEditingKey('');
        setNewSectionKey('');
        setNewSectionContent('');
        setShowAddForm(false);
    };

    const handleSave = async () => {
        if (editingId) {
            // Update existing
            await onSave(editingKey, editingContent, editingId);
        } else if (showAddForm) {
            // Create new
            if (!newSectionKey.trim()) {
                alert('Please enter a section key');
                return;
            }
            await onSave(newSectionKey, newSectionContent, null);
        }
        handleCancel();
    };

    const handleDeleteClick = async (section) => {
        if (window.confirm(`Are you sure you want to delete "${section.section_key || section.key}"?`)) {
            await onDelete(section.id || section.section_key);
        }
    };

    const handleAddNew = () => {
        setShowAddForm(true);
        setEditingId(null);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, color: '#0a2540' }}>Content Sections</h3>
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
                    Add New {sectionLabel}
                </button>
            </div>

            {/* Add New Form */}
            {showAddForm && (
                <div style={{
                    background: '#fff3cd',
                    padding: '20px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    border: '2px solid #ffc107'
                }}>
                    <h4 style={{ marginTop: 0 }}>Add New {sectionLabel}</h4>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                            Section Key * (e.g., hero_title, about_text)
                        </label>
                        <input
                            type="text"
                            value={newSectionKey}
                            onChange={(e) => setNewSectionKey(e.target.value)}
                            placeholder="hero_title"
                            style={{
                                width: '100%',
                                padding: '8px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '0.9rem'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                            Content *
                        </label>
                        <textarea
                            value={newSectionContent}
                            onChange={(e) => setNewSectionContent(e.target.value)}
                            rows="6"
                            placeholder="Enter content here..."
                            style={{
                                width: '100%',
                                padding: '8px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '0.9rem',
                                fontFamily: 'inherit'
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={handleSave}
                            disabled={saving || !newSectionKey.trim() || !newSectionContent.trim()}
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

            {/* Sections List */}
            {sections.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '40px',
                    background: 'white',
                    borderRadius: '8px',
                    color: '#999'
                }}>
                    <i className="fas fa-inbox" style={{ fontSize: '3rem', marginBottom: '10px', opacity: 0.3 }}></i>
                    <p>No content sections found. Click "Add New {sectionLabel}" to create one.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '15px' }}>
                    {sections.map((section) => {
                        const isEditing = editingId === (section.id || section.section_key);
                        const sectionKey = section.section_key || section.key;
                        const sectionContent = section.content || section.value || '';

                        return (
                            <div
                                key={section.id || sectionKey}
                                style={{
                                    background: isEditing ? '#fff3cd' : 'white',
                                    padding: '20px',
                                    borderRadius: '8px',
                                    border: isEditing ? '2px solid #ffc107' : '1px solid #e0e0e0',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                }}
                            >
                                {isEditing ? (
                                    <div>
                                        <div style={{ marginBottom: '15px' }}>
                                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                                Section Key
                                            </label>
                                            <input
                                                type="text"
                                                value={editingKey}
                                                disabled
                                                style={{
                                                    width: '100%',
                                                    padding: '8px',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '4px',
                                                    background: '#f5f5f5',
                                                    fontSize: '0.9rem'
                                                }}
                                            />
                                        </div>
                                        <div style={{ marginBottom: '15px' }}>
                                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                                Content
                                            </label>
                                            <textarea
                                                value={editingContent}
                                                onChange={(e) => setEditingContent(e.target.value)}
                                                rows="8"
                                                style={{
                                                    width: '100%',
                                                    padding: '8px',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '4px',
                                                    fontSize: '0.9rem',
                                                    fontFamily: 'inherit'
                                                }}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px' }}>
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
                                                {saving ? 'Saving...' : 'Save Changes'}
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
                                ) : (
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                                            <div>
                                                <h4 style={{ margin: 0, color: '#0a2540', marginBottom: '5px' }}>
                                                    {sectionKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                </h4>
                                                <div style={{
                                                    fontSize: '0.85rem',
                                                    color: '#666',
                                                    marginTop: '10px',
                                                    whiteSpace: 'pre-wrap',
                                                    lineHeight: '1.6',
                                                    background: '#f8f9fa',
                                                    padding: '15px',
                                                    borderRadius: '5px',
                                                    maxHeight: '200px',
                                                    overflowY: 'auto'
                                                }}>
                                                    {sectionContent || '(Empty)'}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                                            <button
                                                onClick={() => handleEdit(section)}
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
                                                onClick={() => handleDeleteClick(section)}
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
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ContentSectionManager;




