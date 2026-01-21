/**
 * Admin API Service
 * Handles all admin panel API calls
 */

// Construct admin API base URL
const getAdminApiBaseUrl = () => {
    // Use environment variable or default to PHP built-in server
    let baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
    
    // CRITICAL: Force use of port 8000 if using localhost without port
    // This prevents accidentally using Apache instead of PHP built-in server
    if (baseUrl.includes('localhost') && !baseUrl.includes(':8000') && !baseUrl.includes(':3000')) {
        console.warn('⚠️ WARNING: Backend URL does not specify port 8000. Using default PHP server.');
        baseUrl = 'http://localhost:8000/api';
    }
    
    // Remove trailing slash if present
    baseUrl = baseUrl.replace(/\/$/, '');
    
    // Append /admin to the base URL
    if (baseUrl.endsWith('/api')) {
        return baseUrl + '/admin';
    }
    if (baseUrl.endsWith('/api/')) {
        return baseUrl + 'admin';
    }
    // If /api is in the middle, replace it with /api/admin
    if (baseUrl.includes('/api') && !baseUrl.includes('/api/admin')) {
        return baseUrl.replace('/api', '/api/admin');
    }
    // Default: append /admin
    return baseUrl + '/admin';
};

const ADMIN_API_BASE_URL = getAdminApiBaseUrl();

// Log for debugging - CRITICAL for troubleshooting
console.log('🔧 Admin API Base URL:', ADMIN_API_BASE_URL);
console.log('🔧 REACT_APP_API_URL from .env:', process.env.REACT_APP_API_URL || 'NOT SET - using default');

// Warn if using wrong URL
if (ADMIN_API_BASE_URL.includes('investment-Company') || ADMIN_API_BASE_URL.includes('localhost/backend')) {
    console.error('❌ ERROR: Using Apache URL instead of PHP server!');
    console.error('   Expected: http://localhost:8000/api/admin');
    console.error('   Actual:', ADMIN_API_BASE_URL);
    console.error('   Solution: Restart React server (npm start) to read .env file');
}

/**
 * Generic admin API request
 */
async function adminRequest(endpoint, options = {}) {
    const url = `${ADMIN_API_BASE_URL}/${endpoint}`;
    
    // Get token from sessionStorage
    const token = sessionStorage.getItem('admin_token');
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for session
    };

    if (token) {
        defaultOptions.headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    };

    try {
        console.log('📡 Making request to:', url);
        console.log('📡 Request config:', { method: config.method, headers: config.headers });
        
        const response = await fetch(url, config);
        console.log('📡 Response status:', response.status, response.statusText);
        
        // Check if response is JSON
        let data;
        try {
            const text = await response.text();
            console.log('📡 Response text:', text.substring(0, 200));
            data = JSON.parse(text);
        } catch (jsonError) {
            // Not JSON response - backend might not be running
            console.error('❌ Backend returned non-JSON:', jsonError);
            throw new Error(`Backend server not responding correctly. Please check if PHP server is running on port 8000. Tried URL: ${url}`);
        }
        
        if (!response.ok) {
            console.error('❌ Response not OK:', response.status, data);
            if (response.status === 401) {
                // Unauthorized - clear session and redirect
                sessionStorage.removeItem('admin_token');
                sessionStorage.removeItem('admin_user');
                // Don't redirect on login page
                if (!window.location.pathname.includes('/admin/login')) {
                    window.location.href = '/admin/login';
                }
                throw new Error('Invalid username or password');
            }
            throw new Error(data.message || `Server error: ${response.status}`);
        }
        
        console.log('✅ Request successful:', data);
        return data;
    } catch (error) {
        // Enhanced error logging
        console.error('Admin API Error:', {
            url,
            error: error.message,
            type: error.name
        });
        
        // Check for network errors
        if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
            throw new Error(`Cannot connect to backend API at ${url}. Please check:\n1. Apache/XAMPP/WAMP is running\n2. Backend URL is correct\n3. Check browser console for details`);
        }
        
        throw error;
    }
}

/**
 * Admin Authentication API
 */
