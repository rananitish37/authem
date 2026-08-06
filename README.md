## 🛠️ Architecture & Key Engineering Decisions

### 💰 Financial Precision & Wallet Design
In microservices handling monetary transactions and bidding systems, standard floating-point types (`float`, `double`) introduce binary rounding errors (e.g., `0.1 + 0.2 = 0.30000000000000004`).

To prevent financial drift:
* **Java Layer:** All currency calculations use `java.math.BigDecimal`.
* **Database Layer:** Columns are mapped using `@Column(precision = 12, scale = 2)`, rendering as `DECIMAL(12, 2)` in MySQL. This supports transaction amounts up to **$9,999,999,999.99** with strict 2-decimal precision.
* **Dual-Balance Strategy:**
    * `balance`: Unlocked funds available for user withdrawal or bidding.
    * `frozen_balance`: Funds held in escrow while a user has an active bid, preventing double-spending before auction closure.

---

### 🗄️ Database & Environment Configuration

| Service | Technology | Port |
| :--- | :--- | :--- |
| **Auth Service** | Spring Boot 3.x / Java 21 | `8080` |
| **Database** | MySQL 8.x | `3306` (or `3307`/`3308`) |
| **ORM Framework** | Hibernate 7.x / JPA | N/A |

#### Local Database Setup
Ensure MySQL is running and configured in `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/authem_auth_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver