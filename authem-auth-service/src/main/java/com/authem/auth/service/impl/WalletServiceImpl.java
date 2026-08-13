package com.authem.auth.service.impl;

import com.authem.auth.dto.request.WalletTopUpRequest;
import com.authem.auth.dto.response.WalletResponse;
import com.authem.auth.exception.InsufficientBalanceException;
import com.authem.auth.exception.ResourceNotFoundException;
import com.authem.auth.model.Wallet;
import com.authem.auth.repository.WalletRepository;
import com.authem.auth.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class WalletServiceImpl implements WalletService {

    private final WalletRepository walletRepository;

    @Override
    public WalletResponse getWalletByUserId(Long userId) {
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseGet(() -> createInitialWallet(userId));
        return mapToResponse(wallet);
    }

    @Override
    @Transactional
    public WalletResponse deposit(Long userId, WalletTopUpRequest request) {
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseGet(()->createInitialWallet(userId));
        wallet.setBalance(wallet.getBalance().add(request.getAmount()));
        return mapToResponse(walletRepository.save(wallet));
    }

    @Override
    @Transactional
    public WalletResponse holdFunds(Long userId, BigDecimal amount) {
        Wallet wallet = findWalletOrThrow(userId);

        if(wallet.getBalance().compareTo(amount)<0){
            throw new InsufficientBalanceException("Insufficient available balance to place bid of $" + amount);
        }
        wallet.setBalance(wallet.getBalance().subtract(amount));
        wallet.setFrozenBalance(wallet.getFrozenBalance().add(amount));
        return mapToResponse(walletRepository.save(wallet));
    }

    @Override
    @Transactional
    public WalletResponse releaseFunds(Long userId, BigDecimal amount) {
        Wallet wallet = findWalletOrThrow(userId);

        if(wallet.getFrozenBalance().compareTo(amount) <0){
            throw new IllegalStateException("Cannot release $" + amount + " - frozen balance is only $" + wallet.getFrozenBalance());
        }
        wallet.setFrozenBalance(wallet.getFrozenBalance().subtract(amount));
        wallet.setBalance(wallet.getBalance().add(amount));

        return mapToResponse(walletRepository.save(wallet));
    }

    @Override
    @Transactional
    public WalletResponse deductFrozenBalance(Long userId, BigDecimal amount) {
        Wallet wallet = findWalletOrThrow(userId);

        if(wallet.getFrozenBalance().compareTo(amount) <0 ){
            throw new IllegalStateException("Cannot complete trade: frozen balance is insufficient");
        }
        // Permanently remove funds from frozen balance
        wallet.setFrozenBalance(wallet.getFrozenBalance().subtract(amount));

        return mapToResponse(walletRepository.save(wallet));
    }

    @Override
    @Transactional
    public void settleTrade(Long buyerId, Long sellerId, BigDecimal bidAmount, BigDecimal executionPrice) {
        Wallet buyerWallet = walletRepository.findByUserId(buyerId)
                .orElseThrow(() -> new ResourceNotFoundException("Buyer wallet not found"));

        Wallet sellerWallet = walletRepository.findByUserId(sellerId)
                .orElseThrow(() -> new ResourceNotFoundException("Seller wallet not found"));

        if (buyerWallet.getFrozenBalance().compareTo(bidAmount) < 0) {
            throw new InsufficientBalanceException("Insufficient frozen funds for settlement");
        }

        buyerWallet.setFrozenBalance(buyerWallet.getFrozenBalance().subtract(bidAmount));

        BigDecimal priceImprovementRefund = bidAmount.subtract(executionPrice);
        if (priceImprovementRefund.compareTo(BigDecimal.ZERO) > 0) {
            buyerWallet.setBalance(buyerWallet.getBalance().add(priceImprovementRefund));
        }

        sellerWallet.setBalance(sellerWallet.getBalance().add(executionPrice));

        walletRepository.save(buyerWallet);
        walletRepository.save(sellerWallet);
    }

    private Wallet createInitialWallet(Long userId){
        Wallet wallet = Wallet.builder()
                .userId(userId)
                .balance(BigDecimal.ZERO)
                .frozenBalance(BigDecimal.ZERO)
                .build();
        return walletRepository.save(wallet);
    }

    private WalletResponse mapToResponse(Wallet wallet) {
        return WalletResponse.builder()
                .id(wallet.getId())
                .userId(wallet.getUserId())
                .balance(wallet.getBalance())
                .frozenBalance(wallet.getFrozenBalance())
                .updatedAt(wallet.getUpdatedAt())
                .build();
    }

    private Wallet findWalletOrThrow(Long userId) {
        return walletRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found for user ID: " + userId));
    }
}
