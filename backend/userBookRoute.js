import express from "express";
import { getSupabaseAdmin } from "./supabaseAdmin.js";
import { decryptNote, encryptNote } from "./notesCrypto.js";

export const userBookRoute = express.Router();

async function getAuthUser(req, res) {
  const authHeader = req.headers.authorization ?? "";
  if (!authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing bearer token" });
    return null;
  }

  const token = authHeader.slice("Bearer ".length).trim();
  if (!token) {
    res.status(401).json({ error: "Missing access token" });
    return null;
  }

  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) {
    res.status(401).json({ error: "Invalid access token" });
    return null;
  }

  return data.user;
}

function withDecryptedNote(row) {
  if (!row) return row;
  return {
    ...row,
    notes_md: decryptNote(row.notes_md),
  };
}

userBookRoute.get("/user-books/:userBookId", async (req, res) => {
  const user = await getAuthUser(req, res);
  if (!user) return;

  const { userBookId } = req.params;
  const supabaseAdmin = getSupabaseAdmin();

  const { data, error } = await supabaseAdmin
    .from("user_books")
    .select("*, book:books(*)")
    .eq("id", userBookId)
    .eq("user_id", user.id)
    .single();

  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }

  res.json(withDecryptedNote(data));
});

userBookRoute.patch("/user-books/:userBookId", async (req, res) => {
  const user = await getAuthUser(req, res);
  if (!user) return;

  const { userBookId } = req.params;
  const patch = req.body ?? {};

  if (Object.prototype.hasOwnProperty.call(patch, "notes_md")) {
    if (patch.notes_md === null) {
      patch.notes_md = null;
    } else if (typeof patch.notes_md === "string") {
      patch.notes_md = encryptNote(patch.notes_md);
    } else {
      res.status(400).json({ error: "notes_md must be string or null" });
      return;
    }
  }

  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from("user_books")
    .update(patch)
    .eq("id", userBookId)
    .eq("user_id", user.id)
    .select("*, book:books(*)")
    .single();

  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }

  res.json(withDecryptedNote(data));
});
