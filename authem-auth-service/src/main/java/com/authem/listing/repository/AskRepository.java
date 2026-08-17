package com.authem.listing.repository;

import com.authem.listing.entity.Ask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository("listingAskRepository")
public interface AskRepository extends JpaRepository<Ask, Long> {

    List<Ask> findBySellerIdAndStatus(Long sellerId, Ask.AskStatus status);

    @Query("""
        SELECT MIN(a.askPrice) FROM ListingAsk a 
        WHERE a.masterProductId = :masterProductId 
          AND a.size = :size 
          AND a.status = com.authem.listing.entity.Ask.AskStatus.ACTIVE
    """)
    Optional<BigDecimal> findLowestAskByProductAndSize(
            @Param("masterProductId") Long masterProductId,
            @Param("size") String size
    );

    @Query("""
        SELECT MIN(a.askPrice) FROM ListingAsk a 
        WHERE a.masterProductId = :masterProductId 
          AND a.status = com.authem.listing.entity.Ask.AskStatus.ACTIVE
    """)
    Optional<BigDecimal> findLowestAskByProduct(@Param("masterProductId") Long masterProductId);
}