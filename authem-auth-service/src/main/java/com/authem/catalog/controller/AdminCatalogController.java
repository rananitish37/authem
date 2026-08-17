package com.authem.catalog.controller;

import com.authem.catalog.dto.ProductRequestDTO;
import com.authem.catalog.dto.ProductResponseDTO;
import com.authem.catalog.entity.MasterProduct;
import com.authem.catalog.service.MasterProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/catalog")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminCatalogController {

    private final MasterProductService productService;

    @PostMapping
    public ResponseEntity<ProductResponseDTO> createProduct(@Valid @RequestBody ProductRequestDTO request) {
        MasterProduct created = productService.createProduct(request);
        ProductResponseDTO response = new ProductResponseDTO(
                created.getSku(),
                created.getName(),
                created.getBrand(),
                created.getColorway(),
                created.getRetailPrice(),
                created.getImageUrl()
        );
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/bulk")
    public ResponseEntity<List<MasterProduct>> bulkImportProducts(@Valid @RequestBody List<ProductRequestDTO> requests) {
        return new ResponseEntity<>(productService.bulkCreateProducts(requests), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Page<MasterProduct>> getCatalog(
            @RequestParam(required = false, defaultValue = "") String search,
            @RequestParam(required = false, defaultValue = "") String brand,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,desc") String sort
    ) {
        String[] sortParams = sort.split(",");
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(sortParams[1]), sortParams[0]));
        return ResponseEntity.ok(productService.getAllProducts(search, brand, pageable));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MasterProduct> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequestDTO request
    ) {
        return ResponseEntity.ok(productService.updateProduct(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}