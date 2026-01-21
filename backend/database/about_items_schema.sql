-- About Items Table (for Awards, Certificates, Team Members, etc.)
CREATE TABLE IF NOT EXISTS about_items (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;




