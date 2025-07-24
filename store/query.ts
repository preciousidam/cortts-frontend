import { AxiosError, AxiosResponse } from 'axios';
import api from '../libs/api';

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

  const response: AxiosResponse<T, AxiosError> = await api.request({
    method,
    url,
    data,
    headers: isFormData
      ? { 'Content-Type': 'multipart/form-data' }
      : { 'Content-Type': 'application/json', Accept: 'application/json' },
  });
  console.log(response.data, 'response.data');

  return response.data;
};