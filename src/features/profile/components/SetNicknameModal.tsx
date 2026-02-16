import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { nicknameRules } from "../lib/validation";

type SubmitResult = { ok: true } | { ok: false; message: string };

type Props = {
  open: boolean;
  loading?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit: (nickname: string) => Promise<SubmitResult>;
};

export default function SetNicknameModal({
  open,
  loading = false,
  onOpenChange,
  onSubmit,
}: Props) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) return;
        onOpenChange?.(nextOpen);
      }}
    >
      <DialogContent
        className="bg-bg-elevated sm:max-w-[420px]"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="typo-heading-md text-text-primary">
            닉네임 설정
          </DialogTitle>
          <DialogDescription className="typo-label-sm text-text-secondary">
            닉네임은 언제든지 변경할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="nickname" className="typo-label-sm text-text-primary">
            닉네임
          </Label>
          <Input
            className="border-border-subtitle typo-label-sm w-full rounded-md border"
            id="nickname"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError(null);
            }}
            disabled={loading}
            autoFocus
          />
          {error && <p className="typo-label-sm text-status-danger">{error}</p>}
        </div>

        <DialogFooter>
          <Button
            className="btn-primary typo-label-sm text-text-inverse w-full cursor-pointer rounded-full py-2 font-medium"
            disabled={loading}
            onClick={async () => {
              const message = nicknameRules(value);
              if (message) {
                setError(message);
                return;
              }

              const result = await onSubmit(value);
              if (!result.ok) {
                setError(result.message);
              }
            }}
          >
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

