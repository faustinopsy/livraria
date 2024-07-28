<?php
namespace src\controllers;

use src\models\Product;

class ProductController {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function getProducts() {
        $product = new Product($this->db);
        return $product->getAll();
    }

    public function getPurchasedProducts($userId) {
        $product = new Product($this->db);
        return $product->getPurchasedByUser($userId);
    }
}
