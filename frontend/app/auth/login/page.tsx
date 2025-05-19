'use client'

import { useState } from 'react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    const data = await res.json()
    if (res.ok) {
      alert('Login Successful')
      // store token, redirect to dashboard, etc.
    } else {
      alert(data.error)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <input className="w-full p-2 mb-3 rounded bg-gray-100 dark:bg-zinc-700" type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input className="w-full p-2 mb-3 rounded bg-gray-100 dark:bg-zinc-700" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700" onClick={handleLogin}>Login</button>
    </div>
  )
}
