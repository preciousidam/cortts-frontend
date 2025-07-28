import { mutationFn, queryFn } from "@/store/query";
import { IResonse } from "@/types";
import { Project } from "@/types/models";

export const getProjects = async () => {
  return queryFn<IResonse<Project[]>>({
    queryKey: ['project/'],
  });
};

export const updateProject = async (data: Project) => {
  return mutationFn<Project>({
    method: 'patch',
    url: '/project/',
    data,
  });
};
