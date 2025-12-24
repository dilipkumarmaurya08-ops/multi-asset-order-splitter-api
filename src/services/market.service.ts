/**
 * Market service for handling trading hours and schedule
 * Determines when orders can be executed based on market status
 */

import { DateTime } from 'luxon';
import { MARKET_CONFIG } from '../config/constants';
import { logger } from '../utils/logger';

/**
 * US market holidays for 2025 (can be extended or loaded from external source)
 */
const MARKET_HOLIDAYS_2025: string[] = [
  '2025-01-01', // New Year's Day
  '2025-01-20', // Martin Luther King Jr. Day
  '2025-02-17', // Presidents' Day
  '2025-04-18', // Good Friday
  '2025-05-26', // Memorial Day
  '2025-06-19', // Juneteenth
  '2025-07-04', // Independence Day
  '2025-09-01', // Labor Day
  '2025-11-27', // Thanksgiving
  '2025-12-25', // Christmas
];

export class MarketService {
  /**
   * Checks if the market is currently open
   */
  isMarketOpen(timestamp?: DateTime): boolean {
    const now = timestamp || this.getCurrentMarketTime();

    // Check if it's a weekend
    if (!this.isTradingDay(now)) {
      logger.debug('Market closed: Weekend', { day: now.weekday });
      return false;
    }

    // Check if it's a holiday
    if (this.isHoliday(now)) {
      logger.debug('Market closed: Holiday', { date: now.toISODate() });
      return false;
    }

    // Check if within trading hours
    if (!this.isWithinTradingHours(now)) {
      logger.debug('Market closed: Outside trading hours', {
        time: now.toFormat('HH:mm:ss'),
      });
      return false;
    }

    return true;
  }

  /**
   * Gets the next available trading time
   */
  getNextTradingTime(timestamp?: DateTime): DateTime {
    let current = timestamp || this.getCurrentMarketTime();

    // If market is currently open, return current time
    if (this.isMarketOpen(current)) {
      return current;
    }

    // Start from the next market open time
    current = this.getNextMarketOpen(current);

    // Keep moving forward until we find a valid trading day
    let attempts = 0;
    const maxAttempts = 30; // Prevent infinite loops

    while (attempts < maxAttempts) {
      if (this.isTradingDay(current) && !this.isHoliday(current)) {
        return current;
      }
      // Move to next day's market open
      current = current.plus({ days: 1 }).set({
        hour: MARKET_CONFIG.MARKET_OPEN_HOUR,
        minute: MARKET_CONFIG.MARKET_OPEN_MINUTE,
        second: 0,
        millisecond: 0,
      });
      attempts++;
    }

    // Fallback: return Monday of next week
    logger.warn('Could not find next trading time, returning next Monday');
    return this.getNextMonday(current);
  }

  /**
   * Gets current time in market timezone (ET)
   */
  getCurrentMarketTime(): DateTime {
    return DateTime.now().setZone(MARKET_CONFIG.TIMEZONE);
  }

  /**
   * Checks if given date is a trading day (Monday-Friday)
   */
private isTradingDay(date: DateTime): boolean {
  return MARKET_CONFIG.TRADING_DAYS.includes(
    date.weekday as 1 | 2 | 3 | 4 | 5
  );
}

  /**
   * Checks if given date is a market holiday
   */
  private isHoliday(date: DateTime): boolean {
    const dateStr = date.toISODate();
    return dateStr ? MARKET_HOLIDAYS_2025.includes(dateStr) : false;
  }

  /**
   * Checks if time is within trading hours (9:30 AM - 4:00 PM ET)
   */
  private isWithinTradingHours(date: DateTime): boolean {
    const marketOpen = date.set({
      hour: MARKET_CONFIG.MARKET_OPEN_HOUR,
      minute: MARKET_CONFIG.MARKET_OPEN_MINUTE,
      second: 0,
      millisecond: 0,
    });

    const marketClose = date.set({
      hour: MARKET_CONFIG.MARKET_CLOSE_HOUR,
      minute: MARKET_CONFIG.MARKET_CLOSE_MINUTE,
      second: 0,
      millisecond: 0,
    });

    return date >= marketOpen && date < marketClose;
  }

  /**
   * Gets the next market open time
   */
  private getNextMarketOpen(current: DateTime): DateTime {
    let next = current;

    // If before market open today, return today's open
    const todayOpen = current.set({
      hour: MARKET_CONFIG.MARKET_OPEN_HOUR,
      minute: MARKET_CONFIG.MARKET_OPEN_MINUTE,
      second: 0,
      millisecond: 0,
    });

    if (current < todayOpen && this.isTradingDay(current) && !this.isHoliday(current)) {
      return todayOpen;
    }

    // Otherwise, move to next day's open
    next = next.plus({ days: 1 }).set({
      hour: MARKET_CONFIG.MARKET_OPEN_HOUR,
      minute: MARKET_CONFIG.MARKET_OPEN_MINUTE,
      second: 0,
      millisecond: 0,
    });

    return next;
  }

  /**
   * Gets next Monday at market open
   */
  private getNextMonday(current: DateTime): DateTime {
    let next = current;
    while (next.weekday !== 1) {
      // 1 = Monday
      next = next.plus({ days: 1 });
    }
    return next.set({
      hour: MARKET_CONFIG.MARKET_OPEN_HOUR,
      minute: MARKET_CONFIG.MARKET_OPEN_MINUTE,
      second: 0,
      millisecond: 0,
    });
  }

  /**
   * Gets market status details
   */
  getMarketStatus(): {
    isOpen: boolean;
    currentTime: string;
    nextOpenTime?: string;
    timezone: string;
  } {
    const now = this.getCurrentMarketTime();
    const isOpen = this.isMarketOpen(now);

    return {
      isOpen,
      currentTime: now.toISO() || '',
      nextOpenTime: isOpen ? undefined : this.getNextTradingTime(now).toISO() || undefined,
      timezone: MARKET_CONFIG.TIMEZONE,
    };
  }
}