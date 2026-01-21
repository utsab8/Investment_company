<?php
/**
 * Public Content API
 * Returns content sections for public frontend
 */

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../utils/Cors.php';
require_once __DIR__ . '/../../utils/Response.php';
require_once __DIR__ . '/../../models/WebsiteSettings.php';

// Handle CORS
Cors::handle();

header('Content-Type: application/json');

try {
    $settings = new WebsiteSettings();
    
    $page = $_GET['page'] ?? null;
    $key = $_GET['key'] ?? null;
    
    if ($key) {
        // Get specific content section
        $section = $settings->getContentSection($key);
        if ($section) {
            Response::success($section, 'Content section retrieved');
        } else {
            Response::error('Content section not found', 404);
        }
    } else {
        // Get all content sections for a page
        $sections = $settings->getContentSections($page);
        
        // Convert to key-value pairs for easy access
        $contentArray = [];
        foreach ($sections as $section) {
            if (isset($section['section_key']) && isset($section['content'])) {
                $contentArray[$section['section_key']] = $section['content'];
            }
        }
        
        // Log for debugging (remove in production)
        error_log("Content API - Page: $page, Sections found: " . count($sections) . ", Keys: " . implode(', ', array_keys($contentArray)));
        
        Response::success($contentArray, 'Content sections retrieved');
    }
} catch (Exception $e) {
    error_log("Public Content API Error: " . $e->getMessage());
    Response::error('An error occurred while retrieving content', 500);
}

