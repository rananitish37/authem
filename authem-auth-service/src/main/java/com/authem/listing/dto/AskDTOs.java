package com.authem.listing.dto;

import com.authem.listing.entity.Ask.ItemCondition;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class AskDTOs {

    public record CreateAskRequestDTO(
            @NotNull(message = "Master product ID is required")
            Long masterProductId,

            @NotBlank(message = "Shoe size is required")
            String size,

            @NotNull(message = "Ask price is required")
            @Positive(message = "Ask price must be greater than zero")
            BigDecimal askPrice,

            @NotNull(message = "Item condition is required")
            ItemCondition condition,

            String notes
    ) {}

    public record AskResponseDTO(
            Long askId,
            Long masterProductId,
            Long sellerId,
            String size,
            BigDecimal askPrice,
            ItemCondition condition,
            String status,
            String createdAt
    ) {}

    public record UserAskResponseDTO(
            Long askId,
            Long masterProductId,
            String productName,
            String productImageUrl,
            Long sellerId,
            String size,
            BigDecimal askPrice,
            ItemCondition condition,
            String status,
            String createdAt
    ) {}

    public record MasterProductSummaryDTO(
            Long id,
            String sku,
            String name,
            String brand,
            String colorway,
            BigDecimal retailPrice,
            String imageUrl,
            BigDecimal lowestAskPrice
    ) {}
}