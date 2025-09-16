// User Types
export interface User {
  id: string;
  email: string;
  full_name: string;
  company_name?: string;
  role: UserRole;
  is_active: boolean;
  is_verified: boolean;
  avatar_url?: string;
  phone_number?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
  metadata?: Record<string, any>;
}

export enum UserRole {
  ADMIN = 'admin',
  CLIENT = 'client',
  PROVIDER = 'provider',
  OPERATOR = 'operator',
  SUPERUSER = 'superuser',
}

// Asset Types
export interface Asset {
  id: string;
  name: string;
  description?: string;
  asset_type: AssetType;
  status: AssetStatus;
  serial_number?: string;
  model_number?: string;
  manufacturer?: string;
  owner_id: string;
  current_location: string;
  installation_date?: string;
  expected_life?: number; // in months
  last_maintenance_date?: string;
  next_maintenance_date?: string;
  specifications?: Record<string, any>;
  maintenance_interval?: number; // in days
  created_by: string;
  created_at: string;
  updated_at: string;
  owner?: User;
  documents?: Document[];
  service_orders?: ServiceOrder[];
}

export enum AssetType {
  MACHINE = 'machine',
  EQUIPMENT = 'equipment',
  VEHICLE = 'vehicle',
  TOOL = 'tool',
  FACILITY = 'facility',
  OTHER = 'other',
}

export enum AssetStatus {
  OPERATIONAL = 'operational',
  MAINTENANCE = 'maintenance',
  OUT_OF_SERVICE = 'out_of_service',
  DECOMMISSIONED = 'decommissioned',
  REPAIR_NEEDED = 'repair_needed',
}

// Service Order Types
export interface ServiceOrder {
  id: string;
  title: string;
  description: string;
  status: ServiceOrderStatus;
  priority: ServiceOrderPriority;
  client_id: string;
  provider_id?: string;
  asset_id?: string;
  scheduled_start?: string;
  scheduled_end?: string;
  actual_start?: string;
  actual_end?: string;
  estimated_hours?: number;
  actual_hours?: number;
  estimated_cost?: number;
  actual_cost?: number;
  location: string;
  requires_approval: boolean;
  approved_by?: string;
  approved_at?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  client?: User;
  provider?: User;
  asset?: Asset;
  checklist_items?: ChecklistItem[];
  documents?: Document[];
  payments?: Payment[];
}

export enum ServiceOrderStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REJECTED = 'rejected',
}

export enum ServiceOrderPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// Checklist Item Types
export interface ChecklistItem {
  id: string;
  service_order_id: string;
  description: string;
  is_required: boolean;
  is_completed: boolean;
  completed_by?: string;
  completed_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  completed_by_user?: User;
}

// Document Types
export interface Document {
  id: string;
  name: string;
  description?: string;
  document_type: DocumentType;
  file_path: string;
  file_size: number; // in bytes
  mime_type: string;
  uploaded_by: string;
  service_order_id?: string;
  asset_id?: string;
  is_public: boolean;
  expiration_date?: string;
  created_at: string;
  updated_at: string;
  uploaded_by_user?: User;
}

export enum DocumentType {
  INVOICE = 'invoice',
  QUOTE = 'quote',
  CONTRACT = 'contract',
  REPORT = 'report',
  CERTIFICATE = 'certificate',
  MANUAL = 'manual',
  IMAGE = 'image',
  OTHER = 'other',
}

// Payment Types
export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  payment_method: PaymentMethod;
  payment_details: Record<string, any>;
  service_order_id: string;
  invoice_id?: string;
  paid_at?: string;
  refunded_at?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  service_order?: ServiceOrder;
  invoice?: Invoice;
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
  CANCELLED = 'cancelled',
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  BANK_TRANSFER = 'bank_transfer',
  PIX = 'pix',
  BOLETO = 'boleto',
  CASH = 'cash',
  OTHER = 'other',
}

// Invoice Types
export interface Invoice {
  id: string;
  invoice_number: string;
  amount: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  billing_name: string;
  billing_tax_id?: string;
  billing_address?: string;
  status: PaymentStatus;
  due_date: string;
  paid_date?: string;
  service_order_id?: string;
  created_at: string;
  updated_at: string;
  service_order?: ServiceOrder;
  payments?: Payment[];
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  message: string;
  notification_type: NotificationType;
  status: NotificationStatus;
  user_id: string;
  reference_type?: string;
  reference_id?: string;
  is_read: boolean;
  read_at?: string;
  created_at: string;
  updated_at: string;
  user?: User;
}

export enum NotificationType {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
  IN_APP = 'in_app',
  SYSTEM = 'system',
}

export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed',
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
  meta?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirm_password: string;
  full_name: string;
  company_name?: string;
  phone_number?: string;
  agree_terms: boolean;
}

export interface ServiceOrderFormData {
  title: string;
  description: string;
  priority: ServiceOrderPriority;
  asset_id?: string;
  scheduled_start?: string;
  scheduled_end?: string;
  estimated_hours?: number;
  estimated_cost?: number;
  location: string;
  requires_approval: boolean;
  checklist_items?: Array<{
    description: string;
    is_required: boolean;
  }>;
}

// Utility Types
export type PaginatedResponse<T> = {
  items: T[];
  meta: {
    itemCount: number;
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
};

export type SortDirection = 'asc' | 'desc';

export type QueryParams = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: SortDirection;
  search?: string;
  status?: string;
  [key: string]: any;
};
