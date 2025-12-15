import { getAllPayments } from "@/services/payment";
import { IResponse } from "@/types";
import { Payment } from "@/types/models";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../auth";

export const useGetAllPayments = () => {
  const { token } = useAuthStore();
  const { data, isLoading, error } = useQuery<IResponse<Payment[]>>({
    queryKey: ["/payment/"],
    queryFn: getAllPayments,
    enabled: !!token?.access_token,
  });

  return { payments: data?.data ?? [], count: data?.count || 0, isLoading, error };
};