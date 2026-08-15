package com.authem.listing.service;

import com.authem.listing.dto.AskDTOs.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SellerAskService {

    /**
     * Searches the master catalog for active products and decorates results with market price data.
     */
    Page<MasterProductSummaryDTO> searchCatalogForListing(String query, String brand, Pageable pageable);

    /**
     * Creates a new seller Ask listing for a specific master product.
     */
    AskResponseDTO createAsk(Long sellerId, CreateAskRequestDTO request);
}