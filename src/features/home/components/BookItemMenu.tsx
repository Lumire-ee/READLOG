import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { AlertTriangle, EllipsisVertical, Pencil, Trash2 } from "lucide-react";

type BookItemMenuProps = {
  bookTitle: string;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
  triggerClassName?: string;
};

export default function BookItemMenu({
  bookTitle,
  onEdit,
  onDelete,
  isDeleting = false,
  triggerClassName,
}: BookItemMenuProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      <div onClick={(event) => event.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="iconGhost"
              size="icon-sm"
              data-item-menu="true"
              aria-label="항목 메뉴 열기"
              className={cn(
                "hover:bg-bg-surface-hover text-text-primary border-0 bg-transparent shadow-none",
                triggerClassName,
              )}
              onClick={(event) => event.stopPropagation()}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.stopPropagation();
                }
              }}
            >
              <EllipsisVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent onClick={(event) => event.stopPropagation()}>
            <DropdownMenuItem onClick={onEdit}>
              <Pencil className="size-4" />
              수정
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:text-accent-red focus:text-accent-red"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="size-4" />
              삭제
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent
          className="bg-bg-elevated"
          onClick={(event) => event.stopPropagation()}
          onEscapeKeyDown={() => setIsDeleteDialogOpen(false)}
        >
          <DialogHeader className="items-center text-center sm:text-center">
            <AlertTriangle
              aria-hidden="true"
              className="text-accent-red/80 mb-1 size-9"
            />
            <DialogTitle>도서를 삭제할까요?</DialogTitle>
            <div className="mb-3 flex items-center justify-center gap-2">
              <span
                aria-hidden
                className="bg-accent-indigo h-4 w-0.5 shrink-0 rounded-full"
              />
              <span className="text-text-primary block truncate font-semibold">
                {bookTitle}
              </span>
            </div>
            <DialogDescription>
              목록에서 삭제하면 기록하신 독서 활동 데이터가 함께 삭제되며,
              <br />
              다시 복구하실 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row justify-center sm:justify-center">
            <Button
              type="button"
              variant="dialogCancel"
              disabled={isDeleting}
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              취소
            </Button>
            <Button
              type="button"
              variant="dialogDanger"
              disabled={isDeleting}
              onClick={onDelete}
            >
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
