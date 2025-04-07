"use client"

import { createContext, useContext, useEffect, useState } from "react"

type AuthContextType = {
  username: string
  setUsername: (username: string) => void
}

const AuthContext = createContext<AuthContextType>({
  username: "",
  setUsername: () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [username, setUsername] = useState("")

  useEffect(() => {
    const stored = localStorage.getItem("username")
    if (stored) setUsername(stored)
  }, [])

  return (
    <AuthContext.Provider value={{ username, setUsername }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
