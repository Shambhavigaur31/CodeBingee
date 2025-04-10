"use client"

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Props = {
  calendar: Record<string, number> // key: timestamp, value: count
}

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export function PerformanceAnalysis({ calendar }: Props) {
  const monthlyData = useMemo(() => {
    const monthlyCounts: { [key: string]: number } = {}

    Object.entries(calendar).forEach(([timestamp, count]) => {
      const date = new Date(parseInt(timestamp) * 1000)
      const key = `${date.getFullYear()}-${date.getMonth()}` // example: "2024-3"
      monthlyCounts[key] = (monthlyCounts[key] || 0) + count
    })

    const result = Object.entries(monthlyCounts)
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([key, problems]) => {
        const [year, month] = key.split("-").map(Number)
        return {
          name: `${monthNames[month]} '${String(year).slice(2)}`,
          problems,
          difficulty: 2 + Math.random() * 2, // Placeholder for difficulty
          time: 20 + Math.random() * 15, // Placeholder for average time
        }
      })

    return result
  }, [calendar])

  const categoryData = [
    { name: "Arrays", count: 145 },
    { name: "Strings", count: 98 },
    { name: "DP", count: 76 },
    { name: "Trees", count: 65 },
    { name: "Graphs", count: 42 },
    { name: "Sorting", count: 38 },
    { name: "Greedy", count: 35 },
  ]

  return (
    <Card className="glow-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium">Performance Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="problems">
          <TabsList className="mb-4 grid w-full grid-cols-3">
            <TabsTrigger value="problems">Problems Solved</TabsTrigger>
            <TabsTrigger value="difficulty">Difficulty Progress</TabsTrigger>
            <TabsTrigger value="categories">Problem Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="problems" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorProblems" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#00e5ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" tick={{ fill: "#94a3b8" }} />
                <YAxis tick={{ fill: "#94a3b8" }} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "0.375rem" }}
                  itemStyle={{ color: "#f8fafc" }}
                  labelStyle={{ color: "#94a3b8" }}
                />
                <Area
                  type="monotone"
                  dataKey="problems"
                  stroke="#00e5ff"
                  fillOpacity={1}
                  fill="url(#colorProblems)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="difficulty" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="name" tick={{ fill: "#94a3b8" }} />
                <YAxis tick={{ fill: "#94a3b8" }} domain={[0, 5]} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "0.375rem" }}
                  itemStyle={{ color: "#f8fafc" }}
                  labelStyle={{ color: "#94a3b8" }}
                />
                <Line
                  type="monotone"
                  dataKey="difficulty"
                  stroke="#c026d3"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#c026d3" }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="time"
                  stroke="#eab308"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#eab308" }}
                  activeDot={{ r: 6 }}
                />
                <Legend
                  formatter={(value) => (value === "difficulty" ? "Avg. Difficulty (1–5)" : "Avg. Time (min)")}
                  wrapperStyle={{ color: "#94a3b8" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="categories" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal vertical={false} stroke="#334155" />
                <XAxis type="number" tick={{ fill: "#94a3b8" }} />
                <YAxis dataKey="name" type="category" tick={{ fill: "#94a3b8" }} width={80} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "0.375rem" }}
                  itemStyle={{ color: "#f8fafc" }}
                  labelStyle={{ color: "#94a3b8" }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
