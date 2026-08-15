package com.authem.catalog.service.impl;

import com.authem.catalog.dto.ProductRequestDTO;
import com.authem.catalog.entity.MasterProduct;
import com.authem.catalog.repository.MasterProductRepository;
import com.authem.catalog.service.MasterProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MasterProductServiceImpl implements MasterProductService {

    private final MasterProductRepository productRepository;

    @Override
    @Transactional
    public MasterProduct createProduct(ProductRequestDTO request) {
        if (productRepository.existsBySku(request.sku())) {
            throw new IllegalArgumentException("Product with SKU " + request.sku() + " already exists.");
        }

        MasterProduct product = MasterProduct.builder()
                .sku(request.sku().toUpperCase().trim())
                .name(request.name().trim())
                .brand(request.brand().trim())
                .colorway(request.colorway())
                .retailPrice(request.retailPrice())
                .imageUrl(request.imageUrl())
                .active(true)
                .build();

        return productRepository.save(product);
    }

    @Override
    @Transactional
    public List<MasterProduct> bulkCreateProducts(List<ProductRequestDTO> requests) {
        List<MasterProduct> products = requests.stream()
                .filter(req -> !productRepository.existsBySku(req.sku()))
                .map(req -> MasterProduct.builder()
                        .sku(req.sku().toUpperCase().trim())
                        .name(req.name().trim())
                        .brand(req.brand().trim())
                        .colorway(req.colorway())
                        .retailPrice(req.retailPrice())
                        .imageUrl(req.imageUrl())
                        .active(true)
                        .build())
                .toList();

        return productRepository.saveAll(products);
    }

    @Override
    public Page<MasterProduct> getAllProducts(String search, String brand, Pageable pageable) {
        return productRepository.searchMasterCatalog(search, brand, pageable);
    }

    @Override
    @Transactional
    public MasterProduct updateProduct(Long id, ProductRequestDTO request) {
        MasterProduct product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        product.setName(request.name().trim());
        product.setBrand(request.brand().trim());
        product.setColorway(request.colorway());
        product.setRetailPrice(request.retailPrice());
        product.setImageUrl(request.imageUrl());

        return productRepository.save(product);
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        MasterProduct product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        product.setActive(false); // Soft delete
        productRepository.save(product);
    }
}