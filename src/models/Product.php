<?php
namespace src\models;

use PDO;

class Product {
    private $conn;
    private $table = 'products';

    public $id;
    public $name;
    public $description;
    public $price;
    public $imageSrc;
    public $altText;
    public $category;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getAll() {
        $query = "SELECT * FROM " . $this->table;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getPurchasedByUser($userId) {
        $query = "SELECT p.*, pp.status FROM " . $this->table . " p
                  JOIN purchased_products pp ON p.id = pp.product_id
                  WHERE pp.user_id = :user_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $userId);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getAllReservations() {
        $query = "SELECT pp.*, p.name, p.description, p.price, p.imageSrc FROM purchased_products pp
                  JOIN products p ON pp.product_id = p.id
                  WHERE pp.status = 'reserved'";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function updateStatus($id, $status) {
        $query = "UPDATE purchased_products SET status = :status, updated_at = :updated_at WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':id', $id);
    
        $currentDateTime = date('Y-m-d H:i:s');
        $stmt->bindParam(':updated_at', $currentDateTime);
    
        return $stmt->execute();
    }
    

    public function removeReservation($id) {
        $query = "DELETE FROM purchased_products WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }
}
