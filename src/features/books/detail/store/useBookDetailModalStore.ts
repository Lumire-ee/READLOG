import { create } from "zustand";

type BookDetailModalState = {
  isOpen: boolean;
  selectedUserBookId: string | null;
  open: (userBookId: string) => void;
  close: () => void;
};

export const useBookDetailModalStore = create<BookDetailModalState>((set) => ({
  isOpen: false,
  selectedUserBookId: null,
  open: (userBookId: string) =>
    set({ isOpen: true, selectedUserBookId: userBookId }),
  close: () => set({ isOpen: false, selectedUserBookId: null }),
}));

