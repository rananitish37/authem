package com.authem.auth.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PlaceAskRequest {
    @NotNull
    private Long productId;

    @NotNull
    private String shoeSize;

    @NotNull
    @DecimalMin(value = "1.00")
    private BigDecimal askPrice;
}
