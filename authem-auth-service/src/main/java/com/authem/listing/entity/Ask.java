package com.authem.listing.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "asks", indexes = {
        @Index(name = "idx_master_product_size", columnList = "master_product_id, size"),
        @Index(name = "idx_seller_status", columnList = "seller_id, status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "master_product_id", nullable = false)
    private Long masterProductId;

    @Column(name = "seller_id", nullable = false)
    private Long sellerId;

    @Column(nullable = false, length = 16)
    private String size;

    @Column(name = "ask_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal askPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private ItemCondition condition; // NEW_BOX, GOOD_BOX, NO_BOX, USED

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private AskStatus status; // ACTIVE, MATCHED, CANCELLED, EXPIRED

    @Column(length = 255)
    private String notes;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) this.status = AskStatus.ACTIVE;
        if (this.condition == null) this.condition = ItemCondition.NEW_BOX;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public enum ItemCondition {
        NEW_BOX, GOOD_BOX, NO_BOX, USED
    }

    public enum AskStatus {
        ACTIVE, MATCHED, CANCELLED, EXPIRED
    }
}