package com.authem.auth.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BidResponse {
    private Long id;
    private Long productId;
    private String productName;
    private String productImageUrl;
    private String shoeSize;
    private BigDecimal bidPrice;
    private String status;
    private LocalDateTime createdAt;
}