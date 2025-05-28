'use client'

import React from 'react'
import { useStatisticsQuery } from '@/hooks/use-statistics'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { cn } from '@/lib/utils'
import * as LucideIcons from 'lucide-react'

export default function Statistics() {
  const { data: statistics, isLoading, error } = useStatisticsQuery()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Ma'lumotlar yuklanmoqda...</div>
      </div>
    )
  }

  if (error || !statistics) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-red-600">
          Xatolik yuz berdi. Ma'lumotlarni qayta yuklashga harakat qiling!
        </div>
      </div>
    )
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

  const renderIcon = (iconName: string) => {
    const LucideIcon = LucideIcons[iconName as keyof typeof LucideIcons] as React.ElementType
    return LucideIcon ? <LucideIcon className="h-8 w-8 text-gray-600" /> : null
  }

  return (
    <div className="container mx-auto space-y-6 p-6">
      {statistics.dashboard_sections.map((section, index) => (
        <div key={index} className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">{section.section_title}</h2>
          {section.cards && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {section.cards.map((card, cardIndex) => (
                <Card key={cardIndex} className="transition-shadow hover:shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                    <div className="text-2xl">{renderIcon(card.icon)}</div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{card.value.toLocaleString()}</div>
                    <p
                      className={cn(
                        'mt-1 text-xs',
                        card.subtitle.includes('+')
                          ? 'text-green-600'
                          : card.subtitle.includes('-')
                            ? 'text-red-600'
                            : 'text-muted-foreground'
                      )}
                    >
                      {card.subtitle}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Charts Section */}
          {section.charts && (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {section.charts.map((chart, chartIndex) => {
                let chartData

                // Process chart data based on type
                if (chart.type === 'pie') {
                  chartData = [
                    {
                      name: 'Kutilmoqda',
                      value: statistics.dashboard_sections[1]?.cards?.[0]?.value ?? 0,
                    },
                    {
                      name: 'Tasdiqlangan',
                      value: statistics.dashboard_sections[1]?.cards?.[1]?.value ?? 0,
                    },
                    {
                      name: 'Arxivlangan',
                      value: statistics.dashboard_sections[1]?.cards?.[2]?.value ?? 0,
                    },
                  ]
                } else if (chart.type === 'line') {
                  chartData = [
                    {
                      name: 'Hozir',
                      value: statistics.dashboard_sections[0]?.cards?.[3]?.value ?? 0,
                    },
                    {
                      name: "O'tgan oy",
                      value:
                        (statistics.dashboard_sections[0]?.cards?.[3]?.value ?? 0) -
                        Number(
                          statistics.dashboard_sections[0]?.cards?.[3]?.subtitle?.match(
                            /[+-]\d+/
                          )?.[0] || '0'
                        ),
                    },
                  ]
                } else if (chart.type === 'bar') {
                  chartData = [
                    {
                      name: "Yangi a'zolar",
                      value: statistics.dashboard_sections[2]?.cards?.[0]?.value ?? 0,
                    },
                    {
                      name: 'Faol foydalanuvchilar',
                      value: statistics.dashboard_sections[2]?.cards?.[1]?.value ?? 0,
                    },
                  ]
                }

                return (
                  <Card key={chartIndex} className="p-4">
                    <CardHeader>
                      <CardTitle>{chart.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      {chart.type === 'pie' && (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={chartData}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) =>
                                `${name} ${(percent * 100).toFixed(0)}%`
                              }
                            >
                              {chartData?.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      )}

                      {chart.type === 'line' && (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="value"
                              stroke="#8884d8"
                              strokeWidth={2}
                              name="Yuklab olishlar soni"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      )}

                      {chart.type === 'bar' && (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#8884d8" name="Foydalanuvchilar soni" />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
