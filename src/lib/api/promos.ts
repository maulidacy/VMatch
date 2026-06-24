import { createClient } from "@/lib/supabase/client";
import type { Promo } from "@/lib/supabase/types";

const supabase = () => createClient();

export async function getActivePromo(): Promise<Promo | null> {
  const { data, error } = await supabase()
    .from("promos")
    .select("*")
    .eq("status", "Aktif")
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data as Promo | null;
}

export async function getPromos() {
  const { data, error } = await supabase()
    .from("promos")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Promo[];
}

export async function createPromo(payload: Partial<Promo>) {
  const { data, error } = await supabase()
    .from("promos")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data as Promo;
}

export async function updatePromo(id: string, payload: Partial<Promo>) {
  const { data, error } = await supabase()
    .from("promos")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Promo;
}

export async function deletePromo(id: string) {
  const { error } = await supabase().from("promos").delete().eq("id", id);
  if (error) throw error;
}
