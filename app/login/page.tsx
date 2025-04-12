"use client"

import React, { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FcGoogle } from "react-icons/fc"
import { signIn, useSession } from "next-auth/react"
import { useAuth } from "@/contexts/auth-context"

export default function AuthPage() {
  const router = useRouter()
  const pathname = usePathname()
  const [formData, setFormData] = useState({ username: "", password: "" })
  const [isLogin, setIsLogin] = useState(true)
  const { setUsername } = useAuth()
  const { data: session } = useSession()

  // Update isLogin mode based on URL
  useEffect(() => {
    setIsLogin(pathname === "/login")
  }, [pathname])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    const endpoint = isLogin ? "/api/login" : "/api/register"
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })

    const data = await res.json()

    if (res.ok) {
      localStorage.setItem("token", data.token)
      localStorage.setItem("username", formData.username)
      setUsername(formData.username)
      router.push("/")
    } else {
      alert(data.message)
    }
  }

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/" })
  }

  useEffect(() => {
    if (session?.user?.name) {
      setUsername(session.user.name)
      localStorage.setItem("username", session.user.name)
    }
  }, [session, setUsername])

  const toggleMode = () => {
    router.push(isLogin ? "/register" : "/login")
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-background text-foreground px-4">
  <Card className="w-full max-w-md p-6 border border-border bg-card rounded-2xl shadow-xl">
    <CardContent>
      <h2 className="text-3xl font-extrabold mb-6 text-center text-accent animate-pulse">
        {isLogin ? "Login to CodeBinge" : "Create a CodeBinge Account"}
      </h2>
          <div className="space-y-4">
            <Input
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />
            <Input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <Button className="w-full" onClick={handleSubmit}>
              {isLogin ? "Login" : "Register"}
            </Button>
            <Button
              variant="outline"
              className="w-full flex gap-2 items-center justify-center"
              onClick={handleGoogleLogin}
            >
              <FcGoogle size={20} />
              {isLogin ? "Login" : "Sign up"} with Google
            </Button>
            <p className="text-center text-sm mt-2">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={toggleMode}
                className="text-blue-600 hover:underline"
              >
                {isLogin ? "Register" : "Login"}
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
