import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../auth";
import { Document, Payment, Unit, UnitAgent } from "@/types/models";
import { IResponse } from "@/types";
import { getUnit, getUnitAgents, getUnitDocuments, getUnitPayments, getUnits } from "@/services/unit";

export const useGetUnitsQueries = () => {
  const { token } = useAuthStore();

  const { data, ...rest } = useQuery<IResponse<Unit[]>>({queryFn: getUnits as unknown as () => Promise<IResponse<Unit[]>>, queryKey: ['units'], enabled: !!token?.access_token, refetchOnMount: true, refetchOnWindowFocus: true, retry: true, retryDelay: 2000});

  return {
    units: data?.data || [],
    count: data?.count || 0,
    ...rest
  };
};

export const useGetUnitQuery = (id: string) => {
  const { token } = useAuthStore();

  const { data, ...rest } = useQuery<Unit>({queryFn: (props) => getUnit(id) as unknown as Promise<Unit>, queryKey: ['unit', id], enabled: !!token?.access_token, refetchOnMount: true, refetchOnWindowFocus: true, });

  return {
    unit: data || null,
    ...rest
  };
};

export const useGetUnitPaymentsQuery = (id: string) => {
  const { token } = useAuthStore();

  const { data, ...rest } = useQuery<IResponse<Payment[]>>({queryFn: (props) => getUnitPayments(id) as unknown as Promise<IResponse<Payment[]>>, queryKey: ['unit_payments', id], enabled: !!token?.access_token, refetchOnMount: true, refetchOnWindowFocus: true, });

  return {
    payments: data?.data || [],
    count: data?.count || 0,
    ...rest
  };
};

export const useGetUnitDocumentsQuery = (id: string) => {
  const { token } = useAuthStore();

  const { data, ...rest } = useQuery<IResponse<Document[]>>({queryFn: (props) => getUnitDocuments(id) as unknown as Promise<IResponse<Document[]>>, queryKey: ['unit_documents', id], enabled: !!token?.access_token, refetchOnMount: true, refetchOnWindowFocus: true, });

  return {
    documents: data?.data || [],
    count: data?.count || 0,
    ...rest
  };
};


export const useGetUnitAgentQuery = (id: string) => {
  const { token } = useAuthStore();

  const { data, ...rest } = useQuery<UnitAgent[]>({queryFn: (props) => getUnitAgents(id) as unknown as Promise<UnitAgent[]>, queryKey: ['unit_agents', id], enabled: !!token?.access_token || !!id, refetchOnMount: true, refetchOnWindowFocus: true, retry: true, retryDelay: 2000});

  return {
    agents: data || [],
    ...rest
  };
}