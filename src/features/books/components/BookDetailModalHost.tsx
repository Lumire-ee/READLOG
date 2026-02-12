import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useBookDetailModalStore } from "@/features/books/store/useBookDetailModalStore";
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
      <DialogContent className="bg-bg-elevated sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="typo-heading-md text-text-primary">
            책 상세보기
          </DialogTitle>
        </DialogHeader>
        {selectedUserBookId ? (
          <BookDetailModalContent userBookId={selectedUserBookId} />
        ) : (
          <p className="typo-label-sm text-text-secondary">
            선택된 책이 없습니다.
          </p>
        )}
        {/* TODO: 책 상세/수정 폼 */}
      </DialogContent>
    </Dialog>
  );
}
