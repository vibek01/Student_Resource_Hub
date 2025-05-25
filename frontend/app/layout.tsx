import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { ReactNode } from 'react' // ✅ import this

export const metadata = {
  title: 'Student Resource Hub',
  description: 'Platform for all learners',
}

// ✅ Add a type for the children
interface RootLayoutProps {
  children: ReactNode
}

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100 dark:bg-zinc-900 text-gray-900 dark:text-gray-100`}>
        <Navbar />
        <main className="min-h-screen p-4">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
