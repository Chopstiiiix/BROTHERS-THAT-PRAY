import { prisma } from '@/lib/prisma'
import { EventsManager } from './events-manager'

export const dynamic = 'force-dynamic'

async function getEvents() {
  const events = await prisma.event.findMany({
    orderBy: { startDate: 'desc' },
  })
  return events
}

export default async function AdminEventsPage() {
  const events = await getEvents()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Events</h1>
        <p className="text-gray-600 mt-1">Manage your events calendar</p>
      </div>

      <EventsManager events={events} />
    </div>
  )
}
