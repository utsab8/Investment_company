<?php
session_start();

if (!isset($_SESSION['user'])) {
    header('Location: login.php');
    exit;
}

$config = require __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../db.php';

$pdo = get_pdo($config['db']);

$pages = [
    'home',
    'about',
    'services',
    'process',
    'plansPage',
    'reports',
    'blogPage',
    'faq',
    'contact',
    'footer',
    'nav',
    'brand',
    'common',
];

$lang = $_GET['lang'] ?? 'en';
$page = $_GET['page'] ?? 'home';
$status = '';
$jsonText = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $lang = $_POST['lang'] ?? 'en';
    $page = $_POST['page'] ?? 'home';
    $jsonText = $_POST['json'] ?? '';

    $decoded = json_decode($jsonText, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        $status = 'Invalid JSON: ' . json_last_error_msg();
    } else {
        $stmt = $pdo->prepare('SELECT id FROM content_blocks WHERE page = :page AND lang = :lang LIMIT 1');
        $stmt->execute(['page' => $page, 'lang' => $lang]);
        $existing = $stmt->fetch();
        if ($existing) {
            $update = $pdo->prepare('UPDATE content_blocks SET data = :data, updated_at = NOW() WHERE id = :id');
            $update->execute(['data' => json_encode($decoded), 'id' => $existing['id']]);
        } else {
            $insert = $pdo->prepare('INSERT INTO content_blocks (page, lang, data, updated_at) VALUES (:page, :lang, :data, NOW())');
            $insert->execute(['page' => $page, 'lang' => $lang, 'data' => json_encode($decoded)]);
        }
        $status = 'Content saved successfully!';
    }
}

