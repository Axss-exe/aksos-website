import { Analytics } from '@vercel/analytics/next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import type { Metadata, Viewport } from 'next'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const jetBrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' })

export const metadata: Metadata = {
  title: 'AKSOS — Making African ecosystems legible',
  description: 'AKSOS investigates whether better ecosystem visibility can improve understanding and participation.',
  generator: 'AKSOS',
  metadataBase: new URL('https://aksos.org'),
  alternates: { canonical: '/' },
  openGraph: {
    title: 'AKSOS — Making African ecosystems legible',
    description: 'A research and development initiative exploring visibility, understanding, and participation.',
    type: 'website',
    url: 'https://aksos.org',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${jetBrainsMono.variable} antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
