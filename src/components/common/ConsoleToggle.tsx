import React from 'react';

interface ConsoleToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  sublabel?: string;
  disabled?: boolean;
  signalColor?: 'cyan' | 'green' | 'amber' | 'red';
  size?: 'sm' | 'md';
  className?: string;
}

export default function ConsoleToggle({
  checked,
  onChange,
  label,
  sublabel,
  disabled = false,
  signalColor = 'cyan',
  size = 'md',
  className = '',
}: ConsoleToggleProps) {
  const signalGlowClass = {
    cyan: checked ? 'bg-[#00ffff] shadow-[0_0_10px_#00ffff]' : 'bg-slate-700',
    green: checked ? 'bg-[#00ff9d] shadow-[0_0_10px_#00ff9d]' : 'bg-slate-700',
    amber: checked ? 'bg-[#ffaa00] shadow-[0_0_10px_#ffaa00]' : 'bg-slate-700',
    red: checked ? 'bg-[#ff2a5f] shadow-[0_0_10px_#ff2a5f]' : 'bg-slate-700',
  }[signalColor];

  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <div 
      onClick={handleToggle}
      className={`inline-flex items-center gap-3 cursor-pointer select-none group ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {/* Physical Hardware Rocker Switch */}
      <div 
        className={`relative rounded border transition-all duration-75 ease-out ${
          size === 'sm' ? 'w-10 h-5 p-0.5' : 'w-12 h-6 p-0.5'
        } ${
          checked 
            ? 'bg-[#0c131c] border-[#00ffff]/40 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),0_0_8px_rgba(0,255,255,0.15)]' 
            : 'bg-[#090b10] border-white/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)]'
        }`}
      >
        {/* Toggle Rocker Slider */}
        <div 
          className={`h-full rounded-sm flex items-center justify-center transition-all duration-75 ease-out border shadow-sm ${
            size === 'sm' ? 'w-4' : 'w-5'
          } ${
            checked 
              ? `${size === 'sm' ? 'translate-x-5' : 'translate-x-6'} bg-gradient-to-b from-[#1e293b] to-[#0f172a] border-[#00ffff]/60` 
              : 'translate-x-0 bg-gradient-to-b from-[#334155] to-[#1e293b] border-white/20'
          }`}
        >
          {/* LED Signal Tally on the Rocker */}
          <span 
            className={`w-1.5 h-1.5 rounded-full transition-colors duration-75 ${signalGlowClass}`} 
          />
        </div>
      </div>

      {/* Label and Sublabel */}
      {(label || sublabel) && (
        <div className="flex flex-col">
          {label && (
            <span className="text-xs font-mono font-medium tracking-tight text-slate-200 group-hover:text-white transition-colors">
              {label}
            </span>
          )}
          {sublabel && (
            <span className="text-[10px] font-mono text-slate-400">
              {sublabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
