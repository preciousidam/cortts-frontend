import { createUnit, updateUnit, uploadSignedDocument, uploadTemplate } from "@/services/unit";
import { IErrorResponse } from "@/types";
import { SignedDocument, Template, Unit, UnitAgent } from "@/types/models";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useCreateUnitMutation = (options: UseMutationOptions<Unit, AxiosError<IErrorResponse>, Unit, unknown>) => {
  return useMutation<Unit, AxiosError<IErrorResponse>, Unit>({...options, mutationFn: createUnit })
}

export const useUpdateUnitMutation = (id: string, options: UseMutationOptions<Unit, AxiosError<IErrorResponse>, Partial<Unit> & {
    agents?: Partial<UnitAgent>[];
}, unknown>) => {
  return useMutation<Unit, AxiosError<IErrorResponse>, Partial<Unit> & {
      agents?: Partial<UnitAgent>[];
  }>({...options, mutationFn: (data) => updateUnit(id, data) })
}

export const useCreateTemplateMutation = (options: UseMutationOptions<Template, AxiosError<IErrorResponse>, Partial<Template>, unknown>) => {
  return useMutation<Template, AxiosError<IErrorResponse>, Partial<Template>>({
    ...options,
    mutationFn: (data) => uploadTemplate(data),
  });
}

export const useCreateSignedMutation = (options: UseMutationOptions<SignedDocument, AxiosError<IErrorResponse>, Partial<SignedDocument>, unknown>) => {
  return useMutation<SignedDocument, AxiosError<IErrorResponse>, Partial<SignedDocument>>({
    ...options,
    mutationFn: (data) => uploadSignedDocument(data),
  });
}