'use client'

import React from 'react'
import { useStatisticsQuery } from '@/hooks/use-statistics'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import { motion } from 'framer-motion'

export default function Statistics() {
  const { data: statistics, isLoading, error } = useStatisticsQuery()

  if (isLoading) {
    return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
            <p className="text-muted-foreground">Ma'lumotlar yuklanmoqda...</p>
          </div>
        </div>
    )
  }

  if (error || !statistics) {
    return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <LucideIcons.AlertTriangle className="mx-auto mb-4 h-12 w-12 text-destructive" />
            <p className="text-destructive mb-4">Xatolik yuz berdi</p>
            <Button onClick={() => window.location.reload()}>
              Qayta yuklash
            </Button>
          </div>
        </div>
    )
  }

  const statisticsArray = Array.isArray(statistics) ? statistics :
      statistics?.dashboard_sections ? statistics.dashboard_sections : []

  const CHART_COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']

  const renderIcon = (iconName: string) => {
    const LucideIcon = LucideIcons[iconName as keyof typeof LucideIcons] as React.ElementType
    return LucideIcon ? (
        <LucideIcon className="h-5 w-5" />
    ) : (
        <LucideIcons.BarChart3 className="h-5 w-5" />
    )
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
          <div className="rounded-lg border bg-background p-3 shadow-lg">
            <p className="font-medium">{label}</p>
            {payload.map((entry: any, index: number) => (
                <p key={index} className="text-sm" style={{ color: entry.color }}>
                  {`${entry.name}: ${entry.value?.toLocaleString()}`}
                </p>
            ))}
          </div>
      )
    }
    return null
  }

  const getChartData = (chart: any) => {
    if (chart.type === 'pie') {
      const resursHolatiSection = statisticsArray.find((section: any) =>
          section.section_title === "Resurs holati"
      )
      if (resursHolatiSection?.cards) {
        return resursHolatiSection.cards.map((card: any) => ({
          name: card.title.replace(' resurslar', ''),
          value: card.value,
        }))
      }
    }

    if (chart.type === 'line') {
      const yuklamaSection = statisticsArray.find((section: any) =>
          section.section_title === "Umumiy ko'rsatkichlar"
      )
      const yuklamaCard = yuklamaSection?.cards?.find((card: any) =>
          card.title.includes('yuklab')
      )

      const currentValue = yuklamaCard?.value || 0
      return [
        { name: '30 kun oldin', value: Math.max(0, currentValue - 5) },
        { name: '20 kun oldin', value: Math.max(0, currentValue - 3) },
        { name: '10 kun oldin', value: Math.max(0, currentValue - 1) },
        { name: 'Hozir', value: currentValue },
      ]
    }

    if (chart.type === 'bar') {
      const foydalanuvchiSection = statisticsArray.find((section: any) =>
          section.section_title === "Foydalanuvchi faolligi"
      )
      if (foydalanuvchiSection?.cards) {
        return foydalanuvchiSection.cards.map((card: any) => ({
          name: card.title,
          value: card.value,
        }))
      }
    }

    return []
  }

  return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto space-y-8 p-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold">Statistika Paneli</h1>
            <p className="text-muted-foreground mt-2">Tizim ko'rsatkichlari</p>
          </div>

          {/* Sections */}
          {statisticsArray.map((section: any, index: number) => (
              <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-6"
              >
                <div className="border-l-4 border-primary pl-4">
                  <h2 className="text-2xl font-semibold">{section.section_title}</h2>
                </div>

                {/* Cards */}
                {section.cards && Array.isArray(section.cards) && (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                      {section.cards.map((card: any, cardIndex: number) => (
                          <Card key={cardIndex} className="transition-shadow hover:shadow-md">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <CardTitle className="text-sm font-medium">
                                {card.title}
                              </CardTitle>
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                {renderIcon(card.icon)}
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">
                                {card.value.toLocaleString()}
                              </div>
                              <Badge
                                  variant={card.subtitle.includes('+') ? 'default' : 'secondary'}
                                  className="mt-2"
                              >
                                {card.subtitle}
                              </Badge>
                            </CardContent>
                          </Card>
                      ))}
                    </div>
                )}

                {/* Charts */}
                {section.charts && Array.isArray(section.charts) && (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
                      {section.charts.map((chart: any, chartIndex: number) => {
                        const chartData = getChartData(chart)

                        return (
                            <Card key={chartIndex}>
                              <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                  {chart.type === 'pie' && <LucideIcons.PieChart className="h-5 w-5" />}
                                  {chart.type === 'line' && <LucideIcons.TrendingUp className="h-5 w-5" />}
                                  {chart.type === 'bar' && <LucideIcons.BarChart3 className="h-5 w-5" />}
                                  {chart.title}
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                  {chart.type === 'pie' && (
                                      <PieChart>
                                        <Pie
                                            data={chartData}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            innerRadius={40}
                                            paddingAngle={5}
                                            dataKey="value"
                                            label={({ name, percent }) =>
                                                `${name} ${(percent * 100).toFixed(0)}%`
                                            }
                                        >
                                          {chartData.map((_, index: number) => (
                                              <Cell
                                                  key={`cell-${index}`}
                                                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                                              />
                                          ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                      </PieChart>
                                  )}

                                  {chart.type === 'line' && (
                                      <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                        <XAxis
                                            dataKey="name"
                                            tick={{ fontSize: 12 }}
                                            className="fill-muted-foreground"
                                        />
                                        <YAxis
                                            tick={{ fontSize: 12 }}
                                            className="fill-muted-foreground"
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Line
                                            type="monotone"
                                            dataKey="value"
                                            stroke={CHART_COLORS[0]}
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                            activeDot={{ r: 6 }}
                                        />
                                      </LineChart>
                                  )}

                                  {chart.type === 'bar' && (
                                      <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                        <XAxis
                                            dataKey="name"
                                            tick={{ fontSize: 12 }}
                                            className="fill-muted-foreground"
                                        />
                                        <YAxis
                                            tick={{ fontSize: 12 }}
                                            className="fill-muted-foreground"
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar
                                            dataKey="value"
                                            fill={CHART_COLORS[2]}
                                            radius={[4, 4, 0, 0]}
                                        />
                                      </BarChart>
                                  )}
                                </ResponsiveContainer>
                              </CardContent>
                            </Card>
                        )
                      })}
                    </div>
                )}
              </motion.div>
          ))}
        </div>
      </div>
  )
}