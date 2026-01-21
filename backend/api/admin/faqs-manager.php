<?php
/**
 * FAQs Manager API - Admin CRUD operations
 */

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../utils/Cors.php';
require_once __DIR__ . '/../../utils/Response.php';
require_once __DIR__ . '/../../utils/Auth.php';
require_once __DIR__ . '/../../models/FAQ.php';

// Handle CORS
Cors::handle();

header('Content-Type: application/json');
session_start();

Auth::requireAuth();

$faq = new FAQ();

try {
    $method = $_SERVER['REQUEST_METHOD'];
    
    if ($method === 'GET') {
        // Get all FAQs for admin
        $faqs = $faq->getAllForAdmin();
        Response::success($faqs, 'FAQs retrieved successfully');
    }
    elseif ($method === 'POST') {
        // Create new FAQ
        $input = json_decode(file_get_contents('php://input'), true);
        if (empty($input)) {
            $input = $_POST;
        }

        $id = $faq->create($input);
        if ($id) {
            $newFaq = $faq->getByIdForAdmin($id);
            Response::success($newFaq, 'FAQ created successfully');
        } else {
            Response::error('Failed to create FAQ', 500);
        }
    }
    elseif ($method === 'PUT') {
        // Update FAQ
        $input = json_decode(file_get_contents('php://input'), true);
        if (empty($input)) {
            $input = $_POST;
        }

        if (!isset($input['id'])) {
            Response::error('FAQ ID is required', 400);
        }

        $id = (int)$input['id'];
        unset($input['id']); // Remove id from update data

        if ($faq->update($id, $input)) {
            $updatedFaq = $faq->getByIdForAdmin($id);
            Response::success($updatedFaq, 'FAQ updated successfully');
        } else {
            Response::error('Failed to update FAQ', 500);
        }
    }
    elseif ($method === 'DELETE') {
        // Delete FAQ (hard delete - permanently remove)
        $input = json_decode(file_get_contents('php://input'), true);
        if (empty($input) && isset($_GET['id'])) {
            $input = ['id' => $_GET['id']];
        }
        if (empty($input) && isset($_POST['id'])) {
            $input = ['id' => $_POST['id']];
        }

        if (!isset($input['id'])) {
            Response::error('FAQ ID is required', 400);
        }

        $id = (int)$input['id'];
        
        // Verify FAQ exists before deleting
        $existingFaq = $faq->getByIdForAdmin($id);
        if (!$existingFaq) {
            Response::error('FAQ not found', 404);
        }

        if ($faq->delete($id)) {
            Response::success(null, 'FAQ deleted successfully');
        } else {
            Response::error('Failed to delete FAQ. Please try again.', 500);
        }
    }
    else {
        Response::error('Method not allowed', 405);
    }
} catch (Exception $e) {
    error_log("FAQs Manager API Error: " . $e->getMessage());
    Response::error('An error occurred: ' . $e->getMessage(), 500);
}




