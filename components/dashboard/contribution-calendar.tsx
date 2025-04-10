"use client"

import { useState, useMemo } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Flame } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

type Props = {
  calendar: Record<string, number> // timestamp (in seconds) => submissions
}

export function ContributionCalendar({ calendar }: Props) {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const years = ["2022", "2023", "2024", "2025"]
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const [currentMonth, setCurrentMonth] = useState("April")
  const [currentYear, setCurrentYear] = useState("2025")

  const getDaysInMonth = (month: string, year: string) => {
    const index = months.indexOf(month)
    return new Date(Number(year), index + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month: string, year: string) => {
    const index = months.indexOf(month)
    return new Date(Number(year), index, 1).getDay()
  }

  const goToPreviousMonth = () => {
    const currentIndex = months.indexOf(currentMonth)
    if (currentIndex === 0) {
      setCurrentMonth(months[11])
      setCurrentYear((+currentYear - 1).toString())
    } else {
      setCurrentMonth(months[currentIndex - 1])
    }
  }

  const goToNextMonth = () => {
    const currentIndex = months.indexOf(currentMonth)
    if (currentIndex === 11) {
      setCurrentMonth(months[0])
      setCurrentYear((+currentYear + 1).toString())
    } else {
      setCurrentMonth(months[currentIndex + 1])
    }
  }

  // 🧠 Memoized contribution data per selected month
  const contributionData = useMemo(() => {
    const result: Record<number, number> = {}
    const targetMonth = months.indexOf(currentMonth)
    const targetYear = +currentYear

    Object.entries(calendar).forEach(([ts, count]) => {
      const date = new Date(Number(ts) * 1000)
      if (date.getFullYear() === targetYear && date.getMonth() === targetMonth) {
        result[date.getDate()] = count
      }
    })

    return result
  }, [calendar, currentMonth, currentYear])

  const daysInMonth = getDaysInMonth(currentMonth, currentYear)
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear)

  const getContributionColor = (intensity: number) => {
    if (intensity === 0) return "bg-secondary/30"
    if (intensity < 2) return "bg-teal-900/70"
    if (intensity < 4) return "bg-teal-700/80"
    if (intensity < 6) return "bg-teal-500/90"
    return "bg-teal-400"
  }

  return (
    <Card className="glow-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-neon-cyan" />
            <CardTitle className="text-lg font-medium">Contribution Calendar</CardTitle>
          </div>
          <Badge variant="outline" className="bg-secondary/50">
            {Object.values(contributionData).filter((v) => v > 0).length} Active days
          </Badge>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={goToPreviousMonth} className="rounded-full p-1 hover:bg-secondary/50">
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2">
              <Select value={currentMonth} onValueChange={setCurrentMonth}>
                <SelectTrigger className="w-[130px] bg-secondary/20 border-none">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>{month}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={currentYear} onValueChange={setCurrentYear}>
                <SelectTrigger className="w-[90px] bg-secondary/20 border-none">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <button onClick={goToNextMonth} className="rounded-full p-1 hover:bg-secondary/50">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">Less</span>
            <div className="flex gap-1">
              <div className="h-3 w-3 rounded-sm bg-secondary/30" />
              <div className="h-3 w-3 rounded-sm bg-teal-900/70" />
              <div className="h-3 w-3 rounded-sm bg-teal-700/80" />
              <div className="h-3 w-3 rounded-sm bg-teal-500/90" />
              <div className="h-3 w-3 rounded-sm bg-teal-400" />
            </div>
            <span className="text-xs text-muted-foreground">More</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-7 gap-2 text-center">
          {days.map((day) => (
            <div key={day} className="py-1 text-xs text-muted-foreground">{day}</div>
          ))}

          {/* Empty starting spaces */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="h-8" />
          ))}

          {/* Actual days */}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const date = i + 1
            const intensity = contributionData[date] || 0
            return (
              <div
                key={date}
                className={`flex h-8 items-center justify-center rounded-md text-xs ${getContributionColor(intensity)}`}
                title={`${date} ${currentMonth}: ${intensity} contributions`}
              >
                {date}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
