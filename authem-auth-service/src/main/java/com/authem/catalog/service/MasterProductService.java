package com.authem.catalog.service;

import com.authem.catalog.dto.ProductRequestDTO;
import com.authem.catalog.entity.MasterProduct;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface MasterProductService {

    MasterProduct createProduct(ProductRequestDTO request);

    List<MasterProduct> bulkCreateProducts(List<ProductRequestDTO> requests);

    Page<MasterProduct> getAllProducts(String search, String brand, Pageable pageable);

    MasterProduct updateProduct(Long id, ProductRequestDTO request);

    void deleteProduct(Long id);
}