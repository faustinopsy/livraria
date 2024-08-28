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
        return $this->product->create($this->converteImagem($data));
    }

    public function update($id, $data) {
        $dados = $this->converteImagem($data);
        return $this->product->update($id, $dados);
    }

    public function delete($id) {
        return $this->product->delete($id);
    }

    private function converteImagem($data){
        if (isset($data['imageSrcBase64'])) {
            $imageData = base64_decode($data['imageSrcBase64']);
            $uploadDir = __DIR__ . '/../../img/';
            $fileName = uniqid() . '.jpg';
            $uploadFile = $uploadDir . $fileName;
            
            if (file_put_contents($uploadFile, $imageData)) {
                $data['imageSrc'] = 'img/' . $fileName;
            } else {
                throw new Exception("Failed to upload image");
            }
        }
        return $data;
    }
}
