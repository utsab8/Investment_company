<?php
/**
 * Projects Manager API - Admin CRUD operations
 */

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../utils/Cors.php';
require_once __DIR__ . '/../../utils/Response.php';
require_once __DIR__ . '/../../utils/Auth.php';
require_once __DIR__ . '/../../models/Project.php';

// Handle CORS
Cors::handle();

header('Content-Type: application/json');
session_start();

Auth::requireAuth();

$project = new Project();

try {
    $method = $_SERVER['REQUEST_METHOD'];
    
    if ($method === 'GET') {
        // Get all projects for admin
        $projects = $project->getAllForAdmin();
        Response::success($projects, 'Projects retrieved successfully');
    }
    elseif ($method === 'POST') {
        // Create new project
        $input = json_decode(file_get_contents('php://input'), true);
        if (empty($input)) {
            $input = $_POST;
        }

        $id = $project->create($input);
        if ($id) {
            $newProject = $project->getByIdForAdmin($id);
            Response::success($newProject, 'Project created successfully');
        } else {
            Response::error('Failed to create project', 500);
        }
    }
    elseif ($method === 'PUT') {
        // Update project
        $input = json_decode(file_get_contents('php://input'), true);
        if (empty($input)) {
            $input = $_POST;
        }

        if (!isset($input['id'])) {
            Response::error('Project ID is required', 400);
        }

        $id = (int)$input['id'];
        unset($input['id']); // Remove id from update data

        if ($project->update($id, $input)) {
            $updatedProject = $project->getByIdForAdmin($id);
            Response::success($updatedProject, 'Project updated successfully');
        } else {
            Response::error('Failed to update project', 500);
        }
    }
    elseif ($method === 'DELETE') {
        // Delete project (hard delete - permanently remove)
        $input = json_decode(file_get_contents('php://input'), true);
        if (empty($input)) {
            parse_str(file_get_contents('php://input'), $input);
        }
        if (empty($input) && isset($_GET['id'])) {
            $input = ['id' => $_GET['id']];
        }

        if (!isset($input['id'])) {
            Response::error('Project ID is required', 400);
        }

        $id = (int)$input['id'];
        
        // Verify project exists before deleting
        $existingProject = $project->getByIdForAdmin($id);
        if (!$existingProject) {
            Response::error('Project not found', 404);
        }

        if ($project->delete($id)) {
            Response::success(null, 'Project deleted successfully');
        } else {
            Response::error('Failed to delete project. Please try again.', 500);
        }
    }
    else {
        Response::error('Method not allowed', 405);
    }
} catch (Exception $e) {
    error_log("Projects Manager API Error: " . $e->getMessage());
    Response::error('An error occurred: ' . $e->getMessage(), 500);
}

