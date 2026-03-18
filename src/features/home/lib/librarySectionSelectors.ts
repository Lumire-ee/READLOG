import type { LibraryFolder, UserBookWithInfo } from "@/shared/types/db";
import type { FolderOption, LibraryFolderEntry } from "@/features/home/lib/types";

export function deriveSelection(
  items: UserBookWithInfo[],
  selectedIds: Set<string>,
) {
  const availableBookIdSet = new Set(items.map((item) => item.id));
  const selectedBookIds: string[] = [];
  for (const id of selectedIds) {
    if (availableBookIdSet.has(id)) {
      selectedBookIds.push(id);
    }
  }

  const selectedBookIdSet = new Set(selectedBookIds);
  const selectedBooks = items.filter((item) => selectedBookIdSet.has(item.id));

  return {
    availableBookIdSet,
    selectedBookIds,
    selectedBookIdSet,
    selectedBooks,
  };
}

export function deriveLibraryCollections(
  items: UserBookWithInfo[],
  folders: LibraryFolder[],
) {
  const booksByFolder = new Map<string, UserBookWithInfo[]>();
  const unfiledBooks: UserBookWithInfo[] = [];

  for (const item of items) {
    if (!item.folder_id) {
      unfiledBooks.push(item);
      continue;
    }
    const list = booksByFolder.get(item.folder_id) ?? [];
    list.push(item);
    booksByFolder.set(item.folder_id, list);
  }

  const folderEntries = folders
    .map(
      (folder): LibraryFolderEntry => ({
        folder,
        books: booksByFolder.get(folder.id) ?? [],
      }),
    )
    .filter((entry) => entry.books.length > 0);

  const folderOptions: FolderOption[] = folderEntries.map(({ folder }) => ({
    id: folder.id,
    name: folder.name,
  }));

  return {
    folderEntries,
    folderOptions,
    unfiledBooks,
  };
}

export function resolveExpandedFolderId(
  expandedFolderId: string | null,
  folderEntries: LibraryFolderEntry[],
) {
  if (!expandedFolderId) return null;
  if (folderEntries.some(({ folder }) => folder.id === expandedFolderId)) {
    return expandedFolderId;
  }
  return null;
}

export function resolveCoverUserBookId(
  coverUserBookId: string,
  selectedBooks: UserBookWithInfo[],
) {
  if (selectedBooks.length === 0) return "";
  if (selectedBooks.some((book) => book.id === coverUserBookId)) {
    return coverUserBookId;
  }
  return selectedBooks[0].id;
}
