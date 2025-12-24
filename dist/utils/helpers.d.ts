/**
 * Utility helper functions
 * Reusable functions for common operations
 */
/**
 * Rounds a number to specified decimal places
 * Uses banker's rounding (round half to even) for financial accuracy
 */
export declare function roundToDecimal(value: number, decimals: number): number;
/**
 * Validates that a number is positive
 */
export declare function isPositiveNumber(value: unknown): value is number;
/**
 * Validates that a number is non-negative
 */
export declare function isNonNegativeNumber(value: unknown): value is number;
/**
 * Validates percentage (0-100)
 */
export declare function isValidPercentage(value: unknown): value is number;
/**
 * Checks if allocations sum to 100% (with tolerance for floating point)
 */
export declare function allocationsSumTo100(allocations: number[]): boolean;
/**
 * Normalizes allocations to sum to exactly 100%
 * Distributes the difference to the largest allocation
 */
export declare function normalizeAllocations(allocations: number[]): number[];
/**
 * Safely parses a number from string or number
 */
export declare function parseNumber(value: unknown): number | null;
/**
 * Formats number as currency (USD)
 */
export declare function formatCurrency(amount: number): string;
/**
 * Delays execution (useful for rate limiting demonstrations)
 */
export declare function delay(ms: number): Promise<void>;
/**
 * Creates a deep copy of an object
 */
export declare function deepClone<T>(obj: T): T;
/**
 * Checks if a value is empty (null, undefined, empty string, empty array)
 */
export declare function isEmpty(value: unknown): boolean;
/**
 * Sanitizes string input to prevent injection attacks
 */
export declare function sanitizeString(input: string): string;
/**
 * Validates stock symbol format (1-5 uppercase letters)
 */
export declare function isValidStockSymbol(symbol: string): boolean;
//# sourceMappingURL=helpers.d.ts.map