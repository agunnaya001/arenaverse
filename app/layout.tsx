import type { Metadata, Viewport } from 'next'
import { Inter, Orbitron } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import { Web3Provider } from '@/lib/web3-context'
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
  title: 'Arena GameFi | Battle, Collect, Conquer',
  description: 'The ultimate blockchain gaming experience on Base. Collect champions, battle opponents, stake tokens, and dominate the arena.',
  keywords: ['GameFi', 'NFT', 'Blockchain', 'Gaming', 'Base', 'Champions', 'PVP', 'Staking'],
  openGraph: {
    title: 'Arena GameFi | Battle, Collect, Conquer',
    description: 'The ultimate blockchain gaming experience on Base.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a12',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${orbitron.variable} font-sans antialiased min-h-screen bg-background`}>
        <Web3Provider>
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
        </Web3Provider>
        <Analytics />
      </body>
    </html>
  )
}
