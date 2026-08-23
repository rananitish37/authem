package com.authem.auth.service;

import com.authem.auth.dto.request.PlaceBidRequest;
import com.authem.auth.dto.response.TradeExecutionResponse;
import com.authem.auth.model.*;
import com.authem.auth.repository.BidRepository;
import com.authem.auth.repository.OrderRepository;
import com.authem.auth.service.impl.OrderMatchingServiceImpl;
import com.authem.catalog.entity.MasterProduct;
import com.authem.catalog.repository.MasterProductRepository;
import com.authem.listing.entity.Ask;
import com.authem.listing.entity.Ask.AskStatus;
import com.authem.listing.repository.AskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderMatchingServiceImplTest {

    @Mock private MasterProductRepository productRepository;
    @Mock private BidRepository bidRepository;
    @Mock private AskRepository askRepository;
    @Mock private OrderRepository orderRepository;
    @Mock private WalletService walletService;

    @InjectMocks
    private OrderMatchingServiceImpl orderMatchingService;

    private MasterProduct mockProduct;

    @BeforeEach
    void setUp() {
        mockProduct = MasterProduct.builder()
                .id(1L)
                .name("Air Jordan 1 Retro High")
                .sku("AJ1-001")
                .build();
    }

    @Test
    @DisplayName("placeBid - Placed in order book when no matching ask exists")
    void placeBid_NoMatch_PlacedInOrderBook() {
        PlaceBidRequest request = new PlaceBidRequest();
        request.setProductId(1L);
        request.setShoeSize("10.5");
        request.setBidPrice(new BigDecimal("200.00"));

        when(productRepository.findById(1L)).thenReturn(Optional.of(mockProduct));
        when(askRepository.findLowestMatchingAsk(1L, "10.5", new BigDecimal("200.00")))
                .thenReturn(Optional.empty());

        when(bidRepository.save(any(Bid.class))).thenAnswer(i -> {
            Bid b = i.getArgument(0);
            b.setId(10L);
            return b;
        });

        TradeExecutionResponse response = orderMatchingService.placeBid(100L, request);

        verify(walletService, times(1)).holdFunds(100L, new BigDecimal("200.00"));
        assertEquals(OrderStatus.PENDING, response.getOrderStatus());
        assertEquals("Bid placed successfully and added to order book.", response.getMessage());
    }

    @Test
    @DisplayName("placeBid - Instant trade execution when matching ask exists")
    void placeBid_MatchFound_ExecutesTrade() {
        PlaceBidRequest request = new PlaceBidRequest();
        request.setProductId(1L);
        request.setShoeSize("10.5");
        request.setBidPrice(new BigDecimal("220.00"));

        Ask matchingAsk = Ask.builder()
                .id(5L)
                .sellerId(200L)
                .masterProductId(1L)
                .size("10.5")
                .askPrice(new BigDecimal("200.00"))
                .status(AskStatus.ACTIVE)
                .build();

        when(productRepository.findById(1L)).thenReturn(Optional.of(mockProduct));
        when(bidRepository.save(any(Bid.class))).thenAnswer(i -> i.getArgument(0));
        when(askRepository.findLowestMatchingAsk(1L, "10.5", new BigDecimal("220.00")))
                .thenReturn(Optional.of(matchingAsk));

        when(orderRepository.save(any(Order.class))).thenAnswer(i -> {
            Order o = i.getArgument(0);
            o.setId(99L);
            return o;
        });

        TradeExecutionResponse response = orderMatchingService.placeBid(100L, request);

        assertEquals(OrderStatus.MATCHED, response.getOrderStatus());
        assertEquals(new BigDecimal("200.00"), response.getExecutionPrice());
        verify(walletService, times(1)).settleTrade(100L, 200L, new BigDecimal("220.00"), new BigDecimal("200.00"));
    }
}