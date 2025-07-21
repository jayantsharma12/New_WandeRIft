"use client"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
