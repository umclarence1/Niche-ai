import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials not found. Some features may not work.");
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder"
);

// Database types
export interface DbAgent {
  id: string;
  name: string;
  type: string;
  specialization: string;
  model: string;
  temperature: number;
  max_steps: number;
  status: string;
  tasks_completed: number;
  tasks_running: number;
  efficiency: number;
  color: string;
  created_at: string;
  updated_at: string;
  user_id?: string;
}

export interface DbDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  mime_type: string;
  content?: string;
  storage_path?: string;
  created_at: string;
  updated_at: string;
  user_id?: string;
}

export interface DbTask {
  id: string;
  name: string;
  description: string;
  agent_id: string;
  document_id?: string;
  status: string;
  progress: number;
  input?: string;
  output?: string;
  error?: string;
  started_at?: string;
  completed_at?: string;
  duration?: string;
  created_at: string;
  user_id?: string;
}

export interface DbChatMessage {
  id: string;
  task_id?: string;
  document_id?: string;
  agent_id: string;
  role: string;
  content: string;
  created_at: string;
  user_id?: string;
}

// Storage helpers
export async function uploadDocument(file: File, userId: string = "anonymous") {
  const filePath = `${userId}/${Date.now()}-${file.name}`;

  const { data, error } = await supabase.storage
    .from("documents")
    .upload(filePath, file);

  if (error) {
    throw error;
  }

  return {
    path: data.path,
    url: supabase.storage.from("documents").getPublicUrl(data.path).data.publicUrl,
  };
}

export async function deleteStoredDocument(path: string) {
  const { error } = await supabase.storage.from("documents").remove([path]);
  if (error) {
    throw error;
  }
}

// Check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes("placeholder"));
}

export default supabase;
