import React from 'react';
import { Smartphone, Share, PlusSquare, Download, CheckCircle2, X, Sparkles } from 'lucide-react';

interface PwaInstallPromptProps {
  isOpen: boolean;
  onClose: () => void;
  canInstallDirectly: boolean;
  onInstallDirectly: () => void;
}

export const PwaInstallPrompt: React.FC<PwaInstallPromptProps> = ({
  isOpen,
  onClose,
  canInstallDirectly,
  onInstallDirectly,
}) => {
  if (!isOpen) return null;

  const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg glass-panel rounded-3xl p-6 border border-slate-700/80 shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-950/50">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
              Mobil Uygulama Olarak Yükle
              <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-400">
              Telefonunuza uygulama olarak ekleyip tek tıkla doğrudan erişin.
            </p>
          </div>
        </div>

        {/* 1-Click Install Button if supported by Browser */}
        {canInstallDirectly && (
          <div className="mb-6 p-4 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl">
            <p className="text-xs text-cyan-200 mb-3">
              Cihazınız otomatik uygulama kurulumunu destekliyor!
            </p>
            <button
              onClick={onInstallDirectly}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/50 hover:brightness-110 active:scale-95 transition-all"
            >
              <Download className="w-4 h-4" />
              Şimdi Mobil Uygulamayı Yükle
            </button>
          </div>
        )}

        {/* Manual Step-by-Step Instructions */}
        <div className="space-y-4 text-xs text-slate-300">
          <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-2xl">
            <h4 className="font-bold text-slate-100 mb-2 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-[10px] flex items-center justify-center">1</span>
              iPhone (iOS Safari) İçin Yükleme:
            </h4>
            <ol className="space-y-1.5 pl-7 list-decimal text-slate-400">
              <li>Safari tarayıcısında en alttaki <span className="text-cyan-400 font-bold flex inline-flex items-center gap-1"><Share className="w-3.5 h-3.5" /> Paylaş</span> butonuna dokunun.</li>
              <li>Açılan menüde aşağı kaydırıp <span className="text-white font-bold flex inline-flex items-center gap-1"><PlusSquare className="w-3.5 h-3.5 text-cyan-400" /> Ana Ekrana Ekle</span> seçeneğine basın.</li>
              <li>Sağ üstteki "Ekle" butonuna basarak uygulamayı tamamlayın.</li>
            </ol>
          </div>

          <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-2xl">
            <h4 className="font-bold text-slate-100 mb-2 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-[10px] flex items-center justify-center">2</span>
              Android (Chrome / Samsung Internet) İçin:
            </h4>
            <ol className="space-y-1.5 pl-7 list-decimal text-slate-400">
              <li>Sağ üstteki <strong>üç nokta (⋮)</strong> menüsüne dokunun.</li>
              <li><strong>"Uygulamayı Yükle"</strong> veya <strong>"Ana Ekrana Ekle"</strong> seçeneğini seçin.</li>
            </ol>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-emerald-400 bg-emerald-950/30 border border-emerald-900/50 p-2.5 rounded-xl">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Yüklendikten sonra Safari/Chrome çubuğu kaybolur, tam ekran mobil uygulama görünümünde çalışır.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
