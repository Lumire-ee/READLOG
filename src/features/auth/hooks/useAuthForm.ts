import { useForm } from "react-hook-form";
import type { EmailOnlyFormValues, FormValues } from "../lib/types";

export function useAuthForm() {
  return useForm<FormValues>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: true,
    defaultValues: { email: "", password: "" },
  });
}

export function useEmailOnlyForm() {
  return useForm<EmailOnlyFormValues>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: true,
    defaultValues: { email: "" },
  });
}
