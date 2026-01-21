import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { faqsAPI } from '../services/api';
import { getPageContent } from '../services/publicApi';

const FAQ = () => {
    const { t } = useTranslation();
    const [content, setContent] = useState({});
    const [activeIndex, setActiveIndex] = useState(null);
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Add cache busting to ensure fresh data
                const timestamp = new Date().getTime();
                
                try {
                    const [contentResponse, faqsResponse] = await Promise.all([
                        getPageContent('faq'),
                        faqsAPI.getAll({ _t: timestamp })
                    ]);
                    
                    // Handle page content
                    if (contentResponse.success) {
                        const contentData = Array.isArray(contentResponse.data) 
                            ? contentResponse.data.reduce((acc, item) => {
                                acc[item.section_key] = item.content;
                                return acc;
                            }, {})
                            : contentResponse.data;
                        setContent(contentData);
                        console.log('FAQ page content loaded:', contentData);
                    }
                    
                    // Handle FAQs
                    if (faqsResponse && faqsResponse.success && faqsResponse.data) {
                        const faqsData = faqsResponse.data || [];
                        setFaqs(Array.isArray(faqsData) ? faqsData : []);
                        console.log('FAQs loaded:', faqsData.length, 'FAQs');
                    } else {
                        console.warn('Failed to load FAQs:', faqsResponse);
                        setFaqs([]);
                    }
                } catch (apiError) {
                    console.error('❌ API Request Error:', apiError);
                    setError(`Failed to connect to API: ${apiError.message}`);
                    setFaqs([]);
                }
            } catch (err) {
                console.error('❌ Unexpected Error:', err);
                setError(err.message);
                setFaqs([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    if (loading) {
        return (
            <section className="section text-center" style={{ padding: '100px 0' }}>
                <div className="container">
                    <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '15px' }}></i>
                    <p>{t('loading') || 'Loading...'}</p>
                </div>
            </section>
        );
    }

    return (
        <>
            {/* Page Header */}
            <section className="section text-center" style={{ backgroundColor: 'var(--primary-color)', color: 'white', padding: '60px 0' }}>
                <div className="container">
                    <h1 style={{ color: 'white', fontSize: '3rem' }}>
                        {content.page_title || t('faq.title')}
                    </h1>
                    <p style={{ opacity: '0.8' }}>
                        {content.page_subtitle || t('faq.subtitle')}
                    </p>
                </div>
            </section>

            {/* Introduction Section (if exists) */}
            {content.intro_text && (
                <section className="section">
                    <div className="container" style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#666' }}>{content.intro_text}</p>
                    </div>
                </section>
            )}

            {/* FAQ Accordion */}
            <section className="section" style={{ backgroundColor: 'var(--light-bg)' }}>
                <div className="container" style={{ maxWidth: '800px' }}>
                    {error && (
                        <div style={{ 
                            textAlign: 'center', 
                            padding: '40px 20px',
                            background: '#fff3cd',
                            border: '2px solid #ffc107',
                            borderRadius: '10px',
                            marginBottom: '30px'
                        }}>
                            <i className="fas fa-exclamation-triangle" style={{ fontSize: '3rem', color: '#856404', marginBottom: '15px', display: 'block' }}></i>
                            <h3 style={{ color: '#856404', marginBottom: '10px' }}>Error Loading FAQs</h3>
                            <p style={{ color: '#856404', fontSize: '0.95rem' }}>{error}</p>
                        </div>
                    )}

                    {!error && faqs.length === 0 && (
                        <div style={{ 
                            textAlign: 'center', 
                            padding: '80px 20px',
                            background: 'white',
                            borderRadius: '10px',
                            boxShadow: 'var(--shadow-md)'
                        }}>
                            <i className="fas fa-question-circle" style={{ fontSize: '4rem', color: '#ccc', marginBottom: '20px', display: 'block' }}></i>
                            <h3 style={{ color: '#999', marginBottom: '10px' }}>No FAQs Available</h3>
                            <p style={{ color: '#999' }}>FAQs will be available here once they are added from the admin panel.</p>
                        </div>
                    )}

                    {!error && faqs.length > 0 && (
                        <>
                            {content.faq_intro && (
                                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                                    <p style={{ fontSize: '1.1rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
                                        {content.faq_intro}
                                    </p>
                                </div>
                            )}
                            {faqs.map((faq, index) => (
                                <div key={faq.id || index} className={`accordion-item ${activeIndex === index ? 'active' : ''}`}
                                    style={{
                                        background: 'white',
                                        borderRadius: '5px',
                                        marginBottom: '15px',
                                        boxShadow: 'var(--shadow-sm)',
                                        overflow: 'hidden'
                                    }}>
                                    <div className="accordion-header"
                                        onClick={() => toggleAccordion(index)}
                                        style={{
                                            padding: '20px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            backgroundColor: 'white',
                                            transition: 'background-color 0.3s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--light-bg)'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                                        <div style={{ flex: 1 }}>
                                            {faq.category && (
                                                <span style={{
                                                    display: 'inline-block',
                                                    fontSize: '0.75rem',
                                                    background: '#e3f2fd',
                                                    color: '#0d47a1',
                                                    padding: '3px 8px',
                                                    borderRadius: '4px',
                                                    marginRight: '10px',
                                                    fontWeight: '600'
                                                }}>
                                                    {faq.category}
                                                </span>
                                            )}
                                            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--primary-color)', display: 'inline' }}>
                                                {faq.question}
                                            </h3>
                                        </div>
                                        <i className={`fas fa-chevron-down accordion-icon`}
                                            style={{
                                                transition: 'transform 0.3s',
                                                transform: activeIndex === index ? 'rotate(180deg)' : 'rotate(0deg)',
                                                marginLeft: '15px',
                                                flexShrink: 0
                                            }}></i>
                                    </div>
                                    <div className="accordion-content"
                                        style={{
                                            padding: activeIndex === index ? '20px' : '0 20px',
                                            maxHeight: activeIndex === index ? '500px' : '0',
                                            overflow: 'hidden',
                                            transition: 'max-height 0.3s ease-out, padding 0.3s ease',
                                            backgroundColor: 'white',
                                            borderTop: activeIndex === index ? '1px solid var(--border-color)' : '1px solid transparent'
                                        }}>
                                        <p style={{ margin: 0, lineHeight: '1.8', color: '#555' }}>{faq.answer}</p>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </section>
        </>
    );
};

export default FAQ;


