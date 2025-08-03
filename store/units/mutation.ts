import { createUnit, updateUnit } from "@/services/unit"
import { IErrorResponse } from "@/types"
import { Unit } from "@/types/models"
import { useMutation, UseMutationOptions } from "@tanstack/react-query"
import { AxiosError } from "axios"

export const useCreateUnitMutation = (options: UseMutationOptions<Unit, AxiosError<IErrorResponse>, Unit, unknown>) => {
  return useMutation<Unit, AxiosError<IErrorResponse>, Unit>({...options, mutationFn: createUnit })
}

export const useUpdateUnitMutation = (id: string, options: UseMutationOptions<Unit, AxiosError<IErrorResponse>, Unit, unknown>) => {
  return useMutation<Unit, AxiosError<IErrorResponse>, Unit>({...options, mutationFn: (data) => updateUnit(id, data) })
}