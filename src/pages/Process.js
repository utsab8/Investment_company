import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getPageContent } from '../services/publicApi';
import { processItemsAPI } from '../services/api';

const Process = () => {
    const { t } = useTranslation();
    const [content, setContent] = useState({});
    const [processSteps, setProcessSteps] = useState([]);
    const [riskManagementItems, setRiskManagementItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                // Add cache busting to ensure fresh data
                const timestamp = new Date().getTime();
                const [contentResponse, stepsResponse, riskResponse] = await Promise.all([
                    getPageContent('process'),
                    processItemsAPI.getAll('step'),
                    processItemsAPI.getAll('risk_management')
                ]);
                
                if (contentResponse.success) {
                    const contentData = Array.isArray(contentResponse.data) 
                        ? contentResponse.data.reduce((acc, item) => {
                            acc[item.section_key] = item.content;
                            return acc;
                        }, {})
                        : contentResponse.data;
                    setContent(contentData);
                    console.log('Process page content loaded:', contentData);
                } else {
                    console.warn('Failed to load process content:', contentResponse);
                }
                
                if (stepsResponse.success) {
                    const steps = stepsResponse.data || [];
                    setProcessSteps(steps);
                    console.log('Process steps loaded:', steps.length, 'steps');
                } else {
                    console.warn('Failed to load process steps:', stepsResponse);
                }
                
                if (riskResponse.success) {
                    const riskItems = riskResponse.data || [];
                    setRiskManagementItems(riskItems);
                    console.log('Risk management items loaded:', riskItems.length, 'items');
                } else {
                    console.warn('Failed to load risk management items:', riskResponse);
                }
            } catch (error) {
                console.error('Error loading process data:', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) {
        return <div style={{ padding: '50px', textAlign: 'center' }}>Loading...</div>;
    }

    // Determine circle color based on step number
    const getStepColor = (stepNumber, index) => {
        if (stepNumber !== null && stepNumber !== undefined) {
            return stepNumber % 2 === 1 ? 'var(--accent-color)' : 'var(--primary-color)';
        }
        // Fallback: alternate based on index
        return index % 2 === 0 ? 'var(--accent-color)' : 'var(--primary-color)';
    };

    return (
        <>
            {/* Page Header */}
            <section className="section text-center" style={{ backgroundColor: 'var(--primary-color)', color: 'white', padding: '60px 0' }}>
                <div className="container">
                    <h1 style={{ color: 'white', fontSize: '3rem' }}>
                        {content.page_title || content.intro_title || t('process.title')}
                    </h1>
                    <p style={{ opacity: '0.8' }}>
                        {content.page_subtitle || content.intro_text || t('process.subtitle')}
                    </p>
                </div>
            </section>

            {/* Introduction Section (if exists) */}
            {content.intro_title && (
                <section className="section">
                    <div className="container" style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                        <h2 style={{ marginBottom: '20px', color: 'var(--primary-color)' }}>{content.intro_title}</h2>
                        {content.intro_text && (
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#666' }}>{content.intro_text}</p>
                        )}
                    </div>
                </section>
            )}

            {/* Process Flow */}
            {processSteps.length > 0 && (
                <section className="section">
                    <div className="container">
                        <div style={{ position: 'relative', maxWidth: '900px', margin: '0 auto' }}>
                            {/* Connecting Line */}
                            <div style={{ 
                                position: 'absolute', 
                                left: '50px', 
                                top: 0, 
                                bottom: 0, 
                                width: '4px', 
                                background: 'var(--border-color)', 
                                opacity: '0.5',
                                zIndex: 0
                            }}></div>

                            {/* Dynamic Process Steps */}
                            {processSteps.map((step, index) => (
                                <div key={step.id} style={{ display: 'flex', gap: '40px', marginBottom: '60px', position: 'relative' }}>
                                    <div style={{ 
                                        width: '100px', 
                                        height: '100px', 
                                        background: getStepColor(step.step_number, index), 
                                        borderRadius: '50%', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center', 
                                        fontSize: '2rem', 
                                        color: 'white', 
                                        fontWeight: 'bold', 
                                        flexShrink: 0, 
                                        border: '5px solid white', 
                                        position: 'relative', 
                                        zIndex: 1,
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                    }}>
                                        {step.step_number || index + 1}
                                    </div>
                                    <div style={{ paddingTop: '20px', flex: 1 }}>
                                        {step.image_url && (
                                            <div style={{ marginBottom: '20px' }}>
                                                <img 
                                                    src={step.image_url} 
                                                    alt={step.title}
                                                    style={{
                                                        maxWidth: '100%',
                                                        maxHeight: '300px',
                                                        borderRadius: '8px',
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                                    }}
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                            </div>
                                        )}
                                        <h3 className="text-primary" style={{ marginBottom: '15px' }}>{step.title}</h3>
                                        {step.subtitle && (
                                            <p style={{ fontWeight: '600', color: '#666', marginBottom: '10px' }}>{step.subtitle}</p>
                                        )}
                                        <p style={{ lineHeight: '1.8', color: '#666' }}>{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Risk Management */}
            {riskManagementItems.length > 0 && (
                <section className="section" style={{ backgroundColor: 'var(--light-bg)' }}>
                    <div className="container">
                        <h2 className="text-center" style={{ marginBottom: '50px' }}>
                            {content.risk_management_title || t('process.riskManagementTitle')}
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                            {riskManagementItems.map((item) => (
                                <div 
                                    key={item.id}
                                    style={{ 
                                        background: 'white', 
                                        padding: '30px', 
                                        borderRadius: '10px', 
                                        boxShadow: 'var(--shadow-sm)',
                                        transition: 'transform 0.3s, box-shadow 0.3s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-5px)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                                    }}
                                >
                                    {item.image_url && (
                                        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                                            <img 
                                                src={item.image_url} 
                                                alt={item.title}
                                                style={{
                                                    maxWidth: '100%',
                                                    maxHeight: '200px',
                                                    borderRadius: '8px'
                                                }}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    )}
                                    <h4 className="text-accent" style={{ marginBottom: '15px' }}>{item.title}</h4>
                                    {item.subtitle && (
                                        <p style={{ fontWeight: '600', color: '#666', marginBottom: '10px', fontSize: '0.95rem' }}>
                                            {item.subtitle}
                                        </p>
                                    )}
                                    <p style={{ lineHeight: '1.8', color: '#666' }}>{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Fallback message if no content */}
            {processSteps.length === 0 && riskManagementItems.length === 0 && (
                <section className="section">
                    <div className="container" style={{ textAlign: 'center', padding: '50px' }}>
                        <p style={{ fontSize: '1.1rem', color: '#666' }}>
                            Process content is being prepared. Please check back soon.
                        </p>
                    </div>
                </section>
            )}
        </>
    );
};

export default Process;
