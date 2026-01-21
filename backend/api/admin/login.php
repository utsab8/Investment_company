<?php
/**
 * Admin Login API
 */

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../utils/Cors.php';
require_once __DIR__ . '/../../utils/Response.php';
require_once __DIR__ . '/../../models/Admin.php';

// Handle CORS
Cors::handle();

header('Content-Type: application/json');
session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('Method not allowed', 405);
}

$input = json_decode(file_get_contents('php://input'), true);
if (empty($input)) {
    $input = $_POST;
}

if (empty($input['username']) || empty($input['password'])) {
    Response::error('Username and password are required', 400);
}

try {
    // Check if database connection works
    $database = new Database();
    $conn = $database->getConnection();
    
    if (!$conn) {
        Response::error('Database connection failed', 500);
    }
    
    // Check if admin_users table exists
    $stmt = $conn->query("SHOW TABLES LIKE 'admin_users'");
    if ($stmt->rowCount() === 0) {
        Response::error('Admin users table not found. Please run admin_schema.sql to create the tables.', 500);
    }
    
    try {
        $admin = new Admin();
    } catch (Exception $adminError) {
        error_log("Admin class instantiation error: " . $adminError->getMessage());
        Response::error('Failed to initialize admin: ' . $adminError->getMessage(), 500);
    }
    
    try {
        $user = $admin->login($input['username'], $input['password']);
    } catch (Exception $loginError) {
        error_log("Login method error: " . $loginError->getMessage());
        error_log("Stack trace: " . $loginError->getTraceAsString());
        Response::error('Login method error: ' . $loginError->getMessage(), 500);
    }

    if ($user) {
        // Create session token - use PHP sessions only (simpler and more reliable)
        $token = bin2hex(random_bytes(32));
        $_SESSION['admin_token'] = $token;
        $_SESSION['admin_user'] = $user;
        $_SESSION['admin_id'] = $user['id'];

        Response::success([
            'user' => $user,
            'token' => $token
        ], 'Login successful');
    } else {
        Response::error('Invalid username or password', 401);
    }
} catch (PDOException $e) {
    error_log("Login PDO Error: " . $e->getMessage());
    Response::error('Database error: ' . $e->getMessage(), 500);
} catch (Exception $e) {
    error_log("Login Error: " . $e->getMessage());
    error_log("Stack trace: " . $e->getTraceAsString());
    Response::error('An error occurred during login: ' . $e->getMessage(), 500);
}

