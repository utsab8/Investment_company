<?php
/**
 * Setup Script
 * Creates necessary directories and checks configuration
 */

echo "MRB International - Backend Setup\n";
echo "==================================\n\n";

// Create logs directory
$logsDir = __DIR__ . '/logs';
if (!file_exists($logsDir)) {
    if (mkdir($logsDir, 0755, true)) {
        echo "✓ Created logs directory\n";
    } else {
        echo "✗ Failed to create logs directory\n";
    }
} else {
    echo "✓ Logs directory exists\n";
}

// Create uploads directory
$uploadsDir = __DIR__ . '/uploads';
if (!file_exists($uploadsDir)) {
    if (mkdir($uploadsDir, 0755, true)) {
        echo "✓ Created uploads directory\n";
    } else {
        echo "✗ Failed to create uploads directory\n";
    }
} else {
    echo "✓ Uploads directory exists\n";
}

// Test database connection
require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/database.php';

echo "\nTesting database connection...\n";
$database = new Database();
$conn = $database->getConnection();

if ($conn) {
    echo "✓ Database connection successful\n";
    
    // Check if database exists
    try {
        $stmt = $conn->query("SELECT DATABASE()");
        $dbName = $stmt->fetchColumn();
        if ($dbName === 'MRB_INTERNATIONAL') {
            echo "✓ Connected to MRB_INTERNATIONAL database\n";
        } else {
            echo "⚠ Connected to database: $dbName (Expected: MRB_INTERNATIONAL)\n";
        }
    } catch (Exception $e) {
        echo "⚠ Could not verify database name\n";
    }
} else {
    echo "✗ Database connection failed\n";
    echo "  Please check your database credentials in backend/config/database.php\n";
}

echo "\nSetup complete!\n";
echo "\nNext steps:\n";
echo "1. Import database schema: backend/database/schema.sql\n";
echo "2. Update database credentials in backend/config/database.php if needed\n";
echo "3. Test API endpoints in your browser\n";

