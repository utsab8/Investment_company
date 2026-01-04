<?php
// Script to import contact_submissions table

$config = require __DIR__ . '/config.php';

try {
    $pdo = new PDO(
        "mysql:host={$config['db']['host']};port={$config['db']['port']};charset={$config['db']['charset']}",
        $config['db']['user'],
        $config['db']['pass'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    // Read SQL file
    $sql = file_get_contents(__DIR__ . '/database_contact.sql');
    
    // Execute SQL
    $pdo->exec($sql);
    
    echo "Contact submissions table created successfully!\n";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}

