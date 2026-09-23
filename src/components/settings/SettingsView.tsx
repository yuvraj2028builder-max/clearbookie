import React, { useState } from 'react';
import { 
  Building, 
  CreditCard, 
  Palette, 
  Save, 
  Check, 
  UploadCloud, 
  Image as ImageIcon, 
  Sparkles, 
  ShieldCheck, 
  Globe, 
  RefreshCw,
  Eye,
  X,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { useStudio } from '../../context/StudioContext';
import { notifyError } from '../../utils/errorHandler';

export default function SettingsView() {
  const { profile, updateProfile, setPdfInvoice, invoices } = useStudio();

  // Profile Details
  const [fullName, setFullName] = useState(profile.full_name || '');
  const [studioName, setStudioName] = useState(profile.studio_name || '');
  const [email, setEmail] = useState(profile.email || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [billingAddress, setBillingAddress] = useState(profile.billing_address || '');
  const [city, setCity] = useState(profile.city || '');
  const [state, setState] = useState(profile.state || '');
  const [postalCode, setPostalCode] = useState(profile.postal_code || '');
  const [country, setCountry] = useState(profile.country || 'USA');
  const [gstin, setGstin] = useState(profile.gstin || '');

  // Invoice Defaults
  const [taxRate, setTaxRate] = useState(profile.default_tax_rate ?? 8.5);
  const [taxType, setTaxType] = useState(profile.default_tax_type || 'Sales Tax');
  const [currency, setCurrency] = useState(profile.currency || 'USD');
  const [terms, setTerms] = useState(profile.default_payment_terms_days ?? 14);

  // Branding: Logo & Primary Brand Color
  const [brandColor, setBrandColor] = useState(profile.brand_color || '#06b6d4');
  const [logoUrl, setLogoUrl] = useState(profile.logo_url || '');
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{ taxRate?: string; terms?: string; studioName?: string }>({});

  // Brand Color Palette Presets
  const COLOR_PRESETS = [
    { name: 'Electric Cyan', hex: '#06b6d4' },
    { name: 'Emerald Mint', hex: '#10b981' },
    { name: 'Cyber Violet', hex: '#8b5cf6' },
    { name: 'Amber Gold', hex: '#f59e0b' },
    { name: 'Rose Red', hex: '#f43f5e' },
    { name: 'Pure Obsidian', hex: '#38bdf8' },
  ];

  // Handle Logo Upload (Simulated Supabase Storage Upload)
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result as string);
        toast.success('Emblem Uploaded', {
          description: 'Studio logo preview updated and ready to save.',
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const validateSettings = (): boolean => {
    const errs: typeof errors = {};
    if (!studioName.trim()) {
      errs.studioName = 'Studio name cannot be empty.';
    }
    if (taxRate < 0) {
      errs.taxRate = 'Tax rate cannot be negative.';
    }
    if (terms < 0) {
      errs.terms = 'Payment terms days cannot be negative.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateSettings()) {
      toast.error('Validation Error', {
        description: 'Please correct the highlighted settings before saving.',
      });
      return;
    }

    setIsSaving(true);

    try {
      // Simulate realistic Supabase profile persistence
      await new Promise(resolve => setTimeout(resolve, 500));

      updateProfile({
        full_name: fullName,
        studio_name: studioName,
        email,
        phone,
        billing_address: billingAddress,
        city,
        state,
        postal_code: postalCode,
        country,
        gstin,
        default_tax_rate: Number(taxRate),
        default_tax_type: taxType,
        currency,
        default_payment_terms_days: Number(terms),
        brand_color: brandColor,
        logo_url: logoUrl || null,
      });

      setSaved(true);
      toast.success('Studio Preferences Saved!', {
        description: 'Brand color, invoice defaults, and studio metadata have been updated.',
      });
      setTimeout(() => setSaved(false), 2400);
    } catch (err) {
      notifyError(err, 'save studio settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreviewPdf = () => {
    if (invoices.length > 0) {
      setPdfInvoice(invoices[0]);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
              Studio Brand & System Preferences
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              CUSTOM THEME ENGINE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Personalize your commercial invoice PDFs with custom logo, primary brand color, default tax policies, and currencies.
          </p>
        </div>

        <button
          onClick={handlePreviewPdf}
          className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-white/10 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          <span>Preview Branded PDF</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* =========================================================================
            SECTION 1: BRANDING & VISUAL IDENTITY (Logo & Primary Color)
           ========================================================================= */}
        <div className="glass-card p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Invoice Branding & Visual Styling
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Direct PDF Output Control
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Logo Upload */}
            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-medium block">
                Studio Emblem / Logo
              </label>
              
              <div className="flex items-start gap-4">
                <div 
                  className="w-20 h-20 rounded-xl border border-white/15 bg-slate-900 flex items-center justify-center overflow-hidden shrink-0 relative shadow-inner"
                  style={{ borderColor: brandColor }}
                >
                  {logoUrl ? (
                    <img 
                      src={logoUrl} 
                      alt="Studio Logo Preview" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="text-center p-2">
                      <ImageIcon className="w-6 h-6 text-slate-500 mx-auto" />
                      <span className="text-[9px] text-slate-500 font-mono mt-1 block">NO LOGO</span>
                    </div>
                  )}
                  {logoUrl && (
                    <button
                      type="button"
                      onClick={() => setLogoUrl('')}
                      className="absolute top-1 right-1 p-1 rounded-full bg-slate-950/80 text-rose-400 hover:text-white"
                      title="Remove Logo"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="flex-1 space-y-2 text-xs">
                  <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-white/10 cursor-pointer font-medium transition-colors">
                    <UploadCloud className="w-4 h-4 text-cyan-400" />
                    <span>Upload Studio Logo</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/svg+xml"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[11px] text-slate-400">
                    Recommended: Transparent PNG or SVG (min 400x400px). Displayed prominently in commercial invoice PDFs.
                  </p>
                </div>
              </div>
            </div>

            {/* Primary Brand Color Picker */}
            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-medium flex items-center justify-between">
                <span>Primary Brand Color</span>
                <span className="font-mono text-cyan-400 uppercase text-[11px]">{brandColor}</span>
              </label>

              {/* Color Presets */}
              <div className="flex items-center gap-2">
                {COLOR_PRESETS.map((col) => (
                  <button
                    key={col.hex}
                    type="button"
                    onClick={() => setBrandColor(col.hex)}
                    className={`w-7 h-7 rounded-full transition-transform cursor-pointer border ${
                      brandColor === col.hex ? 'scale-125 border-white shadow-md' : 'border-transparent hover:scale-110'
                    }`}
                    style={{ backgroundColor: col.hex }}
                    title={col.name}
                  />
                ))}

                {/* Native HTML Color Input */}
                <div className="relative flex items-center ml-2">
                  <input
                    type="color"
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                    title="Custom Color"
                  />
                </div>
              </div>

              {/* Dynamic Live Preview Banner */}
              <div 
                className="mt-3 p-3 rounded-lg border text-xs font-mono flex items-center justify-between transition-all"
                style={{
                  backgroundColor: `${brandColor}15`,
                  borderColor: `${brandColor}40`,
                }}
              >
                <div className="flex items-center gap-2">
                  <span 
                    className="w-2.5 h-2.5 rounded-full" 
                    style={{ backgroundColor: brandColor }} 
                  />
                  <span className="font-semibold text-white">Live PDF Accent Tint</span>
                </div>
                <span style={{ color: brandColor }} className="font-bold">
                  SAMPLE BADGE
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* =========================================================================
            SECTION 2: PROFILE & STUDIO DETAILS
           ========================================================================= */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <Building className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Profile & Studio Details
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">
                Business / Studio Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={studioName}
                onChange={(e) => {
                  setStudioName(e.target.value);
                  if (errors.studioName) setErrors(prev => ({ ...prev, studioName: undefined }));
                }}
                placeholder="e.g. Obsidian Grade Lab"
                className={`w-full px-3 py-2 rounded-lg bg-slate-900 border ${
                  errors.studioName ? 'border-rose-500/80 ring-1 ring-rose-500/30' : 'border-white/10'
                } text-white outline-none focus:border-cyan-400 font-sans`}
              />
              {errors.studioName && (
                <p className="text-rose-400 text-[11px] font-mono mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{errors.studioName}</span>
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Freelancer Full Name *</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Alex Vance"
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white outline-none focus:border-cyan-400 font-sans"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Studio Billing Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. billing@obsidiangrade.com"
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white outline-none focus:border-cyan-400"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Contact Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (310) 555-8841"
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white outline-none focus:border-cyan-400 font-mono"
              />
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <label className="text-slate-300 font-medium">Studio Street Address</label>
            <input
              type="text"
              value={billingAddress}
              onChange={(e) => setBillingAddress(e.target.value)}
              placeholder="e.g. 742 Evergreen Studio Blvd, Suite 400"
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Los Angeles"
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white outline-none focus:border-cyan-400"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">State / Region</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="CA"
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white outline-none focus:border-cyan-400"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Postal Code</label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="90028"
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white outline-none focus:border-cyan-400 font-mono"
              />
            </div>
          </div>
        </div>

        {/* =========================================================================
            SECTION 3: INVOICE DEFAULTS (Tax Rate, Currency, Payment Terms)
           ========================================================================= */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <CreditCard className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Invoice Defaults & Tax Policies
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            
            {/* Default Currency (USD, INR, EUR, GBP) */}
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Default Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white outline-none focus:border-cyan-400 font-mono"
              >
                <option value="USD">USD ($ - United States Dollar)</option>
                <option value="INR">INR (₹ - Indian Rupee)</option>
                <option value="EUR">EUR (€ - Euro)</option>
                <option value="GBP">GBP (£ - British Pound)</option>
              </select>
            </div>

            {/* Default Tax Rate */}
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Default Tax Rate (%)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={taxRate}
                onChange={(e) => {
                  setTaxRate(parseFloat(e.target.value) || 0);
                  if (errors.taxRate) setErrors(prev => ({ ...prev, taxRate: undefined }));
                }}
                placeholder="8.5"
                className={`w-full px-3 py-2 rounded-lg bg-slate-900 border ${
                  errors.taxRate ? 'border-rose-500/80 ring-1 ring-rose-500/30' : 'border-white/10'
                } text-white outline-none focus:border-cyan-400 font-mono`}
              />
              {errors.taxRate && (
                <p className="text-rose-400 text-[11px] font-mono mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{errors.taxRate}</span>
                </p>
              )}
            </div>

            {/* Tax Nomenclature */}
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Tax Label</label>
              <select
                value={taxType}
                onChange={(e) => setTaxType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white outline-none focus:border-cyan-400 font-mono"
              >
                <option value="Sales Tax">Sales Tax (US)</option>
                <option value="GST">GST (India / Canada / Aus)</option>
                <option value="VAT">VAT (Europe / UK)</option>
              </select>
            </div>

            {/* Payment Terms (Days) */}
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Payment Terms (Days)</label>
              <input
                type="number"
                min="0"
                value={terms}
                onChange={(e) => {
                  setTerms(parseInt(e.target.value) || 0);
                  if (errors.terms) setErrors(prev => ({ ...prev, terms: undefined }));
                }}
                placeholder="14"
                className={`w-full px-3 py-2 rounded-lg bg-slate-900 border ${
                  errors.terms ? 'border-rose-500/80 ring-1 ring-rose-500/30' : 'border-white/10'
                } text-white outline-none focus:border-cyan-400 font-mono`}
              />
              {errors.terms && (
                <p className="text-rose-400 text-[11px] font-mono mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{errors.terms}</span>
                </p>
              )}
            </div>

          </div>

          <div className="space-y-1 text-xs">
            <label className="text-slate-300 font-medium">Studio Tax ID / GSTIN / VAT Registration</label>
            <input
              type="text"
              value={gstin}
              onChange={(e) => setGstin(e.target.value)}
              placeholder="e.g. US-CA-94016-TX or 27AAAAA0000A1Z5"
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white outline-none focus:border-cyan-400 font-mono"
            />
          </div>
        </div>

        {/* Form Submission Actions */}
        <div className="pt-2 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono">
            {saved ? (
              <span className="text-emerald-400 flex items-center gap-1.5 font-semibold">
                <Check className="w-4 h-4" />
                Branding & preferences saved!
              </span>
            ) : (
              'All updates take effect across your invoices immediately.'
            )}
          </span>

          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-cyan-500/20 active:scale-[0.98] cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Saving Preferences...</span>
              </>
            ) : saved ? (
              <>
                <Check className="w-4 h-4" />
                <span>Preferences Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Studio Preferences</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}
