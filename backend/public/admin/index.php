<?php
session_start();
if (isset($_SESSION['user'])) {
    header('Location: content.php');
    exit;
}
header('Location: login.php');
exit;

