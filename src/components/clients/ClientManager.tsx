import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle2, 
  Star, 
  ShieldAlert, 
  ArrowUpRight, 
  Receipt, 
  X,
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  Sparkles,
  RotateCcw,
  AlertCircle,
  Loader2,
  Trash2,
  Radio,
  Sliders,
  Film,
  Disc3
} from 'lucide-react';
import { toast } from 'sonner';
import { useStudio } from '../../context/StudioContext';
import { Client } from '../../db/types';
import EmptyState from '../common/EmptyState';
import { notifyError } from '../../utils/errorHandler';
import ConsoleWaveform from '../common/ConsoleWaveform';

export default function ClientManager() {
  const { 
    clients, 
    addClient, 
    invoices, 
    getClientFinancials, 
    bestClient, 
    problematicClient,
    setIsCreateInvoiceOpen,
    setPreselectedClientId,
    setActiveTab,
    deleteClient,
    isAddClientModalOpen,
    setIsAddClientModalOpen,
    resetToDemoData
  } = useStudio();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Sync with context modal controller
  useEffect(() => {
    if (isAddClientModalOpen) {
      setIsAddModalOpen(true);
      setIsAddClientModalOpen(false);
    }
  }, [isAddClientModalOpen, setIsAddClientModalOpen]);

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'owed' | 'clear'>('all');

  // New Client Form fields
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('USA');
  const [gstin, setGstin] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [notes, setNotes] = useState('');

  // Loading & Validation state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    companyName?: string;
    email?: string;
    phone?: string;
  }>({});

  // Filtering
  const filteredClients = clients.filter(c => {
    const matchesSearch = 
      c.company_name.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.city && c.city.toLowerCase().includes(search.toLowerCase()));

    const { balanceOwed } = getClientFinancials(c.id);
    if (filterType === 'owed') return matchesSearch && balanceOwed > 0;
    if (filterType === 'clear') return matchesSearch && balanceOwed === 0;
    return matchesSearch;
  });

  const handleCreateInvoiceForClient = (clientId: string) => {
    setPreselectedClientId(clientId);
    setIsCreateInvoiceOpen(true);
  };

  const validateClientForm = (): boolean => {
    const errs: typeof errors = {};

    if (!companyName.trim()) {
      errs.companyName = 'Studio / Client name is required.';
    }

    if (!email.trim()) {
      errs.email = 'Billing remittance email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please provide a valid email format (e.g. accounts@studio.com).';
    }

    if (phone.trim() && phone.trim().length < 7) {
      errs.phone = 'Please provide a valid telephone number.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateClientForm()) {
      toast.error('Validation Incomplete', {
        description: 'Please correct the highlighted fields before saving.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 450));

      const newClient = addClient({
        user_id: 'usr_studio_01',
        name: name.trim() || companyName.trim(),
        company_name: companyName.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        billing_address: billingAddress.trim() || 'Studio Stage 4',
        city: city.trim() || 'Los Angeles',
        state: state.trim() || 'CA',
        postal_code: postalCode.trim() || '90028',
        country: country.trim() || 'USA',
        gstin: gstin.trim() || null,
        currency,
        notes: notes.trim() || null,
      });

      toast.success('Patron Registered!', {
        description: `${newClient.company_name} is calibrated into your CRM roster.`,
      });

      setIsAddModalOpen(false);
      setName('');
      setCompanyName('');
      setEmail('');
      setPhone('');
      setBillingAddress('');
      setCity('');
      setState('');
      setPostalCode('');
      setGstin('');
      setNotes('');
      setErrors({});
    } catch (err) {
      notifyError(err, 'register client account');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClient = (clientId: string, clientName: string) => {
    try {
      deleteClient(clientId);
      toast.success('Account Removed', {
        description: `${clientName} was deleted from your client roster.`,
      });
    } catch (err) {
      notifyError(err, 'delete client');
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Top Console Command Bar */}
      <div className="console-module p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-[#00ffff] uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ffff] shadow-[0_0_8px_#00ffff]" />
            <span>CH-03 // STUDIO CLIENT ROSTER</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-300 font-mono">{clients.length} ACCOUNTS CALIBRATED</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-wider text-white heading-manual">
            Client Relationship CRM
          </h1>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="electric-glow-btn px-4 py-2 rounded text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>Register Patron</span>
        </button>
      </div>

      {/* Main Content: Empty State vs Client Data */}
      {clients.length === 0 ? (
        <EmptyState
          icon={Building}
          badge="CLIENT ROSTER EMPTY"
          title="No Studio Patrons Registered"
          description="Your client roster is clear. Register your direct directors, streaming production houses, or post agencies to begin tracking commercial accounts receivable, assigning custom currencies, and locking contractual revision allowances."
          primaryAction={{
            label: "Register Studio Client",
            onClick: () => setIsAddModalOpen(true),
            icon: Plus,
          }}
          secondaryAction={{
            label: "Load Major Studios (Netflix, A24, Sony)",
            onClick: resetToDemoData,
            icon: Sparkles,
          }}
          tips={[
            "Configure distinct commercial payment currencies (USD, EUR, GBP, CAD, INR).",
            "Record Tax / GSTIN / VAT identifiers for international broadcast remittances.",
            "Enforce revision cap alerts when production directors exceed agreed color passes."
          ]}
        />
      ) : (
        <>
          {/* Intelligence Bento Modules */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            
            {/* Top Patron Module */}
            <div className="console-module p-4 border-l-2 border-l-[#00ff9d] flex flex-col justify-between space-y-2">
              <div className="flex items-start justify-between">
                <div className="space-y-0.5">
                  <div className="text-[10px] font-mono text-[#00ff9d] font-bold uppercase tracking-wider flex items-center gap-1">
                    <Star className="w-3 h-3 fill-[#00ff9d]" />
                    <span>PREMIER STUDIO PATRON</span>
                  </div>
                  <h3 className="text-base font-bold text-white font-mono tracking-tight">
                    {bestClient ? bestClient.client.company_name : 'No Client Data'}
                  </h3>
                  <p className="text-[10px] font-mono text-slate-400">
                    {bestClient ? `Supervisor: ${bestClient.client.name}` : 'Bill patrons to rank yield'}
                  </p>
                </div>
                <div className="p-1.5 rounded bg-emerald-950/40 text-[#00ff9d] border border-[#00ff9d]/30">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 text-[10px]">TOTAL SETTLED:</span>
                <span className="font-bold text-[#00ff9d]">
                  ${bestClient ? bestClient.totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00'}
                </span>
              </div>

              {bestClient && (
                <button
                  onClick={() => handleCreateInvoiceForClient(bestClient.client.id)}
                  className="w-full py-1 rounded bg-[#00ff9d]/10 hover:bg-[#00ff9d]/20 text-[#00ff9d] border border-[#00ff9d]/30 text-[10px] font-mono font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer uppercase"
                >
                  <span>Bill Again</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Friction Watchlist Module */}
            <div className="console-module p-4 border-l-2 border-l-[#ff2a5f] flex flex-col justify-between space-y-2">
              <div className="flex items-start justify-between">
                <div className="space-y-0.5">
                  <div className="text-[10px] font-mono text-[#ff2a5f] font-bold uppercase tracking-wider flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" />
                    <span>FRICTION WATCHLIST</span>
                  </div>
                  <h3 className="text-base font-bold text-white font-mono tracking-tight">
                    {problematicClient ? problematicClient.client.company_name : 'Clean Accounts'}
                  </h3>
                  <p className="text-[10px] font-mono text-slate-400">
                    {problematicClient 
                      ? `${problematicClient.overdueCount} Overdue clip(s) awaiting wire`
                      : 'Zero delinquent accounts recorded'}
                  </p>
                </div>
                <div className="p-1.5 rounded bg-rose-950/40 text-[#ff2a5f] border border-[#ff2a5f]/30">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 text-[10px]">DELINQUENT ARREARS:</span>
                <span className="font-bold text-[#ff2a5f]">
                  ${problematicClient ? problematicClient.balanceOwed.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00'}
                </span>
              </div>

              {problematicClient && (
                <button
                  onClick={() => setActiveTab('invoices')}
                  className="w-full py-1 rounded bg-[#ff2a5f]/15 hover:bg-[#ff2a5f]/25 text-[#ff2a5f] border border-[#ff2a5f]/30 text-[10px] font-mono font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer uppercase signal-pulse-red"
                >
                  <span>Inspect Overdue Timeline</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Total Receivables Module */}
            <div className="console-module p-4 border-l-2 border-l-[#00ffff] flex flex-col justify-between space-y-2">
              <div className="flex items-start justify-between">
                <div className="space-y-0.5">
                  <div className="text-[10px] font-mono text-[#00ffff] font-bold uppercase tracking-wider">
                    TOTAL OUTSTANDING RECEIVABLES
                  </div>
                  <div className="text-xl font-bold font-mono text-white py-0.5">
                    ${clients.reduce((acc, c) => acc + getClientFinancials(c.id).balanceOwed, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                  <p className="text-[10px] font-mono text-slate-400">
                    Awaiting commercial remittance
                  </p>
                </div>
                <div className="p-1.5 rounded bg-cyan-950/40 text-[#00ffff] border border-[#00ffff]/30">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>IN ARREARS:</span>
                <span className="text-[#00ffff] font-bold">
                  {clients.filter(c => getClientFinancials(c.id).balanceOwed > 0).length} of {clients.length} ACCOUNTS
                </span>
              </div>
            </div>

          </div>

          {/* Search and Filters Bar */}
          <div className="console-module p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search clients by studio, contact, or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-4 py-1.5 rounded bg-[#06080d] border border-white/10 text-xs font-mono text-white placeholder-slate-400 focus:border-[#00ffff]/60 outline-none"
              />
            </div>

            <div className="flex items-center gap-1 text-[10px] font-mono">
              <button
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-1 rounded border transition-colors cursor-pointer uppercase ${
                  filterType === 'all'
                    ? 'bg-[#0f1724] text-[#00ffff] border-[#00ffff]/40 font-bold'
                    : 'text-slate-400 border-white/5 hover:text-white'
                }`}
              >
                All ({clients.length})
              </button>
              <button
                onClick={() => setFilterType('owed')}
                className={`px-2.5 py-1 rounded border transition-colors cursor-pointer uppercase ${
                  filterType === 'owed'
                    ? 'bg-rose-950/40 text-rose-300 border-rose-500/40 font-bold'
                    : 'text-slate-400 border-white/5 hover:text-white'
                }`}
              >
                Balance Owed ({clients.filter(c => getClientFinancials(c.id).balanceOwed > 0).length})
              </button>
              <button
                onClick={() => setFilterType('clear')}
                className={`px-2.5 py-1 rounded border transition-colors cursor-pointer uppercase ${
                  filterType === 'clear'
                    ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40 font-bold'
                    : 'text-slate-400 border-white/5 hover:text-white'
                }`}
              >
                Clear ({clients.filter(c => getClientFinancials(c.id).balanceOwed === 0).length})
              </button>
            </div>
          </div>

          {/* Bento Grid: Client Channel Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredClients.length === 0 ? (
              <div className="col-span-full">
                <EmptyState
                  icon={Search}
                  badge="SEARCH FILTER"
                  title="No clients match your filter"
                  description="No studio accounts match your filter criteria. Reset your search to view the full client roster."
                  primaryAction={{
                    label: "Reset Filter",
                    onClick: () => { setSearch(''); setFilterType('all'); },
                    icon: RotateCcw,
                  }}
                />
              </div>
            ) : (
              filteredClients.map((client) => {
                const { totalInvoiced, totalPaid, balanceOwed, hasOverdue, revisionsAlert } = getClientFinancials(client.id);
                const isBest = bestClient?.client.id === client.id;
                const isProblematic = problematicClient?.client.id === client.id;

                return (
                  <div 
                    key={client.id}
                    className={`console-module-interactive p-4 flex flex-col justify-between space-y-3 relative group border ${
                      hasOverdue ? 'border-[#ff2a5f]/60 bg-rose-950/10' : ''
                    }`}
                  >
                    {/* Top Identity Bay */}
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-sm font-bold text-white font-mono tracking-tight truncate group-hover:text-[#00ffff] transition-colors">
                              {client.company_name}
                            </h3>
                            {isBest && (
                              <span className="p-0.5 rounded bg-emerald-500/20 text-[#00ff9d]" title="Top Patron">
                                <Star className="w-3 h-3 fill-[#00ff9d]" />
                              </span>
                            )}
                            {isProblematic && (
                              <span className="p-0.5 rounded bg-rose-500/20 text-[#ff2a5f]" title="Delinquent">
                                <AlertTriangle className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            Attn: <span className="text-slate-200">{client.name}</span>
                          </div>
                        </div>

                        {/* Signal Status Pill */}
                        <span 
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider font-bold border ${
                            hasOverdue
                              ? 'bg-rose-950/40 text-[#ff2a5f] border-rose-500/40 signal-pulse-red'
                              : balanceOwed > 0
                              ? 'bg-amber-950/30 text-amber-300 border-amber-500/30'
                              : 'bg-emerald-950/30 text-[#00ff9d] border-emerald-500/30'
                          }`}
                        >
                          <span className={`w-1 h-1 rounded-full ${hasOverdue ? 'bg-[#ff2a5f]' : balanceOwed > 0 ? 'bg-amber-400' : 'bg-[#00ff9d]'}`} />
                          <span>{hasOverdue ? 'Overdue' : balanceOwed > 0 ? 'Pending' : 'Nominal'}</span>
                        </span>
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-0.5 text-[11px] font-mono text-slate-400">
                        <div className="flex items-center gap-1.5 truncate">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="text-slate-300 truncate">{client.email}</span>
                        </div>
                        {client.phone && (
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{client.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{client.city || 'Los Angeles'}, {client.state || 'CA'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Financial Ledger Bay */}
                    <div className="console-bay p-2.5 space-y-1.5 text-xs font-mono">
                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div>
                          <div className="text-slate-400 uppercase">INVOICED</div>
                          <div className="font-bold text-white">
                            ${totalInvoiced.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-400 uppercase">SETTLED</div>
                          <div className="font-bold text-[#00ff9d]">
                            ${totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </div>
                        </div>
                      </div>

                      <div className="pt-1.5 border-t border-white/5 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 text-[10px]">BALANCE OWED:</span>
                        <span className={`font-bold ${balanceOwed > 0 ? 'text-[#ff2a5f]' : 'text-slate-400'}`}>
                          ${balanceOwed.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </div>

                      {revisionsAlert && (
                        <div className="text-[9px] font-mono text-amber-400 flex items-center gap-1 pt-1 border-t border-amber-500/10">
                          <AlertTriangle className="w-2.5 h-2.5 shrink-0" />
                          <span>Revision threshold alert</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="pt-1 flex items-center gap-1.5">
                      <button
                        onClick={() => handleCreateInvoiceForClient(client.id)}
                        className="flex-1 py-1.5 px-2.5 rounded bg-[#00ffff]/10 hover:bg-[#00ffff]/20 text-[#00ffff] border border-[#00ffff]/30 text-[10px] font-mono font-bold flex items-center justify-center gap-1 transition-all cursor-pointer uppercase"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Bill Patron</span>
                      </button>
                      <button
                        onClick={() => handleDeleteClient(client.id, client.company_name)}
                        className="p-1.5 rounded bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-[#ff2a5f] border border-white/5 transition-colors cursor-pointer"
                        title="Delete Client"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {/* Add Client Modal with Studio Console Design */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
            onClick={() => !isSubmitting && setIsAddModalOpen(false)} 
          />
          <div className="relative w-full max-w-lg console-module bg-[#090b10] p-5 z-10 space-y-4 max-h-[90vh] overflow-y-auto border border-white/15 shadow-[0_0_40px_rgba(0,0,0,0.9)]">
            <div className="flex items-center justify-between pb-2.5 border-b border-white/10 font-mono">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-[#00ffff]" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Register Studio Client
                </h3>
              </div>
              <button 
                onClick={() => !isSubmitting && setIsAddModalOpen(false)}
                disabled={isSubmitting}
                className="text-slate-400 hover:text-white cursor-pointer disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium text-[11px]">
                    Studio / Client Name <span className="text-[#ff2a5f]">*</span>
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => {
                      setCompanyName(e.target.value);
                      if (errors.companyName) setErrors(prev => ({ ...prev, companyName: undefined }));
                    }}
                    placeholder="e.g. A24 Films / HBO"
                    className={`w-full px-3 py-1.5 rounded bg-[#050609] border ${
                      errors.companyName ? 'border-rose-500/80 ring-1 ring-rose-500/30' : 'border-white/10'
                    } text-white outline-none focus:border-[#00ffff]/60 font-mono`}
                  />
                  {errors.companyName && (
                    <p className="text-[#ff2a5f] text-[10px] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.companyName}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium text-[11px]">Contact Person Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Emily Watson (Post Sup)"
                    className="w-full px-3 py-1.5 rounded bg-[#050609] border border-white/10 text-white outline-none focus:border-[#00ffff]/60 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium text-[11px]">
                    Billing Email <span className="text-[#ff2a5f]">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                    }}
                    placeholder="billing@a24films.com"
                    className={`w-full px-3 py-1.5 rounded bg-[#050609] border ${
                      errors.email ? 'border-rose-500/80 ring-1 ring-rose-500/30' : 'border-white/10'
                    } text-white outline-none focus:border-[#00ffff]/60 font-mono`}
                  />
                  {errors.email && (
                    <p className="text-[#ff2a5f] text-[10px] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium text-[11px]">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors(prev => ({ ...prev, phone: undefined }));
                    }}
                    placeholder="+1 (310) 555-0199"
                    className={`w-full px-3 py-1.5 rounded bg-[#050609] border ${
                      errors.phone ? 'border-rose-500/80 ring-1 ring-rose-500/30' : 'border-white/10'
                    } text-white outline-none focus:border-[#00ffff]/60 font-mono`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium text-[11px]">Billing Address</label>
                <input
                  type="text"
                  value={billingAddress}
                  onChange={(e) => setBillingAddress(e.target.value)}
                  placeholder="31 W 27th St, 11th Floor"
                  className="w-full px-3 py-1.5 rounded bg-[#050609] border border-white/10 text-white outline-none focus:border-[#00ffff]/60 font-mono"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium text-[11px]">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="New York"
                    className="w-full px-3 py-1.5 rounded bg-[#050609] border border-white/10 text-white outline-none focus:border-[#00ffff]/60 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium text-[11px]">State / Region</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="NY"
                    className="w-full px-3 py-1.5 rounded bg-[#050609] border border-white/10 text-white outline-none focus:border-[#00ffff]/60 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium text-[11px]">Postal Code</label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="10001"
                    className="w-full px-3 py-1.5 rounded bg-[#050609] border border-white/10 text-white outline-none focus:border-[#00ffff]/60 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium text-[11px]">GSTIN / VAT / EIN</label>
                  <input
                    type="text"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    placeholder="US-EIN-99201"
                    className="w-full px-3 py-1.5 rounded bg-[#050609] border border-white/10 text-white outline-none focus:border-[#00ffff]/60 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium text-[11px]">Billing Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3 py-1.5 rounded bg-[#050609] border border-white/10 text-white outline-none focus:border-[#00ffff]/60 font-mono"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="INR">INR (₹)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium text-[11px]">Internal Production Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Net 15 terms agreed with Post Producer. Deliver in ACEScc format."
                  rows={2}
                  className="w-full px-3 py-1.5 rounded bg-[#050609] border border-white/10 text-white outline-none focus:border-[#00ffff]/60 font-mono"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2 font-mono">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-[#050609] text-slate-400 hover:text-white transition-colors cursor-pointer uppercase text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="electric-glow-btn px-4 py-1.5 rounded text-xs font-bold uppercase cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-950" />
                      <span>Calibrating...</span>
                    </>
                  ) : (
                    <span>Register Patron</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
