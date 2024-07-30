<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$apiBaseUrl = 'http://localhost/livraria/src/index.php';
$apiKey = 'godNotExist';

$requestUri = $_SERVER['REQUEST_URI'];
$parsedUrl = parse_url($requestUri);
$path = $parsedUrl['path'];
$lookupTable = [
    '/auth/register' => '/auth/register',
    '/auth/login' => '/auth/login',
    '/products' => '/products',
    '/purchased-products' => '/purchased-products',
    '/checkout' => '/checkout',
    '/admin/reservations' => '/admin/reservations',
    '/admin/update-status' => '/admin/update-status',
    '/admin/remove-reservation' => '/admin/remove-reservation',
    '/admin/sales' => '/admin/sales'
];

$apiUrl = null;

foreach ($lookupTable as $route => $mappedRoute) {
    if (preg_match("#^{$route}$#", $path)) {
        $apiUrl = $apiBaseUrl . $mappedRoute;
        break;
    }
}

if ($apiUrl === null) {
    http_response_code(404);
    echo json_encode(['message' => 'Not Found']);
    exit();
}

$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'X-API-KEY: ' . $apiKey,
    'Authorization: ' . ($_SERVER['HTTP_AUTHORIZATION'] ?? '')
]);

switch ($_SERVER['REQUEST_METHOD']) {
    case 'POST':
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, file_get_contents('php://input'));
        break;
    case 'PUT':
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
        curl_setopt($ch, CURLOPT_POSTFIELDS, file_get_contents('php://input'));
        break;
    case 'DELETE':
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
        curl_setopt($ch, CURLOPT_POSTFIELDS, file_get_contents('php://input'));
        break;
    default:
        break;
}

curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
$response = curl_exec($ch);

if ($response === false) {
    http_response_code(500);
    echo json_encode(['message' => 'Failed to connect to the API server']);
    exit();
}

http_response_code(200);
header('Content-Type: application/json');
echo $response;
?>
