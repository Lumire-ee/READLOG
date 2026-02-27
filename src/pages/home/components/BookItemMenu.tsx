import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";

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
                "hover:bg-bg-surface-hover border-0 bg-transparent shadow-none",
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

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent
          onClick={(event) => event.stopPropagation()}
          onEscapeKeyDown={() => setIsDeleteDialogOpen(false)}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>도서를 삭제할까요?</AlertDialogTitle>
            <span className="text-text-primary mb-3 block truncate font-semibold">
              {bookTitle}
            </span>
            <AlertDialogDescription>
              목록에서 삭제하면 기록하신 독서 활동 데이터가 함께 삭제되며,
              <br />
              다시 복구하실 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeleting}
              className="hover:bg-bg-surface-hover border-0 bg-transparent shadow-none"
            >
              취소
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={onDelete}
              className="hover:bg-bg-surface-hover text-text-primary hover:text-accent-red focus:text-accent-red border-0 bg-transparent shadow-none"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

