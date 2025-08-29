<?php
// Database connection settings
$host = "localhost";      // your DB host (use 127.0.0.1 if local)
$db   = "portfolio";   // your database name
$user = "root";           // your DB username
$pass = "";               // your DB password (set it if you have one)

// Create connection
$conn = new mysqli($host, $user, $pass, $db);

// Check connection
if ($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
}
?>
