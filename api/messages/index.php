<?php
    require_once '../../php/config.php';
    require_once '../../php/DB.php';
    require_once '../../php/__html.php';

    define('HTTP_METHOD', $_SERVER['REQUEST_METHOD']);

    header('Content-Type: application/json');
    header("Access-Control-Allow-Origin: *");

    $db = new DB(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);

    $data = [
        (object) [
            'from' => 'me',
            'timestamp' => 1605089409654,
            'message' => 'Hello there'
        ],
        (object) [
            'from' => 'person',
            'timestamp' => 1605089510654,
            'message' => 'Hi'
        ],
        (object) [
            'from' => 'me',
            'timestamp' => 1605089511654,
            'message' => 'How you doin?'
        ],
        (object) [
            'from' => 'person',
            'timestamp' => 1605089511654,
            'message' => 'Fine, you?'
        ],
        (object) [
            'from' => 'me',
            'timestamp' => 1605089511654,
            'message' => 'Hell yeah, it\'s working'
        ],
        (object) [
            'from' => 'me',
            'timestamp' => 1605089511654,
            'message' => 'Boooom'
        ],
        (object) [
            'from' => 'person',
            'timestamp' => 1605089511654,
            'message' => 'hahah'
        ]
    ];
    

    
    if (HTTP_METHOD === 'GET') {
        if (isset($_GET['hash'])) {
            $limit = isset($_GET['limit']) ? __html($_GET['limit']) : 1;
            $query = 'SELECT * FROM `chat` ORDER BY `id` DESC LIMIT ?';
            $messages = $db->select($query, true, [$limit]);

            $messages = array_reverse($messages);
            
            $public_messages_response = array_map(function($mess) {
                $user_hash = __html($_GET['hash']);

                if ($mess->sender_hash !== $user_hash) {
                    $mess->sender_hash = null;
                }
                return $mess;
            },$messages);

            echo json_encode($public_messages_response);
        } else {
            http_response_code(400);
        }
    } else if (HTTP_METHOD === 'POST') {
        // $db->insert('INSERT INTO `chat` (`sender_hash`, `message`) VALUES ("Ax8s6yaWD3asd2gnj74kS", "Hello there")');
    } else {
        http_response_code(405);
    }


?>