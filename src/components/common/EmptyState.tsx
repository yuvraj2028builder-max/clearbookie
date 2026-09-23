import React from 'react';
import { LucideIcon, ArrowRight, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  badge?: string;
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  tips?: string[];
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  badge = 'GETTING STARTED',
  title,
  description,
  primaryAction,
  secondaryAction,
  tips,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`glass-card p-8 md:p-12 text-center relative overflow-hidden group border border-white/10 ${className}`}>
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/10 transition-colors duration-500" />

      <div className="relative z-10 max-w-lg mx-auto space-y-5">
        {/* Animated Icon Container */}
        <div className="relative mx-auto w-16 h-16 rounded-2xl bg-slate-900/90 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-xl shadow-cyan-950/40 group-hover:scale-105 group-hover:border-cyan-400/60 transition-all duration-300">
          <Icon className="w-8 h-8" />
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-400 animate-ping opacity-75" />
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-400" />
        </div>

        {/* Badge & Title */}
        <div className="space-y-2">
          {badge && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              {badge}
            </span>
          )}
          <h3 className="text-xl font-bold tracking-tight text-white font-sans">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
            {description}
          </p>
        </div>

        {/* Helpful Quick Tips if available */}
        {tips && tips.length > 0 && (
          <div className="bg-slate-950/60 border border-white/5 rounded-xl p-3.5 text-left text-xs space-y-2 max-w-md mx-auto">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold block">
              Quick Studio Tip:
            </span>
            <ul className="space-y-1.5 text-slate-300">
              {tips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-cyan-400 font-mono text-[11px] mt-0.5">›</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          {primaryAction && (
            <button
              onClick={primaryAction.onClick}
              className="px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/25 active:scale-[0.98] cursor-pointer"
            >
              {primaryAction.icon ? (
                <primaryAction.icon className="w-4 h-4" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
              <span>{primaryAction.label}</span>
            </button>
          )}

          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 hover:border-white/20 text-xs font-medium flex items-center gap-2 transition-all cursor-pointer"
            >
              {secondaryAction.icon && <secondaryAction.icon className="w-4 h-4 text-cyan-400" />}
              <span>{secondaryAction.label}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
