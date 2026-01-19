import { prisma } from '@/lib/prisma'
import { UsersManager } from './users-manager'

export const dynamic = 'force-dynamic'

async function getUsers() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  })
  return users
}

async function getInviteCodes() {
  const codes = await prisma.inviteCode.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
  })
  return codes
}

export default async function AdminUsersPage() {
  const users = await getUsers()
  const inviteCodes = await getInviteCodes()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-gray-600 mt-1">Manage user accounts and invite codes</p>
      </div>

      <UsersManager users={users} inviteCodes={inviteCodes} />
    </div>
  )
}
