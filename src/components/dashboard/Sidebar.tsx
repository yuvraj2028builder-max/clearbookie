import React from 'react';
import { 
  LayoutDashboard, 
  Film, 
  Users, 
  ArrowLeftRight, 
  BarChart3, 
  Sliders, 
  LogOut, 
  Plus, 
  ExternalLink,
  Radio,
  Disc3,
  Cpu
} from 'lucide-react';
import { AppNavigationTab, useStudio } from '../../context/StudioContext';
import ConsoleWaveform from '../common/ConsoleWaveform';

interface SidebarProps {
  onExitToLanding: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export default function Sidebar({ onExitToLanding, isMobileOpen, setIsMobileOpen }: SidebarProps) {
  const { activeTab, setActiveTab, setIsCreateInvoiceOpen, profile, needsNudgeInvoices } = useStudio();

  const navItems: { id: AppNavigationTab; channel: string; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { id: 'dashboard', channel: 'CH-01', label: 'Console Main', icon: LayoutDashboard },
    { id: 'invoices', channel: 'CH-02', label: 'Payment Timeline', icon: Film, badge: needsNudgeInvoices.length > 0 ? needsNudgeInvoices.length : undefined },
    { id: 'clients', channel: 'CH-03', label: 'Client Roster', icon: Users },
    { id: 'transactions', channel: 'CH-04', label: 'Expense Reel', icon: ArrowLeftRight },
    { id: 'reports', channel: 'CH-05', label: 'Telemetry & Scopes', icon: BarChart3 },
    { id: 'settings', channel: 'CH-06', label: 'Console Calibration', icon: Sliders },
  ];

  const handleNavClick = (tab: AppNavigationTab) => {
    setActiveTab(tab);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* High-End Studio Hardware Master Console Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#08090e] border-r border-white/10 flex flex-col justify-between transition-transform duration-100 ease-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } shadow-[inset_-1px_0_2px_rgba(255,255,255,0.05),8px_0_30px_rgba(0,0,0,0.8)]`}
      >
        {/* Top Section: Console Identity & Hardware Status */}
        <div className="p-4 space-y-4">
          
          {/* Milled Hardware Header with Corner Screws */}
          <div className="relative p-3 rounded bg-[#0b0e14] border border-white/10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.08),inset_0_-1px_2px_rgba(0,0,0,0.9)]">
            {/* Hex Fastener Screws */}
            <div className="absolute top-1 left-1.5 w-1.5 h-1.5 rounded-full bg-slate-700 border border-slate-600" />
            <div className="absolute top-1 right-1.5 w-1.5 h-1.5 rounded-full bg-slate-700 border border-slate-600" />
            <div className="absolute bottom-1 left-1.5 w-1.5 h-1.5 rounded-full bg-slate-700 border border-slate-600" />
            <div className="absolute bottom-1 right-1.5 w-1.5 h-1.5 rounded-full bg-slate-700 border border-slate-600" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-[#06080d] border border-[#00ffff]/40 flex items-center justify-center text-[#00ffff] shadow-[0_0_10px_rgba(0,255,255,0.3)]">
                  <Disc3 className="w-4 h-4 text-[#00ffff] animate-[spin_8s_linear_infinite]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-xs tracking-wider text-white uppercase">
                      ClearBooks
                    </span>
                    <span className="text-[9px] font-mono uppercase tracking-widest px-1 py-0.2 rounded bg-[#00ffff]/15 text-[#00ffff] border border-[#00ffff]/30">
                      MK-IV
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono tracking-tight truncate max-w-[120px]">
                    {profile.studio_name || 'Obsidian Grade Lab'}
                  </div>
                </div>
              </div>
            </div>

            {/* Broadcast Status Bar (Genlock / 24 FPS / Tally) */}
            <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-slate-400">
              <div className="flex items-center gap-1 text-[#00ff9d]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff9d] shadow-[0_0_6px_#00ff9d]" />
                <span>GENLOCK LOCKED</span>
              </div>
              <span className="text-slate-400">24.00 FPS</span>
            </div>
          </div>

          {/* Primary Action Button: Electric Signal Neon */}
          <button
            onClick={() => {
              setIsCreateInvoiceOpen(true);
              setIsMobileOpen(false);
            }}
            className="w-full relative py-2.5 px-3 rounded bg-[#00ffff] hover:bg-[#33ffff] text-[#07080d] font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all duration-75 shadow-[0_0_18px_rgba(0,255,255,0.45),inset_0_1px_1px_rgba(255,255,255,0.8)] active:translate-y-[1px] cursor-pointer tracking-wider uppercase"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Engage New Invoice</span>
          </button>

          {/* Broadcast Tally / Overdue Warning Beacon */}
          {needsNudgeInvoices.length > 0 && (
            <div className="p-2 rounded bg-rose-950/40 border border-rose-500/50 signal-pulse-red flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-rose-300">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span className="font-bold uppercase tracking-wider text-[10px]">Tally Alarm: Overdue</span>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-rose-500 text-white font-black text-[10px]">
                {needsNudgeInvoices.length}
              </span>
            </div>
          )}

          {/* Navigation Channel Strips */}
          <div className="space-y-1 pt-1">
            <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-slate-400 px-2 py-0.5 flex items-center justify-between">
              <span>Console Channels</span>
              <span className="text-slate-400">BUS-A</span>
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded text-xs font-mono transition-all duration-75 cursor-pointer border ${
                    isActive
                      ? 'bg-[#0f1724] text-[#00ffff] border-[#00ffff]/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_0_12px_rgba(0,255,255,0.15)] font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`text-[9px] font-mono px-1 py-0.5 rounded ${
                      isActive ? 'bg-[#00ffff]/20 text-[#00ffff]' : 'bg-slate-800/80 text-slate-400'
                    }`}>
                      {item.channel}
                    </span>
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#00ffff]' : 'text-slate-400'}`} />
                    <span className="tracking-wide uppercase text-[11px]">{item.label}</span>
                  </div>

                  {item.badge !== undefined ? (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#ff2a5f] text-white font-bold signal-pulse-red">
                      {item.badge}
                    </span>
                  ) : isActive ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00ffff] shadow-[0_0_6px_#00ffff]" />
                  ) : null}
                </button>
              );
            })}
          </div>

          {/* Subtly Integrated Vectorscope Preview */}
          <div className="p-2 rounded bg-[#06080d] border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
              <span>COLOR SIGNAL MONITOR</span>
              <span className="text-[#00ffff]">DCI-P3</span>
            </div>
            <ConsoleWaveform type="vectorscope" height={52} opacity={0.4} glow />
          </div>

        </div>

        {/* Bottom Tier: Colorist Node / Workspace Calibration & Exit */}
        <div className="p-3 border-t border-white/10 bg-[#06070a] space-y-2.5">
          
          {/* Operator Badge */}
          <div className="p-2 rounded bg-[#0a0d14] border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded bg-[#111624] border border-[#00ffff]/30 flex items-center justify-center text-[10px] font-mono font-bold text-[#00ffff]">
                <Cpu className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-mono font-semibold text-white truncate">
                  {profile.full_name || 'Senior Colorist'}
                </div>
                <div className="text-[9px] font-mono text-slate-400 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-[#00ff9d]" />
                  CONSOLE ONLINE
                </div>
              </div>
            </div>
            <Radio className="w-3.5 h-3.5 text-[#00ffff] animate-pulse" />
          </div>

          {/* Switchers */}
          <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
            <button
              onClick={onExitToLanding}
              className="py-1.5 px-2 rounded bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/5 transition-all duration-75 flex items-center justify-center gap-1 cursor-pointer uppercase"
              title="Return to Public Landing Page"
            >
              <ExternalLink className="w-3 h-3 text-[#00ffff]" />
              <span>Public</span>
            </button>
            <button
              onClick={onExitToLanding}
              className="py-1.5 px-2 rounded bg-rose-950/20 hover:bg-rose-950/40 text-rose-300 hover:text-rose-200 border border-rose-500/20 transition-all duration-75 flex items-center justify-center gap-1 cursor-pointer uppercase"
              title="Sign Out of Studio"
            >
              <LogOut className="w-3 h-3" />
              <span>Release</span>
            </button>
          </div>

        </div>
      </aside>
    </>
  );
}
