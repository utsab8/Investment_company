import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { contactAPI } from '../services/api';
import { getPageContent, getWebsiteSettings } from '../services/publicApi';

const Contact = () => {
    const { t } = useTranslation();
    const [content, setContent] = useState({});
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: t('contact.investmentInquiry'),
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({ type: null, message: '' });

    useEffect(() => {
        const loadData = async () => {
            try {
                // Add cache busting to ensure fresh data
                const timestamp = new Date().getTime();
                const [contentResponse, settingsResponse] = await Promise.all([
                    getPageContent('contact'),
                    getWebsiteSettings()
                ]);
                if (contentResponse.success) {
                    // Ensure content is an object (not array)
                    const contentData = Array.isArray(contentResponse.data) 
                        ? contentResponse.data.reduce((acc, item) => {
                            acc[item.section_key] = item.content;
                            return acc;
                        }, {})
                        : contentResponse.data;
                    console.log('Contact page content loaded:', contentData);
                    setContent(contentData);
                } else {
                    console.error('Failed to load content:', contentResponse);
                }
                if (settingsResponse.success) {
                    setSettings(settingsResponse.data);
                }
            } catch (error) {
                console.error('Error loading contact page data:', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) {
        return <div style={{ padding: '50px', textAlign: 'center' }}>Loading...</div>;
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus({ type: null, message: '' });

        try {
            const response = await contactAPI.submit(formData);
            if (response.success) {
                setSubmitStatus({ type: 'success', message: t('contact.thankYouMessage') || 'Thank you! Your message has been sent successfully.' });
                setFormData({ name: '', email: '', subject: t('contact.investmentInquiry'), message: '' });
            } else {
                setSubmitStatus({ type: 'error', message: response.message || 'Failed to send message. Please try again.' });
            }
        } catch (error) {
            setSubmitStatus({ type: 'error', message: error.message || 'An error occurred. Please try again later.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <section className="section text-center" style={{ backgroundColor: 'var(--primary-color)', color: 'white', padding: '60px 0' }}>
                <div className="container">
                    <h1 style={{ color: 'white', fontSize: '3rem' }}>{content.page_title || t('contact.title')}</h1>
                    <p style={{ opacity: '0.8' }}>{content.page_subtitle || t('contact.subtitle')}</p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '50px' }}>
                        {/* Contact Info */}
                        <div style={{ flex: 1, minWidth: '300px' }}>
                            <h2 className="text-primary" style={{ marginBottom: '30px' }}>{content.contact_title || t('contact.getInTouch')}</h2>
                            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                                <div style={{ width: '50px', height: '50px', background: 'var(--light-bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-color)', fontSize: '1.2rem' }}>
                                    <i className="fas fa-map-marker-alt"></i>
                                </div>
                                <div>
                                    <h4>{content.office_title || t('contact.mainOffice')}</h4>
                                    <p style={{ whiteSpace: 'pre-line' }}>{content.office_address || settings.company_address || t('contact.address')}</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                                <div style={{ width: '50px', height: '50px', background: 'var(--light-bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-color)', fontSize: '1.2rem' }}>
                                    <i className="fas fa-phone"></i>
                                </div>
                                <div>
                                    <h4>{content.phone_title || t('contact.phoneNumber')}</h4>
                                    <p style={{ whiteSpace: 'pre-line' }}>{content.phone_numbers || settings.company_phone || t('contact.phone1')}</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                                <div style={{ width: '50px', height: '50px', background: 'var(--light-bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-color)', fontSize: '1.2rem' }}>
                                    <i className="fas fa-envelope"></i>
                                </div>
                                <div>
                                    <h4>{content.email_title || t('contact.emailAddress')}</h4>
                                    <p style={{ whiteSpace: 'pre-line' }}>{content.email_addresses || settings.company_email || t('contact.email1')}</p>
                                </div>
                            </div>

                            {/* Map */}
                            {content.map_embed ? (
                                <div style={{ marginTop: '40px', borderRadius: '10px', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }} dangerouslySetInnerHTML={{ __html: content.map_embed }} />
                            ) : (
                                <div style={{ marginTop: '40px', borderRadius: '10px', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-74.01104108459503!3d40.70780367933185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a165bedccab%3A0x2cb2ddf003b5ae!2sWall%20St%2C%20New%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1646813290635!5m2!1sen!2sus"
                                        width="100%" height="300" style={{ border: 0 }} allowFullScreen="" loading="lazy" title="Map">
                                    </iframe>
                                </div>
                            )}
                        </div>

                        {/* Contact Form */}
                        <div style={{ flex: 1, minWidth: '300px', background: 'white', padding: '40px', borderRadius: '10px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-color)' }}>
                            <h2 className="text-primary" style={{ marginBottom: '30px' }}>{content.form_title || t('contact.sendMessage')}</h2>
                            <form onSubmit={handleSubmit}>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>{t('contact.fullName')}</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder={t('contact.namePlaceholder')}
                                        style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '5px', outline: 'none', fontFamily: 'inherit' }} required />
                                </div>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>{t('contact.emailAddress')}</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder={t('contact.emailPlaceholder')}
                                        style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '5px', outline: 'none', fontFamily: 'inherit' }} required />
                                </div>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>{t('contact.subject')}</label>
                                    <select name="subject" value={formData.subject} onChange={handleChange}
                                        style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '5px', outline: 'none', fontFamily: 'inherit', background: 'white' }}>
                                        <option>{t('contact.investmentInquiry')}</option>
                                        <option>{t('contact.supportQuestion')}</option>
                                        <option>{t('contact.partnership')}</option>
                                        <option>{t('contact.other')}</option>
                                    </select>
                                </div>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>{t('contact.message')}</label>
                                    <textarea name="message" value={formData.message} onChange={handleChange} rows="5" placeholder={t('contact.messagePlaceholder')}
                                        style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '5px', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }} required></textarea>
                                </div>
                                {submitStatus.message && (
                                    <div style={{
                                        padding: '12px',
                                        marginBottom: '20px',
                                        borderRadius: '5px',
                                        backgroundColor: submitStatus.type === 'success' ? '#d4edda' : '#f8d7da',
                                        color: submitStatus.type === 'success' ? '#155724' : '#721c24',
                                        border: `1px solid ${submitStatus.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
                                    }}>
                                        {submitStatus.message}
                                    </div>
                                )}
                                <button 
                                    type="submit" 
                                    className="btn btn-primary" 
                                    style={{ width: '100%', border: 'none' }}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? t('contact.sending') || 'Sending...' : t('contact.sendMessageBtn')}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Contact;


