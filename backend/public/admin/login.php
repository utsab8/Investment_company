<?php
session_start();

$config = require __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../db.php';

if (isset($_SESSION['user'])) {
    header('Location: dashboard.php');
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
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Admin Login - Investment Company</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      position: relative;
      overflow: hidden;
    }
    
    body::before {
      content: '';
      position: absolute;
      width: 500px;
      height: 500px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      top: -250px;
      right: -250px;
      animation: float 20s infinite;
    }
    
    body::after {
      content: '';
      position: absolute;
      width: 400px;
      height: 400px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 50%;
      bottom: -200px;
      left: -200px;
      animation: float 15s infinite reverse;
    }
    
    @keyframes float {
      0%, 100% { transform: translate(0, 0) rotate(0deg); }
      50% { transform: translate(30px, 30px) rotate(180deg); }
    }
    
    .login-container {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 440px;
    }
    
    .login-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      animation: slideUp 0.5s ease-out;
    }
    
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .logo-section {
      text-align: center;
      margin-bottom: 35px;
    }
    
    .logo-icon {
      width: 70px;
      height: 70px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 18px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 15px;
      box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
    }
    
    .logo-icon i {
      font-size: 32px;
      color: white;
    }
    
    .logo-section h1 {
      font-size: 28px;
      font-weight: 700;
      color: #2d3748;
      margin-bottom: 8px;
    }
    
    .logo-section p {
      color: #718096;
      font-size: 14px;
    }
    
    .form-group {
      margin-bottom: 24px;
    }
    
    .form-group label {
      display: block;
      color: #4a5568;
      font-weight: 600;
      font-size: 14px;
      margin-bottom: 8px;
    }
    
    .input-wrapper {
      position: relative;
    }
    
    .input-wrapper i {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      color: #a0aec0;
      font-size: 16px;
    }
    
    .form-group input {
      width: 100%;
      padding: 14px 16px 14px 45px;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      font-size: 15px;
      transition: all 0.3s ease;
      background: #f7fafc;
      color: #2d3748;
    }
    
    .form-group input:focus {
      outline: none;
      border-color: #667eea;
      background: white;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    .form-group input::placeholder {
      color: #a0aec0;
    }
    
    .btn-login {
      width: 100%;
      padding: 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      margin-top: 8px;
    }
    
    .btn-login:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
    }
    
    .btn-login:active {
      transform: translateY(0);
    }
    
    .error-message {
      background: #fed7d7;
      color: #c53030;
      padding: 12px 16px;
      border-radius: 10px;
      font-size: 14px;
      margin-top: 20px;
      border-left: 4px solid #e53e3e;
      animation: shake 0.5s;
    }
    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-10px); }
      75% { transform: translateX(10px); }
    }
    
    .footer-text {
      text-align: center;
      margin-top: 30px;
      color: rgba(255, 255, 255, 0.9);
      font-size: 13px;
    }
    
    .footer-text a {
      color: white;
      text-decoration: none;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="login-container">
    <div class="login-card">
      <div class="logo-section">
        <div class="logo-icon">
          <i class="fas fa-shield-alt"></i>
        </div>
        <h1>Admin Portal</h1>
        <p>Investment Company Management</p>
      </div>
      
      <form method="post">
        <div class="form-group">
          <label for="username">
            <i class="fas fa-user"></i> Username
          </label>
          <div class="input-wrapper">
            <i class="fas fa-user"></i>
            <input 
              type="text" 
              id="username" 
              name="username" 
              placeholder="Enter your username"
              required 
              value="<?php echo htmlspecialchars($_POST['username'] ?? $defaultUsername, ENT_QUOTES, 'UTF-8'); ?>"
              autofocus
            >
          </div>
        </div>
        
        <div class="form-group">
          <label for="password">
            <i class="fas fa-lock"></i> Password
          </label>
          <div class="input-wrapper">
            <i class="fas fa-lock"></i>
            <input 
              type="password" 
              id="password" 
              name="password" 
              placeholder="Enter your password"
              required
            >
          </div>
        </div>
        
        <button type="submit" class="btn-login">
          <i class="fas fa-sign-in-alt"></i> Sign In
        </button>
        
        <?php if ($error): ?>
          <div class="error-message">
            <i class="fas fa-exclamation-circle"></i> <?php echo htmlspecialchars($error, ENT_QUOTES, 'UTF-8'); ?>
          </div>
        <?php endif; ?>
      </form>
    </div>
    
    <div class="footer-text">
      <p>© 2024 Investment Company. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
