import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { forgotPasswordService, loginService, registerService, resetPasswordService, verifyService } from '@/services/auth';

export const useLoginMutation = <T,U>(params: Omit<UseMutationOptions<U, Error, T, unknown>, 'mutationFn'>) => {
  const {mutate: mutateLogin, ...rest} = useMutation({
    ...params,
    mutationFn: loginService as unknown as (data: T) => Promise<U>,
  });

  return {mutateLogin, ...rest}
}

export const useRegisterMutation = <T,U>(params: Omit<UseMutationOptions<U, Error, T, unknown>, 'mutationFn'>) => {
  const {mutate: mutateRegister, ...rest} = useMutation({
    ...params,
    mutationFn: registerService as unknown as (data: T) => Promise<U>,
  });

  return {mutateRegister, ...rest}
}

export const useVerifyMutation = <T,U>(params: Omit<UseMutationOptions<U, Error, T, unknown>, 'mutationFn'>) => {
  const {mutate: mutateVerify, ...rest} = useMutation({
    ...params,
    mutationFn: verifyService as unknown as (data: T) => Promise<U>,
  });

  return {mutateVerify, ...rest}
}

export const useForgotPasswordMutation = <T,U>(params: Omit<UseMutationOptions<U, Error, T, unknown>, 'mutationFn'>) => {
  const {mutate: mutateForgotPassword, ...rest} = useMutation({
    ...params,
    mutationFn: forgotPasswordService as unknown as (data: T) => Promise<U>,
  });

  return {mutateForgotPassword, ...rest}
}

export const useResetPasswordMutation = <T,U>(params: Omit<UseMutationOptions<U, Error, T, unknown>, 'mutationFn'>) => {
  const {mutate: mutateResetPassword, ...rest} = useMutation({
    ...params,
    mutationFn: resetPasswordService as unknown as (data: T) => Promise<U>,
  });

  return {mutateResetPassword, ...rest}
}