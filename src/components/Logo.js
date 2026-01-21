import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWebsiteSettings } from '../services/publicApi';

const Logo = ({ className = '', showText = true, linkTo = '/', forceShowText = false }) => {
    const [companyName, setCompanyName] = useState('MRB International');
    const [logoUrl, setLogoUrl] = useState(null);
    const [imageError, setImageError] = useState(false);
    
    // Convert relative URLs to absolute URLs
    const normalizeLogoUrl = (url) => {
        if (!url || url.trim() === '') return null;
        
        const trimmedUrl = url.trim();
        
        // If it's already an absolute URL (starts with http:// or https://), return as is
        if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
            console.log('Logo: URL is already absolute:', trimmedUrl);
            return trimmedUrl;
        }
        
        // Get base URL from environment
        let baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
        
        // Remove /api if present, we just need the base
        const cleanBase = baseUrl.replace(/\/api\/?$/, '');
        
        // If it's a relative URL starting with /backend/uploads/, convert to absolute
        if (trimmedUrl.startsWith('/backend/uploads/')) {
            const fullUrl = cleanBase + trimmedUrl;
            console.log('Logo: Converted /backend/uploads/ URL:', { original: trimmedUrl, full: fullUrl });
            return fullUrl;
        }
        
        // If it starts with /uploads/, add /backend prefix
        if (trimmedUrl.startsWith('/uploads/')) {
            const fullUrl = cleanBase + '/backend' + trimmedUrl;
            console.log('Logo: Converted /uploads/ URL:', { original: trimmedUrl, full: fullUrl });
            return fullUrl;
        }
        
        // If it starts with /, assume it's relative to the backend
        if (trimmedUrl.startsWith('/')) {
            const fullUrl = cleanBase + trimmedUrl;
            console.log('Logo: Converted root-relative URL:', { original: trimmedUrl, full: fullUrl });
            return fullUrl;
        }
        
        // If it doesn't start with /, it might be a relative path - try adding /backend/uploads/
        const fullUrl = cleanBase + '/backend/uploads/' + trimmedUrl;
        console.log('Logo: Treated as relative path:', { original: trimmedUrl, full: fullUrl });
        return fullUrl;
    };
    
    useEffect(() => {
        const loadSettings = async () => {
            try {
                // Add cache busting to ensure fresh data
                const timestamp = new Date().getTime();
                const response = await getWebsiteSettings();
                console.log('Logo: Fetched settings response:', response);
                
                if (response.success && response.data) {
                    if (response.data.company_name) {
                        setCompanyName(response.data.company_name);
                    }
                    
                    // Always update logo URL, even if empty (to clear old logo)
                    const logoValue = response.data.company_logo || null;
                    
                    if (logoValue) {
                        const normalizedUrl = normalizeLogoUrl(logoValue);
                        console.log('Logo: Normalized URL:', {
                            original: logoValue,
                            normalized: normalizedUrl
                        });
                        
                        // Add cache busting to image URL
                        const urlWithCache = normalizedUrl.includes('?') 
                            ? normalizedUrl + '&_t=' + timestamp 
                            : normalizedUrl + '?_t=' + timestamp;
                        
                        setLogoUrl(urlWithCache);
                        setImageError(false); // Reset error state when new URL is set
                        console.log('Logo: Final URL set:', urlWithCache);
                    } else {
                        console.log('Logo: No logo URL in settings, clearing logo');
                        setLogoUrl(null);
                        setImageError(false);
                    }
                } else {
                    console.warn('Logo: Settings response was not successful:', response);
                }
            } catch (error) {
                console.error('Error loading logo settings:', error);
                setImageError(true);
            }
        };
        
        // Load immediately
        loadSettings();
        
        // Refresh settings every 5 seconds to catch updates faster
        const interval = setInterval(loadSettings, 5000);
        return () => clearInterval(interval);
    }, []);
    
    const handleImageError = (e) => {
        console.error('❌ Logo image failed to load!');
        console.error('Failed URL:', logoUrl);
        console.error('Image error details:', {
            url: e.target.src,
            naturalWidth: e.target.naturalWidth,
            naturalHeight: e.target.naturalHeight,
            complete: e.target.complete,
            error: e.target.error
        });
        
        // Try to fetch the URL directly to see what's wrong
        if (logoUrl) {
            fetch(logoUrl, { method: 'HEAD' })
                .then(response => {
                    console.error('Logo URL fetch result:', {
                        status: response.status,
                        statusText: response.statusText,
                        headers: Object.fromEntries(response.headers.entries())
                    });
                })
                .catch(err => {
                    console.error('Logo URL fetch error:', err);
                });
        }
        
        setImageError(true);
    };
    
    const handleImageLoad = () => {
        console.log('✅ Logo image loaded successfully:', logoUrl);
        setImageError(false);
    };
    
    // Debug: Log the logo URL when it changes
    useEffect(() => {
        if (logoUrl) {
            console.log('Logo URL set:', logoUrl);
        }
    }, [logoUrl]);
    
    // Split company name with proper spacing
    const renderCompanyName = () => {
        const parts = companyName.split(' ');
        if (parts.length >= 2) {
            const firstPart = parts[0];
            const restParts = parts.slice(1).join(' ');
            return (
                <>
                    {firstPart}
                    <span style={{ margin: '0 4px' }}> </span>
                    <span className="logo-text-accent">{restParts}</span>
                </>
            );
        }
        return companyName;
    };

    const logoContent = (
        <div className={`logo-container ${className}`} style={{ 
            display: 'flex', 
            flexDirection: 'row',
            alignItems: 'center', 
            gap: '15px',
            whiteSpace: 'nowrap'
        }}>
            {logoUrl && !imageError ? (
                <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f8f9fa',
                    border: '3px solid #e0e0e0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    flexShrink: 0
                }}>
                    <img 
                        src={logoUrl} 
                        alt={companyName} 
                        style={{ 
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block'
                        }}
                        onError={handleImageError}
                        onLoad={handleImageLoad}
                        crossOrigin="anonymous"
                        loading="eager"
                    />
                </div>
            ) : (
                <div className="logo-icon" style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    backgroundColor: '#f8f9fa',
                    border: '3px solid #e0e0e0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                }}>
                    <svg width="50" height="50" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Chart bars representing growth */}
                        <rect x="4" y="18" width="4" height="8" fill="white" opacity="0.9" rx="1"/>
                        <rect x="10" y="14" width="4" height="12" fill="white" opacity="0.9" rx="1"/>
                        <rect x="16" y="10" width="4" height="16" fill="white" opacity="0.9" rx="1"/>
                        <rect x="22" y="6" width="4" height="20" fill="white" opacity="0.9" rx="1"/>
                        {/* Upward arrow representing growth */}
                        <path d="M8 12L15 5L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    </svg>
                </div>
            )}
            {(showText || forceShowText) && (
                <span className="logo-text" style={{ 
                    fontSize: logoUrl && !imageError ? '1.5rem' : '1.5rem',
                    fontWeight: '700',
                    whiteSpace: 'nowrap',
                    display: 'inline-block',
                    lineHeight: '1',
                    verticalAlign: 'middle'
                }}>
                    {renderCompanyName()}
                </span>
            )}
        </div>
    );

    if (linkTo) {
        return (
            <Link to={linkTo} style={{ textDecoration: 'none', display: 'inline-block' }}>
                {logoContent}
            </Link>
        );
    }

    return logoContent;
};

export default Logo;
