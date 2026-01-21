<?php
/**
 * Seed Reports Data - Create dummy/initial data for Reports page
 */

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../models/Report.php';
require_once __DIR__ . '/../../models/WebsiteSettings.php';
require_once __DIR__ . '/../../utils/Response.php';

header('Content-Type: application/json');

try {
    $report = new Report();
    $settings = new WebsiteSettings();
    
    $created = [];
    $errors = [];
    
    // 1. Create Page Content Sections
    $pageContent = [
        ['page_title', 'Reports & Resources', 'Reports & Resources'],
        ['page_subtitle', 'Investor Resources & Performance Reports', 'Investor Resources & Performance Reports'],
        ['intro_text', 'Access our comprehensive reports, performance data, and investor resources to stay informed about our investment strategies and results.', 'Access our comprehensive reports, performance data, and investor resources to stay informed about our investment strategies and results.'],
        ['fund_performance_title', 'Fund Performance 2024', 'Fund Performance 2024'],
        ['annual_returns_title', 'Annual Returns Comparison', 'Annual Returns Comparison'],
        ['outperformance_title', 'Consistent Outperformance', 'Consistent Outperformance'],
        ['outperformance_description', 'Our investment strategies have consistently delivered superior returns compared to market averages and inflation rates.', 'Our investment strategies have consistently delivered superior returns compared to market averages and inflation rates.'],
        ['investor_resources_title', 'Investor Resources', 'Investor Resources'],
    ];
    
    foreach ($pageContent as $content) {
        list($key, $name, $value) = $content;
        $existing = $settings->getContentSection($key);
        if (!$existing) {
            $settings->updateContentSection($key, $value, 'reports', $name);
            $created[] = "Page Content: $key";
        }
    }
    
    // 2. Create Sample Reports
    $sampleReports = [
        [
            'title' => 'Annual Report 2023',
            'description' => 'Comprehensive annual report covering our investment performance, strategy highlights, and financial results for the fiscal year 2023.',
            'report_type' => 'Annual Report',
            'file_url' => null, // Can be updated later with actual PDF
            'file_size' => null,
            'year' => 2023,
            'quarter' => null,
            'is_public' => true
        ],
        [
            'title' => 'Q3 2024 Investor Presentation',
            'description' => 'Quarterly investor presentation showcasing Q3 2024 performance metrics, portfolio updates, and strategic outlook.',
            'report_type' => 'Investor Presentation',
            'file_url' => null,
            'file_size' => null,
            'year' => 2024,
            'quarter' => 3,
            'is_public' => true
        ],
        [
            'title' => 'Market Outlook 2024',
            'description' => 'Detailed analysis of market trends, economic forecasts, and investment opportunities for 2024 and beyond.',
            'report_type' => 'Market Analysis',
            'file_url' => null,
            'file_size' => null,
            'year' => 2024,
            'quarter' => null,
            'is_public' => true
        ],
        [
            'title' => 'Quarterly Performance Report Q2 2024',
            'description' => 'Q2 2024 performance summary including portfolio returns, risk metrics, and investment activity highlights.',
            'report_type' => 'Quarterly Report',
            'file_url' => null,
            'file_size' => null,
            'year' => 2024,
            'quarter' => 2,
            'is_public' => true
        ],
        [
            'title' => 'ESG Investment Report 2023',
            'description' => 'Environmental, Social, and Governance (ESG) investment report demonstrating our commitment to sustainable investing.',
            'report_type' => 'ESG Report',
            'file_url' => null,
            'file_size' => null,
            'year' => 2023,
            'quarter' => null,
            'is_public' => true
        ],
        [
            'title' => 'Q1 2024 Performance Summary',
            'description' => 'First quarter 2024 performance overview with key metrics, portfolio composition, and strategic insights.',
            'report_type' => 'Quarterly Report',
            'file_url' => null,
            'file_size' => null,
            'year' => 2024,
            'quarter' => 1,
            'is_public' => true
        ]
    ];
    
    // Check if reports already exist
    $existingReports = $report->getAllForAdmin();
    if (count($existingReports) === 0) {
        foreach ($sampleReports as $reportData) {
            $id = $report->create($reportData);
            if ($id) {
                $created[] = "Report: " . $reportData['title'];
            } else {
                $errors[] = "Failed to create: " . $reportData['title'];
            }
        }
    } else {
        $created[] = "Reports already exist (" . count($existingReports) . " reports)";
    }
    
    Response::success([
        'created' => $created,
        'errors' => $errors,
        'message' => 'Reports data seeded successfully!'
    ], 'Reports data seeded successfully');
    
} catch (Exception $e) {
    error_log("Seed Reports Data Error: " . $e->getMessage());
    Response::error('An error occurred: ' . $e->getMessage(), 500);
}




