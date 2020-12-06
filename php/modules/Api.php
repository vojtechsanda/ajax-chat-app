<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/php/config.php';
require_once ROOT_DIR . '/php/utilities/__html.php';
require_once ROOT_DIR . '/php/modules/DB.php';

class Api {
    private $db;
    
    public function __construct() {
        $this->db = new DB(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);
    }
    public function register($email, $password) {
        $email = __html($email);
        $password = __html($password);

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return (object) [
                "status" => "error",
                "statusCode" => 400,
                "message" => "Invalid email"
            ];
        }

        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        if (count($this->db->select('SELECT * FROM `users` WHERE `email`=?', true, [$email])) !== 0) {
            return (object) [
                "status" => "error",
                "statusCode" => 500,
                "message" => "Users already exists"
            ];
        }

        if (!($resp = $this->db->insert('INSERT INTO `users` (`email`, `password`) VALUES (?, ?)', true, [$email, $hashed_password]))) {
            return (object) [
                "status" => "error",
                "statusCode" => 500,
                "message" => "User cannot be inserted into the table."
            ];
        }

        return (object) [
            "status" => "success",
            "message" => "User was created",
            "data" => (object) [
                "id" => $this->db->mysqli->insert_id,
                "email" => $email
            ]
        ];
    }
    public function authenticateUser($email, $password) {
        $email = __html($email);
        $password = __html($password);

        if (!($user_credentials = $this->db->select('SELECT * FROM `users` WHERE `email`=?', true, [$email]))) {
            return (object) [
                "status" => "error",
                "statusCode" => 401,
                "message" => "Email is not registered",
            ];
        }

        $user_credentials = $user_credentials[0];

        if (!password_verify($password, $user_credentials->password)) {
            return (object) [
                "status" => "error",
                "statusCode" => 401,
                "message" => "Wrong password",
            ];
        }
        
        do {
            $token = $this->generateToken(255);
        } while ($this->db->select('SELECT * FROM `users` WHERE `token`=?', true, [$token]));

        $date = new DateTime();
        $current_timestamp = $date->getTimestamp();
        $expire_timestamp = $current_timestamp + 604800;

        if (!($resp = $this->db->insert('INSERT INTO `authentication_tokens` (`user_id`, `token`, `creation_timestamp`, `expire_timestamp`) VALUES (?, ?, ?, ?)', true, [$user_credentials->id, $token, $current_timestamp, $expire_timestamp]))) {
            return (object) [
                "status" => "error",
                "statusCode" => 500,
                "message" => "Token cannot be inserted into the table."
            ];
        }

        return (object) [
            "status" => "success",
            "message" => "Token was created",
            "data" => (object) [
                "email" => $email,
                "token" => $token,
                "expire_timestamp" => $expire_timestamp
            ]
        ];
    }
    private function generateToken($length) {
        $token = '';
        while (strlen($token) < $length) {
            $token .= str_shuffle(password_hash($token.$length, PASSWORD_DEFAULT));
        }

        $token = substr(str_shuffle($token), 0, $length);

        return $token;
    }
}
