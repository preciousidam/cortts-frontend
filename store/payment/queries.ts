import { getAllPayments } from "@/services/payment";
import { IResponse } from "@/types";
import { Payment } from "@/types/models";
import { useQuery } from "@tanstack/react-query";

export const useGetAllPayments = () => {
  const { data, isLoading, error } = useQuery<IResponse<Payment[]>>({
    queryKey: ["/payment/"],
    queryFn: getAllPayments,
  });

  return { payments: data?.data ?? [], count: data?.count || 0, isLoading, error };
};