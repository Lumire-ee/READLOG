import type { LibraryFolder, UserBookWithInfo } from "@/shared/types/db";

export type LibraryFolderEntry = {
  folder: LibraryFolder;
  books: UserBookWithInfo[];
};

export type FolderOption = {
  id: string;
  name: string;
};
