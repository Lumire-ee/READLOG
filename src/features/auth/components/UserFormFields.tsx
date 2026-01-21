import { cn } from "@/lib/utils";
import type { FormValues } from "../lib/types";
import type {
  FieldErrors,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type CommonFieldProps = {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
};

export function EmailField({
  register,
  errors,
  rules,
}: CommonFieldProps & { rules: RegisterOptions<FormValues, "email"> }) {
  return (
    <div className="space-y-2">
      <Label
        htmlFor="email"
        className={cn(
          "typo-label-sm text-label-primary",
          errors.email && "text-accent-red",
        )}
      >
        Email
      </Label>
      <Input
        id="email"
        type="email"
        className="w-full rounded-md border border-gray-2 px-3 py-2 typo-label-sm"
        autoComplete="email"
        {...register("email", rules)}
      />
      {errors.email?.message && (
        <p className="typo-label-sm text-accent-red">{errors.email.message}</p>
      )}
    </div>
  );
}

export function PasswordField({
  register,
  errors,
  rules,
  autoComplete,
}: CommonFieldProps & {
  rules: RegisterOptions<FormValues, "password">;
  autoComplete?: string;
}) {
  return (
    <div className="space-y-2">
      <Label
        htmlFor="password"
        className={cn(
          "typo-label-sm text-label-primary",
          errors.password && "text-accent-red",
        )}
      >
        Password
      </Label>

      <Input
        id="password"
        type="password"
        className="w-full rounded-md border border-gray-2 px-3 py-2 typo-label-sm"
        autoComplete={autoComplete}
        {...register("password", rules)}
      />

      {errors.password?.message && (
        <p className="typo-label-sm text-accent-red">
          {errors.password.message}
        </p>
      )}
    </div>
  );
}
