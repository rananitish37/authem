package com.authem.auth.controller;

import com.authem.auth.dto.request.WalletTopUpRequest;
import com.authem.auth.dto.response.WalletResponse;
import com.authem.auth.model.User;
import com.authem.auth.service.WalletService;
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
    public ResponseEntity<WalletResponse> getWallet(@AuthenticationPrincipal User user) {
        Long userId = (user != null) ? user.getId() : 1L;
        return ResponseEntity.ok(walletService.getWalletByUserId(userId));
    }

    @PostMapping("/top-up")
    public ResponseEntity<WalletResponse> topUp(@AuthenticationPrincipal User user, @RequestBody WalletTopUpRequest request) {
        Long userId = (user != null) ? user.getId() : 1L;
        return ResponseEntity.ok(walletService.deposit(userId, request));
    }
}
