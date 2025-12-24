/**
 * Market service for handling trading hours and schedule
 * Determines when orders can be executed based on market status
 */
import { DateTime } from 'luxon';
export declare class MarketService {
    /**
     * Checks if the market is currently open
     */
    isMarketOpen(timestamp?: DateTime): boolean;
    /**
     * Gets the next available trading time
     */
    getNextTradingTime(timestamp?: DateTime): DateTime;
    /**
     * Gets current time in market timezone (ET)
     */
    getCurrentMarketTime(): DateTime;
    /**
     * Checks if given date is a trading day (Monday-Friday)
     */
    private isTradingDay;
    /**
     * Checks if given date is a market holiday
     */
    private isHoliday;
    /**
     * Checks if time is within trading hours (9:30 AM - 4:00 PM ET)
     */
    private isWithinTradingHours;
    /**
     * Gets the next market open time
     */
    private getNextMarketOpen;
    /**
     * Gets next Monday at market open
     */
    private getNextMonday;
    /**
     * Gets market status details
     */
    getMarketStatus(): {
        isOpen: boolean;
        currentTime: string;
        nextOpenTime?: string;
        timezone: string;
    };
}
//# sourceMappingURL=market.service.d.ts.map