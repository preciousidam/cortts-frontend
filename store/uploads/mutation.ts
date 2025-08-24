import { FileLike, uploadFile, uploadFiles } from "@/services/upload";
import { IErrorResponse } from "@/types";
import { MediaFile } from "@/types/models";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useSingleUploadMutation = (options?: UseMutationOptions<MediaFile, AxiosError<IErrorResponse>, {file: FileLike, extra?: Record<string, any>}>) => {
  return useMutation<MediaFile, AxiosError<IErrorResponse>, {file: FileLike, extra?: Record<string, any>}>( {
    mutationFn: ({file, extra}) => uploadFile(file, extra),
    ...options,
  })
}

export const useMultipleUploadMutation = (options?: UseMutationOptions<MediaFile[], AxiosError<IErrorResponse>, {files: FileLike[], extra?: Record<string, any>}>) => {
  return useMutation<MediaFile[], AxiosError<IErrorResponse>, {files: FileLike[], extra?: Record<string, any>}>( {
    mutationFn: ({files, extra}) => uploadFiles(files, extra),
    ...options,
  })
}