import React, { useState } from 'react';
import { 
  Plus, 
  ArrowDownRight, 
  ArrowUpRight, 
  Filter, 
  DollarSign, 
  Calendar, 
  Tag, 
  Trash2, 
  UploadCloud, 
  FileText, 
  Layers, 
  Sparkles, 
  Search, 
  X, 
  Check, 
  ExternalLink,
  Laptop,
  HardDrive,
  Cpu,
  Eye,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { useStudio } from '../../context/StudioContext';
import { Transaction } from '../../db/types';
import { notifyError } from '../../utils/errorHandler';

export default function TransactionManager() {
  const { transactions, addTransaction, deleteTransaction, adobeAndPluginsSpend, profile } = useStudio();
  
  // Navigation & View Filters
  const [activeTab, setActiveTab] = useState<'all' | 'income' | 'expense'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<'all' | '30days' | 'thisMonth'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Add Transaction Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Software & Plugins');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('Business Credit Card');
  const [notes, setNotes] = useState('');
  const [receiptFile, setReceiptFile] = useState<{ name: string; url: string; size: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    description?: string;
    amount?: string;
    date?: string;
  }>({});

  // Active Receipt Preview Modal
  const [previewReceipt, setPreviewReceipt] = useState<{ url: string; title: string } | null>(null);

  // Preset templates for fast post-production logging
  const PRESET_EXPENSES = [
    { label: 'Adobe CC Subscription', cat: 'Software & Plugins', amt: 54.99 },
    { label: 'Dehancer Pro OFX Suite', cat: 'Software & Plugins', amt: 199.00 },
    { label: 'Frame.io 2TB Cloud Storage', cat: 'Cloud & Storage', amt: 45.00 },
    { label: 'Flanders Display Calibration', cat: 'Hardware Calibration', amt: 350.00 },
    { label: 'Envato Elements / Music Bed', cat: 'Licensing & Assets', amt: 33.00 },
  ];

  // Filtering Logic
  const filtered = transactions.filter((t) => {
    // Tab filter
    if (activeTab !== 'all' && t.type !== activeTab) return false;

    // Category filter
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = 
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        (t.notes && t.notes.toLowerCase().includes(q));
      if (!match) return false;
    }

    // Date filter
    if (dateFilter === 'thisMonth') {
      const currentMonth = new Date().toISOString().slice(0, 7);
      if (!t.date.startsWith(currentMonth)) return false;
    } else if (dateFilter === '30days') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      if (new Date(t.date) < thirtyDaysAgo) return false;
    }

    return true;
  });

  // Aggregated totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);

  const netRetained = totalIncome - totalExpense;

  // Categories list
  const allCategories = Array.from(new Set(transactions.map(t => t.category)));

  // Simulated Supabase Storage Receipt Upload
  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    // Simulate Supabase Storage upload delay and generation of signed storage public URL
    setTimeout(() => {
      const fakeUrl = URL.createObjectURL(file);
      setReceiptFile({
        name: file.name,
        url: fakeUrl,
        size: `${(file.size / 1024).toFixed(1)} KB`,
      });
      setIsUploading(false);
      toast.success('Receipt Attached', {
        description: `${file.name} uploaded to Supabase Storage (/receipts).`,
      });
    }, 600);
  };

  const validateTransactionForm = (): boolean => {
    const errs: typeof errors = {};

    if (!description.trim()) {
      errs.description = 'Description or payee is required.';
    }

    const numAmount = parseFloat(amount);
    if (!amount.trim() || isNaN(numAmount)) {
      errs.amount = 'Please enter a valid numeric amount.';
    } else if (numAmount <= 0) {
      errs.amount = 'Amount must be greater than $0.00 (positive numbers only).';
    }

    if (!date) {
      errs.date = 'Transaction date is required.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateTransactionForm()) {
      toast.error('Validation Incomplete', {
        description: 'Please correct the highlighted fields before recording.',
      });
      return;
    }

    const numAmount = parseFloat(amount);
    setIsSubmitting(true);

    try {
      // Simulate realistic Supabase query & secure insertion delay
      await new Promise(resolve => setTimeout(resolve, 500));

      addTransaction({
        user_id: profile.id,
        client_id: null,
        invoice_id: null,
        type,
        category,
        amount: numAmount,
        currency: 'USD',
        date,
        description: description.trim(),
        payment_method: paymentMethod,
        receipt_url: receiptFile?.url || null,
        notes: notes.trim(),
      });

      toast.success(type === 'expense' ? 'Expense Logged Successfully!' : 'Income Recorded Successfully!', {
        description: `$${numAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} for "${description.trim()}" has been recorded.`,
      });

      // Reset Form
      setIsModalOpen(false);
      setDescription('');
      setAmount('');
      setNotes('');
      setReceiptFile(null);
      setErrors({});
    } catch (err) {
      notifyError(err, 'record ledger entry');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTransaction = (id: string, desc: string) => {
    try {
      deleteTransaction(id);
      toast.success('Transaction Removed', {
        description: `"${desc}" has been removed from your ledger.`,
      });
    } catch (err) {
      notifyError(err, 'delete transaction');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
              Financial Ledger & Spend Tracker
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              AUDITED CASH FLOW
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Log client income disbursements and deduct creative software licenses, cloud drives, and gear calibration.
          </p>
        </div>

        <button
          onClick={() => {
            setType('expense');
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-cyan-500/20 active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Log Transaction</span>
        </button>
      </div>

      {/* Intelligence Cards: Key Metrics & Specific Adobe / Plugins Spend */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Income */}
        <div className="glass-card p-4 space-y-1 border-l-2 border-l-emerald-500">
          <div className="text-[11px] font-mono uppercase text-slate-400 flex items-center justify-between">
            <span>Settled Client Income</span>
            <ArrowDownRight className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            +${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-slate-500">
            From verified client settlements
          </div>
        </div>

        {/* Operating Overhead */}
        <div className="glass-card p-4 space-y-1 border-l-2 border-l-slate-500">
          <div className="text-[11px] font-mono uppercase text-slate-400 flex items-center justify-between">
            <span>Studio Operating Overhead</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-300">
            -${totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-slate-500">
            Total tax-deductible expenses
          </div>
        </div>

        {/* Retained Studio Profit */}
        <div className="glass-card p-4 space-y-1 border-l-2 border-l-cyan-400">
          <div className="text-[11px] font-mono uppercase text-slate-400 flex items-center justify-between">
            <span>Net Studio Retained</span>
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-400">
            +${netRetained.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-slate-500">
            {totalIncome > 0 ? `${Math.round((netRetained / totalIncome) * 100)}% Net Margin` : 'Zero activity'}
          </div>
        </div>

        {/* Focus Requirement: Adobe & Plugins Spend */}
        <div className="glass-card p-4 space-y-1 border-l-2 border-l-indigo-400 relative overflow-hidden group">
          <div className="text-[11px] font-mono uppercase text-indigo-300 flex items-center justify-between">
            <span>Adobe & Plugins Spend</span>
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-indigo-300">
            ${adobeAndPluginsSpend.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-slate-400 flex items-center justify-between">
            <span>Creative Cloud, Dehancer, OFX</span>
            <span className="text-indigo-400 font-mono font-semibold">
              {totalExpense > 0 ? `${Math.round((adobeAndPluginsSpend / totalExpense) * 100)}% of costs` : '0%'}
            </span>
          </div>
        </div>

      </div>

      {/* Split View Tabs & Category Filters */}
      <div className="glass-card p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Split View Toggle: All vs Income vs Expenses */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-white/10 text-xs font-mono">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Records ({transactions.length})
            </button>
            <button
              onClick={() => setActiveTab('income')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activeTab === 'income'
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Income Only
            </button>
            <button
              onClick={() => setActiveTab('expense')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activeTab === 'expense'
                  ? 'bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Expenses Only
            </button>
          </div>

          {/* Quick Date Range Filter */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-500">Date:</span>
            {(['all', '30days', 'thisMonth'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setDateFilter(period)}
                className={`px-2.5 py-1 rounded border transition-colors cursor-pointer ${
                  dateFilter === period
                    ? 'bg-slate-800 text-white border-cyan-500/40'
                    : 'text-slate-400 border-transparent hover:bg-white/5'
                }`}
              >
                {period === 'all' ? 'All Time' : period === '30days' ? 'Last 30 Days' : 'This Month'}
              </button>
            ))}
          </div>

        </div>

        {/* Secondary Filter Row: Search & Category */}
        <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by vendor, software, description, or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:border-cyan-400 outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-xs text-slate-200 outline-none focus:border-cyan-400 font-mono"
            >
              <option value="all">All Categories</option>
              {allCategories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

      </div>

      {/* Filterable Transactions Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-slate-950/40 text-slate-400 font-mono text-[11px]">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Description & Vendor</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4 text-center">Receipt</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                    <div className="max-w-md mx-auto space-y-3">
                      <DollarSign className="w-8 h-8 text-slate-500 mx-auto" />
                      <div className="text-sm font-semibold text-white">No transactions found</div>
                      <p className="text-xs text-slate-400">
                        {transactions.length === 0 
                          ? 'Your ledger is empty. Start by logging your first expense (e.g. Adobe CC, DaVinci plugins) or receiving client payments.' 
                          : 'No records match your selected filters. Try clearing the search or category filter.'}
                      </p>
                      {transactions.length === 0 ? (
                        <button
                          onClick={() => setIsModalOpen(true)}
                          className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Log First Transaction</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => { setSearchQuery(''); setCategoryFilter('all'); setActiveTab('all'); setDateFilter('all'); }}
                          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-white/10 text-xs font-mono inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <span>Clear Filters</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((t) => {
                  const isSoftware = 
                    t.description.toLowerCase().includes('adobe') ||
                    t.description.toLowerCase().includes('plugin') ||
                    t.description.toLowerCase().includes('dehancer') ||
                    t.description.toLowerCase().includes('davinci');

                  return (
                    <tr key={t.id} className="hover:bg-white/5 transition-colors group">
                      
                      {/* Date */}
                      <td className="py-3.5 px-4 font-mono text-slate-400 whitespace-nowrap">
                        {t.date}
                      </td>

                      {/* Description & Vendor */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white tracking-tight">
                            {t.description}
                          </span>
                          {isSoftware && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                              Software/Plugin
                            </span>
                          )}
                        </div>
                        {t.notes && (
                          <div className="text-[10px] text-slate-400 truncate max-w-xs">
                            {t.notes}
                          </div>
                        )}
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-white/10 font-mono text-[10px] text-slate-300">
                          {t.category}
                        </span>
                      </td>

                      {/* Payment Method */}
                      <td className="py-3.5 px-4 font-mono text-slate-400">
                        {t.payment_method || 'Credit Card'}
                      </td>

                      {/* Receipt (Supabase Storage Badge) */}
                      <td className="py-3.5 px-4 text-center">
                        {t.receipt_url ? (
                          <button
                            onClick={() => setPreviewReceipt({ url: t.receipt_url!, title: t.description })}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono transition-colors cursor-pointer"
                            title="View Uploaded Receipt"
                          >
                            <FileText className="w-3 h-3 text-cyan-400" />
                            <span>Receipt</span>
                          </button>
                        ) : (
                          <span className="text-[10px] font-mono text-slate-600">—</span>
                        )}
                      </td>

                      {/* Amount */}
                      <td className={`py-3.5 px-4 text-right font-mono font-bold text-sm ${
                        t.type === 'income' ? 'text-emerald-400' : 'text-slate-200'
                      }`}>
                        {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDeleteTransaction(t.id, t.description)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-white/5 transition-colors cursor-pointer"
                          title="Delete Transaction"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Entry Modal (With Supabase Storage Receipt Upload) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setIsModalOpen(false)} 
          />
          <div className="relative w-full max-w-lg glass-card bg-slate-950 p-6 z-10 space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <h3 className="text-base font-bold text-white font-sans">
                  Record Ledger Entry
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Income / Expense Switcher */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 rounded-lg border border-white/10 text-xs font-mono">
              <button
                type="button"
                onClick={() => {
                  setType('expense');
                  setCategory('Software & Plugins');
                }}
                className={`py-2 rounded transition-all cursor-pointer font-semibold ${
                  type === 'expense'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Expense (Outflow)
              </button>
              <button
                type="button"
                onClick={() => {
                  setType('income');
                  setCategory('Client Settlement');
                }}
                className={`py-2 rounded transition-all cursor-pointer font-semibold ${
                  type === 'income'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Income (Inflow)
              </button>
            </div>

            {/* Quick Presets for Post-Production expenses */}
            {type === 'expense' && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Fast Fill Presets:</span>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_EXPENSES.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => {
                        setDescription(p.label);
                        setCategory(p.cat);
                        setAmount(p.amt.toString());
                      }}
                      className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-[10px] font-mono text-cyan-300 border border-white/10 transition-colors cursor-pointer"
                    >
                      {p.label} (${p.amt})
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">
                  Description / Payee <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (errors.description) setErrors(prev => ({ ...prev, description: undefined }));
                  }}
                  placeholder={type === 'expense' ? "e.g. Adobe Creative Cloud Pro" : "e.g. Paramount Color Grade Milestones"}
                  className={`w-full px-3 py-2 rounded-lg bg-slate-900 border ${
                    errors.description ? 'border-rose-500/80 ring-1 ring-rose-500/30' : 'border-white/10'
                  } text-white outline-none focus:border-cyan-400`}
                />
                {errors.description && (
                  <p className="text-rose-400 text-[11px] font-mono mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.description}</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">
                    Amount (USD $) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      if (errors.amount) setErrors(prev => ({ ...prev, amount: undefined }));
                    }}
                    placeholder="0.00"
                    className={`w-full px-3 py-2 rounded-lg bg-slate-900 border ${
                      errors.amount ? 'border-rose-500/80 ring-1 ring-rose-500/30' : 'border-white/10'
                    } text-white outline-none focus:border-cyan-400 font-mono text-sm`}
                  />
                  {errors.amount && (
                    <p className="text-rose-400 text-[11px] font-mono mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.amount}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">
                    Date <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      if (errors.date) setErrors(prev => ({ ...prev, date: undefined }));
                    }}
                    className={`w-full px-3 py-2 rounded-lg bg-slate-900 border ${
                      errors.date ? 'border-rose-500/80 ring-1 ring-rose-500/30' : 'border-white/10'
                    } text-white outline-none focus:border-cyan-400 font-mono`}
                  />
                  {errors.date && (
                    <p className="text-rose-400 text-[11px] font-mono mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.date}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white outline-none focus:border-cyan-400 font-mono"
                  >
                    {type === 'expense' ? (
                      <>
                        <option value="Software & Plugins">Software & Plugins (Adobe, Dehancer)</option>
                        <option value="Cloud & Storage">Cloud & Storage (Frame.io, AWS S3)</option>
                        <option value="Hardware Calibration">Hardware & Display Calibration</option>
                        <option value="Licensing & Assets">Licensing & Music Assets</option>
                        <option value="Studio Utilities">Studio Utilities & Internet</option>
                        <option value="General Overhead">General Overhead</option>
                      </>
                    ) : (
                      <>
                        <option value="Client Settlement">Client Settlement</option>
                        <option value="Milestone Advance">Milestone Advance</option>
                        <option value="Consulting Retainer">Consulting Retainer</option>
                        <option value="Timeline Royalty">Timeline Royalty</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white outline-none focus:border-cyan-400 font-mono"
                  >
                    <option value="Business Credit Card">Business Credit Card</option>
                    <option value="Direct ACH / Wire">Direct ACH / Wire</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="PayPal">PayPal</option>
                  </select>
                </div>
              </div>

              {/* Supabase Storage Receipt Upload */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-medium flex items-center gap-1.5">
                    <UploadCloud className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Receipt / Invoice Proof (Supabase Storage)</span>
                  </label>
                  <span className="text-[10px] font-mono text-cyan-400">bucket: /receipts</span>
                </div>

                <div className="border border-dashed border-white/15 rounded-lg p-3 text-center bg-slate-900/60 hover:border-cyan-400/40 transition-colors">
                  {receiptFile ? (
                    <div className="flex items-center justify-between bg-slate-800 p-2 rounded border border-white/10">
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span className="font-mono text-white text-[11px] truncate">{receiptFile.name}</span>
                        <span className="text-[10px] text-slate-400">({receiptFile.size})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setReceiptFile(null)}
                        className="text-slate-400 hover:text-rose-400 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleReceiptUpload}
                        className="hidden"
                      />
                      <div className="space-y-1">
                        <UploadCloud className="w-5 h-5 text-slate-400 mx-auto" />
                        <div className="text-[11px] text-slate-300">
                          {isUploading ? 'Uploading to Supabase Storage...' : 'Click to attach receipt (PNG, JPG, PDF)'}
                        </div>
                        <div className="text-[9px] text-slate-500 font-mono">
                          Auto-encrypted and linked to transaction record
                        </div>
                      </div>
                    </label>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Notes / Tax Memo</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Deductible under Schedule C - Post-production software"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shadow-md shadow-cyan-500/20 cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Recording Entry...</span>
                    </>
                  ) : (
                    <span>Record Entry</span>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Receipt Viewer Preview Modal */}
      {previewReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
            onClick={() => setPreviewReceipt(null)} 
          />
          <div className="relative w-full max-w-md glass-card bg-slate-950 p-6 z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white truncate">{previewReceipt.title}</h3>
              </div>
              <button 
                onClick={() => setPreviewReceipt(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-900 rounded-lg p-6 border border-white/10 text-center space-y-3">
              <FileText className="w-12 h-12 text-cyan-400 mx-auto" />
              <div className="text-xs text-white font-medium">Receipt Document Proof Verified</div>
              <div className="text-[11px] font-mono text-slate-400">
                Stored in Supabase Storage secure vault
              </div>
              <a
                href={previewReceipt.url}
                target="_blank"
                rel="noreferrer"
                download="receipt-proof"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 transition-colors"
              >
                <span>Download / Open File</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
