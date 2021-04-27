<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/php/config.php';
require_once ROOT_DIR . '/php/modules/DB.php';

class AntiSpam {
    private $db, $user;

    public function __construct() {
        $this->db = new DB(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);
        $this->user = (object) [];
    }

    public function can_send_message($user_id) {
        if (!isset($this->user->id)) {
            $this->user->id = $user_id;
        }

        if (!$this->is_cooldown_ok()) {
            return false;
        }

        return true;
    }

    private function is_cooldown_ok() {
        $last_second_messages = $this->db->select('SELECT `id` FROM `'. DB_PREFIX .'messages` WHERE `user_id`=? AND `timestamp`>? LIMIT 5', true, [$this->user->id, time() - 1]);

        if (sizeof($last_second_messages) >= 5) {
            return false;
        }

        return true;
    }
}