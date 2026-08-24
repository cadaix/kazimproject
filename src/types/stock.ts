export interface Candle {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface IndicatorValues {
  date: string;
  close: number;
  ema5: number;
  ema8: number;
  ema13: number;
  isBelowEma5: boolean;
  isBelowEma8: boolean;
  isBelowEma13: boolean;
  isBelowAllEmas: boolean;
  diffEma5Percent: number; // ((close - ema5) / ema5) * 100
  diffEma13Percent: number;
}

export interface BistStock {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  changePercent: number;
  volume: number;
  high52w: number;
  low52w: number;
}

export interface ScanResult {
  stock: BistStock;
  candles: Candle[];
  indicatorHistory: IndicatorValues[];
  latestIndicators: IndicatorValues;
  consecutiveDaysBelow: number;
  isMatchingTargetDays: boolean;
  breakdownSeverity: 'HIGH' | 'MEDIUM' | 'LOW';
}

export type SectorFilter = 'ALL' | 'Havacılık' | 'Bankacılık' | 'Holding' | 'Sanayi' | 'Teknoloji' | 'Perakende' | 'Enerji' | 'Madencilik' | 'Otomotiv' | 'Telekom';

export type SortOption = 'consecutiveDays' | 'changePercent' | 'distanceEma5' | 'symbol' | 'volume';

export interface FilterState {
  searchQuery: string;
  sector: SectorFilter;
  targetDays: number;
  sortBy: SortOption;
  sortOrder: 'asc' | 'desc';
  onlyWatchlist: boolean;
}
