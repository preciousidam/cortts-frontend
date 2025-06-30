import api from '../libs/api';
import { AxiosError } from 'axios';

type QueryFnArgs = {
  queryKey: readonly [string, Record<string, any>?];
};

export const queryFn = async <T = any>({ queryKey }: QueryFnArgs): Promise<T> => {
  const [url, params] = queryKey;
  const response = await api.get(url, { params });
  return response.data;
};

type MutationMethod = 'post' | 'put' | 'patch' | 'delete';
type AcceptedBody = FormData | Record<string, any>;

type MutationOptions = {
  method?: MutationMethod;
  url: string;
  data?: any;
};

export const mutationFn = async <T = any>({ method = 'post', url, data }: MutationOptions): Promise<T> => {
  const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;

  try {
    const response = await api.request({
      method,
      url,
      data,
      headers: isFormData
        ? { 'Content-Type': 'multipart/form-data' }
        : { 'Content-Type': 'application/json', Accept: 'application/json' },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return error as unknown as T;
    }
    throw error;
  }
};