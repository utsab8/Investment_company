<?php
// Basic configuration for database and JWT

return [
    'db' => [
        'host' => '127.0.0.1',
        'port' => '3306',
        'name' => 'Investment',
        'user' => 'root',
        'pass' => 'utsab12@',
        'charset' => 'utf8mb4',
    ],
    'jwt' => [
        'secret' => 'change-this-secret-key',
        'issuer' => 'investment-company',
        'expire_hours' => 24,
    ],
    'cors' => [
        // Adjust to your frontend origin
        'allowed_origin' => '*',
    ],
];

