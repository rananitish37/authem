package com.authem.auth.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WalletTopUpRequest {
    @NotBlank(message = "Amount is required")
    @DecimalMin(value = "1.00",message = "Minimum top-up amount is $1.00")
    private BigDecimal amount;
}
