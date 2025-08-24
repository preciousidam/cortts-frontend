import { mutationFn, queryFn } from "@/store/query";
import { IResonse } from "@/types";
import { Document, Payment, SignedDocument, Template, Unit, UnitAgent } from "@/types/models";

export const getUnits = async () => {
  return queryFn<IResonse<Unit[]>>({
    queryKey: ['unit/', {limit: 100, skip: 0}],
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

export const getUnitAgents = async (id: string) => {
  return queryFn<IResonse<UnitAgent[]>>({
    queryKey: [`/unit_agents/unit/${id}`,  {id}],
  });
};

export const getUnitPayments = async (id: string) => {
  return queryFn<IResonse<Payment[]>>({
    queryKey: [`/unit/${id}/payments`,  {id, limit: 100, skip: 0}],
  });
};

export const getUnitDocuments = async (id: string) => {
  return queryFn<IResonse<Document[]>>({
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