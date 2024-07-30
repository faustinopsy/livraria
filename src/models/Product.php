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

    public function getAll($termo='php') {
        $query = "SELECT * FROM " . $this->table;
        if ($termo) {
            $query .= " WHERE name LIKE :searchTerm";
        }
        $stmt = $this->conn->prepare($query);
        if ($termo) {
            $termo = '%' . $termo . '%';
            $stmt->bindParam(':searchTerm', $termo);
        }
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

    public function create($data) {
        $query = "INSERT INTO " . $this->table . " (name, description, price, imageSrc, altText, category) VALUES (:name, :description, :price, :imageSrc, :altText, :category)";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':description', $data['description']);
        $stmt->bindParam(':price', $data['price']);
        $stmt->bindParam(':imageSrc', $data['imageSrc']);
        $stmt->bindParam(':altText', $data['altText']);
        $stmt->bindParam(':category', $data['category']);

        if ($stmt->execute()) {
            return ['message' => 'Product created successfully'];
        } else {
            return ['message' => 'Failed to create product'];
        }
    }

    public function update($id, $data) {
        $query = "UPDATE " . $this->table . " SET name = :name, description = :description, price = :price, imageSrc = :imageSrc, altText = :altText, category = :category WHERE id = :id";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':description', $data['description']);
        $stmt->bindParam(':price', $data['price']);
        $stmt->bindParam(':imageSrc', $data['imageSrc']);
        $stmt->bindParam(':altText', $data['altText']);
        $stmt->bindParam(':category', $data['category']);
        $stmt->bindParam(':id', $id);

        if ($stmt->execute()) {
            return ['message' => 'Product updated successfully'];
        } else {
            return ['message' => 'Failed to update product'];
        }
    }

    public function delete($id) {
        $query = "DELETE FROM " . $this->table . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);

        if ($stmt->execute()) {
            return ['message' => 'Product deleted successfully'];
        } else {
            return ['message' => 'Failed to delete product'];
        }
    }
}
