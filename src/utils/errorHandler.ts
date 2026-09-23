import { toast } from 'sonner';

export interface FriendlyError {
  title: string;
  description: string;
}

/**
 * Converts raw database, network, or JavaScript errors into human-friendly messages.
 * Guarantees that internal database schema details, SQL errors, or stack traces
 * are NEVER displayed to the client.
 */
export function formatFriendlyError(error: unknown, fallbackAction = 'perform this action'): FriendlyError {
  if (!error) {
    return {
      title: 'Action Could Not Be Completed',
      description: `We encountered an unexpected condition while attempting to ${fallbackAction}. Please try again.`,
    };
  }

  const rawMsg = typeof error === 'string' 
    ? error 
    : (error as any)?.message || (error as any)?.error_description || String(error);

  const lower = rawMsg.toLowerCase();

  // PostgreSQL Unique Constraint Violation
  if (lower.includes('unique constraint') || lower.includes('duplicate key') || lower.includes('23505')) {
    if (lower.includes('invoice_number')) {
      return {
        title: 'Duplicate Invoice Number',
        description: 'An invoice with this reference number already exists in your ledger. Please increment the invoice sequence.',
      };
    }
    if (lower.includes('email')) {
      return {
        title: 'Account Already Exists',
        description: 'A client or studio account with this email address is already registered in your CRM.',
      };
    }
    return {
      title: 'Record Already Exists',
      description: 'A matching record was already found in your workspace database. Please check for duplicates.',
    };
  }

  // Row Level Security (RLS) or Permission Denied
  if (lower.includes('row-level security') || lower.includes('policy') || lower.includes('42501') || lower.includes('permission denied')) {
    return {
      title: 'Access Restricted',
      description: 'You do not have permission to modify this studio document. Please check your workspace role.',
    };
  }

  // Foreign Key Violation
  if (lower.includes('foreign key') || lower.includes('23503')) {
    return {
      title: 'Referenced Record Missing',
      description: 'The associated client or transaction could not be linked. Please verify that the client profile exists.',
    };
  }

  // Network / Connection Failures
  if (lower.includes('failed to fetch') || lower.includes('networkerror') || lower.includes('timeout') || lower.includes('offline')) {
    return {
      title: 'Connection Interrupted',
      description: 'Unable to reach the studio database. Your changes were safely cached locally and will sync once restored.',
    };
  }

  // Storage Bucket Upload Failures
  if (lower.includes('storage') || lower.includes('payload too large') || lower.includes('413')) {
    return {
      title: 'File Upload Limit',
      description: 'The uploaded receipt or document exceeds the supported file size (maximum 10MB).',
    };
  }

  // Generic or sanitized fallback
  return {
    title: 'Workspace Sync Notice',
    description: `We could not ${fallbackAction} at this moment. The ledger remained secure and unaffected.`,
  };
}

/**
 * Fires a sanitized error toast to the user
 */
export function notifyError(error: unknown, fallbackAction = 'complete this operation') {
  const friendly = formatFriendlyError(error, fallbackAction);
  toast.error(friendly.title, {
    description: friendly.description,
    duration: 5000,
  });
}
