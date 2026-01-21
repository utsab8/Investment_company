<?php
/**
 * Website Settings Model
 * Manages all website settings and dynamic content
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';

class WebsiteSettings {
    private $conn;
    private $settingsTable = 'website_settings';
    private $contentTable = 'content_sections';
    private $mediaTable = 'media';

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
        $this->ensureTablesExist();
    }

    /**
     * Ensure required tables exist, create if they don't
     */
    private function ensureTablesExist() {
        try {
            // Check if content_sections table exists
            $checkContent = $this->conn->query("SHOW TABLES LIKE 'content_sections'");
            if ($checkContent->rowCount() == 0) {
                $this->createContentSectionsTable();
            }
            
            // Check if website_settings table exists
            $checkSettings = $this->conn->query("SHOW TABLES LIKE 'website_settings'");
            if ($checkSettings->rowCount() == 0) {
                $this->createWebsiteSettingsTable();
            }
        } catch (Exception $e) {
            error_log("Error ensuring tables exist: " . $e->getMessage());
        }
    }

    /**
     * Create content_sections table
     */
    private function createContentSectionsTable() {
        $query = "CREATE TABLE IF NOT EXISTS content_sections (
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
        
        $this->conn->exec($query);
    }

    /**
     * Create website_settings table
     */
    private function createWebsiteSettingsTable() {
        $query = "CREATE TABLE IF NOT EXISTS website_settings (
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
        
        $this->conn->exec($query);
    }

    /**
     * Get all settings
     * @param string $category Optional category filter
     * @return array
     */
    public function getAllSettings($category = null) {
        $query = "SELECT * FROM " . $this->settingsTable;
        if ($category) {
            $query .= " WHERE category = :category";
        }
        $query .= " ORDER BY category, setting_key";

        $stmt = $this->conn->prepare($query);
        if ($category) {
            $stmt->bindParam(':category', $category);
        }
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Get setting by key
     * @param string $key
     * @return array|false
     */
    public function getSetting($key) {
        $query = "SELECT * FROM " . $this->settingsTable . " WHERE setting_key = :key LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':key', $key);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Update setting
     * @param string $key
     * @param string $value
     * @return bool
     */
    public function updateSetting($key, $value) {
        // Use INSERT ... ON DUPLICATE KEY UPDATE to handle both insert and update
        // This ensures the setting is created if it doesn't exist
        $query = "INSERT INTO " . $this->settingsTable . " 
                  (setting_key, setting_value, updated_at) 
                  VALUES (:key, :value, NOW())
                  ON DUPLICATE KEY UPDATE 
                  setting_value = :value_update, 
                  updated_at = NOW()";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':key', $key);
        $stmt->bindParam(':value', $value);
        $stmt->bindParam(':value_update', $value);
        $result = $stmt->execute();
        
        // Log for debugging
        if (!$result) {
            error_log("Failed to update setting: $key. Error: " . implode(', ', $stmt->errorInfo()));
        }
        
        return $result;
    }

    /**
     * Create or update setting
     * @param string $key
     * @param string $value
     * @param string $type
     * @param string $category
     * @return bool
     */
    public function setSetting($key, $value, $type = 'text', $category = 'general') {
        $query = "INSERT INTO " . $this->settingsTable . " 
                  (setting_key, setting_value, setting_type, category) 
                  VALUES (:key, :value, :type, :category)
                  ON DUPLICATE KEY UPDATE 
                  setting_value = :value_update, 
                  setting_type = :type_update,
                  category = :category_update,
                  updated_at = NOW()";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':key', $key);
        $stmt->bindParam(':value', $value);
        $stmt->bindParam(':type', $type);
        $stmt->bindParam(':category', $category);
        $stmt->bindParam(':value_update', $value);
        $stmt->bindParam(':type_update', $type);
        $stmt->bindParam(':category_update', $category);
        return $stmt->execute();
    }

    /**
     * Get all content sections
     * @param string $page Optional page filter
     * @return array
     */
    public function getContentSections($page = null) {
        $query = "SELECT * FROM " . $this->contentTable . " WHERE is_active = 1";
        if ($page) {
            $query .= " AND page = :page";
        }
        $query .= " ORDER BY page, display_order";

        $stmt = $this->conn->prepare($query);
        if ($page) {
            $stmt->bindParam(':page', $page);
        }
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Get content section by key
     * @param string $key
     * @return array|false
     */
    public function getContentSection($key) {
        $query = "SELECT * FROM " . $this->contentTable . " WHERE section_key = :key LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':key', $key);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Update or create content section
     * @param string $key
     * @param string $content
     * @param string $page
     * @param string $sectionName
     * @return bool
     */
    public function updateContentSection($key, $content, $page = 'home', $sectionName = null) {
        // Check if section exists
        $existing = $this->getContentSection($key);
        
        if ($existing) {
            // Update existing
            $query = "UPDATE " . $this->contentTable . " 
                      SET content = :content, updated_at = NOW() 
                      WHERE section_key = :key";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':key', $key);
            $stmt->bindParam(':content', $content);
            return $stmt->execute();
        } else {
            // Create new section
            $name = $sectionName ?: ucfirst(str_replace('_', ' ', $key));
            $query = "INSERT INTO " . $this->contentTable . " 
                      (section_key, section_name, content, page, is_active) 
                      VALUES (:key, :name, :content, :page, 1)
                      ON DUPLICATE KEY UPDATE 
                      content = :content_update, updated_at = NOW()";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':key', $key);
            $stmt->bindParam(':name', $name);
            $stmt->bindParam(':content', $content);
            $stmt->bindParam(':page', $page);
            $stmt->bindParam(':content_update', $content);
            return $stmt->execute();
        }
    }

    /**
     * Save media file info
     * @param array $fileData
     * @return int|false Media ID
     */
    public function saveMedia($fileData) {
        try {
            // Check if media table exists
            $checkTable = $this->conn->query("SHOW TABLES LIKE 'media'");
            if ($checkTable->rowCount() == 0) {
                error_log("Media table does not exist. Creating it...");
                $this->createMediaTable();
            }
            
            $query = "INSERT INTO " . $this->mediaTable . " 
                      (filename, original_filename, file_path, file_type, file_size, mime_type, alt_text, category, uploaded_by) 
                      VALUES (:filename, :original, :path, :type, :size, :mime, :alt, :category, :user)";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':filename', $fileData['filename']);
            $stmt->bindParam(':original', $fileData['original_filename']);
            $stmt->bindParam(':path', $fileData['file_path']);
            $stmt->bindParam(':type', $fileData['file_type']);
            $stmt->bindParam(':size', $fileData['file_size'], PDO::PARAM_INT);
            $stmt->bindParam(':mime', $fileData['mime_type']);
            $stmt->bindParam(':alt', $fileData['alt_text']);
            $stmt->bindParam(':category', $fileData['category']);
            $stmt->bindParam(':user', $fileData['uploaded_by'], PDO::PARAM_INT);

            if ($stmt->execute()) {
                return $this->conn->lastInsertId();
            }
            return false;
        } catch (PDOException $e) {
            error_log("saveMedia PDO Error: " . $e->getMessage());
            throw $e; // Re-throw to be caught by upload.php
        }
    }
    
    /**
     * Create media table if it doesn't exist
     */
    private function createMediaTable() {
        $query = "CREATE TABLE IF NOT EXISTS media (
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
        
        $this->conn->exec($query);
    }

    /**
     * Get all media
     * @param string $category Optional category filter
     * @return array
     */
    public function getAllMedia($category = null) {
        $query = "SELECT * FROM " . $this->mediaTable;
        if ($category) {
            $query .= " WHERE category = :category";
        }
        $query .= " ORDER BY created_at DESC";

        $stmt = $this->conn->prepare($query);
        if ($category) {
            $stmt->bindParam(':category', $category);
        }
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Delete media
     * @param int $mediaId
     * @return bool
     */
    public function deleteMedia($mediaId) {
        // Get file path first
        $query = "SELECT file_path FROM " . $this->mediaTable . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $mediaId);
        $stmt->execute();
        $media = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($media && file_exists($media['file_path'])) {
            unlink($media['file_path']);
        }

        $query = "DELETE FROM " . $this->mediaTable . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $mediaId);
        return $stmt->execute();
    }
}

