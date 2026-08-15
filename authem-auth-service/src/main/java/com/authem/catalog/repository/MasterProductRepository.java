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

    /**
     * Checks if a product with the given SKU already exists in the catalog.
     */
    boolean existsBySku(String sku);

    /**
     * Finds an active product by SKU.
     */
    Optional<MasterProduct> findBySkuAndActiveTrue(String sku);

    /**
     * Finds an active product by ID.
     */
    Optional<MasterProduct> findByIdAndActiveTrue(Long id);

    /**
     * Searches active master products by model name or SKU code, with optional brand filtering.
     */
    @Query("""
        SELECT p FROM MasterProduct p 
        WHERE p.active = true 
          AND (:brand IS NULL OR :brand = '' OR LOWER(p.brand) = LOWER(:brand))
          AND (
            :search IS NULL OR :search = '' 
            OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) 
            OR LOWER(p.sku) LIKE LOWER(CONCAT('%', :search, '%'))
          )
    """)
    Page<MasterProduct> searchMasterCatalog(
            @Param("search") String search,
            @Param("brand") String brand,
            Pageable pageable
    );
}