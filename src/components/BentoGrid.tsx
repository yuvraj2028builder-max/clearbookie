import React from 'react';
import { 
  GitBranch, 
  Clock, 
  Send, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  FileCheck, 
  Sparkles,
  DollarSign,
  Layers
} from 'lucide-react';

export default function BentoGrid() {
  return (
    <section className="py-16 md:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
            <Sparkles className="w-3 h-3" />
            <span>STUDIO-FIRST ADVANTAGE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Built for Cut-Locked Deadlines, Not Generic Accountants
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Every feature is calibrated around timeline approvals, director feedback rounds, and instant cash flow.
          </p>
        </div>

        {/* Bento Grid: 3 Glassmorphic Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Card 1: Tame the Chaos (Project/Revision tracking) */}
          <div className="glass-card-interactive p-6 lg:p-8 flex flex-col justify-between space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/20 transition-all" />
            
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-sm">
                <GitBranch className="w-6 h-6" />
              </div>
              
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">01 / Scope Creep Defense</span>
                <h3 className="text-xl font-bold tracking-tight text-white">Tame the Chaos</h3>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                Post-production is plagued by "just one more small change". Track cut versions automatically. When directors exceed included rounds, excess fees trigger seamlessly.
              </p>
            </div>

            {/* Interactive Visual Element: Revision Meter */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-white/10 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  Nike Global · Reel v03
                </span>
                <span className="text-amber-400 font-semibold">2 / 2 Cuts Used</span>
              </div>
              
              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
                <div className="w-1/2 bg-cyan-400 h-full" />
                <div className="w-1/2 bg-cyan-400 h-full border-l border-slate-950" />
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/5">
                <span className="text-slate-400">Round 3 Requested:</span>
                <span className="text-emerald-400 font-semibold">+$450 Over-age Billable</span>
              </div>
            </div>
          </div>

          {/* Card 2: Get Paid Faster (Professional PDFs + Payment Nudges) */}
          <div className="glass-card-interactive p-6 lg:p-8 flex flex-col justify-between space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-500/20 transition-all" />
            
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-sm">
                <Send className="w-6 h-6" />
              </div>
              
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">02 / Automated Cash Flow</span>
                <h3 className="text-xl font-bold tracking-tight text-white">Get Paid Faster</h3>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                Generate high-typography studio PDFs that look like they came from a Madison Avenue agency. Automated gentle payment nudges reduce overdue client cycles by 14 days.
              </p>
            </div>

            {/* Interactive Visual Element: Payment Nudge Preview */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-white/10 space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[11px]">AUTONOMOUS NUDGE (T-3 DAYS)</span>
                <span className="text-emerald-400 text-[10px] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Scheduled
                </span>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-white/5 text-[11px] text-slate-300 font-sans italic leading-tight">
                "Hi Sarah, your final 4K color export for Warner Music is locked. Friendly reminder that Invoice #1084 is due in 72 hours."
              </div>
              <div className="flex items-center justify-between text-[11px] text-cyan-400 pt-1">
                <span>Stripe / Wire / UPI Ready</span>
                <span>Avg. Pay Time: 4.2 days</span>
              </div>
            </div>
          </div>

          {/* Card 3: No More Guesswork (Real-time profit reports) */}
          <div className="glass-card-interactive p-6 lg:p-8 flex flex-col justify-between space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/20 transition-all" />
            
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm">
                <TrendingUp className="w-6 h-6" />
              </div>
              
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">03 / Real-Time Pulse</span>
                <h3 className="text-xl font-bold tracking-tight text-white">No More Guesswork</h3>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                Know your true hourly yield after plugin subscriptions, hardware depreciation, and taxes. Real-time net margin reports show which production houses actually pay on time.
              </p>
            </div>

            {/* Interactive Visual Element: Real-time Profit Meter */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-white/10 space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>THIS MONTH NET TAKE-HOME</span>
                <span className="text-emerald-400 font-bold text-sm">$14,280.00</span>
              </div>
              
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between text-slate-400">
                  <span>Gross Billings:</span>
                  <span className="text-slate-200">$18,400</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Tax & Plugins Reserve:</span>
                  <span className="text-slate-400">-$4,120</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-cyan-300">
                <span>Effective Rate:</span>
                <span className="font-semibold">$195 / timeline hour</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
