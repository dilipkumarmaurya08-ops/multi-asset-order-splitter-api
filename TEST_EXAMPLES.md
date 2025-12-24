# 🧪 Test Examples

Complete test scenarios for the Multi-Asset Order Splitter API.

## 📊 Allocation-Based Examples

### Example 1: Diversified 4-Asset Portfolio

```bash
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{
    "orderType": "BUY",
    "amount": 100000,
    "portfolio": {
      "assets": [
        {"symbol": "AAPL", "type": "stock", "allocation": 25, "price": 180},
        {"symbol": "BTC", "type": "crypto", "allocation": 25, "price": 45000},
        {"symbol": "SPY", "type": "etf", "allocation": 25},
        {"symbol": "GOLD", "type": "commodity", "allocation": 25, "price": 2000}
      ]
    }
  }'
```

### Example 2: Crypto-Heavy Portfolio

```bash
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{
    "orderType": "BUY",
    "amount": 50000,
    "portfolio": {
      "assets": [
        {"symbol": "BTC", "type": "crypto", "allocation": 50, "price": 45000},
        {"symbol": "ETH", "type": "crypto", "allocation": 30, "price": 2500},
        {"symbol": "SOL", "type": "crypto", "allocation": 20, "price": 100}
      ]
    }
  }'
```

### Example 3: Conservative Bond Portfolio

```bash
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{
    "orderType": "BUY",
    "amount": 50000,
    "portfolio": {
      "assets": [
        {"symbol": "AGG", "type": "etf", "allocation": 40},
        {"symbol": "GOVT", "type": "bond", "allocation": 35},
        {"symbol": "TIP", "type": "bond", "allocation": 25}
      ]
    }
  }'
```

## 💰 Amount-Based Examples

### Example 4: Direct Dollar Allocation

```bash
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{
    "orderType": "BUY",
    "portfolio": {
      "assets": [
        {"symbol": "AAPL", "type": "stock", "amount": 5000, "price": 180},
        {"symbol": "GOOGL", "type": "stock", "amount": 3000, "price": 140},
        {"symbol": "MSFT", "type": "stock", "amount": 2000, "price": 380}
      ]
    }
  }'
```

### Example 5: Crypto Investment

```bash
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{
    "orderType": "BUY",
    "portfolio": {
      "assets": [
        {"symbol": "BTC", "type": "crypto", "amount": 10000, "price": 45000},
        {"symbol": "ETH", "type": "crypto", "amount": 5000, "price": 2500}
      ]
    }
  }'
```

## 📉 SELL Order Examples

### Example 6: Liquidate Crypto

```bash
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{
    "orderType": "SELL",
    "amount": 25000,
    "portfolio": {
      "assets": [
        {"symbol": "BTC", "type": "crypto", "allocation": 60, "price": 45000},
        {"symbol": "ETH", "type": "crypto", "allocation": 40, "price": 2500}
      ]
    }
  }'
```

### Example 7: Sell Single Stock

```bash
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{
    "orderType": "SELL",
    "amount": 10000,
    "portfolio": {
      "assets": [
        {"symbol": "AAPL", "type": "stock", "allocation": 100, "price": 180}
      ]
    }
  }'
```

## 🔍 Query Examples

### Filter by Order Type

```bash
curl "http://localhost:3000/api/v1/orders?orderType=BUY"
curl "http://localhost:3000/api/v1/orders?orderType=SELL"
```

### Filter by Asset Type

```bash
curl "http://localhost:3000/api/v1/orders?assetType=crypto"
curl "http://localhost:3000/api/v1/orders?assetType=stock"
curl "http://localhost:3000/api/v1/orders?assetType=etf"p-=
Y
```

### Filter by Symbol

```bash
curl "http://localhost:3000/api/v1/orders?symbol=BTC"
curl "http://localhost:3000/api/v1/orders?symbol=AAPL"
```

### Combined Filters

```bash
curl "http://localhost:3000/api/v1/orders?orderType=BUY&assetType=crypto&limit=10"
```

### Pagination

```bash
curl "http://localhost:3000/api/v1/orders?limit=10&offset=0"
curl "http://localhost:3000/api/v1/orders?limit=10&offset=10"
```

## ⚙️ Configuration Examples

### Change Decimal Precision

```bash
# Set to 5 decimal places
curl -X PUT http://localhost:3000/api/v1/config/precision \
  -H "Content-Type: application/json" \
  -d '{"decimalPlaces": 5}'

# Set to 7 decimal places
curl -X PUT http://localhost:3000/api/v1/config/precision \
  -H "Content-Type: application/json" \
  -d '{"decimalPlaces": 7}'
```

## ❌ Error Test Cases

### Invalid: Allocations Don't Sum to 100%

```bash
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{
    "orderType": "BUY",
    "amount": 1000,
    "portfolio": {
      "assets": [
        {"symbol": "AAPL", "allocation": 60},
        {"symbol": "TSLA", "allocation": 30}
      ]
    }
  }'
```

### Invalid: Mixed Input Modes

```bash
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{
    "orderType": "BUY",
    "portfolio": {
      "assets": [
        {"symbol": "AAPL", "allocation": 50},
        {"symbol": "TSLA", "amount": 500}
      ]
    }
  }'
```

### Invalid: Duplicate Symbols

```bash
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{
    "orderType": "BUY",
    "amount": 1000,
    "portfolio": {
      "assets": [
        {"symbol": "AAPL", "allocation": 50},
        {"symbol": "AAPL", "allocation": 50}
      ]
    }
  }'
```

## 🎯 Summary

✅ **Allocation Mode**: Specify percentages  
✅ **Amount Mode**: Specify dollar amounts  
✅ **BUY & SELL**: Both order types supported  
✅ **6 Asset Types**: Full multi-asset support  
✅ **Flexible Filtering**: Query by type, symbol, asset type

Ready to build your robo-advisor! 🚀
