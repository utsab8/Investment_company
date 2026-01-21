<?php
/**
 * About Items API Endpoint
 * Returns about page items (awards, certificates, team members, timeline)
 */

header('Content-Type: application/json');

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../models/AboutItem.php';

try {
    $aboutItem = new AboutItem();
    
    // Get type filter from query parameter
    $type = $_GET['type'] ?? null;
    
    $items = $aboutItem->getAll($type);
    Response::success($items, 'About items retrieved successfully');
} catch (Exception $e) {
    error_log("About Items API Error: " . $e->getMessage());
    Response::error('An error occurred while retrieving about items', 500);
}




