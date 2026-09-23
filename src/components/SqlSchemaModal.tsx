import React, { useState } from 'react';
import { X, Copy, Check, Download, Terminal, Database, ShieldCheck } from 'lucide-react';
import { SUPABASE_MIGRATION_SQL } from '../db/schema_sql';

interface SqlSchemaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SqlSchemaModal({ isOpen, onClose }: SqlSchemaModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(SUPABASE_MIGRATION_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const downloadSqlFile = () => {
    const element = document.createElement('a');
    const file = new Blob([SUPABASE_MIGRATION_SQL], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = '20260923000000_clearbooks_studio_schema.sql';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity animate-in fade-in"
        onClick={onClose} 
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl glass-card border border-white/20 bg-slate-950/95 p-6 shadow-2xl shadow-cyan-950/60 z-10 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
                Supabase Migration Script
                <span className="text-[10px] font-mono font-normal text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> RLS Enabled
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                profiles • clients • invoices (with revisions_included/used) • transactions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={downloadSqlFile}
              className="p-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-white/10 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Download SQL File"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download .sql</span>
            </button>
            <button
              onClick={copyToClipboard}
              className="px-3 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-cyan-500/10"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy SQL'}</span>
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-hidden my-4 relative rounded-lg border border-white/10 bg-black/60">
          <div className="bg-slate-900/90 px-4 py-2 border-b border-white/10 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              supabase/migrations/20260923000000_clearbooks_studio_schema.sql
            </span>
            <span className="text-cyan-400">PostgreSQL</span>
          </div>
          <pre className="p-4 font-mono text-xs text-slate-200 overflow-y-auto max-h-[58vh] leading-relaxed selection:bg-cyan-500/30">
            <code>{SUPABASE_MIGRATION_SQL}</code>
          </pre>
        </div>

        {/* Footer info */}
        <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-white/5">
          <span>Ready to execute in Supabase SQL Editor.</span>
          <span className="text-cyan-400 font-mono">4 Bulletproof Tables with Full Isolation</span>
        </div>

      </div>
    </div>
  );
}
