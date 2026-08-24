import type { BistStock, Candle, ScanResult } from '../types/stock';
import { calculateIndicators, getConsecutiveBelowDays } from '../utils/indicators';

export const BIST_STOCKS: BistStock[] = [
  { symbol: 'THYAO', name: 'Türk Hava Yolları', sector: 'Havacılık', price: 298.50, changePercent: -1.82, volume: 4850000000, high52w: 332.00, low52w: 215.00 },
  { symbol: 'GARAN', name: 'Garanti BBVA', sector: 'Bankacılık', price: 114.20, changePercent: -2.40, volume: 3900000000, high52w: 135.00, low52w: 68.50 },
  { symbol: 'EREGL', name: 'Ereğli Demir Çelik', sector: 'Sanayi', price: 46.80, changePercent: -0.95, volume: 2100000000, high52w: 58.40, low52w: 38.20 },
  { symbol: 'ASELS', name: 'Aselsan', sector: 'Teknoloji', price: 62.40, changePercent: -3.10, volume: 3100000000, high52w: 74.50, low52w: 39.80 },
  { symbol: 'BIMAS', name: 'BİM Mağazaları', sector: 'Perakende', price: 545.00, changePercent: 0.45, volume: 1800000000, high52w: 610.00, low52w: 312.00 },
  { symbol: 'AKBNK', name: 'Akbank', sector: 'Bankacılık', price: 58.90, changePercent: -1.67, volume: 2950000000, high52w: 69.80, low52w: 32.10 },
  { symbol: 'TUPRS', name: 'Tüpraş', sector: 'Enerji', price: 168.40, changePercent: -2.15, volume: 2600000000, high52w: 204.00, low52w: 128.50 },
  { symbol: 'SISE', name: 'Şişecam', sector: 'Sanayi', price: 44.10, changePercent: -1.12, volume: 1450000000, high52w: 57.20, low52w: 39.50 },
  { symbol: 'KCHOL', name: 'Koç Holding', sector: 'Holding', price: 212.00, changePercent: -0.85, volume: 2200000000, high52w: 258.00, low52w: 139.00 },
  { symbol: 'SAHOL', name: 'Sabancı Holding', sector: 'Holding', price: 92.50, changePercent: -1.90, volume: 1900000000, high52w: 108.00, low52w: 54.00 },
  { symbol: 'ISCTR', name: 'İş Bankası (C)', sector: 'Bankacılık', price: 13.85, changePercent: -2.12, volume: 2800000000, high52w: 17.50, low52w: 9.10 },
  { symbol: 'YKBNK', name: 'Yapı Kredi Bankası', sector: 'Bankacılık', price: 31.40, changePercent: -3.08, volume: 2400000000, high52w: 39.80, low52w: 18.20 },
  { symbol: 'PGSUS', name: 'Pegasus Hava Yolları', sector: 'Havacılık', price: 232.50, changePercent: -2.60, volume: 1750000000, high52w: 275.00, low52w: 160.00 },
  { symbol: 'PETKM', name: 'Petkim', sector: 'Enerji', price: 19.80, changePercent: -0.75, volume: 1200000000, high52w: 26.40, low52w: 17.10 },
  { symbol: 'KOZAL', name: 'Koza Altın', sector: 'Madencilik', price: 22.40, changePercent: -1.32, volume: 980000000, high52w: 31.00, low52w: 19.40 },
  { symbol: 'FROTO', name: 'Ford Otosan', sector: 'Otomotiv', price: 1020.00, changePercent: -0.48, volume: 1400000000, high52w: 1240.00, low52w: 780.00 },
  { symbol: 'TOASO', name: 'Tofaş Oto. Fab.', sector: 'Otomotiv', price: 248.00, changePercent: -2.74, volume: 1100000000, high52w: 325.00, low52w: 205.00 },
  { symbol: 'KONTR', name: 'Kontrolmatik Teknoloji', sector: 'Teknoloji', price: 48.20, changePercent: -4.17, volume: 850000000, high52w: 102.00, low52w: 42.00 },
  { symbol: 'TCELL', name: 'Turkcell', sector: 'Telekom', price: 98.40, changePercent: -1.00, volume: 1650000000, high52w: 115.00, low52w: 52.00 },
  { symbol: 'SASA', name: 'Sasa Polyester', sector: 'Sanayi', price: 38.60, changePercent: -2.03, volume: 1300000000, high52w: 54.00, low52w: 34.00 },
  { symbol: 'ASTOR', name: 'Astor Enerji', sector: 'Enerji', price: 89.20, changePercent: -3.45, volume: 1550000000, high52w: 138.00, low52w: 76.00 },
  { symbol: 'EKGYO', name: 'Emlak Konut GYO', sector: 'Sanayi', price: 11.25, changePercent: -0.88, volume: 1900000000, high52w: 14.20, low52w: 6.80 },
  { symbol: 'ALARK', name: 'Alarko Holding', sector: 'Holding', price: 104.50, changePercent: -1.60, volume: 890000000, high52w: 142.00, low52w: 88.00 },
  { symbol: 'SOKM', name: 'Şok Marketler', sector: 'Perakende', price: 54.80, changePercent: 0.18, volume: 720000000, high52w: 72.00, low52w: 42.00 },
  { symbol: 'TAVHL', name: 'TAV Havalimanları', sector: 'Havacılık', price: 268.00, changePercent: -1.47, volume: 830000000, high52w: 305.00, low52w: 172.00 },
  { symbol: 'TTKOM', name: 'Türk Telekom', sector: 'Telekom', price: 51.20, changePercent: -1.35, volume: 1150000000, high52w: 62.00, low52w: 28.50 },
  { symbol: 'HEKTS', name: 'Hektaş', sector: 'Sanayi', price: 14.10, changePercent: -2.76, volume: 640000000, high52w: 24.50, low52w: 12.80 },
  { symbol: 'MAVI', name: 'Mavi Giyim', sector: 'Perakende', price: 108.00, changePercent: -0.92, volume: 610000000, high52w: 132.00, low52w: 64.00 },
  { symbol: 'REEDR', name: 'Reeder Teknoloji', sector: 'Teknoloji', price: 28.40, changePercent: -5.33, volume: 920000000, high52w: 79.00, low52w: 22.00 }
];

