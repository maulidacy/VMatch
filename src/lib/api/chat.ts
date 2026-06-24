import { createClient } from "@/lib/supabase/client";
import type { ChatSession, ChatMessage } from "@/lib/supabase/types";

const supabase = () => createClient();

export async function getChatSessions(userId: string) {
  const { data, error } = await supabase()
    .from("chat_sessions")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data as ChatSession[];
}

export async function getChatMessages(sessionId: string) {
  const { data, error } = await supabase()
    .from("chat_messages")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data as ChatMessage[];
}

export async function createChatSession(userId: string, title?: string) {
  const { data, error } = await supabase()
    .from("chat_sessions")
    .insert({ user_id: userId, title: title || "Percakapan Baru" })
    .select()
    .single();
  if (error) throw error;
  return data as ChatSession;
}

export async function updateChatSessionTitle(id: string, title: string) {
  const { error } = await supabase()
    .from("chat_sessions")
    .update({ title })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteChatSession(id: string) {
  const { error } = await supabase()
    .from("chat_sessions")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

export async function addChatMessage(sessionId: string, role: "user" | "assistant", content: string) {
  const { data, error } = await supabase()
    .from("chat_messages")
    .insert({ session_id: sessionId, role, content })
    .select()
    .single();
  if (error) throw error;

  // Also update session updated_at
  await supabase()
    .from("chat_sessions")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", sessionId);

  return data as ChatMessage;
}
