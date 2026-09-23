import React, { useRef } from 'react';
import { 
  X, 
  Printer, 
  ShieldCheck, 
  Building, 
  CreditCard,
  QrCode
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';

export default function InvoicePdfModal() {
  const { pdfInvoice, setPdfInvoice, getClientById, profile } = useStudio();
  const printRef = useRef<HTMLDivElement>(null);

  if (!pdfInvoice) return null;

  const client = getClientById(pdfInvoice.client_id);
  const currencySymbol = 
    pdfInvoice.currency === 'USD' ? '$' : 
    pdfInvoice.currency === 'EUR' ? '€' : 
    pdfInvoice.currency === 'INR' ? '₹' : 
    pdfInvoice.currency === 'GBP' ? '£' : 
    pdfInvoice.currency;

  const brandColor = profile.brand_color || '#06b6d4';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 print:p-0 print:static">
      {/* Backdrop (hidden during print) */}
      <div 
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity print:hidden"
        onClick={() => setPdfInvoice(null)} 
      />

      {/* Main Modal Container */}
      <div className="relative w-full max-w-4xl glass-card border border-white/20 bg-slate-950/95 shadow-2xl shadow-cyan-950/60 z-10 max-h-[95vh] flex flex-col print:max-h-none print:shadow-none print:border-none print:bg-white print:text-black">
        
        {/* Top Control Bar (Hidden on Print) */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span 
              className="text-xs font-mono uppercase tracking-wider font-semibold"
              style={{ color: brandColor }}
            >
              STUDIO BRANDED PDF RENDER
            </span>
            <span className="text-xs text-slate-400">
              • {pdfInvoice.invoice_number}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              style={{ backgroundColor: brandColor }}
              className="px-3.5 py-1.5 rounded-lg text-slate-950 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-[0.98]"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save to PDF</span>
            </button>
            <button
              onClick={() => setPdfInvoice(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            THE PRINTABLE PDF CANVAS
           ========================================================================= */}
        <div 
          ref={printRef}
          className="flex-1 overflow-y-auto p-8 sm:p-12 space-y-8 bg-slate-900 text-slate-100 print:bg-white print:text-slate-900 print:p-8"
        >
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-white/15 print:border-slate-300">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                {profile.logo_url && (
                  <img 
                    src={profile.logo_url} 
                    alt="Studio Logo" 
                    className="w-10 h-10 rounded-lg object-cover border border-white/20"
                  />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold tracking-tight text-white print:text-slate-900">
                      {profile.studio_name || 'Obsidian Grade Lab'}
                    </span>
                    <span 
                      className="w-2.5 h-2.5 rounded-full print:hidden" 
                      style={{ backgroundColor: brandColor }} 
                    />
                  </div>
                  <p className="text-xs text-slate-400 print:text-slate-600 font-sans">
                    Finishing, Color Grading & Master Timelines
                  </p>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 print:text-slate-600 font-mono pt-1 space-y-0.5">
                <div>{profile.billing_address || '742 Evergreen Studio Blvd, Suite 400'}</div>
                <div>{profile.city || 'Los Angeles'}, {profile.state || 'CA'} {profile.postal_code || '90028'} · {profile.country || 'USA'}</div>
                <div>Tax/GSTIN: <span className="text-slate-300 print:text-slate-800">{profile.gstin || 'US-CA-94016-TX'}</span></div>
              </div>
            </div>

            <div className="text-left sm:text-right space-y-2">
              <div 
                className="text-xs font-mono uppercase tracking-widest font-bold"
                style={{ color: brandColor }}
              >
                COMMERCIAL INVOICE
              </div>
              <div className="text-xl font-mono font-bold text-white print:text-slate-900">
                {pdfInvoice.invoice_number}
              </div>
              <div className="text-xs font-mono text-slate-400 print:text-slate-600 space-y-0.5">
                <div>Issue Date: <strong className="text-white print:text-slate-900">{pdfInvoice.issue_date}</strong></div>
                <div>Payment Due: <strong style={{ color: brandColor }}>{pdfInvoice.due_date}</strong></div>
                <div>Status: <span className="uppercase font-semibold">{pdfInvoice.status}</span></div>
              </div>
            </div>
          </div>

          {/* Client Info & REVISION GUARD BADGE ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
            
            {/* Client Details */}
            <div className="space-y-1 text-xs">
              <div className="font-mono uppercase tracking-wider text-slate-400 print:text-slate-500 text-[10px]">
                BILLED TO CLIENT
              </div>
              <div className="text-base font-bold text-white print:text-slate-900">
                {client?.company_name || 'Production Agency'}
              </div>
              <div className="text-slate-300 print:text-slate-700">Attn: {client?.name || 'Production Office'}</div>
              <div className="text-slate-400 print:text-slate-600">{client?.billing_address}</div>
              <div className="text-slate-400 print:text-slate-600">{client?.city}, {client?.state} {client?.postal_code}</div>
              <div className="text-[11px] font-mono text-slate-400 print:text-slate-600 pt-1">
                Client Tax/GSTIN: {client?.gstin || 'N/A'}
              </div>
            </div>

            {/* SPECIFIC REQUIREMENT: REVISION GUARD BADGE */}
            <div className="sm:text-right space-y-2">
              <div className="font-mono uppercase tracking-wider text-slate-400 print:text-slate-500 text-[10px]">
                SCOPE ALLOCATION
              </div>
              
              <div 
                className="inline-flex flex-col sm:items-end p-3 rounded-lg border text-left sm:text-right"
                style={{
                  backgroundColor: `${brandColor}12`,
                  borderColor: `${brandColor}40`,
                }}
              >
                <div 
                  className="flex items-center gap-1.5 text-xs font-mono font-bold"
                  style={{ color: brandColor }}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>REVISION GUARD: {pdfInvoice.revisions_used} / {pdfInvoice.revisions_included} ROUNDS USED</span>
                </div>
                <div className="text-[10px] text-slate-400 print:text-slate-600 font-mono mt-1">
                  Contractual Scope: {pdfInvoice.revisions_included} revisions included with master cut
                </div>
                {pdfInvoice.revisions_used >= pdfInvoice.revisions_included && (
                  <div className="text-[10px] text-amber-400 print:text-amber-700 font-mono font-semibold mt-0.5">
                    ● Scope Cap Reached: Extra rounds billed at overtime rate
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Project Deliverables Table */}
          <div className="space-y-2">
            <div className="font-mono uppercase tracking-wider text-slate-400 print:text-slate-500 text-[10px]">
              PROJECT DELIVERABLE BREAKDOWN
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/20 print:border-slate-300 text-slate-400 print:text-slate-600 font-mono">
                    <th className="py-2.5 px-2">Deliverable Description</th>
                    <th className="py-2.5 px-2 text-center w-16">Qty</th>
                    <th className="py-2.5 px-2 text-right w-28">Rate</th>
                    <th className="py-2.5 px-2 text-right w-32">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 print:divide-slate-200">
                  {pdfInvoice.line_items.map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td className="py-3 px-2">
                        <div className="font-semibold text-white print:text-slate-900">
                          {item.description}
                        </div>
                        {idx === 0 && (
                          <div className="text-[11px] text-slate-400 print:text-slate-600 font-sans">
                            Project: {pdfInvoice.project_title}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-2 text-center font-mono text-slate-300 print:text-slate-700">
                        {item.quantity}
                      </td>
                      <td className="py-3 px-2 text-right font-mono text-slate-300 print:text-slate-700 tabular-nums">
                        {currencySymbol}{item.rate.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-2 text-right font-mono text-white print:text-slate-900 font-semibold tabular-nums">
                        {currencySymbol}{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Totals */}
            <div className="pt-4 border-t border-white/20 print:border-slate-300 flex flex-col items-end space-y-1.5 text-xs font-mono">
              <div className="flex justify-between w-64 text-slate-400 print:text-slate-600">
                <span>Subtotal:</span>
                <span className="text-slate-200 print:text-slate-900 tabular-nums">
                  {currencySymbol}{pdfInvoice.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between w-64 text-slate-400 print:text-slate-600">
                <span>{pdfInvoice.tax_type} ({pdfInvoice.tax_rate}%):</span>
                <span className="text-slate-200 print:text-slate-900 tabular-nums">
                  {currencySymbol}{pdfInvoice.tax_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between w-64 pt-2 border-t border-white/20 print:border-slate-400 text-sm font-bold text-white print:text-slate-900">
                <span style={{ color: brandColor }}>Total Due:</span>
                <span style={{ color: brandColor }} className="text-lg tabular-nums">
                  {currencySymbol}{pdfInvoice.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* SPECIFIC REQUIREMENT: PAYMENT INSTRUCTIONS FOOTER */}
          <div className="pt-6 border-t border-white/20 print:border-slate-300 grid grid-cols-1 sm:grid-cols-12 gap-6 text-xs font-mono">
            
            {/* Remittance Wire Details */}
            <div className="sm:col-span-8 p-4 rounded-lg bg-slate-950/80 border border-white/10 print:bg-slate-50 print:border-slate-300 space-y-2">
              <div 
                className="font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5"
                style={{ color: brandColor }}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>OFFICIAL PAYMENT INSTRUCTIONS & REMITTANCE</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 print:text-slate-700">
                <div>
                  <span className="text-slate-500">Bank Name:</span> J.P. Morgan Chase N.A.
                </div>
                <div>
                  <span className="text-slate-500">Routing / ABA:</span> 021000021
                </div>
                <div>
                  <span className="text-slate-500">Account Number:</span> 8492-3108-9401
                </div>
                <div>
                  <span className="text-slate-500">SWIFT / BIC:</span> CHASUS33XXX
                </div>
              </div>

              <div className="text-[10px] text-slate-400 print:text-slate-600 pt-1 border-t border-white/5 print:border-slate-200">
                Please include invoice reference <strong className="text-white print:text-slate-900">{pdfInvoice.invoice_number}</strong> on wire advice or remittance check.
              </div>
            </div>

            {/* Verification / Security Stamp */}
            <div className="sm:col-span-4 p-4 rounded-lg bg-slate-950/80 border border-white/10 print:bg-slate-50 print:border-slate-300 flex flex-col justify-between space-y-2 text-center">
              <div className="text-[10px] text-slate-400 print:text-slate-600 uppercase">
                DIGITAL STUDIO SEAL
              </div>
              <div 
                className="w-12 h-12 mx-auto rounded border flex items-center justify-center"
                style={{ 
                  backgroundColor: `${brandColor}15`,
                  borderColor: `${brandColor}40`,
                  color: brandColor
                }}
              >
                <QrCode className="w-7 h-7" />
              </div>
              <div className="text-[9px] text-slate-500 font-mono">
                SECURE AUTH: 0x9F41E
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
