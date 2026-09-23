import React, { useEffect, useMemo, useRef, useState } from 'react';

export interface WaveformSample {
  month: string;
  income: number;
  expense: number;
}

interface PaymentWaveformProps {
  data: WaveformSample[];
  height?: number;
  running?: boolean;
  showExpense?: boolean;
  className?: string;
}

const W = 720;
const SAMPLES = 360;
const PAD_Y = 16;
const PAD_X = 28;

const smoothstep = (t: number) => t * t * (3 - 2 * t);

function buildPath(
  amps: number[],
  mid: number,
  phase: number,
  freq: number,
  invert: boolean,
): string {
  const segments = amps.length - 1;
  const usableW = W - PAD_X * 2;
  let d = '';
  for (let i = 0; i < SAMPLES; i++) {
    const t = i / (SAMPLES - 1);
    const pos = t * segments;
    const idx = Math.min(Math.floor(pos), segments - 1);
    const frac = smoothstep(pos - idx);
    const amp = amps[idx] + (amps[idx + 1] - amps[idx]) * frac;
    const x = PAD_X + t * usableW;
    const wave = Math.sin(i * freq + phase) * amp;
    const y = mid + (invert ? wave : -wave);
    d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)} `;
  }
  return d;
}

function buildEnvelope(amps: number[], mid: number): string {
  const segments = amps.length - 1;
  const usableW = W - PAD_X * 2;
  let d = '';
  for (let i = 0; i < 120; i++) {
    const t = i / 119;
    const pos = t * segments;
    const idx = Math.min(Math.floor(pos), segments - 1);
    const frac = smoothstep(pos - idx);
    const amp = amps[idx] + (amps[idx + 1] - amps[idx]) * frac;
    const x = PAD_X + t * usableW;
    d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${(mid - amp).toFixed(1)} `;
  }
  return d;
}

