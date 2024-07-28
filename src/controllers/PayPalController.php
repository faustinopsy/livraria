<?php
namespace src\controllers;

use PayPal\Rest\ApiContext;
use PayPal\Auth\OAuthTokenCredential;
use PayPal\Api\Amount;
use PayPal\Api\Payer;
use PayPal\Api\Payment;
use PayPal\Api\PaymentExecution;
use PayPal\Api\RedirectUrls;
use PayPal\Api\Transaction;

class PayPalController {
    private $apiContext;

    public function __construct() {
        $paypalConfig = require __DIR__ . '/../config/paypal.php';

        $this->apiContext = new ApiContext(
            new OAuthTokenCredential(
                $paypalConfig['client_id'],
                $paypalConfig['secret']
            )
        );

        $this->apiContext->setConfig($paypalConfig['settings']);
    }

    public function createPayment($cart) {
        $payer = new Payer();
        $payer->setPaymentMethod('paypal');

        $items = [];
        $total = 0;

        foreach ($cart as $product) {
            $item = new \PayPal\Api\Item();
            $item->setName($product['name'])
                ->setCurrency('USD')
                ->setQuantity($product['quantity'])
                ->setPrice($product['price']);

            $items[] = $item;
            $total += $product['price'] * $product['quantity'];
        }

        $itemList = new \PayPal\Api\ItemList();
        $itemList->setItems($items);

        $amount = new Amount();
        $amount->setCurrency('USD')
            ->setTotal($total);

        $transaction = new Transaction();
        $transaction->setAmount($amount)
            ->setItemList($itemList)
            ->setDescription('Payment description');

        $redirectUrls = new RedirectUrls();
        $redirectUrls->setReturnUrl("https://your-website.com/success")
            ->setCancelUrl("https://your-website.com/cancel");

        $payment = new Payment();
        $payment->setIntent('sale')
            ->setPayer($payer)
            ->setRedirectUrls($redirectUrls)
            ->setTransactions([$transaction]);

        try {
            $payment->create($this->apiContext);
        } catch (Exception $ex) {
            exit(1);
        }

        return $payment->getApprovalLink();
    }

    public function executePayment($paymentId, $payerId) {
        $payment = Payment::get($paymentId, $this->apiContext);

        $execution = new PaymentExecution();
        $execution->setPayerId($payerId);

        try {
            $result = $payment->execute($execution, $this->apiContext);
        } catch (Exception $ex) {
            exit(1);
        }

        return $result;
    }
}
?>
