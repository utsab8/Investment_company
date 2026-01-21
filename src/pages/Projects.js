import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { projectsAPI } from '../services/api';
import { getPageContent } from '../services/publicApi';

const Projects = () => {
    const { t } = useTranslation();
    const [content, setContent] = useState({});
    const [projects, setProjects] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                console.log('🔄 Fetching projects from API...');
                
                // Add cache busting to ensure fresh data
                const timestamp = new Date().getTime();
                
                try {
                    const [contentResponse, projectsResponse, statsResponse] = await Promise.all([
                        getPageContent('projects'),
                        projectsAPI.getAll({ _t: timestamp }),
                        projectsAPI.getStatistics()
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
                        console.log('Projects page content loaded:', contentData);
                    }
                    
                    console.log('📊 Projects API Response:', JSON.stringify(projectsResponse, null, 2));
                    console.log('📊 Statistics API Response:', statsResponse);
                    
                    if (projectsResponse && projectsResponse.success) {
                        // Handle both array and object responses
                        let projectsData = [];
                        if (Array.isArray(projectsResponse.data)) {
                            projectsData = projectsResponse.data;
                            console.log('✅ Received array of', projectsData.length, 'projects');
                        } else if (projectsResponse.data && typeof projectsResponse.data === 'object') {
                            // If data is an object, try to extract array
                            if (Array.isArray(projectsResponse.data.projects)) {
                                projectsData = projectsResponse.data.projects;
                                console.log('✅ Extracted projects array:', projectsData.length, 'projects');
                            } else if (Array.isArray(projectsResponse.data.data)) {
                                projectsData = projectsResponse.data.data;
                                console.log('✅ Extracted data array:', projectsData.length, 'projects');
                            } else {
                                // Single project object
                                projectsData = [projectsResponse.data];
                                console.log('✅ Single project object converted to array');
                            }
                        } else {
                            console.warn('⚠️ Unexpected data format:', typeof projectsResponse.data);
                        }
                        
                        setProjects(projectsData);
                        console.log('✅ Projects loaded:', projectsData.length, 'projects');
                        if (projectsData.length > 0) {
                            console.log('📋 First project:', projectsData[0]);
                            console.log('📋 All project IDs:', projectsData.map(p => p.id));
                        } else {
                            console.warn('⚠️ No projects found. Make sure:');
                            console.warn('   1. Projects are marked as "Active" in admin panel');
                            console.warn('   2. Backend server is running on port 8000');
                            console.warn('   3. Check browser console for API errors');
                        }
                    } else {
                        console.error('❌ Projects API returned unsuccessful response:', projectsResponse);
                        setProjects([]);
                        setError(projectsResponse?.message || 'Failed to load projects');
                    }
                    
                    if (statsResponse && statsResponse.success && statsResponse.data) {
                        setStatistics(statsResponse.data);
                    }
                } catch (apiError) {
                    console.error('❌ API Request Error:', apiError);
                    console.error('   Error details:', {
                        message: apiError.message,
                        stack: apiError.stack
                    });
                    setError(`Failed to connect to API: ${apiError.message}`);
                    setProjects([]);
                }
            } catch (err) {
                console.error('❌ Unexpected Error:', err);
                setError(err.message);
                setProjects([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleViewPDF = (project) => {
        if (project.pdf_url && project.pdf_url !== '#') {
            window.open(project.pdf_url, '_blank');
        } else {
            alert(`Opening PDF for: ${project.title}\n\nPDF not available yet.`);
        }
    };

    const handleDownloadPDF = (project) => {
        if (project.pdf_url && project.pdf_url !== '#') {
            const link = document.createElement('a');
            link.href = project.pdf_url;
            link.download = `${project.title.replace(/\s+/g, '_')}.pdf`;
            link.click();
        } else {
            alert(`Downloading PDF for: ${project.title}\n\nPDF not available yet.`);
        }
    };

    if (loading) {
        return (
            <section className="section text-center" style={{ padding: '100px 0' }}>
                <div className="container">
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
                    <h1 style={{ color: 'white', fontSize: '3rem' }}>{content.page_title || t('projects.title')}</h1>
                    <p style={{ opacity: '0.8' }}>{content.page_subtitle || t('projects.subtitle')}</p>
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

            {/* Projects Section */}
            <section className="section" style={{ backgroundColor: 'var(--light-bg)' }}>
                <div className="container">
                    <div className="text-center" style={{ marginBottom: '50px' }}>
                        <h4 className="text-accent" style={{ textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
                            {content.portfolio_label || t('projects.portfolio')}
                        </h4>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '15px' }}>
                            {content.success_stories_title || t('projects.successStories')}
                        </h2>
                        <p style={{ maxWidth: '700px', margin: '0 auto' }}>
                            {content.projects_description || t('projects.projectsDesc')}
                        </p>
                    </div>

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
                            <h3 style={{ color: '#856404', marginBottom: '10px' }}>Error Loading Projects</h3>
                            <p style={{ color: '#856404', fontSize: '0.95rem', marginBottom: '15px' }}>
                                {error}
                            </p>
                            <div style={{ background: '#fff', padding: '15px', borderRadius: '5px', marginTop: '15px', textAlign: 'left', maxWidth: '600px', margin: '15px auto 0' }}>
                                <strong style={{ display: 'block', marginBottom: '10px', color: '#856404' }}>Troubleshooting Steps:</strong>
                                <ol style={{ margin: 0, paddingLeft: '20px', color: '#856404', fontSize: '0.9rem' }}>
                                    <li>Make sure the backend server is running on port 8000</li>
                                    <li>Check browser console (F12) for detailed error messages</li>
                                    <li>Verify projects are marked as "Active" in admin panel</li>
                                    <li>Try refreshing the page (F5)</li>
                                </ol>
                            </div>
                        </div>
                    )}

                    {!error && projects.length === 0 && (
                        <div style={{ 
                            textAlign: 'center', 
                            padding: '80px 20px',
                            background: 'white',
                            borderRadius: '10px',
                            boxShadow: 'var(--shadow-md)'
                        }}>
                            <i className="fas fa-folder-open" style={{ fontSize: '4rem', color: '#ccc', marginBottom: '20px', display: 'block' }}></i>
                            <h3 style={{ color: '#999', marginBottom: '10px' }}>No Projects Available</h3>
                            <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '15px' }}>
                                Projects added from the admin panel will appear here.
                            </p>
                            <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '5px', marginTop: '15px', textAlign: 'left', maxWidth: '600px', margin: '15px auto 0' }}>
                                <strong style={{ display: 'block', marginBottom: '10px', color: '#666' }}>To show projects on the website:</strong>
                                <ol style={{ margin: 0, paddingLeft: '20px', color: '#666', fontSize: '0.9rem' }}>
                                    <li>Go to Admin Panel → Projects Manager</li>
                                    <li>Make sure the <strong>"Active"</strong> checkbox is checked for each project</li>
                                    <li>Click "Save Project" or "Update Project"</li>
                                    <li>Refresh this page (F5) to see the changes</li>
                                </ol>
                            </div>
                            <p style={{ color: '#999', fontSize: '0.85rem', marginTop: '20px' }}>
                                <i className="fas fa-info-circle" style={{ marginRight: '5px' }}></i>
                                Check browser console (F12) for debugging information
                            </p>
                        </div>
                    )}

                    {!error && projects.length > 0 && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
                            {projects.map((project) => (
                            <div
                                key={project.id}
                                style={{
                                    background: 'white',
                                    borderRadius: '10px',
                                    overflow: 'hidden',
                                    boxShadow: 'var(--shadow-md)',
                                    transition: 'var(--transition)',
                                    border: '1px solid var(--border-color)'
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
                                {/* Project Image */}
                                <div style={{
                                    width: '100%',
                                    height: '250px',
                                    backgroundImage: `url(${project.image_url || project.image || 'https://via.placeholder.com/800x400'})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    position: 'relative'
                                }}>
                                    <div style={{
                                        position: 'absolute',
                                        top: '15px',
                                        right: '15px',
                                        background: 'var(--accent-color)',
                                        color: 'white',
                                        padding: '5px 15px',
                                        borderRadius: '20px',
                                        fontSize: '0.85rem',
                                        fontWeight: '600'
                                    }}>
                                        {project.year}
                                    </div>
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '15px',
                                        left: '15px',
                                        background: 'rgba(10, 37, 64, 0.9)',
                                        color: 'white',
                                        padding: '8px 15px',
                                        borderRadius: '5px',
                                        fontSize: '0.9rem',
                                        fontWeight: '600'
                                    }}>
                                        {project.category}
                                    </div>
                                </div>

                                {/* Project Content */}
                                <div style={{ padding: '30px' }}>
                                    <h3 style={{ 
                                        marginBottom: '10px', 
                                        color: 'var(--primary-color)',
                                        fontSize: '1.4rem'
                                    }}>
                                        {project.title}
                                    </h3>
                                    <p style={{ 
                                        fontSize: '0.9rem', 
                                        color: 'var(--accent-color)', 
                                        marginBottom: '15px',
                                        fontWeight: '600'
                                    }}>
                                        <i className="fas fa-building" style={{ marginRight: '8px' }}></i>
                                        {project.client}
                                    </p>
                                    <p style={{ 
                                        fontSize: '0.95rem', 
                                        color: 'var(--text-color)', 
                                        marginBottom: '25px',
                                        lineHeight: '1.6'
                                    }}>
                                        {project.description}
                                    </p>

                                    {/* PDF Action Buttons */}
                                    <div style={{ 
                                        display: 'flex', 
                                        gap: '10px',
                                        flexWrap: 'wrap'
                                    }}>
                                        <button
                                            className="btn btn-primary"
                                            style={{ 
                                                fontSize: '0.85rem', 
                                                padding: '10px 20px',
                                                flex: '1',
                                                minWidth: '140px'
                                            }}
                                            onClick={() => handleViewPDF(project)}
                                        >
                                            <i className="fas fa-file-pdf" style={{ marginRight: '8px' }}></i>
                                            {t('projects.viewPDF')}
                                        </button>
                                        <button
                                            className="btn btn-outline"
                                            style={{ 
                                                fontSize: '0.85rem', 
                                                padding: '10px 20px',
                                                flex: '1',
                                                minWidth: '140px'
                                            }}
                                            onClick={() => handleDownloadPDF(project)}
                                        >
                                            <i className="fas fa-download" style={{ marginRight: '8px' }}></i>
                                            {t('about.download')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        </div>
                    )}
                    )}

                    {/* Statistics Section */}
                    {statistics && (
                        <div style={{ 
                            marginTop: '80px', 
                            background: 'white', 
                            padding: '50px 30px', 
                            borderRadius: '10px', 
                            boxShadow: 'var(--shadow-md)',
                            border: '1px solid var(--border-color)'
                        }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', textAlign: 'center' }}>
                                <div>
                                    <div style={{ fontSize: '3rem', color: 'var(--accent-color)', fontWeight: '800', marginBottom: '10px' }}>
                                        {statistics.total_projects || projects.length}+
                                    </div>
                                    <h4 style={{ color: 'var(--primary-color)', marginBottom: '5px' }}>{t('projects.projectsCompleted')}</h4>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-color)' }}>{t('projects.successfullyDelivered')}</p>
                                </div>
                                <div>
                                    <div style={{ fontSize: '3rem', color: 'var(--accent-color)', fontWeight: '800', marginBottom: '10px' }}>
                                        ${statistics.total_assets ? (statistics.total_assets / 1000000).toFixed(0) + 'M' : '615M'}
                                    </div>
                                    <h4 style={{ color: 'var(--primary-color)', marginBottom: '5px' }}>{t('projects.totalAssetsManaged')}</h4>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-color)' }}>{t('projects.acrossAllProjects')}</p>
                                </div>
                                <div>
                                    <div style={{ fontSize: '3rem', color: 'var(--accent-color)', fontWeight: '800', marginBottom: '10px' }}>
                                        {statistics.average_roi ? Number(statistics.average_roi).toFixed(0) + '%' : '28%'}
                                    </div>
                                    <h4 style={{ color: 'var(--primary-color)', marginBottom: '5px' }}>{t('projects.averageROI')}</h4>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-color)' }}>{t('projects.annualReturns')}</p>
                                </div>
                                <div>
                                    <div style={{ fontSize: '3rem', color: 'var(--accent-color)', fontWeight: '800', marginBottom: '10px' }}>
                                        100%
                                    </div>
                                    <h4 style={{ color: 'var(--primary-color)', marginBottom: '5px' }}>{t('projects.clientSatisfaction')}</h4>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-color)' }}>{t('projects.happyClients')}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default Projects;

