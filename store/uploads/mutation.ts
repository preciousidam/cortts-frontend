import { FileLike, uploadFile, uploadFiles } from "@/services/upload";
import { IErrorResponse } from "@/types";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useSingleUploadMutation = (options?: UseMutationOptions<string, AxiosError<IErrorResponse>, {file: FileLike, extra?: Record<string, any>}>) => {
  return useMutation<string, AxiosError<IErrorResponse>, {file: FileLike, extra?: Record<string, any>}>( {
    mutationFn: ({file, extra}) => uploadFile(file, extra),
    ...options,
  })
}

export const useMultipleUploadMutation = (options?: UseMutationOptions<string[], AxiosError<IErrorResponse>, {files: FileLike[], extra?: Record<string, any>}>) => {
  return useMutation<string[], AxiosError<IErrorResponse>, {files: FileLike[], extra?: Record<string, any>}>( {
    mutationFn: ({files, extra}) => uploadFiles(files, extra),
    ...options,
  })
}