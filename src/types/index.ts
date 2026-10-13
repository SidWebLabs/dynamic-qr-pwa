export interface UPIProfile {
  id: string;
  user_id: string;
  owner_name: string;
  owner_upi_id: string;
  is_primary: boolean;
  is_active: boolean;
  created_by: number;
  created_on: string;
}

export interface QRRecord {
  id: string;
  user_id: string;
  account_id: string;
  owner_name: string;
  owner_upi_id: string;
  amount: number;
  note: string | null;
  created_on: string;
}

export interface SplitPaymentItem {
  id: string;
  split_payment_id: string;
  sequence_no: number;
  amount: number;
  note: string | null;
  created_on: string;
}

export interface SplitPaymentRecord {
  id: string;
  user_id: string;
  account_id: string;
  owner_name: string;
  owner_upi_id: string;
  total_amount: number;
  note: string | null;
  split_count: number;
  created_on: string;
  items: SplitPaymentItem[];
}