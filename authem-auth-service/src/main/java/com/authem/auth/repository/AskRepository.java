package com.authem.auth.repository;

import com.authem.auth.model.Ask;
import com.authem.auth.model.OrderStatus;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface AskRepository extends JpaRepository<Ask, Long> {
    List<Ask> findByUserId(Long userId);
    List<Ask> findByUserIdAndStatus(Long userId, OrderStatus status);

    @Query("""
        SELECT a FROM Ask a
        WHERE a.product.id = :productId
          AND a.shoeSize = :shoeSize
          AND a.status = :status
          AND a.askPrice <= :bidPrice
        ORDER BY a.askPrice ASC, a.createdAt ASC
    """)
    List<Ask> findMatchingAsks(
            @Param("productId") Long productId,
            @Param("shoeSize") String shoeSize,
            @Param("bidPrice") BigDecimal bidPrice,
            @Param("status") OrderStatus status,
            Pageable pageable
    );

    default Optional<Ask> findLowestMatchingAsk(Long productId, String shoeSize, BigDecimal bidPrice) {
        List<Ask> matches = findMatchingAsks(productId, shoeSize, bidPrice, OrderStatus.PENDING, PageRequest.of(0, 1));
        return matches.stream().findFirst();
    }

    @Query("""
        SELECT MIN(a.askPrice) FROM Ask a
        WHERE a.product.id = :productId
          AND a.shoeSize = :shoeSize
          AND a.status = com.authem.auth.model.enums.OrderStatus.PENDING
    """)
    Optional<BigDecimal> findLowestAskPrice(
            @Param("productId") Long productId,
            @Param("shoeSize") String shoeSize
    );


}
