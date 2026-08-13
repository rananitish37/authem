package com.authem.auth.controller;

import com.authem.auth.dto.response.OrderResponse;
import com.authem.auth.model.User;
import com.authem.auth.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getUserOrders(@AuthenticationPrincipal User user){
        return ResponseEntity.ok(orderService.getUserOrders(user.getId()));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrderById(@AuthenticationPrincipal User user, @PathVariable Long orderId){
        return ResponseEntity.ok(orderService.getOrderById(user.getId(), orderId));
    }
}
