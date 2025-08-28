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
  role: "ADMIN" | "CLIENT" | "AGENT";
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
  units?: Unit[];
  sold_units?: number;
  total_revenue?: number;
}

export interface UnitClient {
  fullname: string;
  email: string;
  phone: string;
  address: string;
}

export enum PaymentDuration {
  MONTHLY = "monthly",
  QUARTERLY = "quarterly",
  BI_ANNUALLY = "bi_annually",
  ANNUALLY = "annually",
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
  payment_duration: PaymentDuration;
  client_id: string;
  project_id: string;
  // agent_id: string;
  sales_rep: string;
  id: string;
  deleted: boolean;
  images?: string[];
  reason_for_delete: string;
  warranty: Warranty;
  payment_summary: PaymentSummary;
  graph_data: GraphDaum[];
  total_paid: number;
  development_status: 'not_started' | 'in_progress' | 'completed';
  created_at: string;
  updated_at: string;
  client?: UnitClient;
  unit_agents?: UnitAgent[];
}

export interface Warranty {
  isValid: boolean;
  expire_at: string;
}

export interface PaymentSummary {
  total: number;
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
  duration: PaymentDuration;
}

export interface GraphDaum {
  month: number;
  amount: number;
}

export interface UnitAgent {
  id: string;
  unit_id: string;
  agent_id: string;
  role: 'external_agent' | 'sales_rep';
  created_at: string;
  updated_at: string;
  agent: User;
  unit: Unit;
}

export interface Payment {
  amount: number
  due_date: string
  status: string
  unit_id: string
  id: string
  deleted: boolean
  reason_for_delete: string
  created_at: string
  updated_at: string
  reason_for_payment: string;
  payment_date: string;
  installment: number;
}

export enum DocumentKind {
  TEMPLATE = "template",
  SIGNED = "signed"
}
export interface Document {
  id: string;
  name: string;
  unit_id?: string;
  kind: DocumentKind;
  created_at: string;
  media_file?: MediaFile;
  media_file_id: string;
}

export interface MediaFile {
  file_type: string;
  file_name: string;
  file_path: string;
  file_size: number;
  created_at: string;
  updated_at: string;
  uploaded_by: string;
  uploader: User;
  unit_id: string;
  project_id: string;
  deleted: boolean;
  id: string;
}

export interface Template {
  name: string
  media_file_id: string
  unit_id: string
  deleted_at: boolean
  id: string
  media_file: MediaFile
  unit: Unit
  created_at: string
  updated_at: string
}

export interface SignedDocument {
  name: string
  media_file_id: string
  unit_id: string
  deleted_at: boolean
  id: string
  media_file: MediaFile
  unit: Unit
  client_id: string;
  agent_id?: string;
  client?: User;
  agent?: User;
  created_at: string
  updated_at: string
}