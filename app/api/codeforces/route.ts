// app/api/codeforces/route.ts

import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import axios from "axios"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(request: Request) {
  try {

    const  {username} = await request.json()
    console.log(username)

    if (!username) {
      return NextResponse.json({ error: "Username not provided" }, { status: 400 })
    }

    

    const client = await clientPromise
    const db = client.db("CodeBinge") // 🔁 Replace with your DB name

    // Replace 'aayueshmaan' with dynamic value if you're fetching for logged-in user
    const user = await db.collection("users").findOne({ username: username })

    if (!user || !user.profiles?.codeforces) {
      return NextResponse.json({ error: "Codeforces handle not found" }, { status: 404 })
    }

    const handle = user.profiles.codeforces

    const response = await axios.get(
      `https://codeforces.com/api/user.status?handle=${handle}`
    )

    const submissions = response.data.result
    const solvedSet = new Set()

    for (const sub of submissions) {
      if (sub.verdict === "OK") {
        const problemId = `${sub.problem.contestId}-${sub.problem.index}`
        solvedSet.add(problemId)
      }
    }

    return NextResponse.json({ solved: solvedSet.size, username: handle })
  } catch (error) {
    console.error("Codeforces fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch Codeforces data" }, { status: 500 })
  }
}
