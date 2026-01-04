<?php
session_start();

if (!isset($_SESSION['user'])) {
    header('Location: login.php');
    exit;
}

$config = require __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../db.php';

$pdo = get_pdo($config['db']);

// Handle status update
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update_status'])) {
    $id = (int)$_POST['id'];
    $status = $_POST['status'];
    
    $stmt = $pdo->prepare('UPDATE contact_submissions SET status = :status WHERE id = :id');
    $stmt->execute(['status' => $status, 'id' => $id]);
    header('Location: submissions.php');
    exit;
}

// Get all submissions
$stmt = $pdo->query('SELECT id, name, email, subject, message, status, created_at FROM contact_submissions ORDER BY created_at DESC');
$submissions = $stmt->fetchAll();
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Contact Submissions - Admin Panel</title>
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
      display: flex;
      min-height: 100vh;
    }
    
    .sidebar {
      width: 260px;
      background: linear-gradient(180deg, #2d3748 0%, #1a202c 100%);
      color: white;
      position: fixed;
      left: 0;
      top: 0;
      height: 100vh;
      overflow-y: auto;
      box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
      z-index: 200;
      transition: transform 0.3s ease;
    }
    
    .sidebar-toggle {
      display: none;
      position: fixed;
      top: 15px;
      left: 15px;
      z-index: 300;
      background: #667eea;
      color: white;
      border: none;
      padding: 10px 15px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 18px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }
    
      @media (max-width: 768px) {
      .sidebar {
        transform: translateX(-100%);
      }
      
      .sidebar.open {
        transform: translateX(0);
      }
      
      .sidebar-toggle {
        display: block;
      }
      
      .main-content {
        margin-left: 0;
      }
      
      .container {
        padding: 15px;
      }
      
      table {
        font-size: 12px;
        display: block;
        overflow-x: auto;
      }
      
      th, td {
        padding: 10px 12px;
      }
      
      .message-preview {
        max-width: 150px;
      }
    }
    
    @media (max-width: 480px) {
      .table-header {
        flex-direction: column;
        gap: 10px;
        align-items: flex-start;
      }
      
      .message-preview {
        max-width: 100px;
      }
    }
    
    .sidebar-header {
      padding: 25px 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .sidebar-header h3 {
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 5px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .sidebar-header p {
      font-size: 12px;
      opacity: 0.7;
    }
    
    .sidebar-nav {
      padding: 15px 0;
    }
    
    .nav-section {
      margin-bottom: 10px;
    }
    
    .nav-section-title {
      padding: 10px 20px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      opacity: 0.6;
      font-weight: 600;
    }
    
    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 20px;
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      transition: all 0.3s;
      border-left: 3px solid transparent;
    }
    
    .nav-item:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border-left-color: #667eea;
    }
    
    .nav-item.active {
      background: rgba(102, 126, 234, 0.2);
      color: white;
      border-left-color: #667eea;
    }
    
    .nav-item i {
      width: 20px;
      font-size: 16px;
    }
    
    .main-content {
      flex: 1;
      margin-left: 260px;
      min-height: 100vh;
    }
    
    
    .container {
      padding: 30px;
      max-width: 100%;
      margin: 0;
    }
    
    .data-table {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
      overflow: hidden;
    }
    
    .table-header {
      background: #f7fafc;
      padding: 20px;
      border-bottom: 2px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .table-header h2 {
      font-size: 20px;
      font-weight: 700;
      color: #2d3748;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
    }
    
    thead {
      background: #f7fafc;
    }
    
    th {
      padding: 15px 20px;
      text-align: left;
      font-weight: 600;
      color: #4a5568;
      font-size: 14px;
      border-bottom: 2px solid #e2e8f0;
    }
    
    td {
      padding: 15px 20px;
      border-bottom: 1px solid #e2e8f0;
      color: #2d3748;
      font-size: 14px;
    }
    
    tr:hover {
      background: #f7fafc;
    }
    
    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
    }
    
    .status-new {
      background: #bee3f8;
      color: #2c5282;
    }
    
    .status-read {
      background: #c6f6d5;
      color: #22543d;
    }
    
    .status-replied {
      background: #fed7d7;
      color: #742a2a;
    }
    
    .message-preview {
      max-width: 300px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #718096;
    }
    
    .status-form {
      display: inline-block;
    }
    
    .status-select {
      padding: 6px 12px;
      border: 2px solid #e2e8f0;
      border-radius: 6px;
      font-size: 13px;
      cursor: pointer;
    }
    
    .status-select:focus {
      outline: none;
      border-color: #667eea;
    }
    
    .btn-update {
      background: #667eea;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 13px;
      cursor: pointer;
      margin-left: 8px;
    }
    
    .btn-update:hover {
      background: #5568d3;
    }
    
    .email-link {
      color: #667eea;
      text-decoration: none;
    }
    
    .email-link:hover {
      text-decoration: underline;
    }
  </style>
  <script>
    function toggleSidebar() {
      const sidebar = document.getElementById('sidebar');
      sidebar.classList.toggle('open');
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
      const sidebar = document.getElementById('sidebar');
      const toggle = document.querySelector('.sidebar-toggle');
      if (window.innerWidth <= 768 && !sidebar.contains(e.target) && !toggle.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });
  </script>
</head>
<body>
  <button class="sidebar-toggle" onclick="toggleSidebar()">
    <i class="fas fa-bars"></i>
  </button>
  <div class="sidebar" id="sidebar">
    <div class="sidebar-header">
      <h3><i class="fas fa-shield-alt"></i> Admin Panel</h3>
      <p>Content Management</p>
    </div>
    <div class="sidebar-nav">
      <div class="nav-section">
        <div class="nav-section-title">Pages</div>
        <a href="dashboard.php" class="nav-item">
          <i class="fas fa-tachometer-alt"></i>
          <span>Dashboard</span>
        </a>
        <a href="content.php?page=home&lang=en" class="nav-item">
          <i class="fas fa-home"></i>
          <span>Home Page</span>
        </a>
        <a href="content.php?page=about&lang=en" class="nav-item">
          <i class="fas fa-info-circle"></i>
          <span>About Us</span>
        </a>
        <a href="content.php?page=services&lang=en" class="nav-item">
          <i class="fas fa-briefcase"></i>
          <span>Services</span>
        </a>
        <a href="content.php?page=process&lang=en" class="nav-item">
          <i class="fas fa-cogs"></i>
          <span>Process</span>
        </a>
        <a href="content.php?page=plansPage&lang=en" class="nav-item">
          <i class="fas fa-chart-line"></i>
          <span>Investment Plans</span>
        </a>
        <a href="content.php?page=reports&lang=en" class="nav-item">
          <i class="fas fa-file-alt"></i>
          <span>Reports</span>
        </a>
        <a href="content.php?page=blogPage&lang=en" class="nav-item">
          <i class="fas fa-blog"></i>
          <span>Blog</span>
        </a>
        <a href="content.php?page=faq&lang=en" class="nav-item">
          <i class="fas fa-question-circle"></i>
          <span>FAQ</span>
        </a>
        <a href="content.php?page=contact&lang=en" class="nav-item">
          <i class="fas fa-envelope"></i>
          <span>Contact</span>
        </a>
      </div>
      <div class="nav-section">
        <div class="nav-section-title">Settings</div>
        <a href="content.php?page=footer&lang=en" class="nav-item">
          <i class="fas fa-window-minimize"></i>
          <span>Footer</span>
        </a>
        <a href="content.php?page=nav&lang=en" class="nav-item">
          <i class="fas fa-bars"></i>
          <span>Navigation</span>
        </a>
        <a href="content.php?page=brand&lang=en" class="nav-item">
          <i class="fas fa-tag"></i>
          <span>Brand</span>
        </a>
      </div>
      <div class="nav-section">
        <div class="nav-section-title">System</div>
        <a href="submissions.php" class="nav-item active">
          <i class="fas fa-inbox"></i>
          <span>Contact Submissions</span>
        </a>
        <a href="logout.php" class="nav-item">
          <i class="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </a>
      </div>
    </div>
  </div>

  <div class="main-content">
    <div class="container">
      <div class="data-table">
        <div class="table-header">
          <h2><i class="fas fa-envelope"></i> All Contact Form Submissions</h2>
          <span style="color: #718096; font-size: 14px;">Total: <?php echo count($submissions); ?></span>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <?php if (empty($submissions)): ?>
              <tr>
                <td colspan="8" style="text-align: center; padding: 40px; color: #718096;">
                  No contact submissions yet.
                </td>
              </tr>
            <?php else: ?>
              <?php foreach ($submissions as $sub): 
                $created = date('Y-m-d H:i', strtotime($sub['created_at']));
                $messagePreview = strlen($sub['message']) > 100 ? substr($sub['message'], 0, 100) . '...' : $sub['message'];
              ?>
              <tr>
                <td>#<?php echo $sub['id']; ?></td>
                <td><strong><?php echo htmlspecialchars($sub['name'], ENT_QUOTES, 'UTF-8'); ?></strong></td>
                <td>
                  <a href="mailto:<?php echo htmlspecialchars($sub['email'], ENT_QUOTES, 'UTF-8'); ?>" class="email-link">
                    <?php echo htmlspecialchars($sub['email'], ENT_QUOTES, 'UTF-8'); ?>
                  </a>
                </td>
                <td><?php echo htmlspecialchars($sub['subject'], ENT_QUOTES, 'UTF-8'); ?></td>
                <td>
                  <div class="message-preview" title="<?php echo htmlspecialchars($sub['message'], ENT_QUOTES, 'UTF-8'); ?>">
                    <?php echo htmlspecialchars($messagePreview, ENT_QUOTES, 'UTF-8'); ?>
                  </div>
                </td>
                <td>
                  <span class="status-badge status-<?php echo $sub['status']; ?>">
                    <?php echo ucfirst($sub['status']); ?>
                  </span>
                </td>
                <td><?php echo htmlspecialchars($created, ENT_QUOTES, 'UTF-8'); ?></td>
                <td>
                  <form method="post" class="status-form">
                    <input type="hidden" name="id" value="<?php echo $sub['id']; ?>">
                    <select name="status" class="status-select" onchange="this.form.submit()">
                      <option value="new" <?php echo $sub['status'] === 'new' ? 'selected' : ''; ?>>New</option>
                      <option value="read" <?php echo $sub['status'] === 'read' ? 'selected' : ''; ?>>Read</option>
                      <option value="replied" <?php echo $sub['status'] === 'replied' ? 'selected' : ''; ?>>Replied</option>
                    </select>
                    <input type="hidden" name="update_status" value="1">
                  </form>
                </td>
              </tr>
              <?php endforeach; ?>
            <?php endif; ?>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</body>
</html>

