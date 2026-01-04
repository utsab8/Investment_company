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
$contentData = [];

// Function to generate form fields from JSON structure
function generateFormFields($data, $prefix = '', $level = 0) {
    $html = '';
    
    if (is_array($data)) {
        // Check if it's a numeric/indexed array (list)
        $keys = array_keys($data);
        $isIndexedArray = !empty($keys) && $keys === range(0, count($data) - 1);
        
        if ($isIndexedArray) {
            // It's an array/list
            $sectionName = $prefix ? basename(str_replace(['[', ']'], ['_', ''], $prefix)) : 'items';
            $html .= '<div class="array-container" data-prefix="' . htmlspecialchars($prefix, ENT_QUOTES, 'UTF-8') . '">';
            $html .= '<div class="array-header">';
            $html .= '<label class="section-label">' . htmlspecialchars(ucwords(str_replace(['_', '-'], ' ', $sectionName)), ENT_QUOTES, 'UTF-8') . ' (List)</label>';
            $html .= '<button type="button" class="btn-add-item" onclick="addArrayItem(\'' . htmlspecialchars($prefix, ENT_QUOTES, 'UTF-8') . '\')"><i class="fas fa-plus"></i> Add Item</button>';
            $html .= '</div>';
            
            foreach ($data as $index => $item) {
                $itemPrefix = $prefix ? $prefix . '[' . $index . ']' : '[' . $index . ']';
                
                if (is_array($item)) {
                    // Object in array
                    $html .= '<div class="array-item">';
                    $html .= '<div class="array-item-header">';
                    $html .= '<span>Item ' . ($index + 1) . '</span>';
                    $html .= '<button type="button" class="btn-remove-item" onclick="removeArrayItem(this)"><i class="fas fa-times"></i></button>';
                    $html .= '</div>';
                    $html .= '<div class="array-item-content">';
                    $html .= generateFormFields($item, $itemPrefix, $level + 1);
                    $html .= '</div>';
                    $html .= '</div>';
                } else {
                    // Simple value in array
                    $html .= '<div class="array-item">';
                    $html .= '<div class="form-group">';
                    $html .= '<label>Item ' . ($index + 1) . '</label>';
                    $html .= '<div style="display: flex; gap: 8px;">';
                    $html .= '<input type="text" name="' . htmlspecialchars($itemPrefix, ENT_QUOTES, 'UTF-8') . '" value="' . htmlspecialchars(is_string($item) ? $item : json_encode($item), ENT_QUOTES, 'UTF-8') . '" class="form-input" style="flex: 1;">';
                    $html .= '<button type="button" class="btn-remove-item" onclick="removeArrayItem(this)"><i class="fas fa-times"></i></button>';
                    $html .= '</div>';
                    $html .= '</div>';
                    $html .= '</div>';
                }
            }
            $html .= '</div>';
        } else {
            // It's an object/associative array
            foreach ($data as $key => $value) {
                $fieldName = $prefix ? $prefix . '[' . $key . ']' : $key;
                $fieldLabel = ucwords(str_replace(['_', '-'], ' ', $key));
                
                if (is_array($value)) {
                    // Nested object or array
                    $html .= '<div class="form-section" style="margin-left: ' . ($level * 20) . 'px;">';
                    $html .= '<div class="section-header">';
                    $html .= '<label class="section-label"><i class="fas fa-folder"></i> ' . htmlspecialchars($fieldLabel, ENT_QUOTES, 'UTF-8') . '</label>';
                    $html .= '</div>';
                    $html .= generateFormFields($value, $fieldName, $level + 1);
                    $html .= '</div>';
                } else {
                    // Simple field
                    $html .= '<div class="form-group">';
                    $html .= '<label for="' . htmlspecialchars($fieldName, ENT_QUOTES, 'UTF-8') . '">' . htmlspecialchars($fieldLabel, ENT_QUOTES, 'UTF-8') . '</label>';
                    
                    // Check if this is an image field (including background images)
                    $isImageField = in_array(strtolower($key), ['image', 'img', 'photo', 'picture', 'icon', 'logo', 'banner', 'thumbnail', 'background', 'bg', 'backgroundimage', 'bgimage']);
                    $isUrlField = is_string($value) && (strpos($value, 'http://') === 0 || strpos($value, 'https://') === 0 || strpos($value, '/') === 0);
                    
                    if ($isImageField || ($isUrlField && preg_match('/\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i', $value))) {
                        // Image upload field
                        $html .= '<div class="image-upload-wrapper">';
                        $html .= '<div class="image-preview-container">';
                        if (!empty($value)) {
                            $previewUrl = (strpos($value, 'http') === 0 || strpos($value, '/') === 0) ? $value : '/uploads/' . $value;
                            $html .= '<img src="' . htmlspecialchars($previewUrl, ENT_QUOTES, 'UTF-8') . '" alt="Preview" class="image-preview" onerror="this.style.display=\'none\'">';
                        }
                        $html .= '</div>';
                        $html .= '<div class="image-upload-controls">';
                        $html .= '<input type="text" name="' . htmlspecialchars($fieldName, ENT_QUOTES, 'UTF-8') . '" id="' . htmlspecialchars($fieldName, ENT_QUOTES, 'UTF-8') . '" value="' . htmlspecialchars($value, ENT_QUOTES, 'UTF-8') . '" class="form-input image-url-input" placeholder="Image URL or upload from device">';
                        $html .= '<label class="btn-upload-image" for="upload_' . htmlspecialchars(str_replace(['[', ']'], ['_', '_'], $fieldName), ENT_QUOTES, 'UTF-8') . '">';
                        $html .= '<i class="fas fa-upload"></i> Choose from Device';
                        $html .= '</label>';
                        $html .= '<input type="file" id="upload_' . htmlspecialchars(str_replace(['[', ']'], ['_', '_'], $fieldName), ENT_QUOTES, 'UTF-8') . '" class="image-file-input" accept="image/*" data-field="' . htmlspecialchars($fieldName, ENT_QUOTES, 'UTF-8') . '" style="display: none;">';
                        $html .= '</div>';
                        $html .= '</div>';
                    } else if (is_string($value) && strlen($value) > 100) {
                        // Use textarea for longer text
                        $html .= '<textarea name="' . htmlspecialchars($fieldName, ENT_QUOTES, 'UTF-8') . '" id="' . htmlspecialchars($fieldName, ENT_QUOTES, 'UTF-8') . '" class="form-textarea" rows="4">' . htmlspecialchars($value, ENT_QUOTES, 'UTF-8') . '</textarea>';
                    } else {
                        // Regular text input
                        $html .= '<input type="text" name="' . htmlspecialchars($fieldName, ENT_QUOTES, 'UTF-8') . '" id="' . htmlspecialchars($fieldName, ENT_QUOTES, 'UTF-8') . '" value="' . htmlspecialchars($value, ENT_QUOTES, 'UTF-8') . '" class="form-input">';
                    }
                    $html .= '</div>';
                }
            }
        }
    } else {
        // Simple value
        $html .= '<div class="form-group">';
        $html .= '<input type="text" name="' . htmlspecialchars($prefix, ENT_QUOTES, 'UTF-8') . '" value="' . htmlspecialchars($data, ENT_QUOTES, 'UTF-8') . '" class="form-input">';
        $html .= '</div>';
    }
    
    return $html;
}

