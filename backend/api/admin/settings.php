<?php
/**
 * Website Settings API
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
        // Get all settings or by category
        $category = $_GET['category'] ?? null;
        $key = $_GET['key'] ?? null;

        if ($key) {
            $setting = $settings->getSetting($key);
            if ($setting) {
                Response::success($setting, 'Setting retrieved');
            } else {
                Response::error('Setting not found', 404);
            }
        } else {
            $allSettings = $settings->getAllSettings($category);
            Response::success($allSettings, 'Settings retrieved');
        }
    } 
    elseif ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PUT') {
        // Update settings
        $input = json_decode(file_get_contents('php://input'), true);
        if (empty($input)) {
            $input = $_POST;
        }

        if (isset($input['key']) && isset($input['value'])) {
            $result = $settings->updateSetting($input['key'], $input['value']);
            if ($result) {
                Response::success(null, 'Setting updated successfully');
            } else {
                Response::error('Failed to update setting', 500);
            }
        } 
        elseif (isset($input['settings']) && is_array($input['settings'])) {
            // Bulk update
            $updated = 0;
            foreach ($input['settings'] as $setting) {
                if (isset($setting['key']) && isset($setting['value'])) {
                    $settings->updateSetting($setting['key'], $setting['value']);
                    $updated++;
                }
            }
            Response::success(['updated' => $updated], 'Settings updated successfully');
        } else {
            Response::error('Invalid request data', 400);
        }
    } else {
        Response::error('Method not allowed', 405);
    }
} catch (PDOException $e) {
    error_log("Settings API PDO Error: " . $e->getMessage());
    if (strpos($e->getMessage(), "doesn't exist") !== false) {
        // Table doesn't exist - try to create it
        try {
            $settings = new WebsiteSettings(); // This will auto-create tables
            // Retry the request
            if ($_SERVER['REQUEST_METHOD'] === 'GET') {
                $category = $_GET['category'] ?? null;
                $allSettings = $settings->getAllSettings($category);
                Response::success($allSettings, 'Settings retrieved');
            } else {
                Response::error('Please try again. Tables have been created.', 500);
            }
        } catch (Exception $retryError) {
            Response::error('Database error. Please visit /api/admin/init-settings.php to initialize the database.', 500);
        }
    } else {
        Response::error('Database error: ' . $e->getMessage(), 500);
    }
} catch (Exception $e) {
    error_log("Settings API Error: " . $e->getMessage());
    Response::error('An error occurred: ' . $e->getMessage(), 500);
}

