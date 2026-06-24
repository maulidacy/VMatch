import { createClient } from "@/lib/supabase/client";
import type { Notification } from "@/lib/supabase/types";

const supabase = () => createClient();

export async function getNotifications(userId: string) {
  const { data, error } = await supabase()
    .from("notifications")
    .select("*")
    .eq("recipient_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw error;
  return data as Notification[];
}

export async function getUnreadCount(userId: string) {
  const { count, error } = await supabase()
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("recipient_id", userId)
    .eq("is_read", false);
  if (error) throw error;
  return count ?? 0;
}

export async function markNotificationRead(id: string) {
  const { error } = await supabase()
    .from("notifications")
    .update({ is_read: true })
    .eq("id", id);
  if (error) throw error;
}

export async function markAllNotificationsRead(userId: string) {
  const { error } = await supabase()
    .from("notifications")
    .update({ is_read: true })
    .eq("recipient_id", userId)
    .eq("is_read", false);
  if (error) throw error;
}

export async function createNotification(payload: Partial<Notification>) {
  const { data, error } = await supabase()
    .from("notifications")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data as Notification;
}

export async function deleteNotification(id: string) {
  const { error } = await supabase().from("notifications").delete().eq("id", id);
  if (error) throw error;
}

// Admin: get all notifications
export async function getAllNotifications() {
  const { data, error } = await supabase()
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw error;
  return data as Notification[];
}
