"use strict";
/**
 * Utility helper functions
 * Reusable functions for common operations
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.roundToDecimal = roundToDecimal;
exports.isPositiveNumber = isPositiveNumber;
exports.isNonNegativeNumber = isNonNegativeNumber;
exports.isValidPercentage = isValidPercentage;
exports.allocationsSumTo100 = allocationsSumTo100;
exports.normalizeAllocations = normalizeAllocations;
exports.parseNumber = parseNumber;
exports.formatCurrency = formatCurrency;
exports.delay = delay;
exports.deepClone = deepClone;
exports.isEmpty = isEmpty;
exports.sanitizeString = sanitizeString;
exports.isValidStockSymbol = isValidStockSymbol;
/**
 * Rounds a number to specified decimal places
 * Uses banker's rounding (round half to even) for financial accuracy
 */
function roundToDecimal(value, decimals) {
    const multiplier = Math.pow(10, decimals);
    return Math.round(value * multiplier) / multiplier;
}
/**
 * Validates that a number is positive
 */
function isPositiveNumber(value) {
    return typeof value === 'number' && value > 0 && !isNaN(value) && isFinite(value);
}
/**
 * Validates that a number is non-negative
 */
function isNonNegativeNumber(value) {
    return typeof value === 'number' && value >= 0 && !isNaN(value) && isFinite(value);
}
/**
 * Validates percentage (0-100)
 */
function isValidPercentage(value) {
    return typeof value === 'number' && value >= 0 && value <= 100 && !isNaN(value);
}
/**
 * Checks if allocations sum to 100% (with tolerance for floating point)
 */
function allocationsSumTo100(allocations) {
    // ✅ FIXED: Removed space - was "allocationsSum To100"
    const sum = allocations.reduce((acc, curr) => acc + curr, 0);
    const tolerance = 0.0001; // Allow for floating point precision issues
    return Math.abs(sum - 100) < tolerance;
}
/**
 * Normalizes allocations to sum to exactly 100%
 * Distributes the difference to the largest allocation
 */
function normalizeAllocations(allocations) {
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
function parseNumber(value) {
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
function formatCurrency(amount) {
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
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
/**
 * Creates a deep copy of an object
 */
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
/**
 * Checks if a value is empty (null, undefined, empty string, empty array)
 */
function isEmpty(value) {
    if (value === null || value === undefined)
        return true;
    if (typeof value === 'string')
        return value.trim().length === 0;
    if (Array.isArray(value))
        return value.length === 0;
    if (typeof value === 'object')
        return Object.keys(value).length === 0;
    return false;
}
/**
 * Sanitizes string input to prevent injection attacks
 */
function sanitizeString(input) {
    return input
        .replace(/[<>]/g, '') // Remove HTML tags
        .trim()
        .substring(0, 1000); // Limit length
}
/**
 * Validates stock symbol format (1-5 uppercase letters)
 */
function isValidStockSymbol(symbol) {
    return /^[A-Z]{1,5}$/.test(symbol);
}
//# sourceMappingURL=helpers.js.map