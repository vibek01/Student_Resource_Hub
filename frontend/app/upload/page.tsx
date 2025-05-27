'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const API = process.env.NEXT_PUBLIC_API_URL

const ALL_CATEGORIES = [
  "AI", "Web", "ML", "DL", "Blockchain", "Cybersecurity", "Cloud",
  "DevOps", "React", "Next.js", "Node.js", "Python", "Flask", "Django",
  "Java", "C++", "C", "JavaScript", "TypeScript", "Go", "Rust", "Kotlin",
  "Swift", "UI/UX", "Linux", "Data Science", "Big Data", "Database",
  "SQL", "NoSQL", "MongoDB", "Firebase", "Android", "iOS", "AR/VR",
  "Game Dev", "Networking", "Agile", "Git", "Open Source", "Math", "DSA"
]

const FILE_TYPES = ["pdf", "txt", "img", "doc", "code", "other"]

export default function UploadResource() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [fileType, setFileType] = useState('')
  const [externalLink, setExternalLink] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API}/api/user/me`, {
          credentials: 'include',
        })
        if (!res.ok) throw new Error('Not logged in')
        const user = await res.json()
        setUserId(user._id)
      } catch {
        alert('You must be logged in to upload a resource.')
      }
    }
    fetchUser()
  }, [API])

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(cat)) return prev.filter(c => c !== cat)
      if (prev.length >= 3) {
        alert("You can select up to 3 categories only.")
        return prev
      }
      return [...prev, cat]
    })
  }

  const handleUpload = async () => {
    if (!title || !description || selectedCategories.length === 0 || !fileType || !externalLink) {
      return alert('Please fill all required fields.')
    }
    if (selectedCategories.length < 1 || selectedCategories.length > 3) {
      return alert('Select between 1 to 3 categories.')
    }
    if (!userId) {
      return alert('User not logged in.')
    }

    setIsLoading(true)
    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('categories', selectedCategories.join(','))
    formData.append('file_type', fileType)
    formData.append('external_link', externalLink)
    formData.append('user_id', userId)

    try {
      const res = await fetch(`${API}/api/resources/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      const data = await res.json()
      if (res.ok) {
        alert('Resource uploaded successfully!')
        setTitle('')
        setDescription('')
        setSelectedCategories([])
        setFileType('')
        setExternalLink('')
      } else {
        alert(`Upload failed: ${data.error}`)
      }
    } catch {
      alert('Upload failed due to a network error.')
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
        className="w-full max-w-2xl relative"
      >
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-violet-500/10 z-0 pointer-events-none rounded-2xl" />

        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="relative z-10 bg-white/5 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/10 overflow-hidden"
        >
          <div className="space-y-6">
            <div className="text-center">
              <motion.h2 
                initial={{ y: -10 }}
                animate={{ y: 0 }}
                className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-300 mb-2"
              >
                Share Your Resource
              </motion.h2>
              <p className="text-gray-300">Contribute to the developer community</p>
            </div>

            <div className="space-y-4">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} whileHover={{ scale: 1.02 }}>
                <input
                  type="text"
                  placeholder="Title *"
                  className="w-full px-4 py-3 bg-white/5 rounded-lg border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} whileHover={{ scale: 1.02 }}>
                <textarea
                  placeholder="Description *"
                  className="w-full px-4 py-3 bg-white/5 rounded-lg border border-white/10 text-white placeholder-gray-400 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-2">
                <label className="block text-sm font-medium text-violet-300">Select Categories (1-3):</label>
                <div className="flex flex-wrap gap-2">
                  {ALL_CATEGORIES.map((cat) => (
                    <motion.button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors
                        ${selectedCategories.includes(cat)
                          ? 'bg-violet-600 text-white border-violet-500'
                          : 'bg-white/5 text-gray-300 border-white/10 hover:border-violet-400'}`}
                    >
                      {cat}
                    </motion.button>
                  ))}
                </div>
                <p className="text-sm text-gray-400">
                  Selected: {selectedCategories.join(', ') || 'None'}
                </p>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} whileHover={{ scale: 1.02 }}>
                <select
                  className="w-full px-4 py-3 bg-white/5 rounded-lg border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={fileType}
                  onChange={e => setFileType(e.target.value)}
                >
                  <option value="">Select File Type *</option>
                  {FILE_TYPES.map(type => (
                    <option key={type} value={type} className="bg-zinc-800 text-white">
                      {type.toUpperCase()}
                    </option>
                  ))}
                </select>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} whileHover={{ scale: 1.02 }}>
                <input
                  type="text"
                  placeholder="External Link (GitHub, blog, etc.) *"
                  className="w-full px-4 py-3 bg-white/5 rounded-lg border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={externalLink}
                  onChange={e => setExternalLink(e.target.value)}
                />
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleUpload}
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg font-medium text-white hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-white/50 border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Upload Resource'
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}