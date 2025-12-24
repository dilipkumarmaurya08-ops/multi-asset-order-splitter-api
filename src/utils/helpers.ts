/**
 * Utility helper functions
 * Reusable functions for common operations
 */

/**
 * Rounds a number to specified decimal places
 * Uses banker's rounding (round half to even) for financial accuracy
 */
export function roundToDecimal(value: number, decimals: number): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}

/**
 * Validates that a number is positive
 */
export function isPositiveNumber(value: unknown): value is number {
  return typeof value === 'number' && value > 0 && !isNaN(value) && isFinite(value);
}

/**
 * Validates that a number is non-negative
 */
export function isNonNegativeNumber(value: unknown): value is number {
  return typeof value === 'number' && value >= 0 && !isNaN(value) && isFinite(value);
}

/**
 * Validates percentage (0-100)
 */
export function isValidPercentage(value: unknown): value is number {
  return typeof value === 'number' && value >= 0 && value <= 100 && !isNaN(value);
}

/**
 * Checks if allocations sum to 100% (with tolerance for floating point)
 */
export function allocationsSumTo100(allocations: number[]): boolean {
  // ✅ FIXED: Removed space - was "allocationsSum To100"
  const sum = allocations.reduce((acc, curr) => acc + curr, 0);
  const tolerance = 0.0001; // Allow for floating point precision issues
  return Math.abs(sum - 100) < tolerance;
}

/**
 * Normalizes allocations to sum to exactly 100%
 * Distributes the difference to the largest allocation
 */
export function normalizeAllocations(allocations: number[]): number[] {
  const sum = allocations.reduce((acc, curr) => acc + curr, 0);
  
  if (Math.abs(sum - 100) < 0.0001) {
    return allocations;
  }

  const difference = 100 - sum;
  const normalized = [...allocations];
  
  // Find index of largest allocation
  const maxIndex = normalized.indexOf(Math.max(...normalized));
  normalized[maxIndex] += difference;
  
  return normalized;
}

/**
 * Safely parses a number from string or number
 */
export function parseNumber(value: unknown): number | null {
  if (typeof value === 'number') {
    return isNaN(value) || !isFinite(value) ? null : value;
  }
  
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) || !isFinite(parsed) ? null : parsed;
  }
  
  return null;
}

/**
 * Formats number as currency (USD)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Delays execution (useful for rate limiting demonstrations)
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Creates a deep copy of an object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Checks if a value is empty (null, undefined, empty string, empty array)
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Sanitizes string input to prevent injection attacks
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove HTML tags
    .trim()
    .substring(0, 1000); // Limit length
}

/**
 * Validates stock symbol format (1-5 uppercase letters)
 */
export function isValidStockSymbol(symbol: string): boolean {
  return /^[A-Z]{1,5}$/.test(symbol);
}