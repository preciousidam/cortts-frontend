import { AxiosError, AxiosResponse } from 'axios';
import api from '../libs/api';

export type QueryFnArgs = {
  queryKey: readonly [string, Record<string, any>?];
};

export const queryFn = async <T = any>({ queryKey }: QueryFnArgs): Promise<T> => {
  const [url, params] = queryKey;
  const response = await api.get(url, { params, headers: { Accept: 'application/json'  } });
  return response.data;
};

type MutationMethod = 'post' | 'put' | 'patch' | 'delete';
type AcceptedBody = FormData | Record<string, any>;

type MutationOptions = {
  method?: MutationMethod;
  url: string;
  data?: any;
  headers?: Record<string, string>;
};

export const mutationFn = async <T = any>({ method = 'post', url, data, headers }: MutationOptions): Promise<T> => {
  const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;

  const response: AxiosResponse<T, AxiosError> = await api.request({
    method,
    url,
    data,
    headers: isFormData
      ? { 'Content-Type': 'multipart/form-data', ...headers }
      : { 'Content-Type': 'application/json', Accept: 'application/json', ...headers },
  });

  return response.data;
};