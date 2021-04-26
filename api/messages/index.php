<?php
    require_once $_SERVER['DOCUMENT_ROOT'] . '/php/config.php';
    require_once ROOT_DIR . '/php/modules/Api.php';

    define('HTTP_METHOD', $_SERVER['REQUEST_METHOD']);

    header('Content-Type: application/json');
    header("Access-Control-Allow-Origin: *");

    if (HTTP_METHOD === 'GET') {
        if (isset($_GET['token'])) {
            $api = new Api;
            
            if (isset($_GET['last_verified_id']) && is_numeric($_GET['last_verified_id'])) {
                $last_verified_id = $_GET['last_verified_id'];
            } else {
                $last_verified_id = -1;
            }

            if (isset($_GET['are_old_messages'])) {
                $are_old_messages = $_GET['are_old_messages'] === 'true' ? true : false;
            } else {
                $are_old_messages = false;
            }

            $resp = $api->get_messages($_GET['token'], $last_verified_id, $are_old_messages);

            if ($resp->status === 'success') {
                echo json_encode($resp->data);
                http_response_code(200);
            } else {
                http_response_code($resp->statusCode);
            }
        } else {
            http_response_code(400);
        }
    } else {
        http_response_code(405);
    }

?>