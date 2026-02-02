import { useContext } from "react";
import { AuthContext } from "../provider/AuthContext";

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("AuthProvider 내에서만 사용할 수 있습니다.");
  }
  return context;
}
