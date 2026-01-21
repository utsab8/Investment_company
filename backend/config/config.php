<?php
/**
 * Application Configuration
 * MRB International - Investment Company
 */

// Error reporting (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../logs/error.log');

// Timezone
date_default_timezone_set('UTC');

// Application settings
define('APP_NAME', 'MRB International');
define('APP_VERSION', '1.0.0');
define('API_VERSION', 'v1');

// CORS Configuration
define('ALLOWED_ORIGINS', [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001'
]);

// Database Configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'MRB_INTERNATIONAL');
define('DB_USER', 'root');
define('DB_PASS', 'utsab12@');
define('DB_CHARSET', 'utf8mb4');

// File upload settings
define('UPLOAD_DIR', __DIR__ . '/../uploads/');
define('MAX_FILE_SIZE', 5242880); // 5MB
define('ALLOWED_FILE_TYPES', ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png']);

// Response settings
define('DEFAULT_TIMEZONE', 'UTC');
define('DATE_FORMAT', 'Y-m-d H:i:s');

