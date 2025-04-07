"use client"

import { SessionProvider } from "next-auth/react"
import { AuthProvider } from "@/contexts/auth-context"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { DashboardDataProvider } from "@/contexts/dashboard-data-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <DashboardDataProvider>
            <SidebarProvider>{children}</SidebarProvider>
          </DashboardDataProvider>
        </ThemeProvider>
      </AuthProvider>
    </SessionProvider>
  )
}
