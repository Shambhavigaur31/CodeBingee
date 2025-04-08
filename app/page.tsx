"use client"

import { useEffect, useState } from "react"
import { PlatformStats } from "@/components/dashboard/platform-stats"
import { UserOverview } from "@/components/dashboard/user-overview"
import { DailyStreak } from "@/components/dashboard/daily-streak"
import { WeeklyTarget } from "@/components/dashboard/weekly-target"
import { FeaturedArticle } from "@/components/dashboard/featured-article"
import { PerformanceAnalysis } from "@/components/dashboard/performance-analysis"
import { ContributionCalendar } from "@/components/dashboard/contribution-calendar"
import { RecommendedProblems } from "@/components/dashboard/recommended-problems"
import { Achievements } from "@/components/dashboard/achievements"
import { useAuth } from "@/contexts/auth-context"
import { useSession } from "next-auth/react"

export default function DashboardPage() {
  const [codeforcesData, setCodeforcesData] = useState({ solved: 0, username: "loading..." })
  const [codechefData, setCodechefData] = useState({ solved: 0, username: "loading..." })
  const [leetcodeData, setLeetcodeData] = useState({ solved: 0, username: "loading..." ,medium:0,easy:0,hard:0})
  const [gfgData, setGfgData] = useState({ solved: 0, username: "loading..." })
  const { username: localUsername, setUsername } = useAuth()
  const { data: session } = useSession()

  
  const displayUsername = session?.user?.name || localUsername
  console.log(displayUsername)
  useEffect(() => {
    if (!displayUsername) return;

    async function fetchData() {
      try {
        const [cfRes, ccRes, lcRes,gfgRes] = await Promise.all([
          fetch("/api/codeforces",{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: localUsername }),
          }),
          fetch("/api/codechef",{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: localUsername }),
          }),
          fetch("/api/leetcode",{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: localUsername }),
          }),
          fetch("/api/gfg",{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: localUsername }),
          }),
        ])

        if (cfRes.ok) {
          const cfData = await cfRes.json()
          setCodeforcesData(cfData)
        }

        if (ccRes.ok) {
          const ccData = await ccRes.json()
          setCodechefData(ccData)
        }

        if (lcRes.ok) {
          const lcData = await lcRes.json()
          setLeetcodeData(lcData)
        }
        if(gfgRes.ok)
        {
          const gfgData = await gfgRes.json()
          setGfgData(gfgData)
        }

      } catch (err) {
        console.error("Failed to load platform data", err)
      }
    }

    fetchData()
  }, [displayUsername])

  return (
    <div className="container mx-auto p-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Hello, coding innovator</h1>
        <p className="text-muted-foreground">Let's explore your stats.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <UserOverview solved={gfgData.solved+codechefData.solved+leetcodeData.solved+codeforcesData.solved} easy={leetcodeData.easy} medium={leetcodeData.medium} hard={leetcodeData.hard} />
        <DailyStreak />
        <WeeklyTarget />
      </div>
      <div className="mt-6">
        <h2 className="mb-4 text-2xl font-semibold">Platforms</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <PlatformStats
            platform="CodeChef"
            username={codechefData.username}
            solved={codechefData.solved}
            icon="🍴"
          />
          <PlatformStats
            platform="Codeforces"
            username={codeforcesData.username}
            solved={codeforcesData.solved}
            icon="📊"
          />
          <PlatformStats
            platform="LeetCode"
            username={leetcodeData.username}
            solved={leetcodeData.solved}
            icon="⚡"
          />
          <PlatformStats
            platform="GeeksforGeeks"
            username={gfgData.username}
            solved={gfgData.solved}
            icon="👨‍💻"
          />
        </div>
      </div>

      <div className="mt-6">
        <PerformanceAnalysis />
      </div>

      <div className="mt-6">
        <ContributionCalendar />
      </div>

      

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecommendedProblems />
        </div>
        <div>
          <FeaturedArticle />
        </div>
      </div>

      <div className="mt-6">
        <Achievements />
      </div>
    </div>
  )
}
