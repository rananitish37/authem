package com.authem.catalog.dto;

import java.math.BigDecimal;

public record MasterProductDetailDTO(
        Long id,
        String sku,
        String name,
        String brand,
        String colorway,
        BigDecimal retailPrice,
        String imageUrl,
        BigDecimal lowestAskPrice,
        BigDecimal highestBidPrice,
        BigDecimal lastSalePrice,
        Long totalSales // 🟢 Total number of units sold
) {}