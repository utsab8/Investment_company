<?php
/**
 * Initialize Default Settings
 * Creates all default website settings if they don't exist
 */

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../utils/Cors.php';
require_once __DIR__ . '/../../utils/Response.php';
require_once __DIR__ . '/../../utils/Auth.php';
require_once __DIR__ . '/../../models/WebsiteSettings.php';

// Handle CORS
Cors::handle();

header('Content-Type: application/json');
session_start();

Auth::requireAuth();

$settings = new WebsiteSettings();

try {
    // Create content_sections table if it doesn't exist
    require_once __DIR__ . '/../../config/database.php';
    $database = new Database();
    $conn = $database->getConnection();
    
    $createContentTable = "CREATE TABLE IF NOT EXISTS content_sections (
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    
    $conn->exec($createContentTable);
    
    // Create website_settings table if it doesn't exist
    $createSettingsTable = "CREATE TABLE IF NOT EXISTS website_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(100) NOT NULL UNIQUE,
        setting_value TEXT,
        setting_type VARCHAR(20) DEFAULT 'text',
        category VARCHAR(50) DEFAULT 'general',
        description VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_setting_key (setting_key),
        INDEX idx_category (category)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    
    $conn->exec($createSettingsTable);
    
    $defaultSettings = [
        // General Settings
        ['company_name', 'MRB International', 'text', 'general', 'Company Name'],
        ['company_tagline', 'Premium Wealth Management', 'text', 'general', 'Company Tagline'],
        ['company_logo', '', 'image', 'general', 'Company Logo'],
        ['company_favicon', '', 'image', 'general', 'Favicon'],
        
        // Contact Settings
        ['company_email', 'info@mrb-international.com', 'text', 'contact', 'Company Email'],
        ['company_phone', '+1 (555) 123-4567', 'text', 'contact', 'Company Phone'],
        ['company_address', '123 Wall Street, New York, NY 10005', 'textarea', 'contact', 'Company Address'],
        ['company_website', 'https://www.mrb-international.com', 'text', 'contact', 'Company Website'],
        
        // Social Media
        ['company_facebook', '', 'text', 'social', 'Facebook URL'],
        ['company_twitter', '', 'text', 'social', 'Twitter URL'],
        ['company_linkedin', '', 'text', 'social', 'LinkedIn URL'],
        ['company_instagram', '', 'text', 'social', 'Instagram URL'],
        ['company_youtube', '', 'text', 'social', 'YouTube URL'],
        
        // Homepage Settings
        ['homepage_hero_title', 'Welcome to MRB International', 'text', 'homepage', 'Homepage Hero Title'],
        ['homepage_hero_subtitle', 'Your Trusted Partner in Wealth Management', 'text', 'homepage', 'Homepage Hero Subtitle'],
        ['homepage_hero_text', 'We help you grow your wealth through strategic investments and expert financial planning.', 'textarea', 'homepage', 'Homepage Hero Description'],
        ['homepage_hero_image', '', 'image', 'homepage', 'Homepage Hero Image'],
        ['homepage_about_title', 'Leading The Way In Investment Excellence', 'text', 'homepage', 'Homepage About Section Title'],
        ['homepage_about_text', 'MRB International is a leading investment company dedicated to helping clients achieve their financial goals through strategic wealth management and innovative investment solutions.', 'textarea', 'homepage', 'Homepage About Section Text'],
        
        // Footer Settings
        ['footer_copyright', '© 2024 MRB International. All rights reserved.', 'text', 'footer', 'Footer Copyright Text'],
        ['footer_description', 'MRB International is your trusted partner in wealth management and investment solutions.', 'textarea', 'footer', 'Footer Description'],
        
        // SEO Settings
        ['meta_title', 'MRB International - Premium Wealth Management', 'text', 'seo', 'Meta Title'],
        ['meta_description', 'MRB International offers premium wealth management and investment solutions to help you achieve your financial goals.', 'textarea', 'seo', 'Meta Description'],
        ['meta_keywords', 'investment, wealth management, financial planning, mutual funds', 'text', 'seo', 'Meta Keywords'],
    ];
    
    $created = 0;
    $updated = 0;
    
    foreach ($defaultSettings as $setting) {
        list($key, $value, $type, $category, $description) = $setting;
        
        // Check if setting exists
        $existing = $settings->getSetting($key);
        
        if (!$existing) {
            // Create new setting
            $settings->setSetting($key, $value, $type, $category);
            $created++;
        } else {
            // Update description if needed
            $updated++;
        }
    }
    
    // Initialize default content sections
    $defaultContent = [
        ['about_intro', 'About Introduction', 'MRB International is a leading investment company dedicated to helping clients achieve their financial goals through strategic wealth management and innovative investment solutions.', 'about', 1],
        ['services_overview', 'Services Overview', 'We offer comprehensive investment solutions tailored to your needs.', 'services', 1],
        ['process_intro', 'Process Introduction', 'Our investment process is designed to maximize returns while minimizing risk.', 'process', 1],
    ];
    
    $contentCreated = 0;
    foreach ($defaultContent as $content) {
        list($key, $name, $text, $page, $order) = $content;
        $existing = $settings->getContentSection($key);
        if (!$existing) {
            $settings->updateContentSection($key, $text, $page, $name);
            $contentCreated++;
        }
    }
    
    Response::success([
        'tables_created' => 'content_sections, website_settings',
        'settings_created' => $created,
        'settings_existing' => $updated,
        'content_sections_created' => $contentCreated,
        'message' => 'Settings initialized successfully'
    ], 'Settings initialized');
    
} catch (Exception $e) {
    error_log("Init Settings Error: " . $e->getMessage());
    Response::error('Error initializing settings: ' . $e->getMessage(), 500);
}

