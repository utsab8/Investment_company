import React, { useState, useEffect } from 'react';
import AdminLayout from '../AdminLayout';
import { adminSettingsAPI, adminUploadAPI } from '../../../services/adminApi';
import '../Admin.css';

const AdminSettings = () => {
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState({});
    const [message, setMessage] = useState({ type: '', text: '' });
    const [activeTab, setActiveTab] = useState('navbar');
    const [logoPreview, setLogoPreview] = useState(null);
    const [uploadingLogo, setUploadingLogo] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    useEffect(() => {
        if (settings.company_logo) {
            const logoUrl = settings.company_logo.startsWith('http') 
                ? settings.company_logo 
                : `http://localhost:8000${settings.company_logo.startsWith('/') ? '' : '/'}${settings.company_logo}`;
            setLogoPreview(logoUrl);
        } else {
            setLogoPreview(null);
        }
    }, [settings.company_logo]);

    const loadSettings = async () => {
        try {
            setLoading(true);
            const response = await adminSettingsAPI.getAll();
            if (response.success) {
                const settingsObj = {};
                if (Array.isArray(response.data)) {
                    response.data.forEach(setting => {
                        settingsObj[setting.setting_key] = setting.setting_value;
                    });
                } else if (response.data) {
                    Object.assign(settingsObj, response.data);
                }
                setSettings(settingsObj);
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to load settings' });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateSetting = async (key, value) => {
        const saveKey = `save_${key}`;
        setSaving(prev => ({ ...prev, [saveKey]: true }));
        setMessage({ type: '', text: '' });

        try {
            const response = await adminSettingsAPI.update(key, value);
            if (response.success) {
                setMessage({ type: 'success', text: 'Setting updated successfully!' });
                setSettings(prev => ({ ...prev, [key]: value }));
            } else {
                setMessage({ type: 'error', text: response.message || 'Failed to save' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to save' });
        } finally {
            setSaving(prev => ({ ...prev, [saveKey]: false }));
        }
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
        if (!allowedTypes.includes(file.type)) {
            alert('Please select an image file (jpg, png, gif, webp, svg)');
            e.target.value = '';
            return;
        }

        // Check file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size must be less than 5MB');
            e.target.value = '';
            return;
        }

        setUploadingLogo(true);
        setMessage({ type: '', text: '' });

        try {
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);

            // Upload file
            const response = await adminUploadAPI.upload(file, 'logo', 'Company Logo');
            
            if (response.success && response.data && response.data.url) {
                const logoUrl = response.data.url;
                // Save logo URL to settings
                await handleUpdateSetting('company_logo', logoUrl);
            } else {
                setMessage({ type: 'error', text: response.message || 'Failed to upload logo' });
            }
        } catch (error) {
            console.error('Upload error:', error);
            setMessage({ type: 'error', text: error.message || 'Failed to upload logo' });
        } finally {
            setUploadingLogo(false);
            e.target.value = '';
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div style={{ padding: '50px', textAlign: 'center' }}>
                    <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#0a2540' }}></i>
                    <p>Loading...</p>
                </div>
            </AdminLayout>
        );
    }

    const SettingField = ({ label, settingKey, type = 'text', value, placeholder, onChange, saving, textarea = false }) => {
        const fieldValue = settings[settingKey] || value || '';
        const isSaving = saving[`save_${settingKey}`] || false;

        return (
            <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#0a2540' }}>
                    {label}
                </label>
                {textarea ? (
                    <textarea
                        value={fieldValue}
                        onChange={(e) => onChange(settingKey, e.target.value)}
                        onBlur={() => handleUpdateSetting(settingKey, fieldValue)}
                        placeholder={placeholder}
                        disabled={isSaving}
                        style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            fontSize: '1rem',
                            minHeight: '100px',
                            fontFamily: 'inherit',
                            resize: 'vertical'
                        }}
                    />
                ) : (
                    <input
                        type={type}
                        value={fieldValue}
                        onChange={(e) => onChange(settingKey, e.target.value)}
                        onBlur={() => handleUpdateSetting(settingKey, fieldValue)}
                        placeholder={placeholder}
                        disabled={isSaving}
                        style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            fontSize: '1rem'
                        }}
                    />
                )}
                {isSaving && (
                    <small style={{ color: '#666', marginTop: '5px', display: 'block' }}>
                        <i className="fas fa-spinner fa-spin"></i> Saving...
                    </small>
                )}
            </div>
        );
    };

    return (
        <AdminLayout>
            <div style={{ padding: '30px', paddingBottom: '50px', maxWidth: '1400px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
                <div style={{ marginBottom: '30px', borderBottom: '2px solid #e0e0e0', paddingBottom: '20px' }}>
                    <h1 style={{ margin: 0, fontSize: '2rem', color: '#0a2540', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <i className="fas fa-cog"></i>
                        Website Settings
                    </h1>
                    <p style={{ margin: '10px 0 0 0', color: '#666', fontSize: '1rem' }}>
                        Manage navbar logo, company name, and footer content
                    </p>
                </div>

                {message.text && (
                    <div style={{
                        padding: '15px 20px',
                        marginBottom: '25px',
                        borderRadius: '8px',
                        background: message.type === 'success' ? '#d4edda' : '#f8d7da',
                        color: message.type === 'success' ? '#155724' : '#721c24',
                        border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : message.type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}`}></i>
                            {message.text}
                        </span>
                        <button onClick={() => setMessage({ type: '', text: '' })} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'inherit' }}>
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                )}

                {/* Tabs */}
                <div style={{ marginBottom: '25px', borderBottom: '2px solid #e0e0e0', display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => setActiveTab('navbar')}
                        style={{
                            padding: '12px 25px',
                            background: activeTab === 'navbar' ? '#0a2540' : 'transparent',
                            color: activeTab === 'navbar' ? 'white' : '#666',
                            border: 'none',
                            borderBottom: activeTab === 'navbar' ? '3px solid #0a2540' : '3px solid transparent',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: activeTab === 'navbar' ? '600' : '400',
                            transition: 'all 0.3s'
                        }}
                    >
                        <i className="fas fa-bars" style={{ marginRight: '8px' }}></i>
                        Navbar Settings
                    </button>
                    <button
                        onClick={() => setActiveTab('footer')}
                        style={{
                            padding: '12px 25px',
                            background: activeTab === 'footer' ? '#0a2540' : 'transparent',
                            color: activeTab === 'footer' ? 'white' : '#666',
                            border: 'none',
                            borderBottom: activeTab === 'footer' ? '3px solid #0a2540' : '3px solid transparent',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: activeTab === 'footer' ? '600' : '400',
                            transition: 'all 0.3s'
                        }}
                    >
                        <i className="fas fa-file-alt" style={{ marginRight: '8px' }}></i>
                        Footer Settings
                    </button>
                </div>

                {/* Navbar Tab */}
                {activeTab === 'navbar' && (
                    <div style={{ background: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                        <div style={{ marginBottom: '30px', paddingBottom: '20px', borderBottom: '2px solid #e0e0e0' }}>
                            <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#0a2540', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <i className="fas fa-bars"></i>
                                Navbar Configuration
                            </h2>
                            <p style={{ margin: '10px 0 0 0', color: '#666' }}>
                                Manage your website logo and company name displayed in the navbar
                            </p>
                        </div>

                        {/* Logo Upload */}
                        <div style={{ marginBottom: '30px' }}>
                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#0a2540' }}>
                                Company Logo
                            </label>
                            {logoPreview && (
                                <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                                    <img
                                        src={logoPreview}
                                        alt="Company Logo"
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                            border: '3px solid #0a2540'
                                        }}
                                        onError={() => setLogoPreview(null)}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <p style={{ margin: 0, color: '#666' }}>Current Logo</p>
                                        <a href={logoPreview} target="_blank" rel="noopener noreferrer" style={{ color: '#0a2540', fontSize: '0.9rem' }}>
                                            {settings.company_logo || 'View Logo'}
                                        </a>
                                    </div>
                                </div>
                            )}
                            <label style={{
                                display: 'inline-block',
                                padding: '12px 25px',
                                background: uploadingLogo ? '#6c757d' : '#0a2540',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: uploadingLogo ? 'not-allowed' : 'pointer',
                                fontSize: '1rem',
                                fontWeight: '600'
                            }}>
                                <i className="fas fa-upload" style={{ marginRight: '8px' }}></i>
                                {uploadingLogo ? 'Uploading...' : 'Choose Logo Image'}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoUpload}
                                    disabled={uploadingLogo}
                                    style={{ display: 'none' }}
                                />
                            </label>
                            <p style={{ marginTop: '10px', color: '#666', fontSize: '0.9rem' }}>
                                Recommended: Square image (300x300px or larger), PNG or JPG format, max 5MB
                            </p>
                            {settings.company_logo && (
                                <div style={{ marginTop: '10px' }}>
                                    <input
                                        type="text"
                                        value={settings.company_logo || ''}
                                        onChange={(e) => setSettings(prev => ({ ...prev, company_logo: e.target.value }))}
                                        onBlur={() => handleUpdateSetting('company_logo', settings.company_logo)}
                                        placeholder="Or enter logo URL directly"
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '1px solid #ddd',
                                            borderRadius: '5px',
                                            fontSize: '0.9rem',
                                            marginTop: '10px'
                                        }}
                                    />
                                    <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>
                                        Current URL: {settings.company_logo}
                                    </small>
                                </div>
                            )}
                        </div>

                        {/* Company Name */}
                        <SettingField
                            label="Company Name"
                            settingKey="company_name"
                            type="text"
                            value={settings.company_name}
                            placeholder="e.g., MRB International"
                            onChange={(settingKey, value) => setSettings(prev => ({ ...prev, [settingKey]: value }))}
                            saving={saving}
                        />
                    </div>
                )}

                {/* Footer Tab */}
                {activeTab === 'footer' && (
                    <div style={{ background: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                        <div style={{ marginBottom: '30px', paddingBottom: '20px', borderBottom: '2px solid #e0e0e0' }}>
                            <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#0a2540', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <i className="fas fa-file-alt"></i>
                                Footer Configuration
                            </h2>
                            <p style={{ margin: '10px 0 0 0', color: '#666' }}>
                                Manage footer content, copyright text, and contact information
                            </p>
                        </div>

                        {/* Footer Description */}
                        <SettingField
                            label="Footer Description"
                            settingKey="footer_description"
                            type="text"
                            value={settings.footer_description}
                            placeholder="Brief description about your company"
                            onChange={(settingKey, value) => setSettings(prev => ({ ...prev, [settingKey]: value }))}
                            saving={saving}
                            textarea={true}
                        />

                        {/* Footer Copyright */}
                        <SettingField
                            label="Footer Copyright Text"
                            settingKey="footer_copyright"
                            type="text"
                            value={settings.footer_copyright}
                            placeholder="e.g., © 2024 MRB International. All rights reserved."
                            onChange={(settingKey, value) => setSettings(prev => ({ ...prev, [settingKey]: value }))}
                            saving={saving}
                        />

                        {/* Company Contact Info */}
                        <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '2px solid #e0e0e0' }}>
                            <h3 style={{ margin: '0 0 20px 0', fontSize: '1.2rem', color: '#0a2540' }}>
                                <i className="fas fa-address-book" style={{ marginRight: '8px' }}></i>
                                Company Contact Information
                            </h3>
                            <SettingField
                                label="Company Address"
                                settingKey="company_address"
                                type="text"
                                value={settings.company_address}
                                placeholder="e.g., 123 Main Street, City, Country"
                                onChange={(settingKey, value) => setSettings(prev => ({ ...prev, [settingKey]: value }))}
                                saving={saving}
                                textarea={true}
                            />
                            <SettingField
                                label="Company Phone"
                                settingKey="company_phone"
                                type="tel"
                                value={settings.company_phone}
                                placeholder="e.g., +1 (555) 123-4567"
                                onChange={(settingKey, value) => setSettings(prev => ({ ...prev, [settingKey]: value }))}
                                saving={saving}
                            />
                            <SettingField
                                label="Company Email"
                                settingKey="company_email"
                                type="email"
                                value={settings.company_email}
                                placeholder="e.g., info@company.com"
                                onChange={(settingKey, value) => setSettings(prev => ({ ...prev, [settingKey]: value }))}
                                saving={saving}
                            />
                        </div>

                        {/* Social Media Links */}
                        <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '2px solid #e0e0e0' }}>
                            <h3 style={{ margin: '0 0 20px 0', fontSize: '1.2rem', color: '#0a2540' }}>
                                <i className="fas fa-share-alt" style={{ marginRight: '8px' }}></i>
                                Social Media Links
                            </h3>
                            <SettingField
                                label="Facebook URL"
                                settingKey="company_facebook"
                                type="url"
                                value={settings.company_facebook}
                                placeholder="https://facebook.com/yourpage"
                                onChange={(settingKey, value) => setSettings(prev => ({ ...prev, [settingKey]: value }))}
                                saving={saving}
                            />
                            <SettingField
                                label="Twitter URL"
                                settingKey="company_twitter"
                                type="url"
                                value={settings.company_twitter}
                                placeholder="https://twitter.com/yourhandle"
                                onChange={(settingKey, value) => setSettings(prev => ({ ...prev, [settingKey]: value }))}
                                saving={saving}
                            />
                            <SettingField
                                label="LinkedIn URL"
                                settingKey="company_linkedin"
                                type="url"
                                value={settings.company_linkedin}
                                placeholder="https://linkedin.com/company/yourcompany"
                                onChange={(settingKey, value) => setSettings(prev => ({ ...prev, [settingKey]: value }))}
                                saving={saving}
                            />
                            <SettingField
                                label="Instagram URL"
                                settingKey="company_instagram"
                                type="url"
                                value={settings.company_instagram}
                                placeholder="https://instagram.com/yourhandle"
                                onChange={(settingKey, value) => setSettings(prev => ({ ...prev, [settingKey]: value }))}
                                saving={saving}
                            />
                        </div>
                    </div>
                )}

                {/* Quick Tips */}
                <div style={{
                    marginTop: '30px',
                    padding: '20px',
                    background: '#e3f2fd',
                    borderRadius: '8px',
                    border: '1px solid #90caf9'
                }}>
                    <h4 style={{ marginTop: 0, color: '#0d47a1', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <i className="fas fa-lightbulb"></i>
                        Quick Tips
                    </h4>
                    <ul style={{ margin: 0, paddingLeft: '20px', color: '#1565c0', lineHeight: '1.8' }}>
                        <li>Changes are saved automatically when you click outside the input field</li>
                        <li>Logo should be a square image (recommended 300x300px or larger)</li>
                        <li>Company name appears next to the logo in the navbar</li>
                        <li>Footer description appears below the logo in the footer</li>
                        <li>Social media links will appear as icons in the footer</li>
                        <li>All changes are reflected on the website immediately</li>
                    </ul>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminSettings;
