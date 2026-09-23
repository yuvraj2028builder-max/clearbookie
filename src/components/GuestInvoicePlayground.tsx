import React, { useState } from 'react';
import { 
  Sparkles, 
  Download, 
  Lock, 
  FileText, 
  Calendar, 
  DollarSign, 
  Building, 
  Layers, 
  ShieldAlert, 
  ArrowRight,
  Check,
  RefreshCw,
  Sliders,
  Eye
} from 'lucide-react';

interface GuestInvoicePlaygroundProps {
  onTriggerAuth: (invoiceData: {
    clientName: string;
    projectName: string;
    amount: number;
    currency: string;
    invoiceNumber: string;
  }) => void;
}

export default function GuestInvoicePlayground({ onTriggerAuth }: GuestInvoicePlaygroundProps) {
  // Real-time reactive state for the guest invoice
  const [clientName, setClientName] = useState('A24 Films / Pulse Creative');
  const [projectName, setProjectName] = useState('Neon Horizon - 4K Master Color Grade & Deliverables');
  const [amount, setAmount] = useState<number | string>(3850);
  const [currency, setCurrency] = useState('USD');
  const [revisionsIncluded, setRevisionsIncluded] = useState(2);
  const [serviceType, setServiceType] = useState('Color Grading & Conform');
  const [taxRate, setTaxRate] = useState(0); // in percent
  const [invoiceNumber] = useState('INV-2026-089');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [studioFreelancerName, setStudioFreelancerName] = useState('Obsidian Grade Lab');

  // Instant calculated totals
  const numericAmount = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  const taxAmount = (numericAmount * taxRate) / 100;
  const totalAmount = numericAmount + taxAmount;

  // Currency symbol helper
  const currencySymbol = 
    currency === 'USD' ? '$' : 
    currency === 'EUR' ? '€' : 
    currency === 'GBP' ? '£' : 
    currency === 'INR' ? '₹' : '$';

  const handleSaveAndDownload = () => {
    onTriggerAuth({
      clientName: clientName || 'Unnamed Client',
      projectName: projectName || 'Post-Production Deliverable',
      amount: totalAmount,
      currency,
      invoiceNumber
    });
  };

  const loadPreset = (presetType: 'commercial' | 'indie' | 'vfx') => {
    if (presetType === 'commercial') {
      setClientName('Wieden+Kennedy / Nike');
      setProjectName('Global Air Max 30s Spot - Final Grade & HDR Delivery');
      setAmount(5200);
      setServiceType('Color Grading & Conform');
      setRevisionsIncluded(3);
    } else if (presetType === 'indie') {
      setClientName('Sundance Lab / Independent Producer');
      setProjectName('Feature Film "Midnight Sun" - Picture Lock Polish');
      setAmount(8500);
      setServiceType('Feature Editorial & Finish');
      setRevisionsIncluded(2);
    } else {
      setClientName('Framestore London');
      setProjectName('Sci-Fi Series Ep 104 - 18 VFX Cleanups & Screen Replacements');
      setAmount(4100);
      setServiceType('VFX Compositing & Paint');
      setRevisionsIncluded(2);
    }
  };

  return (
    <section id="playground-section" className="py-12 md:py-20 relative scroll-mt-20">
      {/* Decorative subtle ambient lights */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
              <Eye className="w-3.5 h-3.5" />
              <span>INTERACTIVE GUEST PLAYGROUND</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Instant Live Invoice Studio
            </h2>
            <p className="text-sm text-slate-400 max-w-xl">
              Type your real project numbers on the left. The studio-grade PDF on the right compiles simultaneously with zero latency.
            </p>
          </div>

          {/* Quick presets */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400 hidden sm:inline">Try Preset:</span>
            <button
              onClick={() => loadPreset('commercial')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              Commercial
            </button>
            <button
              onClick={() => loadPreset('indie')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              Feature Film
            </button>
            <button
              onClick={() => loadPreset('vfx')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              VFX Shots
            </button>
          </div>
        </div>

        {/* 2-Column Split Playground: Form (Left) vs Real-Time PDF Preview (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ========================================================
              LEFT SIDE: MINIMALIST INPUT FORM
             ======================================================== */}
          <div className="lg:col-span-5 glass-card p-6 md:p-7 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-sm font-semibold text-white tracking-tight">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>Invoice Parameters</span>
              </div>
              <span className="text-[11px] font-mono text-cyan-400">Live Synchronized</span>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSaveAndDownload(); }} className="space-y-4">
              
              {/* Field: Client Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                  <span>Client / Production House Name</span>
                  <span className="text-[10px] text-slate-400 font-mono">Billed To</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. A24 Films / RadicalMedia"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900/90 border border-white/10 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm text-white placeholder-slate-500 transition-colors outline-none font-sans"
                    required
                  />
                </div>
              </div>

              {/* Field: Project Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                  <span>Project / Timeline Name</span>
                  <span className="text-[10px] text-slate-400 font-mono">Deliverables</span>
                </label>
                <div className="relative">
                  <textarea
                    rows={2}
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g. Neon Horizon - 4K Master Color Grade"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900/90 border border-white/10 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm text-white placeholder-slate-500 transition-colors outline-none font-sans resize-none"
                    required
                  />
                </div>
              </div>

              {/* Field: Amount & Currency */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1.5">
                  <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                    <span>Project Amount</span>
                    <span className="text-[10px] text-cyan-400 font-mono">Total Net</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-mono text-sm">
                      {currencySymbol}
                    </span>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="3850"
                      className="w-full pl-8 pr-3.5 py-2.5 rounded-lg bg-slate-900/90 border border-white/10 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm text-white font-mono placeholder-slate-500 transition-colors outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">
                    Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-900/90 border border-white/10 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm text-white font-mono transition-colors outline-none cursor-pointer"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="INR">INR (₹)</option>
                  </select>
                </div>
              </div>

              {/* Post-Production Nuances: Revisions Included & Service Type */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                
                {/* Revisions Included */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                    <span>Revisions Included</span>
                    <span className="text-[10px] text-cyan-400 font-mono">Scope Guard</span>
                  </label>
                  <select
                    value={revisionsIncluded}
                    onChange={(e) => setRevisionsIncluded(parseInt(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-900/90 border border-white/10 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm text-white font-mono transition-colors outline-none cursor-pointer"
                  >
                    <option value={1}>1 Revision Round</option>
                    <option value={2}>2 Revision Rounds (Standard)</option>
                    <option value={3}>3 Revision Rounds</option>
                    <option value={4}>4 Revision Rounds</option>
                  </select>
                </div>

                {/* Due Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                    <span>Payment Due Date</span>
                    <span className="text-[10px] text-slate-400 font-mono">Net 14</span>
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-900/90 border border-white/10 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-xs text-white font-mono transition-colors outline-none cursor-pointer"
                  />
                </div>

              </div>

              {/* Optional Freelancer Studio Name */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                  <span>Your Studio Brand</span>
                  <span className="text-[10px] text-slate-400 font-mono">Issued By</span>
                </label>
                <input
                  type="text"
                  value={studioFreelancerName}
                  onChange={(e) => setStudioFreelancerName(e.target.value)}
                  placeholder="e.g. Obsidian Grade Lab"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900/90 border border-white/10 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm text-white placeholder-slate-500 transition-colors outline-none font-sans"
                />
              </div>

              {/* Instant Status Helper */}
              <div className="pt-2 p-3 rounded-lg bg-slate-900/50 border border-white/5 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">Calculated Total:</span>
                <span className="text-cyan-400 font-mono font-bold text-base">
                  {currencySymbol}{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

            </form>
          </div>

          {/* ========================================================
              RIGHT SIDE: FLOATING GLASSMORPHIC LIVE PDF PREVIEW
             ======================================================== */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Live Indicator Bar */}
            <div className="flex items-center justify-between px-2 text-xs">
              <div className="flex items-center gap-2 text-cyan-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>REAL-TIME PDF RENDER ENGINE</span>
              </div>
              <span className="text-slate-400 font-mono text-[11px]">
                High-Resolution Studio Template (ISO 216 / Letter)
              </span>
            </div>

            {/* The Floating PDF Document Container */}
            <div className="relative glass-card border border-white/15 bg-slate-900/80 p-6 sm:p-8 shadow-2xl shadow-cyan-950/40 rounded-xl overflow-hidden min-h-[500px]">
              
              {/* THE CONVERSION HOOK: Translucent diagonal studio draft watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10 overflow-hidden">
                <div className="transform -rotate-24 text-center px-4 py-2 border-y-2 border-cyan-500/20 bg-slate-950/40 backdrop-blur-[1px] w-[130%]">
                  <span className="font-mono text-2xl sm:text-3xl font-black tracking-widest text-cyan-500/15 uppercase">
                    OFFICIAL STUDIO RELEASE · LOCKED GUEST DRAFT
                  </span>
                </div>
              </div>

              {/* PDF CONTENT HEADER */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold tracking-tight text-white font-sans">
                      {studioFreelancerName || 'Studio Grade Lab'}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    Post-Production Finishing & Color Suite
                  </div>
                </div>

                <div className="text-left sm:text-right space-y-1">
                  <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
                    INVOICE
                  </div>
                  <div className="text-sm font-mono text-white font-semibold">
                    {invoiceNumber}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    Issued: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              </div>

              {/* BILLING METADATA GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-white/10 text-xs">
                
                {/* Billed To */}
                <div className="space-y-1.5">
                  <div className="font-mono uppercase tracking-wider text-slate-400 text-[10px]">
                    BILLED TO PRODUCTION
                  </div>
                  <div className="text-sm font-bold text-white tracking-tight">
                    {clientName || 'Client Name / Agency'}
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Production Office / Post Accounts Payable
                  </div>
                  <div className="text-cyan-400/80 font-mono text-[10px]">
                    Status: Direct Studio Client
                  </div>
                </div>

                {/* Due Date & Scope Terms */}
                <div className="space-y-1.5 sm:text-right">
                  <div className="font-mono uppercase tracking-wider text-slate-400 text-[10px]">
                    PAYMENT TERMS & TIMELINE
                  </div>
                  <div className="text-xs text-slate-200 font-mono">
                    Due By: <span className="text-white font-semibold">{dueDate}</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 sm:ml-auto">
                    <span>Revisions Capped: {revisionsIncluded} Rounds</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Additional cut passes billed at standard hourly rate
                  </div>
                </div>

              </div>

              {/* DELIVERABLE LINE ITEMS TABLE */}
              <div className="py-6 space-y-3">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400 font-mono text-[11px]">
                        <th className="py-2 px-2">Deliverable Description</th>
                        <th className="py-2 px-2 text-center">Scope</th>
                        <th className="py-2 px-2 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <tr>
                        <td className="py-3 px-2">
                          <div className="font-semibold text-white tracking-tight">
                            {projectName || 'Master Post-Production Project'}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5 font-sans">
                            {serviceType} • Final Prores 4444 XQ master export + web deliverables
                          </div>
                        </td>
                        <td className="py-3 px-2 text-center font-mono text-cyan-300 text-xs">
                          {revisionsIncluded} Passes
                        </td>
                        <td className="py-3 px-2 text-right font-mono text-white text-sm font-semibold tabular-nums">
                          {currencySymbol}{numericAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Subtotal / Total Calculation Rows */}
                <div className="pt-3 border-t border-white/10 flex flex-col items-end space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between w-48 text-slate-400">
                    <span>Subtotal:</span>
                    <span className="text-slate-200 tabular-nums">
                      {currencySymbol}{numericAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  {taxRate > 0 && (
                    <div className="flex justify-between w-48 text-slate-400">
                      <span>Tax ({taxRate}%):</span>
                      <span className="text-slate-200 tabular-nums">
                        {currencySymbol}{taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between w-48 pt-2 border-t border-white/10 text-sm font-bold text-white">
                    <span className="text-cyan-400">Total Due:</span>
                    <span className="text-cyan-400 font-mono tabular-nums text-base">
                      {currencySymbol}{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* THE CONVERSION HOOK: BLURRED / WATERMARKED BANKING REMITTANCE AREA */}
              <div className="mt-4 pt-4 border-t border-dashed border-white/15 relative">
                
                {/* Remittance blur overlay with Lock badge */}
                <div className="p-4 rounded-lg bg-slate-950/90 border border-cyan-500/30 relative overflow-hidden backdrop-blur-md">
                  
                  {/* Blurred mock banking content underneath */}
                  <div className="filter blur-[4px] select-none pointer-events-none opacity-40 font-mono text-[11px] space-y-1 text-slate-300">
                    <div className="flex justify-between">
                      <span>BANK: J.P. MORGAN CHASE & CO.</span>
                      <span>SWIFT: CHASUS33XXX</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ROUTING: 021000021</span>
                      <span>ACCOUNT: *******8942</span>
                    </div>
                    <div className="flex justify-between">
                      <span>STRIPE INSTANT CHECKOUT: https://pay.clearbooks.studio/inv_8942</span>
                    </div>
                  </div>

                  {/* High-visibility Lock & Unlock prompt */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 px-4 text-center space-y-1.5 z-20">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-semibold">
                      <Lock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>LOCKED REMITTANCE & STRIPE GATEWAY</span>
                    </div>
                    <p className="text-[11px] text-slate-300 max-w-sm">
                      Sign in free with Google to unblur payment wiring instructions, unlock PDF export, and enable 1-click client payments.
                    </p>
                  </div>
                </div>

              </div>

            </div>

            {/* THE PRIMARY GLOWING BUTTON: Save Invoice & Download PDF */}
            <div className="pt-2">
              <button
                onClick={handleSaveAndDownload}
                className="w-full group relative overflow-hidden py-4 px-6 rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-base flex items-center justify-center gap-3 transition-all duration-300 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 w-1/2 h-full bg-white/30 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-700 ease-out" />
                
                <Download className="w-5 h-5 text-slate-950 group-hover:-translate-y-0.5 transition-transform" />
                <span className="tracking-tight">Save Invoice & Download PDF</span>
                <ArrowRight className="w-5 h-5 text-slate-950 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="mt-3 flex items-center justify-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-cyan-400" />
                  Instant Google One-Click
                </span>
                <span>•</span>
                <span>Watermark Removed on Save</span>
                <span>•</span>
                <span>Free Forever Plan</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
