<?php
/**
 * About Items Manager API - Admin CRUD operations
 */

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../utils/Cors.php';
require_once __DIR__ . '/../../utils/Response.php';
require_once __DIR__ . '/../../utils/Auth.php';
require_once __DIR__ . '/../../models/AboutItem.php';

// Handle CORS
Cors::handle();

header('Content-Type: application/json');
session_start();

Auth::requireAuth();

$aboutItem = new AboutItem();

try {
    $method = $_SERVER['REQUEST_METHOD'];
    
    if ($method === 'GET') {
        // Get all items for admin (optionally filtered by type)
        $type = $_GET['type'] ?? null;
        $items = $aboutItem->getAllForAdmin($type);
        Response::success($items, 'About items retrieved successfully');
    }
    elseif ($method === 'POST') {
        // Create new item
        $input = json_decode(file_get_contents('php://input'), true);
        if (empty($input)) {
            $input = $_POST;
        }

        $id = $aboutItem->create($input);
        if ($id) {
            $newItem = $aboutItem->getById($id);
            Response::success($newItem, 'Item created successfully');
        } else {
            Response::error('Failed to create item', 500);
        }
    }
    elseif ($method === 'PUT') {
        // Update item
        $input = json_decode(file_get_contents('php://input'), true);
        if (empty($input)) {
            $input = $_POST;
        }

        if (!isset($input['id'])) {
            Response::error('Item ID is required', 400);
        }

        $id = (int)$input['id'];
        unset($input['id']); // Remove id from update data

        if ($aboutItem->update($id, $input)) {
            $updatedItem = $aboutItem->getById($id);
            Response::success($updatedItem, 'Item updated successfully');
        } else {
            Response::error('Failed to update item', 500);
        }
    }
    elseif ($method === 'DELETE') {
        // Delete item
        $input = json_decode(file_get_contents('php://input'), true);
        if (empty($input)) {
            parse_str(file_get_contents('php://input'), $input);
        }
        if (empty($input) && isset($_GET['id'])) {
            $input = ['id' => $_GET['id']];
        }

        if (!isset($input['id'])) {
            Response::error('Item ID is required', 400);
        }

        $id = (int)$input['id'];
        if ($aboutItem->delete($id)) {
            Response::success(null, 'Item deleted successfully');
        } else {
            Response::error('Failed to delete item', 500);
        }
    }
    else {
        Response::error('Method not allowed', 405);
    }
} catch (Exception $e) {
    error_log("About Items Manager API Error: " . $e->getMessage());
    Response::error('An error occurred: ' . $e->getMessage(), 500);
}




