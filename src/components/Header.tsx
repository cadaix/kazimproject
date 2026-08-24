import React from 'react';
import { Activity, RefreshCw, Smartphone, TrendingDown, ShieldAlert, Sparkles } from 'lucide-react';

interface HeaderProps {
  totalScanned: number;
  matchingCount: number;
  targetDays: number;
  onRefresh: () => void;
  isRefreshing: boolean;
  onOpenPwaInfo: () => void;
  canInstallPwa: boolean;
  onInstallPwa: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalScanned,
  matchingCount,
  targetDays,
  onRefresh,
  isRefreshing,
  onOpenPwaInfo,
  canInstallPwa,
  onInstallPwa,
}) => {
  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-800/80 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand & Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-950/40">
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                  BİST <span className="shimmer-text">EMA3</span> Tarayıcı
                </h1>
                <span className="text-[10px] font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                  {targetDays} Gün Kapanış
                </span>
              </div>
              <p className="text-xs text-slate-400">
                EMA 5, EMA 8 ve EMA 13 altında {targetDays} gün kapanış yapan Borsa İstanbul hisseleri
              </p>
            </div>
          </div>

          {/* Refresh Button for Mobile */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 active:scale-95 transition-all"
              title="Taramayı Yenile"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Live Market Counter & Actions */}
        <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/50">
          <div className="flex items-center gap-3 text-xs">
            <div className="bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-400">Taranan:</span>
              <span className="font-mono font-semibold text-slate-200">{totalScanned} Hisse</span>
            </div>

            <div className="bg-rose-950/40 border border-rose-900/60 px-3 py-1.5 rounded-lg flex items-center gap-2">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
              <span className="text-rose-300/80 font-medium">Sinyal Veren:</span>
              <span className="font-mono font-bold text-rose-400 text-sm">{matchingCount}</span>
            </div>
          </div>

          {/* PWA & Refresh Actions for Desktop */}
          <div className="hidden md:flex items-center gap-2">
            {canInstallPwa ? (
              <button
                onClick={onInstallPwa}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium text-xs flex items-center gap-1.5 hover:shadow-lg hover:shadow-cyan-500/25 active:scale-95 transition-all"
              >
                <Smartphone className="w-3.5 h-3.5" />
                Uygulamayı Yükle
              </button>
            ) : (
              <button
                onClick={onOpenPwaInfo}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs flex items-center gap-1 hover:border-slate-700 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Mobil Mod
              </button>
            )}

            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-cyan-400 font-medium text-xs flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
              {isRefreshing ? 'Taranıyor...' : 'Yenile'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
