package com.authem.auth.dto.response;

import com.authem.auth.model.FulfillmentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponse {
    private Long orderId;
    private Long productId;
    private String productName;
    private String shoeSize;
    private BigDecimal price;
    private Long buyerId;
    private Long sellerId;
    private FulfillmentStatus status;
    private LocalDateTime createdAt;
}
