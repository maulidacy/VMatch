import { createClient } from "@/lib/supabase/client";
import type { ProjectRequest, Project, Brief, VendorEstimate, Rab, ProgressLog, Invoice, VendorPayout, VendorBonus, QcChecklist, FieldTeam, WarrantyClaim } from "@/lib/supabase/types";

const supabase = () => createClient();

// ===================== PROJECT REQUESTS =====================

export async function getProjectRequests() {
  const { data, error } = await supabase()
    .from("project_requests")
    .select("*, customer:profiles!customer_id(*), vendor:profiles!selected_vendor_id(*)")
    .neq("status", "Draft")
    .order("submitted_at", { ascending: false });
  if (error) throw error;
  return data as ProjectRequest[];
}

export async function getMyProjectRequests(userId: string) {
  const { data, error } = await supabase()
    .from("project_requests")
    .select("*")
    .eq("customer_id", userId)
    .order("submitted_at", { ascending: false });
  if (error) throw error;
  return data as ProjectRequest[];
}

export async function createProjectRequest(payload: Partial<ProjectRequest>) {
  const { data, error } = await supabase()
    .from("project_requests")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data as ProjectRequest;
}

export async function updateProjectRequest(id: string, payload: Partial<ProjectRequest>) {
  const { data, error } = await supabase()
    .from("project_requests")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as ProjectRequest;
}

// ===================== PROJECTS =====================

