import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  FileText, 
  Calendar, 
  ShieldCheck, 
  DollarSign, 
  Check, 
  Sparkles, 
  Eye,
  AlertCircle,
  Loader2,
  Sliders
} from 'lucide-react';
import { toast } from 'sonner';
import { useStudio } from '../../context/StudioContext';
import { InvoiceLineItem } from '../../db/types';
import { notifyError } from '../../utils/errorHandler';
import ConsoleParameterSlider from '../common/ConsoleParameterSlider';
import ConsoleToggle from '../common/ConsoleToggle';

export default function CreateInvoiceModal() {
  const { 
    isCreateInvoiceOpen, 
    setIsCreateInvoiceOpen, 
    clients, 
    addInvoice, 
    addClient,
    profile, 
    setPdfInvoice,
    preselectedClientId,
    setPreselectedClientId
  } = useStudio();

  // Form State
  const [clientId, setClientId] = useState(preselectedClientId || clients[0]?.id || '');
  const [projectTitle, setProjectTitle] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState(`OGL-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + (profile.default_payment_terms_days || 14));
    return d.toISOString().split('T')[0];
  });
  const [currency, setCurrency] = useState(profile.currency || 'USD');
  const [status, setStatus] = useState<'Draft' | 'Sent'>('Sent');

  // Loading & Submitting State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingPdf, setIsSubmittingPdf] = useState(false);

  // Form Validation Errors State
  const [errors, setErrors] = useState<{
    clientId?: string;
    projectTitle?: string;
    invoiceNumber?: string;
    issueDate?: string;
    dueDate?: string;
    lineItems?: string;
    lineItemErrors?: { [key: string]: { description?: string; quantity?: string; rate?: string } };
    revisionsIncluded?: string;
    revisionsUsed?: string;
    taxRate?: string;
    quickCompanyName?: string;
    quickClientEmail?: string;
  }>({});

  // Inline Quick Add Client state
  const [isQuickAddingClient, setIsQuickAddingClient] = useState(false);
  const [quickCompanyName, setQuickCompanyName] = useState('');
  const [quickClientName, setQuickClientName] = useState('');
  const [quickClientEmail, setQuickClientEmail] = useState('');

  const validateQuickClient = (): boolean => {
    const errs: { quickCompanyName?: string; quickClientEmail?: string } = {};
    if (!quickCompanyName.trim()) {
      errs.quickCompanyName = 'Company or studio name is mandatory.';
    }
    if (quickClientEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(quickClientEmail.trim())) {
      errs.quickClientEmail = 'Please provide a valid email format (e.g. name@domain.com).';
    }
    setErrors(prev => ({ ...prev, ...errs }));
    return Object.keys(errs).length === 0;
  };

  const handleQuickAddClient = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateQuickClient()) {
      toast.error('Client Details Incomplete', {
        description: 'Please correct the highlighted client fields before proceeding.',
      });
      return;
    }

    try {
      const generatedEmail = quickClientEmail.trim() || `accounting@${quickCompanyName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'studio'}.com`;
      const newClient = addClient({
        name: quickClientName.trim() || 'Executive Producer',
        company_name: quickCompanyName.trim(),
        email: generatedEmail,
        phone: '+1 (555) 019-2831',
        billing_address: 'Studio Lot B, Suite 400',
        currency: currency || 'USD',
        gstin: 'US-TAX-892110',
        city: 'Los Angeles',
        state: 'CA',
        postal_code: '90028',
        country: 'USA',
        notes: 'Active studio account'
      });

      setClientId(newClient.id);
      setIsQuickAddingClient(false);
      setQuickCompanyName('');
      setQuickClientName('');
      setQuickClientEmail('');
      setErrors(prev => {
        const next = { ...prev };
        delete next.clientId;
        delete next.quickCompanyName;
        delete next.quickClientEmail;
        return next;
      });

      toast.success('Client Saved!', {
        description: `${newClient.company_name} is now selected for this invoice.`,
      });
    } catch (err) {
      notifyError(err, 'register client');
    }
  };

  const handleQuickSampleClient = () => {
    try {
      const sample = addClient({
        name: 'Sarah Connor',
        company_name: 'A24 Post Productions',
        email: 'post-super@a24films.com',
        phone: '+1 (310) 555-0144',
        billing_address: '31 W 27th St, 11th Floor',
        currency: 'USD',
        gstin: 'US-EIN-45-998201',
        city: 'New York',
        state: 'NY',
        postal_code: '10001',
        country: 'USA',
        notes: 'A24 film division'
      });
      setClientId(sample.id);
      setErrors(prev => {
        const next = { ...prev };
        delete next.clientId;
        return next;
      });
      toast.success('Client Loaded!', {
        description: 'A24 Post Productions selected.',
      });
    } catch (err) {
      notifyError(err, 'load sample client');
    }
  };

  React.useEffect(() => {
    if (isCreateInvoiceOpen) {
      if (preselectedClientId) {
        setClientId(preselectedClientId);
      } else if (!clientId && clients.length > 0) {
        setClientId(clients[0].id);
      }
    }
  }, [isCreateInvoiceOpen, preselectedClientId, clients, clientId]);

  // Specific Feature: Revision Guard
  const [revisionsIncluded, setRevisionsIncluded] = useState(2);
  const [revisionsUsed, setRevisionsUsed] = useState(0);

  // Line items state
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([
    {
      id: 'item_1',
      description: 'Master 4K Color Grade & Conform (Feature / Spot)',
      quantity: 1,
      rate: 3800,
      amount: 3800,
    },
    {
      id: 'item_2',
      description: 'DCI-P3 Theatrical Master + Rec.709 Web Pass',
      quantity: 1,
      rate: 950,
      amount: 950,
    },
  ]);

  // Tax rates
  const [taxType, setTaxType] = useState(profile.default_tax_type || 'Sales Tax');
  const [taxRate, setTaxRate] = useState(profile.default_tax_rate || 8.5);
  const [notes, setNotes] = useState('Payment due within 14 days of final conform delivery. Extra revisions beyond scope billed at standard hourly rates.');

  if (!isCreateInvoiceOpen) return null;

  // Real-time calculation: Subtotal → Tax → Total
  const subtotal = lineItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const taxAmount = (subtotal * Math.max(0, Number(taxRate) || 0)) / 100;
  const totalAmount = subtotal + taxAmount;

  // Line item manipulation with instant validation cleanup
  const updateLineItem = (index: number, field: keyof InvoiceLineItem, value: any) => {
    setLineItems(prev => {
      const updated = [...prev];
      const item = { ...updated[index] };

      if (field === 'quantity') {
        const numVal = value === '' ? 0 : Number(value);
        item.quantity = isNaN(numVal) ? 0 : Math.max(0, numVal);
        item.amount = item.quantity * item.rate;
      } else if (field === 'rate') {
        const numVal = value === '' ? 0 : Number(value);
        item.rate = isNaN(numVal) ? 0 : Math.max(0, numVal);
        item.amount = item.quantity * item.rate;
      } else if (field === 'description') {
        item.description = String(value);
      }

      updated[index] = item;
      return updated;
    });

    // Clear item specific error if corrected
    setErrors(prev => {
      if (!prev.lineItemErrors) return prev;
      const itemId = lineItems[index]?.id;
      if (!itemId || !prev.lineItemErrors[itemId]) return prev;
      const currentItemErrors = { ...prev.lineItemErrors[itemId] };
      delete (currentItemErrors as any)[field];
      return {
        ...prev,
        lineItemErrors: {
          ...prev.lineItemErrors,
          [itemId]: currentItemErrors,
        },
      };
    });
  };

  const addLineItem = () => {
    setLineItems(prev => [
      ...prev,
      {
        id: `item_${Date.now()}`,
        description: '',
        quantity: 1,
        rate: 0,
        amount: 0,
      },
    ]);
  };

  const removeLineItem = (index: number) => {
    if (lineItems.length > 1) {
      setLineItems(prev => prev.filter((_, i) => i !== index));
    } else {
      toast.error('Cannot Remove Last Item', {
        description: 'An invoice requires at least one billable line item.',
      });
    }
  };

  /**
   * Comprehensive validation rules for Invoice Form
   */
  const validateInvoiceForm = (): boolean => {
    const newErrors: typeof errors = {};

    // 1. Client selection
    if (!clientId) {
      newErrors.clientId = 'Please select a client from your roster or use Quick Add.';
    }

    // 2. Project Title
    if (!projectTitle.trim()) {
      newErrors.projectTitle = 'Project / Timeline title is mandatory.';
    }

    // 3. Invoice Number
    if (!invoiceNumber.trim()) {
      newErrors.invoiceNumber = 'Invoice identifier is required.';
    }

    // 4. Dates
    if (!issueDate) {
      newErrors.issueDate = 'Issue date is mandatory.';
    }
    if (!dueDate) {
      newErrors.dueDate = 'Due date is mandatory.';
    } else if (issueDate && dueDate < issueDate) {
      newErrors.dueDate = 'Due date cannot precede the invoice issue date.';
    }

    // 5. Revision Guard non-negative checks
    if (isNaN(Number(revisionsIncluded)) || Number(revisionsIncluded) < 0) {
      newErrors.revisionsIncluded = 'Revisions included cannot be negative.';
    }
    if (isNaN(Number(revisionsUsed)) || Number(revisionsUsed) < 0) {
      newErrors.revisionsUsed = 'Revisions used cannot be negative.';
    }

    // 6. Tax Rate
    const numTax = Number(taxRate);
    if (isNaN(numTax) || numTax < 0) {
      newErrors.taxRate = 'Tax rate cannot be negative.';
    } else if (numTax > 100) {
      newErrors.taxRate = 'Tax rate cannot exceed 100%.';
    }

    // 7. Line items validation
    if (!lineItems || lineItems.length === 0) {
      newErrors.lineItems = 'At least one line item deliverable is required.';
    } else {
      const itemErrors: { [key: string]: { description?: string; quantity?: string; rate?: string } } = {};
      let hasItemError = false;

      lineItems.forEach((item) => {
        const curr: { description?: string; quantity?: string; rate?: string } = {};
        if (!item.description.trim()) {
          curr.description = 'Deliverable description is required.';
          hasItemError = true;
        }
        if (isNaN(item.quantity) || item.quantity <= 0) {
          curr.quantity = 'Quantity must be at least 1.';
          hasItemError = true;
        }
        if (isNaN(item.rate) || item.rate < 0) {
          curr.rate = 'Rate cannot be negative.';
          hasItemError = true;
        }
        if (Object.keys(curr).length > 0) {
          itemErrors[item.id] = curr;
        }
      });

      if (hasItemError) {
        newErrors.lineItemErrors = itemErrors;
        newErrors.lineItems = 'Please resolve errors in the highlighted line items above.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent, previewPdf = false) => {
    e.preventDefault();

    if (!validateInvoiceForm()) {
      toast.error('Form Validation Incomplete', {
        description: 'Please correct the highlighted fields before saving.',
      });
      return;
    }

    const selectedClient = clients.find(c => c.id === clientId);

    if (previewPdf) {
      setIsSubmittingPdf(true);
    } else {
      setIsSubmitting(true);
    }

    try {
      // Simulate realistic Supabase query & safe persistence with async response
      await new Promise(resolve => setTimeout(resolve, 550));

      const newInv = addInvoice({
        user_id: profile.id,
        client_id: clientId,
        invoice_number: invoiceNumber.trim(),
        project_title: projectTitle.trim(),
        status: status,
        issue_date: issueDate,
        due_date: dueDate,
        subtotal,
        tax_type: taxType,
        tax_rate: Math.max(0, Number(taxRate) || 0),
        tax_amount: taxAmount,
        total_amount: totalAmount,
        amount: totalAmount,
        currency,
        revisions_included: Math.max(0, Number(revisionsIncluded)),
        revisions_used: Math.max(0, Number(revisionsUsed)),
        line_items: lineItems,
        notes: notes.trim(),
        paid_at: null,
      });

      toast.success('Invoice Created Successfully!', {
        description: `Invoice #${newInv.invoice_number} for ${selectedClient?.company_name || 'Client'} has been recorded in your ledger.`,
      });

      setIsCreateInvoiceOpen(false);
      if (previewPdf) {
        setPdfInvoice(newInv);
      }
    } catch (err) {
      notifyError(err, 'record this invoice in Supabase');
    } finally {
      setIsSubmitting(false);
      setIsSubmittingPdf(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={() => !isSubmitting && !isSubmittingPdf && setIsCreateInvoiceOpen(false)} 
      />

      {/* Modal Container with Recessed Hardware Console Shell */}
      <div className="relative w-full max-w-4xl console-module bg-[#090b10] border border-white/20 p-5 md:p-7 shadow-[0_0_50px_rgba(0,0,0,0.9)] z-10 max-h-[92vh] flex flex-col space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#00ffff]/10 border border-[#00ffff]/30 flex items-center justify-center text-[#00ffff]">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold tracking-wider text-white heading-manual">
                  Engage Commercial Invoice
                </h3>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#00ffff]/10 text-[#00ffff] border border-[#00ffff]/30 font-bold uppercase tracking-widest">
                  CALIBRATED
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400">
                Revision Guard Scope Lock & Live SMPTE Commercial PDF Generator.
              </p>
            </div>
          </div>

          <button
            onClick={() => !isSubmitting && !isSubmittingPdf && setIsCreateInvoiceOpen(false)}
            disabled={isSubmitting || isSubmittingPdf}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form 
          id="invoice-create-form" 
          onSubmit={(e) => handleSubmit(e, false)} 
          className="flex-1 overflow-y-auto space-y-6 pr-1.5"
        >
          {/* Top Meta: Client, Project Title, Invoice #, Dates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Client Selector & Quick Add */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300">
                  Client / Production Agency <span className="text-rose-400">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsQuickAddingClient(!isQuickAddingClient)}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>{isQuickAddingClient ? 'Select Existing' : 'Quick Add'}</span>
                </button>
              </div>

              {isQuickAddingClient ? (
                <div className="p-3 rounded-lg bg-slate-900/90 border border-cyan-500/30 space-y-2 text-xs">
                  <div>
                    <input
                      type="text"
                      placeholder="Company name (e.g. Netflix, Paramount)"
                      value={quickCompanyName}
                      onChange={(e) => {
                        setQuickCompanyName(e.target.value);
                        if (errors.quickCompanyName) setErrors(prev => ({ ...prev, quickCompanyName: undefined }));
                      }}
                      className={`w-full px-2.5 py-1.5 rounded bg-slate-950 border ${
                        errors.quickCompanyName ? 'border-rose-500/80 ring-1 ring-rose-500/30' : 'border-white/10'
                      } text-white placeholder-slate-500 text-xs outline-none focus:border-cyan-400`}
                      autoFocus
                    />
                    {errors.quickCompanyName && (
                      <p className="text-rose-400 text-[10px] font-mono mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{errors.quickCompanyName}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        placeholder="Billing email"
                        value={quickClientEmail}
                        onChange={(e) => {
                          setQuickClientEmail(e.target.value);
                          if (errors.quickClientEmail) setErrors(prev => ({ ...prev, quickClientEmail: undefined }));
                        }}
                        className={`flex-1 px-2.5 py-1.5 rounded bg-slate-950 border ${
                          errors.quickClientEmail ? 'border-rose-500/80 ring-1 ring-rose-500/30' : 'border-white/10'
                        } text-white placeholder-slate-500 text-xs outline-none focus:border-cyan-400`}
                      />
                      <button
                        type="button"
                        onClick={() => handleQuickAddClient()}
                        className="px-3 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer transition-all shrink-0"
                      >
                        Save Client
                      </button>
                    </div>
                    {errors.quickClientEmail && (
                      <p className="text-rose-400 text-[10px] font-mono mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{errors.quickClientEmail}</span>
                      </p>
                    )}
                  </div>
                </div>
              ) : clients.length === 0 ? (
                <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 space-y-2">
                  <div className="text-[11px] text-cyan-300 font-mono">No registered clients yet</div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsQuickAddingClient(true)}
                      className="px-2.5 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add New Client</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleQuickSampleClient}
                      className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/15 text-white font-mono text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      <span>Use "A24 Post"</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <select
                    value={clientId}
                    onChange={(e) => {
                      setClientId(e.target.value);
                      if (errors.clientId) setErrors(prev => ({ ...prev, clientId: undefined }));
                    }}
                    className={`w-full px-3 py-2.5 rounded-lg bg-slate-900 border ${
                      errors.clientId ? 'border-rose-500/80 ring-1 ring-rose-500/30' : 'border-white/10'
                    } focus:border-cyan-400 text-xs text-white outline-none font-sans cursor-pointer`}
                  >
                    <option value="" disabled>-- Select Client --</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.company_name} ({c.name})
                      </option>
                    ))}
                  </select>
                  {errors.clientId && (
                    <p className="text-rose-400 text-[11px] font-mono mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.clientId}</span>
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Project Title */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Project / Timeline Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={projectTitle}
                onChange={(e) => {
                  setProjectTitle(e.target.value);
                  if (errors.projectTitle) setErrors(prev => ({ ...prev, projectTitle: undefined }));
                }}
                placeholder="e.g. Netflix Series S02 - Episode 204 Color Grade"
                className={`w-full px-3 py-2.5 rounded-lg bg-slate-900 border ${
                  errors.projectTitle ? 'border-rose-500/80 ring-1 ring-rose-500/30' : 'border-white/10'
                } focus:border-cyan-400 text-xs text-white outline-none font-sans`}
              />
              {errors.projectTitle && (
                <p className="text-rose-400 text-[11px] font-mono mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{errors.projectTitle}</span>
                </p>
              )}
            </div>

            {/* Invoice Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Invoice Number <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => {
                  setInvoiceNumber(e.target.value);
                  if (errors.invoiceNumber) setErrors(prev => ({ ...prev, invoiceNumber: undefined }));
                }}
                className={`w-full px-3 py-2 rounded-lg bg-slate-900 border ${
                  errors.invoiceNumber ? 'border-rose-500/80 ring-1 ring-rose-500/30' : 'border-white/10'
                } focus:border-cyan-400 text-xs text-white font-mono outline-none`}
              />
              {errors.invoiceNumber && (
                <p className="text-rose-400 text-[11px] font-mono mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{errors.invoiceNumber}</span>
                </p>
              )}
            </div>

            {/* Issue Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Issue Date <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => {
                  setIssueDate(e.target.value);
                  if (errors.issueDate) setErrors(prev => ({ ...prev, issueDate: undefined }));
                }}
                className={`w-full px-3 py-2 rounded-lg bg-slate-900 border ${
                  errors.issueDate ? 'border-rose-500/80 ring-1 ring-rose-500/30' : 'border-white/10'
                } focus:border-cyan-400 text-xs text-white font-mono outline-none`}
              />
              {errors.issueDate && (
                <p className="text-rose-400 text-[11px] font-mono mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{errors.issueDate}</span>
                </p>
              )}
            </div>

            {/* Due Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Due Date <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => {
                  setDueDate(e.target.value);
                  if (errors.dueDate) setErrors(prev => ({ ...prev, dueDate: undefined }));
                }}
                className={`w-full px-3 py-2 rounded-lg bg-slate-900 border ${
                  errors.dueDate ? 'border-rose-500/80 ring-1 ring-rose-500/30' : 'border-white/10'
                } focus:border-cyan-400 text-xs text-white font-mono outline-none`}
              />
              {errors.dueDate && (
                <p className="text-rose-400 text-[11px] font-mono mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{errors.dueDate}</span>
                </p>
              )}
            </div>

          </div>

          {/* =========================================================
              FEATURE: REVISION GUARD (Tactile Sliders)
             ========================================================= */}
          <div className="console-module p-3.5 space-y-3 border-l-2 border-l-[#00ffff]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#00ffff]" />
                <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                  Revision Guard Scope Calibrator
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#00ffff] bg-[#00ffff]/10 px-1.5 py-0.5 rounded border border-[#00ffff]/30">
                LOCKED CONTRACT SCOPE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ConsoleParameterSlider
                label="Contractual Revisions Included"
                value={revisionsIncluded}
                min={0}
                max={5}
                step={1}
                unit="passes"
                onChange={(val) => {
                  setRevisionsIncluded(val);
                  if (errors.revisionsIncluded) setErrors(prev => ({ ...prev, revisionsIncluded: undefined }));
                }}
              />

              <ConsoleParameterSlider
                label="Revisions Used (Director Passes)"
                value={revisionsUsed}
                min={0}
                max={10}
                step={1}
                unit="passes"
                onChange={(val) => {
                  setRevisionsUsed(val);
                  if (errors.revisionsUsed) setErrors(prev => ({ ...prev, revisionsUsed: undefined }));
                }}
              />
            </div>

            {revisionsUsed >= revisionsIncluded && revisionsIncluded > 0 && (
              <div className="text-[10px] text-amber-300 font-mono flex items-center gap-1.5 pt-1 border-t border-amber-500/20">
                <span>⚠️ Scope cap reached ({revisionsUsed}/{revisionsIncluded}). Extra revisions will bill as contractual overage.</span>
              </div>
            )}
          </div>

          {/* Line Items Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                Deliverables & Services <span className="text-rose-400">*</span>
              </span>
              <button
                type="button"
                onClick={addLineItem}
                className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-cyan-300 text-xs font-mono flex items-center gap-1 cursor-pointer transition-colors border border-white/5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Deliverable Line</span>
              </button>
            </div>

            {errors.lineItems && (
              <p className="text-rose-400 text-[11px] font-mono p-2 rounded bg-rose-500/10 border border-rose-500/20 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.lineItems}</span>
              </p>
            )}

            <div className="space-y-2">
              {lineItems.map((item, index) => {
                const itemErr = errors.lineItemErrors?.[item.id];
                return (
                  <div key={item.id} className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      {/* Description */}
                      <input
                        type="text"
                        placeholder="Deliverable description (e.g. Conform, Baselight Grade)"
                        value={item.description}
                        onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                        className={`flex-1 px-3 py-2 rounded-lg bg-slate-900 border ${
                          itemErr?.description ? 'border-rose-500/80 ring-1 ring-rose-500/30' : 'border-white/10'
                        } text-white text-xs outline-none focus:border-cyan-400`}
                      />

                      {/* Quantity */}
                      <div className="w-20">
                        <input
                          type="number"
                          min="1"
                          step="1"
                          placeholder="Qty"
                          value={item.quantity || ''}
                          onChange={(e) => updateLineItem(index, 'quantity', e.target.value)}
                          className={`w-full px-2 py-2 rounded-lg bg-slate-900 border ${
                            itemErr?.quantity ? 'border-rose-500/80 ring-1 ring-rose-500/30' : 'border-white/10'
                          } text-white text-xs font-mono text-center outline-none focus:border-cyan-400`}
                        />
                      </div>

                      {/* Rate */}
                      <div className="w-28 relative">
                        <span className="absolute left-2.5 top-2 text-slate-500 font-mono">$</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="Rate"
                          value={item.rate || ''}
                          onChange={(e) => updateLineItem(index, 'rate', e.target.value)}
                          className={`w-full pl-6 pr-2 py-2 rounded-lg bg-slate-900 border ${
                            itemErr?.rate ? 'border-rose-500/80 ring-1 ring-rose-500/30' : 'border-white/10'
                          } text-white text-xs font-mono text-right outline-none focus:border-cyan-400`}
                        />
                      </div>

                      {/* Amount */}
                      <div className="w-28 py-2 px-3 rounded-lg bg-slate-900/50 border border-white/5 font-mono text-right text-slate-200">
                        ${(item.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => removeLineItem(index)}
                        className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Remove deliverable"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Individual line item errors */}
                    {(itemErr?.description || itemErr?.quantity || itemErr?.rate) && (
                      <div className="flex items-center gap-4 px-2 text-[10px] font-mono text-rose-400">
                        {itemErr.description && <span>• {itemErr.description}</span>}
                        {itemErr.quantity && <span>• {itemErr.quantity}</span>}
                        {itemErr.rate && <span>• {itemErr.rate}</span>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Grid: Notes & Financial Calculation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-white/10">
            
            {/* Notes / Terms */}
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Payment Instructions / Production Terms</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Terms, bank account details, wire instructions..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white text-xs outline-none focus:border-cyan-400"
                />
              </div>

              {/* Tax configuration */}
              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Tax Type:</span>
                  <input
                    type="text"
                    value={taxType}
                    onChange={(e) => setTaxType(e.target.value)}
                    className="w-24 px-2 py-1 rounded bg-slate-950 border border-white/10 text-white font-mono text-xs"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Tax Rate:</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={taxRate}
                    onChange={(e) => {
                      const val = Math.max(0, Number(e.target.value));
                      setTaxRate(val);
                      if (errors.taxRate) setErrors(prev => ({ ...prev, taxRate: undefined }));
                    }}
                    className={`w-16 px-2 py-1 rounded bg-slate-950 border ${
                      errors.taxRate ? 'border-rose-500/80 ring-1 ring-rose-500/30' : 'border-white/10'
                    } text-white font-mono text-xs text-right`}
                  />
                  <span className="text-slate-400 font-mono">%</span>
                </div>
              </div>
              {errors.taxRate && (
                <p className="text-rose-400 text-[11px] font-mono flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{errors.taxRate}</span>
                </p>
              )}
            </div>

            {/* Calculation summary block */}
            <div className="space-y-2 font-mono text-xs text-right">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal:</span>
                <span className="text-slate-200 tabular-nums">
                  ${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tax ({taxRate}%):</span>
                <span className="text-slate-200 tabular-nums">
                  ${taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between text-base font-bold text-white">
                <span className="text-cyan-400">Total Due:</span>
                <span className="text-cyan-400 font-mono text-xl tabular-nums">
                  ${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

          </div>

        </form>

        {/* Actions Footer with Loading Indicators */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3 font-mono">
          <button
            type="button"
            disabled={isSubmitting || isSubmittingPdf}
            onClick={() => setIsCreateInvoiceOpen(false)}
            className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-white bg-transparent hover:bg-white/5 rounded transition-colors cursor-pointer disabled:opacity-50 uppercase"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              disabled={isSubmitting || isSubmittingPdf}
              onClick={(e) => handleSubmit(e, true)}
              className="px-3.5 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 uppercase"
            >
              {isSubmittingPdf ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#00ffff]" />
                  <span>Compiling PDF...</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 text-[#00ffff]" />
                  <span>Preview PDF</span>
                </>
              )}
            </button>

            <button
              type="submit"
              form="invoice-create-form"
              disabled={isSubmitting || isSubmittingPdf}
              className="electric-glow-btn px-4 py-1.5 rounded text-xs font-bold uppercase flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-950" />
                  <span>Recording...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Engage Invoice</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
