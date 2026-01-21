<?php
/**
 * Seed Process Data - Create dummy/initial data for Process page
 */

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../models/ProcessItem.php';
require_once __DIR__ . '/../../models/WebsiteSettings.php';
require_once __DIR__ . '/../../utils/Response.php';

header('Content-Type: application/json');

try {
    $processItem = new ProcessItem();
    $settings = new WebsiteSettings();
    
    $created = [];
    $errors = [];
    
    // 1. Create Page Content Sections
    $pageContent = [
        ['page_title', 'Our Process', 'Our Process'],
        ['page_subtitle', 'How We Work', 'How We Work'],
        ['intro_title', 'How It Works?', 'How It Works?'],
        ['intro_text', 'A transparent 4-step journey to your financial success.', 'A transparent 4-step journey to your financial success.'],
        ['risk_management_title', 'Risk Management', 'Risk Management'],
    ];
    
    foreach ($pageContent as $content) {
        list($key, $name, $value) = $content;
        $existing = $settings->getContentSection($key);
        if (!$existing) {
            $settings->updateContentSection($key, $value, 'process', $name);
            $created[] = "Page Content: $key";
        }
    }
    
    // 2. Create Process Steps
    $processSteps = [
        [
            'item_type' => 'step',
            'title' => 'Initial Consultation',
            'description' => 'We start by understanding your financial goals, risk tolerance, and investment preferences through a comprehensive consultation.',
            'step_number' => 1,
            'display_order' => 1,
            'is_active' => true
        ],
        [
            'item_type' => 'step',
            'title' => 'Strategy Development',
            'description' => 'Our expert team creates a personalized investment strategy tailored to your specific needs and financial objectives.',
            'step_number' => 2,
            'display_order' => 2,
            'is_active' => true
        ],
        [
            'item_type' => 'step',
            'title' => 'Implementation',
            'description' => 'We execute your investment strategy with careful monitoring and professional execution to ensure optimal results.',
            'step_number' => 3,
            'display_order' => 3,
            'is_active' => true
        ],
        [
            'item_type' => 'step',
            'title' => 'Review & Optimization',
            'description' => 'Regular portfolio reviews and adjustments ensure your investments continue to align with your goals and market conditions.',
            'step_number' => 4,
            'display_order' => 4,
            'is_active' => true
        ]
    ];
    
    // Check if steps already exist
    $existingSteps = $processItem->getAllForAdmin('step');
    if (count($existingSteps) === 0) {
        foreach ($processSteps as $step) {
            $id = $processItem->create($step);
            if ($id) {
                $created[] = "Process Step: " . $step['title'];
            } else {
                $errors[] = "Failed to create: " . $step['title'];
            }
        }
    } else {
        $created[] = "Process Steps already exist (" . count($existingSteps) . " steps)";
    }
    
    // 3. Create Risk Management Items
    $riskItems = [
        [
            'item_type' => 'risk_management',
            'title' => 'Portfolio Diversification',
            'description' => 'We spread investments across various asset classes, sectors, and geographic regions to minimize risk and maximize returns.',
            'subtitle' => 'Spread Your Risk',
            'display_order' => 1,
            'is_active' => true
        ],
        [
            'item_type' => 'risk_management',
            'title' => 'Thorough Due Diligence',
            'description' => 'Every investment opportunity undergoes rigorous analysis and research before being added to your portfolio.',
            'subtitle' => 'Research First',
            'display_order' => 2,
            'is_active' => true
        ],
        [
            'item_type' => 'risk_management',
            'title' => 'Stop-Loss Mechanisms',
            'description' => 'Automated stop-loss orders protect your investments by limiting potential losses during market downturns.',
            'subtitle' => 'Protect Your Capital',
            'display_order' => 3,
            'is_active' => true
        ]
    ];
    
    // Check if risk items already exist
    $existingRisk = $processItem->getAllForAdmin('risk_management');
    if (count($existingRisk) === 0) {
        foreach ($riskItems as $item) {
            $id = $processItem->create($item);
            if ($id) {
                $created[] = "Risk Management: " . $item['title'];
            } else {
                $errors[] = "Failed to create: " . $item['title'];
            }
        }
    } else {
        $created[] = "Risk Management items already exist (" . count($existingRisk) . " items)";
    }
    
    Response::success([
        'created' => $created,
        'errors' => $errors,
        'message' => 'Process data seeded successfully!'
    ], 'Process data seeded successfully');
    
} catch (Exception $e) {
    error_log("Seed Process Data Error: " . $e->getMessage());
    Response::error('An error occurred: ' . $e->getMessage(), 500);
}




