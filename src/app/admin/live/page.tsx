import { prisma } from '@/lib/prisma'
import { LiveStreamForm } from './livestream-form'

export const dynamic = 'force-dynamic'

async function getLivestream() {
  const livestream = await prisma.liveStream.findFirst()
  return livestream
}

export default async function AdminLivePage() {
  const livestream = await getLivestream()

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Live Stream Settings</h1>
        <p className="text-gray-600 mt-1">Configure your live stream embed and schedule</p>
      </div>

      <LiveStreamForm livestream={livestream} />
    </div>
  )
}
