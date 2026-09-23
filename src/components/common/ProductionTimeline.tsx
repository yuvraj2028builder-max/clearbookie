import React, { useMemo } from 'react';
import { Invoice } from '../../db/types';

interface ProductionTimelineProps {
  invoices: Invoice[];
  getClientName: (clientId: string) => string;
  activeId?: string | null;
  onSelect?: (invoice: Invoice) => void;
  laneHeight?: number;
  compact?: boolean;
  className?: string;
}

const DAY = 86_400_000;

const statusClip: Record<string, string> = {
  Paid: 'clip-paid',
  Sent: 'clip-sent',
  Overdue: 'clip-overdue',
  Draft: 'clip-draft',
  Cancelled: 'clip-draft opacity-40',
};

function parse(d: string) {
  return new Date(`${d}T00:00:00`).getTime();
}

function fmt(ts: number) {
  const d = new Date(ts);
  return `${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export default function ProductionTimeline({
  invoices,
  getClientName,
  activeId,
  onSelect,
  laneHeight = 30,
  compact = false,
  className = '',
}: ProductionTimelineProps) {
  const { start, end, lanes, ticks, todayPct } = useMemo(() => {
    if (invoices.length === 0) {
      const now = Date.now();
      return { start: now - 30 * DAY, end: now + 30 * DAY, lanes: [] as { inv: Invoice; lane: number }[], ticks: [] as number[], todayPct: 50 };
    }
    const starts = invoices.map((i) => parse(i.issue_date));
    const ends = invoices.map((i) => parse(i.due_date));
    const minT = Math.min(...starts) - 3 * DAY;
    const maxT = Math.max(...ends, Date.now()) + 5 * DAY;

    const sorted = [...invoices].sort((a, b) => parse(a.issue_date) - parse(b.issue_date));
    const laneEnds: number[] = [];
    const placed = sorted.map((inv) => {
      const s = parse(inv.issue_date);
      const e = parse(inv.due_date);
      let lane = laneEnds.findIndex((le) => le + 1.5 * DAY < s);
      if (lane === -1) {
        lane = laneEnds.length;
        laneEnds.push(e);
      } else {
        laneEnds[lane] = e;
      }
      return { inv, lane };
    });

    const span = maxT - minT;
    const tickCount = compact ? 5 : 8;
    const tickList: number[] = [];
    for (let i = 0; i <= tickCount; i++) tickList.push(minT + (span * i) / tickCount);

    const pct = ((Date.now() - minT) / span) * 100;
    return { start: minT, end: maxT, lanes: placed, ticks: tickList, todayPct: Math.min(Math.max(pct, 0), 100) };
  }, [invoices, compact]);

  const span = end - start;
  const pct = (ts: number) => ((ts - start) / span) * 100;
  const laneCount = Math.max(lanes.reduce((m, l) => Math.max(m, l.lane), 0) + 1, 1);

  return (
    <div className={`film-track select-none ${className}`}>
      {/* Ruler */}
      <div className="relative h-5 border-b border-white/5 mx-px">
        {ticks.map((t, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 flex flex-col items-center"
            style={{ left: `${pct(t)}%`, transform: 'translateX(-50%)' }}
          >
            <span className="label text-[8px] text-[#55555c] leading-none pt-1">{fmt(t)}</span>
            <span className="w-px flex-1 bg-white/10 mt-0.5" />
          </div>
        ))}
        <div className="absolute right-1.5 top-1 label text-[8px] text-[#00ffff]">TC // {fmt(Date.now())}</div>
      </div>

      <div className="film-sprockets" />

      {/* Lanes */}
      <div className="relative track-lane" style={{ height: laneCount * laneHeight + 8, padding: '4px 0' }}>
        {lanes.map(({ inv, lane }) => {
          const s = parse(inv.issue_date);
          const e = parse(inv.due_date);
          const left = pct(s);
          const width = Math.max(pct(e) - left, 2);
          const client = getClientName(inv.client_id);
          const isActive = activeId === inv.id;
          return (
            <button
              key={inv.id}
              type="button"
              onClick={() => onSelect?.(inv)}
              className={`clip ${statusClip[inv.status] || 'clip-draft'} ${isActive ? 'clip-active' : ''}`}
              style={{
                left: `${left}%`,
                width: `${width}%`,
                top: 4 + lane * laneHeight,
                height: laneHeight - 6,
              }}
              title={`${inv.invoice_number} · ${client} · $${inv.total_amount.toLocaleString()}`}
            >
              <span className="w-1 h-full bg-current opacity-60 shrink-0" />
              <span className="px-1.5 flex items-baseline gap-1.5 text-[9px] leading-none truncate">
                <span className="font-black tracking-wider">{inv.invoice_number}</span>
                {!compact && <span className="opacity-70 truncate">{client}</span>}
                <span className="led ml-auto">${inv.total_amount.toLocaleString()}</span>
              </span>
            </button>
          );
        })}

        {/* Playhead */}
        <div className="playhead" style={{ left: `${todayPct}%` }} />
      </div>

      <div className="film-sprockets" />

      {/* Track footer */}
      <div className="flex items-center justify-between px-2 py-1 label text-[8px]">
        <span className="text-[#55555c]">V1 // RECEIVABLES TRACK · {invoices.length} CLIPS · {laneCount} LANES</span>
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[#00ff41]"><span className="lamp lamp-on-phosphor" style={{ width: 5, height: 5 }} />PAID</span>
          <span className="flex items-center gap-1 text-[#00ffff]"><span className="lamp lamp-on-electric" style={{ width: 5, height: 5 }} />SENT</span>
          <span className="flex items-center gap-1 text-[#ff003c]"><span className="lamp lamp-on-crimson" style={{ width: 5, height: 5 }} />OVERDUE</span>
          <span className="flex items-center gap-1 text-[#ffb000]"><span className="lamp lamp-on-halogen" style={{ width: 5, height: 5 }} />DRAFT</span>
        </span>
      </div>
    </div>
  );
}
