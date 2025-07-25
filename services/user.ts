import { mutationFn, queryFn } from "@/store/query";
import { User } from "@/types/models";

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
