import { Card, CardContent } from '@/components/ui/card'

export default function EventsPage() {
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

      <Card className="max-w-md mx-auto">
        <CardContent className="py-12 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Coming Soon</h3>
          <p className="text-gray-600">Check back soon for upcoming events and gatherings.</p>
        </CardContent>
      </Card>
    </div>
  )
}