export async function getProjects() {
  const { data, error } = await supabase()
    .from("projects")
    .select("*, customer:profiles!customer_id(*), vendor:profiles!vendor_id(*)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Project[];
}

export async function getMyProjects(userId: string) {
  const { data, error } = await supabase()
    .from("projects")
    .select("*, customer:profiles!customer_id(*), vendor:profiles!vendor_id(*)")
    .or(`customer_id.eq.${userId},vendor_id.eq.${userId}`)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Project[];
}

export async function getProjectById(id: string) {
  const { data, error } = await supabase()
    .from("projects")
    .select("*, customer:profiles!customer_id(*), vendor:profiles!vendor_id(*)")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as Project;
}

export async function createProject(payload: Partial<Project>) {
  const { data, error } = await supabase()
    .from("projects")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data as Project;
}

export async function updateProject(id: string, payload: Partial<Project>) {
  const { data, error } = await supabase()
    .from("projects")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Project;
}

// ===================== BRIEFS =====================

export async function getBriefs() {
  const { data, error } = await supabase()
    .from("briefs")
    .select("*, customer:profiles!customer_id(*), vendor:profiles!vendor_id(*)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Brief[];
}

export async function getVendorBriefs(vendorId: string) {
  const { data, error } = await supabase()
    .from("briefs")
    .select("*")
    .eq("vendor_id", vendorId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Brief[];
}

export async function createBrief(payload: Partial<Brief>) {
  const { data, error } = await supabase()
    .from("briefs")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data as Brief;
}

export async function updateBrief(id: string, payload: Partial<Brief>) {
  const { data, error } = await supabase()
    .from("briefs")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Brief;
}

// ===================== VENDOR ESTIMATES =====================

export async function getVendorEstimates(vendorId: string) {
  const { data, error } = await supabase()
    .from("vendor_estimates")
    .select("*")
    .eq("vendor_id", vendorId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as VendorEstimate[];
}

export async function createVendorEstimate(payload: Partial<VendorEstimate>) {
  const { data, error } = await supabase()
    .from("vendor_estimates")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data as VendorEstimate;
}

export async function updateVendorEstimate(id: string, payload: Partial<VendorEstimate>) {
  const { data, error } = await supabase()
    .from("vendor_estimates")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as VendorEstimate;
}

// ===================== RAB =====================

export async function getRabs() {
  const { data, error } = await supabase()
    .from("rab")
    .select("*, customer:profiles!customer_id(*), vendor_estimate:vendor_estimates!estimate_id(*)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Rab[];
}

export async function getCustomerRabs(customerId: string) {
  const { data, error } = await supabase()
    .from("rab")
    .select("*, vendor_estimate:vendor_estimates!estimate_id(*)")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Rab[];
}

export async function createRab(payload: Partial<Rab>) {
  const { data, error } = await supabase()
    .from("rab")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data as Rab;
}

export async function updateRab(id: string, payload: Partial<Rab>) {
  const { data, error } = await supabase()
    .from("rab")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Rab;
}

// ===================== PROGRESS LOGS =====================

export async function getProgressLogs(projectId: string) {
  const { data, error } = await supabase()
    .from("progress_logs")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as ProgressLog[];
}

export async function getAllProgressLogs() {
  const { data, error } = await supabase()
    .from("progress_logs")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as ProgressLog[];
}

export async function createProgressLog(payload: Partial<ProgressLog>) {
  const { data, error } = await supabase()
    .from("progress_logs")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data as ProgressLog;
}

export async function updateProgressLog(id: string, payload: Partial<ProgressLog>) {
  const { data, error } = await supabase()
    .from("progress_logs")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as ProgressLog;
}

// ===================== INVOICES =====================

export async function getInvoices() {
  const { data, error } = await supabase()
    .from("invoices")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Invoice[];
}

export async function getCustomerInvoices(customerId: string) {
  const { data, error } = await supabase()
    .from("invoices")
    .select("*")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Invoice[];
}

export async function getProjectInvoices(projectId: string) {
  const { data, error } = await supabase()
    .from("invoices")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Invoice[];
}

export async function createInvoice(payload: Partial<Invoice>) {
  const { data, error } = await supabase()
    .from("invoices")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data as Invoice;
}

export async function updateInvoice(id: string, payload: Partial<Invoice>) {
  const { data, error } = await supabase()
    .from("invoices")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Invoice;
}

// ===================== VENDOR PAYOUTS =====================

export async function getVendorPayouts(vendorId: string) {
  const { data, error } = await supabase()
    .from("vendor_payouts")
    .select("*")
    .eq("vendor_id", vendorId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as VendorPayout[];
}

export async function getAllVendorPayouts() {
  const { data, error } = await supabase()
    .from("vendor_payouts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as VendorPayout[];
}

export async function createVendorPayout(payload: Partial<VendorPayout>) {
  const { data, error } = await supabase()
    .from("vendor_payouts")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data as VendorPayout;
}

export async function updateVendorPayout(id: string, payload: Partial<VendorPayout>) {
  const { data, error } = await supabase()
    .from("vendor_payouts")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as VendorPayout;
}

// ===================== VENDOR BONUSES =====================

export async function getVendorBonuses(vendorId: string) {
  const { data, error } = await supabase()
    .from("vendor_bonuses")
    .select("*")
    .eq("vendor_id", vendorId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as VendorBonus[];
}

export async function getAllVendorBonuses() {
  const { data, error } = await supabase()
    .from("vendor_bonuses")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as VendorBonus[];
}

export async function updateVendorBonus(id: string, payload: Partial<VendorBonus>) {
  const { data, error } = await supabase()
    .from("vendor_bonuses")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as VendorBonus;
}

export async function createVendorBonus(payload: Partial<VendorBonus>) {
  const { data, error } = await supabase()
    .from("vendor_bonuses")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data as VendorBonus;
}

// ===================== QC CHECKLISTS =====================

export async function getQcChecklist(projectId: string) {
  const { data, error } = await supabase()
    .from("qc_checklists")
    .select("*")
    .eq("project_id", projectId)
    .maybeSingle();
  if (error) throw error;
  return data as QcChecklist | null;
}

export async function upsertQcChecklist(payload: Partial<QcChecklist> & { project_id: string }) {
  const { data, error } = await supabase()
    .from("qc_checklists")
    .upsert(payload, { onConflict: "project_id" })
    .select()
    .single();
  if (error) throw error;
  return data as QcChecklist;
}

// ===================== FIELD TEAMS =====================

export async function getFieldTeams(projectId: string) {
  const { data, error } = await supabase()
    .from("field_teams")
    .select("*")
    .eq("project_id", projectId);
  if (error) throw error;
  return data as FieldTeam[];
}

export async function createFieldTeamMember(payload: Partial<FieldTeam>) {
  const { data, error } = await supabase()
    .from("field_teams")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data as FieldTeam;
}

export async function deleteFieldTeamMember(id: string) {
  const { error } = await supabase().from("field_teams").delete().eq("id", id);
  if (error) throw error;
}

// ===================== WARRANTY CLAIMS =====================

export async function getWarrantyClaims(projectId: string) {
  const { data, error } = await supabase()
    .from("warranty_claims")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as WarrantyClaim[];
}

export async function createWarrantyClaim(payload: Partial<WarrantyClaim>) {
  const { data, error } = await supabase()
    .from("warranty_claims")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data as WarrantyClaim;
}
