<?php
    require_once $_SERVER['DOCUMENT_ROOT'] . '/php/config.php';
    require_once ROOT_DIR . '/php/modules/Api.php';

    define('HTTP_METHOD', $_SERVER['REQUEST_METHOD']);

    header('Content-Type: application/json');
    header("Access-Control-Allow-Origin: *");

    if (HTTP_METHOD === 'GET') {
        if (isset($_GET['token'])) {
            $api = new Api;
            $resp = $api->get_messages($_GET['token']);

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