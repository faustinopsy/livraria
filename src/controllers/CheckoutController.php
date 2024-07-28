<?php
namespace src\controllers;

use PDO;

class CheckoutController {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function processCheckout($userId, $cart) {
        try {
            $this->db->beginTransaction();

            foreach ($cart as $product) {
                $query = "INSERT INTO purchased_products (user_id, product_id, quantity) VALUES (:user_id, :product_id, :quantity)";
                $stmt = $this->db->prepare($query);
                $stmt->bindParam(':user_id', $userId);
                $stmt->bindParam(':product_id', $product['id']);
                $stmt->bindParam(':quantity', $product['quantity']);
                $stmt->execute();
            }

            $this->db->commit();
            return ['status'=> true, 'message' => 'Products purchased successfully'];
        } catch (\Exception $e) {
            $this->db->rollBack();
            return ['error' => 'Error processing checkout: ' . $e->getMessage()];
        }
    }
}
?>
