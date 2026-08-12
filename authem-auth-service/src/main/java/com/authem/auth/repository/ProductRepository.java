package com.authem.auth.repository;

import com.authem.auth.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findBySku(String sku);

    List<Product> findByBrand(String brand);

    List<Product> findByNameContainingIgnoreCase(String name);
}
