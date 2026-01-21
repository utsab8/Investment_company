<?php
/**
 * Services Manager API - Admin CRUD operations
 */

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../utils/Cors.php';
require_once __DIR__ . '/../../utils/Response.php';
require_once __DIR__ . '/../../utils/Auth.php';
require_once __DIR__ . '/../../models/Service.php';

// Handle CORS
Cors::handle();

header('Content-Type: application/json');
session_start();

Auth::requireAuth();

$service = new Service();

try {
    $method = $_SERVER['REQUEST_METHOD'];
    
    if ($method === 'GET') {
        // Get all services for admin
        $services = $service->getAllForAdmin();
        Response::success($services, 'Services retrieved successfully');
    }
    elseif ($method === 'POST') {
        // Create new service
        $input = json_decode(file_get_contents('php://input'), true);
        if (empty($input)) {
            $input = $_POST;
        }

        // Debug logging
        error_log("Creating new service");
        error_log("Create data: " . json_encode($input));
        error_log("Image URL in input: " . (isset($input['image_url']) ? $input['image_url'] : 'NOT SET'));

        $id = $service->create($input);
        if ($id) {
            $newService = $service->getById($id);
            error_log("Service created. ID: $id, image_url: " . (isset($newService['image_url']) ? $newService['image_url'] : 'NULL'));
            Response::success($newService, 'Service created successfully');
        } else {
            Response::error('Failed to create service', 500);
        }
    }
    elseif ($method === 'PUT') {
        // Update service
        $input = json_decode(file_get_contents('php://input'), true);
        if (empty($input)) {
            $input = $_POST;
        }

        if (!isset($input['id'])) {
            Response::error('Service ID is required', 400);
        }

        $id = (int)$input['id'];
        unset($input['id']); // Remove id from update data

        // Debug logging
        error_log("Updating service ID: $id");
        error_log("Update data: " . json_encode($input));
        error_log("Image URL in input: " . (isset($input['image_url']) ? $input['image_url'] : 'NOT SET'));

        if ($service->update($id, $input)) {
            $updatedService = $service->getById($id);
            error_log("Service updated. New image_url: " . (isset($updatedService['image_url']) ? $updatedService['image_url'] : 'NULL'));
            Response::success($updatedService, 'Service updated successfully');
        } else {
            Response::error('Failed to update service', 500);
        }
    }
    elseif ($method === 'DELETE') {
        // Delete service
        $input = json_decode(file_get_contents('php://input'), true);
        if (empty($input)) {
            parse_str(file_get_contents('php://input'), $input);
        }
        if (empty($input) && isset($_GET['id'])) {
            $input = ['id' => $_GET['id']];
        }

        if (!isset($input['id'])) {
            Response::error('Service ID is required', 400);
        }

        $id = (int)$input['id'];
        if ($service->delete($id)) {
            Response::success(null, 'Service deleted successfully');
        } else {
            Response::error('Failed to delete service', 500);
        }
    }
    else {
        Response::error('Method not allowed', 405);
    }
} catch (Exception $e) {
    error_log("Services Manager API Error: " . $e->getMessage());
    Response::error('An error occurred: ' . $e->getMessage(), 500);
}

