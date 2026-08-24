import React from 'react';
import { Search, Star, Layers, Smartphone } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'all' | 'favorites' | 'sectors' | 'pwa';
  setActiveTab: (tab: 'all' | 'favorites' | 'sectors' | 'pwa') => void;
  matchingCount: number;
  watchlistCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  matchingCount,
  watchlistCount,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-slate-800/80 px-2 py-2 flex items-center justify-around">
      {/* Taramalar */}
      <button
        onClick={() => setActiveTab('all')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
          activeTab === 'all'
            ? 'text-cyan-400 bg-cyan-500/10 font-bold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Search className="w-5 h-5 mb-0.5" />
        <span className="text-[10px]">Taramalar</span>
        {matchingCount > 0 && (
          <span className="absolute -top-1 right-2 w-4 h-4 rounded-full bg-rose-500 text-white font-mono text-[9px] font-bold flex items-center justify-center">
            {matchingCount}
          </span>
        )}
      </button>

      {/* Favoriler */}
      <button
        onClick={() => setActiveTab('favorites')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
          activeTab === 'favorites'
            ? 'text-amber-400 bg-amber-500/10 font-bold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Star className={`w-5 h-5 mb-0.5 ${activeTab === 'favorites' ? 'fill-amber-400' : ''}`} />
        <span className="text-[10px]">Favoriler</span>
        {watchlistCount > 0 && (
          <span className="absolute -top-1 right-2 w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-mono text-[9px] font-bold flex items-center justify-center">
            {watchlistCount}
          </span>
        )}
      </button>

      {/* Sektörler */}
      <button
        onClick={() => setActiveTab('sectors')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
          activeTab === 'sectors'
            ? 'text-purple-400 bg-purple-500/10 font-bold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Layers className="w-5 h-5 mb-0.5" />
        <span className="text-[10px]">Sektörler</span>
      </button>

      {/* Mobil Uygulama / PWA */}
      <button
        onClick={() => setActiveTab('pwa')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
          activeTab === 'pwa'
            ? 'text-emerald-400 bg-emerald-500/10 font-bold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Smartphone className="w-5 h-5 mb-0.5" />
        <span className="text-[10px]">Uygulama</span>
      </button>
    </div>
  );
};
