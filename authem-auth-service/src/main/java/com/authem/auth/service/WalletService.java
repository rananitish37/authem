package com.authem.auth.service;

import com.authem.auth.dto.request.WalletTopUpRequest;
import com.authem.auth.dto.response.WalletResponse;

import java.math.BigDecimal;


public interface WalletService {
    WalletResponse getWalletByUserId(Long userId);
    WalletResponse deposit(Long userId, WalletTopUpRequest request);

    // Escrow Methods for Bids & Trades
    WalletResponse holdFunds(Long userId, BigDecimal amount);
    WalletResponse releaseFunds(Long userId, BigDecimal amount);
    WalletResponse deductFrozenBalance(Long userId, BigDecimal amount);

    void settleTrade(Long buyerId, Long sellerId, BigDecimal bidAmount, BigDecimal executionPrice);
}
