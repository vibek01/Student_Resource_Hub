'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

interface Resource {
  _id: string
  title: string
  description: string
  categories: string[]
  file_type: string
  uploaded_at: string
  external_link?: string
  bookmarked_by?: string[]
}

export default function ResourceList() {
  const API = process.env.NEXT_PUBLIC_API_URL
  const [allResources, setAllResources] = useState<Resource[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [fileType, setFileType] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10
  const totalPages = Math.ceil(resources.length / pageSize)
  const router = useRouter()

  useEffect(() => {
    fetchResources()
    fetchUser()
  }, [API])

  const fetchUser = async () => {
    try {
      const res = await fetch(`${API}/api/user/me`, {
        credentials: 'include',
      })
      if (!res.ok) throw new Error()
      const user = await res.json()
      setUserId(user._id)
    } catch {
      setUserId(null)
    }
  }

  const fetchResources = async () => {
    const res = await fetch(`${API}/api/resources/list`)
    const data = await res.json()
    setAllResources(data)
    setResources(data)
  }

  const filterResources = () => {
    let filtered = allResources
    const q = searchQuery.toLowerCase()

    if (fileType) {
      filtered = filtered.filter(
        (r) => r.file_type.toLowerCase() === fileType
      )
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          (Array.isArray(r.categories) &&
            r.categories.some((cat) => cat.toLowerCase().includes(q)))
      )
    }

    setResources(filtered)
    setCurrentPage(1)
  }

  useEffect(() => {
    filterResources()
  }, [searchQuery, fileType])

  const handleCopy = (link: string, id: string) => {
    navigator.clipboard.writeText(link)
    setCopiedLinkId(id)
    setTimeout(() => setCopiedLinkId(null), 2000)
  }

  const handleBookmark = async (resId: string) => {
    if (!userId) {
      alert('Please log in to bookmark.')
      return
    }
    try {
      const res = await fetch(`${API}/api/user/bookmark/${resId}`, {
        method: 'POST',
        credentials: 'include',
      })
      const data = await res.json()
      if (res.ok) {
        setResources((prev) =>
          prev.map((r) =>
            r._id === resId
              ? {
                  ...r,
                  bookmarked_by: data.bookmarked
                    ? [...(r.bookmarked_by || []), userId]
                    : (r.bookmarked_by || []).filter((id) => id !== userId),
                }
              : r
          )
        )
      } else {
        alert(data.error || 'Failed to update bookmark')
      }
    } catch {
      alert('Error updating bookmark')
    }
  }

  // resources to display on this page
  const paginated = resources.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  return (
    <div className="max-w-6xl mx-auto px-4 pt-28 pb-12 text-white">
      <h2 className="text-4xl font-bold mb-8 text-center text-violet-300 animate-slide-up">
        📚 Explore Resources
      </h2>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10 animate-fade-in">
        <input
          type="text"
          placeholder="Search resources..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-2/4 lg:w-1/3 p-3 rounded-full bg-gradient-to-r from-slate-800 via-violet-900 to-slate-800 text-white placeholder-gray-300 backdrop-blur-md border border-violet-700 shadow-inner shadow-violet-900/30 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
        />

        <select
          value={fileType}
          onChange={(e) => setFileType(e.target.value)}
          className="w-full md:w-1/3 p-3 rounded-md bg-slate-800 text-white border border-slate-600 shadow focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
        >
          <option value="">All Types</option>
          <option value="pdf">PDF</option>
          <option value="png">PNG</option>
          <option value="jpg">JPG</option>
          <option value="jpeg">JPEG</option>
          <option value="gif">GIF</option>
          <option value="txt">Text</option>
        </select>
      </div>

      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 animate-fade-in">
        {paginated.map((res) => (
          <div
            key={res._id}
            className="relative bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 border border-violet-800/30 shadow-[0_8px_30px_rgb(78,70,120,0.2)] rounded-2xl p-6 transition-transform duration-300 hover:scale-[1.02] hover:shadow-purple-800/50 backdrop-blur-xl bg-opacity-60"
          >
            <div className="absolute top-4 right-4 flex gap-2 flex-wrap">
              {res.categories?.slice(0, 3).map((cat, i) => (
                <span
                  key={i}
                  className="text-xs font-semibold px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 via-violet-500 to-purple-700 text-white shadow"
                >
                  {cat}
                </span>
              ))}
            </div>

            <h3 className="text-2xl font-semibold mb-2 text-violet-200">
              {res.title}
            </h3>
            <p className="text-violet-100 mb-3">{res.description}</p>

            <div className="text-sm text-gray-400 space-y-1 mb-3">
              <p>
                <span className="font-medium text-violet-300">Type:</span>{' '}
                {res.file_type.toUpperCase()}
              </p>
              <p>
                <span className="font-medium text-violet-300">Uploaded:</span>{' '}
                {new Date(res.uploaded_at).toLocaleString()}
              </p>
            </div>

            {res.external_link && (
              <div className="flex items-center justify-between text-sm bg-zinc-800 text-gray-200 p-2 px-3 rounded-lg mb-3">
                <span className="truncate">{res.external_link}</span>
                <button
                  onClick={() => handleCopy(res.external_link!, res._id)}
                  className="ml-2 text-violet-400 hover:text-violet-300 transition-all text-xs font-semibold"
                >
                  {copiedLinkId === res._id ? '✅ Copied' : '📋 Copy'}
                </button>
              </div>
            )}

            {userId && (
              <div className="flex justify-start mt-4">
                <button
                  onClick={() => handleBookmark(res._id)}
                  className="text-sm bg-violet-600 hover:bg-violet-700 text-white px-4 py-1.5 rounded-md shadow transition-all"
                  aria-label={
                    res.bookmarked_by?.includes(userId)
                      ? 'Remove bookmark'
                      : 'Add bookmark'
                  }
                >
                  {res.bookmarked_by?.includes(userId)
                    ? 'Remove Bookmark'
                    : 'Add Bookmark'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-6 mt-8">
          <motion.button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            whileHover={currentPage > 1 ? { scale: 1.05 } : {}}
            className={`px-4 py-2 rounded-full text-white font-medium shadow transition-transform ${
              currentPage === 1
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-violet-600 hover:bg-violet-700'
            }`}
          >
            Previous
          </motion.button>

          <span className="text-white">
            Page {currentPage} of {totalPages}
          </span>

          <motion.button
            onClick={() =>
              setCurrentPage((p) => Math.min(p + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            whileHover={currentPage < totalPages ? { scale: 1.05 } : {}}
            className={`px-4 py-2 rounded-full text-white font-medium shadow transition-transform ${
              currentPage === totalPages
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-violet-600 hover:bg-violet-700'
            }`}
          >
            Next
          </motion.button>
        </div>
      )}
    </div>
  )
}