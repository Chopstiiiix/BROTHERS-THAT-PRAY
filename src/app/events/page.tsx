import { prisma } from '@/lib/prisma'
import { Card, CardContent } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

async function getEvents() {
  const events = await prisma.event.findMany({
    where: {
      isPublished: true,
      startDate: { gte: new Date() },
    },
    orderBy: { startDate: 'asc' },
  })
  return events
}

async function getPastEvents() {
  const events = await prisma.event.findMany({
    where: {
      isPublished: true,
      startDate: { lt: new Date() },
    },
    orderBy: { startDate: 'desc' },
    take: 6,
  })
  return events
}

export default async function EventsPage() {
  const upcomingEvents = await getEvents()
  const pastEvents = await getPastEvents()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Events
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Join us for fellowship, worship, and community events.
        </p>
      </div>

      {/* Upcoming Events */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Events</h2>
        {upcomingEvents.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-16 text-center">
                      <div className="bg-primary-600 text-white rounded-t-lg py-1 text-xs font-medium">
                        {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                      <div className="bg-primary-50 text-primary-900 rounded-b-lg py-2 text-2xl font-bold">
                        {new Date(event.startDate).getDate()}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{event.title}</h3>
                      {event.location && (
                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{event.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>
                          {new Date(event.startDate).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                          {event.endDate && (
                            <> - {new Date(event.endDate).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                            })}</>
                          )}
                        </span>
                      </div>
                      {event.description && (
                        <p className="text-gray-600 text-sm line-clamp-2">{event.description}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Upcoming Events</h3>
              <p className="text-gray-600">Check back soon for new events and gatherings.</p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Past Events</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {pastEvents.map((event) => (
              <Card key={event.id} className="opacity-75">
                <CardContent className="p-4">
                  <p className="text-sm text-gray-500 mb-1">
                    {new Date(event.startDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <h3 className="font-semibold text-gray-900">{event.title}</h3>
                  {event.location && (
                    <p className="text-sm text-gray-500 mt-1">{event.location}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
