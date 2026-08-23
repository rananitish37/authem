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
        TradeExecutionResponse response = orderMatchingService.placeBid(user.getId(), request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/asks")
    public ResponseEntity<TradeExecutionResponse> placeAsk(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody PlaceAskRequest request) {
        TradeExecutionResponse response = orderMatchingService.placeAsk(user.getId(), request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/bids/my")
    public ResponseEntity<List<BidResponse>> getMyBids(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(orderMatchingService.getUserBids(user.getId()));
    }

    @GetMapping("/asks/my")
    public ResponseEntity<List<UserAskResponseDTO>> getMyAsks(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(orderMatchingService.getUserAsks(user.getId()));
    }

    @DeleteMapping("/bids/{bidId}")
    public ResponseEntity<Map<String, String>> cancelBid(
            @AuthenticationPrincipal User user,
            @PathVariable Long bidId) {
        orderMatchingService.cancelBid(user.getId(), bidId);
        return ResponseEntity.ok(Map.of("message", "Bid cancelled successfully and funds released to wallet."));
    }

    @DeleteMapping("/asks/{askId}")
    public ResponseEntity<Map<String, String>> cancelAsk(
            @AuthenticationPrincipal User user,
            @PathVariable Long askId) {
        orderMatchingService.cancelAsk(user.getId(), askId);
        return ResponseEntity.ok(Map.of("message", "Ask cancelled successfully."));
    }
}
