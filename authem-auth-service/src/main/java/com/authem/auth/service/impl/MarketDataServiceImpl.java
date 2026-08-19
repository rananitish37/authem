package com.authem.auth.service.impl;

import com.authem.auth.dto.response.MarketSummaryResponse;
import com.authem.auth.repository.AskRepository;
import com.authem.auth.repository.BidRepository;
import com.authem.auth.repository.OrderRepository;
import com.authem.auth.service.MarketDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class MarketDataServiceImpl implements MarketDataService {
    private final BidRepository bidRepository;
    private final AskRepository askRepository;
    private final OrderRepository orderRepository;

    @Override
    public MarketSummaryResponse getMarketSummary(Long productId, String shoeSize) {
        BigDecimal highestBid = bidRepository.findHighestBidPrice(productId, shoeSize).orElse(null);
        BigDecimal lowestAsk = askRepository.findLowestAskPrice(productId, shoeSize).orElse(null);
        BigDecimal lastSalePrice = orderRepository.findLastSalePriceByMasterId(productId).orElse(null);

        return MarketSummaryResponse.builder()
                .productId(productId)
                .shoeSize(shoeSize)
                .highestBid(highestBid)
                .lowestAsk(lowestAsk)
                .lastSalePrice(lastSalePrice)
                .build();
    }
}
