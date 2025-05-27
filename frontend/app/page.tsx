'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FiBookOpen, FiShare2, FiSearch, FiArrowRight } from 'react-icons/fi'

type CircleProps = {
  width: number
  height: number
  left: string
  top: string
  yMove: number
  xMove: number
}

export default function Home() {
  const API = process.env.NEXT_PUBLIC_API_URL
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [userName, setUserName] = useState<string | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [circles, setCircles] = useState<CircleProps[]>([])

  // Track mouse
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) =>
      setCursorPosition({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Background circles
  useEffect(() => {
    const newCircles: CircleProps[] = Array.from({ length: 10 }).map(() => ({
      width: Math.random() * 100 + 50,
      height: Math.random() * 100 + 50,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      yMove: Math.random() * 100 - 50,
      xMove: Math.random() * 100 - 50,
    }))
    setCircles(newCircles)
  }, [])

  // Fetch current user
  useEffect(() => {
    fetch(`${API}/api/user/me`, { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error('Not authenticated')
        return res.json()
      })
      .then(data => setUserName(data.name))
      .catch(() => setUserName(null))
      .finally(() => setLoadingUser(false))
  }, [API])

  const features = [
    {
      icon: <FiBookOpen className="w-6 h-6" />,
      title: 'Curated Resources',
      description: 'Hand-picked materials from top educators',
    },
    {
      icon: <FiShare2 className="w-6 h-6" />,
      title: 'Community Sharing',
      description: 'Share your finds with fellow students',
    },
    {
      icon: <FiSearch className="w-6 h-6" />,
      title: 'Smart Search',
      description: 'Find exactly what you need quickly',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-zinc-900 dark:to-zinc-800 overflow-hidden">
      {/* Animated Background Circles */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {circles.map((circle, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-indigo-200 dark:bg-indigo-900 opacity-20"
            style={{
              width: circle.width,
              height: circle.height,
              left: circle.left,
              top: circle.top,
            }}
            animate={{
              y: [0, circle.yMove],
              x: [0, circle.xMove],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
        ))}
      </motion.div>

      {/* Cursor Follower */}
      <motion.div
        className="fixed w-64 h-64 rounded-full bg-indigo-100 dark:bg-indigo-900 opacity-10 pointer-events-none"
        animate={{
          x: cursorPosition.x - 128,
          y: cursorPosition.y - 128,
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      />

      <div className="relative z-10 text-center py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <motion.h1
            className="text-6xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            Student Resource Hub
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Discover, share, and collaborate on the best learning resources
            with students worldwide.
          </motion.p>

          {/* Conditionally show buttons */}
          {loadingUser ? (
            <Loader />
          ) : userName ? (
            <Link href="/upload">
              <motion.button
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center mx-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Contributing <FiArrowRight className="ml-2" />
              </motion.button>
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
              <Link href="/auth/login">
                <motion.button
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Login <FiArrowRight className="ml-2" />
                </motion.button>
              </Link>
              <Link href="/auth/signup">
                <motion.button
                  className="bg-white dark:bg-zinc-700 text-gray-800 dark:text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center border border-gray-200 dark:border-zinc-600"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign Up <FiArrowRight className="ml-2" />
                </motion.button>
              </Link>
            </div>
          )}
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-3xl font-semibold mb-12 text-gray-800 dark:text-white">
            Why Choose Our Platform?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
            {features.map((f, i) => (
              <motion.div
                key={i}
                className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-zinc-700"
                whileHover={{ y: -10 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
              >
                <div className="w-12 h-12 mb-4 mx-auto rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  {f.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                  {f.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {f.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call-to-Action */}
        <motion.div
          className="mt-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 mx-4 shadow-xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          whileHover={{ scale: 1.02 }}
        >
          <h3 className="text-2xl font-semibold text-white mb-4">
            Ready to boost your learning?
          </h3>
          <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
            Join thousands of students who are already finding the best resources for their studies.
          </p>
          <Link href={userName ? '/upload' : '/auth/signup'}>
            <motion.button
              className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold flex items-center mx-auto"
              whileHover={{
                scale: 1.05,
                boxShadow: '0 10px 25px -5px rgba(255,255,255,0.3)',
              }}
              whileTap={{ scale: 0.95 }}
            >
              {userName ? 'Start Contributing' : 'Get Started Now'}{' '}
              <FiArrowRight className="ml-2" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

function Loader() {
  return (
    <div className="flex justify-center my-8">
      <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
    </div>
  )
}
