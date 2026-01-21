<?php
/**
 * Contact Messages Management API
 */

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../utils/Cors.php';
require_once __DIR__ . '/../../utils/Response.php';
require_once __DIR__ . '/../../utils/Auth.php';
require_once __DIR__ . '/../../models/Contact.php';

// Handle CORS
Cors::handle();

header('Content-Type: application/json');
session_start();

Auth::requireAuth();

$contact = new Contact();

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Get all contacts with filters
        $filters = [];
        if (isset($_GET['status'])) {
            $filters['status'] = $_GET['status'];
        }
        if (isset($_GET['limit'])) {
            $filters['limit'] = (int)$_GET['limit'];
        }

        $contacts = $contact->getAll($filters);
        Response::success($contacts, 'Contacts retrieved successfully');
    }
    elseif ($_SERVER['REQUEST_METHOD'] === 'PUT' || $_SERVER['REQUEST_METHOD'] === 'PATCH') {
        // Update contact status
        $input = json_decode(file_get_contents('php://input'), true);
        $contactId = $input['id'] ?? $_GET['id'] ?? null;
        $status = $input['status'] ?? null;

        if (!$contactId || !$status) {
            Response::error('Contact ID and status are required', 400);
        }

        // Update status in database
        require_once __DIR__ . '/../../config/database.php';
        $database = new Database();
        $conn = $database->getConnection();
        
        $query = "UPDATE contacts SET status = :status, updated_at = NOW() WHERE id = :id";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':id', $contactId);
        
        if ($stmt->execute()) {
            Response::success(null, 'Contact status updated successfully');
        } else {
            Response::error('Failed to update contact status', 500);
        }
    }
    elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        // Delete contact
        $input = json_decode(file_get_contents('php://input'), true);
        if (empty($input) && isset($_GET['id'])) {
            $input = ['id' => $_GET['id']];
        }
        if (empty($input) && isset($_POST['id'])) {
            $input = ['id' => $_POST['id']];
        }
        
        $contactId = $input['id'] ?? null;
        
        if (!$contactId) {
            Response::error('Contact ID is required', 400);
        }

        require_once __DIR__ . '/../../config/database.php';
        $database = new Database();
        $conn = $database->getConnection();
        
        $query = "DELETE FROM contacts WHERE id = :id";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':id', $contactId, PDO::PARAM_INT);
        
        if ($stmt->execute()) {
            Response::success(null, 'Contact deleted successfully');
        } else {
            Response::error('Failed to delete contact', 500);
        }
    } else {
        Response::error('Method not allowed', 405);
    }
} catch (Exception $e) {
    error_log("Contacts Admin API Error: " . $e->getMessage());
    Response::error('An error occurred', 500);
}

