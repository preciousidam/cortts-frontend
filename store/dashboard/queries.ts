import { getAdminDashboardData } from "@/services/dashboard"
import { AdminDashboard } from "@/types"
import { useQuery } from "@tanstack/react-query"

export const useGetAdminDashboardData = () => {
  const { data, isLoading, error } = useQuery<AdminDashboard>({queryFn: getAdminDashboardData, queryKey: ['admin-dashboard']})
  return { data, isLoading, error }
}