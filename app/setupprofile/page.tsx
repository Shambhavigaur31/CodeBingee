"use client"

import { useState ,useEffect} from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { signIn, useSession } from "next-auth/react"
import { useAuth } from "@/contexts/auth-context"

export default function SetupProfile() {
  const [formData, setFormData] = useState({
    codeforces: "",
    leetcode: "",
    codechef: "",
    gfg: "",
  })
  const router = useRouter()
  const { setUsername } = useAuth()
  const { data: session } = useSession()
  useEffect(() => {
      if (session?.user?.name) {
        setUsername(session.user.name)
        localStorage.setItem("username", session.user.name)
      }
    }, [session, setUsername])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    const username = localStorage.getItem("username")
    if (!username) {
      alert("Username not found in localStorage. Please log in again.")
      return
    }

    const res = await fetch("/api/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-username": username,
      },
      body: JSON.stringify(formData),
    })

    if (res.ok) {
      router.push("/") // Redirect after setup
    } else {
      const error = await res.json()
      alert(error.message || "Failed to save profile")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground px-4">
      <Card className="w-full max-w-md p-6 shadow-xl rounded-2xl">
        <CardContent>
          <h2 className="text-2xl font-semibold mb-6 text-center">Set Up Your Coding Profiles</h2>
          <div className="space-y-4">
            <Input name="codeforces" placeholder="Codeforces Username" onChange={handleChange} />
            <Input name="leetcode" placeholder="LeetCode Username" onChange={handleChange} />
            <Input name="codechef" placeholder="CodeChef Username" onChange={handleChange} />
            <Input name="gfg" placeholder="GeeksforGeeks Username" onChange={handleChange} />
            <Button className="w-full neon-cyan" onClick={handleSubmit}>Save</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
