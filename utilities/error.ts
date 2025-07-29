import { IErrorResponse } from "@/types";
import { capitalize } from 'lodash';

export const handleError = (error?: IErrorResponse, defaultMessage?: string): string => {

  if (!error) {
    return defaultMessage  ?? "An unknown error occurred";
  }

  if (Array.isArray(error?.detail)) {
    return `${capitalize(error.detail[0].loc.pop()?.replaceAll("_", " ") ?? "Unknown Field")} - ${error.detail[0].msg}`;
  } else if (typeof error.detail === "string") {
    return error.detail;
  }

  return "An unknown error occurred";
}