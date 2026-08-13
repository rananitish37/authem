package com.authem.auth.service.impl;

import com.authem.auth.dto.request.PlaceAskRequest;
import com.authem.auth.dto.request.PlaceBidRequest;
import com.authem.auth.dto.response.TradeExecutionResponse;
import com.authem.auth.exception.ResourceNotFoundException;
import com.authem.auth.model.*;
import com.authem.auth.model.FulfillmentStatus;
import com.authem.auth.model.OrderStatus;
import com.authem.auth.repository.AskRepository;
import com.authem.auth.repository.BidRepository;
import com.authem.auth.repository.OrderRepository;
import com.authem.auth.repository.ProductRepository;
import com.authem.auth.service.OrderMatchingService;
import com.authem.auth.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderMatchingServiceImpl implements OrderMatchingService {

    private final ProductRepository productRepository;
    private final BidRepository bidRepository;
    private final AskRepository askRepository;
    private final OrderRepository orderRepository;
    private final WalletService walletService;

    @Override
    @Transactional
    public TradeExecutionResponse placeBid(Long buyerId, PlaceBidRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product Not Found"));

        walletService.holdFunds(buyerId, request.getBidPrice());

        Bid bid = Bid.builder()
                .userId(buyerId)
                .product(product)
                .shoeSize(request.getShoeSize())
                .bidPrice(request.getBidPrice())
                .status(OrderStatus.PENDING)
                .build();
        bid = bidRepository.save(bid);

        Optional<Ask> matchingAskOpt = askRepository.findLowestMatchingAsk(
                product.getId(),
                request.getShoeSize(),
                request.getBidPrice()
        );

        if (matchingAskOpt.isPresent()) {
            Ask matchingAsk = matchingAskOpt.get();
            return executeTrade(bid, matchingAsk);
        }

        return TradeExecutionResponse.builder()
                .bidId(bid.getId())
                .productId(product.getId())
                .shoeSize(bid.getShoeSize())
                .executionPrice(bid.getBidPrice())
                .orderStatus(OrderStatus.PENDING)
                .message("Bid placed successfully and added to order book.")
                .build();
    }

    @Override
    @Transactional
    public TradeExecutionResponse placeAsk(Long sellerId, PlaceAskRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        Ask ask = Ask.builder()
                .userId(sellerId)
                .product(product)
                .shoeSize(request.getShoeSize())
                .askPrice(request.getAskPrice())
                .status(OrderStatus.PENDING)
                .build();
        ask = askRepository.save(ask);

        Optional<Bid> matchingBidOpt = bidRepository.findHighestMatchingBid(
                product.getId(),
                request.getShoeSize(),
                request.getAskPrice()
        );

        if (matchingBidOpt.isPresent()) {
            Bid matchingBid = matchingBidOpt.get();
            return executeTrade(matchingBid, ask);
        }

        return TradeExecutionResponse.builder()
                .askId(ask.getId())
                .productId(product.getId())
                .shoeSize(ask.getShoeSize())
                .executionPrice(ask.getAskPrice())
                .orderStatus(OrderStatus.PENDING)
                .message("Ask placed successfully and added to order book.")
                .build();
    }

    @Override
    @Transactional
    public TradeExecutionResponse executeTrade(Bid bid, Ask ask) {
        BigDecimal executionPrice = ask.getAskPrice();

        bid.setStatus(OrderStatus.MATCHED);
        ask.setStatus(OrderStatus.MATCHED);

        bidRepository.save(bid);
        askRepository.save(ask);

        // 🟢 FIXED: Using bid.getUserId() & ask.getUserId()
        walletService.settleTrade(bid.getUserId(), ask.getUserId(), bid.getBidPrice(), executionPrice);

        Order order = Order.builder()
                .buyerId(bid.getUserId())
                .sellerId(ask.getUserId())
                .product(bid.getProduct())
                .bid(bid)
                .ask(ask)
                .shoeSize(bid.getShoeSize())
                .matchedPrice(executionPrice)
                .status(FulfillmentStatus.PENDING_SELLER_SHIPMENT)
                .build();

        order = orderRepository.save(order);

        return TradeExecutionResponse.builder()
                .orderId(order.getId())
                .bidId(bid.getId())
                .askId(ask.getId())
                .productId(bid.getProduct().getId())
                .shoeSize(bid.getShoeSize())
                .executionPrice(executionPrice)
                .orderStatus(OrderStatus.MATCHED)
                .message("Trade matched and order executed successfully!")
                .build();
    }
}