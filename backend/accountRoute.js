import express from "express";
import { getSupabaseAdmin } from "./supabaseAdmin.js";

export const accountRoute = express.Router();

const REAUTH_WINDOW_MS = 5 * 60 * 1000;

async function getAuthUser(req, res) {
  const authHeader = req.headers.authorization ?? "";
  if (!authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      code: "missing_bearer_token",
      error: "Missing bearer token",
    });
    return null;
  }

  const token = authHeader.slice("Bearer ".length).trim();
  if (!token) {
    res.status(401).json({
      code: "missing_access_token",
      error: "Missing access token",
    });
    return null;
  }

  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) {
    res.status(401).json({
      code: "invalid_access_token",
      error: "Invalid access token",
    });
    return null;
  }

  return data.user;
}

function isWithinReauthWindow(lastSignInAt) {
  if (typeof lastSignInAt !== "string") return false;

  const lastSignInTime = new Date(lastSignInAt).getTime();
  if (!Number.isFinite(lastSignInTime)) return false;

  return Date.now() - lastSignInTime <= REAUTH_WINDOW_MS;
}

accountRoute.delete("/account", async (req, res) => {
  const user = await getAuthUser(req, res);
  if (!user) return;

  if (!isWithinReauthWindow(user.last_sign_in_at)) {
    res.status(401).json({
      code: "reauthentication_needed",
      error: "Recent reauthentication is required",
    });
    return;
  }

  const supabaseAdmin = getSupabaseAdmin();

  const { error: deleteFoldersError } = await supabaseAdmin
    .from("library_folders")
    .delete()
    .eq("user_id", user.id);
  if (deleteFoldersError) {
    res.status(500).json({
      code: "delete_data_failed",
      error: deleteFoldersError.message,
    });
    return;
  }

  const { error: deleteBooksError } = await supabaseAdmin
    .from("user_books")
    .delete()
    .eq("user_id", user.id);
  if (deleteBooksError) {
    res.status(500).json({
      code: "delete_data_failed",
      error: deleteBooksError.message,
    });
    return;
  }

  const { error: deleteProfileError } = await supabaseAdmin
    .from("profiles")
    .delete()
    .eq("user_id", user.id);
  if (deleteProfileError) {
    res.status(500).json({
      code: "delete_data_failed",
      error: deleteProfileError.message,
    });
    return;
  }

  const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(
    user.id,
  );
  if (deleteUserError) {
    res.status(500).json({
      code: "delete_account_failed",
      error: deleteUserError.message,
    });
    return;
  }

  res.status(204).send();
});
