'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (response.ok) {
      router.refresh()
    } else {
      setError('Invalid password')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Admin Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Log In
      </button>
    </form>
  )
}

