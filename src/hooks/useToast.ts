import { toast } from "sonner";
import type { SearchBook } from "@/features/books/lib/types";
import { registerBook } from "@/features/books/lib/registerBook";

type RegisterToastOptions = {
  duration?: number;
  onOpenDetail?: (userBookId: string) => void;
};

export function useToast() {
  // 책 등록 + Toast
  async function registerBookToast(
    book: SearchBook,
    options: RegisterToastOptions = {},
  ): Promise<string> {
    const { duration = 4000, onOpenDetail } = options;
    const { userBookId, isNew } = await registerBook(book);

    const message = isNew ? "책이 추가되었습니다." : "이미 등록된 책입니다.";

    const toastId = toast.success(message, {
      duration: duration,
      action: onOpenDetail
        ? {
            label: "상세보기",
            onClick: () => {
              onOpenDetail(userBookId);
              toast.dismiss(toastId);
            },
          }
        : undefined,
    });

    return userBookId;
  }

  // 회원가입 성공 Toast
  function signupSuccessToast(nickname: string) {
    toast.success(`${nickname}님, 회원가입을 축하합니다!`, {
      duration: 4000,
    });
  }

  // 에러 toast
  function errorToast(message: string) {
    toast.error(message, {
      duration: 4000,
    });
  }

  return {
    registerBookToast,
    signupSuccessToast,
    errorToast,
  };
}
