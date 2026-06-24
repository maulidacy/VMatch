// Database types for VMatch
// These match the Supabase schema

export type UserRole = "admin" | "vendor" | "user";

export type Profile = {
  id: string;
  role: UserRole;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  avatar_url: string | null;
  service_area: string | null;
  skills: string | null;
  bank_name: string | null;
  bank_account: string | null;
  source: string | null;
  budget_range: string | null;
  preferences: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type ProjectRequest = {
  id: string;
  customer_id: string;
  project_name: string;
  project_type: string;
  design_style: string | null;
  location: string;
  room_size: string | null;
  budget: string | null;
  material_preference: string | null;
  material_package: string | null;
  reference_name: string | null;
  start_target: string | null;
  finish_target: string | null;
  notes: string | null;
  ai_description: string | null;
  ai_brief_summary: string | null;
  ai_brief_recommendations: string | null;
  inspiration_reference: string | null;
  status: string;
  admin_note: string | null;
  brief_document_status: string;
  selected_vendor_id: string | null;
  sent_to_vendor_at: string | null;
  submitted_at: string;
  updated_at: string;
  // Joined fields
  customer?: Profile;
  vendor?: Profile;
};

export type Project = {
  id: string;
  request_id: string | null;
  customer_id: string;
  vendor_id: string | null;
  title: string;
  project_type: string;
  location: string | null;
  room_size: string | null;
  design_style: string | null;
  description: string | null;
  solution: string | null;
  estimated_cost: string | null;
  final_cost: string | null;
  start_date: string | null;
  estimated_finish: string | null;
  actual_finish: string | null;
  status: string;
  progress: number;
  current_stage: string | null;
  next_task: string | null;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  customer?: Profile;
  vendor?: Profile;
};

export type Brief = {
  id: string;
  project_id: string | null;
  request_id: string | null;
  customer_id: string;
  vendor_id: string | null;
  project_title: string;
  project_type: string | null;
  location: string | null;
  room_size: string | null;
  budget: string | null;
  scope: string | null;
  material_note: string | null;
  admin_note: string | null;
  vendor_note: string | null;
  vendor_response: string | null;
  vendor_read_at: string | null;
  vendor_responded_at: string | null;
  materials: string[];
  timeline: { label: string; date: string }[];
  qc_checklist: string[];
  checklist: { id: string; label: string; completed: boolean }[];
  status: string;
  created_at: string;
  updated_at: string;
  // Joined
  customer?: Profile;
  vendor?: Profile;
  files?: BriefFile[];
};

export type BriefFile = {
  id: string;
  brief_id: string;
  name: string;
  file_type: string | null;
  size: string | null;
  storage_path: string | null;
  uploaded_by: string;
  created_at: string;
};

export type VendorEstimate = {
  id: string;
  brief_id: string;
  project_id: string | null;
  vendor_id: string;
  estimated_cost: string;
  estimated_duration: string;
  suggested_material: string | null;
  vendor_note: string | null;
  status: string;
  sent_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Rab = {
  id: string;
  project_id: string | null;
  request_id: string | null;
  customer_id: string;
  vendor_id: string | null;
  estimate_id: string | null;
  project_title: string;
  project_type: string | null;
  location: string | null;
  grand_total: string;
  vmatch_service_fee: string;
  admin_note: string | null;
  customer_note: string | null;
  revision_note: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  // Joined
  vendor_estimate?: VendorEstimate;
  customer?: Profile;
};

export type Consultation = {
  id: string;
  customer_id: string;
  project_id: string | null;
  request_id: string | null;
  project_name: string | null;
  topic: string | null;
  method: string;
  consultation_date: string | null;
  consultation_time: string | null;
  meeting_link: string | null;
  customer_need: string | null;
  customer_note: string | null;
  admin_note: string | null;
  result_note: string | null;
  request_source: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  // Joined
  customer?: Profile;
};

export type Invoice = {
  id: string;
  project_id: string | null;
  customer_id: string;
  invoice_number: string;
  project_title: string;
  payment_stage: string | null;
  total_amount: string;
  paid_amount: string | null;
  remaining_amount: string | null;
  payment_method: string | null;
  due_date: string | null;
  admin_note: string | null;
  customer_note: string | null;
  items: { id: string; label: string; amount: string }[];
  timeline: { id: string; title: string; description: string; time: string; type: string }[];
  status: string;
  issued_at: string;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
};

export type VendorPayout = {
  id: string;
  project_id: string | null;
  vendor_id: string;
  title: string;
  amount: string;
  due_info: string | null;
  status: string;
  paid_at: string | null;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
};

export type ProgressLog = {
  id: string;
  project_id: string;
  vendor_id: string;
  log_date: string;
  status: string;
  progress_percent: number;
  work_summary: string;
  issue: string | null;
  next_plan: string | null;
  photo_label: string | null;
  photo_path: string | null;
  admin_note: string | null;
  reviewed_at: string | null;
  created_at: string;
};

export type QcChecklist = {
  id: string;
  project_id: string;
  items: { label: string; completed: boolean }[];
  admin_note: string | null;
  customer_approved_at: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

export type VendorBonus = {
  id: string;
  project_id: string;
  vendor_id: string;
  amount: string;
  reason: string | null;
  requirements: { label: string; completed: boolean }[];
  status: string;
  approved_at: string | null;
  paid_at: string | null;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
};

export type Notification = {
  id: string;
  recipient_id: string;
  title: string;
  description: string | null;
  category: string;
  priority: string;
  deep_link_page: string | null;
  deep_link_id: string | null;
  is_read: boolean;
  admin_note: string | null;
  created_at: string;
};

export type Promo = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  cta_label: string | null;
  cta_url: string | null;
  start_date: string | null;
  end_date: string | null;
  status: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type WarrantyClaim = {
  id: string;
  project_id: string;
  customer_id: string;
  issue_type: string;
  description: string;
  incident_date: string;
  status: string;
  admin_note: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
};

export type FieldTeam = {
  id: string;
  project_id: string;
  vendor_id: string;
  name: string;
  role: string | null;
  phone: string | null;
  created_at: string;
};

export type ChatSession = {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
};

export type ChatMessage = {
  id: string;
  session_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};

export type InspirationCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  cover_image: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type InspirationItem = {
  id: string;
  category_id: string;
  title: string;
  description: string | null;
  image_url: string;
  property_type: string | null;
  location: string | null;
  design_style: string | null;
  material_package: string | null;
  tags: string[];
  sort_order: number;
  is_active: boolean;
  uploaded_by: string | null;
  created_at: string;
  updated_at: string;
  category?: InspirationCategory;
};
