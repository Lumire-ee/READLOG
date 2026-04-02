import { supabase } from "@/lib/supabaseClient";
import type { LibraryFolder } from "@/shared/types/db";

export async function fetchLibraryFolders(userId: string) {
  const { data, error } = await supabase
    .from("library_folders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as LibraryFolder[];
}

export async function createLibraryFolder(params: {
  name: string;
  userBookIds: string[];
  coverUserBookId: string;
}) {
  const { data, error } = await supabase.rpc("create_library_folder", {
    p_name: params.name,
    p_user_book_ids: params.userBookIds,
    p_cover_user_book_id: params.coverUserBookId,
  });

  if (error) throw error;
  return data as string;
}

export async function moveLibraryBooks(params: {
  userBookIds: string[];
  targetFolderId: string | null;
}) {
  const { data, error } = await supabase.rpc("move_library_books", {
    p_user_book_ids: params.userBookIds,
    p_target_folder_id: params.targetFolderId,
  });

  if (error) throw error;
  return data as number;
}

export async function deleteLibraryBooks(userBookIds: string[]) {
  const { data, error } = await supabase.rpc("delete_library_books", {
    p_user_book_ids: userBookIds,
  });

  if (error) throw error;
  return data as number;
}

export async function deleteLibraryFolder(params: {
  folderId: string;
  deleteBooks: boolean;
}) {
  const { error } = await supabase.rpc("delete_library_folder", {
    p_folder_id: params.folderId,
    p_delete_books: params.deleteBooks,
  });

  if (error) throw error;
}

export async function renameLibraryFolder(params: {
  folderId: string;
  name: string;
}) {
  const trimmedName = params.name.trim();
  const { error } = await supabase
    .from("library_folders")
    .update({ name: trimmedName })
    .eq("id", params.folderId);

  if (error) throw error;
}
