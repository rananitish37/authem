package com.authem.auth.controller;


import com.authem.auth.model.Product;
import com.authem.auth.repository.ProductRepository;
import com.authem.catalog.dto.CatalogBrowseDTO;
import com.authem.catalog.dto.MasterProductDetailDTO;
import com.authem.catalog.entity.MasterProduct;
import com.authem.catalog.service.MasterProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {
    private final MasterProductService productService;
    private final ProductRepository productRepository;

    @PostMapping
    public ResponseEntity<Product> createProduct(@Valid @RequestBody Product product){
        Product savedProduct = productRepository.save(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts(){
        return ResponseEntity.ok(productRepository.findAll());
    }

    @GetMapping("/browse")
    public ResponseEntity<Page<CatalogBrowseDTO>> browseCatalog(
            @RequestParam(required = false, defaultValue = "") String search,
            @RequestParam(required = false, defaultValue = "") String brand,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,desc") String sort
    ) {
        String[] sortParams = sort.split(",");
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(sortParams[1]), sortParams[0]));
        return ResponseEntity.ok(productService.getBrowseCatalog(search, brand, pageable));
    }

//    @GetMapping("/{id}")
//    public ResponseEntity<Product> getProductById(@PathVariable Long id){
////        Product product = productRepository.findById(id)
////                .orElseThrow(()-> new IllegalArgumentException("Product Not Found"));
////        return ResponseEntity.ok(product);
//        return productRepository.findById(id)
//                .map(ResponseEntity::ok)
//                .orElse(ResponseEntity.notFound().build());
//    }

@GetMapping("/{id}")
public ResponseEntity<MasterProductDetailDTO> getProductById(@PathVariable Long id) {
    return productService.getMasterProductById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
}
}
