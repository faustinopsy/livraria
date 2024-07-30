<?php
namespace src\controllers;

use src\models\Product;
use src\config\Database;
use Exception;

class ProductController {
    private $db;
    private $product;

    public function __construct($db) {
        $this->db = $db;
        $this->product = new Product($db);
    }
    public function getProducts($termo) {
        $product = new Product($this->db);
        return $product->getAll($termo);
    }

    public function getPurchasedProducts($userId) {
        $product = new Product($this->db);
        return $product->getPurchasedByUser($userId);
    }
    public function create($data) {
        if (isset($_FILES['imageFile']) && $_FILES['imageFile']['error'] == 0) {
            $uploadDir = __DIR__ . '/../../img/';
            $uploadFile = $uploadDir . basename($_FILES['imageFile']['name']);
            if (move_uploaded_file($_FILES['imageFile']['tmp_name'], $uploadFile)) {
                $data['imageSrc'] = 'img/' . basename($_FILES['imageFile']['name']);
            } else {
                throw new Exception("Failed to upload image");
            }
        }
        return $this->product->create($data);
    }

    public function update($id, $data) {
        if (isset($_FILES['imageFile']) && $_FILES['imageFile']['error'] == 0) {
            $uploadDir = __DIR__ . '/../../img/';
            $uploadFile = $uploadDir . basename($_FILES['imageFile']['name']);
            if (move_uploaded_file($_FILES['imageFile']['tmp_name'], $uploadFile)) {
                $data['imageSrc'] = 'img/' . basename($_FILES['imageFile']['name']);
            } else {
                throw new Exception("Failed to upload image");
            }
        }
        return $this->product->update($id, $data);
    }

    public function delete($id) {
        return $this->product->delete($id);
    }
}
