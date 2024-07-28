<?php
namespace src\controllers;

use src\models\User;
use Firebase\JWT\JWT;

class AuthController {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function register($data) {
        $user = new User($this->db);
        $user->name = $data['name'];
        $user->email = $data['email'];
        $user->password = $data['password'];

        if($user->create()) {
            return ["message" => "User registered successfully"];
        }

        return ["message" => "User registration failed"];
    }

    public function login($data,$dados) {
        $user = new User($this->db);
        $user->email = $data['email'];
        $user->password = $data['password'];

        if($user->login()) {
            $payload = [
                'iss' => "example.com",
                'iat' => time(),
                'exp' => time() + (60 * 60),
                'sub' => $user->id
            ];

            $token = JWT::encode($payload, $dados['JWT_SECRET'],'HS256');

            return ["token" => $token];
        }

        return ["message" => "Login failed"];
    }
}
