<?php
/**
 * Process Items API Endpoint
 * Returns process page items (steps, risk management items)
 */

header('Content-Type: application/json');

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../utils/Cors.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../models/ProcessItem.php';

// Handle CORS
Cors::handle();

try {
    $processItem = new ProcessItem();
    
    // Get type filter from query parameter
    $type = $_GET['type'] ?? null;
    
    $items = $processItem->getAll($type);
    Response::success($items, 'Process items retrieved successfully');
} catch (Exception $e) {
    error_log("Process Items API Error: " . $e->getMessage());
    Response::error('An error occurred while retrieving process items', 500);
}




