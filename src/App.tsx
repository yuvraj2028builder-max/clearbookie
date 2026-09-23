/**
 * ClearBooks Studio - Financial Command Center
 * Public Landing Page + Internal Studio Application
 */

import React, { useState } from 'react';
import { StudioProvider, useStudio } from './context/StudioContext';
import { Toaster } from 'sonner';
import ErrorBoundary from './components/common/ErrorBoundary';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BentoGrid from './components/BentoGrid';
import GuestInvoicePlayground from './components/GuestInvoicePlayground';
import AuthModal from './components/AuthModal';
import SqlSchemaModal from './components/SqlSchemaModal';
import Footer from './components/Footer';
import StudioLayout from './components/dashboard/StudioLayout';
import { LayoutDashboard, ArrowRight } from 'lucide-react';

function AppContent() {
  const [viewMode, setViewMode] = useState<'landing' | 'app'>('landing');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);
  const [pendingInvoice, setPendingInvoice] = useState<{
    clientName: string;
    projectName: string;
    amount: number;
    currency: string;
    invoiceNumber: string;
  } | null>(null);

  const handleScrollToPlayground = () => {
    const el = document.getElementById('playground-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTriggerAuth = (invoiceData: {
    clientName: string;
    projectName: string;
    amount: number;
    currency: string;
    invoiceNumber: string;
  }) => {
    setPendingInvoice(invoiceData);
    setIsAuthModalOpen(true);
  };

  // If in internal studio app mode, render the full Studio Command Center!
  if (viewMode === 'app') {
    return <StudioLayout onExitToLanding={() => setViewMode('landing')} />;
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col selection:bg-cyan-500/20 selection:text-cyan-300">
      
      {/* Sticky Header */}
      <Navbar 
        onOpenAuth={() => {
          setPendingInvoice(null);
          setIsAuthModalOpen(true);
        }}
        onScrollToPlayground={handleScrollToPlayground}
        onOpenSqlModal={() => setIsSqlModalOpen(true)}
      />

      {/* Direct Workspace Quick Switcher Banner */}
      <div className="bg-cyan-950/40 border-b border-cyan-500/20 py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-cyan-300 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>FULL STUDIO SUITE ACTIVE</span>
            <span className="text-slate-400 hidden sm:inline">• Revision Guard, Bento Command Center, Autonomous Nudges</span>
          </div>

          <button
            onClick={() => setViewMode('app')}
            className="flex items-center gap-1.5 font-semibold text-cyan-300 hover:text-cyan-200 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 px-3 py-1 rounded-full transition-all cursor-pointer"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" />
            <span>Open Studio App</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Page Flow */}
      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <Hero 
          onScrollToPlayground={handleScrollToPlayground}
          onOpenAuth={() => {
            setPendingInvoice(null);
            setIsAuthModalOpen(true);
          }}
        />

        {/* Task 2: Core Feature - The Guest Invoice Playground */}
        <GuestInvoicePlayground 
          onTriggerAuth={handleTriggerAuth}
        />

        {/* Bento-Grid Benefits */}
        <BentoGrid />
      </main>

      {/* Studio Footer */}
      <Footer 
        onOpenAuth={() => {
          setPendingInvoice(null);
          setIsAuthModalOpen(true);
        }}
        onOpenSqlModal={() => setIsSqlModalOpen(true)}
        onScrollToPlayground={handleScrollToPlayground}
      />

      {/* Continue with Google Sign-up / Login Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthenticated={() => setViewMode('app')}
        pendingInvoice={pendingInvoice}
      />

      {/* Supabase SQL Migration Modal */}
      <SqlSchemaModal 
        isOpen={isSqlModalOpen}
        onClose={() => setIsSqlModalOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <StudioProvider>
        <AppContent />
        <Toaster 
          position="bottom-right" 
          theme="dark" 
          richColors 
          closeButton
          toastOptions={{
            style: {
              background: 'rgba(15, 23, 42, 0.95)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#f8fafc',
              fontFamily: 'Inter, system-ui, sans-serif',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
            },
          }}
        />
      </StudioProvider>
    </ErrorBoundary>
  );
}
