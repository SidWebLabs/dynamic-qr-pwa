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
  upiProfileId: string;
  owner_upi_id: string;
  owner_name: string;
  amount: number;
  note: string;
  generatedAt: string;
}