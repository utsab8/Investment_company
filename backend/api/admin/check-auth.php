<?php
/**
 * Check Admin Authentication
 */

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../utils/Cors.php';
require_once __DIR__ . '/../../utils/Response.php';
require_once __DIR__ . '/../../utils/Auth.php';

// Handle CORS
Cors::handle();

header('Content-Type: application/json');
session_start();

$admin = Auth::getAdmin();

if ($admin) {
    Response::success(['user' => $admin], 'Authenticated');
} else {
    Response::error('Not authenticated', 401);
}

