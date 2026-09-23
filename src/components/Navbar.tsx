import React from 'react';
import { Sparkles, Database } from 'lucide-react';

interface NavbarProps {
  onOpenAuth: () => void;
  onScrollToPlayground: () => void;
  onOpenSqlModal: () => void;
}

export default function Navbar({ onOpenAuth, onScrollToPlayground, onOpenSqlModal }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#020617]/80 backdrop-blur-xl border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo & Studio Badge */}
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#06b6d4] shadow-sm shadow-cyan-500/20 group-hover:border-cyan-400/60 transition-colors">
              <span className="font-mono font-bold text-sm">CB</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-base tracking-tight text-white font-sans">
                  ClearBooks
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  STUDIO
                </span>
              </div>
              <span className="text-[10px] text-slate-400 tracking-normal hidden sm:block">
                For Post-Production Freelancers
              </span>
            </div>
          </div>
        </div>

        {/* Action Center */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* SQL Schema Link for developers/founders */}
          <button
            onClick={onOpenSqlModal}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors rounded-lg hover:bg-white/5 cursor-pointer font-mono"
            title="Inspect Supabase SQL Schema"
          >
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>Supabase Schema</span>
          </button>

          {/* Log In Link */}
          <button
            onClick={onOpenAuth}
            className="text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            Log in
          </button>

          {/* Glowing CTA Button */}
          <button
            onClick={onScrollToPlayground}
            className="relative group inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-[#06b6d4] hover:bg-cyan-300 rounded-lg shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer overflow-hidden"
          >
            <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-700 ease-out" />
            <Sparkles className="w-3.5 h-3.5" />
            <span className="tracking-tight whitespace-nowrap">Create My First Invoice in 30s</span>
          </button>
        </div>

      </div>
    </header>
  );
}
