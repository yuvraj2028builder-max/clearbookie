import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  DollarSign, 
  Shield, 
  Calendar, 
  FileSpreadsheet, 
  Percent, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  CheckCircle2,
  Receipt
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';

export default function ReportsView() {
  const { monthlyProfit, invoices, transactions, totalTaxCollected, getClientById, profile } = useStudio();
  const [dateRange, setDateRange] = useState<'ytd' | 'last6months' | 'all'>('last6months');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Computed Financial Aggregates
  const totalInvoiced = invoices.reduce((s, i) => s + i.total_amount, 0);
  const totalIncomePaid = invoices
    .filter(i => i.status === 'Paid')
    .reduce((s, i) => s + i.total_amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);

  const netProfit = totalIncomePaid - totalExpenses;
  const expenseRatio = totalIncomePaid > 0 ? Math.round((totalExpenses / totalIncomePaid) * 100) : 0;
  
  // Current month net profit
  const currentMonthData = monthlyProfit[monthlyProfit.length - 1];
  const monthlyNetProfit = currentMonthData ? (currentMonthData.income - currentMonthData.expense) : 0;

  // Professional Export to CSV
  const handleExportCsv = () => {
    // Generate RFC-4180 compliant CSV
    const rows = [
      ['CLEARBOOKS STUDIO - FINANCIAL & TAX REPORT'],
      [`Studio: ${profile.studio_name || 'Independent Freelance Studio'}`, `Freelancer: ${profile.full_name || 'Studio Principal'}`],
      [`Generated: ${new Date().toISOString()}`, `Currency: ${profile.currency || 'USD'}`],
      [],
      ['=== INVOICES RECORD ==='],
      ['Invoice #', 'Client', 'Project Title', 'Issue Date', 'Due Date', 'Status', 'Subtotal', 'Tax Rate %', 'Tax Amount', 'Total Amount', 'Revisions Included', 'Revisions Used'],
      ...invoices.map((inv) => [
        inv.invoice_number,
        getClientById(inv.client_id)?.company_name || 'Direct Client',
        inv.project_title,
        inv.issue_date,
        inv.due_date,
        inv.status,
        inv.subtotal.toFixed(2),
        inv.tax_rate.toFixed(1),
        (inv.tax_amount || 0).toFixed(2),
        inv.total_amount.toFixed(2),
        inv.revisions_included,
        inv.revisions_used,
      ]),
      [],
      ['=== GENERAL CASH FLOW & EXPENSES LEDGER ==='],
      ['Transaction ID', 'Date', 'Type', 'Category', 'Description / Payee', 'Payment Method', 'Amount', 'Has Receipt'],
      ...transactions.map((t) => [
        t.id,
        t.date,
        t.type.toUpperCase(),
        t.category,
        `"${t.description.replace(/"/g, '""')}"`,
        t.payment_method || 'Credit Card',
        t.amount.toFixed(2),
        t.receipt_url ? 'YES' : 'NO',
      ]),
      [],
      ['=== AUDIT SUMMARY ==='],
      ['Total Paid Client Billings', `$${totalIncomePaid.toFixed(2)}`],
      ['Total Tax Collected', `$${totalTaxCollected.toFixed(2)}`],
      ['Total Operating Expenses', `$${totalExpenses.toFixed(2)}`],
      ['Net Studio Profit', `$${netProfit.toFixed(2)}`],
      ['Expense Ratio', `${expenseRatio}%`],
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ClearBooks_Studio_Tax_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice('Spreadsheet downloaded successfully!');
    setTimeout(() => setExportNotice(null), 3000);
  };

  // Line Chart Geometry helpers
  const chartHeight = 160;
  const chartWidth = 600;
  const padding = 35;
  const data = monthlyProfit;
  const maxVal = Math.max(...data.map(d => Math.max(d.income, d.expense))) * 1.15 || 10000;

  const pointsIncome = data.map((d, index) => {
    const x = padding + (index / (data.length - 1)) * (chartWidth - padding * 2);
    const y = chartHeight - padding - (d.income / maxVal) * (chartHeight - padding * 2);
    return { x, y, val: d.income, month: d.month };
  });

  const pointsExpense = data.map((d, index) => {
    const x = padding + (index / (data.length - 1)) * (chartWidth - padding * 2);
    const y = chartHeight - padding - (d.expense / maxVal) * (chartHeight - padding * 2);
    return { x, y, val: d.expense, month: d.month };
  });

  const incomePath = pointsIncome.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
  const expensePath = pointsExpense.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header with Export Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
              Financial Reporting Engine
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              TAX & ACCOUNTING READY
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time tax liabilities, profit allocations, and CPA export spreadsheets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {exportNotice && (
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1 animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {exportNotice}
            </span>
          )}

          <button
            onClick={handleExportCsv}
            className="px-4 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-cyan-500/20 active:scale-[0.98] cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export to CSV</span>
          </button>
        </div>
      </div>

      {/* Summary Cards: Monthly Net Profit, Total Tax Collected, Expense Ratio */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Card 1: Monthly Net Profit */}
        <div className="glass-card p-5 space-y-2 border-l-2 border-l-cyan-400">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Current Month Net Profit
            </span>
            <DollarSign className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-mono font-bold text-cyan-300">
            ${monthlyNetProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400">
            Income after subtracting operating software & overhead
          </div>
        </div>

        {/* Card 2: Total Tax Collected */}
        <div className="glass-card p-5 space-y-2 border-l-2 border-l-amber-400">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Total Tax Collected (Sales / GST)
            </span>
            <Shield className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-mono font-bold text-amber-300">
            ${totalTaxCollected.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400">
            Remittance reserve for tax authorities (IRS / HMRC)
          </div>
        </div>

        {/* Card 3: Expense Ratio */}
        <div className="glass-card p-5 space-y-2 border-l-2 border-l-indigo-400">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Studio Expense Ratio
            </span>
            <Percent className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-mono font-bold text-indigo-300">
            {expenseRatio}%
          </div>
          <div className="text-[11px] text-slate-400">
            ${totalExpenses.toLocaleString()} overhead vs ${totalIncomePaid.toLocaleString()} income
          </div>
        </div>

      </div>

      {/* Visuals: Income vs Expense Line Chart */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
          <div className="space-y-0.5">
            <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Income vs Expense Trajectory (Annual Ledger)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Interactive dual-trend line comparing settled client receivables against creative software and studio costs.
            </p>
          </div>

          {/* Chart Legend */}
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-3 h-1 bg-cyan-400 rounded-full" />
              <span className="text-slate-200">Gross Income</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-1 bg-rose-400 rounded-full" />
              <span className="text-slate-400">Studio Expenses</span>
            </div>
          </div>
        </div>

        {/* SVG Line Chart */}
        <div className="w-full overflow-x-auto pt-2">
          <div className="min-w-[550px] relative">
            <svg 
              viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
              className="w-full h-44 overflow-visible"
            >
              <defs>
                <linearGradient id="incomeGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              {[0.25, 0.5, 0.75, 1].map((ratio) => {
                const y = chartHeight - padding - ratio * (chartHeight - padding * 2);
                return (
                  <g key={ratio}>
                    <line
                      x1={padding}
                      y1={y}
                      x2={chartWidth - padding}
                      y2={y}
                      stroke="rgba(255,255,255,0.06)"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={padding - 6}
                      y={y + 3}
                      fill="#64748b"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="end"
                    >
                      ${Math.round((ratio * maxVal) / 1000)}k
                    </text>
                  </g>
                );
              })}

              {/* Paths */}
              <path
                d={incomePath}
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <path
                d={expensePath}
                fill="none"
                stroke="#f43f5e"
                strokeWidth="2"
                strokeDasharray="4 3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points & labels */}
              {pointsIncome.map((p, i) => (
                <g key={`inc-${i}`} className="group cursor-pointer">
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="4"
                    fill="#020617"
                    stroke="#06b6d4"
                    strokeWidth="2"
                    className="hover:r-6 transition-all"
                  />
                  <text
                    x={p.x}
                    y={chartHeight - 12}
                    fill="#94a3b8"
                    fontSize="10"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {p.month}
                  </text>
                  <text
                    x={p.x}
                    y={p.y - 8}
                    fill="#06b6d4"
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                    className="opacity-80 group-hover:opacity-100 font-semibold"
                  >
                    ${(p.val / 1000).toFixed(1)}k
                  </text>
                </g>
              ))}

              {pointsExpense.map((p, i) => (
                <circle
                  key={`exp-${i}`}
                  cx={p.x}
                  cy={p.y}
                  r="3.5"
                  fill="#020617"
                  stroke="#f43f5e"
                  strokeWidth="2"
                />
              ))}
            </svg>
          </div>
        </div>
      </div>

      {/* Monthly Breakdown Table */}
      <div className="glass-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <span>Monthly P&L Audit Statement</span>
          </h3>
          <span className="text-[11px] font-mono text-slate-400">
            6-Month Trailing View
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-mono text-[11px]">
                <th className="py-2.5 px-3">Period</th>
                <th className="py-2.5 px-3 text-right">Client Income</th>
                <th className="py-2.5 px-3 text-right">Software & Overhead</th>
                <th className="py-2.5 px-3 text-right">Net Studio Retained</th>
                <th className="py-2.5 px-3 text-right">Profit Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {monthlyProfit.map((m) => {
                const net = m.income - m.expense;
                const margin = Math.round((net / m.income) * 100);
                return (
                  <tr key={m.month} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3 text-white font-bold">{m.month} 2026</td>
                    <td className="py-3 px-3 text-right text-emerald-400 font-semibold">
                      +${m.income.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-400">
                      -${m.expense.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right text-cyan-300 font-bold">
                      +${net.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-300">
                      {margin}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