export const adminAuthAPI = {
    login: async (username, password) => {
        console.log('🔐 adminAuthAPI.login called with username:', username);
        console.log('🔐 Admin API Base URL:', ADMIN_API_BASE_URL);
        
        const response = await adminRequest('login.php', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });
        
        console.log('🔐 Login response received:', response);
        
        if (response && response.success && response.data && response.data.token) {
            sessionStorage.setItem('admin_token', response.data.token);
            sessionStorage.setItem('admin_user', JSON.stringify(response.data.user));
            console.log('✅ Session saved to sessionStorage');
        } else {
            console.warn('⚠️ Response missing expected data:', response);
        }
        
        return response;
    },

    logout: async () => {
        await adminRequest('logout.php', { method: 'POST' });
        sessionStorage.removeItem('admin_token');
        sessionStorage.removeItem('admin_user');
    },

    checkAuth: async () => {
        return adminRequest('check-auth.php');
    },
};

/**
 * Settings API
 */
export const adminSettingsAPI = {
    getAll: async (category = null) => {
        const url = category ? `settings.php?category=${category}` : 'settings.php';
        return adminRequest(url);
    },

    get: async (key) => {
        return adminRequest(`settings.php?key=${key}`);
    },

    update: async (key, value) => {
        return adminRequest('settings.php', {
            method: 'POST',
            body: JSON.stringify({ key, value }),
        });
    },

    bulkUpdate: async (settings) => {
        return adminRequest('settings.php', {
            method: 'POST',
            body: JSON.stringify({ settings }),
        });
    },
};

/**
 * Content API
 */
export const adminContentAPI = {
    getAll: async (page = null) => {
        const url = page ? `content.php?page=${page}` : 'content.php';
        return adminRequest(url);
    },

    get: async (key) => {
        return adminRequest(`content.php?key=${key}`);
    },

    update: async (key, content, page = 'home', sectionName = null) => {
        return adminRequest('content.php', {
            method: 'POST',
            body: JSON.stringify({ key, content, page, section_name: sectionName }),
        });
    },
};

/**
 * Page Content API (Comprehensive)
 */
export const adminPageContentAPI = {
    getSections: async (page) => {
        return adminRequest(`page-content.php?page=${page}&action=sections`);
    },

    getPageContent: async (page) => {
        return adminRequest(`page-content.php?page=${page}`);
    },

    saveSections: async (sections, page) => {
        return adminRequest('page-content.php', {
            method: 'POST',
            body: JSON.stringify({ sections, page }),
        });
    },
};

/**
 * Contacts API
 */
export const adminContactsAPI = {
    getAll: async (filters = {}) => {
        const queryParams = new URLSearchParams();
        if (filters.status) queryParams.append('status', filters.status);
        if (filters.limit) queryParams.append('limit', filters.limit);
        
        const queryString = queryParams.toString();
        const endpoint = queryString ? `contacts.php?${queryString}` : 'contacts.php';
        return adminRequest(endpoint);
    },

    updateStatus: async (id, status) => {
        return adminRequest('contacts.php', {
            method: 'PUT',
            body: JSON.stringify({ id, status }),
        });
    },

    delete: async (id) => {
        return adminRequest(`contacts.php?id=${id}`, {
            method: 'DELETE',
        });
    },
};

/**
 * Upload API
 */
export const adminUploadAPI = {
    upload: async (file, category = 'general', altText = '') => {
        if (!file) {
            throw new Error('No file selected');
        }

        // Validate file size (5MB max)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
            throw new Error('File size exceeds 5MB limit. Please choose a smaller file.');
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
            throw new Error('Invalid file type. Allowed: JPEG, PNG, GIF, WebP, SVG, PDF');
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', category);
        formData.append('alt_text', altText);

        const token = sessionStorage.getItem('admin_token');
        
        try {
            const response = await fetch(`${ADMIN_API_BASE_URL}/upload.php`, {
                method: 'POST',
                headers: token ? {
                    'Authorization': `Bearer ${token}`,
                } : {},
                body: formData,
                credentials: 'include',
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || `Upload failed: ${response.statusText}`);
            }

            if (!data.success) {
                throw new Error(data.message || 'Upload failed');
            }

            return data;
        } catch (error) {
            console.error('Upload error:', error);
            if (error.message) {
                throw error;
            }
            throw new Error('Network error. Please check your connection and try again.');
        }
    },
};

/**
 * Media Library API
 */
