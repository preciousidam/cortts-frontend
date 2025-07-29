import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../auth";
import { Project } from "@/types/models";
import { getProjects } from "@/services/project";
import { IResonse } from "@/types";

export const useProjectQueries = () => {
  const { token } = useAuthStore();

  const { data } = useQuery<IResonse<Project[]>>({queryFn: getProjects as unknown as () => Promise<IResonse<Project[]>>, queryKey: ['projects'], enabled: !!token?.access_token, refetchOnMount: true, refetchOnWindowFocus: true, retry: true, retryDelay: 2000});

  return {
    projects: data?.data || [],
    count: data?.count || 0
  };
};