<?php
/**
 * Public Projects API
 * Returns only active projects for public website
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../utils/Cors.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../models/Project.php';

// Handle CORS
Cors::handle();

header('Content-Type: application/json');

$project = new Project();

try {
    if (isset($_GET['stats']) && $_GET['stats'] == '1') {
        // Get project statistics
        $statistics = $project->getStatistics();
        Response::success($statistics, 'Statistics retrieved successfully');
    } elseif (isset($_GET['id'])) {
        // Get single project by ID
        $id = (int)$_GET['id'];
        $projectData = $project->getById($id);
        
        if ($projectData) {
            Response::success($projectData, 'Project retrieved successfully');
        } else {
            Response::error('Project not found', 404);
        }
    } else {
        // Get all active projects with optional filters
        $filters = [];
        
        if (isset($_GET['category'])) {
            $filters['category'] = $_GET['category'];
        }
        
        if (isset($_GET['year'])) {
            $filters['year'] = (int)$_GET['year'];
        }
        
        if (isset($_GET['featured']) && $_GET['featured'] == '1') {
            $filters['featured'] = true;
        }
        
        if (isset($_GET['limit'])) {
            $filters['limit'] = (int)$_GET['limit'];
        }
        
        $projects = $project->getAll($filters);
        
        // Log for debugging
        error_log("Public Projects API: Retrieved " . count($projects) . " active projects");
        if (count($projects) > 0) {
            error_log("First project: " . json_encode($projects[0]));
        }
        
        Response::success($projects, 'Projects retrieved successfully');
    }
} catch (Exception $e) {
    error_log("Public Projects API Error: " . $e->getMessage());
    Response::error('An error occurred: ' . $e->getMessage(), 500);
}
