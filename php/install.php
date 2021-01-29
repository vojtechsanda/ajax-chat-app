<!DOCTYPE html>
<html lang="cs">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Chat app instalation</title>
        <style>
            .status {
                font-weight: bold;
            }
            .status--success {
                color: green;
            }
            .status--error {
                color: red;
            }
        </style>
    </head>
    <body>
        <h1>Chat app instalation</h1>
        <?php
        require_once $_SERVER['DOCUMENT_ROOT'] . '/php/config.php';

        $mysqli = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);
        $mysqli->set_charset('utf8');

        if ($mysqli->connect_errno) {
            die($mysqli->connect_errno);
        }

        //
        // Auth tokens
        //
        echo '<strong>Auth tokens table:</strong> ';
        $auth_tokens_table_sql = 'CREATE TABLE IF NOT EXISTS `'. DB_PREFIX .'authentication_tokens` (
            `id` INT(11) UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
            `user_id` INT(11) UNSIGNED NOT NULL,
            `token` VARCHAR(255) NOT NULL,
            `creation_timestamp` INT(11) NOT NULL,
            `expire_timestamp` INT(11) NOT NULL
        )';

        if (!$mysqli->query($auth_tokens_table_sql)) {
            echo '<span class="status status--error">Error</span> -> ' . $mysqli->error;
        } else {
            echo '<span class="status status--success">Success</span>';
        }
        echo '<br>';

        //
        // Messages
        //
        echo '<strong>Messages table:</strong> ';
        $messages_table_sql = 'CREATE TABLE IF NOT EXISTS `'. DB_PREFIX .'messages` (
            `id` INT(11) UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
            `user_id` INT(11) UNSIGNED NOT NULL,
            `message` TEXT NOT NULL,
            `timestamp` INT(11) NOT NULL
        )';

        if (!$mysqli->query($messages_table_sql)) {
            echo '<span class="status status--error">Error</span> -> ' . $mysqli->error;
        } else {
            echo '<span class="status status--success">Success</span>';
        }
        echo '<br>';

        //
        // Users
        //
        echo '<strong>Users table:</strong> ';
        $messages_table_sql = 'CREATE TABLE IF NOT EXISTS `'. DB_PREFIX .'users` (
            `id` INT(11) UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
            `email` VARCHAR(255) NOT NULL,
            `password` VARCHAR(255) NOT NULL
        )';

        if (!$mysqli->query($messages_table_sql)) {
            echo '<span class="status status--error">Error</span> -> ' . $mysqli->error;
        } else {
            echo '<span class="status status--success">Success</span>';
        }
        echo '<br>';
        ?>
    </body>
</html>