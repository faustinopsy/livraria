<?php
return [
    'client_id' => 'YOUR_PAYPAL_CLIENT_ID',
    'secret' => 'YOUR_PAYPAL_SECRET',
    'settings' => [
        'mode' => 'sandbox', // or 'live' for production
        'http.ConnectionTimeOut' => 30,
        'log.LogEnabled' => true,
        'log.FileName' =>  'paypal.log',
        'log.LogLevel' => 'ERROR'
    ]
];
