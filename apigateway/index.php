<?php

$rateLimit = 100; // Número máximo de requisições permitidas
$rateLimitTime = 60 * 2; // Janela de tempo em segundos
$penaltyTime = 300; // Tempo de penalidade em segundos (por exemplo, 5 minutos)

$clientIp = $_SERVER['REMOTE_ADDR'];

// Função para sanitizar o endereço IP para uso como nome de arquivo
function sanitizeIp($ip) {
    // Substitui dois-pontos e outros caracteres por sublinhados
    return str_replace([':', '.'], '_', $ip);
}

$rateLimitFile = __DIR__ . "/rate_limit/" . sanitizeIp($clientIp) . ".txt";

// Função para obter o número atual de requisições do IP
function getRequestCount($rateLimitFile, $rateLimitTime, $penaltyTime) {
    if (!file_exists($rateLimitFile)) {
        return [0, 0];
    }
    $data = file_get_contents($rateLimitFile);
    $requestInfo = explode(':', $data);
    $requestTime = (int)$requestInfo[0];
    $requestCount = (int)$requestInfo[1];
    $blockedUntil = isset($requestInfo[2]) ? (int)$requestInfo[2] : 0;

    // Verifica se o IP está bloqueado
    if (time() < $blockedUntil) {
        return [-1, $blockedUntil];
    }

    // Redefine o contador se a janela de tempo tiver passado
    if (time() - $requestTime > $rateLimitTime) {
        return [0, 0];
    }
    return [$requestCount, $blockedUntil];
}

list($requestCount, $blockedUntil) = getRequestCount($rateLimitFile, $rateLimitTime, $penaltyTime);

// Função para incrementar o contador de requisições
function incrementRequestCount($rateLimitFile, $requestCount, $penaltyTime) {
    if ($requestCount === -1) {
        // IP está bloqueado
        return;
    }

    $requestTime = time();
    $newRequestCount = $requestCount + 1;
    $newBlockedUntil = ($newRequestCount >= $GLOBALS['rateLimit']) ? $requestTime + $penaltyTime : 0;
    file_put_contents($rateLimitFile, $requestTime . ':' . $newRequestCount . ':' . $newBlockedUntil);
}

if ($requestCount === -1) {
    http_response_code(429); // Muitas requisições
    echo json_encode(["message" => "Temporariamente bloqueado. Tente novamente em " . ($blockedUntil - time()) . " segundos."]);
    exit();
}

if ($requestCount >= $rateLimit) {
    http_response_code(429); // Muitas requisições
    echo json_encode(["message" => "Limite de requisições excedido. Tente novamente mais tarde."]);
    exit();
}

// Requisição permitida, incrementa o contador
incrementRequestCount($rateLimitFile, $requestCount, $penaltyTime);

// Continuação do processamento da requisição...




header("Access-Control-Allow-Origin: http://localhost:5500");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    //incrementRequestCount($rateLimitFile, $rateLimitTime, $penaltyTime); 
    exit();
}
// $details = json_decode(file_get_contents("http://ip-api.com/json/{$clientIp}"));
// var_dump($details);exit;
$apiBaseUrlAuth = 'http://localhost:1000/index.php';
$apiBaseUrlProdutos = 'http://localhost:2000/index.php';
$apiKey = 'godNotExist';

$requestUri = $_SERVER['REQUEST_URI'];
$parsedUrl = parse_url($requestUri);
$path = $parsedUrl['path'];
$queryString = isset($parsedUrl['query']) ? '?' . $parsedUrl['query'] : '';
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
        if($path==='/auth/login' || $path==='/auth/register'){
            $apiUrl = $apiBaseUrlAuth . $mappedRoute;
            break;
        }
        $apiUrl = $apiBaseUrlProdutos . $mappedRoute. $queryString;
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
    'X-Authorization: ' . ($_SERVER['HTTP_AUTHORIZATION'] ?? '')
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


$response = curl_exec($ch);

if ($response === false) {
    http_response_code(500);
    echo json_encode(['message' => 'Failed to connect to the API server']);
    exit();
}

http_response_code(200);
header('Content-Type: application/json');
echo $response;
exit;
?>
