import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getPageContent } from '../services/publicApi';
import { aboutItemsAPI } from '../services/api';

const About = () => {
    const { t } = useTranslation();
    const [content, setContent] = useState({});
    const [awards, setAwards] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [timeline, setTimeline] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [contentResponse, awardsResponse, certificatesResponse, teamResponse, timelineResponse] = await Promise.all([
                    getPageContent('about'),
                    aboutItemsAPI.getAll('award'),
                    aboutItemsAPI.getAll('certificate'),
                    aboutItemsAPI.getAll('team_member'),
                    aboutItemsAPI.getAll('timeline')
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
                
                if (awardsResponse.success) setAwards(awardsResponse.data || []);
                if (certificatesResponse.success) setCertificates(certificatesResponse.data || []);
                if (teamResponse.success) setTeamMembers(teamResponse.data || []);
                if (timelineResponse.success) setTimeline(timelineResponse.data || []);
            } catch (error) {
                console.error('Error loading about page data:', error);
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
                    <h1 style={{ color: 'white', fontSize: '3rem' }}>{content.page_title || t('about.title')}</h1>
                    <p style={{ opacity: '0.8' }}>{content.page_subtitle || t('about.subtitle')}</p>
                </div>
            </section>

            {/* Company Background & Mission/Vision */}
            <section className="section">
                <div className="container">
                    <div style={{ display: 'flex', gap: '50px', flexWrap: 'wrap', marginBottom: '80px' }}>
                        <div style={{ flex: 1, minWidth: '300px' }}>
                            <h4 className="text-accent">{t('about.ourStory')}</h4>
                            <h2>{content.story_title || t('about.definingFuture')}</h2>
                            <p style={{ marginBottom: '20px' }}>{content.story_text_1 || t('about.storyText1')}</p>
                            <p>{content.story_text_2 || t('about.storyText2')}</p>
                        </div>
                        <div style={{ flex: 1, minWidth: '300px', display: 'grid', gap: '20px' }}>
                            <div style={{ background: 'var(--light-bg)', padding: '30px', borderLeft: '4px solid var(--accent-color)' }}>
                                <h3><i className="fas fa-bullseye text-accent"></i> {content.mission_title || t('about.ourMission')}</h3>
                                <p>{content.mission_text || t('about.missionText')}</p>
                            </div>
                            <div style={{ background: 'var(--light-bg)', padding: '30px', borderLeft: '4px solid var(--primary-color)' }}>
                                <h3><i className="fas fa-eye text-primary"></i> {content.vision_title || t('about.ourVision')}</h3>
                                <p>{content.vision_text || t('about.visionText')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div style={{ marginBottom: '80px' }}>
                        <h3 className="text-center text-primary" style={{ marginBottom: '40px' }}>{content.journey_title || t('about.ourJourney')}</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', maxWidth: '800px', margin: '0 auto', position: 'relative', borderLeft: '2px solid var(--accent-color)', paddingLeft: '30px' }}>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: '-39px', top: 0, width: '16px', height: '16px', background: 'var(--accent-color)', borderRadius: '50%', border: '2px solid white' }}></div>
                                <h4 style={{ marginBottom: '5px' }}>{t('about.journey2010')}</h4>
                                <p style={{ fontSize: '0.95rem' }}>{t('about.journey2010Text')}</p>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: '-39px', top: 0, width: '16px', height: '16px', background: 'var(--accent-color)', borderRadius: '50%', border: '2px solid white' }}></div>
                                <h4 style={{ marginBottom: '5px' }}>{t('about.journey2015')}</h4>
                                <p style={{ fontSize: '0.95rem' }}>{t('about.journey2015Text')}</p>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: '-39px', top: 0, width: '16px', height: '16px', background: 'var(--accent-color)', borderRadius: '50%', border: '2px solid white' }}></div>
                                <h4 style={{ marginBottom: '5px' }}>{t('about.journey2020')}</h4>
                                <p style={{ fontSize: '0.95rem' }}>{t('about.journey2020Text')}</p>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: '-39px', top: 0, width: '16px', height: '16px', background: 'var(--accent-color)', borderRadius: '50%', border: '2px solid white' }}></div>
                                <h4 style={{ marginBottom: '5px' }}>{t('about.journey2024')}</h4>
                                <p style={{ fontSize: '0.95rem' }}>{t('about.journey2024Text')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Compliance */}
                    <div style={{ background: 'white', padding: '40px', borderRadius: '10px', boxShadow: 'var(--shadow-md)', marginBottom: '80px', border: '1px solid var(--border-color)' }}>
                        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                            <h3 style={{ marginBottom: '20px' }}>{t('about.legalCompliance')}</h3>
                            <p style={{ marginBottom: '30px' }}>{t('about.complianceText')}</p>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <i className="fas fa-certificate text-accent" style={{ fontSize: '2rem' }}></i>
                                    <span>{t('about.isoCertified')}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <i className="fas fa-balance-scale text-accent" style={{ fontSize: '2rem' }}></i>
                                    <span>{t('about.secRegistered')}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <i className="fas fa-lock text-accent" style={{ fontSize: '2rem' }}></i>
                                    <span>{t('about.gdprCompliant')}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Awards & Certificates Section */}
                    <section className="section" style={{ backgroundColor: 'var(--light-bg)', marginBottom: '80px' }}>
                        <div className="container">
                            <div className="text-center" style={{ marginBottom: '50px' }}>
                                <h4 className="text-accent" style={{ textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>{t('about.recognition')}</h4>
                                <h2 style={{ fontSize: '2.5rem', marginBottom: '15px' }}>{t('about.awardsCertificates')}</h2>
                                <p style={{ maxWidth: '700px', margin: '0 auto' }}>{t('about.awardsDesc')}</p>
                            </div>

                            {/* Awards Grid */}
                            {awards.length > 0 && (
                                <div style={{ marginBottom: '60px' }}>
                                    <h3 className="text-center text-primary" style={{ marginBottom: '40px', fontSize: '1.8rem' }}>
                                        <i className="fas fa-trophy text-accent" style={{ marginRight: '10px' }}></i>
                                        {t('about.industryAwards')}
                                    </h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
                                        {awards.map((award) => (
                                            <div 
                                                key={award.id}
                                                style={{ 
                                                    background: 'white', 
                                                    padding: '30px', 
                                                    borderRadius: '10px', 
                                                    boxShadow: 'var(--shadow-md)',
                                                    textAlign: 'center',
                                                    transition: 'var(--transition)',
                                                    borderTop: '4px solid var(--accent-color)'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                                                }}
                                            >
                                                <div style={{ 
                                                    width: '80px', 
                                                    height: '80px', 
                                                    margin: '0 auto 20px',
                                                    background: award.image_url 
                                                        ? `url('${award.image_url}') center/cover`
                                                        : 'linear-gradient(135deg, var(--accent-color), var(--accent-hover))',
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '2.5rem',
                                                    color: 'white',
                                                    overflow: 'hidden'
                                                }}>
                                                    {!award.image_url && (award.icon ? <i className={award.icon}></i> : <i className="fas fa-trophy"></i>)}
                                                </div>
                                                <h4 style={{ marginBottom: '10px', color: 'var(--primary-color)' }}>{award.title}</h4>
                                                {award.subtitle && <p style={{ fontSize: '0.9rem', color: 'var(--text-color)', marginBottom: '10px' }}>{award.subtitle}</p>}
                                                {award.organization && <span style={{ fontSize: '0.85rem', color: 'var(--accent-color)', fontWeight: '600' }}>{award.organization}</span>}
                                                {award.description && <p style={{ fontSize: '0.85rem', color: 'var(--text-color)', marginTop: '10px' }}>{award.description}</p>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Certificates Grid */}
                            <div>
                                <h3 className="text-center text-primary" style={{ marginBottom: '40px', fontSize: '1.8rem' }}>
                                    <i className="fas fa-certificate text-accent" style={{ marginRight: '10px' }}></i>
                                    {t('about.professionalCertifications')}
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '25px' }}>
                                    <div style={{ 
                                        background: 'white', 
                                        padding: '25px', 
                                        borderRadius: '10px', 
                                        boxShadow: 'var(--shadow-sm)',
                                        border: '1px solid var(--border-color)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '20px',
                                        transition: 'var(--transition)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--accent-color)';
                                        e.currentTarget.style.transform = 'translateX(5px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--border-color)';
                                        e.currentTarget.style.transform = 'translateX(0)';
                                    }}>
                                        <div style={{ 
                                            width: '60px', 
                                            height: '60px', 
                                            background: 'var(--light-bg)',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.8rem',
                                            color: 'var(--accent-color)',
                                            flexShrink: 0
                                        }}>
                                            <i className="fas fa-shield-alt"></i>
                                        </div>
                                        <div>
                                            <h5 style={{ marginBottom: '5px', color: 'var(--primary-color)' }}>ISO 27001</h5>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-color)', margin: 0 }}>Information Security Management</p>
                                        </div>
                                    </div>

                                    <div style={{ 
                                        background: 'white', 
                                        padding: '25px', 
                                        borderRadius: '10px', 
                                        boxShadow: 'var(--shadow-sm)',
                                        border: '1px solid var(--border-color)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '20px',
                                        transition: 'var(--transition)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--accent-color)';
                                        e.currentTarget.style.transform = 'translateX(5px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--border-color)';
                                        e.currentTarget.style.transform = 'translateX(0)';
                                    }}>
                                        <div style={{ 
                                            width: '60px', 
                                            height: '60px', 
                                            background: 'var(--light-bg)',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.8rem',
                                            color: 'var(--accent-color)',
                                            flexShrink: 0
                                        }}>
                                            <i className="fas fa-balance-scale"></i>
                                        </div>
                                        <div>
                                            <h5 style={{ marginBottom: '5px', color: 'var(--primary-color)' }}>SEC Registered</h5>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-color)', margin: 0 }}>Securities & Exchange Commission</p>
                                        </div>
                                    </div>

                                    <div style={{ 
                                        background: 'white', 
                                        padding: '25px', 
                                        borderRadius: '10px', 
                                        boxShadow: 'var(--shadow-sm)',
                                        border: '1px solid var(--border-color)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '20px',
                                        transition: 'var(--transition)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--accent-color)';
                                        e.currentTarget.style.transform = 'translateX(5px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--border-color)';
                                        e.currentTarget.style.transform = 'translateX(0)';
                                    }}>
                                        <div style={{ 
                                            width: '60px', 
                                            height: '60px', 
                                            background: 'var(--light-bg)',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.8rem',
                                            color: 'var(--accent-color)',
                                            flexShrink: 0
                                        }}>
                                            <i className="fas fa-lock"></i>
                                        </div>
                                        <div>
                                            <h5 style={{ marginBottom: '5px', color: 'var(--primary-color)' }}>GDPR Compliant</h5>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-color)', margin: 0 }}>Data Protection Regulation</p>
                                        </div>
                                    </div>

                                    <div style={{ 
                                        background: 'white', 
                                        padding: '25px', 
                                        borderRadius: '10px', 
                                        boxShadow: 'var(--shadow-sm)',
                                        border: '1px solid var(--border-color)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '20px',
                                        transition: 'var(--transition)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--accent-color)';
                                        e.currentTarget.style.transform = 'translateX(5px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--border-color)';
                                        e.currentTarget.style.transform = 'translateX(0)';
                                    }}>
                                        <div style={{ 
                                            width: '60px', 
                                            height: '60px', 
                                            background: 'var(--light-bg)',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.8rem',
                                            color: 'var(--accent-color)',
                                            flexShrink: 0
                                        }}>
                                            <i className="fas fa-check-circle"></i>
                                        </div>
                                        <div>
                                            <h5 style={{ marginBottom: '5px', color: 'var(--primary-color)' }}>FINRA Member</h5>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-color)', margin: 0 }}>Financial Industry Regulatory Authority</p>
                                        </div>
                                    </div>

                                    <div style={{ 
                                        background: 'white', 
                                        padding: '25px', 
                                        borderRadius: '10px', 
                                        boxShadow: 'var(--shadow-sm)',
                                        border: '1px solid var(--border-color)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '20px',
                                        transition: 'var(--transition)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--accent-color)';
                                        e.currentTarget.style.transform = 'translateX(5px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--border-color)';
                                        e.currentTarget.style.transform = 'translateX(0)';
                                    }}>
                                        <div style={{ 
                                            width: '60px', 
                                            height: '60px', 
                                            background: 'var(--light-bg)',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.8rem',
                                            color: 'var(--accent-color)',
                                            flexShrink: 0
                                        }}>
                                            <i className="fas fa-globe"></i>
                                        </div>
                                        <div>
                                            <h5 style={{ marginBottom: '5px', color: 'var(--primary-color)' }}>SIPC Protected</h5>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-color)', margin: 0 }}>Securities Investor Protection</p>
                                        </div>
                                    </div>

                                    <div style={{ 
                                        background: 'white', 
                                        padding: '25px', 
                                        borderRadius: '10px', 
                                        boxShadow: 'var(--shadow-sm)',
                                        border: '1px solid var(--border-color)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '20px',
                                        transition: 'var(--transition)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--accent-color)';
                                        e.currentTarget.style.transform = 'translateX(5px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--border-color)';
                                        e.currentTarget.style.transform = 'translateX(0)';
                                    }}>
                                        <div style={{ 
                                            width: '60px', 
                                            height: '60px', 
                                            background: 'var(--light-bg)',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.8rem',
                                            color: 'var(--accent-color)',
                                            flexShrink: 0
                                        }}>
                                            <i className="fas fa-file-contract"></i>
                                        </div>
                                        <div>
                                            <h5 style={{ marginBottom: '5px', color: 'var(--primary-color)' }}>CFA Institute</h5>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-color)', margin: 0 }}>Chartered Financial Analyst</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Company Documents Section */}
                    <section className="section" style={{ marginBottom: '80px' }}>
                        <div className="container">
                            <div className="text-center" style={{ marginBottom: '50px' }}>
                                <h4 className="text-accent" style={{ textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>{t('about.documents')}</h4>
                                <h2 style={{ fontSize: '2.5rem', marginBottom: '15px' }}>{t('about.companyDocuments')}</h2>
                                <p style={{ maxWidth: '700px', margin: '0 auto' }}>{t('about.documentsDesc')}</p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
                                {/* Registration Documents */}
                                <div style={{ 
                                    background: 'white', 
                                    padding: '30px', 
                                    borderRadius: '10px', 
                                    boxShadow: 'var(--shadow-md)',
                                    border: '1px solid var(--border-color)',
                                    transition: 'var(--transition)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                                    e.currentTarget.style.borderColor = 'var(--accent-color)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                                    e.currentTarget.style.borderColor = 'var(--border-color)';
                                }}>
                                    <div style={{ 
                                        width: '70px', 
                                        height: '70px', 
                                        background: 'linear-gradient(135deg, var(--accent-color), var(--accent-hover))',
                                        borderRadius: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '2rem',
                                        color: 'white',
                                        marginBottom: '20px'
                                    }}>
                                        <i className="fas fa-file-alt"></i>
                                    </div>
                                    <h4 style={{ marginBottom: '10px', color: 'var(--primary-color)' }}>{t('about.companyRegistration')}</h4>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-color)', marginBottom: '20px' }}>{t('about.registrationDesc')}</p>
                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                        <button className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '8px 20px' }}
                                            onClick={() => alert('Download: Company Registration Certificate.pdf')}>
                                            <i className="fas fa-download" style={{ marginRight: '5px' }}></i> {t('about.download')}
                                        </button>
                                        <button className="btn btn-secondary" style={{ fontSize: '0.85rem', padding: '8px 20px' }}
                                            onClick={() => alert('View: Company Registration Certificate.pdf')}>
                                            <i className="fas fa-eye" style={{ marginRight: '5px' }}></i> {t('about.view')}
                                        </button>
                                    </div>
                                </div>

                                {/* License Documents */}
                                <div style={{ 
                                    background: 'white', 
                                    padding: '30px', 
                                    borderRadius: '10px', 
                                    boxShadow: 'var(--shadow-md)',
                                    border: '1px solid var(--border-color)',
                                    transition: 'var(--transition)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                                    e.currentTarget.style.borderColor = 'var(--accent-color)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                                    e.currentTarget.style.borderColor = 'var(--border-color)';
                                }}>
                                    <div style={{ 
                                        width: '70px', 
                                        height: '70px', 
                                        background: 'linear-gradient(135deg, var(--accent-color), var(--accent-hover))',
                                        borderRadius: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '2rem',
                                        color: 'white',
                                        marginBottom: '20px'
                                    }}>
                                        <i className="fas fa-id-card"></i>
                                    </div>
                                    <h4 style={{ marginBottom: '10px', color: 'var(--primary-color)' }}>{t('about.businessLicense')}</h4>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-color)', marginBottom: '20px' }}>{t('about.licenseDesc')}</p>
                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                        <button className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '8px 20px' }}
                                            onClick={() => alert('Download: Business License.pdf')}>
                                            <i className="fas fa-download" style={{ marginRight: '5px' }}></i> {t('about.download')}
                                        </button>
                                        <button className="btn btn-secondary" style={{ fontSize: '0.85rem', padding: '8px 20px' }}
                                            onClick={() => alert('View: Business License.pdf')}>
                                            <i className="fas fa-eye" style={{ marginRight: '5px' }}></i> {t('about.view')}
                                        </button>
                                    </div>
                                </div>

                                {/* Annual Reports */}
                                <div style={{ 
                                    background: 'white', 
                                    padding: '30px', 
                                    borderRadius: '10px', 
                                    boxShadow: 'var(--shadow-md)',
                                    border: '1px solid var(--border-color)',
                                    transition: 'var(--transition)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                                    e.currentTarget.style.borderColor = 'var(--accent-color)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                                    e.currentTarget.style.borderColor = 'var(--border-color)';
                                }}>
                                    <div style={{ 
                                        width: '70px', 
                                        height: '70px', 
                                        background: 'linear-gradient(135deg, var(--accent-color), var(--accent-hover))',
                                        borderRadius: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '2rem',
                                        color: 'white',
                                        marginBottom: '20px'
                                    }}>
                                        <i className="fas fa-chart-bar"></i>
                                    </div>
                                    <h4 style={{ marginBottom: '10px', color: 'var(--primary-color)' }}>{t('about.annualReports')}</h4>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-color)', marginBottom: '20px' }}>{t('about.annualReportsDesc')}</p>
                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                        <button className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '8px 20px' }}
                                            onClick={() => alert('Download: Annual Report 2024.pdf')}>
                                            <i className="fas fa-download" style={{ marginRight: '5px' }}></i> {t('about.download')}
                                        </button>
                                        <button className="btn btn-secondary" style={{ fontSize: '0.85rem', padding: '8px 20px' }}
                                            onClick={() => alert('View: Annual Report 2024.pdf')}>
                                            <i className="fas fa-eye" style={{ marginRight: '5px' }}></i> {t('about.view')}
                                        </button>
                                    </div>
                                </div>

                                {/* Terms of Service */}
                                <div style={{ 
                                    background: 'white', 
                                    padding: '30px', 
                                    borderRadius: '10px', 
                                    boxShadow: 'var(--shadow-md)',
                                    border: '1px solid var(--border-color)',
                                    transition: 'var(--transition)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                                    e.currentTarget.style.borderColor = 'var(--accent-color)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                                    e.currentTarget.style.borderColor = 'var(--border-color)';
                                }}>
                                    <div style={{ 
                                        width: '70px', 
                                        height: '70px', 
                                        background: 'linear-gradient(135deg, var(--accent-color), var(--accent-hover))',
                                        borderRadius: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '2rem',
                                        color: 'white',
                                        marginBottom: '20px'
                                    }}>
                                        <i className="fas fa-file-contract"></i>
                                    </div>
                                    <h4 style={{ marginBottom: '10px', color: 'var(--primary-color)' }}>{t('about.termsOfService')}</h4>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-color)', marginBottom: '20px' }}>{t('about.termsDesc')}</p>
                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                        <button className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '8px 20px' }}
                                            onClick={() => alert('Download: Terms of Service.pdf')}>
                                            <i className="fas fa-download" style={{ marginRight: '5px' }}></i> {t('about.download')}
                                        </button>
                                        <button className="btn btn-secondary" style={{ fontSize: '0.85rem', padding: '8px 20px' }}
                                            onClick={() => alert('View: Terms of Service.pdf')}>
                                            <i className="fas fa-eye" style={{ marginRight: '5px' }}></i> {t('about.view')}
                                        </button>
                                    </div>
                                </div>

                                {/* Privacy Policy */}
                                <div style={{ 
                                    background: 'white', 
                                    padding: '30px', 
                                    borderRadius: '10px', 
                                    boxShadow: 'var(--shadow-md)',
                                    border: '1px solid var(--border-color)',
                                    transition: 'var(--transition)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                                    e.currentTarget.style.borderColor = 'var(--accent-color)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                                    e.currentTarget.style.borderColor = 'var(--border-color)';
                                }}>
                                    <div style={{ 
                                        width: '70px', 
                                        height: '70px', 
                                        background: 'linear-gradient(135deg, var(--accent-color), var(--accent-hover))',
                                        borderRadius: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '2rem',
                                        color: 'white',
                                        marginBottom: '20px'
                                    }}>
                                        <i className="fas fa-shield-alt"></i>
                                    </div>
                                    <h4 style={{ marginBottom: '10px', color: 'var(--primary-color)' }}>{t('about.privacyPolicy')}</h4>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-color)', marginBottom: '20px' }}>{t('about.privacyDesc')}</p>
                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                        <button className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '8px 20px' }}
                                            onClick={() => alert('Download: Privacy Policy.pdf')}>
                                            <i className="fas fa-download" style={{ marginRight: '5px' }}></i> {t('about.download')}
                                        </button>
                                        <button className="btn btn-secondary" style={{ fontSize: '0.85rem', padding: '8px 20px' }}
                                            onClick={() => alert('View: Privacy Policy.pdf')}>
                                            <i className="fas fa-eye" style={{ marginRight: '5px' }}></i> {t('about.view')}
                                        </button>
                                    </div>
                                </div>

                                {/* Audit Reports */}
                                <div style={{ 
                                    background: 'white', 
                                    padding: '30px', 
                                    borderRadius: '10px', 
                                    boxShadow: 'var(--shadow-md)',
                                    border: '1px solid var(--border-color)',
                                    transition: 'var(--transition)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                                    e.currentTarget.style.borderColor = 'var(--accent-color)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                                    e.currentTarget.style.borderColor = 'var(--border-color)';
                                }}>
                                    <div style={{ 
                                        width: '70px', 
                                        height: '70px', 
                                        background: 'linear-gradient(135deg, var(--accent-color), var(--accent-hover))',
                                        borderRadius: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '2rem',
                                        color: 'white',
                                        marginBottom: '20px'
                                    }}>
                                        <i className="fas fa-clipboard-check"></i>
                                    </div>
                                    <h4 style={{ marginBottom: '10px', color: 'var(--primary-color)' }}>{t('about.auditReports')}</h4>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-color)', marginBottom: '20px' }}>{t('about.auditDesc')}</p>
                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                        <button className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '8px 20px' }}
                                            onClick={() => alert('Download: Audit Report 2024.pdf')}>
                                            <i className="fas fa-download" style={{ marginRight: '5px' }}></i> {t('about.download')}
                                        </button>
                                        <button className="btn btn-secondary" style={{ fontSize: '0.85rem', padding: '8px 20px' }}
                                            onClick={() => alert('View: Audit Report 2024.pdf')}>
                                            <i className="fas fa-eye" style={{ marginRight: '5px' }}></i> {t('about.view')}
                                        </button>
                                    </div>
                                </div>

                                {/* Insurance Documents */}
                                <div style={{ 
                                    background: 'white', 
                                    padding: '30px', 
                                    borderRadius: '10px', 
                                    boxShadow: 'var(--shadow-md)',
                                    border: '1px solid var(--border-color)',
                                    transition: 'var(--transition)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                                    e.currentTarget.style.borderColor = 'var(--accent-color)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                                    e.currentTarget.style.borderColor = 'var(--border-color)';
                                }}>
                                    <div style={{ 
                                        width: '70px', 
                                        height: '70px', 
                                        background: 'linear-gradient(135deg, var(--accent-color), var(--accent-hover))',
                                        borderRadius: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '2rem',
                                        color: 'white',
                                        marginBottom: '20px'
                                    }}>
                                        <i className="fas fa-umbrella"></i>
                                    </div>
                                    <h4 style={{ marginBottom: '10px', color: 'var(--primary-color)' }}>{t('about.insuranceCoverage')}</h4>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-color)', marginBottom: '20px' }}>{t('about.insuranceDesc')}</p>
                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                        <button className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '8px 20px' }}
                                            onClick={() => alert('Download: Insurance Coverage.pdf')}>
                                            <i className="fas fa-download" style={{ marginRight: '5px' }}></i> {t('about.download')}
                                        </button>
                                        <button className="btn btn-secondary" style={{ fontSize: '0.85rem', padding: '8px 20px' }}
                                            onClick={() => alert('View: Insurance Coverage.pdf')}>
                                            <i className="fas fa-eye" style={{ marginRight: '5px' }}></i> {t('about.view')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Team */}
                    {teamMembers.length > 0 && (
                        <div className="text-center">
                            <h4 className="text-accent">{t('about.leadership')}</h4>
                            <h2>{t('about.meetBoard')}</h2>
                            <p style={{ marginBottom: '50px' }}>{t('about.boardDesc')}</p>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
                                {teamMembers.map((member) => (
                                    <div key={member.id} style={{ background: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                                        {member.image_url ? (
                                            <img 
                                                src={member.image_url}
                                                alt={member.title} 
                                                style={{ width: '100%', height: '300px', objectFit: 'cover' }} 
                                            />
                                        ) : (
                                            <div style={{ 
                                                width: '100%', 
                                                height: '300px', 
                                                background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '4rem',
                                                color: 'white'
                                            }}>
                                                {member.icon ? <i className={member.icon}></i> : <i className="fas fa-user"></i>}
                                            </div>
                                        )}
                                        <div style={{ padding: '20px' }}>
                                            <h3>{member.title}</h3>
                                            {member.position && (
                                                <p className="text-accent" style={{ fontWeight: '600' }}>{member.position}</p>
                                            )}
                                            {member.subtitle && (
                                                <p style={{ fontSize: '0.9rem', color: 'var(--text-color)', marginTop: '5px' }}>{member.subtitle}</p>
                                            )}
                                            {member.description && (
                                                <p style={{ fontSize: '0.85rem', color: 'var(--text-color)', marginTop: '10px' }}>{member.description}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default About;


