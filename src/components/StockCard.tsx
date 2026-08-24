import React from 'react';
import { Star, TrendingDown, ChevronRight, AlertTriangle, BarChart2 } from 'lucide-react';
import type { ScanResult } from '../types/stock';

interface StockCardProps {
  scanResult: ScanResult;
  isFavorite: boolean;
  onToggleFavorite: (symbol: string) => void;
  onSelectStock: (result: ScanResult) => void;
}

export const StockCard: React.FC<StockCardProps> = ({
  scanResult,
  isFavorite,
  onToggleFavorite,
  onSelectStock,
}) => {
  const { stock, latestIndicators, consecutiveDaysBelow, isMatchingTargetDays } = scanResult;

  const isNegative = stock.changePercent < 0;

  return (
    <div
      onClick={() => onSelectStock(scanResult)}
      className={`glass-panel glass-panel-hover rounded-2xl p-4 sm:p-5 relative cursor-pointer group transition-all duration-300 border ${
        isMatchingTargetDays
          ? 'border-rose-900/60 hover:border-rose-500/50 bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-rose-950/20'
          : 'border-slate-800/80 hover:border-slate-700'
      }`}
    >
      {/* Top Row: Symbol, Sector & Favorite Button */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-mono font-bold text-sm shadow-md ${
            isMatchingTargetDays
              ? 'bg-rose-950/90 text-rose-300 border border-rose-800/60 shadow-rose-950/50'
              : 'bg-slate-800/90 text-slate-200 border border-slate-700/60'
          }`}>
            {stock.symbol.slice(0, 4)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors font-mono">
                {stock.symbol}
              </h3>
              <span className="text-[10px] font-semibold text-slate-400 bg-slate-800/80 border border-slate-700/60 px-2 py-0.5 rounded-full">
                {stock.sector}
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate max-w-[180px] sm:max-w-[240px]">
              {stock.name}
            </p>
          </div>
        </div>

        {/* Favorite & Price */}
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(stock.symbol);
            }}
            className={`p-2 rounded-xl border transition-all ${
              isFavorite
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                : 'bg-slate-900/80 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
            title="Favorilere Ekle/Çıkar"
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Price & Daily Change */}
      <div className="flex items-baseline justify-between mb-4 bg-slate-950/60 rounded-xl p-3 border border-slate-800/60">
        <div>
          <div className="text-xs text-slate-400 mb-0.5">Son Kapanış / Fiyat</div>
          <div className="text-xl font-extrabold font-mono text-white tracking-tight">
            {stock.price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} <span className="text-sm font-normal text-slate-400">₺</span>
          </div>
        </div>

        <div className={`px-2.5 py-1 rounded-lg font-mono text-xs font-bold flex items-center gap-1 border ${
          isNegative
            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
        }`}>
          <TrendingDown className={`w-3.5 h-3.5 ${isNegative ? '' : 'rotate-180'}`} />
          {stock.changePercent > 0 ? `+${stock.changePercent.toFixed(2)}` : stock.changePercent.toFixed(2)}%
        </div>
      </div>

      {/* Breakdown Warning Badge (if matching target days condition) */}
      {isMatchingTargetDays && (
        <div className="mb-4 bg-gradient-to-r from-rose-950/80 via-rose-900/50 to-slate-900/80 border border-rose-600/40 rounded-xl p-2.5 flex items-center justify-between shadow-lg shadow-rose-950/30 animate-pulse-slow">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <div className="text-xs font-bold text-rose-200">
              EMA 5, 8 & 13 Altında <span className="underline decoration-rose-400">{consecutiveDaysBelow} Gün Kapanış</span>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold bg-rose-500 text-white px-2 py-0.5 rounded-md">
            SİNYAL
          </span>
        </div>
      )}

      {/* EMA 5, EMA 8, EMA 13 Indicators Grid */}
      <div className="grid grid-cols-3 gap-2 text-xs mb-3 font-mono">
        <div className="bg-slate-900/90 rounded-xl p-2 border border-slate-800">
          <div className="text-[10px] text-cyan-400 font-semibold mb-0.5">EMA 5</div>
          <div className="font-bold text-slate-200">{latestIndicators.ema5.toFixed(2)}</div>
          <div className={`text-[10px] ${latestIndicators.diffEma5Percent < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {latestIndicators.diffEma5Percent}%
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-xl p-2 border border-slate-800">
          <div className="text-[10px] text-amber-400 font-semibold mb-0.5">EMA 8</div>
          <div className="font-bold text-slate-200">{latestIndicators.ema8.toFixed(2)}</div>
          <div className="text-[10px] text-slate-500">8 G Ort.</div>
        </div>

        <div className="bg-slate-900/90 rounded-xl p-2 border border-slate-800">
          <div className="text-[10px] text-purple-400 font-semibold mb-0.5">EMA 13</div>
          <div className="font-bold text-slate-200">{latestIndicators.ema13.toFixed(2)}</div>
          <div className={`text-[10px] ${latestIndicators.diffEma13Percent < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {latestIndicators.diffEma13Percent}%
          </div>
        </div>
      </div>

      {/* Bottom Footer Action */}
      <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/60 text-slate-400">
        <span className="flex items-center gap-1 text-[11px]">
          <BarChart2 className="w-3.5 h-3.5 text-slate-500" />
          Hacim: {(stock.volume / 1000000).toFixed(0)}M ₺
        </span>

        <span className="text-cyan-400 font-medium flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
          Grafik & Detay
          <ChevronRight className="w-4 h-4" />
        </span>
      </div>
    </div>
  );
};
