package com.authem.catalog.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record ProductResponseDTO(
        @NotBlank(message = "SKU is required")
        String sku,

        @NotBlank(message = "Product name is required")
        String name,

        @NotBlank(message = "Brand is required")
        String brand,

        String colorway,

        @NotNull(message = "Retail price is required")
        @Positive(message = "Retail price must be greater than zero")
        BigDecimal retailPrice,

        @NotBlank(message = "Image URL is required")
        String imageUrl
) {}