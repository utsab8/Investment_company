<?php
/**
 * About Item Model (Awards, Certificates, Team Members, Timeline)
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';

class AboutItem {
    private $conn;
    private $table = 'about_items';

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
        $this->ensureTableExists();
    }

    /**
     * Ensure table exists
     */
    private function ensureTableExists() {
        try {
            $query = "CREATE TABLE IF NOT EXISTS " . $this->table . " (
                id INT AUTO_INCREMENT PRIMARY KEY,
                item_type ENUM('award', 'certificate', 'team_member', 'timeline') NOT NULL,
                title VARCHAR(200) NOT NULL,
                subtitle VARCHAR(200),
                description TEXT,
                image_url VARCHAR(500),
                icon VARCHAR(100),
                year INT,
                organization VARCHAR(200),
                position VARCHAR(200),
                display_order INT DEFAULT 0,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_item_type (item_type),
                INDEX idx_is_active (is_active),
                INDEX idx_display_order (display_order)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
            $this->conn->exec($query);
        } catch (PDOException $e) {
            error_log("AboutItem table creation error: " . $e->getMessage());
        }
    }

    /**
     * Get all active items by type
     * @param string|null $type
     * @return array
     */
    public function getAll($type = null) {
        $query = "SELECT * FROM " . $this->table . " WHERE is_active = 1";
        if ($type) {
            $query .= " AND item_type = :type";
        }
        $query .= " ORDER BY display_order ASC, year DESC, created_at DESC";
        
        $stmt = $this->conn->prepare($query);
        if ($type) {
            $stmt->bindValue(':type', $type);
        }
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Get item by ID
     * @param int $id
     * @return array|false
     */
    public function getById($id) {
        $query = "SELECT * FROM " . $this->table . " WHERE id = :id LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Create a new item
     * @param array $data
     * @return int|false Item ID on success, false on failure
     */
    public function create($data) {
        $query = "INSERT INTO " . $this->table . " 
                  (item_type, title, subtitle, description, image_url, icon, year, organization, position, display_order, is_active) 
                  VALUES 
                  (:item_type, :title, :subtitle, :description, :image_url, :icon, :year, :organization, :position, :display_order, :is_active)";

        $stmt = $this->conn->prepare($query);
        
        $stmt->bindValue(':item_type', $data['item_type'] ?? 'award');
        $stmt->bindValue(':title', $data['title'] ?? '');
        $stmt->bindValue(':subtitle', $data['subtitle'] ?? null);
        $stmt->bindValue(':description', $data['description'] ?? null);
        $stmt->bindValue(':image_url', $data['image_url'] ?? null);
        $stmt->bindValue(':icon', $data['icon'] ?? null);
        $stmt->bindValue(':year', $data['year'] ?? null);
        $stmt->bindValue(':organization', $data['organization'] ?? null);
        $stmt->bindValue(':position', $data['position'] ?? null);
        $stmt->bindValue(':display_order', $data['display_order'] ?? 0, PDO::PARAM_INT);
        $stmt->bindValue(':is_active', $data['is_active'] ?? true, PDO::PARAM_BOOL);

        if ($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        return false;
    }

    /**
     * Update an item
     * @param int $id
     * @param array $data
     * @return bool
     */
    public function update($id, $data) {
        $query = "UPDATE " . $this->table . " SET 
                  item_type = :item_type,
                  title = :title,
                  subtitle = :subtitle,
                  description = :description,
                  image_url = :image_url,
                  icon = :icon,
                  year = :year,
                  organization = :organization,
                  position = :position,
                  display_order = :display_order,
                  is_active = :is_active
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->bindValue(':item_type', $data['item_type'] ?? 'award');
        $stmt->bindValue(':title', $data['title'] ?? '');
        $stmt->bindValue(':subtitle', $data['subtitle'] ?? null);
        $stmt->bindValue(':description', $data['description'] ?? null);
        $stmt->bindValue(':image_url', $data['image_url'] ?? null);
        $stmt->bindValue(':icon', $data['icon'] ?? null);
        $stmt->bindValue(':year', $data['year'] ?? null);
        $stmt->bindValue(':organization', $data['organization'] ?? null);
        $stmt->bindValue(':position', $data['position'] ?? null);
        $stmt->bindValue(':display_order', $data['display_order'] ?? 0, PDO::PARAM_INT);
        $stmt->bindValue(':is_active', $data['is_active'] ?? true, PDO::PARAM_BOOL);

        return $stmt->execute();
    }

    /**
     * Delete an item (soft delete)
     * @param int $id
     * @return bool
     */
    public function delete($id) {
        $query = "UPDATE " . $this->table . " SET is_active = 0 WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }

    /**
     * Get all items for admin
     * @param string|null $type
     * @return array
     */
    public function getAllForAdmin($type = null) {
        $query = "SELECT * FROM " . $this->table;
        if ($type) {
            $query .= " WHERE item_type = :type";
        }
        $query .= " ORDER BY item_type ASC, display_order ASC, year DESC, created_at DESC";
        
        $stmt = $this->conn->prepare($query);
        if ($type) {
            $stmt->bindValue(':type', $type);
        }
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}




