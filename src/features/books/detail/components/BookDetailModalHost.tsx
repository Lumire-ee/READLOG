import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useBookDetailModalStore } from "@/features/books/detail/store/useBookDetailModalStore";
import BookDetailModalContent from "./BookDetailModalContent";

export default function BookDetailModalHost() {
  const { isOpen, selectedUserBookId, close } = useBookDetailModalStore();

  if (!isOpen) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) close();
      }}
    >
      <DialogContent className="bg-bg-elevated min-h-80 sm:max-w-[420px]">
        {selectedUserBookId ? (
          <BookDetailModalContent userBookId={selectedUserBookId} />
        ) : (
          <p className="typo-label-sm text-text-secondary">
            선택된 책이 없습니다.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}

