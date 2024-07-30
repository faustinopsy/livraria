<?php
namespace src\config;

use PDO;
use PDOException;

class Database {
    private static $instance = null;
    private $conn;
    private $host;
    private $db_name;
    private $username;
    private $password;
    private $db_type;
    private $sqlite_path;

    private function __construct($dados) {
        $this->db_type = $dados['DB_TYPE'];
        if ($this->db_type === 'mysql') {
            $this->host = $dados['DB_HOST'];
            $this->db_name = $dados['DB_NAME'];
            $this->username = $dados['DB_USER'];
            $this->password = $dados['DB_PASS'];
        } else if ($this->db_type === 'sqlite') {
            $this->sqlite_path = __DIR__ . "/my_database.db";
        }
    }

    public static function getInstance($dados) {
        if (self::$instance == null) {
            self::$instance = new Database($dados);
        }

        return self::$instance;
    }

    public function getConnection() {
        $this->conn = null;

        try {
            if ($this->db_type === 'mysql') {
                $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
                $this->conn->exec("set names utf8");
            } else if ($this->db_type === 'sqlite') {
                $this->conn = new PDO("sqlite:" . $this->sqlite_path);
            }
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }

        return $this->conn;
    }
}
