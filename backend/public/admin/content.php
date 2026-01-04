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
    body { font-family: Arial, sans-serif; max-width: 1100px; margin: 30px auto; padding: 0 20px; }
    textarea { width: 100%; min-height: 500px; font-family: monospace; padding: 12px; }
    .bar { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; margin-bottom: 10px; }
    select, button, input { padding: 8px; }
    .status { margin-top: 10px; color: #333; }
    .error { color: red; }
    .topnav { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
  </style>
</head>
<body>
  <div class="topnav">
    <h2>Admin Content Editor</h2>
    <div>
      Logged in as <?php echo htmlspecialchars($_SESSION['user']['email'], ENT_QUOTES, 'UTF-8'); ?> |
      <a href="logout.php">Logout</a>
    </div>
  </div>

  <form method="get" class="bar">
    <label>Language:
      <select name="lang" onchange="this.form.submit()">
        <option value="en" <?php echo $lang === 'en' ? 'selected' : ''; ?>>English</option>
        <option value="ne" <?php echo $lang === 'ne' ? 'selected' : ''; ?>>Nepali</option>
      </select>
    </label>
    <label>Page:
      <select name="page" onchange="this.form.submit()">
        <?php foreach ($pages as $p): ?>
          <option value="<?php echo $p; ?>" <?php echo $page === $p ? 'selected' : ''; ?>><?php echo $p; ?></option>
        <?php endforeach; ?>
      </select>
    </label>
    <noscript><button type="submit">Load</button></noscript>
  </form>

  <form method="post">
    <input type="hidden" name="lang" value="<?php echo htmlspecialchars($lang, ENT_QUOTES, 'UTF-8'); ?>">
    <input type="hidden" name="page" value="<?php echo htmlspecialchars($page, ENT_QUOTES, 'UTF-8'); ?>">
    <textarea name="json"><?php echo htmlspecialchars($jsonText, ENT_QUOTES, 'UTF-8'); ?></textarea>
    <div class="bar" style="margin-top:10px;">
      <button type="submit">Save</button>
      <span class="status <?php echo strpos($status, 'Invalid') === 0 ? 'error' : ''; ?>">
        <?php echo htmlspecialchars($status, ENT_QUOTES, 'UTF-8'); ?>
      </span>
    </div>
  </form>
</body>
</html>

