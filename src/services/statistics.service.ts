import axiosInstance from '@/services/base.axios'
import { DashboardData } from '../../types/statistics.types'

export const getStatistics = async (): Promise<DashboardData> => {
  try {
    const response = await axiosInstance.get<DashboardData>('/analytics/dashboard')
    return response.data
  } catch (error) {
    throw error
  }
}
