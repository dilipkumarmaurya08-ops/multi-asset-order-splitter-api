/**
 * Input validation using Zod for type-safe runtime validation
 * Supports multi-asset portfolios with both allocation and amount modes
 */
import { z } from 'zod';
/**
 * Create order request schema
 * Supports two modes:
 * 1. Allocation-based: amount is required, assets have allocation percentages
 * 2. Amount-based: amount is optional/omitted, assets have dollar amounts
 */
export declare const createOrderSchema: z.ZodEffects<z.ZodObject<{
    orderType: z.ZodEnum<["BUY", "SELL"]>;
    amount: z.ZodOptional<z.ZodNumber>;
    portfolio: z.ZodObject<{
        assets: z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodArray<z.ZodEffects<z.ZodObject<{
            symbol: z.ZodEffects<z.ZodString, string, string>;
            type: z.ZodOptional<z.ZodEnum<["stock", "etf", "crypto", "commodity", "bond", "mutual_fund"]>>;
            allocation: z.ZodOptional<z.ZodNumber>;
            amount: z.ZodOptional<z.ZodNumber>;
            price: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            symbol: string;
            allocation?: number | undefined;
            amount?: number | undefined;
            type?: "stock" | "etf" | "crypto" | "commodity" | "bond" | "mutual_fund" | undefined;
            price?: number | undefined;
        }, {
            symbol: string;
            allocation?: number | undefined;
            amount?: number | undefined;
            type?: "stock" | "etf" | "crypto" | "commodity" | "bond" | "mutual_fund" | undefined;
            price?: number | undefined;
        }>, {
            symbol: string;
            allocation?: number | undefined;
            amount?: number | undefined;
            type?: "stock" | "etf" | "crypto" | "commodity" | "bond" | "mutual_fund" | undefined;
            price?: number | undefined;
        }, {
            symbol: string;
            allocation?: number | undefined;
            amount?: number | undefined;
            type?: "stock" | "etf" | "crypto" | "commodity" | "bond" | "mutual_fund" | undefined;
            price?: number | undefined;
        }>, "many">, {
            symbol: string;
            allocation?: number | undefined;
            amount?: number | undefined;
            type?: "stock" | "etf" | "crypto" | "commodity" | "bond" | "mutual_fund" | undefined;
            price?: number | undefined;
        }[], {
            symbol: string;
            allocation?: number | undefined;
            amount?: number | undefined;
            type?: "stock" | "etf" | "crypto" | "commodity" | "bond" | "mutual_fund" | undefined;
            price?: number | undefined;
        }[]>, {
            symbol: string;
            allocation?: number | undefined;
            amount?: number | undefined;
            type?: "stock" | "etf" | "crypto" | "commodity" | "bond" | "mutual_fund" | undefined;
            price?: number | undefined;
        }[], {
            symbol: string;
            allocation?: number | undefined;
            amount?: number | undefined;
            type?: "stock" | "etf" | "crypto" | "commodity" | "bond" | "mutual_fund" | undefined;
            price?: number | undefined;
        }[]>, {
            symbol: string;
            allocation?: number | undefined;
            amount?: number | undefined;
            type?: "stock" | "etf" | "crypto" | "commodity" | "bond" | "mutual_fund" | undefined;
            price?: number | undefined;
        }[], {
            symbol: string;
            allocation?: number | undefined;
            amount?: number | undefined;
            type?: "stock" | "etf" | "crypto" | "commodity" | "bond" | "mutual_fund" | undefined;
            price?: number | undefined;
        }[]>;
    }, "strip", z.ZodTypeAny, {
        assets: {
            symbol: string;
            allocation?: number | undefined;
            amount?: number | undefined;
            type?: "stock" | "etf" | "crypto" | "commodity" | "bond" | "mutual_fund" | undefined;
            price?: number | undefined;
        }[];
    }, {
        assets: {
            symbol: string;
            allocation?: number | undefined;
            amount?: number | undefined;
            type?: "stock" | "etf" | "crypto" | "commodity" | "bond" | "mutual_fund" | undefined;
            price?: number | undefined;
        }[];
    }>;
}, "strip", z.ZodTypeAny, {
    orderType: "BUY" | "SELL";
    portfolio: {
        assets: {
            symbol: string;
            allocation?: number | undefined;
            amount?: number | undefined;
            type?: "stock" | "etf" | "crypto" | "commodity" | "bond" | "mutual_fund" | undefined;
            price?: number | undefined;
        }[];
    };
    amount?: number | undefined;
}, {
    orderType: "BUY" | "SELL";
    portfolio: {
        assets: {
            symbol: string;
            allocation?: number | undefined;
            amount?: number | undefined;
            type?: "stock" | "etf" | "crypto" | "commodity" | "bond" | "mutual_fund" | undefined;
            price?: number | undefined;
        }[];
    };
    amount?: number | undefined;
}>, {
    orderType: "BUY" | "SELL";
    portfolio: {
        assets: {
            symbol: string;
            allocation?: number | undefined;
            amount?: number | undefined;
            type?: "stock" | "etf" | "crypto" | "commodity" | "bond" | "mutual_fund" | undefined;
            price?: number | undefined;
        }[];
    };
    amount?: number | undefined;
}, {
    orderType: "BUY" | "SELL";
    portfolio: {
        assets: {
            symbol: string;
            allocation?: number | undefined;
            amount?: number | undefined;
            type?: "stock" | "etf" | "crypto" | "commodity" | "bond" | "mutual_fund" | undefined;
            price?: number | undefined;
        }[];
    };
    amount?: number | undefined;
}>;
/**
 * Order query parameters schema
 */
export declare const orderQuerySchema: z.ZodObject<{
    orderType: z.ZodOptional<z.ZodEnum<["BUY", "SELL"]>>;
    symbol: z.ZodOptional<z.ZodString>;
    assetType: z.ZodOptional<z.ZodEnum<["stock", "etf", "crypto", "commodity", "bond", "mutual_fund"]>>;
    fromDate: z.ZodOptional<z.ZodString>;
    toDate: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    offset: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    offset: number;
    symbol?: string | undefined;
    orderType?: "BUY" | "SELL" | undefined;
    assetType?: "stock" | "etf" | "crypto" | "commodity" | "bond" | "mutual_fund" | undefined;
    fromDate?: string | undefined;
    toDate?: string | undefined;
}, {
    symbol?: string | undefined;
    orderType?: "BUY" | "SELL" | undefined;
    assetType?: "stock" | "etf" | "crypto" | "commodity" | "bond" | "mutual_fund" | undefined;
    fromDate?: string | undefined;
    toDate?: string | undefined;
    limit?: number | undefined;
    offset?: number | undefined;
}>;
/**
 * Decimal precision configuration schema
 */
export declare const decimalPrecisionSchema: z.ZodObject<{
    decimalPlaces: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    decimalPlaces: number;
}, {
    decimalPlaces: number;
}>;
/**
 * Order ID parameter schema
 */
export declare const orderIdSchema: z.ZodObject<{
    orderId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    orderId: string;
}, {
    orderId: string;
}>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type OrderQueryInput = z.infer<typeof orderQuerySchema>;
export type DecimalPrecisionInput = z.infer<typeof decimalPrecisionSchema>;
export type OrderIdInput = z.infer<typeof orderIdSchema>;
//# sourceMappingURL=order.validator.d.ts.map