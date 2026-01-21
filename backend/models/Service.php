<?php
/**
 * Service Model
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';

class Service {
    private $conn;
    private $table = 'services';

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    /**
     * Get all active services
     * @return array
     */
    public function getAll() {
        $query = "SELECT * FROM " . $this->table . " 
                  WHERE is_active = 1 
                  ORDER BY display_order ASC, created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Get service by ID
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
     * Create a new service
     * @param array $data
     * @return int|false Service ID on success, false on failure
     */
    public function create($data) {
        // Check if image_url column exists, if not, don't include it
        $hasImageUrl = $this->columnExists('image_url');
        
        if ($hasImageUrl) {
            $query = "INSERT INTO " . $this->table . " 
                      (title, slug, description, icon, image_url, is_active, display_order) 
                      VALUES 
                      (:title, :slug, :description, :icon, :image_url, :is_active, :display_order)";
        } else {
            $query = "INSERT INTO " . $this->table . " 
                      (title, slug, description, icon, is_active, display_order) 
                      VALUES 
                      (:title, :slug, :description, :icon, :is_active, :display_order)";
        }

        $stmt = $this->conn->prepare($query);
        
        // Generate unique slug
        if (!empty($data['slug'])) {
            $slug = $this->ensureUniqueSlug($data['slug']);
        } elseif (!empty($data['title'])) {
            $slug = $this->generateSlug($data['title']);
            $slug = $this->ensureUniqueSlug($slug);
        } else {
            // If no title or slug provided, generate a unique slug based on timestamp
            $slug = $this->generateUniqueSlug();
        }
        
        $stmt->bindValue(':title', $data['title'] ?? '');
        $stmt->bindValue(':slug', $slug);
        $stmt->bindValue(':description', $data['description'] ?? '');
        $stmt->bindValue(':icon', $data['icon'] ?? null);
        if ($hasImageUrl) {
            // Handle empty string as null, but preserve valid URLs
            if (isset($data['image_url']) && is_string($data['image_url'])) {
                $imageUrl = trim($data['image_url']);
                $imageUrl = !empty($imageUrl) ? $imageUrl : null;
            } else {
                $imageUrl = isset($data['image_url']) ? $data['image_url'] : null;
            }
            error_log("Service Model - Create: image_url value = " . ($imageUrl !== null ? $imageUrl : 'NULL'));
            error_log("Service Model - Create: image_url type = " . gettype($imageUrl));
            $stmt->bindValue(':image_url', $imageUrl, $imageUrl !== null ? PDO::PARAM_STR : PDO::PARAM_NULL);
        } else {
            error_log("Service Model - Create: image_url column does not exist!");
        }
        $stmt->bindValue(':is_active', $data['is_active'] ?? true, PDO::PARAM_BOOL);
        $stmt->bindValue(':display_order', $data['display_order'] ?? 0, PDO::PARAM_INT);

        error_log("Service Model - Create: About to execute with slug: " . $slug);
        
        if ($stmt->execute()) {
            $id = $this->conn->lastInsertId();
            error_log("Service Model - Create: Service created with ID $id, slug: $slug");
            return $id;
        } else {
            $errorInfo = $stmt->errorInfo();
            error_log("Service Model - Create: Failed to execute query. Error: " . implode(', ', $errorInfo));
            error_log("Service Model - Create: Slug used: " . $slug);
            error_log("Service Model - Create: Data: " . json_encode($data));
        }
        return false;
    }

    /**
     * Update a service
     * @param int $id
     * @param array $data
     * @return bool
     */
    public function update($id, $data) {
        $hasImageUrl = $this->columnExists('image_url');
        
        if ($hasImageUrl) {
            $query = "UPDATE " . $this->table . " SET 
                      title = :title,
                      slug = :slug,
                      description = :description,
                      icon = :icon,
                      image_url = :image_url,
                      is_active = :is_active,
                      display_order = :display_order
                      WHERE id = :id";
        } else {
            $query = "UPDATE " . $this->table . " SET 
                      title = :title,
                      slug = :slug,
                      description = :description,
                      icon = :icon,
                      is_active = :is_active,
                      display_order = :display_order
                      WHERE id = :id";
        }

        $stmt = $this->conn->prepare($query);
        
        // Generate unique slug for update
        if (!empty($data['slug'])) {
            $slug = $this->ensureUniqueSlug($data['slug'], $id);
        } elseif (!empty($data['title'])) {
            $slug = $this->generateSlug($data['title']);
            $slug = $this->ensureUniqueSlug($slug, $id);
        } else {
            // Get existing slug or generate new one
            $existingService = $this->getById($id);
            if ($existingService && !empty($existingService['slug'])) {
                $slug = $existingService['slug'];
            } else {
                $slug = $this->generateUniqueSlug();
            }
        }
        
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->bindValue(':title', $data['title'] ?? '');
        $stmt->bindValue(':slug', $slug);
        $stmt->bindValue(':description', $data['description'] ?? '');
        $stmt->bindValue(':icon', $data['icon'] ?? null);
        if ($hasImageUrl) {
            // Handle empty string as null, but preserve valid URLs
            if (isset($data['image_url']) && is_string($data['image_url'])) {
                $imageUrl = trim($data['image_url']);
                $imageUrl = !empty($imageUrl) ? $imageUrl : null;
            } else {
                $imageUrl = isset($data['image_url']) ? $data['image_url'] : null;
            }
            error_log("Service Model - Update: image_url value = " . ($imageUrl !== null ? $imageUrl : 'NULL'));
            error_log("Service Model - Update: image_url type = " . gettype($imageUrl));
            $stmt->bindValue(':image_url', $imageUrl, $imageUrl !== null ? PDO::PARAM_STR : PDO::PARAM_NULL);
        } else {
            error_log("Service Model - Update: image_url column does not exist!");
        }
        $stmt->bindValue(':is_active', $data['is_active'] ?? true, PDO::PARAM_BOOL);
        $stmt->bindValue(':display_order', $data['display_order'] ?? 0, PDO::PARAM_INT);

        error_log("Service Model - Update: About to execute with slug: " . $slug . " for ID: " . $id);
        
        $result = $stmt->execute();
        if (!$result) {
            $errorInfo = $stmt->errorInfo();
            error_log("Service Model - Update: Failed to execute query. Error: " . implode(', ', $errorInfo));
            error_log("Service Model - Update: Slug used: " . $slug);
            error_log("Service Model - Update: Data: " . json_encode($data));
        } else {
            error_log("Service Model - Update: Query executed successfully for ID $id with slug: $slug");
        }
        return $result;
    }

    /**
     * Check if a column exists in the table
     * @param string $columnName
     * @return bool
     */
    private function columnExists($columnName) {
        try {
            // Use information_schema for more reliable column checking
            $query = "SELECT COUNT(*) as count 
                      FROM information_schema.COLUMNS 
                      WHERE TABLE_SCHEMA = DATABASE() 
                      AND TABLE_NAME = :table 
                      AND COLUMN_NAME = :column";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':table', $this->table);
            $stmt->bindValue(':column', $columnName);
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return $result && $result['count'] > 0;
        } catch (Exception $e) {
            // Fallback to SHOW COLUMNS if information_schema fails
            try {
                $query = "SHOW COLUMNS FROM " . $this->table . " WHERE Field = :column";
                $stmt = $this->conn->prepare($query);
                $stmt->bindValue(':column', $columnName);
                $stmt->execute();
                return $stmt->rowCount() > 0;
            } catch (Exception $e2) {
                error_log("Service Model - columnExists error: " . $e2->getMessage());
                return false;
            }
        }
    }

    /**
     * Delete a service (hard delete - permanently removes from database)
     * @param int $id
     * @return bool
     */
    public function delete($id) {
        $query = "DELETE FROM " . $this->table . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $result = $stmt->execute();
        error_log("Service Model - Delete: Service ID $id " . ($result ? "deleted successfully" : "failed to delete"));
        return $result;
    }

    /**
     * Get all services for admin
     * @return array
     */
    public function getAllForAdmin() {
        $query = "SELECT * FROM " . $this->table . " ORDER BY display_order ASC, created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Generate slug from title
     * @param string $title
     * @return string
     */
    private function generateSlug($title) {
        if (empty(trim($title))) {
            return $this->generateUniqueSlug();
        }
        $slug = strtolower(trim($title));
        $slug = preg_replace('/[^a-z0-9-]/', '-', $slug);
        $slug = preg_replace('/-+/', '-', $slug);
        $slug = trim($slug, '-');
        if (empty($slug)) {
            return $this->generateUniqueSlug();
        }
        return $slug . '-' . time();
    }

    /**
     * Generate a unique slug with timestamp
     * @return string
     */
    private function generateUniqueSlug() {
        return 'service-' . time() . '-' . rand(10000, 99999);
    }

    /**
     * Ensure slug is unique
     * @param string $slug
     * @param int|null $excludeId Service ID to exclude from uniqueness check (for updates)
     * @return string
     */
    private function ensureUniqueSlug($slug, $excludeId = null) {
        // Ensure slug is not empty
        if (empty(trim($slug))) {
            $slug = $this->generateUniqueSlug();
        }

        $originalSlug = trim($slug);
        $counter = 1;
        
        while (true) {
            $query = "SELECT id FROM " . $this->table . " WHERE slug = :slug";
            if ($excludeId) {
                $query .= " AND id != :exclude_id";
            }
            $query .= " LIMIT 1";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':slug', $slug);
            if ($excludeId) {
                $stmt->bindValue(':exclude_id', $excludeId, PDO::PARAM_INT);
            }
            $stmt->execute();
            
            if ($stmt->rowCount() == 0) {
                return $slug; // Slug is unique
            }
            
            // Slug exists, append counter
            $slug = $originalSlug . '-' . $counter;
            $counter++;
            
            // Safety check to prevent infinite loop
            if ($counter > 1000) {
                return $originalSlug . '-' . time() . '-' . rand(1000, 9999);
            }
        }
    }
}

