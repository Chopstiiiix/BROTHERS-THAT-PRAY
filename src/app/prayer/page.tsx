import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PrayerWall } from './prayer-wall'

export const dynamic = 'force-dynamic'

async function getPrayerRequests(userId: string) {
  const requests = await prisma.prayerRequest.findMany({
    where: {
      OR: [
        { isPublic: true },
        { userId },
      ],
    },
    include: {
      user: {
        select: { id: true, name: true },
      },
      comments: {
        include: {
          user: {
            select: { id: true, name: true },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
      prayedFor: true,
      _count: {
        select: { prayedFor: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
  return requests
}

export default async function PrayerPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/auth/signin?callbackUrl=/prayer')
  }

  const requests = await getPrayerRequests(session.user.id)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Prayer Wall
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Share your prayer requests and support your brothers in prayer.
        </p>
      </div>

      <PrayerWall requests={requests} currentUserId={session.user.id} />
    </div>
  )
}
