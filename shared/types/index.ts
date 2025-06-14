export interface User {
  id: string;
  email: string;
  name: string;
  company: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  lastLoginAt?: Date;
}

export type UserRole = "admin" | "manager" | "analyst" | "viewer";

export interface Company {
  id: string;
  name: string;
  domain: string;
  size: CompanySize;
  industry: string;
  createdAt: Date;
  settings: CompanySettings;
}

export type CompanySize =
  | "startup"
  | "small"
  | "medium"
  | "large"
  | "enterprise";

export interface CompanySettings {
  timezone: string;
  currency: string;
  fiscalYearStart: number;
  workingDays: number[];
}

export interface Lead {
  id: string;
  email: string;
  name: string;
  company?: string;
  phone?: string;
  source: LeadSource;
  status: LeadStatus;
  score: number;
  assignedTo?: string;
  tags: string[];
  customFields: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export type LeadSource =
  | "website"
  | "social_media"
  | "email_campaign"
  | "referral"
  | "cold_outreach"
  | "event"
  | "other";
export type LeadStatus =
  | "new"
  | "qualified"
  | "contacted"
  | "nurturing"
  | "converted"
  | "lost";

export interface Deal {
  id: string;
  title: string;
  value: number;
  currency: string;
  stage: DealStage;
  probability: number;
  expectedCloseDate: Date;
  actualCloseDate?: Date;
  leadId?: string;
  assignedTo: string;
  company?: string;
  products: DealProduct[];
  activities: Activity[];
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export type DealStage =
  | "prospecting"
  | "qualification"
  | "proposal"
  | "negotiation"
  | "closed_won"
  | "closed_lost";

export interface DealProduct {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  userId: string;
  leadId?: string;
  dealId?: string;
  scheduledAt?: Date;
  completedAt?: Date;
  status: ActivityStatus;
  createdAt: Date;
}

export type ActivityType =
  | "call"
  | "email"
  | "meeting"
  | "demo"
  | "follow_up"
  | "proposal"
  | "contract";
export type ActivityStatus =
  | "scheduled"
  | "completed"
  | "cancelled"
  | "overdue";

export interface Pipeline {
  id: string;
  name: string;
  stages: PipelineStage[];
  isDefault: boolean;
  createdAt: Date;
}

export interface PipelineStage {
  id: string;
  name: string;
  order: number;
  probability: number;
  color: string;
}

export interface Report {
  id: string;
  name: string;
  type: ReportType;
  filters: ReportFilter[];
  metrics: ReportMetric[];
  dateRange: DateRange;
  createdBy: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ReportType =
  | "revenue"
  | "conversion"
  | "pipeline"
  | "activity"
  | "performance";

export interface ReportFilter {
  field: string;
  operator: FilterOperator;
  value: unknown;
}

export type FilterOperator =
  | "equals"
  | "not_equals"
  | "contains"
  | "greater_than"
  | "less_than"
  | "between";

export interface ReportMetric {
  name: string;
  aggregation: MetricAggregation;
  field: string;
}

export type MetricAggregation = "sum" | "count" | "average" | "min" | "max";

export interface DateRange {
  start: Date;
  end: Date;
  preset?: DatePreset;
}

export type DatePreset =
  | "today"
  | "yesterday"
  | "last_7_days"
  | "last_30_days"
  | "this_month"
  | "last_month"
  | "this_quarter"
  | "last_quarter"
  | "this_year"
  | "last_year";

export interface Automation {
  id: string;
  name: string;
  description: string;
  trigger: AutomationTrigger;
  actions: AutomationAction[];
  conditions: AutomationCondition[];
  isActive: boolean;
  createdBy: string;
  executionCount: number;
  lastExecutedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AutomationTrigger {
  type: TriggerType;
  config: Record<string, unknown>;
}

export type TriggerType =
  | "lead_created"
  | "deal_stage_changed"
  | "activity_completed"
  | "time_based"
  | "form_submitted";

export interface AutomationAction {
  id: string;
  type: ActionType;
  config: Record<string, unknown>;
  order: number;
}

export type ActionType =
  | "send_email"
  | "create_task"
  | "update_field"
  | "assign_to_user"
  | "add_tag"
  | "webhook";

export interface AutomationCondition {
  id: string;
  field: string;
  operator: FilterOperator;
  value: unknown;
  logicalOperator?: "AND" | "OR";
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface SearchParams extends PaginationParams {
  query?: string;
  filters?: Record<string, unknown>;
}

export * from "./brand-positioning";
