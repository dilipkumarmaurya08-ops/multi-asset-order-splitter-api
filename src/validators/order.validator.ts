/**
 * Input validation using Zod for type-safe runtime validation
 * Supports multi-asset portfolios with both allocation and amount modes
 */

import { z } from 'zod';
import { ORDER_TYPES, ORDER_CONFIG, ASSET_TYPES } from '../config/constants';

/**
 * Asset type enum for validation
 */
const assetTypeEnum = z.enum([
  ASSET_TYPES.STOCK,
  ASSET_TYPES.ETF,
  ASSET_TYPES.CRYPTO,
  ASSET_TYPES.COMMODITY,
  ASSET_TYPES.BOND,
  ASSET_TYPES.MUTUAL_FUND,
]);

/**
 * Portfolio asset schema
 * Supports both allocation-based and amount-based inputs
 * Now includes optional asset type for categorization
 */
const portfolioAssetSchema = z.object({
  symbol: z
    .string()
    .min(1, 'Asset symbol is required')
    .max(10, 'Asset symbol must be 10 characters or less')
    .toUpperCase()
    .transform(s => s.trim()),
  type: assetTypeEnum.optional(),
  allocation: z
    .number()
    .min(0, 'Allocation must be at least 0')
    .max(100, 'Allocation cannot exceed 100')
    .optional(),
  amount: z
    .number()
    .positive('Amount must be positive')
    .finite('Amount must be a finite number')
    .optional(),
  price: z
    .number()
    .positive('Price must be positive')
    .finite('Price must be a finite number')
    .optional(),
}).refine(
  (asset) => {
    // Must have either allocation OR amount, but not both
    const hasAllocation = asset.allocation !== undefined;
    const hasAmount = asset.amount !== undefined;
    return hasAllocation !== hasAmount; // XOR: one must be true, not both
  },
  {
    message: 'Each asset must have either "allocation" (percentage) OR "amount" (dollar value), not both',
  }
);

/**
 * Portfolio schema
 * Validates that all assets use the same mode (allocation OR amount)
 */
const portfolioSchema = z.object({
  assets: z
    .array(portfolioAssetSchema)
    .min(1, 'Portfolio must contain at least one asset')
    .max(ORDER_CONFIG.MAX_ASSETS_PER_PORTFOLIO, `Portfolio cannot contain more than ${ORDER_CONFIG.MAX_ASSETS_PER_PORTFOLIO} assets`)
    .refine(
      (assets) => {
        // Check for duplicate symbols
        const symbols = assets.map((a) => a.symbol);
        return symbols.length === new Set(symbols).size;
      },
      {
        message: 'Portfolio contains duplicate asset symbols',
      }
    )
    .refine(
      (assets) => {
        // All assets must use the same mode (all allocation OR all amount)
        const hasAllocation = assets.some(a => a.allocation !== undefined);
        const hasAmount = assets.some(a => a.amount !== undefined);
        
        if (hasAllocation && hasAmount) {
          return false; // Mixed modes not allowed
        }
        
        return true;
      },
      {
        message: 'All assets must use the same mode: either all "allocation" or all "amount"',
      }
    )
    .refine(
      (assets) => {
        // If using allocation mode, check if they sum to 100%
        const firstAsset = assets[0];
        if (firstAsset.allocation !== undefined) {
          const sum = assets.reduce((acc, asset) => acc + (asset.allocation || 0), 0);
          const tolerance = 0.01;
          return Math.abs(sum - 100) < tolerance;
        }
        return true; // Amount mode doesn't need this check
      },
      {
        message: 'Asset allocations must sum to 100%',
      }
    ),
});

/**
 * Create order request schema
 * Supports two modes:
 * 1. Allocation-based: amount is required, assets have allocation percentages
 * 2. Amount-based: amount is optional/omitted, assets have dollar amounts
 */
export const createOrderSchema = z.object({
  orderType: z.enum([ORDER_TYPES.BUY, ORDER_TYPES.SELL], {
    errorMap: () => ({ message: 'Order type must be either BUY or SELL' }),
  }),
  amount: z
    .number()
    .min(
      ORDER_CONFIG.MIN_ORDER_AMOUNT,
      `Amount must be at least $${ORDER_CONFIG.MIN_ORDER_AMOUNT}`
    )
    .max(
      ORDER_CONFIG.MAX_ORDER_AMOUNT,
      `Amount cannot exceed $${ORDER_CONFIG.MAX_ORDER_AMOUNT}`
    )
    .finite('Amount must be a finite number')
    .optional(),
  portfolio: portfolioSchema,
}).refine(
  (data) => {
    // If assets have allocations, amount is required
    const firstAsset = data.portfolio.assets[0];
    if (firstAsset.allocation !== undefined) {
      return data.amount !== undefined;
    }
    // If assets have amounts, amount should not be provided (will be calculated)
    if (firstAsset.amount !== undefined) {
      return data.amount === undefined;
    }
    return false;
  },
  {
    message: 'For allocation-based portfolios, "amount" is required. For amount-based portfolios, omit "amount".',
  }
);

/**
 * Order query parameters schema
 */
export const orderQuerySchema = z.object({
  orderType: z.enum([ORDER_TYPES.BUY, ORDER_TYPES.SELL]).optional(),
  symbol: z
    .string()
    .toUpperCase()
    .optional(),
  assetType: assetTypeEnum.optional(),
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional(),
  limit: z
    .number()
    .int()
    .positive()
    .max(1000)
    .optional()
    .default(50),
  offset: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .default(0),
});

/**
 * Decimal precision configuration schema
 */
export const decimalPrecisionSchema = z.object({
  decimalPlaces: z
    .number({
      required_error: 'Decimal places is required',
      invalid_type_error: 'Decimal places must be a number',
    })
    .int('Decimal places must be an integer')
    .min(
      ORDER_CONFIG.MIN_DECIMAL_PRECISION,
      `Decimal places must be at least ${ORDER_CONFIG.MIN_DECIMAL_PRECISION}`
    )
    .max(
      ORDER_CONFIG.MAX_DECIMAL_PRECISION,
      `Decimal places cannot exceed ${ORDER_CONFIG.MAX_DECIMAL_PRECISION}`
    ),
});

/**
 * Order ID parameter schema
 */
export const orderIdSchema = z.object({
  orderId: z.string().uuid('Invalid order ID format'),
});

// Export types inferred from schemas
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type OrderQueryInput = z.infer<typeof orderQuerySchema>;
export type DecimalPrecisionInput = z.infer<typeof decimalPrecisionSchema>;
export type OrderIdInput = z.infer<typeof orderIdSchema>;