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
  Legend
} from 'recharts'
import { cn } from '@/lib/utils'

export default function Statistics() {
  const { data: statistics, isLoading } = useStatisticsQuery()

  if (isLoading || !statistics) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg">Ma'lumotlar yuklanmoqda...</div>
        </div>
    )
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

  return (
      <div className="container mx-auto p-6 space-y-6">
        {statistics.dashboard_sections.map((section, index) => (
            <div key={index} className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">{section.section_title}</h2>

              {section.cards && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {section.cards.map((card, cardIndex) => (
                        <Card key={cardIndex} className="transition-all hover:shadow-lg">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                              {card.title}
                            </CardTitle>
                            <div className="text-2xl">{card.icon}</div>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{card.value.toLocaleString()}</div>
                            <p className={cn(
                                "text-xs",
                                card.subtitle.includes('+') ? 'text-green-600' :
                                    card.subtitle.includes('-') ? 'text-red-600' :
                                        'text-muted-foreground'
                            )}>
                              {card.subtitle}
                            </p>
                          </CardContent>
                        </Card>
                    ))}
                  </div>
              )}

              {section.charts && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {section.charts.map((chart, chartIndex) => (
                        <Card key={chartIndex} className="p-4">
                          <CardHeader>
                            <CardTitle>{chart.title}</CardTitle>
                          </CardHeader>
                          <CardContent className="h-[300px]">
                            {chart.type === 'pie' && (
                                <ResponsiveContainer width="100%" height="100%">
                                  <PieChart>
                                    <Pie
                                        data={[
                                            // @ts-ignore
                                          { name: 'Kutilmoqda', value: statistics.dashboard_sections[1]?.cards?.[0]?.value ?? 0 },
                                          { name: 'Tasdiqlangan', value: statistics.dashboard_sections[1]?.cards?.[1]?.value ?? 0 },
                                          { name: 'Arxivlangan', value: statistics.dashboard_sections[1]?.cards?.[2]?.value ?? 0 },
                                        ]}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                      {COLORS.map((color, index) => (
                                          <Cell key={`cell-${index}`} fill={color} />
                                      ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                  </PieChart>
                                </ResponsiveContainer>
                            )}

                            {chart.type === 'line' && (
                                <ResponsiveContainer width="100%" height="100%">
                                  <LineChart
                                      data={[
                                        { name: "Hozir", value: statistics.dashboard_sections[0]?.cards?.[3]?.value ?? 0 },
                                        { name: "O'tgan oy", value: (statistics.dashboard_sections[0]?.cards?.[3]?.value ?? 0) - Number(statistics.dashboard_sections[0]?.cards?.[3]?.subtitle?.match(/[+-]\d+/)?.[0] || "0") }
                                      ]}
                                  >
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
                                  <BarChart
                                      data={[
                                        { name: "Yangi a'zolar", value: statistics.dashboard_sections[2]?.cards?.[0]?.value ?? 0 },
                                        { name: "Faol foydalanuvchilar", value: statistics.dashboard_sections[2]?.cards?.[1]?.value ?? 0 }
                                      ]}
                                  >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar
                                        dataKey="value"
                                        fill="#8884d8"
                                        name="Foydalanuvchilar soni"
                                    />
                                  </BarChart>
                                </ResponsiveContainer>
                            )}
                          </CardContent>
                        </Card>
                    ))}
                  </div>
              )}
            </div>
        ))}
      </div>
  )
}