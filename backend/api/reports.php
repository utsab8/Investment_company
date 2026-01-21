<?php
/**
 * Reports API Endpoint
 * Returns investment reports
 */

header('Content-Type: application/json');

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../models/Report.php';

try {
    $report = new Report();
    
    // Get filters from query parameters
    $filters = [];
    if (isset($_GET['report_type'])) {
        $filters['report_type'] = $_GET['report_type'];
    }
    if (isset($_GET['year'])) {
        $filters['year'] = (int)$_GET['year'];
    }
    if (isset($_GET['limit'])) {
        $filters['limit'] = (int)$_GET['limit'];
    }

    // Increment download count
    if (isset($_GET['download']) && isset($_GET['id'])) {
        $report->incrementDownload($_GET['id']);
        Response::success(null, 'Download count updated');
    }
    // Get all reports
    else {
        $reports = $report->getAll($filters);
        Response::success($reports, 'Reports retrieved successfully');
    }
} catch (Exception $e) {
    error_log("Reports API Error: " . $e->getMessage());
    Response::error('An error occurred while retrieving reports', 500);
}

