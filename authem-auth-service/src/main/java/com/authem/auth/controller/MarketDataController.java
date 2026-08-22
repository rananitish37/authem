package com.authem.auth.controller;

import com.authem.auth.dto.response.BidResponse;
import com.authem.auth.dto.response.MarketSummaryResponse;
import com.authem.auth.service.MarketDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/market-data")
@RequiredArgsConstructor
public class MarketDataController {
    private final MarketDataService marketDataService;

    @GetMapping("/products/{productId}/summary")
    public ResponseEntity<MarketSummaryResponse> getMarketSummary(
            @PathVariable Long productId,
            @RequestParam String shoeSize) {
        return ResponseEntity.ok(marketDataService.getMarketSummary(productId, shoeSize));
    }

    @GetMapping("/products/{productId}/bids")
    public ResponseEntity<List<BidResponse>> getActiveBids(
            @PathVariable Long productId,
            @RequestParam(required = false) String shoeSize) {

        List<BidResponse> bids = marketDataService.getActiveBids(productId, shoeSize);
        return ResponseEntity.ok(bids);
    }
}
