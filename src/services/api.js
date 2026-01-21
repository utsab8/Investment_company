/**
 * API Service
 * Handles all API calls to the PHP backend
 */

// CRITICAL: Force use of PHP built-in server (port 8000) not Apache
const getApiBaseUrl = () => {
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

const API_BASE_URL = getApiBaseUrl();

// Log for debugging
console.log('🔧 API Base URL:', API_BASE_URL);

/**
 * Generic API request function
 */
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}/${endpoint}`;
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-cache',
    };

    const config = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    };

    try {
        console.log('🔍 API Request:', url, config);
        const response = await fetch(url, config);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ API Error Response:', response.status, errorText);
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('✅ API Response:', data);
        
        return data;
    } catch (error) {
        console.error('❌ API Request Failed:', error);
        throw error;
    }
}

/**
 * Contact API
 */
export const contactAPI = {
    /**
     * Submit contact form
     * @param {Object} formData - Contact form data
     * @returns {Promise}
     */
    submit: async (formData) => {
        return apiRequest('contact.php', {
            method: 'POST',
            body: JSON.stringify(formData),
        });
    },
};


/**
 * Projects API
 */
export const projectsAPI = {
    /**
     * Get all projects
     * @param {Object} filters - Optional filters
     * @returns {Promise}
     */
    getAll: async (filters = {}) => {
        const queryParams = new URLSearchParams();
        if (filters.category) queryParams.append('category', filters.category);
        if (filters.year) queryParams.append('year', filters.year);
        if (filters.featured) queryParams.append('featured', '1');
        if (filters.limit) queryParams.append('limit', filters.limit);
        
        // Add cache busting to ensure fresh data
        const timestamp = filters._t || new Date().getTime();
        queryParams.append('_t', timestamp);
        
        const queryString = queryParams.toString();
        const endpoint = `projects.php?${queryString}`;
        
        console.log('🌐 Fetching projects from:', `${API_BASE_URL}/${endpoint}`);
        
        try {
            const response = await apiRequest(endpoint, {
                cache: 'no-cache'
            });
            console.log('✅ Projects API call successful');
            return response;
        } catch (error) {
            console.error('❌ Projects API call failed:', error);
            throw error;
        }
    },

    /**
     * Get project by ID
     * @param {number} id - Project ID
     * @returns {Promise}
     */
    getById: async (id) => {
        return apiRequest(`projects.php?id=${id}`);
    },

    /**
     * Get project statistics
     * @returns {Promise}
     */
    getStatistics: async () => {
        const timestamp = new Date().getTime();
        return apiRequest(`projects.php?stats=1&_t=${timestamp}`, {
            cache: 'no-cache'
        });
    },
};

/**
 * Services API
 */
export const servicesAPI = {
    /**
     * Get all services
     * @returns {Promise}
     */
    getAll: async () => {
        return apiRequest('services.php');
    },
};

/**
 * About Items API
 */
export const aboutItemsAPI = {
    /**
     * Get all about items
     * @param {string|null} type - Optional type filter (award, certificate, team_member, timeline)
     * @returns {Promise}
     */
    getAll: async (type = null) => {
        const endpoint = type ? `about-items.php?type=${type}` : 'about-items.php';
        return apiRequest(endpoint);
    },
};

/**
 * Process Items API
 */
export const processItemsAPI = {
    /**
     * Get all process items
     * @param {string|null} type - Optional type filter (step, risk_management)
     * @returns {Promise}
     */
    getAll: async (type = null) => {
        const endpoint = type ? `process-items.php?type=${type}` : 'process-items.php';
        return apiRequest(endpoint);
    },
};

/**
 * Reports API
 */
export const reportsAPI = {
    /**
     * Get all reports
     * @param {Object} filters - Optional filters
     * @returns {Promise}
     */
    getAll: async (filters = {}) => {
        const queryParams = new URLSearchParams();
        if (filters.report_type) queryParams.append('report_type', filters.report_type);
        if (filters.year) queryParams.append('year', filters.year);
        if (filters.limit) queryParams.append('limit', filters.limit);
        
        const queryString = queryParams.toString();
        const endpoint = queryString ? `reports.php?${queryString}` : 'reports.php';
        return apiRequest(endpoint);
    },

    /**
     * Increment download count
     * @param {number} id - Report ID
     * @returns {Promise}
     */
    incrementDownload: async (id) => {
        return apiRequest(`reports.php?download=1&id=${id}`);
    },
};

/**
 * FAQs API
 */
export const faqsAPI = {
    /**
     * Get all FAQs
     * @param {Object} filters - Optional filters
     * @returns {Promise}
     */
    getAll: async (filters = {}) => {
        const queryParams = new URLSearchParams();
        if (filters.category) queryParams.append('category', filters.category);
        if (filters.limit) queryParams.append('limit', filters.limit);
        
        const queryString = queryParams.toString();
        const endpoint = queryString ? `faqs.php?${queryString}` : 'faqs.php';
        return apiRequest(endpoint);
    },

    /**
     * Get FAQ by ID
     * @param {number} id - FAQ ID
     * @returns {Promise}
     */
    getById: async (id) => {
        return apiRequest(`faqs.php?id=${id}`);
    },
};

export default {
    contact: contactAPI,
    projects: projectsAPI,
    reports: reportsAPI,
    faqs: faqsAPI,
    processItems: processItemsAPI,
};

