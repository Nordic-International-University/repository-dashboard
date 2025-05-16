import { useQuery } from 'react-query'
import { getStatistics } from '@/services/statistics.service'

export const useStatisticsQuery = () => useQuery(['statistics'], () => getStatistics())