// Function to normalize arrays (convert numeric keys to indexed arrays)
function normalizeArrays($arr) {
    if (!is_array($arr)) {
        return $arr;
    }
    
    $keys = array_keys($arr);
    $allNumeric = !empty($keys) && array_reduce($keys, function($carry, $key) {
        return $carry && (is_numeric($key) || (is_string($key) && ctype_digit($key)));
    }, true);
    
    $normalized = [];
    foreach ($arr as $k => $v) {
        $normalized[$k] = is_array($v) ? normalizeArrays($v) : $v;
    }
    
    // If all keys are numeric and sequential, return as indexed array
    if ($allNumeric && !empty($keys)) {
        $sortedKeys = array_map('intval', $keys);
        sort($sortedKeys);
        if ($sortedKeys === range(0, count($keys) - 1)) {
            return array_values($normalized);
        }
    }
    
    return $normalized;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $lang = $_POST['lang'] ?? 'en';
    $page = $_POST['page'] ?? 'home';
    
    // PHP automatically parses bracket notation in form field names
    // So $_POST already has the nested structure, we just need to remove special fields
    $formData = $_POST;
    unset($formData['lang'], $formData['page']);
    
    // Normalize arrays (convert numeric keys to indexed arrays where appropriate)
    $formData = normalizeArrays($formData);
    
    // Wrap in page key
    $finalData = [$page => $formData];
    
    $stmt = $pdo->prepare('SELECT id FROM content_blocks WHERE page = :page AND lang = :lang LIMIT 1');
    $stmt->execute(['page' => $page, 'lang' => $lang]);
    $existing = $stmt->fetch();
    
    if ($existing) {
        $update = $pdo->prepare('UPDATE content_blocks SET data = :data, updated_at = NOW() WHERE id = :id');
        $update->execute(['data' => json_encode($finalData, JSON_UNESCAPED_UNICODE), 'id' => $existing['id']]);
    } else {
        $insert = $pdo->prepare('INSERT INTO content_blocks (page, lang, data, updated_at) VALUES (:page, :lang, :data, NOW())');
        $insert->execute(['page' => $page, 'lang' => $lang, 'data' => json_encode($finalData, JSON_UNESCAPED_UNICODE)]);
    }
    
    $status = 'Content saved successfully!';
    $contentData = $finalData;
} else {
    // Load current content
    $stmt = $pdo->prepare('SELECT data FROM content_blocks WHERE page = :page AND lang = :lang LIMIT 1');
    $stmt->execute(['page' => $page, 'lang' => $lang]);
    $row = $stmt->fetch();
    
    if ($row) {
        $contentData = json_decode($row['data'], true);
    } else {
        $contentData = [$page => []];
    }
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

// Extract the actual content (remove page wrapper if exists)
$formData = isset($contentData[$page]) ? $contentData[$page] : $contentData;
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
      
      .editor-header {
        padding: 15px 20px;
      }
      
      .controls {
        flex-direction: column;
        gap: 10px;
      }
      
      .control-group {
        width: 100%;
      }
      
      .control-group select {
        width: 100%;
      }
      
      .editor-body {
        padding: 20px;
      }
      
      .form-section {
        padding: 15px;
      }
    }
    
    @media (max-width: 480px) {
      .image-preview-container {
        max-width: 100%;
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
      max-width: 1400px;
      margin: 0 auto;
      padding: 30px;
      width: 100%;
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
    
    .form-section {
      margin-bottom: 24px;
      padding: 20px;
      background: #f7fafc;
      border-radius: 12px;
      border-left: 4px solid #667eea;
    }
    
    .section-header {
      margin-bottom: 16px;
    }
    
    .section-label {
      font-size: 16px;
      font-weight: 700;
      color: #2d3748;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    .form-group label {
      display: block;
      font-weight: 600;
      color: #4a5568;
      font-size: 14px;
      margin-bottom: 8px;
    }
    
    .form-input, .form-textarea {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-size: 14px;
      color: #2d3748;
      transition: all 0.3s;
      font-family: inherit;
    }
    
    .form-input:focus, .form-textarea:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    .form-textarea {
      resize: vertical;
      min-height: 100px;
    }
    
    .array-container {
      margin: 16px 0;
      padding: 16px;
      background: #edf2f7;
      border-radius: 8px;
    }
    
    .array-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    
    .array-item {
      background: white;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 12px;
      border: 2px solid #e2e8f0;
      position: relative;
    }
    
    .array-item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      font-weight: 600;
      color: #4a5568;
    }
    
    .array-item-content {
      margin-top: 12px;
    }
    
    .btn-add-item, .btn-remove-item {
      background: #667eea;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      transition: all 0.3s;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    
    .btn-add-item:hover {
      background: #5568d3;
      transform: translateY(-2px);
    }
    
    .btn-remove-item {
      background: #e53e3e;
      padding: 6px 12px;
      font-size: 12px;
    }
    
    .btn-remove-item:hover {
      background: #c53030;
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
    
    .status-message {
      padding: 12px 20px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 10px;
      animation: slideIn 0.3s ease-out;
      margin-top: 20px;
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
    
    .info-text {
      color: #718096;
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .image-upload-wrapper {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .image-preview-container {
      width: 100%;
      max-width: 400px;
      height: 200px;
      border: 2px dashed #e2e8f0;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f7fafc;
      overflow: hidden;
    }
    
    .image-preview {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
    
    .image-upload-controls {
      display: flex;
      gap: 10px;
      align-items: center;
    }
    
    .image-url-input {
      flex: 1;
    }
    
    .btn-upload-image {
      background: #48bb78;
      color: white;
      padding: 10px 20px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.3s;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      white-space: nowrap;
    }
    
    .btn-upload-image:hover {
      background: #38a169;
      transform: translateY(-2px);
    }
    
    .image-file-input {
      display: none;
    }
    
    .uploading {
      opacity: 0.6;
      pointer-events: none;
    }
    
    .upload-success {
      color: #48bb78;
      font-size: 12px;
      margin-top: 4px;
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
    
    function addArrayItem(prefix) {
      const container = document.querySelector(`[data-prefix="${prefix}"]`);
      const items = container.querySelectorAll('.array-item');
      const index = items.length;
      
      // Clone the last item or create a new one
      const lastItem = items[items.length - 1];
      let newItem;
      
      if (lastItem) {
        newItem = lastItem.cloneNode(true);
        // Update input names with new index
        newItem.querySelectorAll('input, textarea, select').forEach(input => {
          if (input.name) {
            // Replace the index in bracket notation
            input.name = input.name.replace(/\[(\d+)\]/, `[${index}]`);
            // Also handle nested brackets
            input.name = input.name.replace(new RegExp(`\\[${index - 1}\\]`, 'g'), `[${index}]`);
            input.value = '';
          }
        });
        // Update item number display
        const headerSpan = newItem.querySelector('.array-item-header span');
        if (headerSpan) {
          headerSpan.textContent = `Item ${index + 1}`;
        }
      } else {
        newItem = createNewArrayItem(prefix, index);
      }
      
      container.appendChild(newItem);
    }
    
    function createNewArrayItem(prefix, index) {
      const div = document.createElement('div');
      div.className = 'array-item';
      div.innerHTML = `
        <div class="array-item-header">
          <span>Item ${index + 1}</span>
          <button type="button" class="btn-remove-item" onclick="removeArrayItem(this)"><i class="fas fa-times"></i></button>
        </div>
        <div class="form-group">
          <label>Item ${index + 1}</label>
          <div style="display: flex; gap: 8px;">
            <input type="text" name="${prefix}[${index}]" class="form-input" placeholder="Enter value" style="flex: 1;">
            <button type="button" class="btn-remove-item" onclick="removeArrayItem(this)"><i class="fas fa-times"></i></button>
          </div>
        </div>
      `;
      return div;
    }
    
    function removeArrayItem(btn) {
      if (confirm('Are you sure you want to remove this item?')) {
        const item = btn.closest('.array-item');
        const container = item.closest('.array-container');
        item.remove();
        
        // Renumber remaining items
        const remainingItems = container.querySelectorAll('.array-item');
        remainingItems.forEach((item, newIndex) => {
          // Update item number display
          const headerSpan = item.querySelector('.array-item-header span');
          if (headerSpan) {
            headerSpan.textContent = `Item ${newIndex + 1}`;
          }
          // Update input names
          item.querySelectorAll('input, textarea, select').forEach(input => {
            if (input.name) {
              input.name = input.name.replace(/\[(\d+)\]/, `[${newIndex}]`);
            }
          });
        });
      }
    }
    
    // Image upload functionality
    document.addEventListener('DOMContentLoaded', function() {
      const fileInputs = document.querySelectorAll('.image-file-input');
      
      fileInputs.forEach(input => {
        input.addEventListener('change', function(e) {
          const file = e.target.files[0];
          if (!file) return;
          
          const fieldName = this.getAttribute('data-field');
          const urlInput = document.querySelector(`input[name="${fieldName}"]`);
          const wrapper = urlInput.closest('.image-upload-wrapper');
          const previewContainer = wrapper.querySelector('.image-preview-container');
          const uploadBtn = wrapper.querySelector('.btn-upload-image');
          
          // Show loading state
          wrapper.classList.add('uploading');
          uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
          
          // Create FormData
          const formData = new FormData();
          formData.append('image', file);
          
          // Upload file
          fetch('upload.php', {
            method: 'POST',
            body: formData
          })
          .then(response => response.json())
          .then(data => {
            wrapper.classList.remove('uploading');
            
            if (data.success) {
              // Update URL input
              urlInput.value = data.url;
              
              // Update preview
              const img = previewContainer.querySelector('.image-preview');
              if (img) {
                img.src = data.url;
                img.style.display = 'block';
              } else {
                const newImg = document.createElement('img');
                newImg.src = data.url;
                newImg.alt = 'Preview';
                newImg.className = 'image-preview';
                previewContainer.innerHTML = '';
                previewContainer.appendChild(newImg);
              }
              
              // Show success message
              uploadBtn.innerHTML = '<i class="fas fa-check"></i> Uploaded!';
              uploadBtn.style.background = '#48bb78';
              
              setTimeout(() => {
                uploadBtn.innerHTML = '<i class="fas fa-upload"></i> Choose from Device';
                uploadBtn.style.background = '';
              }, 2000);
            } else {
              alert('Upload failed: ' + (data.error || 'Unknown error'));
              uploadBtn.innerHTML = '<i class="fas fa-upload"></i> Choose from Device';
            }
          })
          .catch(error => {
            wrapper.classList.remove('uploading');
            alert('Upload error: ' + error.message);
            uploadBtn.innerHTML = '<i class="fas fa-upload"></i> Choose from Device';
          });
          
          // Reset file input
          this.value = '';
        });
      });
    });
  </script>
</head>
<body>
  <button class="sidebar-toggle" onclick="toggleSidebar()">
    <i class="fas fa-bars"></i>
  </button>

  <div class="main-content">
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
        
        <?php echo generateFormFields($formData); ?>
        
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
          <div class="status-message status-success">
            <i class="fas fa-check-circle"></i>
            <?php echo htmlspecialchars($status, ENT_QUOTES, 'UTF-8'); ?>
          </div>
        <?php endif; ?>
      </form>
    </div>
  </div>
  </div>
  
  <!-- Sidebar -->
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
        <?php
        $pageIcons = [
            'home' => 'fa-home',
            'about' => 'fa-info-circle',
            'services' => 'fa-briefcase',
            'process' => 'fa-cogs',
            'plansPage' => 'fa-chart-line',
            'reports' => 'fa-file-alt',
            'blogPage' => 'fa-blog',
            'faq' => 'fa-question-circle',
            'contact' => 'fa-envelope',
        ];
        foreach ($pages as $p):
            if (isset($pageIcons[$p])):
                $isActive = $page === $p;
        ?>
        <a href="content.php?page=<?php echo $p; ?>&lang=<?php echo $lang; ?>" 
           class="nav-item <?php echo $isActive ? 'active' : ''; ?>">
          <i class="fas <?php echo $pageIcons[$p]; ?>"></i>
          <span><?php echo isset($pageNames[$p]) ? $pageNames[$p] : ucfirst($p); ?></span>
        </a>
        <?php
            endif;
        endforeach;
        ?>
      </div>
      <div class="nav-section">
        <div class="nav-section-title">Settings</div>
        <a href="content.php?page=footer&lang=<?php echo $lang; ?>" 
           class="nav-item <?php echo $page === 'footer' ? 'active' : ''; ?>">
          <i class="fas fa-window-minimize"></i>
          <span>Footer</span>
        </a>
        <a href="content.php?page=nav&lang=<?php echo $lang; ?>" 
           class="nav-item <?php echo $page === 'nav' ? 'active' : ''; ?>">
          <i class="fas fa-bars"></i>
          <span>Navigation</span>
        </a>
        <a href="content.php?page=brand&lang=<?php echo $lang; ?>" 
           class="nav-item <?php echo $page === 'brand' ? 'active' : ''; ?>">
          <i class="fas fa-tag"></i>
          <span>Brand</span>
        </a>
      </div>
      <div class="nav-section">
        <div class="nav-section-title">System</div>
        <a href="submissions.php" class="nav-item">
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
</body>
</html>
