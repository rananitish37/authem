package com.authem.auth.service.impl;

import com.authem.auth.dto.response.OrderResponse;
import com.authem.auth.model.Order;
import com.authem.auth.repository.OrderRepository;
import com.authem.auth.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;

    @Override
    public List<OrderResponse> getUserOrders(Long userId) {
        return orderRepository.findAllUserOrders(userId)
                .stream().map(this::mapToResponse)
                .toList();
    }

    @Override
    public OrderResponse getOrderById(Long userId, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

        if (!order.getBuyerId().equals(userId) && !order.getSellerId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to order details");
        }

        return mapToResponse(order);
    }

    private OrderResponse mapToResponse(Order order) {
        return OrderResponse.builder()
                .orderId(order.getId())
                .productId(order.getProduct().getId())
                .productName(order.getProduct().getName())
                .shoeSize(order.getShoeSize())
                .price(order.getMatchedPrice())
                .buyerId(order.getBuyerId())
                .sellerId(order.getSellerId())
                .status(order.getStatus())
                .createdAt(order.getCreatedAt())
                .build();
    }
}
