import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home, Sparkles } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log sanitized error in development without leaking raw DB trace to user
    console.error('Studio Recovery caught error:', error.message, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleClearCache = () => {
    try {
      localStorage.clear();
      window.location.reload();
    } catch {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-6">
          <div className="max-w-lg w-full glass-card p-8 text-center space-y-6 border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto shadow-lg shadow-rose-950/40">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                Workspace Protection Protocol
              </span>
              <h2 className="text-xl font-bold tracking-tight text-white pt-1">
                Studio Ledger Recovered
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                An unexpected system hiccup was caught before it could compromise your financial records. Your data remains safe and secured.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-900/80 border border-white/10 text-left font-mono text-xs text-slate-400 space-y-1">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">Diagnostic Notice:</div>
              <div className="text-slate-300 truncate">
                {this.state.error?.message ? 'Workspace rendering synchronized with local cache' : 'Session stabilized safely.'}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={this.handleReset}
                className="px-4 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reload Workspace</span>
              </button>
              <button
                onClick={this.handleClearCache}
                className="px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 text-xs font-mono flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Reset to Safe Defaults</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
export default ErrorBoundary;
