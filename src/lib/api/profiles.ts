import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/supabase/types";

const supabase = () => createClient();

export async function getProfile(id: string) {
  const { data, error } = await supabase()
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as Profile;
}

export async function updateProfile(id: string, payload: Partial<Profile>) {
  const { data, error } = await supabase()
    .from("profiles")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Profile;
}

export async function getCustomers() {
  const { data, error } = await supabase()
    .from("profiles")
    .select("*")
    .eq("role", "user")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Profile[];
}

export async function getVendors() {
  const { data, error } = await supabase()
    .from("profiles")
    .select("*")
    .eq("role", "vendor")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Profile[];
}

export async function getAllProfiles() {
  const { data, error } = await supabase()
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Profile[];
}
