<?php
/**
 * Process Items Manager API - Admin CRUD operations
 */

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../utils/Cors.php';
require_once __DIR__ . '/../../utils/Response.php';
require_once __DIR__ . '/../../utils/Auth.php';
require_once __DIR__ . '/../../models/ProcessItem.php';

// Handle CORS
Cors::handle();

header('Content-Type: application/json');
session_start();

Auth::requireAuth();

$processItem = new ProcessItem();

try {
    $method = $_SERVER['REQUEST_METHOD'];
    
    if ($method === 'GET') {
        // Get all process items for admin
        $type = $_GET['type'] ?? null;
        $items = $processItem->getAllForAdmin($type);
        Response::success($items, 'Process items retrieved successfully');
    }
    elseif ($method === 'POST') {
        // Create new process item
        $input = json_decode(file_get_contents('php://input'), true);
        if (empty($input)) {
            $input = $_POST;
        }

        error_log("Creating new process item");
        error_log("Create data: " . json_encode($input));

        $id = $processItem->create($input);
        if ($id) {
            $newItem = $processItem->getById($id);
            error_log("Process item created. ID: $id");
            Response::success($newItem, 'Process item created successfully');
        } else {
            Response::error('Failed to create process item', 500);
        }
    }
    elseif ($method === 'PUT') {
        // Update process item
        $input = json_decode(file_get_contents('php://input'), true);
        if (empty($input)) {
            $input = $_POST;
        }

        if (!isset($input['id'])) {
            Response::error('Process item ID is required', 400);
        }

        $id = (int)$input['id'];
        unset($input['id']); // Remove id from update data

        error_log("Updating process item ID: $id");
        error_log("Update data: " . json_encode($input));

        if ($processItem->update($id, $input)) {
            $updatedItem = $processItem->getById($id);
            error_log("Process item updated. ID: $id");
            Response::success($updatedItem, 'Process item updated successfully');
        } else {
            Response::error('Failed to update process item', 500);
        }
    }
    elseif ($method === 'DELETE') {
        // Delete process item
        $input = json_decode(file_get_contents('php://input'), true);
        if (empty($input)) {
            parse_str(file_get_contents('php://input'), $input);
        }
        if (empty($input) && isset($_GET['id'])) {
            $input = ['id' => $_GET['id']];
        }

        if (!isset($input['id'])) {
            Response::error('Process item ID is required', 400);
        }

        $id = (int)$input['id'];
        if ($processItem->delete($id)) {
            Response::success(null, 'Process item deleted successfully');
        } else {
            Response::error('Failed to delete process item', 500);
        }
    }
    else {
        Response::error('Method not allowed', 405);
    }
} catch (Exception $e) {
    error_log("Process Items Manager API Error: " . $e->getMessage());
    Response::error('An error occurred: ' . $e->getMessage(), 500);
}




