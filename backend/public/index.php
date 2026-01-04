<?php

// Basic lightweight router for API

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = trim($uri, '/');

// If it's an admin panel request, let PHP serve it directly (don't route it)
if (strpos($path, 'admin') === 0) {
    // Let PHP's built-in server handle admin files directly
    // Return false to tell PHP server to serve the file if it exists
    return false;
}

// If it's a direct file request (has extension), don't route it
if (preg_match('/\.(php|html|css|js|png|jpg|jpeg|gif|ico|svg)$/i', $path)) {
    return false;
}

$config = require __DIR__ . '/../config.php';

header('Access-Control-Allow-Origin: ' . $config['cors']['allowed_origin']);
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require __DIR__ . '/../db.php';
require __DIR__ . '/../auth.php';
require __DIR__ . '/../helpers.php';

$pdo = get_pdo($config['db']);

$method = $_SERVER['REQUEST_METHOD'];

// Normalize path (strip leading slash and possible "api/")
$segments = explode('/', $path);
if ($segments[0] === 'api') {
    array_shift($segments);
}

// Routes
if ($segments[0] === 'auth' && $method === 'POST' && ($segments[1] ?? '') === 'login') {
    handle_login($pdo, $config);
}

if ($segments[0] === 'public' && ($segments[1] ?? '') === 'i18n' && $method === 'GET') {
    $lang = $_GET['lang'] ?? null; // optional
    handle_public_i18n($pdo, $lang);
}

if ($segments[0] === 'admin') {
    $payload = require_auth_or_fail($config['jwt']);

    if (($segments[1] ?? '') === 'content') {
        $page = $segments[2] ?? null;
        $lang = $_GET['lang'] ?? 'en';

        if ($method === 'GET' && !$page) {
            handle_admin_get_all($pdo, $lang);
        } elseif ($method === 'GET' && $page) {
            handle_admin_get_page($pdo, $page, $lang);
        } elseif ($method === 'PUT' && $page) {
            handle_admin_put_page($pdo, $page, $lang);
        }
    }
}

json_response(['error' => 'Not found'], 404);

// Handlers
function handle_login(PDO $pdo, array $config): void
{
    $body = read_json_body();
    require_fields($body, ['email', 'password']);

    $stmt = $pdo->prepare('SELECT id, name, email, password_hash, role FROM users WHERE email = :email LIMIT 1');
    $stmt->execute(['email' => $body['email']]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($body['password'], $user['password_hash'])) {
        json_response(['error' => 'Invalid credentials'], 401);
    }

    $token = jwt_generate([
        'sub' => $user['id'],
        'email' => $user['email'],
        'role' => $user['role'],
    ], $config['jwt']);

    json_response([
        'token' => $token,
        'user' => [
          'id' => $user['id'],
          'name' => $user['name'],
          'email' => $user['email'],
          'role' => $user['role'],
        ],
    ]);
}

function handle_public_i18n(PDO $pdo, ?string $lang): void
{
    $langs = $lang ? [$lang] : ['en', 'ne'];
    $result = [];
    foreach ($langs as $ln) {
        $result[$ln] = load_translation($pdo, $ln);
    }
    json_response(['translations' => $result]);
}

function handle_admin_get_all(PDO $pdo, string $lang): void
{
    $stmt = $pdo->prepare('SELECT page, lang, data, updated_at FROM content_blocks WHERE lang = :lang');
    $stmt->execute(['lang' => $lang]);
    $rows = $stmt->fetchAll();
    json_response(['items' => $rows]);
}

function handle_admin_get_page(PDO $pdo, string $page, string $lang): void
{
    $stmt = $pdo->prepare('SELECT page, lang, data, updated_at FROM content_blocks WHERE page = :page AND lang = :lang LIMIT 1');
    $stmt->execute(['page' => $page, 'lang' => $lang]);
    $row = $stmt->fetch();
    if (!$row) {
        json_response(['error' => 'Not found'], 404);
    }
    json_response($row);
}

function handle_admin_put_page(PDO $pdo, string $page, string $lang): void
{
    $body = read_json_body();
    require_fields($body, ['data']);

    $json = json_encode($body['data']);
    if (json_last_error() !== JSON_ERROR_NONE) {
        json_response(['error' => 'Invalid data JSON'], 400);
    }

    $stmt = $pdo->prepare('SELECT id, data FROM content_blocks WHERE page = :page AND lang = :lang LIMIT 1');
    $stmt->execute(['page' => $page, 'lang' => $lang]);
    $existing = $stmt->fetch();

    if ($existing) {
        $stmt = $pdo->prepare('UPDATE content_blocks SET data = :data, updated_at = NOW() WHERE id = :id');
        $stmt->execute(['data' => $json, 'id' => $existing['id']]);
    } else {
        $stmt = $pdo->prepare('INSERT INTO content_blocks (page, lang, data, updated_at) VALUES (:page, :lang, :data, NOW())');
        $stmt->execute(['page' => $page, 'lang' => $lang, 'data' => $json]);
    }

    json_response(['status' => 'ok']);
}

function load_translation(PDO $pdo, string $lang): array
{
    $stmt = $pdo->prepare('SELECT page, data FROM content_blocks WHERE lang = :lang');
    $stmt->execute(['lang' => $lang]);
    $rows = $stmt->fetchAll();
    $translation = [];
    foreach ($rows as $row) {
        $data = json_decode($row['data'], true) ?: [];
        $translation = merge_translation($translation, $data);
    }
    return $translation;
}

function require_auth_or_fail(array $jwtConfig)
{
    $token = get_bearer_token();
    if (!$token) {
        json_response(['error' => 'Missing token'], 401);
    }
    $payload = jwt_verify($token, $jwtConfig);
    if (!$payload || ($payload['role'] ?? '') !== 'admin') {
        json_response(['error' => 'Unauthorized'], 401);
    }
    return $payload;
}

