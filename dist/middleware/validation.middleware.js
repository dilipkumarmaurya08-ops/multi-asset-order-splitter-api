"use strict";
/**
 * Validation middleware using Zod schemas
 * Provides type-safe request validation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateParams = exports.validateQuery = exports.validateBody = void 0;
const helpers_1 = require("../utils/helpers");
/**
 * Validates request body against a Zod schema
 */
const validateBody = (schema) => {
    return (req, _res, next) => {
        try {
            req.body = schema.parse(req.body);
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.validateBody = validateBody;
/**
 * Validates request query parameters against a Zod schema
 */
const validateQuery = (schema) => {
    return (req, _res, next) => {
        try {
            // Convert query string values to appropriate types
            const parsedQuery = parseQueryParams(req.query);
            req.query = schema.parse(parsedQuery);
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.validateQuery = validateQuery;
/**
 * Validates request params against a Zod schema
 */
const validateParams = (schema) => {
    return (req, _res, next) => {
        try {
            req.params = schema.parse(req.params);
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.validateParams = validateParams;
/**
 * Parses query parameters to correct types
 */
function parseQueryParams(query) {
    const parsed = {};
    for (const [key, value] of Object.entries(query)) {
        if (value === undefined || value === null || value === '') {
            continue;
        }
        // Try to parse as number
        const numValue = (0, helpers_1.parseNumber)(value);
        if (numValue !== null) {
            parsed[key] = numValue;
            continue;
        }
        // Keep as string
        parsed[key] = value;
    }
    return parsed;
}
//# sourceMappingURL=validation.middleware.js.map