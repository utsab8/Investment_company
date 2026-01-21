<?php
/**
 * Validation Utility Class
 * Handles input validation and sanitization
 */

class Validation {
    /**
     * Validate email
     * @param string $email
     * @return bool
     */
    public static function validateEmail($email) {
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }

    /**
     * Validate required fields
     * @param array $data
     * @param array $required
     * @return array
     */
    public static function validateRequired($data, $required) {
        $errors = [];
        foreach ($required as $field) {
            if (!isset($data[$field]) || empty(trim($data[$field]))) {
                $errors[$field] = ucfirst($field) . ' is required';
            }
        }
        return $errors;
    }

    /**
     * Sanitize string
     * @param string $input
     * @return string
     */
    public static function sanitizeString($input) {
        return htmlspecialchars(strip_tags(trim($input)), ENT_QUOTES, 'UTF-8');
    }

    /**
     * Sanitize array
     * @param array $data
     * @return array
     */
    public static function sanitizeArray($data) {
        $sanitized = [];
        foreach ($data as $key => $value) {
            if (is_array($value)) {
                $sanitized[$key] = self::sanitizeArray($value);
            } else {
                $sanitized[$key] = self::sanitizeString($value);
            }
        }
        return $sanitized;
    }

    /**
     * Validate phone number
     * @param string $phone
     * @return bool
     */
    public static function validatePhone($phone) {
        $phone = preg_replace('/[^0-9+()-]/', '', $phone);
        return strlen($phone) >= 10;
    }

    /**
     * Validate URL
     * @param string $url
     * @return bool
     */
    public static function validateUrl($url) {
        return filter_var($url, FILTER_VALIDATE_URL) !== false;
    }
}

