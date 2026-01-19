import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

async function getLivestream() {
  const livestream = await prisma.liveStream.findFirst({
    where: { isActive: true },
  })
  return livestream
}

export default async function LivePage() {
  const livestream = await getLivestream()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Live Stream
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Join us for our live services and experience worship together as a community.
        </p>
      </div>

      {livestream ? (
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden">
            <CardHeader className="bg-primary-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{livestream.title || 'Live Service'}</h2>
                  {livestream.description && (
                    <p className="text-primary-100 mt-1">{livestream.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                  <span className="text-sm font-medium">LIVE</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="aspect-video">
                <iframe
                  src={livestream.embedUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </CardContent>
          </Card>

          {livestream.schedule && (
            <Card className="mt-6">
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Schedule</h3>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-700">{livestream.schedule}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <Card className="max-w-2xl mx-auto">
          <CardContent className="py-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Live Stream Available</h2>
            <p className="text-gray-600">
              Check back later for our next live service. Visit our sermons page to watch recorded messages.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
