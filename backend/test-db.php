<?php
/**
 * Test database connection and tables
 * Usage: php test-db.php
 */

$config = require __DIR__ . '/config.php';
require __DIR__ . '/db.php';

echo "Testing database connection...\n\n";

try {
    $pdo = get_pdo($config['db']);
    echo "✓ Connected to database: " . $config['db']['name'] . "\n\n";
    
    // Check users table
    $stmt = $pdo->query('SELECT COUNT(*) as count FROM users');
    $result = $stmt->fetch();
    echo "✓ Users table: {$result['count']} user(s)\n";
    
    // Check admin user
    $stmt = $pdo->prepare('SELECT name, email, role FROM users WHERE email = ?');
    $stmt->execute(['admin']);
    $admin = $stmt->fetch();
    if ($admin) {
        echo "✓ Admin user found: {$admin['name']} ({$admin['email']})\n";
    }
    
    // Check content_blocks table
    $stmt = $pdo->query('SELECT COUNT(*) as count FROM content_blocks');
    $result = $stmt->fetch();
    echo "✓ Content blocks table: {$result['count']} block(s)\n";
    
    // Check languages
    $stmt = $pdo->query('SELECT DISTINCT lang FROM content_blocks');
    $langs = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo "✓ Languages available: " . implode(', ', $langs) . "\n";
    
    echo "\n========================================\n";
    echo "✓ Database is ready!\n";
    echo "========================================\n";
    
} catch (Exception $e) {
    echo "✗ ERROR: " . $e->getMessage() . "\n";
    echo "\nPlease run: php import-db.php\n";
    exit(1);
}

