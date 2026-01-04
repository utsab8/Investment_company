<?php
session_start();

$config = require __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../db.php';

if (isset($_SESSION['user'])) {
    header('Location: content.php');
    exit;
}

$error = '';
$defaultUsername = 'admin';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';

    try {
        $pdo = get_pdo($config['db']);
        $stmt = $pdo->prepare('SELECT id, name, email, password_hash, role FROM users WHERE email = :username LIMIT 1');
        $stmt->execute(['username' => $username]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password_hash'])) {
            $_SESSION['user'] = [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'role' => $user['role'],
            ];
            header('Location: dashboard.php');
            exit;
        } else {
            $error = 'Invalid username or password';
        }
    } catch (Throwable $e) {
        $error = 'Server error: ' . htmlspecialchars($e->getMessage(), ENT_QUOTES, 'UTF-8');
    }
}
?>
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Admin Login</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 480px; margin: 60px auto; padding: 0 20px; }
    .card { border: 1px solid #ddd; padding: 20px; border-radius: 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.05); }
    input { width: 100%; padding: 10px; margin: 8px 0; box-sizing: border-box; }
    button { padding: 10px 16px; cursor: pointer; }
    .error { color: red; margin-top: 10px; }
  </style>
</head>
<body>
  <div class="card">
    <h2>Admin Login</h2>
    <form method="post">
      <label>Username</label>
      <input type="text" name="username" required value="<?php echo htmlspecialchars($_POST['username'] ?? $defaultUsername, ENT_QUOTES, 'UTF-8'); ?>">
      <label>Password</label>
      <input type="password" name="password" required>
      <button type="submit">Login</button>
      <?php if ($error): ?>
        <div class="error"><?php echo htmlspecialchars($error, ENT_QUOTES, 'UTF-8'); ?></div>
      <?php endif; ?>
    </form>
  </div>
</body>
</html>

