import React, { createContext, useContext, useState, useEffect } from 'react';
import { Client, Invoice, Profile, Transaction } from '../db/types';
import { INITIAL_CLIENTS, INITIAL_INVOICES, INITIAL_PROFILE, INITIAL_TRANSACTIONS, MONTHLY_PROFIT_DATA } from '../db/seedData';

export type AppNavigationTab = 'dashboard' | 'invoices' | 'clients' | 'transactions' | 'reports' | 'settings';

interface StudioContextType {
  profile: Profile;
  clients: Client[];
  invoices: Invoice[];
  transactions: Transaction[];
  monthlyProfit: typeof MONTHLY_PROFIT_DATA;
  activeTab: AppNavigationTab;
  setActiveTab: (tab: AppNavigationTab) => void;
  // Modal controllers
  isCreateInvoiceOpen: boolean;
  setIsCreateInvoiceOpen: (open: boolean) => void;
  isAddClientModalOpen: boolean;
  setIsAddClientModalOpen: (open: boolean) => void;
  preselectedClientId: string | null;
  setPreselectedClientId: (id: string | null) => void;
  nudgeInvoice: Invoice | null;
  setNudgeInvoice: (invoice: Invoice | null) => void;
  pdfInvoice: Invoice | null;
  setPdfInvoice: (invoice: Invoice | null) => void;
  // Demo & Reset
  resetToDemoData: () => void;
  clearToCleanSlate: () => void;
  isProfileConfigured: boolean;
  markProfileConfigured: () => void;
  // CRUD Actions
  addInvoice: (invoiceData: Omit<Invoice, 'id' | 'created_at' | 'updated_at'>) => Invoice;
  updateInvoiceStatus: (id: string, status: Invoice['status']) => void;
  deleteInvoice: (id: string) => void;
  addClient: (clientData: Omit<Client, 'id' | 'created_at' | 'updated_at'> | (Omit<Client, 'id' | 'created_at' | 'updated_at' | 'user_id'> & { user_id?: string })) => Client;
  updateClient: (id: string, clientData: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  addTransaction: (txnData: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) => Transaction;
  deleteTransaction: (id: string) => void;
  updateProfile: (updated: Partial<Profile>) => void;
  getClientById: (clientId: string) => Client | undefined;
  // Computed client financial intelligence
  getClientFinancials: (clientId: string) => {
    totalInvoiced: number;
    totalPaid: number;
    balanceOwed: number;
    hasOverdue: boolean;
    revisionsAlert: boolean;
  };
  bestClient: { client: Client; totalPaid: number } | null;
  problematicClient: { client: Client; balanceOwed: number; overdueCount: number } | null;
  adobeAndPluginsSpend: number;
  totalTaxCollected: number;
  // Computed metrics for Command Center
  outstandingPaymentsTotal: number;
  pipelineCounts: {
    Draft: number;
    Sent: number;
    Overdue: number;
    Paid: number;
  };
  needsNudgeInvoices: Invoice[];
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);

export const StudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<Profile>(() => {
    const saved = localStorage.getItem('cb_studio_profile');
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('cb_studio_clients');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('cb_studio_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('cb_studio_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [activeTab, setActiveTab] = useState<AppNavigationTab>('dashboard');
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [preselectedClientId, setPreselectedClientId] = useState<string | null>(null);
  const [nudgeInvoice, setNudgeInvoice] = useState<Invoice | null>(null);
  const [pdfInvoice, setPdfInvoice] = useState<Invoice | null>(null);
  const [isProfileConfigured, setIsProfileConfigured] = useState<boolean>(() => {
    return localStorage.getItem('cb_studio_profile_configured') === 'true';
  });

  const markProfileConfigured = () => {
    setIsProfileConfigured(true);
    localStorage.setItem('cb_studio_profile_configured', 'true');
  };

  const resetToDemoData = () => {
    setProfile(INITIAL_PROFILE);
    setClients(INITIAL_CLIENTS);
    setInvoices(INITIAL_INVOICES);
    setTransactions(INITIAL_TRANSACTIONS);
    setIsProfileConfigured(true);
    localStorage.setItem('cb_studio_profile_configured', 'true');
  };

  const clearToCleanSlate = () => {
    setClients([]);
    setInvoices([]);
    setTransactions([]);
    setIsProfileConfigured(false);
    localStorage.removeItem('cb_studio_profile_configured');
  };

  // Sync to local storage for persistence across reloads
  useEffect(() => {
    localStorage.setItem('cb_studio_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('cb_studio_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('cb_studio_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('cb_studio_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Outstanding payments: Sum of Sent and Overdue invoices
  const outstandingPaymentsTotal = invoices
    .filter(inv => inv.status === 'Sent' || inv.status === 'Overdue')
    .reduce((sum, inv) => sum + inv.total_amount, 0);

  // Pipeline counts
  const pipelineCounts = {
    Draft: invoices.filter(inv => inv.status === 'Draft').length,
    Sent: invoices.filter(inv => inv.status === 'Sent').length,
    Overdue: invoices.filter(inv => inv.status === 'Overdue').length,
    Paid: invoices.filter(inv => inv.status === 'Paid').length,
  };

  // Urgency Section: List of 'Needs Nudge' invoices (Overdue)
  const needsNudgeInvoices = invoices.filter(inv => inv.status === 'Overdue');

  const getClientById = (clientId: string) => {
    return clients.find(c => c.id === clientId);
  };

  // Helper to calculate total invoiced, total paid, and balance owed per client
  const getClientFinancials = (clientId: string) => {
    const clientInvoices = invoices.filter(inv => inv.client_id === clientId);
    const totalInvoiced = clientInvoices.reduce((sum, inv) => sum + inv.total_amount, 0);
    const totalPaid = clientInvoices
      .filter(inv => inv.status === 'Paid')
      .reduce((sum, inv) => sum + inv.total_amount, 0);
    const balanceOwed = clientInvoices
      .filter(inv => inv.status === 'Sent' || inv.status === 'Overdue')
      .reduce((sum, inv) => sum + inv.total_amount, 0);
    const hasOverdue = clientInvoices.some(inv => inv.status === 'Overdue');
    const revisionsAlert = clientInvoices.some(inv => inv.revisions_used >= inv.revisions_included);

    return { totalInvoiced, totalPaid, balanceOwed, hasOverdue, revisionsAlert };
  };

  // Best Client calculation (highest total paid)
  const bestClient = (() => {
    if (clients.length === 0) return null;
    let maxPaid = -1;
    let topClient: Client | null = null;
    for (const c of clients) {
      const { totalPaid } = getClientFinancials(c.id);
      if (totalPaid > maxPaid) {
        maxPaid = totalPaid;
        topClient = c;
      }
    }
    return topClient && maxPaid > 0 ? { client: topClient, totalPaid: maxPaid } : null;
  })();

  // Problematic Client calculation (highest balance owed or most overdue)
  const problematicClient = (() => {
    if (clients.length === 0) return null;
    let worstScore = 0;
    let worstClient: Client | null = null;
    let worstBalance = 0;
    let worstOverdueCount = 0;

    for (const c of clients) {
      const { balanceOwed, hasOverdue } = getClientFinancials(c.id);
      const overdueCount = invoices.filter(i => i.client_id === c.id && i.status === 'Overdue').length;
      const score = balanceOwed + (overdueCount * 2000);
      if (score > worstScore && (hasOverdue || balanceOwed > 0)) {
        worstScore = score;
        worstClient = c;
        worstBalance = balanceOwed;
        worstOverdueCount = overdueCount;
      }
    }
    return worstClient ? { client: worstClient, balanceOwed: worstBalance, overdueCount: worstOverdueCount } : null;
  })();

  // Adobe & Plugins Spend calculation
  const adobeAndPluginsSpend = transactions
    .filter(t => t.type === 'expense')
    .filter(t => {
      const desc = t.description.toLowerCase();
      const cat = t.category.toLowerCase();
      return (
        desc.includes('adobe') ||
        desc.includes('davinci') ||
        desc.includes('plugin') ||
        desc.includes('dehancer') ||
        desc.includes('boris') ||
        desc.includes('filmconvert') ||
        desc.includes('red giant') ||
        desc.includes('creative cloud') ||
        cat.includes('plugin') ||
        cat.includes('software')
      );
    })
    .reduce((sum, t) => sum + t.amount, 0);

  // Total Tax Collected from Paid Invoices
  const totalTaxCollected = invoices
    .filter(inv => inv.status === 'Paid')
    .reduce((sum, inv) => sum + (inv.tax_amount || 0), 0);

  const addInvoice = (invoiceData: Omit<Invoice, 'id' | 'created_at' | 'updated_at'>): Invoice => {
    const now = new Date().toISOString();
    const newInvoice: Invoice = {
      ...invoiceData,
      id: `inv_${Date.now()}`,
      created_at: now,
      updated_at: now,
    };

    setInvoices(prev => [newInvoice, ...prev]);
    return newInvoice;
  };

  const updateInvoiceStatus = (id: string, status: Invoice['status']) => {
    const now = new Date().toISOString();
    setInvoices(prev =>
      prev.map(inv => {
        if (inv.id === id) {
          const isMarkedPaid = status === 'Paid';
          const updated = {
            ...inv,
            status,
            paid_at: isMarkedPaid ? now : inv.paid_at,
            updated_at: now,
          };

          // If marked as paid, automatically log an income transaction
          if (isMarkedPaid && inv.status !== 'Paid') {
            const newTxn: Transaction = {
              id: `txn_${Date.now()}`,
              user_id: inv.user_id,
              invoice_id: inv.id,
              client_id: inv.client_id,
              type: 'income',
              category: 'Client Settlement',
              amount: inv.total_amount,
              currency: inv.currency,
              date: new Date().toISOString().split('T')[0],
              description: `Settlement for invoice ${inv.invoice_number} (${inv.project_title})`,
              payment_method: 'Direct Deposit',
              receipt_url: null,
              notes: 'Auto-logged on payment status change',
              created_at: now,
              updated_at: now,
            };
            setTransactions(t => [newTxn, ...t]);
          }

          return updated;
        }
        return inv;
      })
    );
  };

  const deleteInvoice = (id: string) => {
    setInvoices(prev => prev.filter(inv => inv.id !== id));
  };

  const addClient = (clientData: Omit<Client, 'id' | 'created_at' | 'updated_at'> | (Omit<Client, 'id' | 'created_at' | 'updated_at' | 'user_id'> & { user_id?: string })): Client => {
    const now = new Date().toISOString();
    const newClient: Client = {
      id: `cli_${Date.now()}`,
      user_id: clientData.user_id || profile.id,
      name: clientData.name,
      company_name: clientData.company_name,
      email: clientData.email,
      phone: clientData.phone ?? null,
      billing_address: clientData.billing_address ?? null,
      city: clientData.city ?? null,
      state: clientData.state ?? null,
      postal_code: clientData.postal_code ?? null,
      country: clientData.country ?? null,
      gstin: clientData.gstin ?? null,
      currency: clientData.currency || 'USD',
      notes: clientData.notes ?? null,
      created_at: now,
      updated_at: now,
    };
    setClients(prev => [...prev, newClient]);
    return newClient;
  };

  const updateClient = (id: string, clientData: Partial<Client>) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...clientData, updated_at: new Date().toISOString() } : c));
  };

  const deleteClient = (id: string) => {
    setClients(prev => prev.filter(c => c.id !== id));
  };

  const addTransaction = (txnData: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>): Transaction => {
    const now = new Date().toISOString();
    const newTxn: Transaction = {
      ...txnData,
      id: `txn_${Date.now()}`,
      created_at: now,
      updated_at: now,
    };
    setTransactions(prev => [newTxn, ...prev]);
    return newTxn;
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const updateProfile = (updated: Partial<Profile>) => {
    setProfile(prev => ({
      ...prev,
      ...updated,
      updated_at: new Date().toISOString(),
    }));
    markProfileConfigured();
  };

  return (
    <StudioContext.Provider
      value={{
        profile,
        clients,
        invoices,
        transactions,
        monthlyProfit: MONTHLY_PROFIT_DATA,
        activeTab,
        setActiveTab,
        isCreateInvoiceOpen,
        setIsCreateInvoiceOpen,
        isAddClientModalOpen,
        setIsAddClientModalOpen,
        preselectedClientId,
        setPreselectedClientId,
        nudgeInvoice,
        setNudgeInvoice,
        pdfInvoice,
        setPdfInvoice,
        resetToDemoData,
        clearToCleanSlate,
        isProfileConfigured,
        markProfileConfigured,
        addInvoice,
        updateInvoiceStatus,
        deleteInvoice,
        addClient,
        updateClient,
        deleteClient,
        addTransaction,
        deleteTransaction,
        updateProfile,
        getClientById,
        getClientFinancials,
        bestClient,
        problematicClient,
        adobeAndPluginsSpend,
        totalTaxCollected,
        outstandingPaymentsTotal,
        pipelineCounts,
        needsNudgeInvoices,
      }}
    >
      {children}
    </StudioContext.Provider>
  );
};

export const useStudio = () => {
  const context = useContext(StudioContext);
  if (!context) {
    throw new Error('useStudio must be used within a StudioProvider');
  }
  return context;
};
