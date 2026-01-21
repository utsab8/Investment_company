<?php
/**
 * Comprehensive Page Content Management API
 * Manages all content sections for each page
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
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $page = $_GET['page'] ?? null;
        $action = $_GET['action'] ?? 'list';
        
        if ($action === 'sections') {
            // Get predefined sections for a page
            $sections = getPageSections($page);
            Response::success($sections, 'Page sections retrieved');
        } else {
            // Get all content for a page
            $content = $settings->getContentSections($page);
            
            // Also get page-specific settings
            $pageSettings = [];
            if ($page) {
                $allSettings = $settings->getAllSettings();
                foreach ($allSettings as $setting) {
                    if (strpos($setting['setting_key'], $page . '_') === 0) {
                        $pageSettings[$setting['setting_key']] = $setting['setting_value'];
                    }
                }
            }
            
            Response::success([
                'sections' => $content,
                'settings' => $pageSettings
            ], 'Page content retrieved');
        }
    } 
    elseif ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PUT') {
        $input = json_decode(file_get_contents('php://input'), true);
        if (empty($input)) {
            $input = $_POST;
        }

        if (isset($input['sections']) && is_array($input['sections'])) {
            // Bulk update multiple sections
            $updated = 0;
            foreach ($input['sections'] as $section) {
                if (isset($section['key']) && isset($section['content'])) {
                    $page = $section['page'] ?? $input['page'] ?? 'home';
                    $name = $section['name'] ?? null;
                    $settings->updateContentSection($section['key'], $section['content'], $page, $name);
                    $updated++;
                }
            }
            Response::success(['updated' => $updated], 'Sections updated successfully');
        } 
        elseif (isset($input['key']) && isset($input['content'])) {
            // Single section update
            $page = $input['page'] ?? 'home';
            $sectionName = $input['section_name'] ?? $input['name'] ?? null;
            $result = $settings->updateContentSection($input['key'], $input['content'], $page, $sectionName);
            if ($result) {
                Response::success(null, 'Content updated successfully');
            } else {
                Response::error('Failed to update content', 500);
            }
        } else {
            Response::error('Invalid request data', 400);
        }
    } else {
        Response::error('Method not allowed', 405);
    }
} catch (PDOException $e) {
    error_log("Page Content API PDO Error: " . $e->getMessage());
    Response::error('Database error: ' . $e->getMessage(), 500);
} catch (Exception $e) {
    error_log("Page Content API Error: " . $e->getMessage());
    Response::error('An error occurred: ' . $e->getMessage(), 500);
}

/**
 * Get predefined sections for a page
 */
