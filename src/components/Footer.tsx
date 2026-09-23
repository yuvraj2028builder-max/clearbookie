import React from 'react';
import { Database, ShieldCheck, Heart, Sparkles } from 'lucide-react';

interface FooterProps {
  onOpenAuth: () => void;
  onOpenSqlModal: () => void;
  onScrollToPlayground: () => void;
}

export default function Footer({ onOpenAuth, onOpenSqlModal, onScrollToPlayground }: FooterProps) {
  return (
    <footer className="border-t border-white/10 bg-[#020617] pt-14 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Tier */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand & Identity */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#06b6d4]">
                <span className="font-mono font-bold text-xs">CB</span>
              </div>
              <span className="font-semibold text-base tracking-tight text-white">
                ClearBooks <span className="text-cyan-400 font-mono text-xs">STUDIO</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              The high-end financial command center built explicitly for colorists, offline & online editors, VFX compositors, and sound designers.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
              <span className="text-cyan-400 font-mono">Calibrated for Dark Edit Suites</span>
              <span>•</span>
              <span>Zero Accounting Jargon</span>
            </div>
          </div>

          {/* Col 2: Studio Tools */}
          <div className="space-y-2 text-xs">
            <div className="font-mono uppercase tracking-wider text-slate-400 text-[10px]">
              Studio Ledger
            </div>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button 
                  onClick={onScrollToPlayground} 
                  className="hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  Guest Invoice Playground
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenAuth} 
                  className="hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  Revision Guard & Cut Tracker
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenAuth} 
                  className="hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  1-Click Client Payment Nudges
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenAuth} 
                  className="hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  Post-Production P&L Reports
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Database & Tech Stack */}
          <div className="space-y-2 text-xs">
            <div className="font-mono uppercase tracking-wider text-slate-400 text-[10px]">
              Architecture & Security
            </div>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button 
                  onClick={onOpenSqlModal} 
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5 cursor-pointer text-cyan-400/90 font-mono"
                >
                  <Database className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Supabase SQL Migration</span>
                </button>
              </li>
              <li className="flex items-center gap-1.5 text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Row Level Security (RLS)</span>
              </li>
              <li><span>PostgreSQL UUIDv4 Schemas</span></li>
              <li><span>Bank-Grade 256-Bit SSL</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom Tier */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} ClearBooks Studio. Designed for post-production freelancers.
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>Obsidian #020617</span>
            <span>•</span>
            <span className="text-cyan-400">Electric Cyan #06b6d4</span>
            <span>•</span>
            <span>Glassmorphism UI</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
