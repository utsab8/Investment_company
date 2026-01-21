<?php
/**
 * Contact API Endpoint
 * Handles contact form submissions
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../utils/Cors.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../models/Contact.php';

// Handle CORS
Cors::handle();

header('Content-Type: application/json');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('Method not allowed', 405);
}

// Get JSON input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Fallback to form data if JSON is not available
if (empty($data)) {
    $data = $_POST;
}

if (empty($data)) {
    Response::error('No data provided', 400);
}

try {
    $contact = new Contact();
    $result = $contact->create($data);

    if ($result['success']) {
        Response::success($result, 'Contact message submitted successfully', 201);
    } else {
        Response::error($result['message'] ?? 'Failed to submit contact message', 400, $result['errors'] ?? []);
    }
} catch (Exception $e) {
    error_log("Contact API Error: " . $e->getMessage());
    Response::error('An error occurred while processing your request', 500);
}

