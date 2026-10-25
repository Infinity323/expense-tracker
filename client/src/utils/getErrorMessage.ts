import axios from "axios";

export const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError<{ error?: string; message?: string }>(error)) {
    return error.response?.data?.error ?? error.response?.data?.message ?? fallback;
  }
  return error instanceof Error ? error.message : fallback;
};