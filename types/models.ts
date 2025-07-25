export interface User {
  fullname: string;
  email: string;
  phone: string;
  address: string;
  commission_rate: number;
  is_internal: boolean;
  created_by: string;
  is_active: boolean;
  company_id: string;
  company: Company;
  id: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Company {
  name: string;
  address: string;
  phone: string;
  email: string;
  id: string;
  created_at: string;
  updated_at: string;
  deleted: boolean;
  reason_for_delete: string;
}