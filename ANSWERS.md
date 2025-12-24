# Technical Challenge - Answers

## 1. Approach & Thought Process

**Goal**: Build high-performance multi-asset order splitter for 1M+ requests.

**Key Decisions**:

- **Multi-asset support**: Extended beyond stocks to support 6 asset types
- **Dual input modes**: Both allocation % and dollar amounts for maximum flexibility
- **Performance first**: Multi-level indexing for O(1) lookups
- **Production-ready**: Comprehensive error handling, logging, rate limiting

**Architecture**: Layered (Controller → Service → Repository) with singleton repositories for state management.

## 2. Assumptions Made

**Business**:

- US market hours (9:30 AM - 4:00 PM ET, Mon-Fri)
- 2025 US market holidays
- Default asset price: $100 (overridable)
- Both BUY and SELL orders supported
- Asset types: stock, etf, crypto, commodity, bond, mutual_fund

**Technical**:

- In-memory storage (no persistence)
- Single instance (scalable with Redis for distributed systems)
- 10K requests/minute rate limiting
- Maximum 200 assets per portfolio
- Decimal precision: 0-10 places (default 3)
- Amount limits: $0.01 - $100M

## 3. Challenges Faced

**Challenge 1: Floating-Point Precision**

- Problem: Rounding errors when splitting amounts
- Solution: "Last asset gets remainder" strategy + banker's rounding

**Challenge 2: Multi-Asset Indexing**

- Problem: Need O(1) lookups for type, symbol, AND asset type
- Solution: Three separate Map-based indexes with Set intersection

**Challenge 3: Mode Detection**

- Problem: Support both allocation % and dollar amounts
- Solution: Automatic mode detection + Zod XOR validation

**Challenge 4: Performance at Scale**

- Problem: Handle 1M+ requests efficiently
- Solution: Statistics caching (60s TTL) + efficient Set operations

## 4. Production Migration

**Infrastructure**:

- Kubernetes with HPA (3+ replicas)
- Redis for distributed caching & rate limiting
- PostgreSQL for persistent storage
- Application Load Balancer with health checks

**Monitoring**:

- APM: Datadog/New Relic
- Logs: ELK Stack with correlation IDs
- Alerts: Error rate >5%, p95 >500ms

**Security**:

- JWT authentication
- API key management
- HTTPS/TLS
- Secrets management (Vault)

**Testing**:

- Unit tests (80%+ coverage)
- Integration tests
- Load testing: 10K req/s sustained
- Chaos engineering

## 5. LLM Usage

**Used Claude (Anthropic) as:**

- Architecture advisor (layered vs hexagonal)
- Performance optimizer (indexing strategies)
- Code reviewer (TypeScript best practices)
- Documentation writer (README, examples)
- Edge case identifier (validation scenarios)

**Specific Examples**:

1. **Multi-level indexing**: Claude suggested Map<type, Set<id>> pattern
2. **Zod validation**: Guided on XOR validation for dual modes
3. **Error hierarchy**: Recommended operational vs programming error distinction
4. **Caching strategy**: Suggested 60s TTL for statistics

**Time Saved**: ~60% (30 hours → 12 hours)

**What I Did Independently**:

- Final implementation & debugging
- Manual testing of all endpoints
- Integration of all components
- Performance tuning

## Summary

Built enterprise-grade multi-asset order splitter supporting 6 asset types, dual input modes (allocation & amount), BUY/SELL orders, optimized for 1M+ requests with O(1) indexed queries, comprehensive validation, and production-ready observability.
