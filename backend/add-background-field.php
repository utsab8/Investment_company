<?php
// Script to add background field to home page content

$config = require __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

$pdo = get_pdo($config['db']);

// Update English version
$stmt = $pdo->prepare('SELECT data FROM content_blocks WHERE page = "home" AND lang = "en" LIMIT 1');
$stmt->execute();
$row = $stmt->fetch();

if ($row) {
    $data = json_decode($row['data'], true);
    if (!isset($data['home']['hero']['background'])) {
        $data['home']['hero']['background'] = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80';
        $stmt = $pdo->prepare('UPDATE content_blocks SET data = :data WHERE page = "home" AND lang = "en"');
        $stmt->execute(['data' => json_encode($data, JSON_UNESCAPED_UNICODE)]);
        echo "Background field added to home page (EN)\n";
    } else {
        echo "Background field already exists (EN)\n";
    }
}

// Update Nepali version
$stmt = $pdo->prepare('SELECT id, data FROM content_blocks WHERE page = "home" AND lang = "ne" LIMIT 1');
$stmt->execute();
$row = $stmt->fetch();

if ($row) {
    $data = json_decode($row['data'], true);
    if (!isset($data['home']['hero']['background'])) {
        $data['home']['hero']['background'] = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80';
        $updateStmt = $pdo->prepare('UPDATE content_blocks SET data = :data WHERE id = :id');
        $updateStmt->execute(['data' => json_encode($data, JSON_UNESCAPED_UNICODE), 'id' => $row['id']]);
        echo "Background field added to home page (NE)\n";
    } else {
        echo "Background field already exists (NE)\n";
    }
} else {
    echo "Nepali home page not found\n";
}

echo "Done!\n";

