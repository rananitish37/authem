package com.authem.listing.service.impl;

import com.authem.catalog.entity.MasterProduct;
import com.authem.catalog.repository.MasterProductRepository;
import com.authem.listing.dto.AskDTOs.*;
import com.authem.listing.entity.Ask;
import com.authem.listing.repository.AskRepository;
import com.authem.listing.service.SellerAskService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SellerAskServiceImpl implements SellerAskService {

    private final MasterProductRepository masterProductRepository;
    private final AskRepository askRepository;

    @Override
    public Page<MasterProductSummaryDTO> searchCatalogForListing(String query, String brand, Pageable pageable) {
        Page<MasterProduct> products = masterProductRepository.searchMasterCatalog(query, brand, pageable);

        return products.map(product -> {
            BigDecimal lowestAsk = askRepository.findLowestAskByProduct(product.getId()).orElse(null);

            return new MasterProductSummaryDTO(
                    product.getId(),
                    product.getSku(),
                    product.getName(),
                    product.getBrand(),
                    product.getColorway(),
                    product.getRetailPrice(),
                    product.getImageUrl(),
                    lowestAsk
            );
        });
    }

    @Override
    @Transactional
    public AskResponseDTO createAsk(Long sellerId, CreateAskRequestDTO request) {
        MasterProduct masterProduct = masterProductRepository.findByIdAndActiveTrue(request.masterProductId())
                .orElseThrow(() -> new IllegalArgumentException("Master product not found or inactive: " + request.masterProductId()));

        Ask ask = Ask.builder()
                .masterProductId(masterProduct.getId())
                .sellerId(sellerId)
                .size(request.size().toUpperCase().trim())
                .askPrice(request.askPrice())
                .condition(request.condition())
                .status(Ask.AskStatus.ACTIVE)
                .notes(request.notes())
                .build();

        Ask savedAsk = askRepository.save(ask);

        return new AskResponseDTO(
                savedAsk.getId(),
                savedAsk.getMasterProductId(),
                savedAsk.getSellerId(),
                savedAsk.getSize(),
                savedAsk.getAskPrice(),
                savedAsk.getCondition(),
                savedAsk.getStatus().name(),
                savedAsk.getCreatedAt().toString()
        );
    }
}