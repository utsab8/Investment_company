-- COMPLETE DATABASE SETUP FOR MRB INTERNATIONAL
-- Run this file to set up everything at once
-- Database: MRB_INTERNATIONAL

CREATE DATABASE IF NOT EXISTS MRB_INTERNATIONAL CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE MRB_INTERNATIONAL;

-- ============================================
-- EXISTING TABLES (from schema.sql)
-- ============================================

-- Contact Messages Table
CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('new', 'read', 'replied', 'archived') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Investment Plans Table
CREATE TABLE IF NOT EXISTS plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    min_investment DECIMAL(15, 2) NOT NULL,
    expected_returns_min DECIMAL(5, 2) NOT NULL,
    expected_returns_max DECIMAL(5, 2) NOT NULL,
    lock_in_period_years INT NOT NULL,
    risk_level ENUM('low', 'moderate', 'high') NOT NULL,
    support_level VARCHAR(50) NOT NULL,
    is_popular BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_is_active (is_active),
    INDEX idx_is_popular (is_popular)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    client VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(500),
    pdf_url VARCHAR(500),
    amount_managed DECIMAL(15, 2),
    roi_percentage DECIMAL(5, 2),
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_year (year),
    INDEX idx_is_active (is_active),
    INDEX idx_is_featured (is_featured)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Reports Table
CREATE TABLE IF NOT EXISTS reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    report_type VARCHAR(50) NOT NULL,
    file_url VARCHAR(500),
    file_size INT,
    year INT NOT NULL,
    quarter INT,
    is_public BOOLEAN DEFAULT TRUE,
    download_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_report_type (report_type),
    INDEX idx_year (year),
    INDEX idx_is_public (is_public)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- FAQ Table
CREATE TABLE IF NOT EXISTS faqs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_is_active (is_active),
    INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Services Table
CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_is_active (is_active),
    INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ADMIN PANEL TABLES
-- ============================================

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

-- Website Settings Table
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

-- Dynamic Content Sections
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

-- ============================================
-- INSERT DEFAULT DATA
-- ============================================

-- Default Admin User (username: admin, password: admin123)
INSERT INTO admin_users (username, email, password, full_name, role) VALUES
('admin', 'admin@mrb-international.com', '$2y$12$UnF3mR8wD.jmkll4GZemveqBVdNInVG6/vu.QignsHPcofXv6yiza', 'Administrator', 'super_admin')
ON DUPLICATE KEY UPDATE username=username;

-- Default Website Settings
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

-- Sample Plans
INSERT INTO plans (name, slug, description, min_investment, expected_returns_min, expected_returns_max, lock_in_period_years, risk_level, support_level, is_popular) VALUES
('Starter', 'starter', 'Perfect for beginners looking to start their investment journey', 500.00, 6.00, 8.00, 1, 'low', 'Standard Support', FALSE),
('Growth', 'growth', 'Ideal for intermediate investors seeking balanced growth', 5000.00, 10.00, 14.00, 3, 'moderate', 'Priority Support', TRUE),
('Wealth', 'wealth', 'Designed for high net worth individuals seeking maximum returns', 50000.00, 15.00, 20.00, 5, 'high', 'Dedicated Advisor', FALSE)
ON DUPLICATE KEY UPDATE name=name;

-- Sample Projects
INSERT INTO projects (title, client, category, year, description, image_url, amount_managed, roi_percentage, is_featured) VALUES
('TechStart Capital Investment', 'TechStart Inc.', 'Venture Capital', 2024, 'Successfully managed a $50M venture capital fund for early-stage technology startups, achieving 35% ROI in the first year.', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 50000000.00, 35.00, TRUE),
('Green Energy Portfolio Management', 'EcoPower Solutions', 'Sustainable Investment', 2024, 'Developed and managed a $75M renewable energy investment portfolio, focusing on solar and wind energy projects.', 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 75000000.00, 28.00, TRUE),
('Real Estate Development Fund', 'Metro Developers Group', 'Real Estate', 2023, 'Managed a $100M real estate development fund, delivering 22% annual returns through strategic property acquisitions.', 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 100000000.00, 22.00, FALSE)
ON DUPLICATE KEY UPDATE title=title;

-- Sample FAQs
INSERT INTO faqs (question, answer, category, display_order) VALUES
('What is the minimum investment amount?', 'Our Starter plan requires a minimum investment of $500. We also offer Growth ($5,000) and Wealth ($50,000) plans for different investment levels.', 'Investment', 1),
('How long is the lock-in period?', 'Lock-in periods vary by plan: Starter (1 year), Growth (3 years), and Wealth (5 years).', 'Investment', 2),
('What are the expected returns?', 'Expected returns range from 6-8% for Starter, 10-14% for Growth, and 15-20% for Wealth plans, depending on market conditions.', 'Returns', 3),
('How do I get started?', 'You can contact us through our contact form, call our office, or schedule a consultation with one of our investment advisors.', 'General', 4),
('What makes MRB International different?', 'We offer personalized investment strategies, transparent reporting, and dedicated support to help you achieve your financial goals.', 'General', 5)
ON DUPLICATE KEY UPDATE question=question;

-- Content Sections
INSERT INTO content_sections (section_key, section_name, content, page, display_order) VALUES
('about_intro', 'About Introduction', 'MRB International is a leading investment company dedicated to helping clients achieve their financial goals through strategic wealth management and innovative investment solutions.', 'about', 1),
('services_intro', 'Services Introduction', 'We offer a comprehensive range of investment services tailored to meet your unique financial needs.', 'services', 1)
ON DUPLICATE KEY UPDATE section_key=section_key;

