<?php
    require_once $_SERVER['DOCUMENT_ROOT'] . '/php/config.php';
    require_once ROOT_DIR . '/php/modules/Api.php';

    define('HTTP_METHOD', $_SERVER['REQUEST_METHOD']);

    header('Content-Type: application/json');
    header("Access-Control-Allow-Origin: *");

    if (HTTP_METHOD === 'GET') {
        $api = new Api;
        
        $resp = $api->clear_expired_tokens();

        if ($resp->status === 'success') {
            http_response_code(200);
        } else {
            http_response_code($resp->statusCode);
        }
    } else {
        http_response_code(405);
    }

?>