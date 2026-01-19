'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { updateProfile } from '@/actions/profile'

type User = {
  id: string
  name: string | null
  email: string
}

export function ProfileForm({ user }: { user: User }) {
  const [name, setName] = useState(user.name || '')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    const formData = new FormData()
    formData.append('name', name)

    const result = await updateProfile(formData)

    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      <Input
        id="name"
        label="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your full name"
      />

      <Input
        id="email"
        label="Email"
        value={user.email}
        disabled
        className="bg-gray-50"
      />
      <p className="text-sm text-gray-500 -mt-4">Email cannot be changed</p>

      <Button type="submit" isLoading={isLoading}>
        Save Changes
      </Button>
    </form>
  )
}
