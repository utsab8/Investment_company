<?php
/**
 * Admin API Test Endpoint
 */

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../utils/Cors.php';

// Handle CORS
Cors::handle();

header('Content-Type: application/json');

echo json_encode([
    'success' => true,
    'message' => 'Admin API endpoint is accessible!',
    'endpoint' => 'admin/test.php',
    'timestamp' => date('Y-m-d H:i:s')
], JSON_PRETTY_PRINT);

