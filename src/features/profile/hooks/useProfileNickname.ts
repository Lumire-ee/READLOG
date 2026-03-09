import { useQuery } from "@tanstack/react-query";
import { getProfileNickname } from "@/features/profile/api/profileApi";

export function useProfileNickname(userId: string | null) {
  return useQuery({
    queryKey: ["profileNickname", userId],
    queryFn: async () => {
      if (!userId) return null;
      const { nickname, error } = await getProfileNickname(userId);
      if (error) throw error;
      return nickname;
    },
    enabled: Boolean(userId),
  });
}
