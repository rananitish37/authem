package com.authem.listing.controller;

import com.authem.auth.model.User;
import com.authem.listing.dto.AskDTOs.*;
import com.authem.listing.service.SellerAskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/seller")
@RequiredArgsConstructor
public class SellerCatalogController {

    private final SellerAskService sellerAskService;

    /**
     * Public / Seller Search Endpoint to locate sneakers from the master catalog.
     */
    @GetMapping("/catalog/search")
    public ResponseEntity<Page<MasterProductSummaryDTO>> searchCatalog(
            @RequestParam(defaultValue = "", required = false) String query,
            @RequestParam(defaultValue = "", required = false) String search,
            @RequestParam(defaultValue = "", required = false) String brand,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        String searchTerm = (query != null && !query.isBlank()) ? query : search;
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        return ResponseEntity.ok(sellerAskService.searchCatalogForListing(searchTerm, brand, pageable));
    }

    /**
     * Seller Endpoint to place an Ask listing.
     */
    @PostMapping("/asks")
    public ResponseEntity<AskResponseDTO> createAsk(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody CreateAskRequestDTO request
    ) {
        Long sellerId = (currentUser != null) ? currentUser.getId() : 1L;
        return new ResponseEntity<>(sellerAskService.createAsk(sellerId, request), HttpStatus.CREATED);
    }
}