package com.authem.auth.model;

public enum OrderStatus {
    PENDING,    // Active in the order book, waiting for a match
    MATCHED,    // Successfully matched and converted into an Order
    CANCELLED,  // Cancelled by the user
    EXPIRED     // Reached expiration time without matching
}
