package com.authem.catalog.service;

import com.authem.catalog.dto.CatalogBrowseDTO;
import com.authem.catalog.dto.MasterProductDetailDTO;
import com.authem.catalog.dto.ProductRequestDTO;
import com.authem.catalog.entity.MasterProduct;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface MasterProductService {

    MasterProduct createProduct(ProductRequestDTO request);

    List<MasterProduct> bulkCreateProducts(List<ProductRequestDTO> requests);

    Page<MasterProduct> getAllProducts(String search, String brand, Pageable pageable);

    // NEW: Method for consumer browse view (includes lowest ask & highest bid)
    Page<CatalogBrowseDTO> getBrowseCatalog(String search, String brand, Pageable pageable);

    MasterProduct updateProduct(Long id, ProductRequestDTO request);

    void deleteProduct(Long id);
    Optional<MasterProductDetailDTO> getMasterProductById(Long id);
}