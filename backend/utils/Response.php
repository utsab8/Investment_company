<?php
/**
 * Response Utility Class
 * Handles API responses in a consistent format
 */

class Response {
    /**
     * Send success response
     * @param mixed $data
     * @param string $message
     * @param int $statusCode
     */
    public static function success($data = null, $message = 'Success', $statusCode = 200) {
        self::send([
            'success' => true,
            'message' => $message,
            'data' => $data,
            'timestamp' => date('Y-m-d H:i:s')
        ], $statusCode);
    }

    /**
     * Send error response
     * @param string $message
     * @param int $statusCode
     * @param array $errors
     */
    public static function error($message = 'An error occurred', $statusCode = 400, $errors = []) {
        self::send([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
            'timestamp' => date('Y-m-d H:i:s')
        ], $statusCode);
    }

    /**
     * Send JSON response
     * @param array $data
     * @param int $statusCode
     */
    private static function send($data, $statusCode = 200) {
        // Set CORS headers (use Cors utility if available, otherwise fallback)
        if (class_exists('Cors')) {
            Cors::handle();
        } else {
            self::setCorsHeaders();
        }
        
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        exit;
    }

    /**
     * Set CORS headers (fallback if Cors class not available)
     */
    private static function setCorsHeaders() {
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        
        if (in_array($origin, ALLOWED_ORIGINS)) {
            header("Access-Control-Allow-Origin: $origin");
        } else {
            header("Access-Control-Allow-Origin: *");
        }
        
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 3600');

        // Handle preflight requests
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit;
        }
    }
}

