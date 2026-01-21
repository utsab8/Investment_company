<?php
/**
 * Report Model
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';

class Report {
    private $conn;
    private $table = 'reports';

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    /**
     * Get all public reports
     * @param array $filters
     * @return array
     */
    public function getAll($filters = []) {
        $query = "SELECT * FROM " . $this->table . " WHERE is_public = 1";
        $params = [];

        if (isset($filters['report_type'])) {
            $query .= " AND report_type = :report_type";
            $params[':report_type'] = $filters['report_type'];
        }

        if (isset($filters['year'])) {
            $query .= " AND year = :year";
            $params[':year'] = $filters['year'];
        }

        $query .= " ORDER BY year DESC, quarter DESC, created_at DESC";

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
     * Increment download count
     * @param int $id
     * @return bool
     */
    public function incrementDownload($id) {
        $query = "UPDATE " . $this->table . " 
                  SET download_count = download_count + 1 
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }

    /**
     * Get report by ID
     * @param int $id
     * @return array|false
     */
    public function getById($id) {
        $query = "SELECT * FROM " . $this->table . " 
                  WHERE id = :id AND is_public = 1 
                  LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Get all reports (including non-public) for admin
     * @return array
     */
    public function getAllForAdmin() {
        $query = "SELECT * FROM " . $this->table . " ORDER BY year DESC, quarter DESC, created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Get report by ID for admin (including non-public)
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
     * Create a new report
     * @param array $data
     * @return int|false Report ID on success, false on failure
     */
    public function create($data) {
        $query = "INSERT INTO " . $this->table . " 
                  (title, description, report_type, file_url, file_size, year, quarter, is_public) 
                  VALUES 
                  (:title, :description, :report_type, :file_url, :file_size, :year, :quarter, :is_public)";

        $stmt = $this->conn->prepare($query);
        
        $stmt->bindValue(':title', $data['title'] ?? '');
        $stmt->bindValue(':description', $data['description'] ?? null);
        $stmt->bindValue(':report_type', $data['report_type'] ?? '');
        $stmt->bindValue(':file_url', $data['file_url'] ?? null);
        $stmt->bindValue(':file_size', $data['file_size'] ?? null, PDO::PARAM_INT);
        $stmt->bindValue(':year', $data['year'] ?? date('Y'), PDO::PARAM_INT);
        $stmt->bindValue(':quarter', $data['quarter'] ?? null, PDO::PARAM_INT);
        $stmt->bindValue(':is_public', $data['is_public'] ?? true, PDO::PARAM_BOOL);

        if ($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        return false;
    }

    /**
     * Update a report
     * @param int $id
     * @param array $data
     * @return bool
     */
    public function update($id, $data) {
        $query = "UPDATE " . $this->table . " SET 
                  title = :title,
                  description = :description,
                  report_type = :report_type,
                  file_url = :file_url,
                  file_size = :file_size,
                  year = :year,
                  quarter = :quarter,
                  is_public = :is_public
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->bindValue(':title', $data['title'] ?? '');
        $stmt->bindValue(':description', $data['description'] ?? null);
        $stmt->bindValue(':report_type', $data['report_type'] ?? '');
        $stmt->bindValue(':file_url', $data['file_url'] ?? null);
        $stmt->bindValue(':file_size', $data['file_size'] ?? null, PDO::PARAM_INT);
        $stmt->bindValue(':year', $data['year'] ?? date('Y'), PDO::PARAM_INT);
        $stmt->bindValue(':quarter', $data['quarter'] ?? null, PDO::PARAM_INT);
        $stmt->bindValue(':is_public', $data['is_public'] ?? true, PDO::PARAM_BOOL);

        return $stmt->execute();
    }

    /**
     * Delete a report (hard delete - permanently remove from database)
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

