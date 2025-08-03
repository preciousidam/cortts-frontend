import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../auth";
import { Unit } from "@/types/models";
import { IResonse } from "@/types";
import { getUnit, getUnits } from "@/services/unit";

export const useGetUnitsQueries = () => {
  const { token } = useAuthStore();

  const { data, ...rest } = useQuery<IResonse<Unit[]>>({queryFn: getUnits as unknown as () => Promise<IResonse<Unit[]>>, queryKey: ['units'], enabled: !!token?.access_token, refetchOnMount: true, refetchOnWindowFocus: true, retry: true, retryDelay: 2000});

  return {
    units: data?.data || [],
    count: data?.count || 0,
    ...rest
  };
};

export const useGetUnitQuery = (id: string) => {
  const { token } = useAuthStore();

  const { data, ...rest } = useQuery<Unit>({queryFn: (props) => getUnit(id) as unknown as Promise<Unit>, queryKey: ['unit', id], enabled: !!token?.access_token, refetchOnMount: true, refetchOnWindowFocus: true, retry: true, retryDelay: 2000});

  return {
    unit: data || null,
    ...rest
  };
};