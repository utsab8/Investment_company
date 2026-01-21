import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getPageContent } from '../services/publicApi';
import { servicesAPI } from '../services/api';

const Services = () => {
    const { t } = useTranslation();
    const [content, setContent] = useState({});
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [contentResponse, servicesResponse] = await Promise.all([
                    getPageContent('services'),
                    servicesAPI.getAll()
                ]);
                
                if (contentResponse.success) {
                    const contentData = Array.isArray(contentResponse.data) 
                        ? contentResponse.data.reduce((acc, item) => {
                            acc[item.section_key] = item.content;
                            return acc;
                        }, {})
                        : contentResponse.data;
                    setContent(contentData);
                }
                
                if (servicesResponse.success && servicesResponse.data) {
                    console.log('Services data received:', servicesResponse.data);
                    // Log each service's image_url
                    servicesResponse.data.forEach((service, index) => {
                        console.log(`Service ${index + 1} (ID: ${service.id}):`, {
                            title: service.title,
                            image_url: service.image_url,
                            has_image: !!service.image_url
                        });
                    });
                    setServices(servicesResponse.data);
                }
            } catch (error) {
                console.error('Error loading services data:', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) {
        return <div style={{ padding: '50px', textAlign: 'center' }}>Loading...</div>;
    }

    return (
        <>
            {/* Page Header */}
            <section className="section text-center" style={{ backgroundColor: 'var(--primary-color)', color: 'white', padding: '60px 0' }}>
                <div className="container">
                    <h1 style={{ color: 'white', fontSize: '3rem' }}>{content.page_title || t('services.title')}</h1>
                    <p style={{ opacity: '0.8' }}>{content.page_subtitle || t('services.subtitle')}</p>
                </div>
            </section>

            {/* Services Grid */}
            <section className="section">
                <div className="container">
                    {services.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '50px' }}>
                            <p>No services available at the moment. Please check back later.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' }}>
                            {services.map((service) => {
                                // Debug: Log service data
                                if (!service.image_url) {
                                    console.warn(`Service "${service.title}" (ID: ${service.id}) has no image_url:`, service);
                                }
                                return (
                                <div 
                                    key={service.id}
                                    style={{ 
                                        background: 'white', 
                                        border: '1px solid var(--border-color)', 
                                        borderRadius: '10px', 
                                        overflow: 'hidden', 
                                        transition: 'var(--transition)' 
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-lg)'}
                                    onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                                >
                                    {service.image_url && service.image_url.trim() ? (
                                        <div style={{ 
                                            height: '200px', 
                                            width: '100%',
                                            overflow: 'hidden',
                                            position: 'relative'
                                        }}>
                                            <img 
                                                src={service.image_url}
                                                alt={service.title || 'Service image'}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    objectPosition: 'center'
                                                }}
                                                onError={(e) => {
                                                    console.error('Failed to load image:', service.image_url);
                                                    e.target.style.display = 'none';
                                                    e.target.parentElement.innerHTML = `
                                                        <div style="
                                                            height: 200px; 
                                                            width: 100%;
                                                            background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
                                                            display: flex;
                                                            align-items: center;
                                                            justify-content: center;
                                                            color: white;
                                                            font-size: 1.2rem;
                                                        ">
                                                            Image Failed to Load
                                                        </div>
                                                    `;
                                                }}
                                                onLoad={() => {
                                                    console.log('Image loaded successfully:', service.image_url);
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div style={{ 
                                            height: '200px', 
                                            background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: '1.2rem'
                                        }}>
                                            No Image Available
                                        </div>
                                    )}
                                    <div style={{ padding: '30px' }}>
                                        <h3 className="text-primary">
                                            {service.title}
                                        </h3>
                                        <p style={{ marginBottom: '20px' }}>{service.description || t('services.descriptionPlaceholder')}</p>
                                        <Link to="/contact" className="btn btn-outline" style={{ width: '100%', textAlign: 'center' }}>
                                            {t('services.inquireNow')}
                                        </Link>
                                    </div>
                                </div>
                            );
                            })}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default Services;


