import type { BistStock, Candle, IndicatorValues, ScanResult } from '../types/stock';
import compactEodData from '../data/bistEodData.json';

interface CompactStock {
  s: string;
  n: string;
  sec: string;
  p: number;
  chg: number;
  v: number;
  e5: number;
  e8: number;
  e13: number;
  h52: number;
  l52: number;
  days: number;
  h1: (number | null)[];
  h2: (number | null)[];
}

const SECTOR_MAP: Record<string, string> = {
  'Transportation': 'Havacılık',
  'Finance': 'Bankacılık',
  'Producer Manufacturing': 'Sanayi',
  'Process Industries': 'Sanayi',
  'Industrial Services': 'Sanayi',
  'Consumer Durables': 'Sanayi',
  'Electronic Technology': 'Teknoloji',
  'Technology Services': 'Teknoloji',
  'Retail Trade': 'Perakende',
  'Consumer Non-Durables': 'Perakende',
  'Consumer Services': 'Hizmet',
  'Utilities': 'Enerji',
  'Energy Minerals': 'Enerji',
  'Non-Energy Minerals': 'Madencilik',
  'Communications': 'Telekom',
  'Health Technology': 'Sağlık',
  'Health Services': 'Sağlık',
  'Commercial Services': 'Holding'
};

const TICKER_SECTORS: Record<string, string> = {
  'THYAO': 'Havacılık', 'PGSUS': 'Havacılık', 'TAVHL': 'Havacılık',
  'GARAN': 'Bankacılık', 'AKBNK': 'Bankacılık', 'ISCTR': 'Bankacılık',
  'YKBNK': 'Bankacılık', 'VAKBN': 'Bankacılık', 'HALKB': 'Bankacılık',
  'KCHOL': 'Holding', 'SAHOL': 'Holding', 'ALARK': 'Holding', 'DOHOL': 'Holding',
  'SISE': 'Sanayi', 'EREGL': 'Sanayi', 'KRDMD': 'Sanayi', 'SASA': 'Sanayi', 'HEKTS': 'Sanayi',
  'FROTO': 'Otomotiv', 'TOASO': 'Otomotiv', 'TTRAK': 'Otomotiv', 'DOAS': 'Otomotiv',
  'ASELS': 'Teknoloji', 'KONTR': 'Teknoloji', 'REEDR': 'Teknoloji', 'MIATK': 'Teknoloji',
  'BIMAS': 'Perakende', 'MGROS': 'Perakende', 'SOKM': 'Perakende',
  'TUPRS': 'Enerji', 'ASTOR': 'Enerji', 'PETKM': 'Enerji', 'ENJSA': 'Enerji', 'EUPWR': 'Enerji', 'CWENE': 'Enerji',
  'KOZAL': 'Madencilik', 'KOZAA': 'Madencilik', 'IPEKE': 'Madencilik',
  'TCELL': 'Telekom', 'TTKOM': 'Telekom'
};

/**
 * Builds realistic 30-day historical chart indicator values anchored to real prices & EMAs.
 */
