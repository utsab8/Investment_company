-- Admin Panel Database Schema
-- Add these tables to MRB_INTERNATIONAL database

USE MRB_INTERNATIONAL;

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Website Settings Table (Company Info, Logo, etc.)
CREATE TABLE IF NOT EXISTS website_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    setting_type ENUM('text', 'textarea', 'image', 'number', 'boolean', 'json') DEFAULT 'text',
    category VARCHAR(50) DEFAULT 'general',
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_key (setting_key),
    INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dynamic Content Sections (Homepage, About, etc.)
CREATE TABLE IF NOT EXISTS content_sections (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Media/Images Table
CREATE TABLE IF NOT EXISTS media (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size INT NOT NULL,
    mime_type VARCHAR(100),
    alt_text VARCHAR(255),
    description TEXT,
    category VARCHAR(50) DEFAULT 'general',
    uploaded_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_uploaded_by (uploaded_by),
    FOREIGN KEY (uploaded_by) REFERENCES admin_users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Admin Sessions Table
CREATE TABLE IF NOT EXISTS admin_sessions (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Default Admin User
-- Default password: admin123 (CHANGE THIS AFTER FIRST LOGIN!)
-- Username: admin
-- Password: admin123
INSERT INTO admin_users (username, email, password, full_name, role) VALUES
('admin', 'admin@mrb-international.com', '$2y$12$UnF3mR8wD.jmkll4GZemveqBVdNInVG6/vu.QignsHPcofXv6yiza', 'Administrator', 'super_admin')
ON DUPLICATE KEY UPDATE username=username;

-- Insert Default Website Settings
INSERT INTO website_settings (setting_key, setting_value, setting_type, category, description) VALUES
('company_name', 'MRB International', 'text', 'general', 'Company Name'),
('company_tagline', 'Premium Wealth Management', 'text', 'general', 'Company Tagline'),
('company_logo', '', 'image', 'general', 'Company Logo'),
('company_favicon', '', 'image', 'general', 'Favicon'),
('company_email', 'info@mrb-international.com', 'text', 'contact', 'Company Email'),
('company_phone', '+1 (555) 123-4567', 'text', 'contact', 'Company Phone'),
('company_address', '123 Wall Street, New York, NY 10005', 'text', 'contact', 'Company Address'),
('company_facebook', '', 'text', 'social', 'Facebook URL'),
('company_twitter', '', 'text', 'social', 'Twitter URL'),
('company_linkedin', '', 'text', 'social', 'LinkedIn URL'),
('company_instagram', '', 'text', 'social', 'Instagram URL'),
('homepage_hero_title', 'Welcome to MRB International', 'text', 'homepage', 'Homepage Hero Title'),
('homepage_hero_subtitle', 'Your Trusted Partner in Wealth Management', 'text', 'homepage', 'Homepage Hero Subtitle'),
('homepage_hero_image', '', 'image', 'homepage', 'Homepage Hero Image'),
('footer_copyright', '© 2024 MRB International. All rights reserved.', 'text', 'footer', 'Footer Copyright Text')
ON DUPLICATE KEY UPDATE setting_key=setting_key;

-- Insert Default Content Sections
INSERT INTO content_sections (section_key, section_name, content, page, display_order) VALUES
('about_intro', 'About Introduction', 'MRB International is a leading investment company dedicated to helping clients achieve their financial goals through strategic wealth management and innovative investment solutions.', 'about', 1),
('services_intro', 'Services Introduction', 'We offer a comprehensive range of investment services tailored to meet your unique financial needs.', 'services', 1),
('homepage_features', 'Homepage Features', '{"features": [{"title": "Expert Advisors", "description": "Our team of experienced financial advisors", "icon": "fa-users"}, {"title": "Secure Investments", "description": "Your investments are safe with us", "icon": "fa-shield-alt"}, {"title": "High Returns", "description": "Competitive returns on investments", "icon": "fa-chart-line"}]}', 'home', 1)
ON DUPLICATE KEY UPDATE section_key=section_key;

