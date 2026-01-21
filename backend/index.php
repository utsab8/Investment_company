<?php
/**
 * Backend Entry Point
 * MRB International - Investment Company
 */

header('Content-Type: application/json');

require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/utils/Response.php';

// Simple routing
$request_uri = $_SERVER['REQUEST_URI'];
$request_method = $_SERVER['REQUEST_METHOD'];

// Remove query string
$path = parse_url($request_uri, PHP_URL_PATH);
$path = str_replace('/backend', '', $path);
$path = trim($path, '/');

// Handle root path - show API info
if ($path === '' || $path === '/') {
    Response::success([
        'message' => 'MRB International API',
        'version' => API_VERSION,
        'endpoints' => [
            'projects' => '/api/projects.php',
            'reports' => '/api/reports.php',
            'faqs' => '/api/faqs.php',
            'contact' => '/api/contact.php (POST)'
        ]
    ], 'API is running');
}

// Route to appropriate API endpoint
if (strpos($path, 'api/') === 0) {
    $api_path = substr($path, 4); // Remove 'api/' prefix
    
    // Remove .php extension if present
    if (substr($api_path, -4) === '.php') {
        $api_path = substr($api_path, 0, -4);
    }
    
    // Public API routes
    if (strpos($api_path, 'public/') === 0) {
        $public_path = substr($api_path, 7); // Remove 'public/' prefix
        switch ($public_path) {
            case 'settings':
                require_once __DIR__ . '/api/public/settings.php';
                break;
            case 'content':
                require_once __DIR__ . '/api/public/content.php';
                break;
            default:
                Response::error('Public API endpoint not found', 404);
                break;
        }
    }
    // Admin API routes
    elseif (strpos($api_path, 'admin/') === 0) {
        $admin_path = substr($api_path, 6); // Remove 'admin/' prefix
        switch ($admin_path) {
            case 'login':
            case 'check-auth':
            case 'logout':
            case 'dashboard':
                require_once __DIR__ . '/api/admin/dashboard.php';
                break;
            case 'settings':
            case 'contacts':
            case 'content':
            case 'page-content':
            case 'init-page-content':
            case 'upload':
            case 'media':
            case 'test':
            case 'setup':
            case 'init-settings':
            case 'projects-manager':
            case 'services-manager':
            case 'reports-manager':
            case 'faqs-manager':
            case 'about-items-manager':
            case 'process-items-manager':
            case 'seed-process-data':
            case 'seed-reports-data':
                $filePath = __DIR__ . '/api/admin/' . $admin_path . '.php';
                if (file_exists($filePath)) {
                    try {
                        require_once $filePath;
                    } catch (Exception $e) {
                        error_log("Error loading admin API file $filePath: " . $e->getMessage());
                        Response::error('Error loading API endpoint: ' . $e->getMessage(), 500);
                    }
                } else {
                    error_log("Admin API file not found: $filePath (admin_path: $admin_path)");
                    Response::error("Admin API endpoint file not found: $admin_path", 404);
                }
                break;
            default:
                Response::error('Admin API endpoint not found', 404);
                break;
        }
    }
    // Regular API routes
    else {
        switch ($api_path) {
            case 'contact':
                require_once __DIR__ . '/api/contact.php';
                break;
            case 'projects':
                require_once __DIR__ . '/api/projects.php';
                break;
            case 'services':
                require_once __DIR__ . '/api/services.php';
                break;
            case 'about-items':
                require_once __DIR__ . '/api/about-items.php';
                break;
            case 'process-items':
                require_once __DIR__ . '/api/process-items.php';
                break;
            case 'reports':
                require_once __DIR__ . '/api/reports.php';
                break;
            case 'faqs':
                require_once __DIR__ . '/api/faqs.php';
                break;
            default:
                Response::error('API endpoint not found', 404);
                break;
        }
    }
} else {
    Response::error('Invalid request. Use /api/ endpoint', 400);
}