// Load current content
$stmt = $pdo->prepare('SELECT data FROM content_blocks WHERE page = :page AND lang = :lang LIMIT 1');
$stmt->execute(['page' => $page, 'lang' => $lang]);
$row = $stmt->fetch();
if ($row) {
    $jsonText = $jsonText ?: json_encode(json_decode($row['data'], true), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
} else {
    // empty template
    $jsonText = $jsonText ?: json_encode([$page => new stdClass()], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}

$pageNames = [
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
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Content Editor - <?php echo isset($pageNames[$page]) ? $pageNames[$page] : $page; ?></title>
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
    }
    
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px 30px;
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
    
    .header-left {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    
    .back-btn {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      padding: 10px 16px;
      text-decoration: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .back-btn:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateX(-3px);
    }
    
    .header-left h2 {
      font-size: 22px;
      font-weight: 600;
    }
    
    .header-right {
      display: flex;
      align-items: center;
      gap: 15px;
      color: rgba(255, 255, 255, 0.9);
      font-size: 14px;
    }
    
    .header-right a {
      color: white;
      text-decoration: none;
      padding: 8px 16px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      transition: all 0.3s;
    }
    
    .header-right a:hover {
      background: rgba(255, 255, 255, 0.3);
    }
    
    .container {
      max-width: 1400px;
      margin: 30px auto;
      padding: 0 30px;
    }
    
    .editor-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
      overflow: hidden;
    }
    
    .editor-header {
      background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
      padding: 24px 30px;
      border-bottom: 2px solid #e2e8f0;
    }
    
    .controls {
      display: flex;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;
    }
    
    .control-group {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .control-group label {
      font-weight: 600;
      color: #4a5568;
      font-size: 14px;
      white-space: nowrap;
    }
    
    .control-group select {
      padding: 10px 16px;
      border: 2px solid #e2e8f0;
      border-radius: 10px;
      font-size: 14px;
      background: white;
      color: #2d3748;
      cursor: pointer;
      transition: all 0.3s;
      min-width: 180px;
    }
    
    .control-group select:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    .editor-body {
      padding: 30px;
    }
    
    .editor-wrapper {
      position: relative;
    }
    
    textarea {
      width: 100%;
      min-height: 650px;
      font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
      padding: 20px;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      font-size: 13px;
      line-height: 1.8;
      resize: vertical;
      background: #1a202c;
      color: #e2e8f0;
      transition: all 0.3s;
    }
    
    textarea:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    textarea::placeholder {
      color: #718096;
    }
    
    .editor-footer {
      padding: 24px 30px;
      background: #f7fafc;
      border-top: 2px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }
    
    .btn-save {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 14px 32px;
      border: none;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .btn-save:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
    }
    
    .btn-save:active {
      transform: translateY(0);
    }
    
    .status-message {
      padding: 12px 20px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 10px;
      animation: slideIn 0.3s ease-out;
    }
    
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .status-success {
      background: #c6f6d5;
      color: #22543d;
      border-left: 4px solid #48bb78;
    }
    
    .status-error {
      background: #fed7d7;
      color: #742a2a;
      border-left: 4px solid #e53e3e;
    }
    
    .info-text {
      color: #718096;
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-content">
      <div class="header-left">
        <a href="dashboard.php" class="back-btn">
          <i class="fas fa-arrow-left"></i> Dashboard
        </a>
        <h2><i class="fas fa-edit"></i> Content Editor</h2>
      </div>
      <div class="header-right">
        <span><i class="fas fa-user-circle"></i> <?php echo htmlspecialchars($_SESSION['user']['name'], ENT_QUOTES, 'UTF-8'); ?></span>
        <a href="logout.php"><i class="fas fa-sign-out-alt"></i> Logout</a>
      </div>
    </div>
  </div>

  <div class="container">
    <div class="editor-card">
      <form method="get" class="editor-header">
        <div class="controls">
          <div class="control-group">
            <label><i class="fas fa-globe"></i> Language:</label>
            <select name="lang" onchange="this.form.submit()">
              <option value="en" <?php echo $lang === 'en' ? 'selected' : ''; ?>>🇬🇧 English</option>
              <option value="ne" <?php echo $lang === 'ne' ? 'selected' : ''; ?>>🇳🇵 Nepali</option>
            </select>
          </div>
          <div class="control-group">
            <label><i class="fas fa-file-alt"></i> Page:</label>
            <select name="page" onchange="this.form.submit()">
              <?php foreach ($pages as $p): ?>
                <option value="<?php echo $p; ?>" <?php echo $page === $p ? 'selected' : ''; ?>>
                  <?php echo isset($pageNames[$p]) ? $pageNames[$p] : $p; ?>
                </option>
              <?php endforeach; ?>
            </select>
          </div>
        </div>
      </form>

      <form method="post" class="editor-body">
        <input type="hidden" name="lang" value="<?php echo htmlspecialchars($lang, ENT_QUOTES, 'UTF-8'); ?>">
        <input type="hidden" name="page" value="<?php echo htmlspecialchars($page, ENT_QUOTES, 'UTF-8'); ?>">
        
        <div class="editor-wrapper">
          <textarea 
            name="json" 
            placeholder="Edit JSON content here... Make sure the JSON is valid!"
            spellcheck="false"
          ><?php echo htmlspecialchars($jsonText, ENT_QUOTES, 'UTF-8'); ?></textarea>
        </div>
        
        <div class="editor-footer">
          <div class="info-text">
            <i class="fas fa-info-circle"></i>
            <span>Editing: <strong><?php echo isset($pageNames[$page]) ? $pageNames[$page] : $page; ?></strong> (<?php echo $lang === 'en' ? 'English' : 'Nepali'; ?>)</span>
          </div>
          <button type="submit" class="btn-save">
            <i class="fas fa-save"></i> Save Changes
          </button>
        </div>
        
        <?php if ($status): ?>
          <div class="status-message <?php echo strpos($status, 'Invalid') === 0 ? 'status-error' : 'status-success'; ?>">
            <i class="fas <?php echo strpos($status, 'Invalid') === 0 ? 'fa-exclamation-circle' : 'fa-check-circle'; ?>"></i>
            <?php echo htmlspecialchars($status, ENT_QUOTES, 'UTF-8'); ?>
          </div>
        <?php endif; ?>
      </form>
    </div>
  </div>
</body>
</html>
