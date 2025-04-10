"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Zap } from "lucide-react";

interface Contest {
  id: number | string;
  day: number;
  month: string;
  platform: string;
  name: string;
  date: string;
  time: string;
  duration: string;
  added: boolean;
  icon: string;
}

interface UpcomingContestsProps {
  contests?: Contest[] | null;
  onAdd: (contest: Contest) => void; // <-- Add this
}

export function UpcomingContests({ contests, onAdd }: UpcomingContestsProps) {
  const safeContests = Array.isArray(contests) ? contests : [];

  if (safeContests.length === 0) {
    return <div className="text-center text-muted-foreground">No upcoming contests found.</div>;
  }

  return (
    <div className="space-y-4">
      {safeContests.map((contest) => (
        <Card key={contest.id} className="glow-card overflow-hidden">
          <CardContent className="p-0">
            <div className="flex">
              <div className="flex w-16 flex-col items-center justify-center bg-secondary/30 p-4">
                <span className="text-lg font-bold">{contest.day}</span>
                <span className="text-sm text-muted-foreground">{contest.month}</span>
              </div>
              <div className="flex flex-1 items-center justify-between p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{contest.icon}</span>
                    <h3 className="font-semibold">{contest.name}</h3>
                    <Badge variant="outline" className="ml-2 bg-secondary/50">
                      {contest.platform}
                    </Badge>
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{contest.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{contest.time}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Zap className="h-4 w-4 text-neon-cyan" />
                    <span className="text-sm">{contest.duration}</span>
                  </div>
                  <button
                    disabled={contest.added}
                    onClick={() => onAdd(contest)} // Call parent handler
                    className={`rounded-md px-3 py-1 text-sm transition ${
                      contest.added
                        ? "bg-teal-900/50 text-teal-400 cursor-default"
                        : "bg-secondary/50 hover:bg-secondary/80"
                    }`}
                  >
                    {contest.added ? "Added to Calendar" : "Add to Calendar"}
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
