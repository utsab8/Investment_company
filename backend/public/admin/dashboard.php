<?php
session_start();

if (!isset($_SESSION['user'])) {
    header('Location: login.php');
    exit;
}

$config = require __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../db.php';

$pdo = get_pdo($config['db']);

// Get statistics
$stmt = $pdo->query('SELECT COUNT(*) as count FROM content_blocks');
$totalBlocks = $stmt->fetch()['count'];

$stmt = $pdo->query('SELECT COUNT(DISTINCT page) as count FROM content_blocks');
$totalPages = $stmt->fetch()['count'];

$stmt = $pdo->query('SELECT COUNT(DISTINCT lang) as count FROM content_blocks');
$totalLangs = $stmt->fetch()['count'];

$pages = [
    'home' => 'Home Page',
    'about' => 'About Us',
    'services' => 'Services',
    'process' => 'Process',
    'plansPage' => 'Investment Plans',
    'reports' => 'Reports',
    'blogPage' => 'Blog',
    'faq' => 'FAQ',
    'contact' => 'Contact',
    'footer' => 'Footer',
    'nav' => 'Navigation',
    'brand' => 'Brand Name',
    'common' => 'Common Text',
];
?>
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Admin Dashboard - Investment Company</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: #f5f5f5;
      color: #333;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px 30px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header h1 { font-size: 24px; margin-bottom: 5px; }
    .header p { opacity: 0.9; font-size: 14px; }
    .header-top { display: flex; justify-content: space-between; align-items: center; }
    .logout-btn {
      background: rgba(255,255,255,0.2);
      color: white;
      padding: 8px 16px;
      text-decoration: none;
      border-radius: 4px;
      font-size: 14px;
      transition: background 0.3s;
    }
    .logout-btn:hover { background: rgba(255,255,255,0.3); }
    .container {
      max-width: 1200px;
      margin: 30px auto;
      padding: 0 20px;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .stat-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .stat-card h3 {
      font-size: 32px;
      color: #667eea;
      margin-bottom: 5px;
    }
    .stat-card p {
      color: #666;
      font-size: 14px;
    }
    .section {
      background: white;
      padding: 25px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-bottom: 20px;
    }
    .section h2 {
      margin-bottom: 20px;
      color: #333;
      font-size: 20px;
    }
    .page-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 15px;
    }
    .page-card {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 6px;
      border: 2px solid transparent;
      transition: all 0.3s;
      text-decoration: none;
      color: #333;
      display: block;
    }
    .page-card:hover {
      border-color: #667eea;
      background: #fff;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
    }
    .page-card h3 {
      font-size: 16px;
      margin-bottom: 5px;
      color: #333;
    }
    .page-card p {
      font-size: 12px;
      color: #666;
    }
    .lang-badge {
      display: inline-block;
      background: #667eea;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      margin-top: 8px;
    }
    .quick-actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    .btn {
      background: #667eea;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
      font-size: 14px;
      transition: background 0.3s;
    }
    .btn:hover { background: #5568d3; }
    .btn-secondary {
      background: #6c757d;
    }
    .btn-secondary:hover { background: #5a6268; }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-top">
      <div>
        <h1>Admin Dashboard</h1>
        <p>Investment Company Content Management</p>
      </div>
      <div>
        <span style="margin-right: 15px;">Logged in as: <strong><?php echo htmlspecialchars($_SESSION['user']['name'], ENT_QUOTES, 'UTF-8'); ?></strong></span>
        <a href="logout.php" class="logout-btn">Logout</a>
      </div>
    </div>
  </div>

  <div class="container">
    <div class="stats">
      <div class="stat-card">
        <h3><?php echo $totalBlocks; ?></h3>
        <p>Total Content Blocks</p>
      </div>
      <div class="stat-card">
        <h3><?php echo $totalPages; ?></h3>
        <p>Pages Configured</p>
      </div>
      <div class="stat-card">
        <h3><?php echo $totalLangs; ?></h3>
        <p>Languages Available</p>
      </div>
    </div>

    <div class="section">
      <h2>Quick Actions</h2>
      <div class="quick-actions">
        <a href="content.php?page=home&lang=en" class="btn">Edit Home Page (English)</a>
        <a href="content.php?page=home&lang=ne" class="btn">Edit Home Page (Nepali)</a>
        <a href="content.php?page=about&lang=en" class="btn">Edit About Page</a>
        <a href="content.php?page=services&lang=en" class="btn">Edit Services</a>
      </div>
    </div>

    <div class="section">
      <h2>Edit Website Content</h2>
      <p style="margin-bottom: 20px; color: #666;">Select a page to edit. You can edit content for both English and Nepali languages.</p>
      <div class="page-grid">
        <?php foreach ($pages as $pageKey => $pageName): ?>
          <a href="content.php?page=<?php echo $pageKey; ?>&lang=en" class="page-card">
            <h3><?php echo htmlspecialchars($pageName, ENT_QUOTES, 'UTF-8'); ?></h3>
            <p>Edit <?php echo htmlspecialchars($pageName, ENT_QUOTES, 'UTF-8'); ?> content</p>
            <div>
              <span class="lang-badge">English</span>
              <a href="content.php?page=<?php echo $pageKey; ?>&lang=ne" style="margin-left: 5px; color: #667eea; text-decoration: none; font-size: 11px;">Nepali →</a>
            </div>
          </a>
        <?php endforeach; ?>
      </div>
    </div>
  </div>
</body>
</html>

