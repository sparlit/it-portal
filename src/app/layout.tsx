import './globals.css'
import { Inter } from 'next/font/google'
import { I18nProvider } from '@/lib/i18n/context'
import { ThemeProvider } from '@/lib/theme-context'
import { CommandPalette } from '@/components/shared/navigation/CommandPalette'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Artemis Industrial Ecosystem',
  description: 'Elite Multi-tenant Departmental Management System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <I18nProvider>
            <CommandPalette />
            {children}
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
