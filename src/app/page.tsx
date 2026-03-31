import Link from 'next/link';
import { Cake, Search, Heart, Sparkles, Navigation } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-12 relative overflow-hidden bg-background min-h-[100dvh]">
      {/* Whimsical Blobs - scaled down for mobile to prevent overflow/oversizing */}
      <div className="absolute -top-10 -left-10 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] bg-brand-200/50 blob-shape mix-blend-multiply filter blur-xl sm:blur-2xl opacity-70"></div>
      <div className="absolute -bottom-10 -right-10 w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] bg-brand-300/40 blob-shape-rev mix-blend-multiply filter blur-2xl sm:blur-3xl opacity-60"></div>

      <div className="z-10 w-full max-w-lg bg-white/80 backdrop-blur-2xl rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_20px_60px_-10px_rgba(242,24,91,0.15)] overflow-hidden border-2 border-white p-6 sm:p-12 flex flex-col items-center text-center transform transition-transform hover:scale-[1.01] duration-500">

        <div className="relative mb-5 sm:mb-6">
          <div className="absolute -inset-4 bg-brand-100 rounded-full blur-xl opacity-70 animate-pulse"></div>
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-brand-300 to-brand-500 text-white rounded-[1.5rem] sm:rounded-[2rem] flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-12 transition-transform duration-300 cursor-pointer">
            <Cake size={40} className="sm:w-12 sm:h-12" strokeWidth={1.5} />
            <Sparkles size={18} className="absolute -top-2 -right-2 text-accent-400 animate-bounce" />
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl font-normal text-brand-600 mb-2 sm:mb-3 font-[family-name:var(--font-pacifico)] drop-shadow-sm leading-tight">
          Loya
        </h1>
        <h2 className="text-xl sm:text-2xl font-bold text-brand-400 mb-4 sm:mb-5 tracking-wide">P Â T I S S E R I E</h2>

        <p className="text-foreground/80 mb-8 sm:mb-10 text-sm sm:text-lg px-2 font-medium">
          En mutlu anlarınızı tatlandırmak için <br className="hidden sm:block" /> sevgiyle fırınlanan el yapımı pastalarımız...
        </p>

        <div className="flex flex-col w-full gap-4 sm:gap-5">
          <Link href="/siparis-ver" className="group relative flex items-center justify-center gap-3 w-full bg-brand-500 text-white p-4 sm:p-5 rounded-2xl sm:rounded-[1.5rem] font-bold text-base sm:text-lg transition-all duration-300 shadow-[0_8px_20px_-6px_rgba(242,24,91,0.5)] active:scale-95">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-400 to-brand-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl sm:rounded-[1.5rem]"></div>
            <span className="relative z-10 flex items-center gap-3">
              <Cake size={20} className="group-hover:rotate-12 transition-transform" />
              Sipariş Oluştur
            </span>
          </Link>

          <Link href="/siparis-sorgula" className="group flex items-center justify-center gap-3 w-full bg-white text-brand-600 border-2 border-brand-200 active:bg-brand-50 p-4 sm:p-5 rounded-2xl sm:rounded-[1.5rem] font-bold text-base sm:text-lg transition-all duration-300 shadow-sm active:scale-95">
            <Navigation size={20} className="text-brand-400 group-hover:text-brand-600 group-hover:translate-x-1 transition-transform" />
            Sipariş Takibi
          </Link>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-brand-300 text-xs sm:text-sm font-bold tracking-wide uppercase">
          <Heart size={14} className="fill-brand-300 animate-pulse" /> ÖZENLE HAZIRLANIR
        </div>
      </div>
    </div>
  );
}
