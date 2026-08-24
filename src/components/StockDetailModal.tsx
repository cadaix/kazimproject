import React from 'react';
import { X, TrendingDown, AlertTriangle, ArrowUpRight, Calendar, Layers, ShieldCheck, Activity } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import type { ScanResult } from '../types/stock';

interface StockDetailModalProps {
  scanResult: ScanResult | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (symbol: string) => void;
}

export const StockDetailModal: React.FC<StockDetailModalProps> = ({
  scanResult,
  onClose,
  isFavorite,
  onToggleFavorite,
}) => {
  if (!scanResult) return null;

  const { stock, candles, indicatorHistory, latestIndicators, consecutiveDaysBelow, isMatchingTargetDays } = scanResult;

  // Prepare chart data (last 30 trading days)
  const chartData = indicatorHistory.slice(-30).map((ind, idx) => ({
    date: ind.date.slice(5), // MM-DD
    fullDate: ind.date,
    Kapanış: ind.close,
    EMA5: ind.ema5,
    EMA8: ind.ema8,
    EMA13: ind.ema13,
    isBelowAll: ind.isBelowAllEmas,
  }));

  // Retest target (EMA 5 level)
  const retestTargetEma5 = latestIndicators.ema5;
  const retestDiffPercent = ((retestTargetEma5 - stock.price) / stock.price) * 100;

  // Recent 8 days history table
  const recentHistory = [...indicatorHistory].reverse().slice(0, 8);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl glass-panel rounded-3xl border border-slate-700/60 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center font-mono font-extrabold text-white text-lg shadow-lg">
              {stock.symbol.slice(0, 4)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold font-mono text-white">{stock.symbol}</h2>
                <span className="text-xs bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-0.5 rounded-full font-medium">
                  {stock.sector}
                </span>
                {isMatchingTargetDays && (
                  <span className="text-xs bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {consecutiveDaysBelow} Gün Sinyal
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">{stock.name} — BİST Günlük Teknik Analiz</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(stock.symbol)}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all ${
                isFavorite
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              ★ {isFavorite ? 'Favoride' : 'Favoriye Ekle'}
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5">
              <div className="text-xs text-slate-400 mb-1">Son Kapanış</div>
              <div className="text-xl font-bold font-mono text-white">
                {stock.price.toFixed(2)} ₺
              </div>
              <div className={`text-xs font-semibold ${stock.changePercent < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {stock.changePercent > 0 ? `+${stock.changePercent}%` : `${stock.changePercent}%`}
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5">
              <div className="text-xs text-cyan-400 mb-1 font-medium">EMA 5 Seviyesi</div>
              <div className="text-xl font-bold font-mono text-cyan-200">
                {latestIndicators.ema5.toFixed(2)} ₺
              </div>
              <div className="text-xs text-rose-400 font-mono">
                {latestIndicators.diffEma5Percent}% Fark
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5">
              <div className="text-xs text-amber-400 mb-1 font-medium">EMA 8 Seviyesi</div>
              <div className="text-xl font-bold font-mono text-amber-200">
                {latestIndicators.ema8.toFixed(2)} ₺
              </div>
              <div className="text-xs text-slate-500">8 G Ort.</div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5">
              <div className="text-xs text-purple-400 mb-1 font-medium">EMA 13 Seviyesi</div>
              <div className="text-xl font-bold font-mono text-purple-200">
                {latestIndicators.ema13.toFixed(2)} ₺
              </div>
              <div className="text-xs text-rose-400 font-mono">
                {latestIndicators.diffEma13Percent}% Fark
              </div>
            </div>
          </div>

          {/* Retest & Support/Resistance Info Box */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/30 border border-cyan-500/20 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0">
                <ArrowUpRight className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100">Direnç / Retest Seviyesi (EMA 5)</h4>
                <p className="text-xs text-slate-400">
                  Hisse EMA ortalamalarının altına sarktığı için ilk muhtemel tepki direnci EMA 5 seviyesidir.
                </p>
              </div>
            </div>

            <div className="text-right bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-2 font-mono shrink-0">
              <div className="text-[11px] text-slate-400">Retest Mesafesi</div>
              <div className="text-sm font-bold text-cyan-300">
                +{retestDiffPercent.toFixed(2)}% ({retestTargetEma5.toFixed(2)} ₺)
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                Son 30 İşlem Günü Kapanış ve EMA 5 / 8 / 13 Eğrisi
              </h3>

              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="flex items-center gap-1 text-slate-200">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-100 inline-block" /> Kapanış
                </span>
                <span className="flex items-center gap-1 text-cyan-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" /> EMA 5
                </span>
                <span className="flex items-center gap-1 text-amber-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> EMA 8
                </span>
                <span className="flex items-center gap-1 text-purple-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-400 inline-block" /> EMA 13
                </span>
              </div>
            </div>

            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                  <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis domain={['auto', 'auto']} stroke="#64748b" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                    labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
                  />
                  <Line type="monotone" dataKey="Kapanış" stroke="#f8fafc" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="EMA5" stroke="#38bdf8" strokeWidth={1.5} dot={false} />
                  <Line type="monotone" dataKey="EMA8" stroke="#fbbf24" strokeWidth={1.5} dot={false} />
                  <Line type="monotone" dataKey="EMA13" stroke="#c084fc" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Daily Breakdown History Table */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-rose-400" />
              Son Kapanış Günleri Detay Tablosu
            </h3>

            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3">Tarih</th>
                    <th className="p-3">Kapanış</th>
                    <th className="p-3 text-cyan-400">EMA 5</th>
                    <th className="p-3 text-amber-400">EMA 8</th>
                    <th className="p-3 text-purple-400">EMA 13</th>
                    <th className="p-3 text-right">Durum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {recentHistory.map((row, idx) => (
                    <tr key={idx} className={row.isBelowAllEmas ? 'bg-rose-950/20' : 'hover:bg-slate-800/40'}>
                      <td className="p-3 font-semibold">{row.date}</td>
                      <td className="p-3 font-bold text-white">{row.close.toFixed(2)} ₺</td>
                      <td className="p-3">{row.ema5.toFixed(2)}</td>
                      <td className="p-3">{row.ema8.toFixed(2)}</td>
                      <td className="p-3">{row.ema13.toFixed(2)}</td>
                      <td className="p-3 text-right">
                        {row.isBelowAllEmas ? (
                          <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                            ⚠️ EMA 5,8,13 ALTI
                          </span>
                        ) : (
                          <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded text-[10px]">
                            NORMAL
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
