import { queryFn } from "@/store/query";
import { IResponse } from "@/types";
import { Payment } from "@/types/models";

export const getAllPayments = async () => {
  return queryFn<IResponse<Payment[]>>({ queryKey: ["/payment/", {limit: 1000}] });
};
