import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"

interface UserOverviewProps {
  solved: number
  easy: number
  medium:number
  hard:number
}

export function UserOverview({solved,easy,medium,hard}: UserOverviewProps) {
  return (
    <Card className="glow-card overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Solved Problems</CardTitle>
          
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-6xl font-bold text-white">{solved}</div>
          <div className="rounded-full bg-secondary/30 p-2">
            <Sparkles className="h-6 w-6 text-yellow-400" />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-secondary/50">
            Easy: {easy}
          </Badge>
          <Badge variant="secondary" className="bg-secondary/50">
            Medium: {medium}
          </Badge>
          <Badge variant="secondary" className="bg-secondary/50">
            Hard: {hard}
          </Badge>
          <Badge variant="outline" className="bg-secondary/50">
            (Based on LeetCode and GFG)
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

