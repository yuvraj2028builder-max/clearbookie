import React, { useState, useEffect } from 'react';
import { Menu, Radio, Activity, Sparkles, Disc } from 'lucide-react';
import Sidebar from './Sidebar';
import DashboardOverview from './DashboardOverview';
import InvoiceManager from '../invoices/InvoiceManager';
import ClientManager from '../clients/ClientManager';
import TransactionManager from '../transactions/TransactionManager';
import ReportsView from '../reports/ReportsView';
import SettingsView from '../settings/SettingsView';
import CreateInvoiceModal from '../invoices/CreateInvoiceModal';
import InvoicePdfModal from '../invoices/InvoicePdfModal';
import PaymentNudgeModal from '../invoices/PaymentNudgeModal';
import { useStudio } from '../../context/StudioContext';
import ConsoleWaveform from '../common/ConsoleWaveform';

interface StudioLayoutProps {
  onExitToLanding: () => void;
}

export default function StudioLayout({ onExitToLanding }: StudioLayoutProps) {
  const { activeTab, needsNudgeInvoices } = useStudio();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [timecode, setTimecode] = useState('01:00:24:16');

  // Realistic SMPTE timecode clock counter (24 fps)
  useEffect(() => {
    let frame = 16;
    let sec = 24;
    let min = 0;
    const interval = setInterval(() => {
      frame++;
      if (frame >= 24) {
        frame = 0;
        sec++;
        if (sec >= 60) {
          sec = 0;
          min++;
        }
      }
      const pad = (n: number) => n.toString().padStart(2, '0');
      setTimecode(`01:${pad(min)}:${pad(sec)}:${pad(frame)}`);
    }, 1000 / 24);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#07080d] text-slate-100 flex selection:bg-[#00ffff]/20 selection:text-[#00ffff] relative overflow-x-hidden">
      
      {/* Background Subtle Waveform Grid Ambient Noise */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.035] bg-[radial-gradient(#00ffff_1px,transparent_1px)] [background-size:16px_16px] z-0" />

      {/* Slim, High-End Hardware Sidebar */}
      <Sidebar 
        onExitToLanding={onExitToLanding}
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
      />

      {/* Main Studio Console Content Deck */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 relative z-10">
        
        {/* Top Master Studio Hardware Header Ribbon */}
        <header className="sticky top-0 z-30 h-12 bg-[#090b10]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 flex items-center justify-between shadow-[0_4px_16px_rgba(0,0,0,0.8),inset_0_-1px_1px_rgba(255,255,255,0.05)]">
          {/* Mobile Menu & Console Identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1 rounded bg-[#0e1118] border border-white/10 text-slate-300 hover:text-white hover:border-[#00ffff]/40 lg:hidden cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 font-mono">
              <span className="font-bold text-xs tracking-wider text-white uppercase hidden sm:inline">
                COLOR STUDIO CONSOLE
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#00ffff]/10 text-[#00ffff] border border-[#00ffff]/30 tracking-widest font-black uppercase">
                CALIBRATED
              </span>
            </div>
          </div>

          {/* SMPTE Timecode Display & Waveform Activity Indicator */}
          <div className="flex items-center gap-3 sm:gap-6 font-mono text-xs">
            {/* Live Master SMPTE Timecode Counter */}
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded bg-[#040508] border border-white/10 shadow-[inset_0_1px_3px_rgba(0,0,0,0.9)]">
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider">SMPTE:</span>
              <span className="text-[#00ffff] font-bold tracking-widest text-xs">
                {timecode}
              </span>
              <span className="text-[9px] px-1 rounded bg-slate-800 text-slate-400">24F</span>
            </div>

            {/* Overdue Tally Light */}
            {needsNudgeInvoices.length > 0 ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-950/40 border border-rose-500/60 text-rose-300 signal-pulse-red text-[10px] font-mono">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span className="font-bold uppercase tracking-wider">{needsNudgeInvoices.length} Overdue</span>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-[#00ff9d]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff9d] shadow-[0_0_6px_#00ff9d]" />
                <span className="tracking-wider uppercase">SYNC LOCKED</span>
              </div>
            )}

            {/* Color Science Mode Badge */}
            <div className="hidden lg:flex items-center gap-1 text-[10px] font-mono text-slate-400">
              <span className="text-slate-400">CS:</span>
              <span className="text-slate-200 font-semibold">ACEScc / Rec.709</span>
            </div>

            <button
              onClick={onExitToLanding}
              className="text-[11px] font-mono uppercase tracking-wider text-slate-400 hover:text-[#00ffff] hover:border-[#00ffff]/30 px-2 py-1 rounded border border-white/5 transition-all duration-75"
            >
              Exit
            </button>
          </div>
        </header>

        {/* View Deck: Dashboard / Payment Timeline / Client Roster / Ledger / Scopes / Settings */}
        <main className="flex-1 p-3 sm:p-5 lg:p-6 max-w-7xl w-full mx-auto space-y-4">
          {activeTab === 'dashboard' && <DashboardOverview />}
          {activeTab === 'invoices' && <InvoiceManager />}
          {activeTab === 'clients' && <ClientManager />}
          {activeTab === 'transactions' && <TransactionManager />}
          {activeTab === 'reports' && <ReportsView />}
          {activeTab === 'settings' && <SettingsView />}
        </main>

        {/* Subtle Waveform Divider Strip at bottom */}
        <footer className="h-6 border-t border-white/5 bg-[#050609] px-4 flex items-center justify-between text-[9px] font-mono text-slate-400 select-none">
          <div className="flex items-center gap-3">
            <span>DA-VINCI PANEL BRIDGE: ACTIVE</span>
            <span className="hidden sm:inline text-slate-400">•</span>
            <span className="hidden sm:inline">BUFFER: 100% OK</span>
          </div>
          <div className="flex items-center gap-2">
            <span>REVISION GUARD: ENGAGED</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ffff]" />
          </div>
        </footer>

      </div>

      {/* Global Studio Hardware Modals */}
      <CreateInvoiceModal />
      <InvoicePdfModal />
      <PaymentNudgeModal />

    </div>
  );
}
