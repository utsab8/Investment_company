<?php
/**
 * Public Website Settings API
 * Returns website settings for public frontend
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
    
    // Get all public settings
    $allSettings = $settings->getAllSettings();
    
    // Convert to key-value pairs for easy access
    $settingsArray = [];
    foreach ($allSettings as $setting) {
        $settingsArray[$setting['setting_key']] = $setting['setting_value'];
    }
    
    Response::success($settingsArray, 'Settings retrieved successfully');
} catch (Exception $e) {
    error_log("Public Settings API Error: " . $e->getMessage());
    Response::error('An error occurred while retrieving settings', 500);
}

