package com.authem.auth.service;

import com.authem.auth.dto.response.BidResponse;
import com.authem.auth.dto.response.MarketSummaryResponse;

import java.util.List;

public interface MarketDataService {
    List<BidResponse> getActiveBids(Long productId, String shoeSize);
    MarketSummaryResponse getMarketSummary(Long productId, String shoeSize);
}
