/**
 * ClearBooks Studio - Database Definitions & Types
 * Matching Supabase Migration: 20260923000000_clearbooks_studio_schema.sql
 */

export type InvoiceStatus = 'Draft' | 'Sent' | 'Overdue' | 'Paid' | 'Cancelled';
export type TransactionType = 'income' | 'expense';

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number; // e.g. hours or days or deliverables
  rate: number;
  amount: number;
}

export interface Profile {
  id: string;
  full_name: string | null;
  studio_name: string | null;
  email: string | null;
  phone: string | null;
  brand_color: string;
  logo_url: string | null;
  avatar_url: string | null;
  gstin: string | null;
  billing_address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  currency: string;
  default_tax_type: string;
  default_tax_rate: number;
  default_payment_terms_days: number;
  invoice_prefix: string;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  user_id: string;
  name: string;
  company_name: string;
  email: string;
  phone: string | null;
  billing_address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  gstin: string | null;
  currency: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  user_id: string;
  client_id: string;
  invoice_number: string;
  project_title: string;
  status: InvoiceStatus;
  issue_date: string;
  due_date: string;
  subtotal: number;
  tax_type: string;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;
  amount: number;
  currency: string;
  revisions_included: number;
  revisions_used: number;
  line_items: InvoiceLineItem[];
  notes: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  invoice_id: string | null;
  client_id: string | null;
  type: TransactionType;
  category: string;
  amount: number;
  currency: string;
  date: string;
  description: string;
  payment_method: string | null;
  receipt_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}
