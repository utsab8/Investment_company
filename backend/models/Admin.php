<?php
/**
 * Admin Model
 * Handles admin authentication and management
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';

class Admin {
    private $conn;
    private $table = 'admin_users';

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    /**
     * Authenticate admin user
     * @param string $username
     * @param string $password
     * @return array|false
     */
    public function login($username, $password) {
        $query = "SELECT * FROM " . $this->table . " 
                  WHERE (username = :username OR email = :email) 
                  AND is_active = 1 
                  LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':email', $username); // Use same value for both
        $stmt->execute();

        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password'])) {
            // Remove password from response
            unset($user['password']);
            
            // Update last login (wrap in try-catch to not fail login if this fails)
            try {
                $this->updateLastLogin($user['id']);
            } catch (Exception $e) {
                // Log but don't fail login
                error_log("Update last login error: " . $e->getMessage());
            }
            
            return $user;
        }

        return false;
    }

    /**
     * Create session token
     * @param int $userId
     * @return string
     */
    public function createSession($userId) {
        $token = bin2hex(random_bytes(32));
        $expiresAt = date('Y-m-d H:i:s', strtotime('+24 hours'));
        $ipAddress = $_SERVER['REMOTE_ADDR'] ?? '';
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';

        $query = "INSERT INTO admin_sessions (user_id, session_token, ip_address, user_agent, expires_at) 
                  VALUES (:user_id, :token, :ip_address, :user_agent, :expires_at)";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        $stmt->bindParam(':token', $token);
        $stmt->bindParam(':ip_address', $ipAddress);
        $stmt->bindParam(':user_agent', $userAgent);
        $stmt->bindParam(':expires_at', $expiresAt);
        $stmt->execute();

        return $token;
    }

    /**
     * Validate session token
     * @param string $token
     * @return array|false
     */
    public function validateSession($token) {
        $query = "SELECT s.*, u.id, u.username, u.email, u.full_name, u.role 
                  FROM admin_sessions s
                  INNER JOIN admin_users u ON s.user_id = u.id
                  WHERE s.session_token = :token 
                  AND s.expires_at > NOW() 
                  AND u.is_active = 1
                  LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':token', $token);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Delete session
     * @param string $token
     * @return bool
     */
    public function deleteSession($token) {
        $query = "DELETE FROM admin_sessions WHERE session_token = :token";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':token', $token);
        return $stmt->execute();
    }

    /**
     * Update last login
     * @param int $userId
     * @return bool
     */
    private function updateLastLogin($userId) {
        $query = "UPDATE " . $this->table . " SET last_login = NOW() WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $userId);
        return $stmt->execute();
    }

    /**
     * Get all admin users
     * @return array
     */
    public function getAll() {
        $query = "SELECT id, username, email, full_name, role, is_active, last_login, created_at 
                  FROM " . $this->table . " 
                  ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Change password
     * @param int $userId
     * @param string $oldPassword
     * @param string $newPassword
     * @return array
     */
    public function changePassword($userId, $oldPassword, $newPassword) {
        // Verify old password
        $query = "SELECT password FROM " . $this->table . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $userId);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user || !password_verify($oldPassword, $user['password'])) {
            return ['success' => false, 'message' => 'Current password is incorrect'];
        }

        // Update password
        $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
        $query = "UPDATE " . $this->table . " SET password = :password WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':password', $hashedPassword);
        $stmt->bindParam(':id', $userId);
        
        if ($stmt->execute()) {
            return ['success' => true, 'message' => 'Password changed successfully'];
        }

        return ['success' => false, 'message' => 'Failed to change password'];
    }
}

