import { defineStore } from 'pinia'

interface ThemeState {
  currentTheme: string
  departmentColors: Record<string, string>
}

export const useThemeStore = defineStore('theme', {
  state: (): ThemeState => ({
    currentTheme: 'default',
    departmentColors: {
      it: '#32CD32',
      finance: '#002366',
      hr: '#008080',
      production: '#F59E0B',
      sales: '#10B981',
      transport: '#228B22',
      admin: '#4B5563'
    }
  }),
  actions: {
    setTheme(department: string) {
      this.currentTheme = department
      const color = this.departmentColors[department] || '#0F172A'
      document.documentElement.style.setProperty('--color-primary', color)
    }
  }
})
