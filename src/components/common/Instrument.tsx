import React from 'react';

export type Signal = 'electric' | 'phosphor' | 'crimson' | 'halogen';

/* ---------------------------------------------------------------------------
   SurgicalToggleGroup — pill keys that physically press in when active
   --------------------------------------------------------------------------- */
export interface ToggleOption<T extends string> {
  value: T;
  label: string;
  signal?: Signal;
  count?: number;
  icon?: React.ComponentType<{ className?: string }>;
}

interface SurgicalToggleGroupProps<T extends string> {
  options: ToggleOption<T>[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
  ariaLabel?: string;
}

export function SurgicalToggleGroup<T extends string>({ options, value, onChange, className = '', ariaLabel }: SurgicalToggleGroupProps<T>) {
  return (
    <div className={`toggle-rail ${className}`} role="tablist" aria-label={ariaLabel}>
      {options.map((opt) => {
        const active = opt.value === value;
        const Icon = opt.icon;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={active}
            data-active={active}
            data-signal={opt.signal || 'electric'}
            onClick={() => onChange(opt.value)}
            className="surgical-toggle"
          >
            {Icon && <Icon className="w-3 h-3" />}
            <span>{opt.label}</span>
            {opt.count !== undefined && opt.count > 0 && (
              <span className={`led text-[9px] ${active ? '' : 'text-[#55555c]'}`}>{opt.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   SurgicalSwitch — single latching pill (on/off)
   --------------------------------------------------------------------------- */
interface SurgicalSwitchProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  signal?: Signal;
  className?: string;
}

export function SurgicalSwitch({ checked, onChange, label, signal = 'electric', className = '' }: SurgicalSwitchProps) {
  const lamp = { electric: 'lamp-on-electric', phosphor: 'lamp-on-phosphor', crimson: 'lamp-on-crimson', halogen: 'lamp-on-halogen' }[signal];
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      data-active={checked}
      data-signal={signal}
      onClick={() => onChange(!checked)}
      className={`surgical-toggle ${className}`}
    >
      <span className={`lamp ${checked ? lamp : ''}`} style={{ width: 6, height: 6 }} />
      <span>{label}</span>
    </button>
  );
}

/* ---------------------------------------------------------------------------
   LedReadout — digits on a display with unlit ghost segments
   --------------------------------------------------------------------------- */
interface LedReadoutProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  tone?: 'bone' | 'phosphor' | 'crimson' | 'electric' | 'halogen';
  className?: string;
  ghost?: boolean;
}

export function LedReadout({ value, prefix = '', suffix = '', decimals = 2, tone = 'bone', className = '', ghost = true }: LedReadoutProps) {
  const formatted = value.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  const text = `${prefix}${formatted}${suffix}`;
  const ghostText = text.replace(/[0-9]/g, '8');
  return (
    <span className={`led led-${tone} ${ghost ? 'led-ghost' : ''} ${className}`} data-ghost={ghostText}>
      {text}
    </span>
  );
}

/* ---------------------------------------------------------------------------
   SignalBadge — status lamp + label
   --------------------------------------------------------------------------- */
const statusClass: Record<string, string> = {
  Paid: 'signal-paid',
  Sent: 'signal-sent',
  Overdue: 'signal-overdue',
  Draft: 'signal-draft',
  Cancelled: 'signal-idle',
};
const statusLabel: Record<string, string> = {
  Paid: 'Paid',
  Sent: 'Sent',
  Overdue: 'Overdue',
  Draft: 'Draft',
  Cancelled: 'Void',
};

export function SignalBadge({ status, label, className = '' }: { status: string; label?: string; className?: string }) {
  return (
    <span className={`signal ${statusClass[status] || 'signal-idle'} ${className}`}>
      <span className="signal-dot" />
      <span>{label || statusLabel[status] || status}</span>
    </span>
  );
}

/* ---------------------------------------------------------------------------
   ModuleHeader — etched module label strip
   --------------------------------------------------------------------------- */
interface ModuleHeaderProps {
  id: string;
  title: string;
  signal?: Signal;
  right?: React.ReactNode;
  className?: string;
}

export function ModuleHeader({ id, title, signal = 'electric', right, className = '' }: ModuleHeaderProps) {
  const color = { electric: 'text-[#00ffff]', phosphor: 'text-[#00ff41]', crimson: 'text-[#ff003c]', halogen: 'text-[#ffb000]' }[signal];
  const lamp = { electric: 'lamp-on-electric', phosphor: 'lamp-on-phosphor', crimson: 'lamp-on-crimson', halogen: 'lamp-on-halogen' }[signal];
  return (
    <div className={`flex items-center justify-between gap-3 px-3 py-2 border-b border-[#101012] bg-[#070708] rounded-t-[5px] ${className}`}>
      <div className="flex items-center gap-2 min-w-0">
        <span className={`lamp ${lamp}`} style={{ width: 6, height: 6 }} />
        <span className="label text-[#55555c] shrink-0">{id}</span>
        <span className={`label ${color} truncate`}>{title}</span>
      </div>
      {right && <div className="flex items-center gap-2 shrink-0">{right}</div>}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   VuMeter — segmented level indicator
   --------------------------------------------------------------------------- */
export function VuMeter({ level, segments = 12, signal = 'phosphor', className = '' }: { level: number; segments?: number; signal?: Signal; className?: string }) {
  const lit = Math.round(Math.min(Math.max(level, 0), 1) * segments);
  const on = { electric: 'bg-[#00ffff] glow-electric', phosphor: 'bg-[#00ff41] glow-phosphor', crimson: 'bg-[#ff003c] glow-crimson', halogen: 'bg-[#ffb000] glow-halogen' }[signal];
  return (
    <div className={`vu ${className}`} aria-hidden>
      {Array.from({ length: segments }).map((_, i) => {
        const isLit = i < lit;
        const isHot = i >= segments - 2;
        return <span key={i} className={`vu-seg ${isLit ? (isHot ? 'bg-[#ff003c] glow-crimson' : on) : ''}`} />;
      })}
    </div>
  );
}
