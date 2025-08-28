import { queryFn } from "@/store/query";
import { AdminDashboard } from "@/types";


export const getAdminDashboardData = async () => {
  return queryFn<AdminDashboard>({
    queryKey: ['/dashboard/admin'],
  });
};