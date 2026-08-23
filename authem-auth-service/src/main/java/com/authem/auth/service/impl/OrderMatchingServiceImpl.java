package com.authem.auth.service.impl;

import com.authem.auth.dto.request.PlaceAskRequest;
import com.authem.auth.dto.request.PlaceBidRequest;
import com.authem.auth.dto.response.BidResponse;
import com.authem.auth.dto.response.TradeExecutionResponse;
import com.authem.auth.exception.InvalidTradeException;
import com.authem.auth.exception.ResourceNotFoundException;
import com.authem.auth.model.Bid;
import com.authem.auth.model.FulfillmentStatus;
import com.authem.auth.model.Order;
import com.authem.auth.model.OrderStatus;
import com.authem.auth.repository.BidRepository;
import com.authem.auth.repository.OrderRepository;
import com.authem.auth.service.OrderMatchingService;
import com.authem.auth.service.WalletService;
import com.authem.catalog.entity.MasterProduct;
import com.authem.catalog.repository.MasterProductRepository;
import com.authem.listing.dto.AskDTOs.UserAskResponseDTO;
import com.authem.listing.entity.Ask;
import com.authem.listing.entity.Ask.AskStatus;
import com.authem.listing.repository.AskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderMatchingServiceImpl implements OrderMatchingService {

    private final MasterProductRepository productRepository;
    private final BidRepository bidRepository;
    private final AskRepository askRepository;
    private final OrderRepository orderRepository;
    private final WalletService walletService;

    @Override
    @Transactional
    public TradeExecutionResponse placeBid(Long buyerId, PlaceBidRequest request) {
        MasterProduct product = productRepository.findById(request.getProductId())
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
        MasterProduct product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        Ask ask = Ask.builder()
                .masterProductId(product.getId())
                .sellerId(sellerId)
                .size(request.getShoeSize())
                .askPrice(request.getAskPrice())
                .status(AskStatus.ACTIVE)
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
                .shoeSize(ask.getSize())
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
        ask.setStatus(AskStatus.MATCHED);

        bidRepository.save(bid);
        askRepository.save(ask);

        walletService.settleTrade(bid.getUserId(), ask.getSellerId(), bid.getBidPrice(), executionPrice);

        Order order = Order.builder()
                .buyerId(bid.getUserId())
                .sellerId(ask.getSellerId())
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

    @Override
    @Transactional(readOnly = true)
    public List<BidResponse> getUserBids(Long userId) {
        return bidRepository.findByUserId(userId).stream()
                .map(bid -> BidResponse.builder()
                        .id(bid.getId())
                        .productId(bid.getProduct() != null ? bid.getProduct().getId() : null)
                        .productName(bid.getProduct() != null ? bid.getProduct().getName() : "Sneaker")
                        .productImageUrl(bid.getProduct() != null ? bid.getProduct().getImageUrl() : null)
                        .shoeSize(bid.getShoeSize())
                        .bidPrice(bid.getBidPrice())
                        .status(bid.getStatus().name())
                        .createdAt(bid.getCreatedAt())
                        .build())
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserAskResponseDTO> getUserAsks(Long userId) {
        return askRepository.findBySellerId(userId).stream()
                .map(ask -> {
                    MasterProduct product = productRepository.findById(ask.getMasterProductId()).orElse(null);
                    return new UserAskResponseDTO(
                            ask.getId(),
                            ask.getMasterProductId(),
                            product != null ? product.getName() : "Sneaker",
                            product != null ? product.getImageUrl() : null,
                            ask.getSellerId(),
                            ask.getSize(),
                            ask.getAskPrice(),
                            ask.getCondition(),
                            ask.getStatus().name(),
                            ask.getCreatedAt() != null ? ask.getCreatedAt().toString() : null
                    );
                })
                .toList();
    }

    @Override
    @Transactional
    public void cancelBid(Long userId, Long bidId) {
        Bid bid = bidRepository.findById(bidId)
                .orElseThrow(() -> new ResourceNotFoundException("Bid not found with id: " + bidId));

        if (!bid.getUserId().equals(userId)) {
            throw new InvalidTradeException("You are not authorized to cancel this bid.");
        }

        if (bid.getStatus() != OrderStatus.PENDING) {
            throw new InvalidTradeException("Cannot cancel bid with status: " + bid.getStatus());
        }

        bid.setStatus(OrderStatus.CANCELLED);
        bidRepository.save(bid);

        // Refund held funds back into buyer's available balance
        walletService.releaseFunds(userId, bid.getBidPrice());
    }

    @Override
    @Transactional
    public void cancelAsk(Long userId, Long askId) {
        Ask ask = askRepository.findById(askId)
                .orElseThrow(() -> new ResourceNotFoundException("Ask not found with id: " + askId));

        if (!ask.getSellerId().equals(userId)) {
            throw new InvalidTradeException("You are not authorized to cancel this ask.");
        }

        if (ask.getStatus() != AskStatus.ACTIVE) {
            throw new InvalidTradeException("Cannot cancel ask with status: " + ask.getStatus());
        }

        ask.setStatus(AskStatus.CANCELLED);
        askRepository.save(ask);
    }
}