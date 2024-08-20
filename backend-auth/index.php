<?php
error_reporting(E_ALL & ~E_DEPRECATED);

require 'vendor/autoload.php';

use src\config\Database;
use src\controllers\AuthController;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

define('API_KEY', 'godNotExist');

function isAuthorized() {
    $headers = getallheaders();
    try {
        if (isset($headers['X-API-KEY']) && $headers['X-API-KEY'] === API_KEY) {
            return true;
        } else {
            throw new Exception("Invalid API Key");
        }
    } catch (Exception $e) {
        echo json_encode(["message" => "Acesso negado"]);
        http_response_code(401);
        exit();
    }
}
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Origin: http://localhost:8000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, X-API-KEY, HTTP_X_AUTHORIZATION");

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/');
$segredojwt = $dotenv->load();

$database = Database::getInstance($segredojwt);
$db = $database->getConnection();

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];
switch ($uri) {
    case '/index.php/auth/register':
        if ($method == 'POST') {
            $data = json_decode(file_get_contents("php://input"), true);
            $controller = new AuthController($db);
            $response = $controller->register($data);
            echo json_encode($response);
        }
        break;
    case '/index.php/auth/login':
        if ($method == 'POST') {
            $data = json_decode(file_get_contents("php://input"), true);
            $controller = new AuthController($db);
            $response = $controller->login($data,$segredojwt);
            echo json_encode($response);
        }
        break;
        default:
            echo json_encode(["message" => "Route not found"]);
            break;
}
