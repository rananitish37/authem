package com.authem.auth.repository;

import com.authem.auth.model.FulfillmentStatus;
import com.authem.auth.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByBuyerId(Long buyerId);

    List<Order> findBySellerId(Long sellerId);

    List<Order> findByProductId(Long productId);

    List<Order> findByStatus(FulfillmentStatus status);
}
