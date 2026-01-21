<?php
/**
 * Process Item Model (Process Steps, Risk Management Items)
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';

class ProcessItem {
    private $conn;
    private $table = 'process_items';

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
                item_type ENUM('step', 'risk_management') NOT NULL,
                title VARCHAR(200) NOT NULL,
                subtitle VARCHAR(200),
                description TEXT,
                image_url VARCHAR(500),
                icon VARCHAR(100),
                step_number INT,
                display_order INT DEFAULT 0,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_item_type (item_type),
                INDEX idx_is_active (is_active),
                INDEX idx_display_order (display_order),
                INDEX idx_step_number (step_number)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
            $this->conn->exec($query);
        } catch (PDOException $e) {
            error_log("ProcessItem table creation error: " . $e->getMessage());
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
        $query .= " ORDER BY display_order ASC, step_number ASC, created_at DESC";
        
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
     * Get all items for admin (including inactive)
     * @param string|null $type
     * @return array
     */
    public function getAllForAdmin($type = null) {
        $query = "SELECT * FROM " . $this->table;
        if ($type) {
            $query .= " WHERE item_type = :type";
        }
        $query .= " ORDER BY display_order ASC, step_number ASC, created_at DESC";
        
        $stmt = $this->conn->prepare($query);
        if ($type) {
            $stmt->bindValue(':type', $type);
        }
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Create a new process item
     * @param array $data
     * @return int|false Item ID on success, false on failure
     */
    public function create($data) {
        $query = "INSERT INTO " . $this->table . " 
                  (item_type, title, subtitle, description, image_url, icon, step_number, display_order, is_active) 
                  VALUES 
                  (:item_type, :title, :subtitle, :description, :image_url, :icon, :step_number, :display_order, :is_active)";

        $stmt = $this->conn->prepare($query);
        
        $stmt->bindValue(':item_type', $data['item_type'] ?? 'step');
        $stmt->bindValue(':title', $data['title'] ?? '');
        $stmt->bindValue(':subtitle', $data['subtitle'] ?? null);
        $stmt->bindValue(':description', $data['description'] ?? null);
        $stmt->bindValue(':image_url', $data['image_url'] ?? null);
        $stmt->bindValue(':icon', $data['icon'] ?? null);
        $stmt->bindValue(':step_number', isset($data['step_number']) ? (int)$data['step_number'] : null, PDO::PARAM_INT);
        $stmt->bindValue(':display_order', isset($data['display_order']) ? (int)$data['display_order'] : 0, PDO::PARAM_INT);
        $stmt->bindValue(':is_active', $data['is_active'] ?? true, PDO::PARAM_BOOL);

        if ($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        return false;
    }

    /**
     * Update a process item
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
                  step_number = :step_number,
                  display_order = :display_order,
                  is_active = :is_active
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->bindValue(':item_type', $data['item_type'] ?? 'step');
        $stmt->bindValue(':title', $data['title'] ?? '');
        $stmt->bindValue(':subtitle', $data['subtitle'] ?? null);
        $stmt->bindValue(':description', $data['description'] ?? null);
        $stmt->bindValue(':image_url', $data['image_url'] ?? null);
        $stmt->bindValue(':icon', $data['icon'] ?? null);
        $stmt->bindValue(':step_number', isset($data['step_number']) ? (int)$data['step_number'] : null, PDO::PARAM_INT);
        $stmt->bindValue(':display_order', isset($data['display_order']) ? (int)$data['display_order'] : 0, PDO::PARAM_INT);
        $stmt->bindValue(':is_active', $data['is_active'] ?? true, PDO::PARAM_BOOL);

        return $stmt->execute();
    }

    /**
     * Delete a process item (hard delete)
     * @param int $id
     * @return bool
     */
    public function delete($id) {
        $query = "DELETE FROM " . $this->table . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $result = $stmt->execute();
        error_log("ProcessItem Model - Delete: Item ID $id " . ($result ? "deleted successfully" : "failed to delete"));
        return $result;
    }

    /**
     * Get connection (for column checking if needed)
     */
    public function getConnection() {
        return $this->conn;
    }
}




