'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card'
import { createPrayerRequest, addComment, togglePrayed, deletePrayerRequest } from '@/actions/prayer'

type PrayerRequest = {
  id: string
  title: string
  content: string
  isAnonymous: boolean
  isPublic: boolean
  userId: string
  user: { id: string; name: string | null }
  comments: Array<{
    id: string
    content: string
    user: { id: string; name: string | null }
    createdAt: Date
  }>
  prayedFor: Array<{ userId: string }>
  _count: { prayedFor: number }
  createdAt: Date
}

export function PrayerWall({
  requests,
  currentUserId,
}: {
  requests: PrayerRequest[]
  currentUserId: string
}) {
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    await createPrayerRequest(formData)

    setIsSubmitting(false)
    setShowForm(false)
    ;(e.target as HTMLFormElement).reset()
  }

  const handlePray = async (requestId: string) => {
    await togglePrayed(requestId)
  }

  const handleComment = async (e: React.FormEvent<HTMLFormElement>, requestId: string) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.append('prayerRequestId', requestId)
    await addComment(formData)
    ;(e.target as HTMLFormElement).reset()
  }

  const handleDelete = async (requestId: string) => {
    if (confirm('Are you sure you want to delete this prayer request?')) {
      await deletePrayerRequest(requestId)
    }
  }

  return (
    <div className="space-y-6">
      {/* New Request Form */}
      {showForm ? (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">New Prayer Request</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                name="title"
                label="Title"
                placeholder="Brief title for your request"
                required
              />
              <Textarea
                name="content"
                label="Prayer Request"
                placeholder="Share what you'd like prayer for..."
                rows={4}
                required
              />
              <div className="flex flex-col sm:flex-row gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="isAnonymous" value="true" className="rounded" />
                  <span className="text-sm text-gray-700">Post anonymously</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="isPublic" value="false" className="rounded" />
                  <span className="text-sm text-gray-700">Private (only visible to you)</span>
                </label>
              </div>
              <div className="flex gap-3">
                <Button type="submit" isLoading={isSubmitting}>Submit Request</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Button onClick={() => setShowForm(true)} size="lg">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Prayer Request
        </Button>
      )}

      {/* Prayer Requests List */}
      <div className="space-y-4">
        {requests.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No Prayer Requests Yet</h2>
              <p className="text-gray-600">Be the first to share a prayer request with the community.</p>
            </CardContent>
          </Card>
        ) : (
          requests.map((request) => {
            const hasPrayed = request.prayedFor.some((p) => p.userId === currentUserId)
            const isOwner = request.userId === currentUserId
            const isExpanded = expandedRequest === request.id

            return (
              <Card key={request.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{request.title}</h3>
                      <p className="text-sm text-gray-500">
                        {request.isAnonymous ? 'Anonymous' : request.user.name || 'Unknown'} •{' '}
                        {new Date(request.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                        {!request.isPublic && (
                          <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Private</span>
                        )}
                      </p>
                    </div>
                    {isOwner && (
                      <button
                        onClick={() => handleDelete(request.id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-gray-700 whitespace-pre-wrap">{request.content}</p>
                </CardContent>
                <CardFooter className="flex flex-col items-stretch gap-4">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handlePray(request.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        hasPrayed
                          ? 'bg-primary-100 text-primary-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <svg className="w-5 h-5" fill={hasPrayed ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>{request._count.prayedFor} prayed</span>
                    </button>
                    <button
                      onClick={() => setExpandedRequest(isExpanded ? null : request.id)}
                      className="text-gray-500 hover:text-gray-700 text-sm"
                    >
                      {request.comments.length} comments {isExpanded ? '▲' : '▼'}
                    </button>
                  </div>

                  {/* Comments Section */}
                  {isExpanded && (
                    <div className="border-t pt-4 space-y-4">
                      {request.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-primary-700 text-sm font-medium">
                              {comment.user.name?.charAt(0) || '?'}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm">
                              <span className="font-medium text-gray-900">{comment.user.name}</span>{' '}
                              <span className="text-gray-600">{comment.content}</span>
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}

                      <form onSubmit={(e) => handleComment(e, request.id)} className="flex gap-2">
                        <input
                          name="content"
                          placeholder="Add a comment..."
                          className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                          required
                        />
                        <Button type="submit" size="sm">Post</Button>
                      </form>
                    </div>
                  )}
                </CardFooter>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
