import { mutationFn, queryFn } from "@/store/query";
import { IResonse } from "@/types";
import { Unit } from "@/types/models";

export const getUnits = async () => {
  return queryFn<IResonse<Unit[]>>({
    queryKey: ['unit/'],
  });
};

export const getUnit = async (id: string) => {
  return queryFn<Unit>({
    queryKey: [`unit/${id}`],
  });
};

export const updateUnit = async (id: string, data: Unit) => {
  return mutationFn<Unit>({
    method: 'patch',
    url: `/unit/${id}`,
    data,
  });
};

export const createUnit = async (data: Unit) => {
  return mutationFn<Unit>({
    method: 'post',
    url: '/unit/',
    data,
  });
};

export const deleteUnit = async (id: string) => {
  return mutationFn<Unit>({
    method: 'delete',
    url: `/unit/${id}`,
  });
};