package com.authem.listing.entity;

import com.authem.catalog.entity.MasterProduct;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity(name = "ListingAsk")
@Table(name = "listing_asks", indexes = {
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "master_product_id", insertable = false, updatable = false)
    private MasterProduct product;

    @Column(name = "seller_id", nullable = false)
    private Long sellerId;

    @Column(nullable = false, length = 16)
    private String size;

    @Column(name = "ask_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal askPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    @Builder.Default
    private ItemCondition condition = ItemCondition.NEW_BOX; // NEW_BOX, GOOD_BOX, NO_BOX, USED

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    @Builder.Default
    private AskStatus status = AskStatus.ACTIVE; // ACTIVE, MATCHED, CANCELLED, EXPIRED

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

    // Alias methods for compatibility with trading engine
    public Long getUserId() {
        return this.sellerId;
    }

    public String getShoeSize() {
        return this.size;
    }

    public enum ItemCondition {
        NEW_BOX, GOOD_BOX, NO_BOX, USED
    }

    public enum AskStatus {
        ACTIVE, MATCHED, CANCELLED, EXPIRED
    }
}