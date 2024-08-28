<?php
namespace src\controllers;

use src\models\User;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthController {
    private $db;
    private $userModel;

    public function __construct($db) {
        $this->db = $db;
        $this->userModel = new User($db);
    }

    public function register($data) {
        $data['role'] = 'user'; 
        if ($this->userModel->create($data)) {
            return ['message' => 'Registrado com sucesso'];
        }
        return ['message' => 'Falha ao registrar'];
    }

    public function login($data,$dados) {
        $user = $this->userModel->findByEmail($data['email']);
        if ($user && password_verify($data['password'], $user['password'])) {
            $payload = [
                'iss' => 'http://localhost:8000',
                'aud' => 'http://localhost:8000',
                'iat' => time(),
                'nbf' => time(),
                'exp' => time() + 3600,
                'data' => [
                    'userId' => $user['id'],
                    'email' => $user['name'],
                    'role' => $user['role']
                ]
            ];
            $jwt = JWT::encode($payload, $dados['JWT_SECRET'], 'HS256');
            return ['token' => $jwt];
        }
        return ['message' => 'Login failed'];
    }
}
?>
