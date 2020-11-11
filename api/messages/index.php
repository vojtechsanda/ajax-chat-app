<?php

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
    
    header('Content-Type: application/json');
    header("Access-Control-Allow-Origin: *");
    
    echo json_encode($data);


?>