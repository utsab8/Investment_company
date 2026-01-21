<?php
/**
 * Reports Manager API - Admin CRUD operations
 */

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../utils/Cors.php';
require_once __DIR__ . '/../../utils/Response.php';
require_once __DIR__ . '/../../utils/Auth.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../models/Report.php';

// Handle CORS first
Cors::handle();

header('Content-Type: application/json');
session_start();

// Check authentication
try {
    Auth::requireAuth();
} catch (Exception $e) {
    error_log("Reports Manager Auth Error: " . $e->getMessage());
    Response::error('Authentication required: ' . $e->getMessage(), 401);
    exit;
}

$report = new Report();

try {
    $method = $_SERVER['REQUEST_METHOD'];
    
    if ($method === 'GET') {
        // Get all reports for admin
        $reports = $report->getAllForAdmin();
        Response::success($reports, 'Reports retrieved successfully');
    }
    elseif ($method === 'POST') {
        // Create new report
        $input = json_decode(file_get_contents('php://input'), true);
        if (empty($input)) {
            $input = $_POST;
        }

        $id = $report->create($input);
        if ($id) {
            $newReport = $report->getByIdForAdmin($id);
            Response::success($newReport, 'Report created successfully');
        } else {
            Response::error('Failed to create report', 500);
        }
    }
    elseif ($method === 'PUT') {
        // Update report
        $input = json_decode(file_get_contents('php://input'), true);
        if (empty($input)) {
            $input = $_POST;
        }

        if (!isset($input['id'])) {
            Response::error('Report ID is required', 400);
        }

        $id = (int)$input['id'];
        unset($input['id']); // Remove id from update data

        if ($report->update($id, $input)) {
            $updatedReport = $report->getByIdForAdmin($id);
            Response::success($updatedReport, 'Report updated successfully');
        } else {
            Response::error('Failed to update report', 500);
        }
    }
    elseif ($method === 'DELETE') {
        // Delete report (hard delete - permanently remove)
        $input = json_decode(file_get_contents('php://input'), true);
        if (empty($input) && isset($_GET['id'])) {
            $input = ['id' => $_GET['id']];
        }
        if (empty($input) && isset($_POST['id'])) {
            $input = ['id' => $_POST['id']];
        }

        if (!isset($input['id'])) {
            Response::error('Report ID is required', 400);
        }

        $id = (int)$input['id'];
        
        // Verify report exists before deleting
        $existingReport = $report->getByIdForAdmin($id);
        if (!$existingReport) {
            Response::error('Report not found', 404);
        }

        if ($report->delete($id)) {
            Response::success(null, 'Report deleted successfully');
        } else {
            Response::error('Failed to delete report. Please try again.', 500);
        }
    }
    else {
        Response::error('Method not allowed', 405);
    }
} catch (PDOException $e) {
    error_log("Reports Manager API PDO Error: " . $e->getMessage());
    error_log("Stack trace: " . $e->getTraceAsString());
    Response::error('Database error: ' . $e->getMessage(), 500);
} catch (Exception $e) {
    error_log("Reports Manager API Error: " . $e->getMessage());
    error_log("Stack trace: " . $e->getTraceAsString());
    Response::error('An error occurred: ' . $e->getMessage(), 500);
}

