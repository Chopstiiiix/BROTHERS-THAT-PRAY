'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { createSermon, updateSermon, deleteSermon } from '@/actions/sermons'

type Sermon = {
  id: string
  title: string
  description: string | null
  speaker: string | null
  videoUrl: string | null
  audioUrl: string | null
  thumbnailUrl: string | null
  date: Date
  duration: string | null
  tags: string[]
  isPublished: boolean
}

export function SermonsManager({ sermons }: { sermons: Sermon[] }) {
  const [showForm, setShowForm] = useState(false)
  const [editingSermon, setEditingSermon] = useState<Sermon | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)

    if (editingSermon) {
      await updateSermon(editingSermon.id, formData)
    } else {
      await createSermon(formData)
    }

    setIsLoading(false)
    setShowForm(false)
    setEditingSermon(null)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this sermon?')) {
      await deleteSermon(id)
    }
  }

  const handleEdit = (sermon: Sermon) => {
    setEditingSermon(sermon)
    setShowForm(true)
  }

  return (
    <div className="space-y-6">
      {showForm ? (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">
              {editingSermon ? 'Edit Sermon' : 'Add New Sermon'}
            </h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  name="title"
                  label="Title"
                  defaultValue={editingSermon?.title}
                  required
                />
                <Input
                  name="speaker"
                  label="Speaker"
                  defaultValue={editingSermon?.speaker || ''}
                />
              </div>

              <Textarea
                name="description"
                label="Description"
                defaultValue={editingSermon?.description || ''}
                rows={3}
              />

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  name="videoUrl"
                  label="Video URL"
                  type="url"
                  defaultValue={editingSermon?.videoUrl || ''}
                  placeholder="https://youtube.com/embed/..."
                />
                <Input
                  name="audioUrl"
                  label="Audio URL"
                  type="url"
                  defaultValue={editingSermon?.audioUrl || ''}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <Input
                  name="date"
                  label="Date"
                  type="date"
                  defaultValue={editingSermon?.date.toISOString().split('T')[0]}
                  required
                />
                <Input
                  name="duration"
                  label="Duration"
                  defaultValue={editingSermon?.duration || ''}
                  placeholder="45:30"
                />
                <Input
                  name="tags"
                  label="Tags (comma-separated)"
                  defaultValue={editingSermon?.tags.join(', ') || ''}
                  placeholder="faith, prayer, love"
                />
              </div>

              <Input
                name="thumbnailUrl"
                label="Thumbnail URL"
                type="url"
                defaultValue={editingSermon?.thumbnailUrl || ''}
              />

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isPublished"
                  value="true"
                  defaultChecked={editingSermon?.isPublished ?? true}
                  className="rounded"
                />
                <span className="text-gray-700">Published</span>
              </label>

              <div className="flex gap-3 pt-4">
                <Button type="submit" isLoading={isLoading}>
                  {editingSermon ? 'Update Sermon' : 'Add Sermon'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false)
                    setEditingSermon(null)
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Button onClick={() => setShowForm(true)}>
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Sermon
        </Button>
      )}

      {/* Sermons List */}
      <div className="space-y-4">
        {sermons.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              No sermons yet. Add your first sermon above.
            </CardContent>
          </Card>
        ) : (
          sermons.map((sermon) => (
            <Card key={sermon.id}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{sermon.title}</h3>
                      {!sermon.isPublished && (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                          Draft
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {sermon.speaker && `${sermon.speaker} • `}
                      {new Date(sermon.date).toLocaleDateString()}
                      {sermon.duration && ` • ${sermon.duration}`}
                    </p>
                    {sermon.description && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{sermon.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(sermon)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(sermon.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
