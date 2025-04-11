"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

const platforms = [
  { name: "Codeforces", icon: "📊", key: "codeforces" },
  { name: "LeetCode", icon: "⚡", key: "leetcode" },
  { name: "CodeChef", icon: "🍴", key: "codechef" },
  { name: "GeeksforGeeks", icon: "👨‍💻", key: "gfg" },
]
interface CompareFormProps {
  onUsernamesSet?: () => void;
}

export function CompareForm({ onUsernamesSet }: CompareFormProps) {
  const [isOpen, setIsOpen] = useState(false)

  const [usernames, setUsernames] = useState<Record<string, string>>({})
  const [friendUsernames, setFriendUsernames] = useState<Record<string, string>>({})

  useEffect(() => {
    const storedUsernames = JSON.parse(localStorage.getItem("usernames") || "{}")
    const storedFriendUsernames = JSON.parse(localStorage.getItem("friendUsernames") || "{}")

    setUsernames(storedUsernames)
    setFriendUsernames(storedFriendUsernames)
    onUsernamesSet?.()
  }, [])

  const handleChange = (platformKey: string, value: string, isFriend = false) => {
    if (isFriend) {
      setFriendUsernames((prev) => ({ ...prev, [platformKey]: value }))
    } else {
      setUsernames((prev) => ({ ...prev, [platformKey]: value }))
    }
  }

  const handleSave = () => {
    localStorage.setItem("usernames", JSON.stringify(usernames))
    localStorage.setItem("friendUsernames", JSON.stringify(friendUsernames))
  }

  return (
    <Card className="glow-card overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Compare</h2>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-center rounded-full bg-secondary/30 p-1"
          >
            <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </button>
        </div>

        {isOpen && (
          <>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <h3 className="mb-2 text-lg font-medium text-yellow-400">Your Usernames</h3>
                <div className="space-y-3">
                  {platforms.map((platform) => (
                    <div key={platform.name} className="flex items-center gap-2">
                      <div className="flex w-8 items-center justify-center text-lg">{platform.icon}</div>
                      <div className="font-medium">{platform.name}</div>
                      <Input
                        className="ml-auto w-48 bg-secondary/20"
                        placeholder="Your username"
                        value={usernames[platform.key] || ""}
                        onChange={(e) => handleChange(platform.key, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-medium text-neon-cyan">Friend Usernames</h3>
                <div className="space-y-3">
                  {platforms.map((platform) => (
                    <div key={platform.name} className="flex items-center gap-2">
                      <div className="flex w-8 items-center justify-center text-lg">{platform.icon}</div>
                      <div className="font-medium">{platform.name}</div>
                      <Input
                        className="ml-auto w-48 bg-secondary/20"
                        placeholder="Friend's username"
                        value={friendUsernames[platform.key] || ""}
                        onChange={(e) => handleChange(platform.key, e.target.value, true)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-6 flex justify-end">
            <Button onClick={handleSave} className="bg-neon-pink hover:bg-neon-pink/80 text-white">
  Save Usernames
</Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
