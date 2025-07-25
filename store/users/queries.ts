import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../auth";
import { User } from "@/types/models";
import { getProfile } from "@/services/user";

export const useProfileQueries = () => {
  const { token } = useAuthStore();
  const { data: profile } = useQuery<User>({queryFn: getProfile as unknown as () => Promise<User>, queryKey: ['profile'], enabled: !!token?.access_token});

  return {
    ...profile
  };
};