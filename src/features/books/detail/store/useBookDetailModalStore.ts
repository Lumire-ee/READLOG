import { create } from "zustand";

type BookDetailModalState = {
  isOpen: boolean;
  selectedUserBookId: string | null;
  open: (userBookId: string) => void;
  close: () => void;
};

export const useBookDetailModalStore = create<BookDetailModalState>((set) => ({
  // DEV
  isOpen: true,
  selectedUserBookId: "92b84ef6-7dd6-4d38-8a3f-a79625726cf6",
  open: (userBookId: string) =>
    set({ isOpen: true, selectedUserBookId: userBookId }),
  close: () => set({ isOpen: false, selectedUserBookId: null }),
}));
