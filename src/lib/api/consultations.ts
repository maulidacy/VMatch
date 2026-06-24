import { createClient } from "@/lib/supabase/client";
import type { Consultation } from "@/lib/supabase/types";

const supabase = () => createClient();

export async function getConsultations() {
  const { data, error } = await supabase()
    .from("consultations")
    .select("*, customer:profiles!customer_id(*)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Consultation[];
}

export async function getMyConsultations(userId: string) {
  const { data, error } = await supabase()
    .from("consultations")
    .select("*")
    .eq("customer_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Consultation[];
}

export async function createConsultation(payload: Partial<Consultation>) {
  const { data, error } = await supabase()
    .from("consultations")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data as Consultation;
}

export async function updateConsultation(id: string, payload: Partial<Consultation>) {
  const { data, error } = await supabase()
    .from("consultations")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Consultation;
}

export async function deleteConsultation(id: string) {
  const { error } = await supabase().from("consultations").delete().eq("id", id);
  if (error) throw error;
}
