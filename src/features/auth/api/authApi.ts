import { supabase } from "@/lib/supabaseClient";

export async function SignupWithEmail(email: string, password: string) {
  return supabase.auth.signUp({ email, password });
}

export async function LoginWithEmail(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function Logout() {
  return supabase.auth.signOut();
}

export async function getUser() {
  return supabase.auth.getUser();
}
