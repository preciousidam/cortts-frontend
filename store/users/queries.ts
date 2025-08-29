import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../auth";
import { User } from "@/types/models";
import { getProfile, getUser, getUsers } from "@/services/user";
import { IResponse } from "@/types";

export const useProfileQueries = () => {
  const { token } = useAuthStore();
  const { data: profile } = useQuery<User>({queryFn: getProfile as unknown as () => Promise<User>, queryKey: ['profile'], enabled: !!token?.access_token});

  return {
    ...profile
  };
};

export const useGetUsersQuery = (skip: number = 0) => {
  const { token } = useAuthStore();

  const { data, ...rest } = useQuery<IResponse<User[]>>({queryFn: getUsers, queryKey: ['/users/', {limit: 100, skip}], enabled: !!token?.access_token, refetchOnMount: true, refetchOnWindowFocus: true, retry: true, retryDelay: 2000});

  return {
    users: data?.data || [],
    count: data?.count || 0,
    ...rest
  };
};

export const useGetUser = (id: string) => {
  const { token } = useAuthStore();

  const { data, ...rest } = useQuery<User>({queryFn: getUser, queryKey: ['/users/'+id], enabled: !!token?.access_token});

  return {
    user: data,
    ...rest
  };
};
