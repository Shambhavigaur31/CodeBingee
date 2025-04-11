"use client"

import { useEffect, useState } from "react"
import { CompareForm } from "@/components/analytics/compare-form"
import { WeeklyComparison } from "@/components/analytics/weekly-comparison"
import { PlatformComparison } from "@/components/analytics/platform-comparison"
import { SkillRadar } from "@/components/analytics/skill-radar"
import { ProblemDistribution } from "@/components/analytics/problem-distribution"

export default function AnalyticsPage() {
  const [profiles, setProfiles] = useState<ProfileData[]>([])
  const [leetcodeDifficulty, setLeetcodeDifficulty] = useState<DifficultyData | null>(null)
  const [gfgDifficulty, setGfgDifficulty] = useState<DifficultyData | null>(null)

  const icons = {
    codeforces: "📊",
    leetcode: "⚡",
    codechef: "🍴",
    gfg: "👨‍💻",
  }

  const [triggerFetch, setTriggerFetch] = useState(false)

  useEffect(() => {
    const yourUsernames = JSON.parse(localStorage.getItem("usernames") || "{}")
    const friendUsernames = JSON.parse(localStorage.getItem("friendUsernames") || "{}")

    const platforms: PlatformKey[] = ["codeforces", "leetcode", "codechef", "gfg"]

    const allUsernamesSet = platforms.every(
      (platform) => yourUsernames[platform] && friendUsernames[platform]
    )

    if (!allUsernamesSet) return

    const fetchData = async () => {
      const results: ProfileData[] = []

      for (const platform of platforms) {
        const yourUsername = yourUsernames[platform]
        const friendUsername = friendUsernames[platform]

        const yourData = await fetchScore(platform, yourUsername)
        const friendData = await fetchScore(platform, friendUsername)

        if (platform === "leetcode" && yourData.difficulty) {
          setLeetcodeDifficulty(yourData.difficulty)
        }
        if (platform === "gfg" && yourData.difficulty) {
          setGfgDifficulty(yourData.difficulty)
        }

        results.push({
          platform,
          yourUsername,
          yourScore: yourData.total,
          friendUsername,
          friendScore: friendData.total,
          icon: icons[platform],
        })
      }

      setProfiles(results)
    }

    fetchData()
  }, [triggerFetch])

  const fetchScore = async (
    platform: PlatformKey,
    username: string
  ): Promise<{ total: number; difficulty?: DifficultyData }> => {
    if (!username) return { total: 0 }

    try {
      switch (platform) {
        case "codeforces": {
          const res = await fetch(`https://codeforces.com/api/user.status?handle=${username}`)
          const data = await res.json()
          const solvedSet = new Set<string>()

          for (const sub of data.result) {
            if (sub.verdict === "OK") {
              const problemId = `${sub.problem.contestId}-${sub.problem.index}`
              solvedSet.add(problemId)
            }
          }

          return { total: solvedSet.size }
        }
        case "leetcode": {
          const res = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`)
          const data = await res.json()
          const difficulty = {
            easy: data.easySolved || 0,
            medium: data.mediumSolved || 0,
            hard: data.hardSolved || 0,
            total: data.totalSolved || 0,
          }
          return { total: difficulty.total, difficulty }
        }
        case "codechef": {
          const res = await fetch(`/api/cf2?username=${username}`)
          const data = await res.json()
          return { total: data.solved || 0 }
        }
        case "gfg": {
          const res = await fetch(`/api/gfg2?username=${username}`)
          const data = await res.json()
          const solved = data.info?.totalProblemsSolved || 0
          const difficulty = {
            easy: data.info?.solvedStats.easy.count || 0,
            medium: data.info?.solvedStats.medium.count || 0,
            hard: data.info?.solvedStats.hard.count || 0,
            total: solved,
          }
          return { total: solved, difficulty }
        }
        default:
          return { total: 0 }
      }
    } catch (error) {
      console.error(`Error fetching data for ${platform} - ${username}:`, error)
      return { total: 0 }
    }
  }

  return (
    <div className="container mx-auto p-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Analyze your performance and compare with friends</p>
      </div>

      <CompareForm onUsernamesSet={() => setTriggerFetch((prev) => !prev)} />

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <WeeklyComparison />
        <SkillRadar />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ProblemDistribution leetcodeData={leetcodeDifficulty} gfgData={gfgDifficulty} codeforcesTotal={profiles.find((p) => p.platform === "codeforces")?.yourScore || 0}
  codechefTotal={profiles.find((p) => p.platform === "codechef")?.yourScore || 0}/>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
          {profiles.map((profile) => (
            <PlatformComparison
              key={profile.platform}
              platform={profile.platform}
              icon={profile.icon}
              yourUsername={profile.yourUsername}
              yourScore={profile.yourScore}
              friendUsername={profile.friendUsername}
              friendScore={profile.friendScore}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

type PlatformKey = "codeforces" | "leetcode" | "codechef" | "gfg"

interface ProfileData {
  platform: PlatformKey
  yourUsername: string
  yourScore: number
  friendUsername: string
  friendScore: number
  icon: string
}

interface DifficultyData {
  easy: number
  medium: number
  hard: number
  total: number
}
