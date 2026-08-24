import React from 'react';
import { Search, Star, ArrowUpDown, Layers, SlidersHorizontal } from 'lucide-react';
import type { FilterState, SectorFilter, SortOption } from '../types/stock';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  totalCount: number;
  watchlistCount: number;
}

const SECTORS: { label: string; value: SectorFilter }[] = [
  { label: 'Tüm Sektörler', value: 'ALL' },
  { label: 'Havacılık', value: 'Havacılık' },
  { label: 'Bankacılık', value: 'Bankacılık' },
  { label: 'Holding', value: 'Holding' },
  { label: 'Sanayi', value: 'Sanayi' },
  { label: 'Teknoloji', value: 'Teknoloji' },
  { label: 'Perakende', value: 'Perakende' },
  { label: 'Enerji', value: 'Enerji' },
  { label: 'Otomotiv', value: 'Otomotiv' },
  { label: 'Madencilik', value: 'Madencilik' },
  { label: 'Telekom', value: 'Telekom' },
];

const TARGET_DAYS_OPTIONS = [2, 3, 4, 5];

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  watchlistCount,
}) => {
  return (
    <div className="glass-panel rounded-2xl p-4 mb-6 border border-slate-800/80 shadow-xl">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            placeholder="Hisse Kodu (THYAO, GARAN, ASELS) veya Firma Adı..."
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/60 transition-all font-sans"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
            >
              Temizle
            </button>
          )}
        </div>

        {/* Sector & Target Days Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Sector Selector */}
          <div className="relative flex-1 sm:flex-none">
            <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-2 text-xs">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filters.sector}
                onChange={(e) => onFilterChange({ sector: e.target.value as SectorFilter })}
                className="bg-transparent text-slate-200 focus:outline-none font-medium pr-2 cursor-pointer"
              >
                {SECTORS.map((s) => (
                  <option key={s.value} value={s.value} className="bg-slate-900 text-slate-200">
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Target Days Selector */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 rounded-xl p-1 text-xs">
            <span className="text-slate-400 text-[11px] font-medium px-2 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3 text-cyan-400" />
              Kapanış:
            </span>
            {TARGET_DAYS_OPTIONS.map((days) => {
              const isActive = filters.targetDays === days;
              return (
                <button
                  key={days}
                  onClick={() => onFilterChange({ targetDays: days })}
                  className={`px-2.5 py-1 rounded-lg font-mono text-xs transition-all ${
                    isActive
                      ? 'bg-rose-500 text-white font-bold shadow-md shadow-rose-950/50'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  {days} Gün
                </button>
              );
            })}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-2 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as SortOption })}
              className="bg-transparent text-slate-200 focus:outline-none font-medium cursor-pointer"
            >
              <option value="consecutiveDays" className="bg-slate-900 text-slate-200">Sırala: Gün Sayısı</option>
              <option value="changePercent" className="bg-slate-900 text-slate-200">Sırala: Günlük % Değişim</option>
              <option value="distanceEma5" className="bg-slate-900 text-slate-200">Sırala: EMA5 Fark %</option>
              <option value="symbol" className="bg-slate-900 text-slate-200">Sırala: Sembol (A-Z)</option>
              <option value="volume" className="bg-slate-900 text-slate-200">Sırala: Hacim</option>
            </select>
          </div>

          {/* Watchlist Toggle */}
          <button
            onClick={() => onFilterChange({ onlyWatchlist: !filters.onlyWatchlist })}
            className={`px-3 py-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all ${
              filters.onlyWatchlist
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-md shadow-amber-950/40'
                : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${filters.onlyWatchlist ? 'fill-amber-400 text-amber-400' : ''}`} />
            Favoriler ({watchlistCount})
          </button>
        </div>
      </div>
    </div>
  );
};
