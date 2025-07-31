import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tetris Game',
  description: 'Classic Tetris game built with Next.js and TypeScript',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}