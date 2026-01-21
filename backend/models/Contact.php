<?php
/**
 * Contact Model
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/Validation.php';

class Contact {
    private $conn;
    private $table = 'contacts';

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    /**
     * Create a new contact message
     * @param array $data
     * @return array|false
     */
    public function create($data) {
        // Validate required fields
        $required = ['name', 'email', 'subject', 'message'];
        $errors = Validation::validateRequired($data, $required);
        
        if (!empty($errors)) {
            return ['success' => false, 'errors' => $errors];
        }

        // Validate email
        if (!Validation::validateEmail($data['email'])) {
            return ['success' => false, 'errors' => ['email' => 'Invalid email format']];
        }

        // Sanitize data
        $data = Validation::sanitizeArray($data);

        $query = "INSERT INTO " . $this->table . " 
                  (name, email, subject, message, status) 
                  VALUES (:name, :email, :subject, :message, 'new')";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':email', $data['email']);
        $stmt->bindParam(':subject', $data['subject']);
        $stmt->bindParam(':message', $data['message']);

        if ($stmt->execute()) {
            return [
                'success' => true,
                'id' => $this->conn->lastInsertId(),
                'message' => 'Contact message submitted successfully'
            ];
        }

        return ['success' => false, 'message' => 'Failed to submit contact message'];
    }

    /**
     * Get all contacts (admin function)
     * @param array $filters
     * @return array
     */
    public function getAll($filters = []) {
        $query = "SELECT * FROM " . $this->table . " WHERE 1=1";
        $params = [];

        if (isset($filters['status'])) {
            $query .= " AND status = :status";
            $params[':status'] = $filters['status'];
        }

        if (isset($filters['limit'])) {
            $query .= " LIMIT :limit";
            $params[':limit'] = (int)$filters['limit'];
        }

        $query .= " ORDER BY created_at DESC";

        $stmt = $this->conn->prepare($query);
        
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }

        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}

