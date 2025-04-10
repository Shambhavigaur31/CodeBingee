"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { signOut, useSession } from "next-auth/react"

import {
  BarChart3,
  Calendar,
  Code2,
  Home,
  MessageSquare,
  Settings,
  LogOut,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export function AppSidebar() {
  const pathname = usePathname()
  const { username: localUsername, setUsername } = useAuth()
  const { data: session } = useSession()
  const [open, setOpen] = useState(true)

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    setUsername("")
    signOut({ callbackUrl: "/" })
  }

  const displayUsername = session?.user?.name || localUsername || "Guest"

  const menuItems = [
    {
      title: "Register/Login",
      icon: Settings,
      href: "/login",
    },
    {
      title: "Dashboard",
      icon: Home,
      href: "/",
    },
    {
      title: "Analytics",
      icon: BarChart3,
      href: "/analytics",
    },
    {
      title: "Contests",
      icon: Calendar,
      href: "/contests",
    },
    {
      title: "Community",
      icon: MessageSquare,
      href: "/community",
    },
    {
      title: "Coding Assistant",
      icon: Code2,
      href: "/assistant",
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary">
            <Code2 className="h-5 w-5 text-neon-cyan" />
          </div>
          <span className="text-xl font-bold tracking-wider text-white">CodeBinge</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                <Link href={item.href}>
                  <item.icon className={pathname === item.href ? "text-neon-cyan" : ""} />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex flex-col gap-3 w-full">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{displayUsername}</p>
                <p className="text-xs text-muted-foreground">Coding Innovator</p>
              </div>
            </div>
            <ThemeToggle />
          </div>

          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full flex items-center gap-2 justify-center text-sm"
          >
            <LogOut size={16} />
            Logout
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
