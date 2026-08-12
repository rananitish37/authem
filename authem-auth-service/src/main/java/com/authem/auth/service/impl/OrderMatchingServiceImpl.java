package com.authem.auth.service.impl;

import com.authem.auth.dto.request.PlaceAskRequest;
import com.authem.auth.dto.request.PlaceBidRequest;
import com.authem.auth.dto.response.TradeExecutionResponse;
import com.authem.auth.model.Ask;
import com.authem.auth.model.Bid;
import com.authem.auth.repository.AskRepository;
import com.authem.auth.repository.BidRepository;
import com.authem.auth.repository.OrderRepository;
import com.authem.auth.repository.ProductRepository;
import com.authem.auth.service.OrderMatchingService;
import com.authem.auth.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderMatchingServiceImpl implements OrderMatchingService {
    private final ProductRepository productRepository;
    private final BidRepository bidRepository;
    private final AskRepository askRepository;
    private final OrderRepository orderRepository;
    private final WalletService walletService;
    @Override
    public TradeExecutionResponse placeBid(Long buyerId, PlaceBidRequest request) {
        return null;
    }

    @Override
    public TradeExecutionResponse placeAsk(Long sellerId, PlaceAskRequest request) {
        return null;
    }

    @Override
    public TradeExecutionResponse executeTrade(Bid bid, Ask ask) {
        return null;
    }
}
