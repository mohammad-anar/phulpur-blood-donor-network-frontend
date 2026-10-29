export interface DonationRecord {
  id: string;
  date: string;
  isoDate?: string;
  time?: string;
  hospital: string;
  area?: string;
  caseNote: string;
  quantity?: string;
  status: string;
  statusType: "approved" | "pending" | "rejected";
  voucherNumber?: string;
  slipUrl?: string | null;
}

// No dummy records - starts empty and populates strictly from database
export const defaultDonorDonations: DonationRecord[] = [];
