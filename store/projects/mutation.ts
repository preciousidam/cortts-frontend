import { createProject } from "@/services/project"
import { IErrorResponse } from "@/types"
import { Project } from "@/types/models"
import { useMutation, UseMutationOptions } from "@tanstack/react-query"
import { AxiosError } from "axios"

export const useCreateProjectMutation = (options: UseMutationOptions<Project, AxiosError<IErrorResponse>, Project, unknown>) => {
  return useMutation<Project, AxiosError<IErrorResponse>, Project>({...options, mutationFn: createProject })
}