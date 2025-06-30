import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { loginService, registerService } from '@/services/auth';

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