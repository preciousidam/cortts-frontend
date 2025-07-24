import { mutationFn } from '@/store/query';
import { ForgotPasswordReq, LoginRes, RegisterReq, VerifyReq, ResetPasswordReq } from '@/types';

export const loginService = async (data: FormData): Promise<LoginRes> => {
  return mutationFn<LoginRes>({
    url: '/auth/login',
    method: 'post',
    data,
  });
};

export const registerService = async (data: RegisterReq): Promise<any> => {
  return mutationFn<LoginRes>({
    url: '/auth/register',
    method: 'post',
    data,
  });
};

export const verifyService = async (data: VerifyReq): Promise<LoginRes> => {
  return mutationFn<LoginRes>({
    url: '/auth/verify',
    method: 'post',
    data,
  });
};

export const forgotPasswordService = async (data: ForgotPasswordReq): Promise<any> => {
  return mutationFn({
    url: '/auth/forgot-password',
    method: 'post',
    data,
  });
};

export const resetPasswordService = async (data: ResetPasswordReq): Promise<any> => {
  return mutationFn({
    url: '/auth/reset-password',
    method: 'post',
    data,
  });
};