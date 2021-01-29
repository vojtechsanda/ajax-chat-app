<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/php/config.php';
require_once ROOT_DIR . '/php/utilities/__html.php';
require_once ROOT_DIR . '/php/modules/DB.php';

class Api {
    private $db;
    
    public function __construct() {
        $this->db = new DB(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);
    }
    public function get_user($token, $user_id) {
        $token = __html($token);
        $user_id = __html($user_id);

        $advanced_token = $this->verifyToken($token);

        if (!$advanced_token) {
            return (object) [
                "status" => "error",
                "statusCode" => 401,
                "message" => "Invalid token"
            ];
        }

        $user_id = intval($user_id);
        
        if ($user_id < 0) {
            $user_id = $advanced_token->user_id;
        }

        $result = $this->db->select('SELECT `id`, `email` FROM `users` WHERE `id`=?', true, [$user_id]);
        if (sizeof($result) === 0) {
            $result = $this->db->select('SELECT `id`, `email` FROM `users` WHERE `id`=?', true, [$advanced_token->user_id]);
        }
        $result = $result[0];
        
        return (object) [
            "status" => "success",
            "message" => "User was provided",
            "data" => $result
        ];
    }
    public function get_messages($token, $last_verified_id) {
        $token = __html($token);
        $last_verified_id = __html($last_verified_id);

        $advanced_token = $this->verifyToken($token);

        if (!$advanced_token) {
            return (object) [
                "status" => "error",
                "statusCode" => 401,
                "message" => "Invalid token"
            ];
        }

        if ($last_verified_id > -1) {
            $result = $this->db->select('SELECT `messages`.*, `users`.`email` AS `user_email` FROM `messages` JOIN `users` ON `messages`.`user_id` = `users`.`id` WHERE `messages`.`id` > ?', true, [$last_verified_id]);
        } else {
            $result = $this->db->select('SELECT `messages`.*, `users`.`email` AS `user_email` FROM `messages` JOIN `users` ON `messages`.`user_id` = `users`.`id` ORDER BY `messages`.`id` DESC LIMIT 10');
            $result = array_reverse($result);
        }

        foreach ($result as $row) {
            $username = explode('@', $row->user_email)[0];

            if (strlen($username) > 15) {
                $short_username = substr($username, 0, 13) . '...';
            } else {
                $short_username = $username;
            }

            $row->id = intval($row->id);
            $row->user = (object) [];
            $row->user->id = intval($row->user_id);
            $row->user->username = $username;
            $row->user->short_username = $short_username;

            unset($row->user_id);
            unset($row->user_email);
        }

        return (object) [
            "status" => "success",
            "message" => "Messages were provided",
            "data" => $result
        ];
    }
    public function send_message($token, $message) {
        $token = __html($token);
        $message = __html($message);

        $advanced_token = $this->verifyToken($token);

        if (!$advanced_token) {
            return (object) [
                "status" => "error",
                "statusCode" => 401,
                "message" => "Invalid token"
            ];
        }

        $current_timestamp = time();
        $result = $this->db->insert('INSERT INTO `messages` (`user_id`, `message`, `timestamp`) VALUES (?, ?, ?)', true, [$advanced_token->user_id, $message, $current_timestamp]);

        if (!$result) {
            return (object) [
                "status" => "error",
                "statusCode" => 500,
                "message" => "Cannot save the message to DB"
            ];
        }

        return (object) [
            "status" => "success",
            "message" => "User was created",
            "data" => (object) [
                "id" => $this->db->mysqli->insert_id,
                "user_id" => $advanced_token->user_id,
                "message" => $message,
                "timestamp" => $current_timestamp
            ]
        ];
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
    private function verifyToken($token) {
        $advanced_tokens = $this->db->select('SELECT * FROM `authentication_tokens` WHERE `token` = ?', true, [$token]);

        if (count($advanced_tokens) === 0) {
            return false;
        }

        return $advanced_tokens[0];
    }
}
