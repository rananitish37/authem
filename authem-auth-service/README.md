# Please review this readme in code view not in preview

authem-auth-service/
├── .gitignore
├── pom.xml
├── README.md
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
│   │               │   └── CorsConfig.java
│   │               │
│   │               ├── controller/                     # REST API Endpoints
│   │               │   ├── AuthController.java
│   │               │   ├── UserController.java
│   │               │   └── WalletController.java
│   │               │
│   │               ├── dto/                            # Data Transfer Objects (Contracts)
│   │               │   ├── request/
│   │               │   │   ├── LoginRequest.java
│   │               │   │   ├── RegisterRequest.java
│   │               │   │   └── WalletTopUpRequest.java
│   │               │   └── response/
│   │                   ├── AuthResponse.java
│   │                   ├── UserResponse.java
│   │                   ├── WalletResponse.java
│   │                   └── ApiResponse.java
│   │               │
│   │               ├── exception/                      # Global Error & Custom Handling
│   │               │   ├── GlobalExceptionHandler.java
│   │               │   ├── UserAlreadyExistsException.java
│   │               │   ├── ResourceNotFoundException.java
│   │               │   ├── InsufficientBalanceException.java
│   │               │   └── ErrorDetails.java
│   │               │
│   │               ├── model/                          # JPA Database Entities
│   │               │   ├── User.java
│   │               │   ├── Wallet.java
│   │               │   └── Role.java
│   │               │
│   │               ├── repository/                     # Spring Data JPA Repositories
│   │               │   ├── UserRepository.java
│   │               │   └── WalletRepository.java
│   │               │
│   │               ├── security/                       # JWT & Spring Security Core
│   │               │   ├── JwtAuthenticationFilter.java
│   │               │   ├── JwtService.java
│   │               │   └── CustomUserDetailsService.java
│   │               │
│   │               └── service/                        # Business Logic Interfaces & Impls
│   │                   ├── AuthService.java
│   │                   ├── UserService.java
│   │                   ├── WalletService.java
│   │                   └── impl/
│   │                       ├── AuthServiceImpl.java
│   │                       ├── UserServiceImpl.java
│   │                       └── WalletServiceImpl.java
│   │
│   └── resources/
│       ├── application.properties
│       └── application-dev.properties
│
└── test/                                               # Unit & Integration Tests
└── java/
└── com/
└── authem/
└── auth/
├── AuthemAuthApplicationTests.java
├── service/
│   └── AuthServiceTest.java
└── controller/
└── AuthControllerTest.java