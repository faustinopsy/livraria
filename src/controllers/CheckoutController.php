<?php
namespace src\controllers;

use src\Models\Product;
use MercadoPago\SDK;
use MercadoPago\Preference;
use MercadoPago\Item;

class CheckoutController {
    private $db;

    public function __construct($db,$dados) {
        $this->db = $db;
        SDK::setAccessToken($dados['MERCADO_PAGO_ACCESS_TOKEN']);
    }

    public function processCheckout($userId, $cart) {
        $preference = new Preference();

        foreach ($cart as $product) {
            $item = new Item();
            $item->title = $product['name'];
            $item->quantity = $product['quantity'];
            $item->unit_price = floatval($product['price']); 
            $preference->items[] = $item;
        }

        $preference->payer = [
            "name" => "Customer Name",
            "surname" => "Customer Surname",
            "email" => "customer@example.com"
        ];

        $preference->back_urls = [
            "success" => "https://your-website.com/success", 
            "failure" => "https://your-website.com/failure", 
            "pending" => "https://your-website.com/pending"  
        ];

        $preference->auto_return = "approved";

        $preference->save();

        return ['init_point' => $preference->init_point];
    }
}
?>