/**
 * Generates realistic 60-day historical candle data for a stock.
 * Specific stocks like ASELS, GARAN, TUPRS, YKBNK, KONTR, REEDR are tuned to show
 * realistic multi-day EMA5, EMA8, EMA13 breakdowns (3, 4, 5 consecutive days).
 */
export function generateStockCandles(stock: BistStock): Candle[] {
  const days = 60;
  const candles: Candle[] = [];
  const now = new Date();

  // Pseudo deterministic seed based on ticker symbol
  let seed = stock.symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const pseudoRandom = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  // Determine trend profile for the last few days
  // Some stocks will have sustained drops (3+ days below EMA5/8/13)
  const breakdownTickers = ['ASELS', 'YKBNK', 'KONTR', 'REEDR', 'ASTOR', 'GARAN', 'PGSUS', 'TOASO', 'HEKTS'];
  const isBreakdownTarget = breakdownTickers.includes(stock.symbol);

  let currentPrice = stock.price;
  
  // Calculate backwards so index 59 is today
  const tempPrices: number[] = [];
  tempPrices.push(currentPrice);

  for (let i = 1; i < days; i++) {
    // Generate backwards price
    const dayOffset = i;
    let factor = 1.0;

    if (isBreakdownTarget && dayOffset <= 4) {
      // In the last 4 days, prices were higher than today (meaning current trend is dropping consecutively)
      factor = 1.01 + pseudoRandom() * 0.015;
    } else {
      // General random walk
      const deltaPercent = (pseudoRandom() - 0.49) * 0.025;
      factor = 1 + deltaPercent;
    }

    currentPrice = currentPrice * factor;
    tempPrices.unshift(currentPrice); // Prepend so oldest is first
  }

  // Build OHLCV candles
  for (let i = 0; i < days; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - (days - 1 - i));
    
    // Skip weekends
    if (d.getDay() === 0 || d.getDay() === 6) continue;

    const close = tempPrices[i];
    const open = close * (1 + (pseudoRandom() - 0.5) * 0.012);
    const high = Math.max(open, close) * (1 + pseudoRandom() * 0.01);
    const low = Math.min(open, close) * (1 - pseudoRandom() * 0.01);
    const volume = Math.floor(stock.volume * (0.8 + pseudoRandom() * 0.4) / 20);

    const dateStr = d.toISOString().split('T')[0];

    candles.push({
      date: dateStr,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume,
    });
  }

  return candles;
}

/**
 * Scans all BIST stocks and evaluates EMA5, EMA8, EMA13 breakdown criteria.
 */
export function scanAllBistStocks(targetConsecutiveDays: number = 3): ScanResult[] {
  const results: ScanResult[] = [];

  for (const stock of BIST_STOCKS) {
    const candles = generateStockCandles(stock);
    const indicatorHistory = calculateIndicators(candles);
    const latestIndicators = indicatorHistory[indicatorHistory.length - 1];
    const consecutiveDaysBelow = getConsecutiveBelowDays(indicatorHistory);

    const isMatchingTargetDays = consecutiveDaysBelow >= targetConsecutiveDays;
    
    let breakdownSeverity: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
    if (consecutiveDaysBelow >= 5) {
      breakdownSeverity = 'HIGH';
    } else if (consecutiveDaysBelow >= 3) {
      breakdownSeverity = 'MEDIUM';
    }

    results.push({
      stock,
      candles,
      indicatorHistory,
      latestIndicators,
      consecutiveDaysBelow,
      isMatchingTargetDays,
      breakdownSeverity,
    });
  }

  return results;
}
