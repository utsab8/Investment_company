<?php
/**
 * Initialize Page Content
 * Creates default content sections for all pages
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
    $pages = [
        'home' => [
            ['hero_title', 'Welcome to MRB International', 'Welcome to MRB International'],
            ['hero_subtitle', 'Your Trusted Partner in Wealth Management', 'Your Trusted Partner in Wealth Management'],
            ['hero_text', 'We help you grow your wealth through strategic investments and expert financial planning.', 'We help you grow your wealth through strategic investments and expert financial planning.'],
            ['about_title', 'Leading The Way In Investment Excellence', 'Leading The Way In Investment Excellence'],
            ['about_text', 'MRB International is a leading investment company dedicated to helping clients achieve their financial goals through strategic wealth management and innovative investment solutions.', 'MRB International is a leading investment company dedicated to helping clients achieve their financial goals through strategic wealth management and innovative investment solutions.'],
            ['why_choose_title', 'Why Choose Us', 'Why Choose Us'],
            ['why_choose_desc', 'We provide exceptional investment services with proven track record.', 'We provide exceptional investment services with proven track record.'],
            ['feature_1_title', 'Secure & Safe', 'Secure & Safe'],
            ['feature_1_text', 'Your investments are protected with industry-leading security measures.', 'Your investments are protected with industry-leading security measures.'],
            ['feature_2_title', 'Expert Advisors', 'Expert Advisors'],
            ['feature_2_text', 'Work with certified financial advisors with years of experience.', 'Work with certified financial advisors with years of experience.'],
            ['feature_3_title', 'Transparent Returns', 'Transparent Returns'],
            ['feature_3_text', 'Clear and honest reporting of your investment performance.', 'Clear and honest reporting of your investment performance.'],
        ],
        'about' => [
            ['page_title', 'About Us', 'About Us'],
            ['page_subtitle', 'Your Trusted Investment Partner', 'Your Trusted Investment Partner'],
            ['story_title', 'Defining The Future Of Investment', 'Defining The Future Of Investment'],
            ['story_text_1', 'MRB International was founded with a vision to democratize wealth management and make professional investment services accessible to everyone.', 'MRB International was founded with a vision to democratize wealth management and make professional investment services accessible to everyone.'],
            ['story_text_2', 'Over the years, we have built a reputation for excellence, integrity, and outstanding results.', 'Over the years, we have built a reputation for excellence, integrity, and outstanding results.'],
            ['mission_title', 'Our Mission', 'Our Mission'],
            ['mission_text', 'To empower individuals and businesses to achieve their financial goals through innovative investment solutions and expert guidance.', 'To empower individuals and businesses to achieve their financial goals through innovative investment solutions and expert guidance.'],
            ['vision_title', 'Our Vision', 'Our Vision'],
            ['vision_text', 'To become the most trusted and respected investment company globally.', 'To become the most trusted and respected investment company globally.'],
            ['journey_title', 'Our Journey', 'Our Journey'],
            ['compliance_title', 'Legal & Compliance', 'Legal & Compliance'],
            ['compliance_text', 'We are fully licensed and regulated, ensuring your investments are safe and secure.', 'We are fully licensed and regulated, ensuring your investments are safe and secure.'],
        ],
        'services' => [
            ['page_title', 'Our Services', 'Our Services'],
            ['page_subtitle', 'Comprehensive Investment Solutions', 'Comprehensive Investment Solutions'],
            ['service_1_title', 'Mutual Funds', 'Mutual Funds'],
            ['service_1_desc', 'Diversified portfolio management with professional fund managers.', 'Diversified portfolio management with professional fund managers.'],
            ['service_2_title', 'Fixed Income', 'Fixed Income'],
            ['service_2_desc', 'Secure fixed deposits with guaranteed returns.', 'Secure fixed deposits with guaranteed returns.'],
            ['service_3_title', 'Portfolio Advisory', 'Portfolio Advisory'],
            ['service_3_desc', 'Personalized investment strategies tailored to your goals.', 'Personalized investment strategies tailored to your goals.'],
            ['service_4_title', 'Real Estate Funds', 'Real Estate Funds'],
            ['service_4_desc', 'Invest in real estate through managed funds.', 'Invest in real estate through managed funds.'],
            ['service_5_title', 'Startup Equity', 'Startup Equity'],
            ['service_5_desc', 'Early-stage investment opportunities in promising startups.', 'Early-stage investment opportunities in promising startups.'],
        ],
        'contact' => [
            ['page_title', 'Contact Us', 'Contact Us'],
            ['page_subtitle', 'Get in Touch', 'Get in Touch'],
            ['contact_title', 'Get In Touch', 'Get In Touch'],
            ['office_title', 'Main Office', 'Main Office'],
            ['office_address', '123 Wall Street, New York, NY 10005', '123 Wall Street, New York, NY 10005'],
            ['phone_title', 'Phone Number', 'Phone Number'],
            ['phone_numbers', '+1 (555) 123-4567\n+1 (555) 123-4568', '+1 (555) 123-4567\n+1 (555) 123-4568'],
            ['email_title', 'Email Address', 'Email Address'],
            ['email_addresses', 'info@mrb-international.com\nsupport@mrb-international.com', 'info@mrb-international.com\nsupport@mrb-international.com'],
            ['form_title', 'Send Us a Message', 'Send Us a Message'],
            ['map_embed', 'Google Maps Embed Code', '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-74.01104108459503!3d40.70780367933185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a165bedccab%3A0x2cb2ddf003b5ae!2sWall%20St%2C%20New%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1646813290635!5m2!1sen!2sus" width="100%" height="300" style="border:0" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'],
        ],
        'process' => [
            ['page_title', 'Our Process', 'Our Process'],
            ['page_subtitle', 'How We Work', 'How We Work'],
            ['intro_title', 'Our Investment Process', 'Our Investment Process'],
            ['intro_text', 'We follow a systematic approach to ensure the best outcomes for our clients.', 'We follow a systematic approach to ensure the best outcomes for our clients.'],
            ['step_1_title', 'Consultation', 'Consultation'],
            ['step_1_desc', 'We understand your financial goals and risk tolerance.', 'We understand your financial goals and risk tolerance.'],
            ['step_2_title', 'Strategy Development', 'Strategy Development'],
            ['step_2_desc', 'We create a personalized investment strategy for you.', 'We create a personalized investment strategy for you.'],
            ['step_3_title', 'Implementation', 'Implementation'],
            ['step_3_desc', 'We execute the strategy with careful monitoring.', 'We execute the strategy with careful monitoring.'],
            ['step_4_title', 'Review & Adjust', 'Review & Adjust'],
            ['step_4_desc', 'Regular reviews and adjustments to optimize performance.', 'Regular reviews and adjustments to optimize performance.'],
        ],
    ];
    
    $created = 0;
    $skipped = 0;
    
    foreach ($pages as $page => $sections) {
        foreach ($sections as $section) {
            list($key, $name, $content) = $section;
            
            // Check if section exists
            $existing = $settings->getContentSection($key);
            
            if (!$existing) {
                // Create new section
                $settings->updateContentSection($key, $content, $page, $name);
                $created++;
            } else {
                $skipped++;
            }
        }
    }
    
    Response::success([
        'created' => $created,
        'skipped' => $skipped,
        'total' => $created + $skipped,
        'message' => 'Page content initialized successfully'
    ], 'Page content initialized');
    
} catch (Exception $e) {
    error_log("Init Page Content Error: " . $e->getMessage());
    Response::error('Error initializing page content: ' . $e->getMessage(), 500);
}

