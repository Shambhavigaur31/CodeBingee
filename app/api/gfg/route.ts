// app/api/codeforces/route.ts

import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import axios from "axios"

export async function POST(request: Request) {
  try {
    const  {username} = await request.json()
    console.log(username)

    if (!username) {
      return NextResponse.json({ error: "Username not provided" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("CodeBinge") 

    
    const user = await db.collection("users").findOne({ username: username })

    if (!user || !user.profiles?.gfg) {
      return NextResponse.json({ error: "gfg handle not found" }, { status: 404 })
    }

    const handle = user.profiles.gfg

    const response = await axios.get(
      `https://geeks-for-geeks-api.vercel.app/${handle}`
    )

    const submissions = response.data.info.totalProblemsSolved
    const easy=response.data.solvedStats.easy.count
    const medium=response.data.solvedStats.medium.count
    const hard=response.data.solvedStats.hard.count
    
    
    

    return NextResponse.json({ solved: submissions, username: handle ,easy:easy,medium:medium,hard:hard}) 
  } catch (error) {
    console.error("Codeforces fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch Codeforces data" }, { status: 500 })
  }
}
