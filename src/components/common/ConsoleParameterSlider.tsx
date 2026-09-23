import React from 'react';

interface ConsoleParameterSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
  className?: string;
  ticks?: string[];
}

export default function ConsoleParameterSlider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
  className = '',
  ticks = ['0', '25', '50', '75', '100'],
}: ConsoleParameterSliderProps) {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  return (
    <div className={`space-y-1.5 ${className}`}>
      {/* Header: Label + Digital Readout */}
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-slate-400 uppercase tracking-wider text-[11px]">
          {label}
        </span>
        <div className="px-2 py-0.5 rounded bg-[#05070a] border border-white/10 font-bold text-[#00ffff] tracking-widest shadow-[inset_0_1px_3px_rgba(0,0,0,0.9)]">
          {value.toLocaleString()}{unit}
        </div>
      </div>

      {/* Recessed Hardware Slider Bay */}
      <div className="relative py-1">
        {/* Track */}
        <div className="h-2 w-full bg-[#080b11] border border-white/10 rounded-sm shadow-[inset_0_1px_3px_rgba(0,0,0,0.95)] relative overflow-hidden">
          {/* Active Level Fill */}
          <div 
            className="h-full bg-gradient-to-r from-cyan-900/60 to-[#00ffff]/80 transition-all duration-75"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Real Range Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {/* Visual Slider Thumb */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-5 bg-gradient-to-b from-[#334155] to-[#0f172a] border border-[#00ffff] rounded-sm shadow-[0_0_8px_rgba(0,255,255,0.4)] pointer-events-none transition-all duration-75 flex items-center justify-center"
          style={{ left: `${percentage}%` }}
        >
          {/* Center line notch */}
          <div className="w-0.5 h-2.5 bg-[#00ffff]" />
        </div>
      </div>

      {/* Calibration Tick Marks */}
      {ticks.length > 0 && (
        <div className="flex justify-between px-0.5 text-[9px] font-mono text-slate-400 select-none">
          {ticks.map((t, idx) => (
            <span key={idx}>| {t}</span>
          ))}
        </div>
      )}
    </div>
  );
}
