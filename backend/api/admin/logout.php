<?php
/**
 * Admin Logout API
 */

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../utils/Cors.php';
require_once __DIR__ . '/../../utils/Response.php';
require_once __DIR__ . '/../../utils/Auth.php';
require_once __DIR__ . '/../../models/Admin.php';

// Handle CORS
Cors::handle();

header('Content-Type: application/json');
session_start();

try {
    $token = Auth::getToken();
    
    if ($token) {
        $admin = new Admin();
        $admin->deleteSession($token);
    }

    session_destroy();
    unset($_SESSION['admin_token']);
    unset($_SESSION['admin_user']);

    Response::success(null, 'Logged out successfully');
} catch (Exception $e) {
    error_log("Logout Error: " . $e->getMessage());
    Response::success(null, 'Logged out');
}

