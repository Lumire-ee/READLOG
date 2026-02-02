import { useForm } from "react-hook-form";
import type { FormValues } from "../lib/types";

export function useAuthForm() {
  return useForm<FormValues>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: true,
    defaultValues: { email: "", password: "" },
  });
}
