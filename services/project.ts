import { mutationFn, queryFn } from "@/store/query";
import { IResonse } from "@/types";
import { Project } from "@/types/models";

export const getProjects = async () => {
  return queryFn<IResonse<Project[]>>({
    queryKey: ['project/'],
  });
};

export const getProject = async (id: string) => {
  return queryFn<Project>({
    queryKey: [`project/${id}`],
  });
};

export const updateProject = async (id: string, data: Project) => {
  return mutationFn<Project>({
    method: 'patch',
    url: `/project/${id}`,
    data,
  });
};

export const createProject = async (data: Project) => {
  return mutationFn<Project>({
    method: 'post',
    url: '/project/',
    data,
  });
};

export const deleteProject = async (id: string) => {
  return mutationFn<Project>({
    method: 'delete',
    url: `/project/${id}`,
  });
};