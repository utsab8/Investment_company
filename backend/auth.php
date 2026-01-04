<?php

function jwt_generate(array $payload, array $jwtConfig): string
{
    $header = ['alg' => 'HS256', 'typ' => 'JWT'];
    $now = time();
    $payload = array_merge($payload, [
        'iat' => $now,
        'exp' => $now + ($jwtConfig['expire_hours'] * 3600),
        'iss' => $jwtConfig['issuer'],
    ]);

    $segments = [];
    $segments[] = base64url_encode(json_encode($header));
    $segments[] = base64url_encode(json_encode($payload));
    $signing_input = implode('.', $segments);
    $signature = hash_hmac('sha256', $signing_input, $jwtConfig['secret'], true);
    $segments[] = base64url_encode($signature);
    return implode('.', $segments);
}

function jwt_verify(string $token, array $jwtConfig)
{
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        return false;
    }
    [$header64, $payload64, $signature64] = $parts;
    $signing_input = $header64 . '.' . $payload64;
    $expected = base64url_encode(hash_hmac('sha256', $signing_input, $jwtConfig['secret'], true));

    if (!hash_equals($expected, $signature64)) {
        return false;
    }

    $payload = json_decode(base64url_decode($payload64), true);
    if (!$payload || !isset($payload['exp']) || $payload['exp'] < time()) {
        return false;
    }

    return $payload;
}

function base64url_encode(string $data): string
{
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64url_decode(string $data): string
{
    $remainder = strlen($data) % 4;
    if ($remainder) {
        $data .= str_repeat('=', 4 - $remainder);
    }
    return base64_decode(strtr($data, '-_', '+/'));
}


