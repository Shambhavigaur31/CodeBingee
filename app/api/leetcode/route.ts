import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import axios from "axios";

export async function POST(request: Request) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json({ error: "Username not provided" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("CodeBinge");

    const user = await db.collection("users").findOne({ username });

    if (!user || !user.profiles?.leetcode) {
      return NextResponse.json({ error: "LeetCode username not found" }, { status: 404 });
    }

    const leetcodeUsername = user.profiles.leetcode;

    // 🔹 Fetch stats
    const statsResponse = await axios.get(`https://leetcode-rest-api.onrender.com/profile/${leetcodeUsername}`);
    const apiData = statsResponse.data?.data;

    if (!apiData || !apiData.submitStatsGlobal) {
      console.error("Invalid LeetCode API response:", statsResponse.data);
      return NextResponse.json({ error: "Invalid response from LeetCode API" }, { status: 503 });
    }

    const submissions = apiData.submitStatsGlobal.acSubmissionNum;

    const totalSolved = submissions.find((item: any) => item.difficulty === "All")?.count || 0;
    const medium = submissions.find((item: any) => item.difficulty === "Medium")?.count || 0;
    const easy = submissions.find((item: any) => item.difficulty === "Easy")?.count || 0;
    const hard = submissions.find((item: any) => item.difficulty === "Hard")?.count || 0;

    // 🔹 Fetch calendar data via LeetCode GraphQL
    const calendarQuery = {
      query: `
        query userCalendar($username: String!) {
          matchedUser(username: $username) {
            userCalendar {
              submissionCalendar
            }
          }
        }
      `,
      variables: {
        username: leetcodeUsername,
      },
    };

    const calendarResponse = await axios.post(
      "https://leetcode.com/graphql",
      calendarQuery,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const calendarRaw = calendarResponse.data?.data?.matchedUser?.userCalendar?.submissionCalendar;

    const calendarData = calendarRaw ? JSON.parse(calendarRaw) : {};
    

    return NextResponse.json({
      username: leetcodeUsername,
      solved: totalSolved,
      medium,
      easy,
      hard,
      calendar: calendarData,
    });
  } catch (error) {
    console.error("LeetCode fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch LeetCode data" }, { status: 503 });
  }
}
