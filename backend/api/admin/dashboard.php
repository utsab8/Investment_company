<?php
/**
 * Dashboard Statistics API
 * Provides statistics and metrics for admin dashboard
 */

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../utils/Cors.php';
require_once __DIR__ . '/../../utils/Response.php';
require_once __DIR__ . '/../../utils/Auth.php';
require_once __DIR__ . '/../../config/database.php';

Cors::handle();
header('Content-Type: application/json');
session_start();
Auth::requireAuth();

try {
    $database = new Database();
    $conn = $database->getConnection();

    // Helper function to safely execute queries
    $safeQuery = function($query, $default = 0) use ($conn) {
        try {
            $result = $conn->query($query);
            return $result ? (int)$result->fetchColumn() : $default;
        } catch (Exception $e) {
            error_log("Dashboard query error: " . $e->getMessage() . " - Query: " . $query);
            return $default;
        }
    };

    // Helper function to safely fetch all rows
    $safeFetchAll = function($query, $default = []) use ($conn) {
        try {
            $result = $conn->query($query);
            return $result ? $result->fetchAll(PDO::FETCH_ASSOC) : $default;
        } catch (Exception $e) {
            error_log("Dashboard fetchAll error: " . $e->getMessage() . " - Query: " . $query);
            return $default;
        }
    };

    // Helper function to safely fetch one row
    $safeFetch = function($query, $default = null) use ($conn) {
        try {
            $result = $conn->query($query);
            return $result ? $result->fetch(PDO::FETCH_ASSOC) : $default;
        } catch (Exception $e) {
            error_log("Dashboard fetch error: " . $e->getMessage() . " - Query: " . $query);
            return $default;
        }
    };

    // Get all statistics
    $stats = [];

    // 1. Quick Stats - Total counts
    $stats['totals'] = [
        'projects' => $safeQuery("SELECT COUNT(*) FROM projects WHERE is_active = 1"),
        'services' => $safeQuery("SELECT COUNT(*) FROM services WHERE is_active = 1"),
        'faqs' => $safeQuery("SELECT COUNT(*) FROM faqs WHERE is_active = 1"),
        'reports' => $safeQuery("SELECT COUNT(*) FROM reports WHERE is_public = 1"),
        'process_steps' => $safeQuery("SELECT COUNT(*) FROM process_items WHERE item_type = 'step' AND is_active = 1"),
        'contacts' => $safeQuery("SELECT COUNT(*) FROM contacts"),
        'unread_messages' => $safeQuery("SELECT COUNT(*) FROM contacts WHERE status = 'new'"),
    ];

    // 2. Recent Activity (last 7 days)
    $sevenDaysAgo = date('Y-m-d H:i:s', strtotime('-7 days'));
    
    $stats['recent_activity'] = [
        'new_projects' => $safeQuery("SELECT COUNT(*) FROM projects WHERE created_at >= '$sevenDaysAgo'"),
        'new_services' => $safeQuery("SELECT COUNT(*) FROM services WHERE created_at >= '$sevenDaysAgo'"),
        'new_faqs' => $safeQuery("SELECT COUNT(*) FROM faqs WHERE created_at >= '$sevenDaysAgo'"),
        'new_reports' => $safeQuery("SELECT COUNT(*) FROM reports WHERE created_at >= '$sevenDaysAgo'"),
        'new_contacts' => $safeQuery("SELECT COUNT(*) FROM contacts WHERE created_at >= '$sevenDaysAgo'"),
    ];

    // 3. Recent Items (last 5 of each type)
    $stats['recent_items'] = [
        'projects' => $safeFetchAll("SELECT id, title, created_at FROM projects ORDER BY created_at DESC LIMIT 5"),
        'services' => $safeFetchAll("SELECT id, title, created_at FROM services ORDER BY created_at DESC LIMIT 5"),
        'contacts' => $safeFetchAll("SELECT id, name, email, subject, status, created_at FROM contacts ORDER BY created_at DESC LIMIT 5"),
    ];

    // 4. Monthly trends (last 6 months)
    $monthlyData = [];
    for ($i = 5; $i >= 0; $i--) {
        $monthStart = date('Y-m-01', strtotime("-$i months"));
        $monthEnd = date('Y-m-t', strtotime("-$i months"));
        $monthName = date('M Y', strtotime("-$i months"));
        
        $monthlyData[] = [
            'month' => $monthName,
            'projects' => $safeQuery("SELECT COUNT(*) FROM projects WHERE DATE(created_at) BETWEEN '$monthStart' AND '$monthEnd'"),
            'services' => $safeQuery("SELECT COUNT(*) FROM services WHERE DATE(created_at) BETWEEN '$monthStart' AND '$monthEnd'"),
            'contacts' => $safeQuery("SELECT COUNT(*) FROM contacts WHERE DATE(created_at) BETWEEN '$monthStart' AND '$monthEnd'"),
            'reports' => $safeQuery("SELECT COUNT(*) FROM reports WHERE DATE(created_at) BETWEEN '$monthStart' AND '$monthEnd'"),
        ];
    }
    $stats['monthly_trends'] = $monthlyData;

    // 5. Status breakdown
    $stats['status_breakdown'] = [
        'projects' => [
            'active' => $safeQuery("SELECT COUNT(*) FROM projects WHERE is_active = 1"),
            'inactive' => $safeQuery("SELECT COUNT(*) FROM projects WHERE is_active = 0"),
            'featured' => $safeQuery("SELECT COUNT(*) FROM projects WHERE is_featured = 1"),
        ],
        'services' => [
            'active' => $safeQuery("SELECT COUNT(*) FROM services WHERE is_active = 1"),
            'inactive' => $safeQuery("SELECT COUNT(*) FROM services WHERE is_active = 0"),
        ],
        'contacts' => [
            'new' => $safeQuery("SELECT COUNT(*) FROM contacts WHERE status = 'new'"),
            'read' => $safeQuery("SELECT COUNT(*) FROM contacts WHERE status = 'read'"),
            'replied' => $safeQuery("SELECT COUNT(*) FROM contacts WHERE status = 'replied'"),
        ],
        'reports' => [
            'public' => $safeQuery("SELECT COUNT(*) FROM reports WHERE is_public = 1"),
            'private' => $safeQuery("SELECT COUNT(*) FROM reports WHERE is_public = 0"),
        ],
    ];

    // 6. Project statistics (if projects have financial data)
    $projectStats = $safeFetch("
        SELECT 
            COUNT(*) as total,
            AVG(roi_percentage) as avg_roi,
            SUM(amount_managed) as total_amount,
            MAX(roi_percentage) as max_roi,
            MIN(roi_percentage) as min_roi
        FROM projects 
        WHERE is_active = 1 AND roi_percentage IS NOT NULL
    ");

    $stats['project_metrics'] = [
        'total_projects' => (int)($projectStats['total'] ?? 0),
        'average_roi' => round((float)($projectStats['avg_roi'] ?? 0), 2),
        'total_amount_managed' => round((float)($projectStats['total_amount'] ?? 0), 2),
        'max_roi' => round((float)($projectStats['max_roi'] ?? 0), 2),
        'min_roi' => round((float)($projectStats['min_roi'] ?? 0), 2),
    ];

    Response::success($stats, 'Dashboard statistics retrieved successfully');

} catch (Exception $e) {
    error_log("Dashboard API Error: " . $e->getMessage());
    error_log("Dashboard API Stack Trace: " . $e->getTraceAsString());
    Response::error('An error occurred: ' . $e->getMessage(), 500);
}
