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

export async function requestPasswordReset(email: string) {
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
}

export async function updatePassword(password: string) {
  return supabase.auth.updateUser({ password });
}

export async function getUser() {
  return supabase.auth.getUser();
}

export async function signInWithOAuth(provider: "google" | "kakao") {
  return supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${window.location.origin}/onboarding` },
  });
}
