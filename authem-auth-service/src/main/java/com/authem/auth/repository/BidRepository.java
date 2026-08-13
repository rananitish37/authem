package com.authem.auth.repository;

import com.authem.auth.model.Ask;
import com.authem.auth.model.Bid;
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
public interface BidRepository extends JpaRepository<Bid, Long> {
    List<Bid> findByUserId(Long userId);
    List<Bid> findByUserIdAndStatus(Long userId, OrderStatus status);

    /**
     * MATCHING QUERY (When a new Ask arrives)
     * Finds active bids where bidPrice >= incoming askPrice.
     * Orders by HIGHEST PRICE first, then OLDEST CREATED timestamp.
     */
    @Query("""
            SELECT b FROM Bid b
            WHERE b.product.id = :productId
              AND b.shoeSize = :shoeSize
              AND b.status = :status
              AND b.bidPrice >= :askPrice
            ORDER BY b.bidPrice DESC, b.createdAt ASC
            """)
    List<Bid> findMatchingBids(
            @Param("productId") Long productId,
            @Param("shoeSize") String shoeSize,
            @Param("askPrice") BigDecimal askPrice,
            @Param("status") OrderStatus status,
            Pageable pageable
    );

    default Optional<Bid> findHighestMatchingBid(Long productId, String shoeSize, BigDecimal askPrice) {
        List<Bid> matches = findMatchingBids(productId, shoeSize, askPrice, OrderStatus.PENDING, PageRequest.of(0, 1));
        return matches.stream().findFirst();
    }

    @Query("""
        SELECT MAX(b.bidPrice) FROM Bid b
        WHERE b.product.id = :productId
          AND b.shoeSize = :shoeSize
          AND b.status = :status
    """)
    Optional<BigDecimal> findHighestBidPrice(
            @Param("productId") Long productId,
            @Param("shoeSize") String shoeSize,
            @Param("status") OrderStatus status
    );
    default Optional<BigDecimal> findHighestBidPrice(
            @Param("productId") Long productId,
            @Param("shoeSize") String shoeSize
    ){
        return findHighestBidPrice(productId, shoeSize, OrderStatus.PENDING);
    }
}