export function buildChartHistory(
  symbol: string,
  currentPrice: number,
  changePercent: number,
  ema5: number,
  ema8: number,
  ema13: number,
  c1: number | null,
  e5_1: number | null,
  e8_1: number | null,
  e13_1: number | null,
  c2: number | null,
  e5_2: number | null,
  e8_2: number | null,
  e13_2: number | null
): { indicatorHistory: IndicatorValues[]; candles: Candle[] } {
  const count = 30;
  const now = new Date();
  const indicatorHistory: IndicatorValues[] = [];
  const candles: Candle[] = [];

  let seed = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const pseudoRandom = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  const closes: number[] = new Array(count);
  closes[count - 1] = currentPrice;
  if (c1 !== null && c1 !== undefined) closes[count - 2] = c1;
  else closes[count - 2] = Number((currentPrice / (1 + changePercent / 100)).toFixed(2));

  if (c2 !== null && c2 !== undefined) closes[count - 3] = c2;
  else closes[count - 3] = Number((closes[count - 2] * (1 + (pseudoRandom() - 0.5) * 0.015)).toFixed(2));

  for (let i = count - 4; i >= 0; i--) {
    const diff = (pseudoRandom() - 0.48) * 0.018;
    closes[i] = Number((closes[i + 1] * (1 - diff)).toFixed(2));
  }

  const dates: string[] = [];
  let d = new Date(now);
  while (dates.length < count) {
    if (d.getDay() !== 0 && d.getDay() !== 6) {
      dates.unshift(d.toISOString().split('T')[0]);
    }
    d.setDate(d.getDate() - 1);
  }

  for (let i = 0; i < count; i++) {
    const close = closes[i];
    const date = dates[i];

    let itemEma5: number;
    let itemEma8: number;
    let itemEma13: number;

    if (i === count - 1) {
      itemEma5 = Number(ema5.toFixed(2));
      itemEma8 = Number(ema8.toFixed(2));
      itemEma13 = Number(ema13.toFixed(2));
    } else if (i === count - 2 && e5_1 && e8_1 && e13_1) {
      itemEma5 = Number(e5_1.toFixed(2));
      itemEma8 = Number(e8_1.toFixed(2));
      itemEma13 = Number(e13_1.toFixed(2));
    } else if (i === count - 3 && e5_2 && e8_2 && e13_2) {
      itemEma5 = Number(e5_2.toFixed(2));
      itemEma8 = Number(e8_2.toFixed(2));
      itemEma13 = Number(e13_2.toFixed(2));
    } else {
      const progress = i / count;
      itemEma5 = Number((close * (1 + (pseudoRandom() - 0.45) * 0.012 * (1 - progress) + 0.005)).toFixed(2));
      itemEma8 = Number((itemEma5 * 1.004).toFixed(2));
      itemEma13 = Number((itemEma8 * 1.005).toFixed(2));
    }

    const isBelowEma5 = close < itemEma5;
    const isBelowEma8 = close < itemEma8;
    const isBelowEma13 = close < itemEma13;
    const isBelowAllEmas = isBelowEma5 && isBelowEma8 && isBelowEma13;

    indicatorHistory.push({
      date,
      close,
      ema5: itemEma5,
      ema8: itemEma8,
      ema13: itemEma13,
      isBelowEma5,
      isBelowEma8,
      isBelowEma13,
      isBelowAllEmas,
      diffEma5Percent: Number((((close - itemEma5) / itemEma5) * 100).toFixed(2)),
      diffEma13Percent: Number((((close - itemEma13) / itemEma13) * 100).toFixed(2)),
    });

    candles.push({
      date,
      open: Number((close * (1 + (pseudoRandom() - 0.5) * 0.01)).toFixed(2)),
      high: Number((Math.max(close, close * 1.01)).toFixed(2)),
      low: Number((Math.min(close, close * 0.99)).toFixed(2)),
      close,
      volume: Math.floor(1000000 + pseudoRandom() * 5000000),
    });
  }

  return { indicatorHistory, candles };
}

function parseCompactStock(cs: CompactStock, targetConsecutiveDays: number): ScanResult {
  const stock: BistStock = {
    symbol: cs.s,
    name: cs.n,
    sector: cs.sec,
    price: cs.p,
    changePercent: cs.chg,
    volume: cs.v,
    high52w: cs.h52,
    low52w: cs.l52
  };

  const diffEma5Percent = Number((((cs.p - cs.e5) / cs.e5) * 100).toFixed(2));
  const diffEma13Percent = Number((((cs.p - cs.e13) / cs.e13) * 100).toFixed(2));

  const isBelowEma5 = cs.p < cs.e5;
  const isBelowEma8 = cs.p < cs.e8;
  const isBelowEma13 = cs.p < cs.e13;
  const isBelowAllEmas = isBelowEma5 && isBelowEma8 && isBelowEma13;

  const nowStr = new Date().toISOString().split('T')[0];

  const latestIndicators: IndicatorValues = {
    date: nowStr,
    close: cs.p,
    ema5: cs.e5,
    ema8: cs.e8,
    ema13: cs.e13,
    isBelowEma5,
    isBelowEma8,
    isBelowEma13,
    isBelowAllEmas,
    diffEma5Percent,
    diffEma13Percent
  };

  let breakdownSeverity: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
  if (cs.days >= 3) breakdownSeverity = 'HIGH';
  else if (cs.days >= 2) breakdownSeverity = 'MEDIUM';

  const { indicatorHistory, candles } = buildChartHistory(
    cs.s,
    cs.p,
    cs.chg,
    cs.e5,
    cs.e8,
    cs.e13,
    cs.h1[0],
    cs.h1[1],
    cs.h1[2],
    cs.h1[3],
    cs.h2[0],
    cs.h2[1],
    cs.h2[2],
    cs.h2[3]
  );

  return {
    stock,
    candles,
    indicatorHistory,
    latestIndicators,
    consecutiveDaysBelow: cs.days,
    isMatchingTargetDays: cs.days >= targetConsecutiveDays,
    breakdownSeverity
  };
}

// In-memory dataset
const defaultEodResults: ScanResult[] = (compactEodData as CompactStock[]).map(cs => parseCompactStock(cs, 3));
let cachedResults: ScanResult[] = defaultEodResults;

/**
 * Scans BİST stocks. Defaults to real Gün Sonu (EOD) pre-calculated dataset
 * with live background refresh from /api/scan when online.
 */
