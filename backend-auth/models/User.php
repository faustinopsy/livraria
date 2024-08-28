<?php
namespace src\models;

use PDO;

class User {
    private $conn;
    private $table = 'users';

    public $id;
    public $name;
    public $email;
    public $password;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create($data) {
        $nome = $data['name'];
        $email = $data['email'];
        $senha = password_hash($data['password'], PASSWORD_BCRYPT);
        $query = "INSERT INTO " . $this->table . " (name, email, password, role) VALUES (:name, :emailx, :password, :role)";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':name', $nome);
        $stmt->bindParam(':emailx', $email);
        $stmt->bindParam(':password', $senha );
        $stmt->bindParam(':role', $data['role']);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function findByEmail($email) {
        $query = "SELECT * FROM " . $this->table . " WHERE email = :email";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function login() {
        $query = "SELECT id, name, password FROM " . $this->table . " WHERE email = :email";
        $stmt = $this->conn->prepare($query);

        $this->email = htmlspecialchars(strip_tags($this->email));
        $stmt->bindParam(":email", $this->email);

        $stmt->execute();

        if($stmt->rowCount() == 1) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if(password_verify($this->password, $row['password'])) {
                $this->id = $row['id'];
                $this->name = $row['name'];
                return true;
            }
        }

        return false;
    }
}