export default function PaymentWaveform({
  data,
  height = 200,
  running = true,
  showExpense = true,
  className = '',
}: PaymentWaveformProps) {
  const [phase, setPhase] = useState(0);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setPhase((p) => (p + dt * 2.2) % (Math.PI * 2));
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [running]);

  const H = height;
  const mid = H / 2;
  const maxAmp = mid - PAD_Y;
  const peak = Math.max(...data.map((d) => Math.max(d.income, d.expense)), 1);

  const incomeAmps = useMemo(() => data.map((d) => (d.income / peak) * maxAmp), [data, peak, maxAmp]);
  const expenseAmps = useMemo(() => data.map((d) => (d.expense / peak) * maxAmp), [data, peak, maxAmp]);

  const incomePath = useMemo(() => buildPath(incomeAmps, mid, phase, 0.19, false), [incomeAmps, mid, phase]);
  const expensePath = useMemo(() => buildPath(expenseAmps, mid, phase * 1.3 + 1.1, 0.27, true), [expenseAmps, mid, phase]);
  const envelopePath = useMemo(() => buildEnvelope(incomeAmps, mid), [incomeAmps, mid]);

  const segments = data.length - 1;
  const usableW = W - PAD_X * 2;
  const xForIdx = (i: number) => PAD_X + (i / segments) * usableW;

  const handleMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width;
    const x = xRatio * W;
    const t = Math.min(Math.max((x - PAD_X) / usableW, 0), 1);
    setHoverIdx(Math.round(t * segments));
  };

  const hovered = hoverIdx !== null ? data[hoverIdx] : null;
  const gridLines = [0.25, 0.5, 0.75];

  return (
    <div className={`relative console-bay scope-grid overflow-hidden ${className}`} style={{ height: H }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
        onMouseMove={handleMove}
        onMouseLeave={() => setHoverIdx(null)}
        role="img"
        aria-label="Payment waveform: income and expense oscillation over six months"
      >
        <defs>
          <filter id="wf-glow-green" x="-10%" y="-50%" width="120%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="wf-glow-red" x="-10%" y="-50%" width="120%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="wf-fade" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#00ff41" stopOpacity="0.25" />
            <stop offset="0.5" stopColor="#00ff41" stopOpacity="1" />
            <stop offset="1" stopColor="#00ff41" stopOpacity="0.25" />
          </linearGradient>
        </defs>

        {/* Center line + reference grid */}
        <line x1={PAD_X} x2={W - PAD_X} y1={mid} y2={mid} stroke="rgba(0,255,255,0.18)" strokeWidth="1" strokeDasharray="2 4" />
        {gridLines.map((g) => (
          <React.Fragment key={g}>
            <line x1={PAD_X} x2={W - PAD_X} y1={mid - maxAmp * g} y2={mid - maxAmp * g} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            <line x1={PAD_X} x2={W - PAD_X} y1={mid + maxAmp * g} y2={mid + maxAmp * g} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          </React.Fragment>
        ))}

        {/* Month tick columns */}
        {data.map((d, i) => (
          <g key={d.month}>
            <line x1={xForIdx(i)} x2={xForIdx(i)} y1={PAD_Y - 6} y2={H - PAD_Y + 6} stroke={hoverIdx === i ? 'rgba(0,255,255,0.35)' : 'rgba(255,255,255,0.06)'} strokeWidth="1" />
            {/* Peak-hold marker */}
            <rect x={xForIdx(i) - 5} y={mid - incomeAmps[i] - 1} width="10" height="2" fill="#00ff41" opacity="0.9" />
          </g>
        ))}

        {/* Envelope (peak outline) */}
        <path d={envelopePath} fill="none" stroke="rgba(0,255,65,0.25)" strokeWidth="1" strokeDasharray="1 3" />

        {/* Expense oscillation */}
        {showExpense && (
          <path d={expensePath} fill="none" stroke="#ff003c" strokeWidth="1.25" strokeLinejoin="round" opacity="0.85" filter="url(#wf-glow-red)" />
        )}

        {/* Income oscillation */}
        <path d={incomePath} fill="none" stroke="#00ff41" strokeWidth="1.75" strokeLinejoin="round" filter="url(#wf-glow-green)" />

        {/* Hover cursor */}
        {hoverIdx !== null && (
          <>
            <line x1={xForIdx(hoverIdx)} x2={xForIdx(hoverIdx)} y1={0} y2={H} stroke="#00ffff" strokeWidth="1" opacity="0.9" />
            <circle cx={xForIdx(hoverIdx)} cy={mid - incomeAmps[hoverIdx]} r="3" fill="#00ff41" />
            <circle cx={xForIdx(hoverIdx)} cy={mid + expenseAmps[hoverIdx]} r="2.5" fill="#ff003c" />
          </>
        )}
      </svg>

      <div className="scope-scanline" />
      <div className="scope-vignette" />

      {/* Month labels */}
      <div className="absolute bottom-1 left-0 right-0 flex justify-between px-[3.9%] pointer-events-none">
        {data.map((d, i) => (
          <span
            key={d.month}
            className={`label transition-colors ${hoverIdx === i ? 'text-[#00ffff]' : 'text-[#55555c]'}`}
          >
            {d.month.toUpperCase()}
          </span>
        ))}
      </div>

      {/* Scale */}
      <div className="absolute top-1 left-1.5 label text-[#55555c] pointer-events-none leading-none">
        +${Math.round(peak / 1000)}K
      </div>
      <div className="absolute bottom-1 left-1.5 label text-[#55555c] pointer-events-none leading-none">
        -${Math.round(peak / 1000)}K
      </div>

      {/* Readout */}
      <div className="absolute top-1.5 right-1.5 console-module px-2.5 py-1.5 min-w-[150px] pointer-events-none">
        {hovered ? (
          <div className="space-y-0.5">
            <div className="label text-[#00ffff]">{hovered.month.toUpperCase()} // SAMPLE</div>
            <div className="flex items-center justify-between gap-3 text-[10px]">
              <span className="text-[#8b8b93]">IN</span>
              <span className="led led-phosphor">+{hovered.income.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-[10px]">
              <span className="text-[#8b8b93]">OUT</span>
              <span className="led led-crimson">-{hovered.expense.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-[10px] etched pt-0.5">
              <span className="text-[#8b8b93]">NET</span>
              <span className="led led-bone">{(hovered.income - hovered.expense).toLocaleString()}</span>
            </div>
          </div>
        ) : (
          <div className="space-y-0.5">
            <div className="label text-[#55555c]">SCOPE // {running ? 'RUN' : 'HOLD'}</div>
            <div className="flex items-center gap-2 text-[9px]">
              <span className="w-3 h-[2px] bg-[#00ff41] glow-phosphor" />
              <span className="text-[#8b8b93] tracking-widest">INCOME</span>
            </div>
            <div className="flex items-center gap-2 text-[9px]">
              <span className="w-3 h-[2px] bg-[#ff003c] glow-crimson" />
              <span className="text-[#8b8b93] tracking-widest">EXPENSE</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
