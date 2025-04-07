import clientPromise from "@/lib/mongodb"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const data = await req.json()

  // Extract username from headers
  const username = req.headers.get("x-username")
  if (!username) {
    return NextResponse.json({ message: "Missing username in request headers" }, { status: 400 })
  }

  try {
    const client = await clientPromise
    const db = client.db("CodeBinge")

    const result = await db.collection("users").updateOne(
      { username },
      {
        $set: {
          profiles: {
            codeforces: data.codeforces,
            leetcode: data.leetcode,
            codechef: data.codechef,
            gfg: data.gfg,
          },
        },
      },
      { upsert: true } // create document if it doesn't exist
    )

    return NextResponse.json({ message: "Profile saved", result })
  } catch (err) {
    console.error("Error saving profile:", err)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
