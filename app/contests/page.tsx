"use client";

import { ContestCalendar } from "@/components/contests/contest-calendar";
import { UpcomingContests } from "@/components/contests/upcoming-contests";
import useSWR from "swr";
import { useState, useMemo } from "react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Format minutes to "Xh Ym" or "Xm"
const formatDuration = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

export default function ContestsPage() {
  const { data = {} } = useSWR("/api/upcoming-contests", fetcher);
  const [addedContests, setAddedContests] = useState<string[]>([]);

  const platformIcons: Record<string, string> = {
    leetcode: "⚡",
    codechef: "🍴",
    codeforces: "🎯",
  };

  const allContests = useMemo(() => {
    return Object.entries(data).flatMap(([platform, contestList]) =>
      contestList
        .map((contest: any) => {
          const rawDate = contest.startTime || contest.contest_start_date_iso;
          const endDateRaw = contest.endTime || contest.contest_end_date_iso;

          const startDate = rawDate ? new Date(rawDate) : null;
          const endDate = endDateRaw ? new Date(endDateRaw) : null;

          if (!startDate || isNaN(startDate.getTime())) return null;

          const day = startDate.getDate();
          const month = startDate.toLocaleString("default", { month: "short" });

          const minutes =
            contest.duration != null
              ? contest.duration
              : endDate && !isNaN(endDate.getTime())
              ? Math.round((endDate.getTime() - startDate.getTime()) / 60000)
              : null;

          const duration = minutes != null ? formatDuration(minutes) : "?";

          // 🔑 Generate unique ID using title + start time
          const id = `${platform}-${contest.title || contest.contest_name}-${startDate.toISOString()}`;

          return {
            id,
            name: contest.title || contest.contest_name,
            platform: platform.charAt(0).toUpperCase() + platform.slice(1),
            url:
              contest.url ||
              `https://www.${platform}.com/${contest.contest_code}`,
            date: startDate.toISOString().split("T")[0],
            time: startDate.toTimeString().slice(0, 5),
            duration,
            icon: platformIcons[platform] || "🎯",
            day,
            month,
            added: addedContests.includes(id),
          };
        })
        .filter(Boolean)
    );
  }, [data, addedContests]);

  const handleAddToCalendar = (contest: any) => {
    const id = contest.id;
    setAddedContests((prev) =>
      prev.includes(id)
        ? prev // do nothing if already added
        : [...prev, id]
    );
  };

  const addedContestObjects = useMemo(
    () => allContests.filter((c) => addedContests.includes(c.id)),
    [allContests, addedContests]
  );

  return (
    <div className="container mx-auto p-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Contests</h1>
        <p className="text-muted-foreground">
          Track and prepare for upcoming coding contests
        </p>
      </div>

      <ContestCalendar contests={addedContestObjects} />

      <div className="mt-6">
        <UpcomingContests contests={allContests} onAdd={handleAddToCalendar} />
      </div>
    </div>
  );
}
