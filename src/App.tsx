import { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { StockCard } from './components/StockCard';
import { StockDetailModal } from './components/StockDetailModal';
import { BottomNav } from './components/BottomNav';
import { PwaInstallPrompt } from './components/PwaInstallPrompt';
import { scanAllBistStocks } from './services/bistService';
import type { FilterState, ScanResult } from './types/stock';
import { ShieldAlert, Info, RefreshCw } from 'lucide-react';

export function App() {
  // Scanned results state
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [isScanning, setIsScanning] = useState<boolean>(true);

  // Selected Stock Modal
  const [selectedStock, setSelectedStock] = useState<ScanResult | null>(null);

  // Watchlist stored in LocalStorage
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('bist_ema_watchlist');
      return saved ? JSON.parse(saved) : ['ASELS', 'GARAN', 'THYAO'];
    } catch (e) {
      return ['ASELS', 'GARAN', 'THYAO'];
    }
  });

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    sector: 'ALL',
    targetDays: 3, // Default 3 consecutive days below EMA5, EMA8, EMA13
    sortBy: 'consecutiveDays',
    sortOrder: 'desc',
    onlyWatchlist: false,
  });

  // Mobile Bottom Tab
  const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'sectors' | 'pwa'>('all');

  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isPwaModalOpen, setIsPwaModalOpen] = useState<boolean>(false);

  // Register PWA Install Event & Service Worker
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Register basic service worker if supported
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.log('Service Worker registration skipped/failed:', err);
      });
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Run Scan when targetDays changes or manual refresh
  const runScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const results = scanAllBistStocks(filters.targetDays);
      setScanResults(results);
      setIsScanning(false);
    }, 400);
  };

  useEffect(() => {
    runScan();
  }, [filters.targetDays]);

  // Handle Watchlist toggle
  const toggleFavorite = (symbol: string) => {
    setWatchlist((prev) => {
      const updated = prev.includes(symbol)
        ? prev.filter((s) => s !== symbol)
        : [...prev, symbol];
      try {
        localStorage.setItem('bist_ema_watchlist', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const handleInstallPwa = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      setIsPwaModalOpen(true);
    }
  };

  // Sync BottomNav tab actions
  useEffect(() => {
    if (activeTab === 'favorites') {
      setFilters((f) => ({ ...f, onlyWatchlist: true, sector: 'ALL' }));
    } else if (activeTab === 'all') {
      setFilters((f) => ({ ...f, onlyWatchlist: false }));
    } else if (activeTab === 'pwa') {
      setIsPwaModalOpen(true);
    }
  }, [activeTab]);

  // Filter & Sort Scan Results
  const filteredResults = useMemo(() => {
    return scanResults
      .filter((res) => {
        // Only target days matching condition by default unless search query specified
        if (!filters.searchQuery && !filters.onlyWatchlist && !res.isMatchingTargetDays) {
          return false;
        }

        // Search query
        if (filters.searchQuery) {
          const q = filters.searchQuery.toLowerCase();
          const matchesSym = res.stock.symbol.toLowerCase().includes(q);
          const matchesName = res.stock.name.toLowerCase().includes(q);
          if (!matchesSym && !matchesName) return false;
        }

        // Sector filter
        if (filters.sector !== 'ALL' && res.stock.sector !== filters.sector) {
          return false;
        }

        // Watchlist filter
        if (filters.onlyWatchlist && !watchlist.includes(res.stock.symbol)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'consecutiveDays') {
          return b.consecutiveDaysBelow - a.consecutiveDaysBelow;
        }
        if (filters.sortBy === 'changePercent') {
          return a.stock.changePercent - b.stock.changePercent; // Lowest % change first
        }
        if (filters.sortBy === 'distanceEma5') {
          return a.latestIndicators.diffEma5Percent - b.latestIndicators.diffEma5Percent;
        }
        if (filters.sortBy === 'symbol') {
          return a.stock.symbol.localeCompare(b.stock.symbol);
        }
        if (filters.sortBy === 'volume') {
          return b.stock.volume - a.stock.volume;
        }
        return 0;
      });
  }, [scanResults, filters, watchlist]);

  const totalMatchingSignalCount = useMemo(() => {
    return scanResults.filter((r) => r.isMatchingTargetDays).length;
  }, [scanResults]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-20 md:pb-8">
      {/* Header Bar */}
      <Header
        totalScanned={scanResults.length}
        matchingCount={totalMatchingSignalCount}
        targetDays={filters.targetDays}
        onRefresh={runScan}
        isRefreshing={isScanning}
        onOpenPwaInfo={() => setIsPwaModalOpen(true)}
        canInstallPwa={!!deferredPrompt}
        onInstallPwa={handleInstallPwa}
      />

      {/* Main Content Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        {/* Banner Alert Summary */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 mb-6 border border-rose-900/40 bg-gradient-to-r from-slate-900 via-rose-950/20 to-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5 text-rose-400 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                BİST Hareketli Ortalama Kapanış Sinyali
              </h2>
              <p className="text-xs text-slate-300">
                Bu listedeki hisseler <strong>son {filters.targetDays} işlem gününde üst üste EMA 5, EMA 8 ve EMA 13</strong> değerlerinin altında kapanış gerçekleştirmiştir.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-slate-400 bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Canlı BİST Verisi Aktif
          </div>
        </div>

        {/* Filters and Controls */}
        <FilterBar
          filters={filters}
          onFilterChange={(newF) => setFilters((prev) => ({ ...prev, ...newF }))}
          totalCount={scanResults.length}
          watchlistCount={watchlist.length}
        />

        {/* Results Info Bar */}
        <div className="flex items-center justify-between mb-4 text-xs text-slate-400">
          <div className="flex items-center gap-2 font-medium">
            <span>Gösterilen: <strong className="text-white font-mono">{filteredResults.length}</strong> Hisse</span>
            {filters.sector !== 'ALL' && (
              <span className="bg-slate-800 text-cyan-400 px-2 py-0.5 rounded-full text-[10px]">
                {filters.sector} Sektörü
              </span>
            )}
            {filters.onlyWatchlist && (
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full text-[10px]">
                Sadece Favoriler
              </span>
            )}
          </div>

          <div className="text-[11px] text-slate-500 hidden sm:block">
            Karta tıklayarak teknik grafik ve EMA retest seviyelerini inceleyebilirsiniz.
          </div>
        </div>

        {/* Loading Spinner State */}
        {isScanning ? (
          <div className="glass-panel rounded-3xl p-12 text-center my-8 flex flex-col items-center justify-center">
            <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mb-3" />
            <h3 className="text-base font-bold text-white">BİST Hisseleri Taranıyor...</h3>
            <p className="text-xs text-slate-400 mt-1">
              EMA 5, EMA 8 ve EMA 13 günlük kapanış değerleri hesaplanıyor.
            </p>
          </div>
        ) : filteredResults.length > 0 ? (
          /* Grid of Stock Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResults.map((result) => (
              <StockCard
                key={result.stock.symbol}
                scanResult={result}
                isFavorite={watchlist.includes(result.stock.symbol)}
                onToggleFavorite={toggleFavorite}
                onSelectStock={(res) => setSelectedStock(res)}
              />
            ))}
          </div>
        ) : (
          /* Empty Filter State */
          <div className="glass-panel rounded-3xl p-10 text-center my-8 border border-slate-800">
            <Info className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-200">Eşleşen Hisse Bulunamadı</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-4">
              Seçtiğiniz filtreler ({filters.targetDays} gün kapanış, {filters.sector === 'ALL' ? 'Tüm Sektörler' : filters.sector}) için sinyal veren hisse bulunamadı veya arama kriterini genişletin.
            </p>
            <button
              onClick={() =>
                setFilters({
                  searchQuery: '',
                  sector: 'ALL',
                  targetDays: 3,
                  sortBy: 'consecutiveDays',
                  sortOrder: 'desc',
                  onlyWatchlist: false,
                })
              }
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-cyan-400 transition-all"
            >
              Filtreleri Sıfırla
            </button>
          </div>
        )}
      </main>

      {/* Stock Technical Detail Modal */}
      <StockDetailModal
        scanResult={selectedStock}
        onClose={() => setSelectedStock(null)}
        isFavorite={selectedStock ? watchlist.includes(selectedStock.stock.symbol) : false}
        onToggleFavorite={toggleFavorite}
      />

      {/* PWA Mobile Installation Guide Modal */}
      <PwaInstallPrompt
        isOpen={isPwaModalOpen}
        onClose={() => setIsPwaModalOpen(false)}
        canInstallDirectly={!!deferredPrompt}
        onInstallDirectly={handleInstallPwa}
      />

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        matchingCount={totalMatchingSignalCount}
        watchlistCount={watchlist.length}
      />
    </div>
  );
}

export default App;
