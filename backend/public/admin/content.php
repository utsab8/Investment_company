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
        $status = 'Saved.';
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
?>
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Admin Content Editor</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: #f5f5f5;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    .topnav {
      background: white;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .topnav h2 {
      color: #333;
      font-size: 20px;
    }
    .editor-container {
      background: white;
      padding: 25px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .bar {
      display: flex;
      gap: 15px;
      align-items: center;
      flex-wrap: wrap;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #eee;
    }
    select, button, input {
      padding: 10px 15px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
      background: white;
    }
    select { cursor: pointer; }
    button {
      background: #667eea;
      color: white;
      border: none;
      cursor: pointer;
      font-weight: 500;
      transition: background 0.3s;
    }
    button:hover { background: #5568d3; }
    textarea {
      width: 100%;
      min-height: 600px;
      font-family: 'Courier New', monospace;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 13px;
      line-height: 1.6;
      resize: vertical;
    }
    .status {
      margin-top: 15px;
      padding: 10px;
      border-radius: 6px;
      font-size: 14px;
    }
    .status.success {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }
    .error {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }
    label {
      font-weight: 500;
      color: #333;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="topnav">
    <h2>Admin Content Editor</h2>
    <div>
      <a href="dashboard.php" style="margin-right: 15px; text-decoration: none; color: #667eea;">← Dashboard</a>
      Logged in as <?php echo htmlspecialchars($_SESSION['user']['email'], ENT_QUOTES, 'UTF-8'); ?> |
      <a href="logout.php">Logout</a>
    </div>
  </div>

  <div class="editor-container">
    <form method="get" class="bar">
      <div style="display: flex; gap: 15px; align-items: center;">
        <label style="display: flex; align-items: center; gap: 8px;">
          Language:
          <select name="lang" onchange="this.form.submit()">
            <option value="en" <?php echo $lang === 'en' ? 'selected' : ''; ?>>🇬🇧 English</option>
            <option value="ne" <?php echo $lang === 'ne' ? 'selected' : ''; ?>>🇳🇵 Nepali</option>
          </select>
        </label>
        <label style="display: flex; align-items: center; gap: 8px;">
          Page:
          <select name="page" onchange="this.form.submit()" style="min-width: 200px;">
            <?php 
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
            foreach ($pages as $p): 
            ?>
              <option value="<?php echo $p; ?>" <?php echo $page === $p ? 'selected' : ''; ?>>
                <?php echo isset($pageNames[$p]) ? $pageNames[$p] : $p; ?>
              </option>
            <?php endforeach; ?>
          </select>
        </label>
      </div>
      <noscript><button type="submit">Load</button></noscript>
    </form>

    <form method="post">
      <input type="hidden" name="lang" value="<?php echo htmlspecialchars($lang, ENT_QUOTES, 'UTF-8'); ?>">
      <input type="hidden" name="page" value="<?php echo htmlspecialchars($page, ENT_QUOTES, 'UTF-8'); ?>">
      <textarea name="json" placeholder="Edit JSON content here..."><?php echo htmlspecialchars($jsonText, ENT_QUOTES, 'UTF-8'); ?></textarea>
    <div style="margin-top: 20px;">
      <button type="submit" style="padding: 12px 30px; font-size: 16px;">💾 Save Changes</button>
      <?php if ($status): ?>
        <div class="status <?php echo strpos($status, 'Invalid') === 0 ? 'error' : 'success'; ?>" style="margin-top: 15px;">
          <?php echo htmlspecialchars($status, ENT_QUOTES, 'UTF-8'); ?>
        </div>
      <?php endif; ?>
    </div>
  </form>
</body>
</html>

