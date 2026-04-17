"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

interface ThemeConfig {
  primaryColor: string
  mode: 'light' | 'dark'
  sidebar: 'expanded' | 'collapsed'
}

interface ThemeContextType {
  theme: ThemeConfig
  setTheme: (theme: Partial<ThemeConfig>, permanent?: boolean) => void
  resetTheme: () => void
}

const defaultTheme: ThemeConfig = {
  primaryColor: '#0f172a', // Slate 900
  mode: 'light',
  sidebar: 'expanded'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeConfig>(defaultTheme)

  useEffect(() => {
    // Load saved theme from localStorage for persistence if flagged
    const saved = localStorage.getItem('artemis_theme')
    if (saved) {
      try {
        setThemeState(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to parse saved theme")
      }
    }
  }, [])

  useEffect(() => {
    // Apply theme to CSS variables
    const root = document.documentElement
    root.style.setProperty('--primary-brand', theme.primaryColor)

    if (theme.mode === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  const setTheme = (newConfig: Partial<ThemeConfig>, permanent: boolean = false) => {
    const updated = { ...theme, ...newConfig }
    setThemeState(updated)

    if (permanent) {
      localStorage.setItem('artemis_theme', JSON.stringify(updated))
      // In a real app, we would also call an API to save this to the User model in DB
      fetch('/api/core/user/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ themeConfig: updated, isThemePermanent: true })
      }).catch(console.error)
    }
  }

  const resetTheme = () => {
    setThemeState(defaultTheme)
    localStorage.removeItem('artemis_theme')
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within a ThemeProvider')
  return context
}
