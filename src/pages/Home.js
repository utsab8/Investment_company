import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getWebsiteSettings, getPageContent } from '../services/publicApi';

const Home = () => {
    const { t } = useTranslation();
    const [settings, setSettings] = useState({});
    const [content, setContent] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [settingsResponse, contentResponse] = await Promise.all([
                    getWebsiteSettings(),
                    getPageContent('home')
                ]);
                if (settingsResponse.success) {
                    setSettings(settingsResponse.data);
                }
                if (contentResponse.success) {
                    // Ensure content is an object (not array)
                    const contentData = Array.isArray(contentResponse.data) 
                        ? contentResponse.data.reduce((acc, item) => {
                            acc[item.section_key] = item.content;
                            return acc;
                        }, {})
                        : contentResponse.data;
                    console.log('Home page content loaded:', contentData);
                    setContent(contentData);
                } else {
                    console.error('Failed to load content:', contentResponse);
                }
            } catch (error) {
                console.error('Error loading home page data:', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleSubscribe = (e) => {
        e.preventDefault();
        alert(t('home.thankYouSubscribe'));
    };

    if (loading) {
        return <div style={{ padding: '50px', textAlign: 'center' }}>Loading...</div>;
    }

    return (
        <>
            {/* Hero Section */}
            <section className="hero" style={{
                backgroundImage: settings.homepage_hero_image ? `url(${settings.homepage_hero_image})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>
                <div className="container hero-content">
                    <span className="hero-subtitle">{settings.homepage_hero_subtitle || t('home.heroSubtitle')}</span>
                    <h1 className="hero-title">{settings.homepage_hero_title || t('home.heroTitle')}</h1>
                    <p className="hero-text">{settings.homepage_hero_text || t('home.heroText')}</p>
                    <div className="hero-buttons">
                        <Link to="/services" className="btn btn-primary">{t('home.viewServices') || 'Our Services'}</Link>
                        <Link to="/contact" className="btn btn-outline">{t('home.contactUs')}</Link>
                    </div>
                </div>
            </section>

            {/* Company Overview */}
            <section className="section" style={{ backgroundColor: 'var(--secondary-color)' }}>
                <div className="container">
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '50px' }}>
                        <div style={{ flex: 1, minWidth: '300px' }}>
                            <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                                alt="Meeting" style={{ borderRadius: '10px', boxShadow: 'var(--shadow-lg)' }} />
                        </div>
                        <div style={{ flex: 1, minWidth: '300px' }}>
                            <h4 className="text-accent" style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>{t('home.whoWeAre')}</h4>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>{settings.homepage_about_title || t('home.leadingTheWay')}</h2>
                            <p style={{ marginBottom: '20px' }}>{settings.homepage_about_text || content.about_intro || t('home.companyDescription')}</p>
                            <ul style={{ marginBottom: '30px' }}>
                                <li style={{ marginBottom: '10px' }}><i className="fas fa-check-circle text-accent"></i> {t('home.fullyRegulated')}</li>
                                <li style={{ marginBottom: '10px' }}><i className="fas fa-check-circle text-accent"></i> {t('home.expertBoard')}</li>
                                <li style={{ marginBottom: '10px' }}><i className="fas fa-check-circle text-accent"></i> {t('home.transparentReturns')}</li>
                            </ul>
                            <Link to="/about" className="btn btn-secondary">{t('home.learnMore')}</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Key Value Proposition */}
            <section className="section" style={{ backgroundColor: 'var(--light-bg)' }}>
                <div className="container">
                    <div className="text-center" style={{ maxWidth: '700px', margin: '0 auto 50px' }}>
                        <h2 style={{ fontSize: '2.5rem' }}>{content.why_choose_title || t('home.whyChooseUs')}</h2>
                        <p>{content.why_choose_desc || t('home.whyChooseUsDesc')}</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
                        <div style={{ background: 'white', padding: '40px 30px', borderRadius: '10px', boxShadow: 'var(--shadow-md)', transition: 'var(--transition)' }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                            <div style={{ fontSize: '3rem', color: 'var(--accent-color)', marginBottom: '20px' }}>
                                <i className="fas fa-shield-alt"></i>
                            </div>
                            <h3>{content.feature_1_title || t('home.secureSafe')}</h3>
                            <p>{content.feature_1_text || t('home.secureSafeDesc')}</p>
                        </div>
                        <div style={{ background: 'white', padding: '40px 30px', borderRadius: '10px', boxShadow: 'var(--shadow-md)', transition: 'var(--transition)' }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                            <div style={{ fontSize: '3rem', color: 'var(--accent-color)', marginBottom: '20px' }}>
                                <i className="fas fa-chart-line"></i>
                            </div>
                            <h3>{content.feature_2_title || t('home.highReturns')}</h3>
                            <p>{content.feature_2_text || t('home.highReturnsDesc')}</p>
                        </div>
                        <div style={{ background: 'white', padding: '40px 30px', borderRadius: '10px', boxShadow: 'var(--shadow-md)', transition: 'var(--transition)' }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                            <div style={{ fontSize: '3rem', color: 'var(--accent-color)', marginBottom: '20px' }}>
                                <i className="fas fa-users"></i>
                            </div>
                            <h3>{content.feature_3_title || t('home.expertSupport')}</h3>
                            <p>{content.feature_3_text || t('home.expertSupportDesc')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Plans Preview */}
            <section className="section">
                <div className="container">
                    <div className="text-center" style={{ maxWidth: '700px', margin: '0 auto 50px' }}>
                        <h4 className="text-accent">{t('home.ourPackages')}</h4>
                        <h2 style={{ fontSize: '2.5rem' }}>{t('home.chooseInvestmentPath')}</h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                        <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '30px', textAlign: 'center', transition: 'var(--transition)' }}
                            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-color)'}
                            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}>
                            <h3 className="text-primary">{t('home.starter')}</h3>
                            <div style={{ fontSize: '2rem', color: 'var(--accent-color)', fontWeight: '700', margin: '15px 0' }}>6-8%
                                <span style={{ fontSize: '1rem', color: 'var(--text-color)', fontWeight: '400' }}> / year</span>
                            </div>
                            <p style={{ marginBottom: '20px' }}>{t('home.starterDesc')}</p>
                            <Link to="/services" className="btn btn-outline" style={{ width: '100%' }}>{t('home.viewDetails')}</Link>
                        </div>
                        <div style={{ background: 'var(--primary-color)', color: 'white', borderRadius: '10px', padding: '30px', textAlign: 'center', transform: 'scale(1.05)', boxShadow: 'var(--shadow-lg)' }}>
                            <div style={{ background: 'var(--accent-color)', display: 'inline-block', padding: '4px 12px', borderRadius: '15px', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '10px' }}>
                                {t('home.popular')}</div>
                            <h3>{t('home.growth')}</h3>
                            <div style={{ fontSize: '2rem', color: 'var(--accent-color)', fontWeight: '700', margin: '15px 0' }}>10-14%
                                <span style={{ fontSize: '1rem', color: 'white', fontWeight: '400', opacity: '0.8' }}> / year</span>
                            </div>
                            <p style={{ marginBottom: '20px', opacity: '0.9' }}>{t('home.growthDesc')}</p>
                            <Link to="/services" className="btn btn-primary" style={{ width: '100%', border: 'none' }}>{t('home.viewDetails')}</Link>
                        </div>
                        <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '30px', textAlign: 'center', transition: 'var(--transition)' }}
                            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-color)'}
                            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}>
                            <h3 className="text-primary">{t('home.wealth')}</h3>
                            <div style={{ fontSize: '2rem', color: 'var(--accent-color)', fontWeight: '700', margin: '15px 0' }}>15-20%
                                <span style={{ fontSize: '1rem', color: 'var(--text-color)', fontWeight: '400' }}> / year</span>
                            </div>
                            <p style={{ marginBottom: '20px' }}>{t('home.wealthDesc')}</p>
                            <Link to="/services" className="btn btn-outline" style={{ width: '100%' }}>{t('home.viewDetails')}</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="section" style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}>
                <div className="container text-center">
                    <h2 style={{ color: 'white', marginBottom: '50px' }}>{t('home.whatClientsSay')}</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                        <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '30px', borderRadius: '10px' }}>
                            <p style={{ fontStyle: 'italic', marginBottom: '20px' }}>"{t('home.testimonial1')}"</p>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Client"
                                    style={{ width: '50px', height: '50px', borderRadius: '50%', border: '2px solid var(--accent-color)' }} />
                                <div style={{ textAlign: 'left' }}>
                                    <h4 style={{ margin: 0, color: 'var(--accent-color)' }}>Michael Roberts</h4>
                                    <span style={{ fontSize: '0.8rem', opacity: '0.8' }}>Business Owner</span>
                                </div>
                            </div>
                        </div>
                        <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '30px', borderRadius: '10px' }}>
                            <p style={{ fontStyle: 'italic', marginBottom: '20px' }}>"{t('home.testimonial2')}"</p>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Client"
                                    style={{ width: '50px', height: '50px', borderRadius: '50%', border: '2px solid var(--accent-color)' }} />
                                <div style={{ textAlign: 'left' }}>
                                    <h4 style={{ margin: 0, color: 'var(--accent-color)' }}>Sarah Johnson</h4>
                                    <span style={{ fontSize: '0.8rem', opacity: '0.8' }}>Doctor</span>
                                </div>
                            </div>
                        </div>
                        <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '30px', borderRadius: '10px' }}>
                            <p style={{ fontStyle: 'italic', marginBottom: '20px' }}>"{t('home.testimonial3')}"</p>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                                <img src="https://randomuser.me/api/portraits/men/85.jpg" alt="Client"
                                    style={{ width: '50px', height: '50px', borderRadius: '50%', border: '2px solid var(--accent-color)' }} />
                                <div style={{ textAlign: 'left' }}>
                                    <h4 style={{ margin: 0, color: 'var(--accent-color)' }}>David Lee</h4>
                                    <span style={{ fontSize: '0.8rem', opacity: '0.8' }}>Software Engineer</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="section"
                style={{ background: 'linear-gradient(rgba(10, 37, 64, 0.9), rgba(10, 37, 64, 0.9)), url(\'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80\') center/cover fixed', color: 'white', textAlign: 'center' }}>
                <div className="container" style={{ maxWidth: '700px' }}>
                    <h2 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '20px' }}>{t('home.joinExclusive')}</h2>
                    <p style={{ marginBottom: '30px', fontSize: '1.1rem', opacity: '0.9' }}>{t('home.newsletterDesc')}</p>
                    <form onSubmit={handleSubscribe}
                        style={{ display: 'flex', gap: '10px', maxWidth: '500px', margin: '0 auto', flexWrap: 'wrap' }}>
                        <input type="email" placeholder={t('home.enterEmail')}
                            style={{ flex: 1, padding: '15px', borderRadius: '5px', border: 'none', outline: 'none', minWidth: '250px' }} />
                        <button type="submit" className="btn btn-primary" style={{ border: 'none' }}>{t('home.subscribe')}</button>
                    </form>
                </div>
            </section>
        </>
    );
};

export default Home;


