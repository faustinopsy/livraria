<?php
namespace src\controllers;
require_once '../vendor/autoload.php';

use MercadoPago\Client\Common\RequestOptions;
use MercadoPago\MercadoPagoConfig;
use MercadoPago\Client\Preference\PreferenceClient;
use MercadoPago\Exceptions\MPApiException;

class CheckoutController {
    private $db;
    private $token;
    public function __construct($db, $dados) {
        $this->db = $db;
        $this->token = $dados['MP_TOKEN'];
        MercadoPagoConfig::setAccessToken($this->token);
        MercadoPagoConfig::setRuntimeEnviroment(MercadoPagoConfig::LOCAL);
    }
    
    public function processCheckout($useremail,$userId, $cart) {
        try {
            // Cria o cliente de preferência
            $client = new PreferenceClient();
    
            // Cria um array para armazenar os itens
            $items = [];
            $preferenceData = [
                "items" => [],
                "back_urls" => [
                    "success" => "http://localhost:5500/#paymentsuccess",
                    "failure" => "http://localhost:5500/#paymentfailure",
                    "pending" => "http://localhost:5500/#paymentpending"
                ],
                "auto_return" => "approved",
                "notification_url" => "http://localhost:8000/index.php/notifications",
                "external_reference" => (string)$userId,
                "payer" => [
                    "email" => $useremail
                ]
            ];
            
            foreach ($cart as $product) {
                $item = [
                    "id" => (string)$product['id'],
                    "title" => $product['name'],
                    "description" => $product['description'],
                    "quantity" => $product['quantity'],
                    "currency_id" => "BRL",
                    "unit_price" => floatval($product['price'])
                ];
                $preferenceData["items"][] = $item;
            }
    
            $response = $client->create($preferenceData);
            return ['init_point' => $response->init_point];

        } catch (MPApiException $e) {
            return ['error' => 'Erro na API do Mercado Pago: ' . $e->getMessage()];
        } catch (\Exception $e) {
            return ['error' => 'Erro ao processar o checkout: ' . $e->getMessage()];
        }

    }
    
    public function paymentNotification($notification) {
        try {
            MercadoPagoConfig::setAccessToken($this->token);
            $notificationId = $notification['id'] ?? null;
            $topic = $notification['topic'] ?? null;
            if ($notificationId && $topic) {
                if($topic == 'merchant_order') {
                    $merchantOrderClient = new \MercadoPago\Client\MerchantOrder\MerchantOrderClient();
                    $response = $merchantOrderClient->get($notificationId);
                    if ($response->getStatus() === 200) {
                        $merchantOrder = $response->getResponse();
                        $status = 'reserved'; // Status padrão
                        // Verifica o status dos pagamentos
                        if (isset($merchantOrder['payments']) && is_array($merchantOrder['payments'])) {
                            foreach ($merchantOrder['payments'] as $payment) {
                                if ($payment['status'] == 'approved') {
                                    $status = 'sold';
                                    break;
                                } elseif ($payment['status'] == 'pending') {
                                    $status = 'reserved';
                                }
                            }
                        }
                        $userId = $merchantOrder['external_reference'];
                        $this->db->beginTransaction();
                        if (isset($merchantOrder['items']) && is_array($merchantOrder['items'])) {
                            foreach ($merchantOrder['items'] as $item) {
                                $productId = $item['id'];
                                $quantity = $item['quantity'];
                                $query = "INSERT INTO purchased_products (user_id, product_id, quantity, status) VALUES (:user_id, :product_id, :quantity, :status)";
                                $stmt = $this->db->prepare($query);
                                $stmt->bindParam(':user_id', $userId);
                                $stmt->bindParam(':product_id', $productId);
                                $stmt->bindParam(':quantity', $quantity);
                                $stmt->bindParam(':status', $status);
                                $stmt->execute();
                            }
                        }
                        $this->db->commit();
                    }
                }
            }
        } catch (MPApiException $e) {
            $this->db->rollBack();
        } catch (\Exception $e) {
            $this->db->rollBack();
        }
    }
}

