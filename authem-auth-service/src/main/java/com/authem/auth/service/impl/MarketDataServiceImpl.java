package com.authem.auth.service.impl;

import com.authem.auth.dto.response.BidResponse;
import com.authem.auth.dto.response.MarketSummaryResponse;
import com.authem.auth.model.OrderStatus;
import com.authem.auth.repository.BidRepository;
import com.authem.auth.repository.OrderRepository;
import com.authem.auth.service.MarketDataService;
import com.authem.listing.repository.AskRepository;
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
        String sanitizedSize = (shoeSize != null && !shoeSize.isBlank()) ? shoeSize : null;

        return bidRepository.findActiveBidsByProductAndSize(productId, sanitizedSize, OrderStatus.PENDING)
                .stream()
                .map(bid -> BidResponse.builder()
                        .id(bid.getId())
                        .productId(bid.getProduct().getId())
                        .productName(bid.getProduct().getName())
                        .productImageUrl(bid.getProduct().getImageUrl())
                        .shoeSize(bid.getShoeSize())
                        .bidPrice(bid.getBidPrice())
                        .status(bid.getStatus().name())
                        .createdAt(bid.getCreatedAt())
                        .build())
                .toList();
    }

    @Override
    public MarketSummaryResponse getMarketSummary(Long productId, String shoeSize) {
        BigDecimal highestBid;
        BigDecimal lowestAsk;

        if (shoeSize != null && !shoeSize.isBlank()) {
            highestBid = bidRepository.findHighestBidPrice(productId, shoeSize).orElse(null);
            lowestAsk = askRepository.findLowestAskByProductAndSize(productId, shoeSize).orElse(null);
        } else {
            highestBid = bidRepository.findHighestBidByProduct(productId).orElse(null);
            lowestAsk = askRepository.findLowestAskByProduct(productId).orElse(null);
        }

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