function getPageSections($page) {
    $allSections = [
        'home' => [
            ['key' => 'hero_title', 'name' => '🏠 Main Page Title (Top of Page)', 'type' => 'text'],
            ['key' => 'hero_subtitle', 'name' => '📝 Main Page Subtitle (Under Title)', 'type' => 'text'],
            ['key' => 'hero_text', 'name' => '📄 Main Page Description (Welcome Text)', 'type' => 'textarea'],
            ['key' => 'hero_image', 'name' => '🖼️ Main Page Background Image', 'type' => 'image'],
            ['key' => 'about_title', 'name' => '📌 About Us Section - Title', 'type' => 'text'],
            ['key' => 'about_text', 'name' => '📄 About Us Section - Description', 'type' => 'textarea'],
            ['key' => 'about_image', 'name' => '🖼️ About Us Section - Image', 'type' => 'image'],
            ['key' => 'why_choose_title', 'name' => '⭐ Why Choose Us - Main Title', 'type' => 'text'],
            ['key' => 'why_choose_desc', 'name' => '📝 Why Choose Us - Description', 'type' => 'textarea'],
            ['key' => 'feature_1_title', 'name' => '🔒 First Feature - Title (Security/Safety)', 'type' => 'text'],
            ['key' => 'feature_1_text', 'name' => '📄 First Feature - Description', 'type' => 'textarea'],
            ['key' => 'feature_2_title', 'name' => '📈 Second Feature - Title (Returns/Growth)', 'type' => 'text'],
            ['key' => 'feature_2_text', 'name' => '📄 Second Feature - Description', 'type' => 'textarea'],
            ['key' => 'feature_3_title', 'name' => '👥 Third Feature - Title (Support/Service)', 'type' => 'text'],
            ['key' => 'feature_3_text', 'name' => '📄 Third Feature - Description', 'type' => 'textarea'],
        ],
        'about' => [
            ['key' => 'page_title', 'name' => '📌 About Page - Main Title', 'type' => 'text'],
            ['key' => 'page_subtitle', 'name' => '📝 About Page - Subtitle (Under Title)', 'type' => 'text'],
            ['key' => 'story_title', 'name' => '📖 Our Story Section - Title', 'type' => 'text'],
            ['key' => 'story_text_1', 'name' => '📄 Our Story - First Paragraph', 'type' => 'textarea'],
            ['key' => 'story_text_2', 'name' => '📄 Our Story - Second Paragraph', 'type' => 'textarea'],
            ['key' => 'mission_title', 'name' => '🎯 Our Mission - Title', 'type' => 'text'],
            ['key' => 'mission_text', 'name' => '📄 Our Mission - Description', 'type' => 'textarea'],
            ['key' => 'vision_title', 'name' => '👁️ Our Vision - Title', 'type' => 'text'],
            ['key' => 'vision_text', 'name' => '📄 Our Vision - Description', 'type' => 'textarea'],
            ['key' => 'journey_title', 'name' => '🛤️ Our Journey - Title', 'type' => 'text'],
            ['key' => 'compliance_title', 'name' => '⚖️ Legal & Compliance - Title', 'type' => 'text'],
            ['key' => 'compliance_text', 'name' => '📄 Legal & Compliance - Description', 'type' => 'textarea'],
        ],
        'services' => [
            ['key' => 'page_title', 'name' => '📌 Services Page - Main Title', 'type' => 'text'],
            ['key' => 'page_subtitle', 'name' => '📝 Services Page - Subtitle', 'type' => 'text'],
            ['key' => 'service_1_title', 'name' => '💼 First Service - Title (Mutual Funds)', 'type' => 'text'],
            ['key' => 'service_1_desc', 'name' => '📄 First Service - Description', 'type' => 'textarea'],
            ['key' => 'service_1_image', 'name' => '🖼️ First Service - Image', 'type' => 'image'],
            ['key' => 'service_2_title', 'name' => '💰 Second Service - Title (Fixed Deposits)', 'type' => 'text'],
            ['key' => 'service_2_desc', 'name' => '📄 Second Service - Description', 'type' => 'textarea'],
            ['key' => 'service_2_image', 'name' => '🖼️ Second Service - Image', 'type' => 'image'],
            ['key' => 'service_3_title', 'name' => '📊 Third Service - Title (Portfolio Management)', 'type' => 'text'],
            ['key' => 'service_3_desc', 'name' => '📄 Third Service - Description', 'type' => 'textarea'],
            ['key' => 'service_3_image', 'name' => '🖼️ Third Service - Image', 'type' => 'image'],
            ['key' => 'service_4_title', 'name' => '🏢 Fourth Service - Title (Real Estate Funds)', 'type' => 'text'],
            ['key' => 'service_4_desc', 'name' => '📄 Fourth Service - Description', 'type' => 'textarea'],
            ['key' => 'service_4_image', 'name' => '🖼️ Fourth Service - Image', 'type' => 'image'],
            ['key' => 'service_5_title', 'name' => '🚀 Fifth Service - Title (Startup Equity)', 'type' => 'text'],
            ['key' => 'service_5_desc', 'name' => '📄 Fifth Service - Description', 'type' => 'textarea'],
            ['key' => 'service_5_image', 'name' => '🖼️ Fifth Service - Image', 'type' => 'image'],
        ],
        'contact' => [
            ['key' => 'page_title', 'name' => '📌 Contact Page - Main Title', 'type' => 'text'],
            ['key' => 'page_subtitle', 'name' => '📝 Contact Page - Subtitle', 'type' => 'text'],
            ['key' => 'contact_title', 'name' => '📞 Contact Section - Title (Get In Touch)', 'type' => 'text'],
            ['key' => 'office_title', 'name' => '🏢 Office Location - Label', 'type' => 'text'],
            ['key' => 'office_address', 'name' => '📍 Office Address (Full Address)', 'type' => 'textarea'],
            ['key' => 'phone_title', 'name' => '📱 Phone Section - Label', 'type' => 'text'],
            ['key' => 'phone_numbers', 'name' => '☎️ Phone Numbers (One per line)', 'type' => 'textarea'],
            ['key' => 'email_title', 'name' => '📧 Email Section - Label', 'type' => 'text'],
            ['key' => 'email_addresses', 'name' => '✉️ Email Addresses (One per line)', 'type' => 'textarea'],
            ['key' => 'form_title', 'name' => '📝 Contact Form - Title (Send Us a Message)', 'type' => 'text'],
            ['key' => 'map_embed', 'name' => '🗺️ Google Maps - Location Map', 'type' => 'map'],
        ],
        'process' => [
            ['key' => 'page_title', 'name' => '📌 Process Page - Main Title', 'type' => 'text'],
            ['key' => 'page_subtitle', 'name' => '📝 Process Page - Subtitle', 'type' => 'text'],
            ['key' => 'intro_title', 'name' => '📖 Introduction Section - Title', 'type' => 'text'],
            ['key' => 'intro_text', 'name' => '📄 Introduction Section - Description', 'type' => 'textarea'],
            ['key' => 'step_1_title', 'name' => '1️⃣ Step 1 - Title (First Step)', 'type' => 'text'],
            ['key' => 'step_1_desc', 'name' => '📄 Step 1 - Description', 'type' => 'textarea'],
            ['key' => 'step_2_title', 'name' => '2️⃣ Step 2 - Title (Second Step)', 'type' => 'text'],
            ['key' => 'step_2_desc', 'name' => '📄 Step 2 - Description', 'type' => 'textarea'],
            ['key' => 'step_3_title', 'name' => '3️⃣ Step 3 - Title (Third Step)', 'type' => 'text'],
            ['key' => 'step_3_desc', 'name' => '📄 Step 3 - Description', 'type' => 'textarea'],
            ['key' => 'step_4_title', 'name' => '4️⃣ Step 4 - Title (Fourth Step)', 'type' => 'text'],
            ['key' => 'step_4_desc', 'name' => '📄 Step 4 - Description', 'type' => 'textarea'],
        ],
        'plans' => [
            ['key' => 'page_title', 'name' => '📌 Investment Plans Page - Main Title', 'type' => 'text'],
            ['key' => 'page_subtitle', 'name' => '📝 Investment Plans Page - Subtitle', 'type' => 'text'],
            ['key' => 'intro_text', 'name' => '📄 Plans Page - Introduction Text', 'type' => 'textarea'],
        ],
        'projects' => [
            ['key' => 'page_title', 'name' => '📌 Projects Page - Main Title', 'type' => 'text'],
            ['key' => 'page_subtitle', 'name' => '📝 Projects Page - Subtitle', 'type' => 'text'],
            ['key' => 'intro_text', 'name' => '📄 Projects Page - Introduction Text', 'type' => 'textarea'],
        ],
        'reports' => [
            ['key' => 'page_title', 'name' => '📌 Reports Page - Main Title', 'type' => 'text'],
            ['key' => 'page_subtitle', 'name' => '📝 Reports Page - Subtitle', 'type' => 'text'],
            ['key' => 'intro_text', 'name' => '📄 Reports Page - Introduction Text', 'type' => 'textarea'],
        ],
        'faq' => [
            ['key' => 'page_title', 'name' => '📌 FAQ Page - Main Title', 'type' => 'text'],
            ['key' => 'page_subtitle', 'name' => '📝 FAQ Page - Subtitle', 'type' => 'text'],
            ['key' => 'intro_text', 'name' => '📄 FAQ Page - Introduction Text', 'type' => 'textarea'],
        ],
    ];
    
    return $allSections[$page] ?? [];
}

