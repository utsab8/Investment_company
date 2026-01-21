/**
 * Public API Service
 * Fetches public website settings and content for frontend
 */

// CRITICAL: Force use of PHP built-in server (port 8000) not Apache
const getPublicApiBaseUrl = () => {
    let baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
    
    // CRITICAL: Force use of port 8000 if using localhost without port
    if (baseUrl.includes('localhost') && !baseUrl.includes(':8000') && !baseUrl.includes(':3000')) {
        console.warn('⚠️ WARNING: Backend URL does not specify port 8000. Using default PHP server.');
        baseUrl = 'http://localhost:8000/api';
    }
    
    // Remove trailing slash if present
    baseUrl = baseUrl.replace(/\/$/, '');
    
    // Ensure it ends with /api
    if (!baseUrl.endsWith('/api')) {
        if (baseUrl.endsWith('/api/')) {
            baseUrl = baseUrl.slice(0, -1);
        } else {
            baseUrl = baseUrl + '/api';
        }
    }
    
    return baseUrl;
};

const API_BASE_URL = getPublicApiBaseUrl();

// Log for debugging
console.log('🔧 Public API Base URL:', API_BASE_URL);
console.log('🔧 REACT_APP_API_URL from .env:', process.env.REACT_APP_API_URL || 'NOT SET - using default');

// Warn if using wrong URL
if (API_BASE_URL.includes('investment-Company') || API_BASE_URL.includes('localhost/backend')) {
    console.error('❌ ERROR: Using Apache URL instead of PHP server!');
    console.error('   Expected: http://localhost:8000/api');
    console.error('   Actual:', API_BASE_URL);
    console.error('   Solution: Check .env file and restart React server (npm start)');
}

/**
 * Get all website settings
 */
export const getWebsiteSettings = async () => {
    try {
        // Add cache busting to ensure fresh settings
        const timestamp = new Date().getTime();
        const response = await fetch(`${API_BASE_URL}/public/settings.php?_t=${timestamp}`, {
            cache: 'no-cache',
            headers: {
                'Cache-Control': 'no-cache'
            }
        });
        const data = await response.json();
        console.log('[PublicAPI] Website settings fetched:', data);
        return data;
    } catch (error) {
        console.error('Error fetching website settings:', error);
        return { success: false, data: {} };
    }
};

/**
 * Get content sections for a specific page
 */
export const getPageContent = async (page) => {
    try {
        // Add cache busting to ensure fresh content
        const timestamp = new Date().getTime();
        const response = await fetch(`${API_BASE_URL}/public/content.php?page=${page}&_t=${timestamp}`, {
            cache: 'no-cache'
            // Removed Cache-Control header to avoid CORS preflight issues
            // Cache busting is handled by the timestamp query parameter
        });
        const data = await response.json();
        
        // Log for debugging
        console.log(`[PublicAPI] Fetched content for page "${page}":`, data);
        
        return data;
    } catch (error) {
        console.error('Error fetching page content:', error);
        return { success: false, data: [] };
    }
};

export default {
    getWebsiteSettings,
    getPageContent,
};

