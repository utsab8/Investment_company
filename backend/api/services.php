<?php
/**
 * Services API Endpoint
 * Returns investment services
 */

header('Content-Type: application/json');

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../models/Service.php';

try {
    $service = new Service();
    $services = $service->getAll();
    Response::success($services, 'Services retrieved successfully');
} catch (Exception $e) {
    error_log("Services API Error: " . $e->getMessage());
    Response::error('An error occurred while retrieving services', 500);
}




