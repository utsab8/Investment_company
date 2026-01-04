<?php
/**
 * Database Import Script
 * Run this to create the database and import all tables
 * Usage: php import-db.php
 */

$config = require __DIR__ . '/config.php';
$dbConfig = $config['db'];

echo "========================================\n";
echo "Importing Investment Company Database\n";
echo "========================================\n\n";

try {
    // Connect without database first
    $dsn = sprintf(
        'mysql:host=%s;port=%s;charset=%s',
        $dbConfig['host'],
        $dbConfig['port'],
        $dbConfig['charset']
    );
    
    $pdo = new PDO($dsn, $dbConfig['user'], $dbConfig['pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);
    
    echo "✓ Connected to MySQL\n";
    
    // Read and execute SQL file
    $sqlFile = __DIR__ . '/database.sql';
    if (!file_exists($sqlFile)) {
        throw new Exception("SQL file not found: $sqlFile");
    }
    
    echo "✓ Reading SQL file...\n";
    $sql = file_get_contents($sqlFile);
    
    // Split by semicolon and execute each statement
    // Remove comments and empty lines
    $sql = preg_replace('/--.*$/m', '', $sql);
    $sql = preg_replace('/\/\*.*?\*\//s', '', $sql);
    
    // Split by semicolon but keep CREATE DATABASE and USE statements together
    $statements = array_filter(
        array_map('trim', explode(';', $sql)),
        function($stmt) {
            return !empty($stmt) && strlen($stmt) > 10;
        }
    );
    
    echo "✓ Executing SQL statements...\n\n";
    
    $executed = 0;
    foreach ($statements as $statement) {
        if (empty(trim($statement))) continue;
        
        try {
            $pdo->exec($statement);
            $executed++;
            
            // Show progress for major operations
            if (stripos($statement, 'CREATE DATABASE') !== false) {
                echo "  ✓ Created database\n";
            } elseif (stripos($statement, 'CREATE TABLE') !== false) {
                if (preg_match('/CREATE TABLE[^`]*`?(\w+)`?/i', $statement, $matches)) {
                    echo "  ✓ Created table: {$matches[1]}\n";
                }
            } elseif (stripos($statement, 'INSERT INTO') !== false) {
                if (preg_match('/INSERT INTO[^`]*`?(\w+)`?/i', $statement, $matches)) {
                    echo "  ✓ Inserted data into: {$matches[1]}\n";
                }
            }
        } catch (PDOException $e) {
            // Ignore "table already exists" errors
            if (strpos($e->getMessage(), 'already exists') === false && 
                strpos($e->getMessage(), 'Duplicate entry') === false) {
                echo "  ⚠ Warning: " . $e->getMessage() . "\n";
            }
        }
    }
    
    echo "\n========================================\n";
    echo "✓ Database imported successfully!\n";
    echo "========================================\n\n";
    echo "Database: {$dbConfig['name']}\n";
    echo "Tables: users, content_blocks\n";
    echo "Admin user: admin / admin123\n\n";
    
    // Verify tables exist
    $pdo->exec("USE `{$dbConfig['name']}`");
    $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    echo "Tables in database: " . implode(', ', $tables) . "\n";
    
} catch (Exception $e) {
    echo "\n========================================\n";
    echo "✗ ERROR: " . $e->getMessage() . "\n";
    echo "========================================\n\n";
    echo "Please check:\n";
    echo "  1. MySQL is running\n";
    echo "  2. Database credentials in config.php are correct\n";
    echo "  3. User has CREATE DATABASE privileges\n\n";
    exit(1);
}

