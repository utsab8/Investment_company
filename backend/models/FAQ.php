<?php
/**
 * FAQ Model
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';

class FAQ {
    private $conn;
    private $table = 'faqs';

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    /**
     * Get all active FAQs
     * @param array $filters
     * @return array
     */
    public function getAll($filters = []) {
        $query = "SELECT * FROM " . $this->table . " WHERE is_active = 1";
        $params = [];

        if (isset($filters['category'])) {
            $query .= " AND category = :category";
            $params[':category'] = $filters['category'];
        }

        $query .= " ORDER BY display_order ASC, created_at ASC";

        if (isset($filters['limit'])) {
            $query .= " LIMIT :limit";
            $params[':limit'] = (int)$filters['limit'];
        }

        $stmt = $this->conn->prepare($query);
        
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }

        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Get FAQ by ID
     * @param int $id
     * @return array|false
     */
    public function getById($id) {
        $query = "SELECT * FROM " . $this->table . " 
                  WHERE id = :id AND is_active = 1 
                  LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Get all FAQs (including inactive) for admin
     * @return array
     */
    public function getAllForAdmin() {
        $query = "SELECT * FROM " . $this->table . " ORDER BY display_order ASC, created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Get FAQ by ID for admin (including inactive)
     * @param int $id
     * @return array|false
     */
    public function getByIdForAdmin($id) {
        $query = "SELECT * FROM " . $this->table . " WHERE id = :id LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Create a new FAQ
     * @param array $data
     * @return int|false FAQ ID on success, false on failure
     */
    public function create($data) {
        $query = "INSERT INTO " . $this->table . " 
                  (question, answer, category, display_order, is_active) 
                  VALUES 
                  (:question, :answer, :category, :display_order, :is_active)";

        $stmt = $this->conn->prepare($query);
        
        $stmt->bindValue(':question', $data['question'] ?? '');
        $stmt->bindValue(':answer', $data['answer'] ?? '');
        $stmt->bindValue(':category', $data['category'] ?? null);
        $stmt->bindValue(':display_order', $data['display_order'] ?? 0, PDO::PARAM_INT);
        $stmt->bindValue(':is_active', $data['is_active'] ?? true, PDO::PARAM_BOOL);

        if ($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        return false;
    }

    /**
     * Update a FAQ
     * @param int $id
     * @param array $data
     * @return bool
     */
    public function update($id, $data) {
        $query = "UPDATE " . $this->table . " SET 
                  question = :question,
                  answer = :answer,
                  category = :category,
                  display_order = :display_order,
                  is_active = :is_active
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->bindValue(':question', $data['question'] ?? '');
        $stmt->bindValue(':answer', $data['answer'] ?? '');
        $stmt->bindValue(':category', $data['category'] ?? null);
        $stmt->bindValue(':display_order', $data['display_order'] ?? 0, PDO::PARAM_INT);
        $stmt->bindValue(':is_active', $data['is_active'] ?? true, PDO::PARAM_BOOL);

        return $stmt->execute();
    }

    /**
     * Delete a FAQ (hard delete - permanently remove from database)
     * @param int $id
     * @return bool
     */
    public function delete($id) {
        $query = "DELETE FROM " . $this->table . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }
}

