package com.authem.auth.service;

import com.authem.auth.dto.response.OrderResponse;

import java.util.List;

public interface OrderService {
    List<OrderResponse> getUserOrders(Long userId);
    OrderResponse getOrderById(Long userId, Long orderId);
}
