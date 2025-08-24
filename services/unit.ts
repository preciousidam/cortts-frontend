import { mutationFn, queryFn } from "@/store/query";
import { IResponse } from "@/types";
import { Document, Payment, SignedDocument, Template, Unit, UnitAgent } from "@/types/models";

export const getUnits = async () => {
  return queryFn<IResponse<Unit[]>>({
    queryKey: ['unit/', {limit: 100, skip: 0}],
  });
};

export const getUnit = async (id: string) => {
  return queryFn<Unit>({
    queryKey: [`unit/${id}`],
  });
};

export const updateUnit = async (id: string, data: Partial<Unit> & {agents?: Partial<UnitAgent>[]}) => {
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

export const getUnitAgents = async (id: string) => {
  return queryFn<IResponse<UnitAgent[]>>({
    queryKey: [`/unit_agents/unit/${id}`,  {id}],
  });
};

export const getUnitPayments = async (id: string) => {
  return queryFn<IResponse<Payment[]>>({
    queryKey: [`/unit/${id}/payments`,  {id, limit: 100, skip: 0}],
  });
};

export const getUnitDocuments = async (id: string) => {
  return queryFn<IResponse<Document[]>>({
    queryKey: [`/unit/${id}/documents`,  { limit: 100, skip: 0}],
  });
};

export const uploadTemplate = async (data: Partial<Template>) => {
  return mutationFn<Template>({
    method: 'post',
    url: 'document/templates',
    data,
  });
};

export const uploadSignedDocument = async (data: Partial<SignedDocument>) => {
  return mutationFn<SignedDocument>({
    method: 'post',
    url: 'document/signed',
    data,
  });
};