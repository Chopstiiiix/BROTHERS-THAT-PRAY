import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ProfileForm } from './profile-form'

export const dynamic = 'force-dynamic'

async function getUserData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          prayerRequests: true,
          comments: true,
          prayedFor: true,
        },
      },
    },
  })
  return user
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/auth/signin?callbackUrl=/profile')
  }

  const user = await getUserData(session.user.id)

  if (!user) {
    redirect('/auth/signin')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Stats */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-primary-700">
                  {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">{user.name || 'No name set'}</h2>
              <p className="text-gray-500">{user.email}</p>
              {user.role === 'ADMIN' && (
                <span className="inline-block mt-2 px-3 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                  Admin
                </span>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-4">Activity</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Prayer Requests</span>
                <span className="font-semibold text-gray-900">{user._count.prayerRequests}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Comments</span>
                <span className="font-semibold text-gray-900">{user._count.comments}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Prayers Given</span>
                <span className="font-semibold text-gray-900">{user._count.prayedFor}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Member Since</h3>
            <p className="text-gray-900">
              {new Date(user.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Edit Profile */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Edit Profile</h2>
            <ProfileForm user={user} />
          </div>
        </div>
      </div>
    </div>
  )
}
