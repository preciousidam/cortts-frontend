import { getAdminDashboardData } from "@/services/dashboard"
import { AdminDashboard } from "@/types/models"
import { useQuery } from "@tanstack/react-query"

export const useGetAdminDashboardData = () => {
  const result = useQuery<AdminDashboard>({queryFn: getAdminDashboardData, queryKey: ['admin-dashboard']})
  return result;
}