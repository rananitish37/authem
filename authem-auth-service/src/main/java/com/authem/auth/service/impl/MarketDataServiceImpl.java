package com.authem.auth.service.impl;

import com.authem.auth.dto.response.BidResponse;
import com.authem.auth.dto.response.MarketSummaryResponse;
import com.authem.auth.model.OrderStatus;
import com.authem.auth.repository.AskRepository;
import com.authem.auth.repository.BidRepository;
import com.authem.auth.repository.OrderRepository;
import com.authem.auth.service.MarketDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MarketDataServiceImpl implements MarketDataService {
    private final BidRepository bidRepository;
    private final AskRepository askRepository;
    private final OrderRepository orderRepository;

    @Override
    @Transactional(readOnly = true)
    public List<BidResponse> getActiveBids(Long productId, String shoeSize) {
        // Sanitize string if empty string was passed from UI
        String sanitizedSize = (shoeSize != null && !shoeSize.isBlank()) ? shoeSize : null;

        return bidRepository.findActiveBidsByProductAndSize(productId, sanitizedSize, OrderStatus.PENDING)
                .stream()
                .map(bid -> BidResponse.builder()
                        .id(bid.getId())
                        .productId(bid.getProduct().getId())
                        .shoeSize(bid.getShoeSize())
                        .bidPrice(bid.getBidPrice())
                        .status(bid.getStatus().name())
                        .createdAt(bid.getCreatedAt())
                        .build())
                .toList();
    }

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
