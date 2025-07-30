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
  deleted?: boolean;
  reason_for_delete?: string;
}

export interface Project {
  name: string
  description: string
  address: string
  num_units: number
  purpose: string
  artwork_url: string
  id: string
  status: 'ongoing' | 'archived' | 'completed'
  deleted?: boolean
  reason_for_delete?: string
  created_at: string
  updated_at: string
}

export interface Unit {
  name: string;
  amount: number;
  expected_initial_payment: number;
  discount: number;
  comments: string;
  type: string;
  purchase_date: string;
  installment: number;
  payment_plan: boolean;
  handover_date: string;
  warranty_period: number;
  client_id: string;
  project_id: string;
  agent_id: string;
  sales_rep: string;
  id: string;
  deleted: boolean;
  reason_for_delete: string;
  warranty: Warranty;
  payment_summary: PaymentSummary;
  graph_data: GraphDaum[];
  total_paid: number;
  created_at: string;
  updated_at: string;
}

export interface Warranty {
  isValid: boolean;
  expire_at: string;
}

export interface PaymentSummary {
  outstanding: number;
  total_deposit: number;
  total_unpaid: number;
  balanced: boolean;
  more_or_less: string;
  percentage_paid: number;
  percentage_unpaid: number;
  installment_amount: number;
  total_sch: number;
  installment_diff: number;
}

export interface GraphDaum {
  month: number;
  amount: number;
}