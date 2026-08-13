package com.authem.auth.service;

import com.authem.auth.exception.InsufficientBalanceException;
import com.authem.auth.model.Wallet;
import com.authem.auth.repository.WalletRepository;
import com.authem.auth.service.impl.WalletServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WalletServiceImplTest {

    @Mock
    private WalletRepository walletRepository;

    @InjectMocks
    private WalletServiceImpl walletService;

    private Wallet mockWallet;

    @BeforeEach
    void setUp() {
        mockWallet = Wallet.builder()
                .id(1L)
                .userId(100L)
                .balance(new BigDecimal("500.00"))
                .frozenBalance(BigDecimal.ZERO)
                .build();
    }

    @Test
    @DisplayName("holdFunds - Success when balance is sufficient")
    void holdFunds_Success() {
        BigDecimal holdAmount = new BigDecimal("200.00");
        when(walletRepository.findByUserId(100L)).thenReturn(Optional.of(mockWallet));
        when(walletRepository.save(any(Wallet.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var response = walletService.holdFunds(100L, holdAmount);

        assertEquals(new BigDecimal("300.00"), response.getBalance());
        assertEquals(new BigDecimal("200.00"), response.getFrozenBalance());
        verify(walletRepository, times(1)).save(mockWallet);
    }

    @Test
    @DisplayName("holdFunds - Throws InsufficientBalanceException when funds are low")
    void holdFunds_InsufficientBalance_ThrowsException() {
        BigDecimal holdAmount = new BigDecimal("600.00");
        when(walletRepository.findByUserId(100L)).thenReturn(Optional.of(mockWallet));

        assertThrows(InsufficientBalanceException.class, () ->
                walletService.holdFunds(100L, holdAmount)
        );

        verify(walletRepository, never()).save(any());
    }

    @Test
    @DisplayName("settleTrade - Correctly calculates price improvement refund for buyer and credits seller")
    void settleTrade_Success() {
        Wallet buyerWallet = Wallet.builder()
                .id(1L)
                .userId(100L)
                .balance(new BigDecimal("100.00"))
                .frozenBalance(new BigDecimal("220.00")) // Held $220 for bid
                .build();

        Wallet sellerWallet = Wallet.builder()
                .id(2L)
                .userId(200L)
                .balance(new BigDecimal("50.00"))
                .frozenBalance(BigDecimal.ZERO)
                .build();

        BigDecimal bidAmount = new BigDecimal("220.00");
        BigDecimal executionPrice = new BigDecimal("200.00"); // Matched at $200 -> $20 refund to buyer

        when(walletRepository.findByUserId(100L)).thenReturn(Optional.of(buyerWallet));
        when(walletRepository.findByUserId(200L)).thenReturn(Optional.of(sellerWallet));

        walletService.settleTrade(100L, 200L, bidAmount, executionPrice);

        // Buyer gets $20 price improvement refund ($100 + $20 = $120)
        assertEquals(new BigDecimal("0.00"), buyerWallet.getFrozenBalance());
        assertEquals(new BigDecimal("120.00"), buyerWallet.getBalance());

        // Seller receives execution price ($50 + $200 = $250)
        assertEquals(new BigDecimal("250.00"), sellerWallet.getBalance());

        verify(walletRepository, times(1)).save(buyerWallet);
        verify(walletRepository, times(1)).save(sellerWallet);
    }
}