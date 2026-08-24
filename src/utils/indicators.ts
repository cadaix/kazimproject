import type { Candle, IndicatorValues } from '../types/stock';

/**
 * Calculates Exponential Moving Average (EMA) for a given array of numbers.
 * @param data Array of numbers (e.g. daily close prices)
 * @param period EMA period (e.g. 5, 8, 13)
 */
export function calculateEMA(data: number[], period: number): number[] {
  if (data.length === 0) return [];
  if (data.length < period) {
    // Fallback for short dataset
    return data.map(() => data[0]);
  }

  const emaValues: number[] = new Array(data.length);
  const k = 2 / (period + 1);

  // Initial SMA for the first period
  let initialSum = 0;
  for (let i = 0; i < period; i++) {
    initialSum += data[i];
  }
  let prevEma = initialSum / period;

  // Fill pre-period values with initial SMA to maintain length alignment
  for (let i = 0; i < period; i++) {
    emaValues[i] = prevEma;
  }

  // Calculate EMA for remaining elements
  for (let i = period; i < data.length; i++) {
    const currentEma = data[i] * k + prevEma * (1 - k);
    emaValues[i] = Number(currentEma.toFixed(2));
    prevEma = currentEma;
  }

  return emaValues;
}

/**
 * Computes EMA5, EMA8, and EMA13 along with status metrics for each candle in series.
 */
export function calculateIndicators(candles: Candle[]): IndicatorValues[] {
  if (!candles || candles.length === 0) return [];

  const closes = candles.map(c => c.close);
  const ema5Series = calculateEMA(closes, 5);
  const ema8Series = calculateEMA(closes, 8);
  const ema13Series = calculateEMA(closes, 13);

  return candles.map((candle, index) => {
    const ema5 = ema5Series[index];
    const ema8 = ema8Series[index];
    const ema13 = ema13Series[index];

    // Strictly below condition
    const isBelowEma5 = candle.close < ema5;
    const isBelowEma8 = candle.close < ema8;
    const isBelowEma13 = candle.close < ema13;

    // Must be below ALL THREE EMAs (EMA 5, EMA 8, EMA 13)
    const isBelowAllEmas = isBelowEma5 && isBelowEma8 && isBelowEma13;

    const diffEma5Percent = Number((((candle.close - ema5) / ema5) * 100).toFixed(2));
    const diffEma13Percent = Number((((candle.close - ema13) / ema13) * 100).toFixed(2));

    return {
      date: candle.date,
      close: candle.close,
      ema5,
      ema8,
      ema13,
      isBelowEma5,
      isBelowEma8,
      isBelowEma13,
      isBelowAllEmas,
      diffEma5Percent,
      diffEma13Percent,
    };
  });
}

/**
 * Counts how many consecutive recent trading days (ending at latest candle)
 * the stock has closed below EMA5, EMA8, and EMA13 simultaneously.
 */
export function getConsecutiveBelowDays(indicatorHistory: IndicatorValues[]): number {
  if (!indicatorHistory || indicatorHistory.length === 0) return 0;

  let count = 0;
  // Loop backward from the latest candle
  for (let i = indicatorHistory.length - 1; i >= 0; i--) {
    if (indicatorHistory[i].isBelowAllEmas) {
      count++;
    } else {
      break; // Streak broken
    }
  }

  return count;
}
