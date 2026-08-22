# Authem Auth Service

Authentication, wallet, and trading microservice for the **Authem** sneaker marketplace — a StockX-style platform for limited edition shoes.

## Tech Stack
- **Java 21** + **Spring Boot 4.1**
- **Spring Security** + **JWT** (jjwt 0.12.5)
- **Spring Data JPA** + **MySQL 8**
- **Lombok** + **Bean Validation**
- **Springdoc OpenAPI** (Swagger UI)
- **Docker** + **Docker Compose**

## Project Structure

```
authem-auth-service/
├── .env.example
├── pom.xml
├── Dockerfile
├── docker-compose.yml
└── src/
    ├── main/
    │   ├── java/
    │   │   └── com/
    │   │       └── authem/
    │   │           └── auth/
    │   │               ├── AuthemAuthApplication.java
    │   │               │
    │   │               ├── config/                         # Security & Bean configurations
    │   │               │   ├── SecurityConfig.java
    │   │               │   ├── ApplicationConfig.java
    │   │               │   ├── AdminSetupConfig.java
    │   │               │   └── OpenApiConfig.java
    │   │               │
    │   │               ├── controller/                     # REST API Endpoints
    │   │               │   ├── AuthController.java
    │   │               │   ├── ProductController.java
    │   │               │   ├── TradingController.java
    │   │               │   ├── MarketDataController.java
    │   │               │   ├── OrderController.java
    │   │               │   └── WalletController.java
    │   │               │
    │   │               ├── dto/                            # Data Transfer Objects
    │   │               │   ├── request/
    │   │               │   │   ├── LoginRequest.java
    │   │               │   │   ├── RegisterRequest.java
    │   │               │   │   ├── WalletTopUpRequest.java
    │   │               │   │   ├── HoldFundsRequest.java
    │   │               │   │   ├── PlaceBidRequest.java
    │   │               │   │   └── PlaceAskRequest.java
    │   │               │   └── response/
    │   │               │       ├── ApiResponse.java
    │   │               │       ├── AuthResponse.java
    │   │               │       ├── UserResponse.java
    │   │               │       ├── WalletResponse.java
    │   │               │       ├── BidResponse.java
    │   │               │       ├── MarketSummaryResponse.java
    │   │               │       ├── OrderResponse.java
    │   │               │       └── TradeExecutionResponse.java
    │   │               │
    │   │               ├── exception/                      # Global Error Handling
    │   │               │   ├── GlobalExceptionHandler.java
    │   │               │   ├── ErrorDetails.java
    │   │               │   ├── UserAlreadyExistsException.java
    │   │               │   ├── ResourceNotFoundException.java
    │   │               │   ├── InsufficientBalanceException.java
    │   │               │   └── InvalidTradeException.java
    │   │               │
    │   │               ├── model/                          # JPA Database Entities
    │   │               │   ├── User.java
    │   │               │   ├── Role.java
    │   │               │   ├── Wallet.java
    │   │               │   ├── Product.java
    │   │               │   ├── Bid.java
    │   │               │   ├── Ask.java
    │   │               │   ├── Order.java
    │   │               │   ├── OrderStatus.java
    │   │               │   └── FulfillmentStatus.java
    │   │               │
    │   │               ├── repository/                     # Spring Data JPA Repositories
    │   │               │   ├── UserRepository.java
    │   │               │   ├── WalletRepository.java
    │   │               │   ├── ProductRepository.java
    │   │               │   ├── BidRepository.java
    │   │               │   ├── AskRepository.java
    │   │               │   └── OrderRepository.java
    │   │               │
    │   │               ├── security/                       # JWT & Spring Security
    │   │               │   ├── JwtAuthenticationFilter.java
    │   │               │   ├── JwtService.java
    │   │               │   └── CustomUserDetailsService.java
    │   │               │
    │   │               └── service/                        # Business Logic
    │   │                   ├── AuthService.java
    │   │                   ├── WalletService.java
    │   │                   ├── OrderService.java
    │   │                   ├── MarketDataService.java
    │   │                   ├── OrderMatchingService.java
    │   │                   └── impl/
    │   │                       ├── AuthServiceImpl.java
    │   │                       ├── WalletServiceImpl.java
    │   │                       ├── OrderServiceImpl.java
    │   │                       ├── MarketDataServiceImpl.java
    │   │                       └── OrderMatchingServiceImpl.java
    │   │
    │   └── resources/
    │       └── application.properties
    │
    └── test/
        └── java/
            └── com/authem/auth/
                └── AuthemAuthApplicationTests.java
```

## Getting Started

### Prerequisites
- Java 21+
- Docker & Docker Compose (for MySQL)

### Setup

1. **Clone & configure:**
   ```bash
   cp .env.example .env
   # Edit .env with your DB password and JWT secret
   ```

2. **Start MySQL:**
   ```bash
   docker-compose up mysql-db -d
   ```

3. **Run the service:**
   ```bash
   ./mvnw spring-boot:run
   ```

4. **Or run everything with Docker:**
   ```bash
   docker-compose up --build
   ```

### API Documentation
Once running, visit: [http://localhost:8081/swagger-ui.html](http://localhost:8081/swagger-ui.html)

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/v1/auth/register` | No | Register a new user |
| POST | `/api/v1/auth/login` | No | Login & get JWT token |
| GET | `/api/v1/products` | No | List all products |
| GET | `/api/v1/products/{id}` | No | Get product by ID |
| POST | `/api/v1/products` | No | Create a product |
| GET | `/api/v1/wallet` | Yes | Get wallet balance |
| POST | `/api/v1/wallet/top-up` | Yes | Top up wallet |
| POST | `/api/v1/wallet/hold` | Yes | Hold funds (escrow) |
| POST | `/api/v1/wallet/release` | Yes | Release held funds |
| POST | `/api/v1/trading/bids` | Yes | Place a bid |
| POST | `/api/v1/trading/asks` | Yes | Place an ask |
| GET | `/api/v1/orders` | Yes | Get user's orders |
| GET | `/api/v1/orders/{id}` | Yes | Get order by ID |
| GET | `/api/v1/market-data/products/{id}/summary` | Yes | Market summary |
| GET | `/api/v1/market-data/products/{id}/bids` | Yes | Active bids |