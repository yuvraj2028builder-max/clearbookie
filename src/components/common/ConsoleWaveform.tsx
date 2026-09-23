import React from 'react';

interface ConsoleWaveformProps {
  type?: 'vectorscope' | 'waveform' | 'parade' | 'audio';
  height?: number;
  className?: string;
  opacity?: number;
  glow?: boolean;
}

export default function ConsoleWaveform({
  type = 'waveform',
  height = 48,
  className = '',
  opacity = 0.25,
  glow = false,
}: ConsoleWaveformProps) {
  if (type === 'vectorscope') {
    return (
      <div 
        className={`relative flex items-center justify-center pointer-events-none select-none ${className}`}
        style={{ opacity }}
      >
        <svg width="64" height="64" viewBox="0 0 100 100" className="stroke-cyan-400/40">
          <circle cx="50" cy="50" r="45" fill="none" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="30" fill="none" strokeWidth="0.8" strokeDasharray="2 2" />
          <line x1="5" y1="50" x2="95" y2="50" strokeWidth="0.8" strokeDasharray="2 2" />
          <line x1="50" y1="5" x2="50" y2="95" strokeWidth="0.8" strokeDasharray="2 2" />
          {/* Color target boxes (R, Mg, B, Cy, G, Yl) */}
          <rect x="70" y="24" width="6" height="6" fill="none" stroke="#ff2a5f" strokeWidth="1.2" />
          <rect x="74" y="55" width="6" height="6" fill="none" stroke="#e040fb" strokeWidth="1" />
          <rect x="52" y="74" width="6" height="6" fill="none" stroke="#00ffff" strokeWidth="1" />
          <rect x="22" y="70" width="6" height="6" fill="none" stroke="#00e5ff" strokeWidth="1" />
          <rect x="20" y="38" width="6" height="6" fill="none" stroke="#00ff9d" strokeWidth="1" />
          <rect x="42" y="20" width="6" height="6" fill="none" stroke="#ffea00" strokeWidth="1" />
          {/* Signal scatter trace */}
          <path
            d="M48 52 Q 55 45, 62 38 T 58 60 T 35 48 T 48 52"
            fill="none"
            stroke={glow ? "#00ffff" : "rgba(0, 255, 255, 0.6)"}
            strokeWidth="1.5"
            className="blur-[0.5px]"
          />
        </svg>
      </div>
    );
  }

  if (type === 'parade') {
    return (
      <div 
        className={`w-full overflow-hidden pointer-events-none select-none flex items-center justify-between gap-1 ${className}`}
        style={{ height: `${height}px`, opacity }}
      >
        {/* Red Channel */}
        <div className="flex-1 h-full flex items-end justify-between px-1 bg-rose-950/10 border-r border-white/5">
          {[40, 65, 80, 50, 95, 30, 70, 85, 45, 60, 90, 35].map((val, i) => (
            <div
              key={`r-${i}`}
              className="w-1 bg-[#ff2a5f]/60 rounded-t-sm"
              style={{ height: `${val}%` }}
            />
          ))}
        </div>
        {/* Green Channel */}
        <div className="flex-1 h-full flex items-end justify-between px-1 bg-emerald-950/10 border-r border-white/5">
          {[55, 75, 60, 85, 70, 45, 80, 65, 90, 50, 75, 40].map((val, i) => (
            <div
              key={`g-${i}`}
              className="w-1 bg-[#00ff9d]/60 rounded-t-sm"
              style={{ height: `${val}%` }}
            />
          ))}
        </div>
        {/* Blue Channel */}
        <div className="flex-1 h-full flex items-end justify-between px-1 bg-cyan-950/10">
          {[60, 80, 45, 90, 55, 70, 85, 40, 75, 65, 85, 50].map((val, i) => (
            <div
              key={`b-${i}`}
              className="w-1 bg-[#00ffff]/60 rounded-t-sm"
              style={{ height: `${val}%` }}
            />
          ))}
        </div>
      </div>
    );
  }

  // Default: Studio Waveform Monitor / Oscilloscope trace
  return (
    <div 
      className={`w-full overflow-hidden pointer-events-none select-none relative ${className}`}
      style={{ height: `${height}px`, opacity }}
    >
      <svg
        viewBox="0 0 1000 100"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        {/* Graticule grid lines (IRE scale: 0, 50, 100) */}
        <line x1="0" y1="15" x2="1000" y2="15" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="0.75" strokeDasharray="3 3" />
        <line x1="0" y1="50" x2="1000" y2="50" stroke="rgba(0, 255, 255, 0.15)" strokeWidth="0.75" strokeDasharray="4 4" />
        <line x1="0" y1="85" x2="1000" y2="85" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="0.75" strokeDasharray="3 3" />
        
        {/* Main Waveform Trace */}
        <path
          d="M0,52 Q 25,48 50,75 T 100,20 T 150,85 T 200,35 T 250,65 T 300,18 T 350,72 T 400,30 T 450,88 T 500,42 T 550,60 T 600,25 T 650,80 T 700,32 T 750,68 T 800,22 T 850,78 T 900,45 T 950,58 T 1000,50"
          fill="none"
          stroke={glow ? "#00ffff" : "rgba(0, 255, 255, 0.55)"}
          strokeWidth="1.2"
          className={glow ? "drop-shadow-[0_0_8px_rgba(0,255,255,0.7)]" : ""}
        />

        {/* Secondary Harmonic Waveform */}
        <path
          d="M0,50 Q 30,30 60,65 T 120,40 T 180,70 T 240,28 T 300,82 T 360,35 T 420,75 T 480,20 T 540,85 T 600,40 T 660,70 T 720,25 T 780,80 T 840,32 T 900,68 T 960,42 T 1000,50"
          fill="none"
          stroke="rgba(0, 255, 157, 0.35)"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}
