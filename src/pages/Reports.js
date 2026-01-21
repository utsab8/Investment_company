import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getPageContent } from '../services/publicApi';
import { reportsAPI } from '../services/api';

const Reports = () => {
    const { t } = useTranslation();
    const [content, setContent] = useState({});
    const [reports, setReports] = useState([]);
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
                    const [contentResponse, reportsResponse] = await Promise.all([
                        getPageContent('reports'),
                        reportsAPI.getAll({ _t: timestamp })
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
                        console.log('Reports page content loaded:', contentData);
                    }
                    
                    // Handle reports
                    if (reportsResponse && reportsResponse.success) {
                        const reportsData = reportsResponse.data || [];
                        setReports(Array.isArray(reportsData) ? reportsData : []);
                        console.log('Reports loaded:', reportsData.length, 'reports');
                    } else {
                        console.warn('Failed to load reports:', reportsResponse);
                        setReports([]);
                    }
                } catch (apiError) {
                    console.error('❌ API Request Error:', apiError);
                    setError(`Failed to connect to API: ${apiError.message}`);
                    setReports([]);
                }
            } catch (err) {
                console.error('❌ Unexpected Error:', err);
                setError(err.message);
                setReports([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDownload = async (report) => {
        if (report.file_url) {
            // Increment download count
            try {
                await reportsAPI.incrementDownload(report.id);
            } catch (err) {
                console.error('Error incrementing download count:', err);
            }
            
            // Open/download the file
            window.open(report.file_url, '_blank');
        } else {
            alert(`Report PDF not available for: ${report.title}`);
        }
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return '';
        const mb = bytes / (1024 * 1024);
        return `${mb.toFixed(1)} MB`;
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
                        {content.page_title || t('reports.title')}
                    </h1>
                    <p style={{ opacity: '0.8' }}>
                        {content.page_subtitle || t('reports.subtitle')}
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

            {/* Past Performance Section (if content exists) */}
            {(content.fund_performance_title || content.outperformance_title) && (
                <section className="section">
                    <div className="container">
                        <h2 className="text-center" style={{ marginBottom: '50px' }}>
                            {content.fund_performance_title || t('reports.fundPerformance2024')}
                        </h2>

                        <div style={{ display: 'flex', gap: '50px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
                            {/* Growth Chart Representation */}
                            <div style={{ flex: 1, minWidth: '300px', background: 'white', padding: '30px', borderRadius: '10px', boxShadow: 'var(--shadow-md)' }}>
                                <h3 style={{ marginBottom: '20px' }}>
                                    {content.annual_returns_title || t('reports.annualReturnsComparison')}
                                </h3>
                                {/* Chart visualization - can be enhanced with actual chart library */}
                                <div style={{ display: 'flex', alignItems: 'flex-end', height: '200px', gap: '20px', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)' }}>
                                    <div style={{ width: '33%', background: '#ccc', height: '40%', position: 'relative' }}>
                                        <span style={{ position: 'absolute', top: '-25px', left: 0, right: 0, textAlign: 'center' }}>6%</span>
                                        <div style={{ position: 'absolute', bottom: '-30px', width: '100%', textAlign: 'center' }}>{t('reports.inflation')}</div>
                                    </div>
                                    <div style={{ width: '33%', background: 'var(--primary-light)', height: '70%', position: 'relative' }}>
                                        <span style={{ position: 'absolute', top: '-25px', left: 0, right: 0, textAlign: 'center' }}>12%</span>
                                        <div style={{ position: 'absolute', bottom: '-30px', width: '100%', textAlign: 'center' }}>{t('reports.marketAvg')}</div>
                                    </div>
                                    <div style={{ width: '33%', background: 'var(--accent-color)', height: '95%', position: 'relative' }}>
                                        <span style={{ position: 'absolute', top: '-25px', left: 0, right: 0, textAlign: 'center' }}>18%</span>
                                        <div style={{ position: 'absolute', bottom: '-30px', width: '100%', textAlign: 'center', fontWeight: 'bold' }}>{t('reports.investcorp')}</div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ flex: 1, minWidth: '300px' }}>
                                <h3 className="text-primary">
                                    {content.outperformance_title || t('reports.consistentOutperformance')}
                                </h3>
                                <p style={{ marginBottom: '20px' }}>
                                    {content.outperformance_description || t('reports.outperformanceDesc')}
                                </p>
                                <ul style={{ marginBottom: '30px' }}>
                                    <li style={{ marginBottom: '10px' }}><strong>$500M+</strong> {t('reports.assetsUnderManagement')}</li>
                                    <li style={{ marginBottom: '10px' }}><strong>12.5%</strong> {t('reports.averageAnnualReturn')}</li>
                                    <li style={{ marginBottom: '10px' }}><strong>98%</strong> {t('reports.clientRetentionRate')}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Reports Downloads Section */}
            <section className="section" style={{ backgroundColor: 'var(--light-bg)' }}>
                <div className="container">
                    <h2 className="text-center" style={{ marginBottom: '40px' }}>
                        {content.investor_resources_title || t('reports.investorResources')}
                    </h2>

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
                            <h3 style={{ color: '#856404', marginBottom: '10px' }}>Error Loading Reports</h3>
                            <p style={{ color: '#856404', fontSize: '0.95rem' }}>{error}</p>
                        </div>
                    )}

                    {!error && reports.length === 0 && (
                        <div style={{ 
                            textAlign: 'center', 
                            padding: '80px 20px',
                            background: 'white',
                            borderRadius: '10px',
                            boxShadow: 'var(--shadow-md)'
                        }}>
                            <i className="fas fa-folder-open" style={{ fontSize: '4rem', color: '#ccc', marginBottom: '20px', display: 'block' }}></i>
                            <h3 style={{ color: '#999', marginBottom: '10px' }}>No Reports Available</h3>
                            <p style={{ color: '#999' }}>Reports will be available here once they are added from the admin panel.</p>
                        </div>
                    )}

                    {!error && reports.length > 0 && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                            {reports.map((report) => (
                                <div
                                    key={report.id}
                                    onClick={() => handleDownload(report)}
                                    style={{
                                        background: 'white',
                                        padding: '20px',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '15px',
                                        boxShadow: 'var(--shadow-sm)',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        border: '1px solid #e0e0e0'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                >
                                    <i className="fas fa-file-pdf text-accent" style={{ fontSize: '2rem', flexShrink: 0 }}></i>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <h4 style={{ margin: 0, marginBottom: '5px', color: '#0a2540' }}>
                                            {report.title}
                                        </h4>
                                        {report.description && (
                                            <p style={{ margin: '5px 0', fontSize: '0.85rem', color: '#666', lineHeight: '1.4' }}>
                                                {report.description.length > 60 ? `${report.description.substring(0, 60)}...` : report.description}
                                            </p>
                                        )}
                                        <div style={{ display: 'flex', gap: '15px', marginTop: '8px', fontSize: '0.8rem', color: '#999' }}>
                                            {report.report_type && (
                                                <span style={{ background: '#e3f2fd', padding: '3px 8px', borderRadius: '4px' }}>
                                                    {report.report_type}
                                                </span>
                                            )}
                                            {report.year && <span>{report.year}</span>}
                                            {report.quarter && <span>Q{report.quarter}</span>}
                                            {report.file_size && <span>{formatFileSize(report.file_size)}</span>}
                                        </div>
                                    </div>
                                    <i className="fas fa-download" style={{ color: '#0a2540', flexShrink: 0 }}></i>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default Reports;
