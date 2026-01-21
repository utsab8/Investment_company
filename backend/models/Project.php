<?php
/**
 * Project Model
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';

class Project {
    private $conn;
    private $table = 'projects';

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    /**
     * Get all active projects
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

        if (isset($filters['year'])) {
            $query .= " AND year = :year";
            $params[':year'] = $filters['year'];
        }

        if (isset($filters['featured'])) {
            $query .= " AND is_featured = 1";
        }

        $query .= " ORDER BY year DESC, created_at DESC";

        if (isset($filters['limit'])) {
            $query .= " LIMIT :limit";
            $params[':limit'] = (int)$filters['limit'];
        }

        $stmt = $this->conn->prepare($query);
        
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }

        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Log for debugging
        error_log("Project::getAll() - Query: " . $query);
        error_log("Project::getAll() - Found " . count($results) . " active projects");
        if (count($results) > 0) {
            error_log("Project::getAll() - First project ID: " . $results[0]['id'] . ", Title: " . $results[0]['title']);
        }
        
        return $results;
    }

    /**
     * Get project by ID
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
     * Get project statistics
     * @return array
     */
    public function getStatistics() {
        $query = "SELECT 
                    COUNT(*) as total_projects,
                    SUM(amount_managed) as total_assets,
                    AVG(roi_percentage) as average_roi
                  FROM " . $this->table . " 
                  WHERE is_active = 1";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Create a new project
     * @param array $data
     * @return int|false Project ID on success, false on failure
     */
    public function create($data) {
        $query = "INSERT INTO " . $this->table . " 
                  (title, client, category, year, description, image_url, pdf_url, amount_managed, roi_percentage, is_featured, is_active) 
                  VALUES 
                  (:title, :client, :category, :year, :description, :image_url, :pdf_url, :amount_managed, :roi_percentage, :is_featured, :is_active)";

        $stmt = $this->conn->prepare($query);
        
        $stmt->bindValue(':title', $data['title'] ?? '');
        $stmt->bindValue(':client', $data['client'] ?? '');
        $stmt->bindValue(':category', $data['category'] ?? '');
        $stmt->bindValue(':year', $data['year'] ?? date('Y'));
        $stmt->bindValue(':description', $data['description'] ?? '');
        $stmt->bindValue(':image_url', $data['image_url'] ?? null);
        $stmt->bindValue(':pdf_url', $data['pdf_url'] ?? null);
        $stmt->bindValue(':amount_managed', $data['amount_managed'] ?? null);
        $stmt->bindValue(':roi_percentage', $data['roi_percentage'] ?? null);
        $stmt->bindValue(':is_featured', $data['is_featured'] ?? false, PDO::PARAM_BOOL);
        $stmt->bindValue(':is_active', $data['is_active'] ?? true, PDO::PARAM_BOOL);

        if ($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        return false;
    }

    /**
     * Update a project
     * @param int $id
     * @param array $data
     * @return bool
     */
    public function update($id, $data) {
        $query = "UPDATE " . $this->table . " SET 
                  title = :title,
                  client = :client,
                  category = :category,
                  year = :year,
                  description = :description,
                  image_url = :image_url,
                  pdf_url = :pdf_url,
                  amount_managed = :amount_managed,
                  roi_percentage = :roi_percentage,
                  is_featured = :is_featured,
                  is_active = :is_active
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->bindValue(':title', $data['title'] ?? '');
        $stmt->bindValue(':client', $data['client'] ?? '');
        $stmt->bindValue(':category', $data['category'] ?? '');
        $stmt->bindValue(':year', $data['year'] ?? date('Y'));
        $stmt->bindValue(':description', $data['description'] ?? '');
        $stmt->bindValue(':image_url', $data['image_url'] ?? null);
        $stmt->bindValue(':pdf_url', $data['pdf_url'] ?? null);
        $stmt->bindValue(':amount_managed', $data['amount_managed'] ?? null);
        $stmt->bindValue(':roi_percentage', $data['roi_percentage'] ?? null);
        $stmt->bindValue(':is_featured', $data['is_featured'] ?? false, PDO::PARAM_BOOL);
        $stmt->bindValue(':is_active', $data['is_active'] ?? true, PDO::PARAM_BOOL);

        return $stmt->execute();
    }

    /**
     * Delete a project (hard delete - permanently remove from database)
     * @param int $id
     * @return bool
     */
    public function delete($id) {
        $query = "DELETE FROM " . $this->table . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }

    /**
     * Get all projects (including inactive) for admin
     * @return array
     */
    public function getAllForAdmin() {
        $query = "SELECT * FROM " . $this->table . " ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Get project by ID for admin (including inactive)
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
}

