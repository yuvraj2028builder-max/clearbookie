import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Send, 
  Sparkles, 
  AlertCircle, 
  ShieldAlert, 
  CheckCheck,
  Mail,
  Building,
  Radio
} from 'lucide-react';
import { toast } from 'sonner';
import { useStudio } from '../../context/StudioContext';

export default function PaymentNudgeModal() {
  const { nudgeInvoice, setNudgeInvoice, getClientById, profile } = useStudio();
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);

  if (!nudgeInvoice) return null;

  const client = getClientById(nudgeInvoice.client_id);
  const clientName = client?.name || 'Producer';
  const companyName = client?.company_name || 'Production House';
  const clientEmail = client?.email || 'accounts@client.com';
  const invoiceNum = nudgeInvoice.invoice_number;
  const projectTitle = nudgeInvoice.project_title;
  const amountStr = `${nudgeInvoice.currency} ${nudgeInvoice.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const dueDateStr = nudgeInvoice.due_date;
  const studioName = profile.studio_name || 'ClearBooks Color Lab';
  const freelancerName = profile.full_name || 'Senior Colorist';

  // 3 Professionally Calibrated Templates for Post-Production Colorists
  const templates = [
    {
      id: 'gentle',
      name: 'Stage 1: Respectful Schedule Sync',
      tag: 'T+3 to T+7 Days',
      tone: 'Courteous & Commercial',
      accent: 'border-[#00ffff]/40 text-[#00ffff] bg-[#00ffff]/10',
      subject: `Commercial Follow-up: Invoice ${invoiceNum} for ${projectTitle}`,
      body: `Hi ${clientName},

Hope you're having a productive week!

Just circling back regarding Invoice ${invoiceNum} for "${projectTitle}" (${amountStr}), which was due on ${dueDateStr}.

I know post-production schedules get hectic around delivery deadlines. Could you please check with your accounts payable team to confirm this has been scheduled for settlement?

Let me know if you need any additional W-9 forms, bank details, or purchase order references.

Best regards,
${freelancerName}
${studioName}`,
    },
    {
      id: 'firm',
      name: 'Stage 2: Firm Remittance Update',
      tag: 'T+8 to T+14 Days',
      tone: 'Direct & Timeline-Bound',
      accent: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
      subject: `Action Required: Past Due Invoice ${invoiceNum} (${amountStr}) - ${projectTitle}`,
      body: `Hi ${clientName},

I am following up on Invoice ${invoiceNum} for "${projectTitle}" in the amount of ${amountStr}, which is now past due (due date: ${dueDateStr}).

All final master conform files, LUT packages, and exports were delivered and accepted for this timeline. Please provide an immediate update on the disbursement date or wire reference.

If your accounting department requires a specific remittance portal or direct wire information, please reply so we can ensure prompt settlement.

Thank you for your prompt attention to this matter.

Sincerely,
${freelancerName}
${studioName}`,
    },
    {
      id: 'final',
      name: 'Stage 3: Formal Hold & Scope Freeze',
      tag: 'T+15+ Days / Scope Lock',
      tone: 'Assertive & Project Hold',
      accent: 'border-[#ff2a5f]/50 text-[#ff2a5f] bg-[#ff2a5f]/10',
      subject: `FINAL NOTICE: Overdue Payment for ${invoiceNum} - Pipeline Hold Notice`,
      body: `Dear ${clientName} and ${companyName} Accounts Payable,

This is a formal notice that Invoice ${invoiceNum} (${amountStr}) for "${projectTitle}" is significantly past due as of ${dueDateStr}.

Despite previous reminders, this balance remains outstanding. Please be advised that in accordance with standard studio terms:
1. Additional project revisions, conform renders, and upcoming pipeline bookings are placed on hold pending payment clearance.
2. Standard contractual late fees may be applied if not resolved within 48 business hours.

Please process wire payment immediately using the invoice instructions. Kindly send confirmation of transfer to this email.

Regards,
${freelancerName}
${studioName}`,
    },
  ];

  const handleCopy = (templateId: string, text: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedTemplate(templateId);
      toast.success('Signal Transmitted to Clipboard!', {
        description: 'Formatted email ready to paste into your mail client.',
      });
      setTimeout(() => setCopiedTemplate(null), 2500);
    } catch {
      toast.error('Copy Failed', {
        description: 'Please manually copy the email text.',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={() => setNudgeInvoice(null)} 
      />

      {/* Modal Card with Studio Console Shell */}
      <div className="relative w-full max-w-3xl console-module bg-[#090b10] border border-white/20 p-5 md:p-7 shadow-[0_0_50px_rgba(0,0,0,0.95)] z-10 max-h-[90vh] flex flex-col space-y-4">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-white/10 font-mono">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-950/40 border border-[#ff2a5f]/40 text-[#ff2a5f] text-[10px] signal-pulse-red font-bold">
              <Radio className="w-3 h-3" />
              <span>DISPATCH NUDGE SIGNAL</span>
            </div>
            <h3 className="text-lg font-bold tracking-wider text-white heading-manual">
              Payment Nudge // {companyName}
            </h3>
            <p className="text-[11px] text-slate-400">
              Clip <span className="text-[#00ffff] font-bold">{invoiceNum}</span> • Arrears:{' '}
              <span className="text-[#ff2a5f] font-bold">{amountStr}</span> • Net Due:{' '}
              <span className="text-slate-200">{dueDateStr}</span>
            </p>
          </div>

          <button
            onClick={() => setNudgeInvoice(null)}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Professionally Written Templates */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 font-mono">
          {templates.map((tpl) => {
            const isCopied = copiedTemplate === tpl.id;
            const fullContent = `Subject: ${tpl.subject}\n\n${tpl.body}`;

            return (
              <div
                key={tpl.id}
                className="console-bay p-3.5 space-y-2.5 transition-all"
              >
                {/* Template metadata & Copy button */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      {tpl.name}
                    </span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${tpl.accent}`}>
                      {tpl.tag}
                    </span>
                    <span className="text-[10px] text-slate-400 hidden sm:inline">
                      • {tpl.tone}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopy(tpl.id, fullContent)}
                    className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase rounded bg-[#00ffff]/10 hover:bg-[#00ffff]/20 border border-[#00ffff]/30 text-[#00ffff] transition-all cursor-pointer"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3 h-3 text-[#00ff9d]" />
                        <span className="text-[#00ff9d]">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-[#00ffff]" />
                        <span>Copy Draft</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Subject preview */}
                <div className="p-1.5 rounded bg-[#040508] border border-white/5 text-[11px] text-[#00ffff]">
                  <span className="text-slate-400">SUBJECT: </span>
                  {tpl.subject}
                </div>

                {/* Body pre */}
                <pre className="p-2.5 rounded bg-[#040508] border border-white/5 font-sans text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {tpl.body}
                </pre>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5 text-[11px]">
            <Mail className="w-3 h-3 text-[#00ffff]" />
            Remittance Recipient: <strong className="text-slate-200">{clientEmail}</strong>
          </span>
          <button
            onClick={() => setNudgeInvoice(null)}
            className="px-3 py-1 text-[11px] uppercase rounded bg-slate-900 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
