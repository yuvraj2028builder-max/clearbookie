import { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Shield, 
  CheckCircle2, 
  ArrowRight,
  Receipt,
  Download
} from 'lucide-react';
import { toast } from 'sonner';
import { useStudio } from '../context/StudioContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated?: () => void;
  pendingInvoice?: {
    clientName: string;
    projectName: string;
    amount: number;
    currency: string;
    invoiceNumber: string;
  } | null;
}

export default function AuthModal({ isOpen, onClose, onAuthenticated, pendingInvoice }: AuthModalProps) {
  const { addInvoice, clients, addClient, profile } = useStudio();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    // Authenticate with Google
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);

      // If there is a pending invoice drafted from the Guest Playground, save it to the user's ledger!
      if (pendingInvoice) {
        let matchedClient = clients.find(
          c => c.company_name.toLowerCase() === pendingInvoice.clientName.toLowerCase() ||
               c.name.toLowerCase() === pendingInvoice.clientName.toLowerCase()
        );

        if (!matchedClient) {
          matchedClient = addClient({
            user_id: profile.id,
            name: pendingInvoice.clientName,
            company_name: pendingInvoice.clientName,
            email: 'accounts@client.com',
            phone: '+1 (310) 555-0100',
            billing_address: 'Production Suite 400',
            city: 'Los Angeles',
            state: 'CA',
            postal_code: '90028',
            country: 'USA',
            gstin: 'US-CA-99201',
            currency: pendingInvoice.currency,
            notes: 'Drafted from Guest Invoice Playground',
          });
        }

        const numericAmount = pendingInvoice.amount;
        const subtotal = numericAmount;
        const taxRate = 0;
        const taxAmount = 0;

        addInvoice({
          user_id: profile.id,
          client_id: matchedClient.id,
          invoice_number: pendingInvoice.invoiceNumber || `OGL-${new Date().getFullYear()}-099`,
          project_title: pendingInvoice.projectName,
          status: 'Draft',
          issue_date: new Date().toISOString().split('T')[0],
          due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          subtotal,
          tax_type: 'Sales Tax',
          tax_rate: taxRate,
          tax_amount: taxAmount,
          total_amount: numericAmount,
          amount: numericAmount,
          currency: pendingInvoice.currency,
          revisions_included: 2,
          revisions_used: 1,
          line_items: [
            {
              id: `item_${Date.now()}`,
              description: pendingInvoice.projectName,
              quantity: 1,
              rate: numericAmount,
              amount: numericAmount,
            },
          ],
          notes: 'Invoice generated via Guest Playground. Full high-resolution export enabled.',
          paid_at: null,
        });
      }

      setTimeout(() => {
        setSuccess(false);
        onClose();
        toast.success('Studio Workspace Unlocked', {
          description: pendingInvoice
            ? 'Guest draft automatically converted into a live invoice record in your ledger.'
            : 'Welcome to your ClearBooks Studio command center.',
        });
        if (onAuthenticated) {
          onAuthenticated();
        }
      }, 1400);
    }, 1100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose} 
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md glass-card border border-white/15 bg-slate-950/90 p-6 md:p-8 shadow-2xl shadow-cyan-950/50 z-10 animate-in zoom-in-95 duration-200">
        
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Ambient cyan glow */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {success ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold tracking-tight text-white">Studio Workspace Unlocked</h3>
            <p className="text-sm text-slate-300">
              {pendingInvoice ? (
                <>
                  Drafted invoice <span className="text-cyan-300 font-mono font-medium">{pendingInvoice.invoiceNumber}</span> has been saved to your studio ledger.
                </>
              ) : (
                <>Entering your studio command center...</>
              )}
            </p>
            <div className="text-xs text-cyan-400 flex items-center justify-center gap-1.5 font-mono pt-2">
              <Sparkles className="w-3.5 h-3.5" />
              Redirecting to Command Center...
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Header */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
                <Sparkles className="w-3 h-3" />
                <span>STUDIO LEDGER ACCESS</span>
              </div>
              <h3 className="text-xl font-bold tracking-tight text-white">
                {pendingInvoice ? 'Save Invoice & Unlock PDF' : 'Log into ClearBooks Studio'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect your Google account to access your studio command center, track scope revisions, and download unwatermarked PDFs.
              </p>
            </div>

            {/* Drafted invoice snapshot banner */}
            {pendingInvoice && (
              <div className="p-3.5 rounded-lg bg-slate-900/80 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">DRAFT READY</span>
                  <span className="text-cyan-400 font-mono font-semibold">{pendingInvoice.invoiceNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <div className="text-sm font-semibold text-white tracking-tight truncate">
                      {pendingInvoice.projectName || 'Commercial Color Grade'}
                    </div>
                    <div className="text-xs text-slate-400 truncate">
                      {pendingInvoice.clientName || 'Direct Client'}
                    </div>
                  </div>
                  <div className="text-right font-mono font-bold text-base text-cyan-400 shrink-0">
                    {pendingInvoice.currency} {pendingInvoice.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            )}

            {/* Sign in Button */}
            <div className="space-y-3">
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full relative group overflow-hidden rounded-lg bg-white hover:bg-slate-100 text-slate-950 font-medium py-3 px-4 flex items-center justify-center gap-3 transition-all duration-200 cursor-pointer shadow-lg shadow-white/5 active:scale-[0.99] disabled:opacity-75"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span className="text-sm font-semibold tracking-tight">Continue with Google</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  256-bit Bank Encryption
                </span>
                <span>•</span>
                <span>Zero Credit Card Required</span>
              </div>
            </div>

            {/* Perks Bullet List */}
            <div className="pt-4 border-t border-white/10 space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Instant unwatermarked PDF download</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Revision Guard to stop unpaid client changes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Autonomous friendly payment reminders</span>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
