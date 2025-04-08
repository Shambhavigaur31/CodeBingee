import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getServerSession } from "next-auth"
//import { authOptions } from "@/app/api/auth/[...nextauth]/route" // Adjusted path
import axios from "axios"

export async function POST(request: Request) {
  try {
    
    const  {username} = await request.json()
    console.log(username)

    if (!username) {
      return NextResponse.json({ error: "Username not provided" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("CodeBinge") // 🔁 Replace with your DB name
    const user = await db.collection("users").findOne({ username: "aayueshmaan" })

    if (!user || !user.profiles?.leetcode) {
      return NextResponse.json({ error: "LeetCode username not found" }, { status: 404 })
    }

    const leetcodeUsername = user.profiles.leetcode

    const response = await axios.get(`https://leetcode-rest-api.onrender.com/profile/${leetcodeUsername}`);

    const apiData = response.data?.data

    if (!apiData || !apiData.submitStatsGlobal) {
      console.error("Invalid LeetCode API response:", response.data)
      return NextResponse.json({ error: "Invalid response from LeetCode API" }, { status: 503 })
    }

    const totalSolved = apiData.submitStatsGlobal.acSubmissionNum.find(
      (item: any) => item.difficulty === "All"
    )?.count || 0

    const medium = apiData.submitStatsGlobal.acSubmissionNum.find(
      (item: any) => item.difficulty === "Medium"
    )?.count || 0

    const easy = apiData.submitStatsGlobal.acSubmissionNum.find(
      (item: any) => item.difficulty === "Easy"
    )?.count || 0

    const hard = apiData.submitStatsGlobal.acSubmissionNum.find(
      (item: any) => item.difficulty === "Hard"
    )?.count || 0

    return NextResponse.json({
      username: leetcodeUsername,
      solved: totalSolved,
      medium:medium,
      easy:easy,
      hard:hard,
    })
  } catch (error) {
    console.error("LeetCode fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch LeetCode data" }, { status: 503 })
  }
}
