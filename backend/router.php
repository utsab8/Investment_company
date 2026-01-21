<?php
/**
 * PHP Built-in Server Router
 * Routes all requests through index.php for proper routing
 */

require_once __DIR__ . '/config/config.php';

$requestUri = $_SERVER['REQUEST_URI'];
$requestPath = parse_url($requestUri, PHP_URL_PATH);

// Serve uploads directory - handle both /backend/uploads/ and /uploads/
if (strpos($requestPath, '/backend/uploads/') === 0 || strpos($requestPath, '/uploads/') === 0) {
    // Extract the file path
    $filePath = str_replace(['/backend/uploads/', '/uploads/'], '', $requestPath);
    
    // Remove any directory traversal attempts
    $filePath = str_replace('..', '', $filePath);
    
    // Build full path - use forward slashes (PHP handles it on Windows)
    $fullPath = __DIR__ . '/uploads/' . str_replace('\\', '/', $filePath);
    
    // Check if file exists first (simple check)
    if (file_exists($fullPath) && is_file($fullPath)) {
        // Security check: ensure file is within uploads directory
        $normalizedPath = realpath($fullPath);
        $uploadsDir = realpath(__DIR__ . '/uploads/');
        
        // If realpath fails, use the original path (Windows sometimes has issues)
        if (!$normalizedPath) {
            $normalizedPath = $fullPath;
        }
        if (!$uploadsDir) {
            $uploadsDir = __DIR__ . '/uploads/';
        }
        
        // Check security (case-insensitive on Windows, normalize slashes)
        $normalizedPathClean = strtolower(str_replace('\\', '/', $normalizedPath));
        $uploadsDirClean = strtolower(str_replace('\\', '/', $uploadsDir));
        $pathCheck = (strpos($normalizedPathClean, $uploadsDirClean) === 0);
        
        if ($pathCheck) {
            // Set appropriate content type
            $extension = strtolower(pathinfo($normalizedPath, PATHINFO_EXTENSION));
            $mimeTypes = [
                'jpg' => 'image/jpeg',
                'jpeg' => 'image/jpeg',
                'png' => 'image/png',
                'gif' => 'image/gif',
                'webp' => 'image/webp',
                'svg' => 'image/svg+xml',
                'pdf' => 'application/pdf'
            ];
            
            $mimeType = $mimeTypes[$extension] ?? 'application/octet-stream';
            
            // Set CORS headers for images - allow all origins for images
            header("Access-Control-Allow-Origin: *");
            header("Access-Control-Allow-Methods: GET, OPTIONS");
            header("Access-Control-Allow-Headers: Content-Type");
            
            header('Content-Type: ' . $mimeType);
            header('Content-Length: ' . filesize($normalizedPath));
            header('Cache-Control: public, max-age=31536000'); // Cache for 1 year
            readfile($normalizedPath);
            return true;
        }
    }
    
    // File not found - log for debugging with more details
    $debugInfo = [
        'requested_path' => $requestPath,
        'file_path' => $filePath,
        'full_path' => $fullPath,
        'file_exists' => file_exists($fullPath),
        'is_file' => is_file($fullPath),
        'uploads_dir' => __DIR__ . '/uploads/',
        'uploads_dir_exists' => file_exists(__DIR__ . '/uploads/'),
        'realpath_full' => realpath($fullPath),
        'realpath_uploads' => realpath(__DIR__ . '/uploads/')
    ];
    error_log("Upload file not found. Debug: " . json_encode($debugInfo));
    
    // Return 404 with proper headers and debug info
    http_response_code(404);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'File not found: ' . $filePath,
        'requested' => $requestPath,
        'debug' => $debugInfo
    ]);
    return true;
}

// If the request is for a static file (CSS, JS, images, etc.), serve it directly
$staticExtensions = ['css', 'js', 'jpg', 'jpeg', 'png', 'gif', 'ico', 'svg', 'woff', 'woff2', 'ttf', 'eot', 'webp', 'pdf'];
$extension = pathinfo($requestPath, PATHINFO_EXTENSION);

if ($extension && in_array(strtolower($extension), $staticExtensions)) {
    if (file_exists(__DIR__ . $requestPath)) {
        return false; // Let PHP serve the static file directly
    }
}

// For API endpoints, always route through index.php for proper routing and authentication
// This ensures admin endpoints go through the routing logic and authentication checks
if (strpos($requestPath, '/api/') === 0) {
    // Route all API requests through index.php for proper handling
    if (file_exists(__DIR__ . '/index.php')) {
        $_SERVER['REQUEST_URI'] = $requestUri; // Preserve original request URI
        require __DIR__ . '/index.php';
        return true;
    } else {
        error_log("Router: index.php not found at " . __DIR__ . '/index.php');
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'message' => 'Backend routing error']);
        return true;
    }
}

// Route all other requests through index.php
if (file_exists(__DIR__ . '/index.php')) {
    require __DIR__ . '/index.php';
    return true;
}

// If index.php doesn't exist, return 404
http_response_code(404);
header('Content-Type: application/json');
echo json_encode([
    'success' => false,
    'message' => 'Not found',
    'timestamp' => date('Y-m-d H:i:s')
]);
return true;
