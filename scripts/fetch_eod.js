import fs from 'fs';
import path from 'path';

const SECTOR_MAP = {
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

const TICKER_SECTORS = {
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

async function fetchAndSaveCompactEod() {
  const columns = [
    'name', 'description', 'close', 'change', 'volume', 'Value.Traded',
    'EMA5', 'EMA8', 'EMA13', 'EMA20', 'EMA50', 'EMA100', 'EMA200', 'RSI',
    'sector', 'close[1]', 'close[2]',
    'EMA5[1]', 'EMA8[1]', 'EMA13[1]',
    'EMA5[2]', 'EMA8[2]', 'EMA13[2]',
    'open', 'high', 'low', 'price_52_week_high', 'price_52_week_low'
  ];

  console.log('Fetching compact BIST EOD data from TradingView...');
  const res = await fetch('https://scanner.tradingview.com/turkey/scan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filter: [{ left: 'typespecs', operation: 'has', right: ['common'] }],
      options: { lang: 'tr' },
      symbols: { query: { types: [] }, tickers: [] },
      columns,
      sort: { sortBy: 'Value.Traded', sortOrder: 'desc' },
      range: [0, 600]
    })
  });

  const data = await res.json();
  const compactStocks = [];

  for (const item of data.data) {
    const d = item.d;
    const symbol = d[0];
    const desc = d[1] || symbol;
    const price = d[2];
    const changePercent = Number((d[3] || 0).toFixed(2));
    const volume = d[5] || d[4] || 0;
    const ema5 = Number(Number(d[6]).toFixed(2));
    const ema8 = Number(Number(d[7]).toFixed(2));
    const ema13 = Number(Number(d[8]).toFixed(2));
    const rawSector = d[14] || '';
    const c1 = d[15];
    const c2 = d[16];
    const e5_1 = d[17];
    const e8_1 = d[18];
    const e13_1 = d[19];
    const e5_2 = d[20];
    const e8_2 = d[21];
    const e13_2 = d[22];
    const high52w = Number((d[26] || price).toFixed(2));
    const low52w = Number((d[27] || price).toFixed(2));

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

    compactStocks.push({
      s: symbol,
      n: desc,
      sec: sector,
      p: Number(price.toFixed(2)),
      chg: changePercent,
      v: volume,
      e5: ema5,
      e8: ema8,
      e13: ema13,
      h52: high52w,
      l52: low52w,
      days: consecutiveDaysBelow,
      h1: [c1, e5_1, e8_1, e13_1],
      h2: [c2, e5_2, e8_2, e13_2]
    });
  }

  const outDir = path.resolve('src/data');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const outPath = path.join(outDir, 'bistEodData.json');
  fs.writeFileSync(outPath, JSON.stringify(compactStocks), 'utf-8');
  const sizeKb = Math.round(fs.statSync(outPath).size / 1024);
  console.log(`Saved ${compactStocks.length} compact BIST EOD stocks to ${outPath} (${sizeKb} KB)`);
}

fetchAndSaveCompactEod();
