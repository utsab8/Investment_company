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
    'home' => ['name' => 'Home Page', 'icon' => 'fa-home', 'color' => '#667eea'],
    'about' => ['name' => 'About Us', 'icon' => 'fa-info-circle', 'color' => '#48bb78'],
    'services' => ['name' => 'Services', 'icon' => 'fa-briefcase', 'color' => '#ed8936'],
    'process' => ['name' => 'Process', 'icon' => 'fa-cogs', 'color' => '#4299e1'],
    'plansPage' => ['name' => 'Investment Plans', 'icon' => 'fa-chart-line', 'color' => '#9f7aea'],
    'reports' => ['name' => 'Reports', 'icon' => 'fa-file-alt', 'color' => '#f56565'],
    'blogPage' => ['name' => 'Blog', 'icon' => 'fa-blog', 'color' => '#38b2ac'],
    'faq' => ['name' => 'FAQ', 'icon' => 'fa-question-circle', 'color' => '#ed64a6'],
    'contact' => ['name' => 'Contact', 'icon' => 'fa-envelope', 'color' => '#fc8181'],
    'footer' => ['name' => 'Footer', 'icon' => 'fa-window-minimize', 'color' => '#718096'],
    'nav' => ['name' => 'Navigation', 'icon' => 'fa-bars', 'color' => '#4a5568'],
    'brand' => ['name' => 'Brand Name', 'icon' => 'fa-tag', 'color' => '#805ad5'],
    'common' => ['name' => 'Common Text', 'icon' => 'fa-language', 'color' => '#63b3ed'],
];
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Admin Dashboard - Investment Company</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    * { 
      margin: 0; 
      padding: 0; 
      box-sizing: border-box; 
    }
    
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: #f7fafc;
      color: #2d3748;
      line-height: 1.6;
    }
    
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 25px 40px;
      box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    
    .header-content {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .header-left h1 {
      font-size: 26px;
      font-weight: 700;
      margin-bottom: 4px;
    }
    
    .header-left p {
      opacity: 0.9;
      font-size: 14px;
    }
    
    .header-right {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    
    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(255, 255, 255, 0.15);
      padding: 8px 16px;
      border-radius: 25px;
      backdrop-filter: blur(10px);
    }
    
    .user-avatar {
      width: 36px;
      height: 36px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
    }
    
    .logout-btn {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      padding: 10px 20px;
      text-decoration: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .logout-btn:hover { 
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
    }
    
    .container {
      max-width: 1400px;
      margin: 40px auto;
      padding: 0 30px;
    }
    
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 24px;
      margin-bottom: 40px;
    }
    
    .stat-card {
      background: white;
      padding: 28px;
      border-radius: 16px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
      transition: all 0.3s;
      border-left: 4px solid;
      position: relative;
      overflow: hidden;
    }
    
    .stat-card::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%);
      opacity: 0;
      transition: opacity 0.3s;
    }
    
    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
    }
    
    .stat-card:hover::before {
      opacity: 1;
    }
    
    .stat-card:nth-child(1) { border-color: #667eea; }
    .stat-card:nth-child(2) { border-color: #48bb78; }
    .stat-card:nth-child(3) { border-color: #ed8936; }
    
    .stat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    
    .stat-icon {
      width: 50px;
      height: 50px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      color: white;
    }
    
    .stat-card:nth-child(1) .stat-icon { background: linear-gradient(135deg, #667eea, #764ba2); }
    .stat-card:nth-child(2) .stat-icon { background: linear-gradient(135deg, #48bb78, #38a169); }
    .stat-card:nth-child(3) .stat-icon { background: linear-gradient(135deg, #ed8936, #dd6b20); }
    
    .stat-value {
      font-size: 36px;
      font-weight: 700;
      color: #2d3748;
      margin-bottom: 4px;
    }
    
    .stat-label {
      color: #718096;
      font-size: 14px;
      font-weight: 500;
    }
    
    .section {
      background: white;
      padding: 32px;
      border-radius: 16px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
      margin-bottom: 30px;
    }
    
    .section-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
    }
    
    .section-header h2 {
      font-size: 22px;
      font-weight: 700;
      color: #2d3748;
    }
    
    .section-header i {
      color: #667eea;
      font-size: 20px;
    }
    
    .quick-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    
    .quick-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 12px 24px;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.3s;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }
    
    .quick-btn:hover { 
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }
    
    .page-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }
    
    .page-card {
      background: linear-gradient(135deg, #ffffff 0%, #f7fafc 100%);
      padding: 24px;
      border-radius: 14px;
      border: 2px solid #e2e8f0;
      transition: all 0.3s;
      text-decoration: none;
      color: #2d3748;
      display: block;
      position: relative;
      overflow: hidden;
    }
    
    .page-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background: var(--card-color);
      transform: scaleY(0);
      transition: transform 0.3s;
    }
    
    .page-card:hover {
      border-color: var(--card-color);
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
    }
    
    .page-card:hover::before {
      transform: scaleY(1);
    }
    
    .page-card-header {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 12px;
    }
    
    .page-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      color: white;
      background: var(--card-color);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    .page-card h3 {
      font-size: 17px;
      font-weight: 600;
      color: #2d3748;
    }
    
    .page-card p {
      font-size: 13px;
      color: #718096;
      margin-bottom: 16px;
    }
    
    .page-card-footer {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    
    .lang-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #edf2f7;
      color: #4a5568;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.3s;
    }
    
    .lang-badge:hover {
      background: var(--card-color);
      color: white;
      transform: scale(1.05);
    }
    
    .lang-badge.active {
      background: var(--card-color);
      color: white;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-content">
      <div class="header-left">
        <h1><i class="fas fa-tachometer-alt"></i> Admin Dashboard</h1>
        <p>Investment Company Content Management System</p>
      </div>
      <div class="header-right">
        <div class="user-info">
          <div class="user-avatar">
            <i class="fas fa-user"></i>
          </div>
          <span><?php echo htmlspecialchars($_SESSION['user']['name'], ENT_QUOTES, 'UTF-8'); ?></span>
        </div>
        <a href="logout.php" class="logout-btn">
          <i class="fas fa-sign-out-alt"></i> Logout
        </a>
      </div>
    </div>
  </div>

  <div class="container">
    <div class="stats">
      <div class="stat-card">
        <div class="stat-header">
          <div>
            <div class="stat-value"><?php echo $totalBlocks; ?></div>
            <div class="stat-label">Total Content Blocks</div>
          </div>
          <div class="stat-icon">
            <i class="fas fa-database"></i>
          </div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-header">
          <div>
            <div class="stat-value"><?php echo $totalPages; ?></div>
            <div class="stat-label">Pages Configured</div>
          </div>
          <div class="stat-icon">
            <i class="fas fa-file-alt"></i>
          </div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-header">
          <div>
            <div class="stat-value"><?php echo $totalLangs; ?></div>
            <div class="stat-label">Languages Available</div>
          </div>
          <div class="stat-icon">
            <i class="fas fa-globe"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-header">
        <i class="fas fa-bolt"></i>
        <h2>Quick Actions</h2>
      </div>
      <div class="quick-actions">
        <a href="content.php?page=home&lang=en" class="quick-btn">
          <i class="fas fa-home"></i> Edit Home (EN)
        </a>
        <a href="content.php?page=home&lang=ne" class="quick-btn">
          <i class="fas fa-home"></i> Edit Home (NE)
        </a>
        <a href="content.php?page=about&lang=en" class="quick-btn">
          <i class="fas fa-info-circle"></i> Edit About
        </a>
        <a href="content.php?page=services&lang=en" class="quick-btn">
          <i class="fas fa-briefcase"></i> Edit Services
        </a>
      </div>
    </div>

    <div class="section">
      <div class="section-header">
        <i class="fas fa-edit"></i>
        <h2>Edit Website Content</h2>
      </div>
      <p style="margin-bottom: 24px; color: #718096; font-size: 14px;">
        Select a page to edit. Click on language badges to switch between English and Nepali content.
      </p>
      <div class="page-grid">
        <?php foreach ($pages as $pageKey => $pageData): ?>
          <a href="content.php?page=<?php echo $pageKey; ?>&lang=en" 
             class="page-card" 
             style="--card-color: <?php echo $pageData['color']; ?>">
            <div class="page-card-header">
              <div class="page-icon" style="background: <?php echo $pageData['color']; ?>">
                <i class="fas <?php echo $pageData['icon']; ?>"></i>
              </div>
              <h3><?php echo htmlspecialchars($pageData['name'], ENT_QUOTES, 'UTF-8'); ?></h3>
            </div>
            <p>Edit <?php echo htmlspecialchars($pageData['name'], ENT_QUOTES, 'UTF-8'); ?> content</p>
            <div class="page-card-footer">
              <a href="content.php?page=<?php echo $pageKey; ?>&lang=en" 
                 class="lang-badge active" 
                 style="--card-color: <?php echo $pageData['color']; ?>"
                 onclick="event.stopPropagation();">
                <i class="fas fa-flag"></i> English
              </a>
              <a href="content.php?page=<?php echo $pageKey; ?>&lang=ne" 
                 class="lang-badge" 
                 style="--card-color: <?php echo $pageData['color']; ?>"
                 onclick="event.stopPropagation();">
                <i class="fas fa-flag"></i> Nepali
              </a>
            </div>
          </a>
        <?php endforeach; ?>
      </div>
    </div>
  </div>
</body>
</html>
