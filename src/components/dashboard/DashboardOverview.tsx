import React, { useState } from 'react';
import { 
  Sparkles, 
  AlertTriangle, 
  Send, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ArrowUpRight, 
  DollarSign, 
  TrendingUp, 
  BellRing,
  Layers,
  Calendar,
  Building,
  Plus,
  Radio,
  Sliders,
  Disc3,
  Cpu,
  Flame,
  ShieldCheck,
  Eye,
  SlidersHorizontal,
  Activity
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { Invoice } from '../../db/types';
import QuickStartChecklist from './QuickStartChecklist';
import EmptyState from '../common/EmptyState';
import ConsoleWaveform from '../common/ConsoleWaveform';
import ConsoleToggle from '../common/ConsoleToggle';
import ConsoleParameterSlider from '../common/ConsoleParameterSlider';

export default function DashboardOverview() {
  const { 
    outstandingPaymentsTotal, 
    pipelineCounts, 
    needsNudgeInvoices, 
    monthlyProfit, 
    setNudgeInvoice,
    setPdfInvoice,
    setIsCreateInvoiceOpen,
    getClientById,
    invoices,
    clients,
    profile,
    bestClient,
    problematicClient,
    adobeAndPluginsSpend,
    setActiveTab,
    setPreselectedClientId,
    setIsAddClientModalOpen,
    resetToDemoData
  } = useStudio();

  const [simulatedGain, setSimulatedGain] = useState(100);
  const [autoNudgeEngaged, setAutoNudgeEngaged] = useState(true);
  const [scopeMonitorActive, setScopeMonitorActive] = useState(true);

  // Scaling factor for telemetry bar graph
  const maxBarValue = Math.max(...monthlyProfit.map(m => Math.max(m.income, m.expense)), 16000);

  return (
    <div className="space-y-4">
      
      {/* Top Console Master Header & Calibration Telemetry Strip */}
      <div className="console-module p-3.5 sm:p-4 relative overflow-hidden">
        {/* Subtle Background Audio/Video Waveform Accent */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 pointer-events-none hidden md:block">
          <ConsoleWaveform type="waveform" height={80} glow />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-[#00ffff] uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ffff] shadow-[0_0_8px_#00ffff]" />
              <span>CONSOLE DECK // MASTER BUS ACTIVE</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-400 font-mono">DCI-P3 CALIBRATED</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-wider text-white heading-manual mt-0.5">
              Studio Command Center
            </h1>
            <p className="text-xs font-mono text-slate-400 tracking-tight">
              OPERATOR: <span className="text-slate-200 font-semibold">{profile.full_name || 'Senior Colorist'}</span> // SUITE: <span className="text-[#00ffff]">{profile.studio_name || 'Obsidian Grade Lab'}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsCreateInvoiceOpen(true)}
              className="electric-glow-btn px-4 py-2 rounded text-xs font-mono uppercase tracking-wider flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Engage Invoice</span>
            </button>
          </div>
        </div>

        {/* Tactical Status Ribbon */}
        <div className="mt-3 pt-2.5 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-slate-400">
          <div className="flex items-center gap-3">
            <span className="text-slate-400">STATUS:</span>
            <span className="text-[#00ff9d] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff9d] shadow-[0_0_6px_#00ff9d]" />
              TELEMETRY NOMINAL
            </span>
            <span className="hidden sm:inline text-slate-400">•</span>
            <span className="hidden sm:inline text-slate-300">REVISION GUARD: LEVEL 02</span>
          </div>

          <div className="flex items-center gap-3">
            <ConsoleToggle
              checked={autoNudgeEngaged}
              onChange={setAutoNudgeEngaged}
              label="AUTO-NUDGE"
              size="sm"
              signalColor="cyan"
            />
            <ConsoleToggle
              checked={scopeMonitorActive}
              onChange={setScopeMonitorActive}
              label="SCOPES"
              size="sm"
              signalColor="green"
            />
          </div>
        </div>
      </div>

      {/* Quick Start Checklist Module */}
      <QuickStartChecklist />

      {/* =========================================================================
          BENTO-GRID 2.0 (HARDWARE CONSOLE RACK)
         ========================================================================= */}
      
      {/* Rack Row 1: The Master Receivables Module + 4-Bay Pipeline Rack */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
        
        {/* MODULE 01: Master Receivables Bay (Hero Module) */}
        <div className="lg:col-span-8 console-module p-5 relative overflow-hidden flex flex-col justify-between space-y-4">
          
          {/* Subtle vectorscope watermarked in background */}
          <div className="absolute -right-4 -bottom-4 opacity-10 pointer-events-none">
            <ConsoleWaveform type="vectorscope" height={160} glow />
          </div>

          <div className="space-y-2 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-[#00ffff]">
                <Cpu className="w-3.5 h-3.5 text-[#00ffff]" />
                <span>MASTER RECEIVABLES // OUTSTANDING BUS</span>
              </div>
              <div className="px-2 py-0.5 rounded bg-[#06080d] border border-white/10 text-[10px] font-mono text-slate-300">
                {invoices.length === 0 ? 'CALIBRATION IDLE' : `${pipelineCounts.Sent + pipelineCounts.Overdue} ACTIVE CLIPS`}
              </div>
            </div>

            <div className="text-[11px] font-mono text-slate-400 tracking-wider uppercase">
              Unsettled Production Ledger Total
            </div>

            {/* Glowing Huge Monospace Price */}
            <div className="text-3xl sm:text-5xl md:text-6xl font-black font-mono text-white tracking-tight py-1 flex items-baseline drop-shadow-[0_0_20px_rgba(0,255,255,0.4)]">
              <span className="text-[#00ffff] mr-1 text-2xl sm:text-4xl">$</span>
              <span>{outstandingPaymentsTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>

            {invoices.length === 0 && (
              <div className="p-3 rounded bg-[#06080d] border border-[#00ffff]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs font-mono">
                <p className="text-slate-300">
                  <span className="text-[#00ffff] font-bold">Ledger Clean Slate:</span> Register your primary studio client to drop first clip onto track.
                </p>
                <div className="flex items-center gap-2 shrink-0">
                  {clients.length === 0 ? (
                    <button
                      onClick={() => {
                        setActiveTab('clients');
                        setIsAddClientModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded bg-[#00ffff] text-[#07080d] font-bold text-xs uppercase cursor-pointer"
                    >
                      Add Client
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsCreateInvoiceOpen(true)}
                      className="px-3 py-1.5 rounded bg-[#00ffff] text-[#07080d] font-bold text-xs uppercase cursor-pointer"
                    >
                      Engage Invoice
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sub-Channel Telemetry Readout */}
          <div className="relative z-10 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-4 text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00ffff] shadow-[0_0_6px_#00ffff]" />
                <span>PENDING AP:</span>
                <strong className="text-white">${invoices.filter(i => i.status === 'Sent').reduce((s, i) => s + i.total_amount, 0).toLocaleString()}</strong>
              </span>

              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ff2a5f] shadow-[0_0_6px_#ff2a5f] animate-pulse" />
                <span>OVERDUE:</span>
                <strong className="text-[#ff2a5f]">${invoices.filter(i => i.status === 'Overdue').reduce((s, i) => s + i.total_amount, 0).toLocaleString()}</strong>
              </span>
            </div>

            <div className="text-[10px] font-mono text-slate-400">
              TURNAROUND VELOCITY: <span className="text-[#00ff9d] font-bold">9.4 DAYS</span>
            </div>
          </div>
        </div>

        {/* MODULE 02: 4-Bay Signal Pipeline Rack */}
        <div className="lg:col-span-4 grid grid-cols-2 gap-2.5 sm:gap-3">
          
          {/* Bay A: DRAFT */}
          <div className="console-module p-3 flex flex-col justify-between border-l-2 border-l-amber-400">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span className="uppercase tracking-wider">CH 01 // DRAFT</span>
              <FileText className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-2xl font-black font-mono text-white py-1">
              {pipelineCounts.Draft}
            </div>
            <div className="text-[9px] font-mono text-slate-400 uppercase">
              Unsent Specs
            </div>
          </div>

          {/* Bay B: TRANSMITTED / SENT */}
          <div className="console-module p-3 flex flex-col justify-between border-l-2 border-l-[#00ffff]">
            <div className="flex items-center justify-between text-[10px] font-mono text-[#00ffff]">
              <span className="uppercase tracking-wider">CH 02 // SENT</span>
              <Send className="w-3.5 h-3.5 text-[#00ffff]" />
            </div>
            <div className="text-2xl font-black font-mono text-white py-1">
              {pipelineCounts.Sent}
            </div>
            <div className="text-[9px] font-mono text-slate-400 uppercase">
              Pending Wire
            </div>
          </div>

          {/* Bay C: OVERDUE (GLOWING PULSE ALARM) */}
          <div className="console-module p-3 flex flex-col justify-between border-l-2 border-l-[#ff2a5f] bg-rose-950/20 signal-pulse-red">
            <div className="flex items-center justify-between text-[10px] font-mono text-[#ff2a5f]">
              <span className="uppercase tracking-wider font-bold">CH 03 // DELINQUENT</span>
              <AlertTriangle className="w-3.5 h-3.5 text-[#ff2a5f]" />
            </div>
            <div className="text-2xl font-black font-mono text-[#ff2a5f] py-1">
              {pipelineCounts.Overdue}
            </div>
            <div className="text-[9px] font-mono text-rose-300/90 uppercase font-bold">
              Tally Alarm Active
            </div>
          </div>

          {/* Bay D: PAID (LOCKED GREEN) */}
          <div className="console-module p-3 flex flex-col justify-between border-l-2 border-l-[#00ff9d]">
            <div className="flex items-center justify-between text-[10px] font-mono text-[#00ff9d]">
              <span className="uppercase tracking-wider">CH 04 // SETTLED</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff9d]" />
            </div>
            <div className="text-2xl font-black font-mono text-white py-1">
              {pipelineCounts.Paid}
            </div>
            <div className="text-[9px] font-mono text-slate-400 uppercase">
              Signal Locked
            </div>
          </div>

        </div>

      </div>

      {/* Rack Row 2: Telemetry Waveform Oscilloscope & Delinquent Nudge Bay */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
        
        {/* MODULE 03: Cash Flow Telemetry Scope (Oscilloscope / Bar Signal) */}
        <div className="lg:col-span-7 console-module p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div>
              <h3 className="text-xs font-mono font-bold tracking-wider text-white uppercase flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#00ffff]" />
                <span>TELEMETRY OSCILLOSCOPE // 6-MONTH MARGIN REEL</span>
              </h3>
              <p className="text-[10px] font-mono text-slate-400">
                Income streams vs post overhead (hardware calibration, OFX nodes, cloud drives)
              </p>
            </div>
            
            {/* Legend */}
            <div className="flex items-center gap-3 text-[10px] font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm bg-[#00ffff] shadow-[0_0_6px_#00ffff]" />
                <span className="text-slate-200">Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm bg-slate-600" />
                <span className="text-slate-400">Overhead</span>
              </div>
            </div>
          </div>

          {/* Calibrated Signal Graph */}
          <div className="h-44 flex items-end justify-between gap-2.5 pt-2 px-1 console-bay">
            {monthlyProfit.map((m) => {
              const incomeHeight = Math.round((m.income / maxBarValue) * 100);
              const expenseHeight = Math.round((m.expense / maxBarValue) * 100);
              const netProfit = m.income - m.expense;

              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group relative">
                  
                  {/* Tooltip on hover */}
                  <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-[#05070a] border border-[#00ffff]/40 px-2.5 py-1 rounded text-[10px] font-mono text-slate-200 pointer-events-none z-30 shadow-xl whitespace-nowrap">
                    <div className="text-[#00ffff] font-bold">+{m.month}: ${m.income.toLocaleString()}</div>
                    <div className="text-slate-400">Overhead: -${m.expense.toLocaleString()}</div>
                    <div className="text-[#00ff9d] font-semibold">Net: +${netProfit.toLocaleString()}</div>
                  </div>

                  {/* Dual Hardware Channel Bars */}
                  <div className="w-full flex items-end justify-center gap-1 h-32 px-1">
                    {/* Income Bar (Electric Neon Cyan) */}
                    <div 
                      style={{ height: `${incomeHeight}%` }}
                      className="w-1/2 bg-[#00ffff] group-hover:bg-[#33ffff] rounded-t-sm transition-all duration-75 shadow-[0_0_10px_rgba(0,255,255,0.3)]"
                    />
                    {/* Expense Bar (Muted Anodized Steel) */}
                    <div 
                      style={{ height: `${expenseHeight}%` }}
                      className="w-1/2 bg-slate-700 group-hover:bg-slate-600 rounded-t-sm transition-all duration-75"
                    />
                  </div>

                  {/* Month Label */}
                  <span className="text-[10px] font-mono text-slate-400 group-hover:text-[#00ffff] transition-colors pb-1">
                    {m.month}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Net Margin Status Strip */}
          {(() => {
            const currentMonth = monthlyProfit[monthlyProfit.length - 1] || { income: 0, expense: 0 };
            const net = currentMonth.income - currentMonth.expense;
            const yieldPct = currentMonth.income > 0 ? Math.round((net / currentMonth.income) * 100) : 0;
            return (
              <div className="p-2.5 rounded bg-[#06080d] border border-white/5 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 text-[11px]">NET RUNTIME YIELD:</span>
                <span className={`font-bold ${net >= 0 ? 'text-[#00ff9d]' : 'text-[#ff2a5f]'}`}>
                  {net >= 0 ? '+' : '-'}${Math.abs(net).toLocaleString(undefined, { minimumFractionDigits: 2 })} ({yieldPct}% Margin)
                </span>
              </div>
            );
          })()}
        </div>

        {/* MODULE 04: Delinquent Tally Bay ('Needs Nudge') */}
        <div className="lg:col-span-5 console-module p-4 space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold tracking-wider text-white uppercase flex items-center gap-2">
                <BellRing className="w-3.5 h-3.5 text-[#ff2a5f] animate-pulse" />
                <span>OVERDUE DISPATCH // NUDGE RACK</span>
              </h3>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#ff2a5f]/20 text-[#ff2a5f] border border-[#ff2a5f]/40 font-bold uppercase">
                {needsNudgeInvoices.length} Delinquent
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400">
              Clips past commercial net terms. Trigger 1-click respectful nudge transmission.
            </p>
          </div>

          {/* Overdue Invoices List */}
          <div className="space-y-2 my-1 overflow-y-auto max-h-64 pr-1">
            {needsNudgeInvoices.length === 0 ? (
              <div className="py-6 text-center text-xs font-mono text-slate-400 space-y-2">
                <CheckCircle2 className="w-7 h-7 text-[#00ff9d] mx-auto" />
                {invoices.length === 0 ? (
                  <div className="space-y-1.5">
                    <p className="text-slate-200 font-bold">Ledger is clean.</p>
                    <p className="text-[10px] text-slate-400 max-w-xs mx-auto">
                      Add clients to track overdue clips automatically.
                    </p>
                  </div>
                ) : (
                  <p className="text-[#00ff9d] text-[11px]">All studio clients in good standing. Zero overdue arrears.</p>
                )}
              </div>
            ) : (
              needsNudgeInvoices.map((inv) => {
                const client = getClientById(inv.client_id);
                return (
                  <div
                    key={inv.id}
                    className="p-2.5 rounded bg-[#090c12] border border-[#ff2a5f]/30 hover:border-[#ff2a5f]/60 transition-colors space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2 font-mono">
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white tracking-tight truncate">
                          {client?.company_name || 'Production House'}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {inv.project_title}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs font-bold text-[#ff2a5f]">
                          ${inv.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-[9px] text-rose-400/80">
                          Due: {inv.due_date}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1.5 border-t border-white/5 text-[10px] font-mono">
                      <span className="text-slate-400">
                        Cuts: {inv.revisions_used}/{inv.revisions_included}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setPdfInvoice(inv)}
                          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] transition-colors cursor-pointer uppercase"
                        >
                          PDF
                        </button>
                        <button
                          onClick={() => setNudgeInvoice(inv)}
                          className="px-2.5 py-0.5 rounded bg-[#ff2a5f] hover:bg-[#ff4d7a] text-white font-bold text-[10px] flex items-center gap-1 transition-all shadow-sm shadow-[#ff2a5f]/30 cursor-pointer uppercase signal-pulse-red"
                        >
                          <Send className="w-2.5 h-2.5" />
                          <span>Transmit Nudge</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="pt-2 border-t border-white/5 text-[10px] text-slate-400 font-mono flex items-center justify-between">
            <span>Tone: Polite & Direct</span>
            <span className="text-[#00ffff]">3 Presets Calibrated</span>
          </div>
        </div>

      </div>

      {/* Rack Row 3: Colorist Account Intelligence Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 font-mono">
        
        {/* Card 1: Best Patron */}
        <div className="console-module p-4 border-l-2 border-l-[#00ff9d] flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-[#00ff9d] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                PREMIER STUDIO PATRON
              </span>
              <span className="text-[9px] text-slate-400">CH-A</span>
            </div>
            <div className="text-base font-bold text-white tracking-tight">
              {bestClient ? bestClient.client.company_name : 'No Patron Registered'}
            </div>
            <div className="text-[11px] text-slate-400">
              {bestClient ? (
                <>Lifetime Settled: <span className="text-[#00ff9d] font-bold">${bestClient.totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></>
              ) : (
                'Log client contracts to rank revenue patrons'
              )}
            </div>
          </div>

          <button
            onClick={() => {
              if (bestClient) {
                setPreselectedClientId(bestClient.client.id);
                setIsCreateInvoiceOpen(true);
              } else if (clients.length === 0) {
                setActiveTab('clients');
                setIsAddClientModalOpen(true);
              } else {
                setIsCreateInvoiceOpen(true);
              }
            }}
            className="w-full py-1.5 px-2.5 rounded bg-[#00ff9d]/10 hover:bg-[#00ff9d]/20 text-[#00ff9d] border border-[#00ff9d]/30 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer uppercase"
          >
            <span>{bestClient ? 'Bill Premier Patron' : 'Register Patron'}</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        {/* Card 2: Friction Watchlist */}
        <div className="console-module p-4 border-l-2 border-l-[#ff2a5f] flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-[#ff2a5f] font-bold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                FRICTION WATCHLIST
              </span>
              <span className="text-[9px] text-slate-400">CH-B</span>
            </div>
            <div className="text-base font-bold text-white tracking-tight">
              {problematicClient ? problematicClient.client.company_name : 'All Accounts Synchronized'}
            </div>
            <div className="text-[11px] text-slate-400">
              {problematicClient ? (
                <>Delinquent Balance: <span className="text-[#ff2a5f] font-bold">${problematicClient.balanceOwed.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></>
              ) : (
                'Zero delinquent accounts recorded.'
              )}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('clients')}
            className="w-full py-1.5 px-2.5 rounded bg-[#ff2a5f]/10 hover:bg-[#ff2a5f]/20 text-[#ff2a5f] border border-[#ff2a5f]/30 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer uppercase"
          >
            <span>Open Delinquent Roster</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        {/* Card 3: Tooling & Plugin Overhead */}
        <div className="console-module p-4 border-l-2 border-l-[#00ffff] flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-[#00ffff] font-bold flex items-center gap-1">
                <Layers className="w-3 h-3" />
                TOOLING & OFX OVERHEAD
              </span>
              <span className="text-[9px] text-slate-400">CH-C</span>
            </div>
            <div className="text-xl font-bold font-mono text-[#00ffff]">
              ${adobeAndPluginsSpend.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-slate-400">
              DaVinci Studio, Baselight OFX, Adobe Cloud
            </div>
          </div>

          <button
            onClick={() => setActiveTab('transactions')}
            className="w-full py-1.5 px-2.5 rounded bg-[#00ffff]/10 hover:bg-[#00ffff]/20 text-[#00ffff] border border-[#00ffff]/30 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer uppercase"
          >
            <span>Inspect Tooling Ledger</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

      </div>

    </div>
  );
}
