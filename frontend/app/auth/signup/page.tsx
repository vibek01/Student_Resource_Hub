'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSignup = async () => {
    setIsLoading(true)
    setError('')
    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (res.ok) {
        router.push('/auth/login')
      } else {
        throw new Error(data.error || 'Signup failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-violet-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/10 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-violet-500/10 -z-1" />
          
          <div className="space-y-6">
            <motion.div className="text-center">
              <motion.h2 
                initial={{ y: -10 }}
                animate={{ y: 0 }}
                className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-300 mb-2"
              >
                Create Account
              </motion.h2>
              <motion.p className="text-gray-300">
                Join our learning community
              </motion.p>
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-400 text-sm p-3 bg-red-900/30 rounded-lg"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              {[
                { id: 'name', value: name, setter: setName, type: 'text' },
                { id: 'email', value: email, setter: setEmail, type: 'email' },
                { id: 'password', value: password, setter: setPassword, type: 'password' },
              ].map((field, index) => (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="relative"
                >
                  <input
                    className="w-full px-4 py-3 bg-white/5 rounded-lg border border-white/10
                             focus:border-blue-400/50 focus:ring-2 focus:ring-blue-500/20
                             outline-none transition-all duration-300 text-white
                             placeholder-gray-400"
                    type={field.type}
                    id={field.id}
                    placeholder={field.id.charAt(0).toUpperCase() + field.id.slice(1)}
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                  />
                </motion.div>
              ))}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSignup}
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg font-medium text-white 
                         hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center 
                         justify-center gap-2 cursor-pointer relative overflow-hidden"
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-white/50 border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Sign Up'
                )}
              </motion.button>
            </div>

            <motion.p className="text-center text-gray-400">
              Already have an account?{' '}
              <motion.a
                href="/auth/login"
                className="text-blue-400 hover:text-blue-300 cursor-pointer underline"
                whileHover={{ scale: 1.02 }}
              >
                Login here
              </motion.a>
            </motion.p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}