export async function scanAllBistStocks(targetConsecutiveDays: number = 3): Promise<ScanResult[]> {
  const columns = [
    'name', 'description', 'close', 'change', 'volume', 'Value.Traded',
    'EMA5', 'EMA8', 'EMA13', 'EMA20', 'EMA50', 'EMA100', 'EMA200', 'RSI',
    'sector', 'close[1]', 'close[2]',
    'EMA5[1]', 'EMA8[1]', 'EMA13[1]',
    'EMA5[2]', 'EMA8[2]', 'EMA13[2]',
    'open', 'high', 'low', 'price_52_week_high', 'price_52_week_low'
  ];

  const payload = JSON.stringify({
    filter: [{ left: 'typespecs', operation: 'has', right: ['common'] }],
    options: { lang: 'tr' },
    symbols: { query: { types: [] }, tickers: [] },
    columns,
    sort: { sortBy: 'Value.Traded', sortOrder: 'desc' },
    range: [0, 600]
  });

  try {
    const res = await fetch('/api/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
        const freshResults: ScanResult[] = [];

        for (const item of data.data) {
          const d = item.d;
          const symbol: string = d[0];
          const desc: string = d[1] || symbol;
          const price: number = d[2];
          const changePercent: number = Number((d[3] || 0).toFixed(2));
          const volume: number = d[5] || d[4] || 0;
          const ema5 = Number(Number(d[6]).toFixed(2));
          const ema8 = Number(Number(d[7]).toFixed(2));
          const ema13 = Number(Number(d[8]).toFixed(2));
          const rawSector: string = d[14] || '';
          const c1: number | null = d[15];
          const c2: number | null = d[16];
          const e5_1: number | null = d[17];
          const e8_1: number | null = d[18];
          const e13_1: number | null = d[19];
          const e5_2: number | null = d[20];
          const e8_2: number | null = d[21];
          const e13_2: number | null = d[22];
          const high52w: number = Number((d[26] || price).toFixed(2));
          const low52w: number = Number((d[27] || price).toFixed(2));

          if (!price || !ema5 || !ema8 || !ema13) continue;

          const sector = TICKER_SECTORS[symbol] || SECTOR_MAP[rawSector] || 'Diğer';

          const day0Below = price < ema5 && price < ema8 && price < ema13;
          const day1Below = c1 !== null && e5_1 !== null && e8_1 !== null && e13_1 !== null
            ? (c1 < e5_1 && c1 < e8_1 && c1 < e13_1)
            : false;
          const day2Below = c2 !== null && e5_2 !== null && e8_2 !== null && e13_2 !== null
            ? (c2 < e5_2 && c2 < e8_2 && c2 < e13_2)
            : false;

          let consecutiveDaysBelow = 0;
          if (day0Below) {
            consecutiveDaysBelow = 1;
            if (day1Below) {
              consecutiveDaysBelow = 2;
              if (day2Below) {
                consecutiveDaysBelow = 3;
                if (changePercent < -3 && price < ema13 * 0.95) {
                  consecutiveDaysBelow = 4;
                }
              }
            }
          }

          let breakdownSeverity: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
          if (consecutiveDaysBelow >= 3) breakdownSeverity = 'HIGH';
          else if (consecutiveDaysBelow >= 2) breakdownSeverity = 'MEDIUM';

          const stock: BistStock = {
            symbol,
            name: desc,
            sector,
            price: Number(price.toFixed(2)),
            changePercent,
            volume,
            high52w,
            low52w
          };

          const { indicatorHistory, candles } = buildChartHistory(
            symbol, price, changePercent, ema5, ema8, ema13,
            c1, e5_1, e8_1, e13_1, c2, e5_2, e8_2, e13_2
          );

          const diffEma5Percent = Number((((price - ema5) / ema5) * 100).toFixed(2));
          const diffEma13Percent = Number((((price - ema13) / ema13) * 100).toFixed(2));

          const latestIndicators: IndicatorValues = {
            date: new Date().toISOString().split('T')[0],
            close: price,
            ema5,
            ema8,
            ema13,
            isBelowEma5: price < ema5,
            isBelowEma8: price < ema8,
            isBelowEma13: price < ema13,
            isBelowAllEmas: day0Below,
            diffEma5Percent,
            diffEma13Percent
          };

          freshResults.push({
            stock,
            candles,
            indicatorHistory,
            latestIndicators,
            consecutiveDaysBelow,
            isMatchingTargetDays: consecutiveDaysBelow >= targetConsecutiveDays,
            breakdownSeverity
          });
        }

        if (freshResults.length > 0) {
          cachedResults = freshResults;
        }
      }
    }
  } catch (err) {
    console.warn('Live scan fallback to EOD dataset:', err);
  }

  return cachedResults.map((item) => ({
    ...item,
    isMatchingTargetDays: item.consecutiveDaysBelow >= targetConsecutiveDays,
  }));
}
