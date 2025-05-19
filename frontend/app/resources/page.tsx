'use client'

import { useEffect, useState } from 'react'

type Resource = {
  title: string
  description: string
  tags: string[]
}

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>([])

  useEffect(() => {
    fetch('http://localhost:5000/api/resources')
      .then(res => res.json())
      .then(setResources)
  }, [])

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-6">All Resources</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((res, i) => (
          <div key={i} className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow">
            <h3 className="text-xl font-bold">{res.title}</h3>
            <p>{res.description}</p>
            <span className="text-sm text-indigo-500">{res.tags.join(', ')}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
