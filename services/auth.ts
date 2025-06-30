import { mutationFn } from '@/store/query';
import { LoginRes } from '@/types';

export const loginService = async (data: FormData): Promise<LoginRes> => {
  return mutationFn<LoginRes>({
    url: '/auth/login',
    method: 'post',
    data,
  });
};

export const registerService = async (data: FormData): Promise<LoginRes> => {
  return mutationFn<LoginRes>({
    url: '/auth/register',
    method: 'post',
    data,
  });
};
