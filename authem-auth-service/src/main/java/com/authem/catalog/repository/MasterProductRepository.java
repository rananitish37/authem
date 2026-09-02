package com.authem.catalog.repository;

import com.authem.catalog.entity.MasterProduct;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MasterProductRepository extends JpaRepository<MasterProduct, Long> {

    boolean existsBySku(String sku);

    Optional<MasterProduct> findBySkuAndActiveTrue(String sku);

    Optional<MasterProduct> findByIdAndActiveTrue(Long id);

    @Query("SELECT p FROM MasterProduct p WHERE (p.active IS NULL OR p.active = true) AND p.id = :id")
    Optional<MasterProduct> findActiveById(@Param("id") Long id);

    @Query("""
        SELECT p FROM MasterProduct p 
        WHERE (p.active IS NULL OR p.active = true)
          AND (:brand IS NULL OR :brand = '' OR LOWER(p.brand) = LOWER(:brand))
          AND (
            :search IS NULL OR :search = '' 
            OR LOWER(p.name) LIKE LOWER(CONCAT('%', COALESCE(:search, ''), '%')) 
            OR LOWER(p.sku) LIKE LOWER(CONCAT('%', COALESCE(:search, ''), '%'))
          )
    """)
    Page<MasterProduct> searchMasterCatalog(
            @Param("search") String search,
            @Param("brand") String brand,
            Pageable pageable
    );
}