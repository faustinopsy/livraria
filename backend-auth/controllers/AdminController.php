<?php
namespace src\controllers;

use PDO;

class AdminController {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function getReservations() {
        $query = "SELECT pp.*, p.name, p.description, p.price, p.imageSrc, p.altText
                  FROM purchased_products pp
                  JOIN products p ON pp.product_id = p.id
                  WHERE pp.status = 'reserved'";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function updateStatus($id, $status) {
        $query = "UPDATE purchased_products SET status = :status WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }

    public function removeReservation($id) {
        $query = "DELETE FROM purchased_products WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }

    public function getSales($page, $startDate, $endDate) {
        $offset = ($page - 1) * 10;
        $query = "SELECT pp.*, p.name, p.description, p.price, p.imageSrc, p.altText
                  FROM purchased_products pp
                  JOIN products p ON pp.product_id = p.id
                  WHERE pp.status = 'sold'";
                  
        if (!empty($startDate) && !empty($endDate)) {
            $query .= " AND pp.created_at BETWEEN :startDate AND :endDate";
        } else {
            if (!empty($startDate)) {
                $query .= " AND pp.created_at >= :startDate";
            }
            if (!empty($endDate)) {
                $query .= " AND pp.created_at <= :endDate";
            }
        }
    
        $query .= " LIMIT 10 OFFSET :offset";
        $stmt = $this->db->prepare($query);
    
        if (!empty($startDate)) {
            $startDate .= ' 00:00:00';
            $stmt->bindParam(':startDate', $startDate);
        }
        if (!empty($endDate)) {
            $endDate .= ' 23:59:59';
            $stmt->bindParam(':endDate', $endDate);
        }
        $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        
        $sales = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
        $countQuery = "SELECT COUNT(*) as total FROM purchased_products WHERE status = 'sold'";
        if (!empty($startDate) && !empty($endDate)) {
            $countQuery .= " AND created_at BETWEEN :startDate AND :endDate";
        } else {
            if (!empty($startDate)) {
                $countQuery .= " AND created_at >= :startDate";
            }
            if (!empty($endDate)) {
                $countQuery .= " AND created_at <= :endDate";
            }
        }
        $stmt = $this->db->prepare($countQuery);
    
        if (!empty($startDate)) {
            $stmt->bindParam(':startDate', $startDate);
        }
        if (!empty($endDate)) {
            $stmt->bindParam(':endDate', $endDate);
        }
        $stmt->execute();
        $total = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
    
        return [
            'sales' => $sales,
            'total' => $total,
            'currentPage' => $page,
            'previousPage' => $page > 1 ? $page - 1 : null,
            'nextPage' => $page * 10 < $total ? $page + 1 : null
        ];
    }
    
}
