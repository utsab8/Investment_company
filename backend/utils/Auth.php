<?php
/**
 * Authentication Utility
 * Handles admin session management
 */

require_once __DIR__ . '/../models/Admin.php';

class Auth {
    /**
     * Get current admin user from session
     * @return array|false
     */
    public static function getAdmin() {
        // Check if session is already started
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        // Check if admin user is in session (simpler approach - using PHP sessions)
        if (isset($_SESSION['admin_user']) && is_array($_SESSION['admin_user'])) {
            return $_SESSION['admin_user'];
        }
        
        // Fallback: check token and validate (for database sessions)
        if (isset($_SESSION['admin_token'])) {
            try {
                $admin = new Admin();
                $session = $admin->validateSession($_SESSION['admin_token']);
                
                if ($session) {
                    $user = [
                        'id' => $session['id'],
                        'username' => $session['username'],
                        'email' => $session['email'],
                        'full_name' => $session['full_name'],
                        'role' => $session['role']
                    ];
                    // Store in session for faster access
                    $_SESSION['admin_user'] = $user;
                    return $user;
                } else {
                    unset($_SESSION['admin_token']);
                    return false;
                }
            } catch (Exception $e) {
                // If validation fails, just use session data
                error_log("Session validation error: " . $e->getMessage());
                return false;
            }
        }

        return false;
    }

    /**
     * Check if admin is authenticated
     * @return bool
     */
    public static function check() {
        return self::getAdmin() !== false;
    }

    /**
     * Require authentication (redirect if not logged in)
     */
    public static function requireAuth() {
        if (!self::check()) {
            http_response_code(401);
            header('Content-Type: application/json');
            echo json_encode([
                'success' => false,
                'message' => 'Authentication required',
                'redirect' => '/admin/login'
            ]);
            exit;
        }
    }

    /**
     * Get admin token from request
     * @return string|null
     */
    public static function getToken() {
        // Check session first
        session_start();
        if (isset($_SESSION['admin_token'])) {
            return $_SESSION['admin_token'];
        }

        // Check Authorization header
        $headers = getallheaders();
        if (isset($headers['Authorization'])) {
            $auth = $headers['Authorization'];
            if (preg_match('/Bearer\s+(.*)$/i', $auth, $matches)) {
                return $matches[1];
            }
        }

        // Check token in request
        if (isset($_GET['token'])) {
            return $_GET['token'];
        }

        if (isset($_POST['token'])) {
            return $_POST['token'];
        }

        $input = json_decode(file_get_contents('php://input'), true);
        if (isset($input['token'])) {
            return $input['token'];
        }

        return null;
    }
}

