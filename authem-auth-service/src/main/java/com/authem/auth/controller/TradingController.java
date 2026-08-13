package com.authem.auth.controller;

import com.authem.auth.dto.request.PlaceAskRequest;
import com.authem.auth.dto.request.PlaceBidRequest;
import com.authem.auth.dto.response.TradeExecutionResponse;
import com.authem.auth.model.User;
import com.authem.auth.service.OrderMatchingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/trading")
@RequiredArgsConstructor
public class TradingController {
    private final OrderMatchingService orderMatchingService;

    @PostMapping("/bids")
    public ResponseEntity<TradeExecutionResponse> placeBid(@AuthenticationPrincipal User user,
                                                           @Valid @RequestBody PlaceBidRequest request){
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
}
