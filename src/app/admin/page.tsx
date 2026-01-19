import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function getStats() {
  const [users, sermons, events, prayerRequests, donations] = await Promise.all([
    prisma.user.count(),
    prisma.sermon.count(),
    prisma.event.count(),
    prisma.prayerRequest.count(),
    prisma.donationIntent.aggregate({
      _sum: { amount: true },
      _count: true,
    }),
  ])

  return {
    users,
    sermons,
    events,
    prayerRequests,
    donations: donations._count,
    totalDonations: donations._sum.amount || 0,
  }
}

async function getRecentActivity() {
  const [recentUsers, recentPrayers] = await Promise.all([
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, createdAt: true },
    }),
    prisma.prayerRequest.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true } } },
    }),
  ])

  return { recentUsers, recentPrayers }
}

export default async function AdminPage() {
  const stats = await getStats()
  const { recentUsers, recentPrayers } = await getRecentActivity()

  const statCards = [
    { label: 'Total Users', value: stats.users, href: '/admin/users', color: 'bg-blue-500' },
    { label: 'Sermons', value: stats.sermons, href: '/admin/sermons', color: 'bg-purple-500' },
    { label: 'Events', value: stats.events, href: '/admin/events', color: 'bg-green-500' },
    { label: 'Prayer Requests', value: stats.prayerRequests, href: '/admin', color: 'bg-yellow-500' },
    { label: 'Donations', value: stats.donations, href: '/admin/donations', color: 'bg-pink-500' },
    { label: 'Total Raised', value: `$${stats.totalDonations.toFixed(2)}`, href: '/admin/donations', color: 'bg-indigo-500' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of your ministry platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
                  <span className="text-white text-lg font-bold">
                    {typeof stat.value === 'number' ? stat.value : '$'}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Recent Users */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Users</h2>
              <Link href="/admin/users" className="text-sm text-primary-600 hover:text-primary-700">
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-medium">
                        {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name || 'No name'}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Prayer Requests */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Prayer Requests</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPrayers.map((prayer) => (
                <div key={prayer.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <p className="font-medium text-gray-900">{prayer.title}</p>
                  <p className="text-sm text-gray-500 line-clamp-1">{prayer.content}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    by {prayer.isAnonymous ? 'Anonymous' : prayer.user.name} •{' '}
                    {new Date(prayer.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
