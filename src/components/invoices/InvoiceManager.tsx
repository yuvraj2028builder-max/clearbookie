import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  FileText, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Trash2, 
  Eye, 
  ShieldCheck, 
  RotateCcw, 
  Sparkles, 
  Building,
  Film,
  SlidersHorizontal,
  Clock,
  Play,
  Layers,
  Lock,
  Volume2,
  VolumeX,
  Radio,
  Sliders
} from 'lucide-react';
import { toast } from 'sonner';
import { useStudio } from '../../context/StudioContext';
import { Invoice } from '../../db/types';
import EmptyState from '../common/EmptyState';
import { notifyError } from '../../utils/errorHandler';
import ConsoleWaveform from '../common/ConsoleWaveform';
import ConsoleToggle from '../common/ConsoleToggle';

export default function InvoiceManager() {
  const { 
    invoices, 
    clients,
    setIsCreateInvoiceOpen, 
    setPdfInvoice, 
    setNudgeInvoice, 
    updateInvoiceStatus, 
    deleteInvoice, 
    getClientById,
    setActiveTab,
    setIsAddClientModalOpen,
    resetToDemoData
  } = useStudio();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Draft' | 'Sent' | 'Overdue' | 'Paid'>('All');
  const [viewLayout, setViewLayout] = useState<'timeline' | 'channel_strip'>('timeline');
  const [activeClipId, setActiveClipId] = useState<string | null>(null);

  const handleMarkPaid = (id: string, invoiceNumber: string) => {
    try {
      updateInvoiceStatus(id, 'Paid');
      toast.success('Signal Locked: Paid', {
        description: `Invoice #${invoiceNumber} settled. Revenue synced to cashflow engine.`,
      });
    } catch (err) {
      notifyError(err, 'update invoice status');
    }
  };

  const handleDeleteInvoice = (id: string, invoiceNumber: string) => {
    try {
      deleteInvoice(id);
      toast.success('Clip Expunged', {
        description: `Invoice #${invoiceNumber} removed from timeline track.`,
      });
    } catch (err) {
      notifyError(err, 'delete invoice');
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    const client = getClientById(inv.client_id);
    const matchesQuery = 
      inv.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.project_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client?.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  // Calculate quick metrics for the top telemetry bay
  const totalRevenue = filteredInvoices.reduce((acc, i) => acc + i.total_amount, 0);
  const overdueCount = filteredInvoices.filter(i => i.status === 'Overdue').length;
  const paidCount = filteredInvoices.filter(i => i.status === 'Paid').length;

  return (
    <div className="space-y-4">
      
      {/* Top Console Command Bar */}
      <div className="console-module p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-[#00ffff] uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ffff] shadow-[0_0_8px_#00ffff]" />
            <span>CH-02 // TIMELINE LEDGER ENGINE</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-300">ACEScc DCI-P3</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-wider text-white heading-manual">
            Payment Timeline
          </h1>
        </div>

        {/* View Switcher & Primary Action */}
        <div className="flex items-center gap-2.5">
          {/* Mode Switch: Timeline vs Channel Strip */}
          <div className="flex items-center p-1 rounded bg-[#050609] border border-white/10 font-mono text-xs">
            <button
              onClick={() => setViewLayout('timeline')}
              className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-all duration-75 uppercase tracking-wider text-[10px] cursor-pointer ${
                viewLayout === 'timeline'
                  ? 'bg-[#0f1726] text-[#00ffff] border border-[#00ffff]/40 shadow-[0_0_10px_rgba(0,255,255,0.2)] font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Film className="w-3 h-3" />
              <span>Timeline Tracks</span>
            </button>
            <button
              onClick={() => setViewLayout('channel_strip')}
              className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-all duration-75 uppercase tracking-wider text-[10px] cursor-pointer ${
                viewLayout === 'channel_strip'
                  ? 'bg-[#0f1726] text-[#00ffff] border border-[#00ffff]/40 shadow-[0_0_10px_rgba(0,255,255,0.2)] font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3 h-3" />
              <span>Channel Strips</span>
            </button>
          </div>

          <button
            onClick={() => setIsCreateInvoiceOpen(true)}
            className="electric-glow-btn px-4 py-2 rounded text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>New Invoice</span>
          </button>
        </div>
      </div>

      {/* Main Content: Empty State vs Timeline Ledger */}
      {invoices.length === 0 ? (
        <EmptyState
          icon={Film}
          badge="TIMELINE TRACK EMPTY"
          title="No Commercial Clips on Timeline"
          description={
            clients.length === 0
              ? "Your color suite timeline has no active clips. Register your primary studio client to start tracking billable color grading reels and automated revision limits."
              : "Generate your first commercial invoice clip to track payment milestones, monitor revision allowances, and issue broadcast-ready PDFs."
          }
          primaryAction={
            clients.length === 0
              ? {
                  label: "Register Studio Client",
                  onClick: () => {
                    setActiveTab('clients');
                    setIsAddClientModalOpen(true);
                  },
                  icon: Building,
                }
              : {
                  label: "Drop First Clip on Track",
                  onClick: () => setIsCreateInvoiceOpen(true),
                  icon: Plus,
                }
          }
          secondaryAction={{
            label: "Load Studio Demo Project",
            onClick: resetToDemoData,
            icon: Sparkles,
          }}
          tips={[
            "Each invoice renders as an editable clip with real-time grading signal indicators.",
            "Signal Red alerts pulsate when payment terms expire, prompting an automated nudge draft.",
            "Revision Guard protects post-production artists against unpaid revision passes."
          ]}
        />
      ) : (
        <>
          {/* Hardware Filter & Telemetry Strip */}
          <div className="console-module p-3 space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Filter Search Input */}
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter clips by project, client, or invoice code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-4 py-1.5 rounded bg-[#06080d] border border-white/10 text-xs font-mono text-white placeholder-slate-400 focus:border-[#00ffff]/60 focus:shadow-[0_0_12px_rgba(0,255,255,0.2)] outline-none"
                />
              </div>

              {/* Status Signal Filter Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono">
                {(['All', 'Draft', 'Sent', 'Overdue', 'Paid'] as const).map((st) => {
                  const isActive = statusFilter === st;
                  const signalDotClass = {
                    All: 'bg-[#00ffff]',
                    Draft: 'bg-[#ffaa00]',
                    Sent: 'bg-[#00ffff]',
                    Overdue: 'bg-[#ff2a5f]',
                    Paid: 'bg-[#00ff9d]',
                  }[st];

                  return (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-2.5 py-1 rounded border transition-all duration-75 uppercase tracking-wider flex items-center gap-1.5 cursor-pointer ${
                        isActive
                          ? 'bg-[#0e1622] text-white border-[#00ffff]/50 shadow-[0_0_10px_rgba(0,255,255,0.2)] font-semibold'
                          : 'bg-[#06080d] text-slate-400 hover:text-slate-200 border-white/5'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${signalDotClass} ${st === 'Overdue' && isActive ? 'animate-ping' : ''}`} />
                      <span>{st}</span>
                      {st === 'Overdue' && overdueCount > 0 && (
                        <span className="px-1 rounded bg-[#ff2a5f] text-white text-[9px] font-bold">
                          {overdueCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Summary Telemetry Bar */}
            <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-slate-400">
              <div className="flex items-center gap-4">
                <span>CLIPS COUNT: <strong className="text-white">{filteredInvoices.length}</strong></span>
                <span>TRACK TOTAL: <strong className="text-[#00ffff]">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></span>
                <span>SETTLED: <strong className="text-[#00ff9d]">{paidCount}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Radio className="w-3 h-3 text-[#00ffff]" />
                <span>RESOLVE PANEL SYNC ACTIVE</span>
              </div>
            </div>
          </div>

          {/* VIEW 1: TIMELINE TRACKS (NLE / DaVinci Resolve Timeline Clips) */}
          {viewLayout === 'timeline' ? (
            <div className="console-module overflow-hidden space-y-2 p-3">
              
              {/* Master Timecode Ruler */}
              <div className="console-bay p-2 relative overflow-x-auto select-none">
                <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 pb-1 border-b border-white/10 min-w-[680px]">
                  <span>TC 01:00:00:00</span>
                  <span>TC 01:02:30:00</span>
                  <span>TC 01:05:00:00</span>
                  <span>TC 01:07:30:00</span>
                  <span>TC 01:10:00:00</span>
                  <span>TC 01:12:30:00</span>
                  <span>TC 01:15:00:00</span>
                </div>
                {/* Tick marks */}
                <div className="flex justify-between text-[8px] font-mono text-slate-400 pt-0.5 min-w-[680px]">
                  {[...Array(13)].map((_, i) => (
                    <span key={i}>|</span>
                  ))}
                </div>
                {/* Glowing Playhead Line */}
                <div className="absolute top-0 bottom-0 left-1/3 w-[2px] bg-[#00ffff] shadow-[0_0_10px_#00ffff] pointer-events-none z-20">
                  <div className="w-2.5 h-2.5 bg-[#00ffff] rotate-45 -translate-x-1/3 -translate-y-1 shadow-[0_0_8px_#00ffff]" />
                </div>
              </div>

              {/* Track V1: COMMERCIAL REELS & INVOICE CLIPS */}
              <div className="space-y-2">
                {/* Track Header Ribbon */}
                <div className="p-2 rounded bg-[#090b10] border border-white/10 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-[#00ffff]/15 text-[#00ffff] border border-[#00ffff]/30 font-bold text-[10px]">
                      V1
                    </span>
                    <span className="font-semibold text-white uppercase tracking-wider text-[11px]">
                      Commercial Revenue Timeline
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ({filteredInvoices.length} Clips Loaded)
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-400">
                    <button className="p-1 hover:text-white rounded bg-white/5 cursor-pointer" title="Track Mute">
                      <Volume2 className="w-3 h-3" />
                    </button>
                    <button className="p-1 hover:text-white rounded bg-white/5 cursor-pointer" title="Track Lock">
                      <Lock className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Timeline Clip Stack (Rendered as Video/Color Grade Clips on Track) */}
                {filteredInvoices.length === 0 ? (
                  <div className="py-10 text-center text-slate-400 font-mono text-xs">
                    No clips match the selected criteria.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredInvoices.map((inv, idx) => {
                      const client = getClientById(inv.client_id);
                      const isCapExceeded = inv.revisions_used >= inv.revisions_included;
                      const isSelected = activeClipId === inv.id;

                      // Grading Signal Color Styling
                      const signalStyles: Record<string, { border: string; badge: string; headerBg: string; pulse: string; label: string }> = {
                        Overdue: {
                          border: 'border-[#ff2a5f]/80',
                          badge: 'bg-[#ff2a5f]/20 text-[#ff2a5f] border-[#ff2a5f]/40',
                          headerBg: 'bg-rose-950/40',
                          pulse: 'signal-pulse-red',
                          label: 'SIGNAL: OVERDUE',
                        },
                        Paid: {
                          border: 'border-[#00ff9d]/60',
                          badge: 'bg-[#00ff9d]/15 text-[#00ff9d] border-[#00ff9d]/30',
                          headerBg: 'bg-emerald-950/30',
                          pulse: 'signal-pulse-green',
                          label: 'SIGNAL: PAID',
                        },
                        Sent: {
                          border: 'border-[#00ffff]/50',
                          badge: 'bg-[#00ffff]/15 text-[#00ffff] border-[#00ffff]/30',
                          headerBg: 'bg-cyan-950/30',
                          pulse: '',
                          label: 'SIGNAL: TRANSMITTED',
                        },
                        Draft: {
                          border: 'border-amber-500/40',
                          badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
                          headerBg: 'bg-amber-950/20',
                          pulse: '',
                          label: 'SIGNAL: DRAFT',
                        },
                        Cancelled: {
                          border: 'border-slate-600/40',
                          badge: 'bg-slate-800 text-slate-400 border-slate-700',
                          headerBg: 'bg-slate-900',
                          pulse: '',
                          label: 'SIGNAL: CANCELLED',
                        },
                      };
                      const clipStyle = signalStyles[inv.status] || signalStyles.Draft;

                      return (
                        <div
                          key={inv.id}
                          onClick={() => setActiveClipId(inv.id)}
                          className={`console-module-interactive rounded p-3 transition-all duration-75 relative group border ${
                            clipStyle.border
                          } ${clipStyle.pulse} ${
                            isSelected ? 'ring-2 ring-[#00ffff] shadow-[0_0_18px_rgba(0,255,255,0.3)]' : ''
                          }`}
                        >
                          {/* Clip Grip Handles (Left & Right NLE trim indicators) */}
                          <div className="absolute top-0 bottom-0 left-0 w-1 bg-white/20 rounded-l group-hover:bg-[#00ffff] transition-colors" />
                          <div className="absolute top-0 bottom-0 right-0 w-1 bg-white/20 rounded-r group-hover:bg-[#00ffff] transition-colors" />

                          {/* Clip Header Ribbon */}
                          <div className={`p-1.5 rounded -mx-1 -mt-1 mb-2.5 flex items-center justify-between text-[10px] font-mono ${clipStyle.headerBg} border-b border-white/5`}>
                            <div className="flex items-center gap-1.5">
                              <span className="px-1 py-0.2 rounded bg-black/60 text-slate-300 font-bold">
                                CLIP {String(idx + 1).padStart(2, '0')}
                              </span>
                              <span className="text-white font-bold tracking-tight">
                                {inv.invoice_number}
                              </span>
                            </div>

                            {/* Signal Indicator Badge */}
                            <span className={`px-1.5 py-0.5 rounded border text-[9px] font-bold tracking-wider ${clipStyle.badge}`}>
                              {inv.status}
                            </span>
                          </div>

                          {/* Project & Client Identity */}
                          <div className="space-y-1 mb-3">
                            <h3 className="font-mono font-bold text-white text-sm tracking-tight truncate">
                              {inv.project_title}
                            </h3>
                            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                              <Building className="w-3 h-3 text-[#00ffff]" />
                              <span className="truncate">{client?.company_name || 'Direct Client'}</span>
                            </div>
                          </div>

                          {/* Technical Colorist Metadata Bay */}
                          <div className="console-bay p-2 space-y-1.5 mb-3 text-[10px] font-mono">
                            <div className="flex items-center justify-between text-slate-400">
                              <span>REVISION CAP:</span>
                              <div className="flex items-center gap-1">
                                <ShieldCheck className={`w-3 h-3 ${isCapExceeded ? 'text-[#ffaa00]' : 'text-[#00ffff]'}`} />
                                <span className={isCapExceeded ? 'text-[#ffaa00] font-bold' : 'text-slate-200'}>
                                  {inv.revisions_used} / {inv.revisions_included} Passes
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-slate-400">
                              <span>DUE TIMECODE:</span>
                              <span className="text-slate-200">{inv.due_date}</span>
                            </div>

                            <div className="flex items-center justify-between pt-1 border-t border-white/5 text-slate-400">
                              <span>LUT / COLOR:</span>
                              <span className="text-[#00ffff]">Rec.709-ACES</span>
                            </div>
                          </div>

                          {/* Price Telemetry Readout */}
                          <div className="flex items-baseline justify-between mb-3 font-mono">
                            <span className="text-[10px] text-slate-400 tracking-wider">SETTLEMENT:</span>
                            <span className="text-lg font-bold text-white tracking-tight tabular-nums">
                              ${inv.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                          </div>

                          {/* Clip Action Controls (Tactile Buttons) */}
                          <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-1.5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setPdfInvoice(inv);
                              }}
                              className="flex-1 py-1 px-2 rounded bg-white/5 hover:bg-[#00ffff]/15 hover:border-[#00ffff]/40 border border-white/10 text-slate-300 hover:text-[#00ffff] font-mono text-[10px] flex items-center justify-center gap-1 transition-all duration-75 cursor-pointer uppercase"
                              title="Render Broadcast PDF"
                            >
                              <Eye className="w-3 h-3" />
                              <span>PDF</span>
                            </button>

                            {inv.status === 'Overdue' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setNudgeInvoice(inv);
                                }}
                                className="py-1 px-2 rounded bg-[#ff2a5f]/20 hover:bg-[#ff2a5f]/30 border border-[#ff2a5f]/50 text-rose-200 font-mono text-[10px] flex items-center justify-center gap-1 transition-all duration-75 cursor-pointer uppercase signal-pulse-red"
                                title="Transmit Payment Nudge"
                              >
                                <Send className="w-3 h-3" />
                                <span>Nudge</span>
                              </button>
                            )}

                            {inv.status !== 'Paid' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkPaid(inv.id, inv.invoice_number);
                                }}
                                className="py-1 px-2 rounded bg-[#00ff9d]/15 hover:bg-[#00ff9d]/25 border border-[#00ff9d]/30 text-[#00ff9d] font-mono text-[10px] flex items-center justify-center gap-1 transition-all duration-75 cursor-pointer uppercase"
                                title="Lock as Paid"
                              >
                                <span>Lock Paid</span>
                              </button>
                            )}

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteInvoice(inv.id, inv.invoice_number);
                              }}
                              className="p-1 rounded text-slate-500 hover:text-[#ff2a5f] hover:bg-white/5 transition-colors cursor-pointer"
                              title="Delete Clip"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                )}

              </div>

            </div>
          ) : (
            /* VIEW 2: CHANNEL STRIPS (Compressed High-Density Hardware Grid) */
            <div className="console-module overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-[#080a0f] text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                      <th className="py-2.5 px-3">CH / Code</th>
                      <th className="py-2.5 px-3">Commercial Title & Client</th>
                      <th className="py-2.5 px-3">Revision Guard</th>
                      <th className="py-2.5 px-3">Due Date</th>
                      <th className="py-2.5 px-3 text-right">Settlement ($)</th>
                      <th className="py-2.5 px-3 text-center">Grading Signal</th>
                      <th className="py-2.5 px-3 text-right">Master Controls</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono">
                    {filteredInvoices.map((inv, idx) => {
                      const client = getClientById(inv.client_id);
                      const isCapExceeded = inv.revisions_used >= inv.revisions_included;

                      const signalDotClass = {
                        Overdue: 'bg-[#ff2a5f] shadow-[0_0_8px_#ff2a5f]',
                        Paid: 'bg-[#00ff9d] shadow-[0_0_8px_#00ff9d]',
                        Sent: 'bg-[#00ffff] shadow-[0_0_8px_#00ffff]',
                        Draft: 'bg-[#ffaa00] shadow-[0_0_8px_#ffaa00]',
                      }[inv.status];

                      return (
                        <tr 
                          key={inv.id} 
                          className="hover:bg-white/[0.04] transition-colors group"
                        >
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] text-slate-400 px-1 py-0.5 rounded bg-black/50">
                                {String(idx + 1).padStart(2, '0')}
                              </span>
                              <span className="text-[#00ffff] font-bold">
                                {inv.invoice_number}
                              </span>
                            </div>
                          </td>

                          <td className="py-3 px-3">
                            <div className="font-semibold text-white truncate max-w-xs">
                              {inv.project_title}
                            </div>
                            <div className="text-slate-400 text-[10px] truncate">
                              {client?.company_name || 'Direct Client'}
                            </div>
                          </td>

                          <td className="py-3 px-3">
                            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] border ${
                              isCapExceeded 
                                ? 'bg-amber-950/30 border-amber-500/40 text-amber-300' 
                                : 'bg-slate-900 border-white/10 text-slate-300'
                            }`}>
                              <ShieldCheck className="w-3 h-3 text-[#00ffff]" />
                              <span>{inv.revisions_used} / {inv.revisions_included} Cuts</span>
                            </span>
                          </td>

                          <td className="py-3 px-3 text-slate-300 text-[11px]">
                            {inv.due_date}
                          </td>

                          <td className="py-3 px-3 text-right font-bold text-white tabular-nums">
                            ${inv.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>

                          <td className="py-3 px-3 text-center">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[9px] uppercase tracking-wider font-bold ${
                              inv.status === 'Overdue' ? 'signal-pulse-red bg-rose-950/40 border-rose-500/50 text-rose-300' :
                              inv.status === 'Paid' ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300' :
                              inv.status === 'Sent' ? 'bg-cyan-950/30 border-cyan-500/30 text-cyan-300' :
                              'bg-amber-950/30 border-amber-500/30 text-amber-300'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${signalDotClass}`} />
                              <span>{inv.status}</span>
                            </span>
                          </td>

                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => setPdfInvoice(inv)}
                                className="p-1 rounded bg-slate-900 hover:bg-[#00ffff]/15 text-[#00ffff] border border-white/10 transition-colors cursor-pointer"
                                title="Inspect PDF"
                              >
                                <Eye className="w-3 h-3" />
                              </button>

                              {inv.status === 'Overdue' && (
                                <button
                                  onClick={() => setNudgeInvoice(inv)}
                                  className="p-1 rounded bg-rose-950/40 hover:bg-rose-950/60 text-rose-300 border border-rose-500/40 transition-colors cursor-pointer signal-pulse-red"
                                  title="Transmit Nudge"
                                >
                                  <Send className="w-3 h-3" />
                                </button>
                              )}

                              {inv.status !== 'Paid' && (
                                <button
                                  onClick={() => handleMarkPaid(inv.id, inv.invoice_number)}
                                  className="px-1.5 py-0.5 rounded bg-emerald-950/40 hover:bg-emerald-950/70 text-emerald-300 border border-emerald-500/30 text-[9px] transition-colors cursor-pointer uppercase"
                                >
                                  Mark Paid
                                </button>
                              )}

                              <button
                                onClick={() => handleDeleteInvoice(inv.id, inv.invoice_number)}
                                className="p-1 rounded text-slate-500 hover:text-[#ff2a5f] transition-colors cursor-pointer"
                                title="Expunge Invoice"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
}
