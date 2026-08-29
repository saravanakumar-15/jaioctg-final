// server/quotation.ts
// Handles Quotation Number generation and quotation business models

export interface QuotationServiceItem {
  sNo: number;
  description: string;
  standard: string;
  quantity: string;
}

export interface QuotationData {
  quotationNumber: string;
  quotationDate: string; // e.g. "16 Aug 2026"
  submissionTimestamp?: string;
  customerName: string;
  companyName: string;
  email: string;
  phone: string;
  address: string; // Location / yard address
  services: QuotationServiceItem[];
  pipeSpecs?: string;
  estimatedJoints?: number | string;
  urgency?: string;
  additionalNotes?: string;
  status: 'Submitted' | 'In Review' | 'Approved' | 'Completed';
}

// In-memory counter starting from 0001 for the current year
let quotationCounter = 1;

/**
 * Generates a unique, non-hardcoded corporate quotation number
 * Example format: JAI-QTN-2026-0001, JAI-QTN-2026-0002, etc.
 */
export function generateNextQuotationNumber(year?: number): string {
  const currentYear = year || new Date().getFullYear();
  const sequence = String(quotationCounter++).padStart(4, '0');
  return `JAI-QTN-${currentYear}-${sequence}`;
}

/**
 * Standard industry specifications reference for JAI OCTG inspection services
 */
export const SERVICE_STANDARDS_MAP: Record<string, { description: string; standard: string }> = {
  drillpipe: {
    description: 'DRILLPIPE INSPECTION',
    standard: 'DS-1 CAT4 / DS-1 CAT5'
  },
  bha: {
    description: 'BHA INSPECTION',
    standard: 'DS-1 CAT3-5'
  },
  pup_joint: {
    description: 'PUP JOINT INSPECTION',
    standard: 'DS-1 CAT3-5'
  },
  fishing_tools: {
    description: 'FISHING TOOLS INSPECTION',
    standard: 'DS-1 VOL4'
  },
  tubing: {
    description: 'TUBING INSPECTION',
    standard: 'API RP 7G-2'
  },
  casing: {
    description: 'CASING INSPECTION',
    standard: 'API 5CT / API 5A5'
  },
  handling_tools: {
    description: 'HANDLING TOOLS INSPECTION',
    standard: 'API RP 8B'
  },
  ndt_flaw_detection: {
    description: 'FULL-LENGTH NDT & EMI TUBULAR SCANNING',
    standard: 'API RP 5A5 / ASNT SNT-TC-1A'
  }
};

/**
 * Resolves customer submitted service string or list into structured table rows
 */
export function resolveServiceItems(
  serviceInput: string | string[],
  pipeSpecs?: string,
  estimatedJoints?: number | string
): QuotationServiceItem[] {
  const quantityLabel = estimatedJoints
    ? `${estimatedJoints} Joints (${pipeSpecs || 'Standard Spec'})`
    : (pipeSpecs ? `As Requested (${pipeSpecs})` : 'As Requested');

  const rawServices = Array.isArray(serviceInput)
    ? serviceInput
    : [serviceInput || 'DRILLPIPE INSPECTION'];

  const items: QuotationServiceItem[] = [];

  rawServices.forEach((srv, idx) => {
    const srvLower = srv.toLowerCase();
    let matchedKey = '';

    if (srvLower.includes('drillpipe') || srvLower.includes('drill pipe')) {
      matchedKey = 'drillpipe';
    } else if (srvLower.includes('bha') || srvLower.includes('bottom hole')) {
      matchedKey = 'bha';
    } else if (srvLower.includes('pup')) {
      matchedKey = 'pup_joint';
    } else if (srvLower.includes('fishing')) {
      matchedKey = 'fishing_tools';
    } else if (srvLower.includes('tubing')) {
      matchedKey = 'tubing';
    } else if (srvLower.includes('casing')) {
      matchedKey = 'casing';
    } else if (srvLower.includes('handling')) {
      matchedKey = 'handling_tools';
    }

    if (matchedKey && SERVICE_STANDARDS_MAP[matchedKey]) {
      const match = SERVICE_STANDARDS_MAP[matchedKey];
      items.push({
        sNo: idx + 1,
        description: match.description,
        standard: match.standard,
        quantity: idx === 0 ? quantityLabel : 'As Requested'
      });
    } else {
      // Custom or combined string
      items.push({
        sNo: idx + 1,
        description: srv.toUpperCase(),
        standard: 'API / DS-1 / ASNT Standards',
        quantity: idx === 0 ? quantityLabel : 'As Requested'
      });
    }
  });

  return items;
}
