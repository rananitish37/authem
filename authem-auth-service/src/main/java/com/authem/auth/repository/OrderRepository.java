package com.authem.auth.repository;

import com.authem.auth.model.FulfillmentStatus;
import com.authem.auth.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByBuyerId(Long buyerId);

    List<Order> findBySellerId(Long sellerId);

    List<Order> findByProductId(Long productId);

    List<Order> findByStatus(FulfillmentStatus status);

    @Query("SELECT o FROM Order o WHERE o.buyerId = :userId OR o.sellerId = :userId ORDER BY o.createdAt DESC")
    List<Order> findAllUserOrders(@Param("userId") Long userId);

    @Query("""
        SELECT o.matchedPrice FROM Order o 
        WHERE o.product.id = :productId 
          AND o.shoeSize = :shoeSize 
        ORDER BY o.createdAt DESC 
        LIMIT 1
    """)
    Optional<BigDecimal> findLastSalePrice(
            @Param("productId") Long productId,
            @Param("shoeSize") String shoeSize
    );
}