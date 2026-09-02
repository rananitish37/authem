package com.authem.auth.controller;

import com.authem.auth.dto.request.PlaceAskRequest;
import com.authem.auth.dto.request.PlaceBidRequest;
import com.authem.auth.dto.response.BidResponse;
import com.authem.auth.dto.response.TradeExecutionResponse;
import com.authem.auth.model.User;
import com.authem.auth.service.OrderMatchingService;
import com.authem.listing.dto.AskDTOs.UserAskResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/trading")
@RequiredArgsConstructor
public class TradingController {
    private final OrderMatchingService orderMatchingService;

    @PostMapping("/bids")
    public ResponseEntity<TradeExecutionResponse> placeBid(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody PlaceBidRequest request) {
        Long buyerId = (user != null) ? user.getId() : 1L;
        TradeExecutionResponse response = orderMatchingService.placeBid(buyerId, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/asks")
    public ResponseEntity<TradeExecutionResponse> placeAsk(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody PlaceAskRequest request) {
        Long sellerId = (user != null) ? user.getId() : 1L;
        TradeExecutionResponse response = orderMatchingService.placeAsk(sellerId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/bids/my")
    public ResponseEntity<List<BidResponse>> getMyBids(@AuthenticationPrincipal User user) {
        Long userId = (user != null) ? user.getId() : 1L;
        return ResponseEntity.ok(orderMatchingService.getUserBids(userId));
    }

    @GetMapping("/asks/my")
    public ResponseEntity<List<UserAskResponseDTO>> getMyAsks(@AuthenticationPrincipal User user) {
        Long userId = (user != null) ? user.getId() : 1L;
        return ResponseEntity.ok(orderMatchingService.getUserAsks(userId));
    }

    @DeleteMapping("/bids/{bidId}")
    public ResponseEntity<Map<String, String>> cancelBid(
            @AuthenticationPrincipal User user,
            @PathVariable Long bidId) {
        Long userId = (user != null) ? user.getId() : 1L;
        orderMatchingService.cancelBid(userId, bidId);
        return ResponseEntity.ok(Map.of("message", "Bid cancelled successfully and funds released to wallet."));
    }

    @DeleteMapping("/asks/{askId}")
    public ResponseEntity<Map<String, String>> cancelAsk(
            @AuthenticationPrincipal User user,
            @PathVariable Long askId) {
        Long userId = (user != null) ? user.getId() : 1L;
        orderMatchingService.cancelAsk(userId, askId);
        return ResponseEntity.ok(Map.of("message", "Ask cancelled successfully."));
    }
}
