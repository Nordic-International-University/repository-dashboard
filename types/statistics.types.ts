export interface DashboardCard {
  title: string
  value: number
  subtitle: string
  icon: string
}

export type ChartType = 'line' | 'pie' | 'bar'

export interface DashboardChart {
  title: string
  type: ChartType
  data_source: string
  time_range?: string
  categories?: string[]
}

export interface DashboardSection {
  section_title: string
  cards?: DashboardCard[]
  charts?: DashboardChart[]
}

export interface DashboardData {
  dashboard_sections: DashboardSection[]
}
