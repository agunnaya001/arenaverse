import type { Metadata, Viewport } from 'next'
import { Inter, Orbitron } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import { Providers } from '@/components/providers'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const orbitron = Orbitron({ 
  subsets: ['latin'],
  variable: '--font-orbitron',
})

export const metadata: Metadata = {
  title: 'ArenaVerse | Play to Earn on Base',
  description: 'Premium Web3 gaming platform. Collect Champion NFTs, battle in PvE and PvP arenas, trade in the marketplace, and earn ARENA rewards.',
  keywords: ['GameFi', 'NFT', 'Web3', 'Gaming', 'Base', 'Champions', 'PVP', 'Staking', 'Blockchain'],
  openGraph: {
    title: 'ArenaVerse | Play to Earn on Base',
    description: 'Premium Web3 gaming platform on Base blockchain.',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 120,
        height: 120,
        alt: 'ArenaVerse Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ArenaVerse | Play to Earn on Base',
    description: 'Premium Web3 gaming platform on Base blockchain.',
    images: ['/logo.png'],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ArenaVerse',
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a12',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${orbitron.variable} font-sans antialiased min-h-screen bg-background`}>
        <Providers>
          {children}
          <Toaster 
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'oklch(0.17 0.02 260)',
                border: '1px solid oklch(0.28 0.02 260)',
                color: 'oklch(0.95 0.01 260)',
              },
            }}
          />
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
