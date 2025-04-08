// app/api/codechef/route.ts

import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import axios from "axios"
import puppeteer from "puppeteer"

export async function POST(request: Request) {
  try {

    const  {username} = await request.json()
    console.log(username)

    if (!username) {
      return NextResponse.json({ error: "Username not provided" }, { status: 400 })
    }
    const client = await clientPromise
    const db = client.db("CodeBinge") // 🔁 Replace with your DB name

    // Replace with dynamic username if using auth
    const user = await db.collection("users").findOne({ username: "aayueshmaan" })

    if (!user || !user.profiles?.codechef) {
      return NextResponse.json({ error: "CodeChef handle not found" ,status: 404 })
    }

    const handle = user.profiles.codechef

    const codechefUsername = user.profiles.codechef
    const profileUrl = `https://www.codechef.com/users/${handle}`

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    })
    const page = await browser.newPage()
    await page.goto(profileUrl, { waitUntil: "networkidle2", timeout: 0 })

    // Get the "Total Problems Solved" number from <h3>
    const totalSolved = await page.evaluate(() => {
      const h3Tags = Array.from(document.querySelectorAll("h3"))
      for (const h3 of h3Tags) {
        if (h3.textContent?.includes("Total Problems Solved")) {
          const match = h3.textContent.match(/\d+/)
          return match ? parseInt(match[0]) : 0
        }
      }
      return 0
    })

    await browser.close()

    return new Response(JSON.stringify({ username: codechefUsername, solved: totalSolved }), {
      headers: { "Content-Type": "application/json" },
      status: 200
    })
  } catch (error) {
    console.error("CodeChef fetch error:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch CodeChef data" }), {
      headers: { "Content-Type": "application/json" },
      status: 500
    })
  }
}
