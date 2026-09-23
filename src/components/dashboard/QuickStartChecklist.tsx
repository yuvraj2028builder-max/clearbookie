import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Sparkles, 
  Building, 
  FileText, 
  Palette, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  Flame, 
  RotateCcw,
  Zap,
  Sliders,
  Radio
} from 'lucide-react';
import { toast } from 'sonner';
import { useStudio } from '../../context/StudioContext';

export default function QuickStartChecklist() {
  const { 
    profile, 
    clients, 
    invoices, 
    isProfileConfigured, 
    setActiveTab, 
    setIsCreateInvoiceOpen,
    setIsAddClientModalOpen,
    resetToDemoData,
    clearToCleanSlate
  } = useStudio();

  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleResetDemo = () => {
    resetToDemoData();
    toast.success('Production Demo Data Loaded', {
      description: 'A24 Films, Netflix conform invoices, and software expenses calibrated.',
    });
  };

  const handleClearSlate = () => {
    clearToCleanSlate();
    toast.success('Reset to Clean Slate', {
      description: 'Ledger cleared to pristine state for first-time user walkthrough.',
    });
  };

  // Milestone 1: Studio Setup
  const milestone1Done = isProfileConfigured || (profile.studio_name !== 'Obsidian Grade Lab' || !!profile.logo_url || !!profile.billing_address);
  
  // Milestone 2: Add First Client
  const milestone2Done = clients.length > 0;

  // Milestone 3: Issue First Invoice
  const milestone3Done = invoices.length > 0;

  // Calculate completed count
  const completedCount = (milestone1Done ? 1 : 0) + (milestone2Done ? 1 : 0) + (milestone3Done ? 1 : 0);
  const progressPercent = Math.round((completedCount / 3) * 100);
  const allCompleted = completedCount === 3;

  const milestones = [
    {
      id: 'studio-setup',
      step: 1,
      title: 'Studio Calibration & Tax Defaults',
      description: 'Configure studio mark, billing currency (USD/EUR/INR), and default tax rate.',
      done: milestone1Done,
      estimatedTime: '45s',
      actionLabel: milestone1Done ? 'Recalibrate Settings' : 'Calibrate Studio',
      icon: Sliders,
      onAction: () => setActiveTab('settings'),
    },
    {
      id: 'first-client',
      step: 2,
      title: 'Register First Studio Patron',
      description: 'Enroll a production house, director, or agency with remit tax ID & address.',
      done: milestone2Done,
      estimatedTime: '30s',
      actionLabel: milestone2Done ? 'Inspect Patrons' : 'Enroll Patron',
      icon: Building,
      onAction: () => {
        if (milestone2Done) {
          setActiveTab('clients');
        } else {
          setActiveTab('clients');
          setIsAddClientModalOpen(true);
        }
      },
    },
    {
      id: 'first-invoice',
      step: 3,
      title: 'Drop First Clip On Timeline Track',
      description: 'Define billable conform scope, lock Revision Guard passes, and issue commercial PDF.',
      done: milestone3Done,
      estimatedTime: '1m',
      actionLabel: milestone3Done ? 'View Timeline' : 'Engage Invoice',
      icon: FileText,
      onAction: () => {
        if (milestone3Done) {
          setActiveTab('invoices');
        } else {
          setIsCreateInvoiceOpen(true);
        }
      },
    },
  ];

  return (
    <div className="console-module p-4 relative overflow-hidden">
      
      {/* Header with Progress Bar & Hardware Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10 relative z-10 font-mono">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-[#00ffff]/10 text-[#00ffff] border border-[#00ffff]/20">
              <Zap className="w-3.5 h-3.5 fill-[#00ffff]/30" />
            </span>
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>SYSTEM ONBOARDING CALIBRATION</span>
              <span className="text-[10px] text-[#00ffff] px-1.5 py-0.2 rounded bg-[#00ffff]/10 border border-[#00ffff]/30">
                {completedCount}/3 LOCKED
              </span>
            </h2>
          </div>
          <p className="text-[11px] text-slate-400">
            Follow 3 core calibration steps to engage the finishing console and secure commercial client payments.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-center text-xs">
          {/* Quick Demo vs Clean Slate Switcher */}
          <div className="flex items-center gap-1.5 text-[10px]">
            {clients.length === 0 && invoices.length === 0 ? (
              <button
                onClick={handleResetDemo}
                className="px-2.5 py-1 rounded bg-[#00ffff]/10 hover:bg-[#00ffff]/20 text-[#00ffff] border border-[#00ffff]/30 transition-colors cursor-pointer flex items-center gap-1 uppercase font-bold"
                title="Populate demo studio clients & invoices"
              >
                <Sparkles className="w-3 h-3" />
                <span>Load Demo Reel</span>
              </button>
            ) : (
              <button
                onClick={handleClearSlate}
                className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-white/10 transition-colors cursor-pointer flex items-center gap-1 uppercase"
                title="Reset to clean slate empty state"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clean Slate</span>
              </button>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            title={isCollapsed ? 'Expand Checklist' : 'Collapse Checklist'}
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Visual Progress Bar */}
      <div className="pt-2.5 pb-1 relative z-10">
        <div className="w-full h-1 bg-[#050609] rounded-full overflow-hidden border border-white/5">
          <div 
            className="h-full bg-gradient-to-r from-[#00ffff] to-[#00ff9d] transition-all duration-300 ease-out shadow-[0_0_8px_#00ffff]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Checklist Content */}
      {!isCollapsed && (
        <div className="mt-3 space-y-3 relative z-10 font-mono">
          
          {/* All Completed Celebration Banner */}
          {allCompleted && (
            <div className="p-2.5 rounded bg-emerald-950/40 border border-[#00ff9d]/40 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-[#00ff9d]/20 text-[#00ff9d]">
                  <Flame className="w-3.5 h-3.5" />
                </span>
                <div>
                  <div className="font-bold text-[#00ff9d] text-[11px] uppercase tracking-wider">Suite Calibrated: Ready for Commercial Renders</div>
                  <div className="text-slate-400 text-[10px]">
                    Ledger bus and Revision Guard are synchronized with panel telemetry.
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsCreateInvoiceOpen(true)}
                className="px-2.5 py-1 rounded bg-[#00ff9d] hover:bg-[#33ffb1] text-[#07080d] font-bold text-[10px] shrink-0 transition-colors uppercase cursor-pointer"
              >
                + Drop Clip
              </button>
            </div>
          )}

          {/* Milestone Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {milestones.map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.id}
                  className={`console-bay p-3.5 flex flex-col justify-between space-y-2.5 border ${
                    m.done 
                      ? 'border-[#00ff9d]/30 bg-emerald-950/10' 
                      : 'border-white/10 hover:border-[#00ffff]/40'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {m.done ? (
                          <span className="text-[#00ff9d] flex items-center gap-1 text-[10px] font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>LOCKED</span>
                          </span>
                        ) : (
                          <span className="w-4 h-4 rounded-sm border border-[#00ffff]/50 bg-[#00ffff]/10 text-[#00ffff] text-[9px] font-bold flex items-center justify-center">
                            0{m.step}
                          </span>
                        )}
                        <span className="text-[9px] text-slate-400 uppercase">
                          {m.estimatedTime}
                        </span>
                      </div>

                      <Icon className={`w-3.5 h-3.5 ${m.done ? 'text-[#00ff9d]' : 'text-[#00ffff]'}`} />
                    </div>

                    <div>
                      <h4 className={`text-xs font-bold tracking-tight ${m.done ? 'text-slate-300 line-through decoration-slate-600' : 'text-white'}`}>
                        {m.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 leading-snug mt-0.5">
                        {m.description}
                      </p>
                    </div>
                  </div>

                  {/* Action CTA */}
                  <button
                    onClick={m.onAction}
                    className={`w-full py-1 px-2.5 rounded text-[10px] font-bold uppercase flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      m.done
                        ? 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/5'
                        : 'electric-glow-btn'
                    }`}
                  >
                    <span>{m.actionLabel}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>

        </div>
      )}
    </div>
  );
}
