<?php
/**
 * File Upload API
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

$admin = Auth::getAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('Method not allowed', 405);
}

if (!isset($_FILES['file'])) {
    Response::error('No file uploaded', 400);
}

$file = $_FILES['file'];
$category = $_POST['category'] ?? 'general';
$altText = $_POST['alt_text'] ?? '';

// Validate file
$allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'application/pdf'];
$maxSize = MAX_FILE_SIZE; // 5MB

if (!in_array($file['type'], $allowedTypes)) {
    Response::error('Invalid file type. Allowed: JPEG, PNG, GIF, WebP, SVG, PDF', 400);
}

if ($file['size'] > $maxSize) {
    Response::error('File size exceeds maximum allowed size (5MB)', 400);
}

try {
    // Create upload directory if it doesn't exist
    $uploadDir = UPLOAD_DIR . $category . '/';
    if (!file_exists($uploadDir)) {
        if (!mkdir($uploadDir, 0755, true)) {
            Response::error('Failed to create upload directory. Please check permissions.', 500);
        }
    }
    
    // Check if directory is writable
    if (!is_writable($uploadDir)) {
        Response::error('Upload directory is not writable. Please check permissions: ' . $uploadDir, 500);
    }

    // Generate unique filename
    $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $filename = uniqid() . '_' . time() . '.' . $extension;
    $filePath = $uploadDir . $filename;
    
    // Log for debugging
    error_log("Upload attempt: " . $file['name'] . " -> " . $filePath);

    // Move uploaded file
    if (move_uploaded_file($file['tmp_name'], $filePath)) {
        // Verify file was actually saved
        if (!file_exists($filePath)) {
            Response::error('File was moved but cannot be found. Please try again.', 500);
        }
        
        // Log successful upload
        error_log("File uploaded successfully: " . $filePath . " (Size: " . filesize($filePath) . " bytes)");
        // Save to database (optional - file is already saved, so continue even if DB save fails)
        $mediaId = null;
        $settings = new WebsiteSettings();
        
        try {
            $mediaId = $settings->saveMedia([
                'filename' => $filename,
                'original_filename' => $file['name'],
                'file_path' => $filePath,
                'file_type' => $extension,
                'file_size' => $file['size'],
                'mime_type' => $file['type'],
                'alt_text' => $altText,
                'category' => $category,
                'uploaded_by' => $admin['id']
            ]);
            
            if (!$mediaId) {
                error_log("Warning: File uploaded but failed to save to media table. File path: " . $filePath);
                // Continue anyway - file is uploaded successfully
            }
        } catch (PDOException $dbError) {
            error_log("Database error saving media: " . $dbError->getMessage());
            // Continue anyway - file is uploaded successfully
            // The media table might not exist, but the file is still uploaded
        }

        // Generate file URL - works with both PHP server and Apache
        // For PHP built-in server (port 8000), use absolute URL
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
        $host = $_SERVER['HTTP_HOST'] ?? 'localhost:8000';
        
        // If using PHP built-in server, use port 8000
        if (strpos($host, ':8000') === false && strpos($host, 'localhost') !== false) {
            $host = 'localhost:8000';
        }
        
        // Determine if we're using PHP built-in server or Apache
        // For PHP built-in server (port 8000), use /uploads/ (router handles it)
        // For Apache, use /backend/uploads/
        if (strpos($host, ':8000') !== false) {
            $fileUrl = $protocol . '://' . $host . '/uploads/' . $category . '/' . $filename;
        } else {
            $fileUrl = $protocol . '://' . $host . '/backend/uploads/' . $category . '/' . $filename;
        }
        
        // Log for debugging
        error_log("Generated file URL: " . $fileUrl);

        Response::success([
            'id' => $mediaId,
            'url' => $fileUrl,
            'filename' => $filename,
            'original_filename' => $file['name'],
            'size' => $file['size'],
            'type' => $file['type']
        ], 'File uploaded successfully');
    } else {
        $errorMsg = 'Failed to move uploaded file';
        if (!is_writable($uploadDir)) {
            $errorMsg .= '. Upload directory is not writable: ' . $uploadDir;
        }
        error_log("Upload Error: " . $errorMsg);
        Response::error($errorMsg, 500);
    }
} catch (PDOException $e) {
    error_log("Upload PDO Error: " . $e->getMessage());
    error_log("Upload PDO Error Code: " . $e->getCode());
    Response::error('Database error: ' . $e->getMessage() . '. Please run /api/admin/setup.php to create the media table.', 500);
} catch (Exception $e) {
    error_log("Upload Error: " . $e->getMessage());
    error_log("Upload Error Trace: " . $e->getTraceAsString());
    Response::error('An error occurred during upload: ' . $e->getMessage(), 500);
}

