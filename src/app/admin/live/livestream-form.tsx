'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { updateLivestream } from '@/actions/livestream'

type LiveStream = {
  id: string
  embedUrl: string
  title: string | null
  description: string | null
  schedule: string | null
  isActive: boolean
} | null

export function LiveStreamForm({ livestream }: { livestream: LiveStream }) {
  const [embedUrl, setEmbedUrl] = useState(livestream?.embedUrl || '')
  const [title, setTitle] = useState(livestream?.title || '')
  const [description, setDescription] = useState(livestream?.description || '')
  const [schedule, setSchedule] = useState(livestream?.schedule || '')
  const [isActive, setIsActive] = useState(livestream?.isActive ?? true)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    const formData = new FormData()
    formData.append('embedUrl', embedUrl)
    formData.append('title', title)
    formData.append('description', description)
    formData.append('schedule', schedule)
    formData.append('isActive', isActive.toString())

    const result = await updateLivestream(formData)

    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'Live stream settings updated!' })
    }

    setIsLoading(false)
  }

  return (
    <Card>
      <CardContent className="pt-6">
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
            id="embedUrl"
            label="Embed URL"
            value={embedUrl}
            onChange={(e) => setEmbedUrl(e.target.value)}
            placeholder="https://www.youtube.com/embed/..."
            required
          />
          <p className="text-sm text-gray-500 -mt-4">
            YouTube: Use the embed URL format (youtube.com/embed/VIDEO_ID)
          </p>

          <Input
            id="title"
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Sunday Service"
          />

          <Textarea
            id="description"
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Join us for worship..."
            rows={3}
          />

          <Input
            id="schedule"
            label="Schedule"
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            placeholder="Every Sunday at 10:00 AM EST"
          />

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded text-primary-600"
            />
            <span className="text-gray-700">Live stream is active</span>
          </label>

          <Button type="submit" isLoading={isLoading}>
            Save Settings
          </Button>
        </form>

        {/* Preview */}
        {embedUrl && (
          <div className="mt-8 pt-8 border-t">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
            <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
              <iframe
                src={embedUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
