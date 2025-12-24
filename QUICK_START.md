# 🚀 Quick Start Guide

Get the Multi-Asset Order Splitter API running in 5 minutes!

## Step 1: Install & Run
```bash
npm install
npm run dev
```

✅ Server starts at `http://localhost:3000`

## Step 2: Test Basic Orders

### BUY Order (Allocation Mode)
```bash
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{
    "orderType": "BUY",
    "amount": 10000,
    "portfolio": {
      "assets": [
        {"symbol": "AAPL", "type": "stock", "allocation": 40},
        {"symbol": "BTC", "type": "crypto", "allocation": 30, "price": 45000},
        {"symbol": "GOLD", "type": "commodity", "allocation": 20, "price": 2000},
        {"symbol": "SPY", "type": "etf", "allocation": 10}
      ]
    }
  }'
```

### BUY Order (Amount Mode)
```bash
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{
    "orderType": "BUY",
    "portfolio": {
      "assets": [
        {"symbol": "AAPL", "type": "stock", "amount": 6000},
        {"symbol": "BTC", "type": "crypto", "amount": 4000, "price": 45000}
      ]
    }
  }'
```

### SELL Order
```bash
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{
    "orderType": "SELL",
    "amount": 5000,
    "portfolio": {
      "assets": [
        {"symbol": "BTC", "type": "crypto", "allocation": 100, "price": 45000}
      ]
    }
  }'
```

## Step 3: Query Orders
```bash
# Get all orders
curl http://localhost:3000/api/v1/orders

# Filter by type
curl "http://localhost:3000/api/v1/orders?orderType=BUY"

# Filter by asset type
curl "http://localhost:3000/api/v1/orders?assetType=crypto"

# Get statistics
curl http://localhost:3000/api/v1/orders/stats

# Check market status
curl http://localhost:3000/api/v1/market/status

# Health check
curl http://localhost:3000/api/v1/health
```

## 🎯 Key Features

✅ **6 Asset Types**: stock, etf, crypto, commodity, bond, mutual_fund  
✅ **2 Input Modes**: allocation % OR dollar amounts  
✅ **Both Order Types**: BUY and SELL  
✅ **High Performance**: Sub-50ms response times  
✅ **10K req/min**: Production-ready rate limiting  

## 📚 Documentation

- **README.md** - Complete API documentation
- **TEST_EXAMPLES.md** - 20+ test scenarios
- **ANSWERS.md** - Technical decisions

🎉 You're ready to go!