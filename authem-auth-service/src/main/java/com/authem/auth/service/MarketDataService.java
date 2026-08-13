package com.authem.auth.service;

import com.authem.auth.dto.response.MarketSummaryResponse;

public interface MarketDataService {
    MarketSummaryResponse getMarketSummary(Long productId, String shoeSize);
}
