import React from 'react';
import { Sparkles, ArrowDown, Film, Check, Shield, Flame } from 'lucide-react';

interface HeroProps {
  onScrollToPlayground: () => void;
  onOpenAuth: () => void;
}

export default function Hero({ onScrollToPlayground }: HeroProps) {
  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden text-center">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-12 left-1/4 w-[250px] h-[250px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Eyebrow Studio Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs font-mono text-cyan-300 shadow-inner">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="tracking-wide">ENGINEERED FOR COLORISTS, EDITORS & VFX ARTISTS</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] max-w-4xl mx-auto">
          Stop Chasing Payments. <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400">
            Start Grading.
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          The minimalist ledger for post-production freelancers who hate accounting.
        </p>

        {/* CTA Section with Glowing Button */}
        <div className="pt-2 flex flex-col items-center justify-center gap-4">
          <button
            onClick={onScrollToPlayground}
            className="group relative inline-flex items-center gap-2.5 px-7 py-3.5 text-sm sm:text-base font-semibold text-slate-950 bg-[#06b6d4] hover:bg-cyan-300 rounded-xl shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 cursor-pointer overflow-hidden"
          >
            <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-700 ease-out" />
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>Create My First Invoice in 30s</span>
            <ArrowDown className="w-4 h-4 text-slate-950 group-hover:translate-y-0.5 transition-transform" />
          </button>

          {/* Trust Badge strictly matching user brief */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 pt-1">
            <span className="text-slate-300 font-medium">Join 850+ colorists & editors globally</span>
            <span className="tracking-widest" aria-label="5 stars">⭐️⭐️⭐️⭐️⭐️</span>
          </div>
        </div>

        {/* Studio Workflow Integration Badges */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/60 border border-white/5">
            <span className="text-cyan-400">●</span> DaVinci Resolve & Premiere Timelines
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/60 border border-white/5">
            <span className="text-cyan-400">●</span> Built-in Revision Caps (No Free Cuts)
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/60 border border-white/5">
            <span className="text-cyan-400">●</span> GST / VAT / State Tax Automation
          </div>
        </div>

      </div>
    </section>
  );
}
