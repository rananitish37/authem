package com.authem.auth.dto.response;

import com.authem.auth.model.OrderStatus;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TradeExecutionResponse {
    private Long orderId;
    private Long bidId;
    private Long askId;
    private Long productId;
    private String shoeSize;
    private BigDecimal executionPrice;
    private OrderStatus orderStatus;
    private String message;
}
