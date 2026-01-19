import { prisma } from '@/lib/prisma'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function getSermons(search?: string) {
  const sermons = await prisma.sermon.findMany({
    where: {
      isPublished: true,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { speaker: { contains: search, mode: 'insensitive' } },
          { tags: { hasSome: [search] } },
        ],
      }),
    },
    orderBy: { date: 'desc' },
  })
  return sermons
}

export default async function SermonsPage({
  searchParams,
}: {
  searchParams: { search?: string }
}) {
  const search = searchParams.search
  const sermons = await getSermons(search)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Sermons
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Browse our collection of sermons and teachings to grow in your faith.
        </p>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto mb-8">
        <form className="relative">
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Search sermons..."
            className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </form>
      </div>

      {sermons.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sermons.map((sermon) => (
            <Card key={sermon.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {sermon.thumbnailUrl && (
                <div className="aspect-video bg-gray-200">
                  <img
                    src={sermon.thumbnailUrl}
                    alt={sermon.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              {!sermon.thumbnailUrl && (
                <div className="aspect-video bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                  <svg className="w-16 h-16 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <time dateTime={sermon.date.toISOString()}>
                    {new Date(sermon.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                  {sermon.duration && (
                    <>
                      <span>•</span>
                      <span>{sermon.duration}</span>
                    </>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{sermon.title}</h3>
                {sermon.speaker && (
                  <p className="text-sm text-primary-600 mb-2">{sermon.speaker}</p>
                )}
                {sermon.description && (
                  <p className="text-gray-600 text-sm line-clamp-2">{sermon.description}</p>
                )}
                {sermon.tags && sermon.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {sermon.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {sermon.videoUrl && (
                  <Link
                    href={sermon.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 text-primary-600 hover:text-primary-700 font-medium text-sm"
                  >
                    Watch Now
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="max-w-md mx-auto">
          <CardContent className="py-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {search ? 'No sermons found' : 'No Sermons Yet'}
            </h2>
            <p className="text-gray-600">
              {search
                ? 'Try adjusting your search terms.'
                : 'Check back soon for new sermons and teachings.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
