import { mutationFn, queryFn } from "@/store/query";
import { IResponse } from "@/types";
import { User } from "@/types/models";
import { QueryFunction } from "@tanstack/react-query";

export const getProfile = async () => {
  return queryFn<User>({
    queryKey: ['users/me'],
  });
};

export const updateProfile = async (data: User) => {
  return mutationFn({
    method: 'patch',
    url: '/users/me',
    data,
  });
};

export const getUsers: QueryFunction<IResponse<User[]>, readonly unknown[], never> = async (options) => {
  return queryFn<IResponse<User[]>>({
   queryKey: ['/users/', options?.queryKey[1] || {}],
  });
};

export const getUser: QueryFunction<User, readonly unknown[], never> = async (options) => {
  return queryFn<User>({
    queryKey: [options.queryKey[0] as string],
  });
};