package com.authem.catalog.service.impl;

import com.authem.catalog.dto.CatalogBrowseDTO;
import com.authem.catalog.dto.ProductRequestDTO;
import com.authem.catalog.entity.MasterProduct;
import com.authem.catalog.repository.MasterProductRepository;
import com.authem.catalog.service.MasterProductService;
import com.authem.listing.repository.AskRepository;
import com.authem.auth.repository.BidRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MasterProductServiceImpl implements MasterProductService {

    private final MasterProductRepository productRepository;
    private final AskRepository askRepository;
    private final BidRepository bidRepository;

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
    public Page<CatalogBrowseDTO> getBrowseCatalog(String search, String brand, Pageable pageable) {
        Page<MasterProduct> products = productRepository.searchMasterCatalog(search, brand, pageable);

        return products.map(product -> {
            BigDecimal lowestAsk = askRepository.findLowestAskByProduct(product.getId()).orElse(null);
            BigDecimal highestBid = bidRepository.findHighestBidByProduct(product.getId()).orElse(null);

            return new CatalogBrowseDTO(
                    product.getId(),
                    product.getSku(),
                    product.getName(),
                    product.getBrand(),
                    product.getColorway(),
                    product.getRetailPrice(),
                    product.getImageUrl(),
                    lowestAsk,
                    highestBid
            );
        });
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
        product.setActive(false);
        productRepository.save(product);
    }
}