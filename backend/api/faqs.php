<?php
/**
 * FAQs API Endpoint
 * Returns frequently asked questions
 */

header('Content-Type: application/json');

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../models/FAQ.php';

try {
    $faq = new FAQ();
    
    // Get filters from query parameters
    $filters = [];
    if (isset($_GET['category'])) {
        $filters['category'] = $_GET['category'];
    }
    if (isset($_GET['limit'])) {
        $filters['limit'] = (int)$_GET['limit'];
    }

    // Get specific FAQ by ID
    if (isset($_GET['id'])) {
        $faqData = $faq->getById($_GET['id']);
        if ($faqData) {
            Response::success($faqData, 'FAQ retrieved successfully');
        } else {
            Response::error('FAQ not found', 404);
        }
    }
    // Get all FAQs
    else {
        $faqs = $faq->getAll($filters);
        Response::success($faqs, 'FAQs retrieved successfully');
    }
} catch (Exception $e) {
    error_log("FAQs API Error: " . $e->getMessage());
    Response::error('An error occurred while retrieving FAQs', 500);
}

