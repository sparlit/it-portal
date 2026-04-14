import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'TSysLab Ecosystem',
  description: 'Industrial-Grade IT & Laundry Management',
}

/**
 * Root HTML layout that applies the Inter font and renders the application content.
 *
 * @param children - Content to be rendered inside the document body
 * @returns A React element representing the `<html>` document with `children` placed inside the `<body>`
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
