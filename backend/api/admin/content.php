<?php
/**
 * Content Sections API
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
        $page = $_GET['page'] ?? null;
        $key = $_GET['key'] ?? null;

        if ($key) {
            $section = $settings->getContentSection($key);
            if ($section) {
                Response::success($section, 'Content section retrieved');
            } else {
                Response::error('Content section not found', 404);
            }
        } else {
            $sections = $settings->getContentSections($page);
            Response::success($sections, 'Content sections retrieved');
        }
    } 
    elseif ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PUT') {
        $input = json_decode(file_get_contents('php://input'), true);
        if (empty($input)) {
            $input = $_POST;
        }

        if (isset($input['key']) && isset($input['content'])) {
            $page = $input['page'] ?? 'home';
            $sectionName = $input['section_name'] ?? null;
            $result = $settings->updateContentSection($input['key'], $input['content'], $page, $sectionName);
            if ($result) {
                Response::success(null, 'Content updated successfully');
            } else {
                Response::error('Failed to update content', 500);
            }
        } else {
            Response::error('Key and content are required', 400);
        }
    } else {
        Response::error('Method not allowed', 405);
    }
} catch (PDOException $e) {
    error_log("Content API PDO Error: " . $e->getMessage());
    if (strpos($e->getMessage(), "doesn't exist") !== false) {
        // Table doesn't exist - try to create it
        try {
            $settings = new WebsiteSettings(); // This will auto-create tables
            // Retry the request
            if ($_SERVER['REQUEST_METHOD'] === 'GET') {
                $page = $_GET['page'] ?? null;
                $sections = $settings->getContentSections($page);
                Response::success($sections, 'Content sections retrieved');
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
    error_log("Content API Error: " . $e->getMessage());
    Response::error('An error occurred: ' . $e->getMessage(), 500);
}

