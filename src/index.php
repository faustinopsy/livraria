<?php
error_reporting(E_ALL & ~E_DEPRECATED);

require '../vendor/autoload.php';

use src\config\Database;
use src\controllers\AuthController;
use src\controllers\ProductController;
use src\controllers\CheckoutController;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use src\controllers\AdminController;

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$segredojwt = $dotenv->load();

$database = new Database($segredojwt);
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
            $response = $controller->login($data,$segredojwt);
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
                    $decoded = JWT::decode($jwt, new Key($segredojwt['JWT_SECRET'], 'HS256'));
                    $controller = new ProductController($db);
                    $response = $controller->getPurchasedProducts($decoded->data->userId);
                    echo json_encode($response);
                } catch (Exception $e) {
                    echo json_encode(["message" => "Acesso negado"]);
                    http_response_code(401);
                }
            } else {
                echo json_encode(["message" => "nenhuma autorização no cabeçalho"]);
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
                    $decoded = JWT::decode($jwt, new Key($segredojwt['JWT_SECRET'], 'HS256'));
                    $data = json_decode(file_get_contents("php://input"), true);
                    $controller = new CheckoutController($db);
                    $response = $controller->processCheckout($decoded->data->userId, $data);
                    echo json_encode($response);
                } catch (Exception $e) {
                    echo json_encode(["message" => "Acesso negado"]);
                    http_response_code(401);
                }
            } else {
                echo json_encode(["message" => "nenhuma autorização no cabeçalho"]);
                http_response_code(401);
            }
        }
        break;
        case '/src/admin/reservations':
            if ($method == 'GET') {
                $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
                if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
                    $jwt = $matches[1];
                    try {
                        $decoded = JWT::decode($jwt, new Key($segredojwt['JWT_SECRET'], 'HS256'));
                        if ($decoded->data->role !== 'admin') {
                            echo json_encode(["message" => "Acesso negado"]);
                            http_response_code(403);
                            exit;
                        }
                        $controller = new AdminController($db);
                        $response = $controller->getReservations();
                        echo json_encode($response);
                    } catch (Exception $e) {
                        echo json_encode(["message" => "Acesso negado"]);
                        http_response_code(401);
                    }
                } else {
                    echo json_encode(["message" => "nenhuma autorização no cabeçalho"]);
                    http_response_code(401);
                }
            }
            break;
        case '/src/admin/update-status':
            if ($method == 'POST') {
                $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
                if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
                    $jwt = $matches[1];
                    try {
                        $decoded = JWT::decode($jwt, new Key($segredojwt['JWT_SECRET'], 'HS256'));
                        if ($decoded->data->role !== 'admin') {
                            echo json_encode(["message" => "Acesso negado"]);
                            http_response_code(403);
                            exit;
                        }
                        $data = json_decode(file_get_contents("php://input"), true);
                        $controller = new AdminController($db);
                        $response = $controller->updateStatus($data['id'], $data['status']);
                        echo json_encode($response);
                    } catch (Exception $e) {
                        echo json_encode(["message" => "Acesso negado"]);
                        http_response_code(401);
                    }
                } else {
                    echo json_encode(["message" => "nenhuma autorização no cabeçalho"]);
                    http_response_code(401);
                }
            }
            break;
        case '/src/admin/remove-reservation':
            if ($method == 'POST') {
                $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
                if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
                    $jwt = $matches[1];
                    try {
                        $decoded = JWT::decode($jwt, new Key($segredojwt['JWT_SECRET'], 'HS256'));
                        if ($decoded->data->role !== 'admin') {
                            echo json_encode(["message" => "Acesso negado"]);
                            http_response_code(403);
                            exit;
                        }
                        $data = json_decode(file_get_contents("php://input"), true);
                        $controller = new AdminController($db);
                        $response = $controller->removeReservation($data['id']);
                        echo json_encode($response);
                    } catch (Exception $e) {
                        echo json_encode(["message" => "Acesso negado"]);
                        http_response_code(401);
                    }
                } else {
                    echo json_encode(["message" => "nenhuma autorização no cabeçalho"]);
                    http_response_code(401);
                }
            }
            break;
        case '/src/admin/sales':
            if ($method == 'GET') {
                $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
                if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
                    $jwt = $matches[1];
                    try {
                        $decoded = JWT::decode($jwt, new Key($segredojwt['JWT_SECRET'], 'HS256'));
                        if ($decoded->data->role !== 'admin') {
                            echo json_encode(["message" => "Access denied"]);
                            http_response_code(403);
                            exit;
                        }
                        $page = $_GET['page'] ?? 1;
                        $startDate = $_GET['start_date'] ?? '';
                        $endDate = $_GET['end_date'] ?? '';
                        $controller = new AdminController($db);
                        $response = $controller->getSales($page, $startDate, $endDate);
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
        default:
            echo json_encode(["message" => "Route not found"]);
            break;
}