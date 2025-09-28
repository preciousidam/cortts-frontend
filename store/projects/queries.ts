import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../auth";
import { Project } from "@/types/models";
import { getProject, getProjects } from "@/services/project";
import { IResponse } from "@/types";

export const useGetProjectsQueries = () => {
  const { token } = useAuthStore();

  const { data, ...rest } = useQuery<IResponse<Project[]>>({queryFn: getProjects as unknown as () => Promise<IResponse<Project[]>>, queryKey: ['projects'], enabled: !!token?.access_token, refetchOnMount: true, refetchOnWindowFocus: true, retry: true, retryDelay: 2000});

  return {
    projects: data?.data || [],
    count: data?.count || 0,
    ...rest
  };
};

export const useGetProjectQuery = (id: string, enabled: boolean = true) => {
  const { token } = useAuthStore();

  const { data, ...rest } = useQuery<Project>({queryFn: (props) => getProject(id) as unknown as Promise<Project>, queryKey: ['project', id], enabled: !!token?.access_token && enabled, refetchOnMount: true, refetchOnWindowFocus: true, retry: true, retryDelay: 2000});

  return {
    project: data || null,
    ...rest
  };
};