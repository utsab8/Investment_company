<?php
/**
 * Media Library API
 * List, view, and delete uploaded media files
 */

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../utils/Cors.php';
require_once __DIR__ . '/../../utils/Response.php';
require_once __DIR__ . '/../../utils/Auth.php';
require_once __DIR__ . '/../../models/WebsiteSettings.php';

// Handle CORS
Cors::handle();

header('Content-Type: application/json');
session_start();

Auth::requireAuth();

$settings = new WebsiteSettings();

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $category = $_GET['category'] ?? null;
        $media = $settings->getAllMedia($category);
        
        // Generate full URLs for each media item
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
        $host = $_SERVER['HTTP_HOST'] ?? 'localhost:8000';
        
        if (strpos($host, ':8000') === false && strpos($host, 'localhost') !== false) {
            $host = 'localhost:8000';
        }
        
        foreach ($media as &$item) {
            // Extract category and filename from file_path
            // Handle both Windows and Unix paths
            $filePath = str_replace('\\', '/', $item['file_path']); // Normalize to forward slashes
            $uploadsDir = str_replace('\\', '/', __DIR__ . '/../uploads/'); // Normalize to forward slashes
            
            // Try to extract relative path
            $relativePath = str_replace($uploadsDir, '', $filePath);
            
            // If that didn't work, try extracting category and filename directly
            if ($relativePath === $filePath || empty($relativePath)) {
                // Extract category and filename from the stored path
                $category = $item['category'] ?? 'general';
                $filename = $item['filename'] ?? basename($filePath);
                $relativePath = $category . '/' . $filename;
            }
            
            // Ensure we have a clean relative path (category/filename)
            $relativePath = ltrim($relativePath, '/');
            $item['url'] = $protocol . '://' . $host . '/backend/uploads/' . $relativePath;
        }
        
        Response::success($media, 'Media retrieved successfully');
    }
    elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $input['id'] ?? $_GET['id'] ?? null;
        
        if (!$id) {
            Response::error('Media ID is required', 400);
        }
        
        $result = $settings->deleteMedia($id);
        if ($result) {
            Response::success(null, 'Media deleted successfully');
        } else {
            Response::error('Failed to delete media', 500);
        }
    }
    else {
        Response::error('Method not allowed', 405);
    }
} catch (PDOException $e) {
    error_log("Media API PDO Error: " . $e->getMessage());
    Response::error('Database error: ' . $e->getMessage(), 500);
} catch (Exception $e) {
    error_log("Media API Error: " . $e->getMessage());
    Response::error('An error occurred: ' . $e->getMessage(), 500);
}


