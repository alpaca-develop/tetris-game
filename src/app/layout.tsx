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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>{children}</body>
    </html>
  )
}