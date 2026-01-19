'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { createEvent, updateEvent, deleteEvent } from '@/actions/events'

type Event = {
  id: string
  title: string
  description: string | null
  location: string | null
  startDate: Date
  endDate: Date | null
  imageUrl: string | null
  isPublished: boolean
}

function formatDateTimeLocal(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function EventsManager({ events }: { events: Event[] }) {
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)

    if (editingEvent) {
      await updateEvent(editingEvent.id, formData)
    } else {
      await createEvent(formData)
    }

    setIsLoading(false)
    setShowForm(false)
    setEditingEvent(null)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      await deleteEvent(id)
    }
  }

  const handleEdit = (event: Event) => {
    setEditingEvent(event)
    setShowForm(true)
  }

  return (
    <div className="space-y-6">
      {showForm ? (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">
              {editingEvent ? 'Edit Event' : 'Add New Event'}
            </h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                name="title"
                label="Title"
                defaultValue={editingEvent?.title}
                required
              />

              <Textarea
                name="description"
                label="Description"
                defaultValue={editingEvent?.description || ''}
                rows={3}
              />

              <Input
                name="location"
                label="Location"
                defaultValue={editingEvent?.location || ''}
                placeholder="123 Main St, City, State"
              />

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  name="startDate"
                  label="Start Date & Time"
                  type="datetime-local"
                  defaultValue={editingEvent ? formatDateTimeLocal(editingEvent.startDate) : ''}
                  required
                />
                <Input
                  name="endDate"
                  label="End Date & Time (optional)"
                  type="datetime-local"
                  defaultValue={editingEvent?.endDate ? formatDateTimeLocal(editingEvent.endDate) : ''}
                />
              </div>

              <Input
                name="imageUrl"
                label="Image URL"
                type="url"
                defaultValue={editingEvent?.imageUrl || ''}
              />

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isPublished"
                  value="true"
                  defaultChecked={editingEvent?.isPublished ?? true}
                  className="rounded"
                />
                <span className="text-gray-700">Published</span>
              </label>

              <div className="flex gap-3 pt-4">
                <Button type="submit" isLoading={isLoading}>
                  {editingEvent ? 'Update Event' : 'Add Event'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false)
                    setEditingEvent(null)
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
          Add Event
        </Button>
      )}

      {/* Events List */}
      <div className="space-y-4">
        {events.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              No events yet. Add your first event above.
            </CardContent>
          </Card>
        ) : (
          events.map((event) => {
            const isPast = new Date(event.startDate) < new Date()
            return (
              <Card key={event.id} className={isPast ? 'opacity-60' : ''}>
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{event.title}</h3>
                        {!event.isPublished && (
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                            Draft
                          </span>
                        )}
                        {isPast && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                            Past
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(event.startDate).toLocaleString()}
                        {event.endDate && ` - ${new Date(event.endDate).toLocaleString()}`}
                      </p>
                      {event.location && (
                        <p className="text-sm text-gray-500">{event.location}</p>
                      )}
                      {event.description && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{event.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(event)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(event.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
