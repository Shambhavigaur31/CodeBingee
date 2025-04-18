// components/AuthForm.tsx
import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FcGoogle } from "react-icons/fc"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

export default function AuthForm({ isLogin }: { isLogin: boolean }) {
  const router = useRouter()
  const [formData, setFormData] = useState({ username: "", password: "" })

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
      router.push("/")
    } else {
      alert(data.message)
    }
  }

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/" })
  }

  return (
    <>
      <h2 className="text-2xl font-semibold mb-6 text-center">
        {isLogin ? "Login to CodeBinge" : "Create a CodeBinge Account"}
      </h2>
      <div className="space-y-4">
        <Input name="username" placeholder="Username" onChange={handleChange} />
        <Input name="password" type="password" placeholder="Password" onChange={handleChange} />
        <Button className="w-full" onClick={handleSubmit}>
          {isLogin ? "Login" : "Register"}
        </Button>
        <Button variant="outline" className="w-full flex gap-2 items-center justify-center" onClick={handleGoogleLogin}>
          <FcGoogle size={20} />
          {isLogin ? "Login" : "Sign up"} with Google
        </Button>
        <p className="text-center text-sm mt-2">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <a href={isLogin ? "/register" : "/login"} className="text-blue-600 hover:underline">
            {isLogin ? "Register" : "Login"}
          </a>
        </p>
      </div>
    </>
  )
}
