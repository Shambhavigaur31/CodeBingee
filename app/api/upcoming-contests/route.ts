import { NextResponse } from "next/server";

export async function GET() {
  try {
    // LeetCode
    const leetcodeRes = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          query {
            allContests {
              title
              titleSlug
              startTime
              duration
              originStartTime
              isVirtual
            }
          }
        `,
      }),
    });

    const leetcodeData = await leetcodeRes.json();
    const now = Date.now();

    const leetcodeContests = (leetcodeData?.data?.allContests || [])
      .filter((c: any) => c.startTime * 1000 > now)
      .map((c: any) => ({
        title: c.title,
        url: `https://leetcode.com/contest/${c.titleSlug}`,
        startTime: new Date(c.startTime * 1000).toISOString(),
        duration: Math.round(c.duration / 60), // in minutes
        isVirtual: c.isVirtual,
      }));

    // CodeChef
    const codechefRes = await fetch("https://www.codechef.com/api/list/contests/all");
    const codechefData = await codechefRes.json();

    const codechefContests = (codechefData?.future_contests || []).map((c: any) => ({
      title: c.contest_name,
      url: `https://www.codechef.com/${c.contest_code}`,
      startTime: c.contest_start_date_iso,
      endTime: c.contest_end_date_iso,
      duration: c.contest_duration, // already in minutes
    }));

    // Codeforces
    const codeforcesRes = await fetch("https://codeforces.com/api/contest.list");
    const codeforcesData = await codeforcesRes.json();

    const codeforcesContests = (codeforcesData?.result || [])
      .filter((c: any) => c.phase === "BEFORE")
      .map((c: any) => ({
        title: c.name,
        url: `https://codeforces.com/contests/${c.id}`,
        startTime: new Date(c.startTimeSeconds * 1000).toISOString(),
        duration: Math.round(c.durationSeconds / 60), // in minutes
      }));

    return NextResponse.json({
      leetcode: leetcodeContests,
      codechef: codechefContests,
      codeforces: codeforcesContests,
    });
  } catch (error) {
    console.error("Error fetching contest data:", error);
    return NextResponse.json({ error: "Failed to fetch contests" }, { status: 500 });
  }
}