export const adminMediaAPI = {
    getAll: async (category = null) => {
        const url = category ? `media.php?category=${category}` : 'media.php';
        return adminRequest(url);
    },
    
    delete: async (id) => {
        return adminRequest('media.php', {
            method: 'DELETE',
            body: JSON.stringify({ id }),
        });
    },
};

/**
 * Dashboard API
 */
export const adminDashboardAPI = {
    getStats: async () => {
        return adminRequest('dashboard.php');
    },
};

/**
 * Projects Manager API
 */
export const adminProjectsAPI = {
    getAll: async () => {
        return adminRequest('projects-manager.php');
    },
    create: async (data) => {
        return adminRequest('projects-manager.php', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    update: async (id, data) => {
        return adminRequest('projects-manager.php', {
            method: 'PUT',
            body: JSON.stringify({ id, ...data }),
        });
    },
    delete: async (id) => {
        return adminRequest('projects-manager.php', {
            method: 'DELETE',
            body: JSON.stringify({ id }),
        });
    },
};

/**
 * Reports Manager API
 */
export const adminReportsAPI = {
    getAll: async () => {
        return adminRequest('reports-manager.php');
    },
    create: async (data) => {
        return adminRequest('reports-manager.php', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    update: async (id, data) => {
        return adminRequest('reports-manager.php', {
            method: 'PUT',
            body: JSON.stringify({ id, ...data }),
        });
    },
    delete: async (id) => {
        return adminRequest('reports-manager.php', {
            method: 'DELETE',
            body: JSON.stringify({ id }),
        });
    },
};

/**
 * Services Manager API
 */
export const adminServicesAPI = {
    getAll: async () => {
        return adminRequest('services-manager.php');
    },
    create: async (data) => {
        return adminRequest('services-manager.php', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    update: async (id, data) => {
        return adminRequest('services-manager.php', {
            method: 'PUT',
            body: JSON.stringify({ id, ...data }),
        });
    },
    delete: async (id) => {
        return adminRequest('services-manager.php', {
            method: 'DELETE',
            body: JSON.stringify({ id }),
        });
    },
};

/**
 * About Items Manager API
 */
export const adminAboutItemsAPI = {
    getAll: async (type = null) => {
        const url = type ? `about-items-manager.php?type=${type}` : 'about-items-manager.php';
        return adminRequest(url);
    },
    create: async (data) => {
        return adminRequest('about-items-manager.php', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    update: async (id, data) => {
        return adminRequest('about-items-manager.php', {
            method: 'PUT',
            body: JSON.stringify({ id, ...data }),
        });
    },
    delete: async (id) => {
        return adminRequest('about-items-manager.php', {
            method: 'DELETE',
            body: JSON.stringify({ id }),
        });
    },
};

/**
 * FAQs Manager API
 */
export const adminFaqsAPI = {
    getAll: async () => {
        return adminRequest('faqs-manager.php');
    },
    create: async (data) => {
        return adminRequest('faqs-manager.php', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    update: async (id, data) => {
        return adminRequest('faqs-manager.php', {
            method: 'PUT',
            body: JSON.stringify({ id, ...data }),
        });
    },
    delete: async (id) => {
        return adminRequest('faqs-manager.php', {
            method: 'DELETE',
            body: JSON.stringify({ id }),
        });
    },
};

/**
 * Process Items Manager API
 */
export const adminProcessItemsAPI = {
    getAll: async (type = null) => {
        const url = type ? `process-items-manager.php?type=${type}` : 'process-items-manager.php';
        return adminRequest(url);
    },
    create: async (data) => {
        return adminRequest('process-items-manager.php', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    update: async (id, data) => {
        return adminRequest('process-items-manager.php', {
            method: 'PUT',
            body: JSON.stringify({ id, ...data }),
        });
    },
    delete: async (id) => {
        return adminRequest('process-items-manager.php', {
            method: 'DELETE',
            body: JSON.stringify({ id }),
        });
    },
};

// Export adminRequest for use in components
export { adminRequest };

export default {
    auth: adminAuthAPI,
    settings: adminSettingsAPI,
    content: adminContentAPI,
    contacts: adminContactsAPI,
    upload: adminUploadAPI,
    media: adminMediaAPI,
    dashboard: adminDashboardAPI,
    projects: adminProjectsAPI,
    services: adminServicesAPI,
    aboutItems: adminAboutItemsAPI,
    processItems: adminProcessItemsAPI,
};

