import { createClient } from "@/lib/supabase/client";
import type { InspirationCategory, InspirationItem } from "@/lib/supabase/types";

const supabase = () => createClient();

export async function getInspirationCategories() {
  const { data, error } = await supabase()
    .from("inspiration_categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");
  if (error) throw error;
  return data as InspirationCategory[];
}

export async function getAllInspirationCategories() {
  const { data, error } = await supabase()
    .from("inspiration_categories")
    .select("*")
    .order("sort_order");
  if (error) throw error;
  return data as InspirationCategory[];
}

export async function getInspirationItems(categoryId?: string) {
  let query = supabase()
    .from("inspiration_items")
    .select("*, category:inspiration_categories(*)")
    .eq("is_active", true)
    .order("sort_order");

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as InspirationItem[];
}

export async function getAllInspirationItems() {
  const { data, error } = await supabase()
    .from("inspiration_items")
    .select("*, category:inspiration_categories(*)")
    .order("sort_order");
  if (error) throw error;
  return data as InspirationItem[];
}

export async function createInspirationCategory(payload: Partial<InspirationCategory>) {
  const { data, error } = await supabase()
    .from("inspiration_categories")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data as InspirationCategory;
}

export async function updateInspirationCategory(id: string, payload: Partial<InspirationCategory>) {
  const { data, error } = await supabase()
    .from("inspiration_categories")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as InspirationCategory;
}

export async function createInspirationItem(payload: Partial<InspirationItem>) {
  const { data, error } = await supabase()
    .from("inspiration_items")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data as InspirationItem;
}

export async function updateInspirationItem(id: string, payload: Partial<InspirationItem>) {
  const { data, error } = await supabase()
    .from("inspiration_items")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as InspirationItem;
}

export async function deleteInspirationItem(id: string) {
  const { error } = await supabase().from("inspiration_items").delete().eq("id", id);
  if (error) throw error;
}
