<?php
/**
 * Admin Setup Script
 * Creates admin tables and default admin user
 */

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../utils/Cors.php';
require_once __DIR__ . '/../../utils/Response.php';
require_once __DIR__ . '/../../config/database.php';

// Handle CORS
Cors::handle();

header('Content-Type: application/json');

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    if (!$conn) {
        Response::error('Database connection failed', 500);
    }
    
    $results = [];
    
    // Create admin_users table
    $createAdminUsers = "CREATE TABLE IF NOT EXISTS admin_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(100),
        role ENUM('super_admin', 'admin', 'editor') DEFAULT 'admin',
        is_active BOOLEAN DEFAULT TRUE,
        last_login TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_username (username),
        INDEX idx_email (email),
        INDEX idx_is_active (is_active)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    
    $conn->exec($createAdminUsers);
    $results['admin_users_table'] = 'Created or already exists';
    
    // Create admin_sessions table
    $createSessions = "CREATE TABLE IF NOT EXISTS admin_sessions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        session_token VARCHAR(255) NOT NULL UNIQUE,
        ip_address VARCHAR(45),
        user_agent TEXT,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id),
        INDEX idx_token (session_token),
        INDEX idx_expires_at (expires_at),
        FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    
    $conn->exec($createSessions);
    $results['admin_sessions_table'] = 'Created or already exists';
    
    // Create content_sections table
    $createContentTable = "CREATE TABLE IF NOT EXISTS content_sections (
        id INT AUTO_INCREMENT PRIMARY KEY,
        section_key VARCHAR(100) NOT NULL UNIQUE,
        section_name VARCHAR(200) NOT NULL,
        content TEXT,
        page VARCHAR(50) DEFAULT 'home',
        display_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_section_key (section_key),
        INDEX idx_page (page),
        INDEX idx_is_active (is_active)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    
    $conn->exec($createContentTable);
    $results['content_sections_table'] = 'Created or already exists';
    
    // Create website_settings table
    $createSettingsTable = "CREATE TABLE IF NOT EXISTS website_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(100) NOT NULL UNIQUE,
        setting_value TEXT,
        setting_type VARCHAR(20) DEFAULT 'text',
        category VARCHAR(50) DEFAULT 'general',
        description VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_setting_key (setting_key),
        INDEX idx_category (category)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    
    $conn->exec($createSettingsTable);
    $results['website_settings_table'] = 'Created or already exists';
    
    // Create media table
    $createMediaTable = "CREATE TABLE IF NOT EXISTS media (
        id INT AUTO_INCREMENT PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        original_filename VARCHAR(255) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        file_type VARCHAR(20),
        file_size INT,
        mime_type VARCHAR(100),
        alt_text VARCHAR(255),
        category VARCHAR(50) DEFAULT 'general',
        uploaded_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_category (category),
        INDEX idx_uploaded_by (uploaded_by),
        INDEX idx_created_at (created_at),
        FOREIGN KEY (uploaded_by) REFERENCES admin_users(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    
    $conn->exec($createMediaTable);
    $results['media_table'] = 'Created or already exists';
    
    // Check if admin user exists
    $stmt = $conn->query("SELECT COUNT(*) as count FROM admin_users WHERE username = 'admin'");
    $adminExists = $stmt->fetch(PDO::FETCH_ASSOC)['count'] > 0;
    
    if (!$adminExists) {
        // Create default admin user
        // Password: admin123
        $hashedPassword = password_hash('admin123', PASSWORD_DEFAULT);
        $insertAdmin = "INSERT INTO admin_users (username, email, password, full_name, role) 
                       VALUES ('admin', 'admin@mrb-international.com', :password, 'Administrator', 'super_admin')";
        
        $stmt = $conn->prepare($insertAdmin);
        $stmt->bindParam(':password', $hashedPassword);
        $stmt->execute();
        $results['admin_user'] = 'Created with username: admin, password: admin123';
    } else {
        $results['admin_user'] = 'Already exists';
    }
    
    // Verify admin user
    $stmt = $conn->query("SELECT id, username, email, full_name, role, is_active FROM admin_users WHERE username = 'admin'");
    $adminUser = $stmt->fetch(PDO::FETCH_ASSOC);
    $results['admin_info'] = $adminUser;
    
    Response::success($results, 'Admin setup completed successfully');
    
} catch (PDOException $e) {
    error_log("Setup PDO Error: " . $e->getMessage());
    Response::error('Database error: ' . $e->getMessage(), 500);
} catch (Exception $e) {
    error_log("Setup Error: " . $e->getMessage());
    Response::error('Setup error: ' . $e->getMessage(), 500);
}

