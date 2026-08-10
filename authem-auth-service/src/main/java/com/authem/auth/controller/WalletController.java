package com.authem.auth.controller;

import com.authem.auth.dto.request.HoldFundsRequest;
import com.authem.auth.dto.request.WalletTopUpRequest;
import com.authem.auth.dto.response.WalletResponse;
import com.authem.auth.model.User;
import com.authem.auth.service.WalletService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/wallet")
@RequiredArgsConstructor
public class WalletController {
    private final WalletService walletService;

    @GetMapping
    public ResponseEntity<WalletResponse> getWallet(@AuthenticationPrincipal User user){
        return ResponseEntity.ok(walletService.getWalletByUserId(user.getId()));
    }

    @PostMapping("/top-up")
    public ResponseEntity<WalletResponse> topUp(@AuthenticationPrincipal User user, @RequestBody WalletTopUpRequest request){
        return ResponseEntity.ok(walletService.deposit(user.getId(),request));
    }

    @PostMapping("/hold")
    public ResponseEntity<WalletResponse> holdFund(@AuthenticationPrincipal User user, @Valid @RequestBody HoldFundsRequest request){
        return ResponseEntity.ok(walletService.holdFunds(user.getId(), request.getAmount()));
    }

    @PostMapping("/release")
    public ResponseEntity<WalletResponse> releaseFunds(@AuthenticationPrincipal User user, @Valid @RequestBody HoldFundsRequest request){
        return ResponseEntity.ok(walletService.releaseFunds(user.getId(), request.getAmount()));
    }
}
