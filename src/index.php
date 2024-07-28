<?php
require '../vendor/autoload.php';

use src\config\Database;
use src\controllers\AuthController;
use src\controllers\ProductController;
use src\controllers\CheckoutController;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use src\controllers\PayPalController;

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dados = $dotenv->load();

$database = new Database($dados);
$db = $database->getConnection();

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

switch ($uri) {
    case '/src/auth/register':
        if ($method == 'POST') {
            $data = json_decode(file_get_contents("php://input"), true);
            $controller = new AuthController($db);
            $response = $controller->register($data);
            echo json_encode($response);
        }
        break;
    case '/src/auth/login':
        if ($method == 'POST') {
            $data = json_decode(file_get_contents("php://input"), true);
            $controller = new AuthController($db);
            $response = $controller->login($data,$dados);
            echo json_encode($response);
        }
        break;
    case '/src/products':
        if ($method == 'GET') {
            $controller = new ProductController($db);
            $response = $controller->getProducts();
            echo json_encode($response);
        }
        break;
    case '/src/purchased-products':
        if ($method == 'GET') {
            $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
            if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
                $jwt = $matches[1];
                try {
                    $decoded = JWT::decode($jwt, new Key($dados['JWT_SECRET'], ['HS256']));
                    $controller = new ProductController($db);
                    $response = $controller->getPurchasedProducts($decoded->sub);
                    echo json_encode($response);
                } catch (Exception $e) {
                    echo json_encode(["message" => "Access denied"]);
                    http_response_code(401);
                }
            } else {
                echo json_encode(["message" => "Authorization header not found"]);
                http_response_code(401);
            }
        }
        break;
    case '/src/checkout':
        if ($method == 'POST') {
            $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
            if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
                $jwt = $matches[1];
                try {
                    $decoded = JWT::decode($jwt, new Key($dados['JWT_SECRET'], 'HS256'));
                    $data = json_decode(file_get_contents("php://input"), true);
                    $controller = new CheckoutController($db,$dados);
                    $response = $controller->processCheckout($decoded->sub, $data);
                    echo json_encode($response);
                } catch (Exception $e) {
                    echo json_encode(["message" => "Access denied"]);
                    http_response_code(401);
                }
            } else {
                echo json_encode(["message" => "Authorization header not found"]);
                http_response_code(401);
            }
        }
        break;
    case '/src/paypal/create-payment':
        if ($method == 'POST') {
            $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
            if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
                $jwt = $matches[1];
                try {
                    $decoded = JWT::decode($jwt, new Key($dados['JWT_SECRET'], 'HS256'));
                    $data = json_decode(file_get_contents("php://input"), true);
                    $controller = new PayPalController();
                    $response = $controller->createPayment($data);
                    echo json_encode(['approval_url' => $response]);
                } catch (Exception $e) {
                    echo json_encode(["message" => "Access denied"]);
                    http_response_code(401);
                }
            } else {
                echo json_encode(["message" => "Authorization header not found"]);
                http_response_code(401);
            }
        }
        break;

    case '/src/paypal/execute-payment':
        if ($method == 'POST') {
            $paymentId = $_POST['paymentId'];
            $payerId = $_POST['payerId'];
            $controller = new PayPalController();
            $response = $controller->executePayment($paymentId, $payerId);
            echo json_encode($response);
        }
        break;
        default:
            echo json_encode(["message" => "Route not found"]);
            break;
}
