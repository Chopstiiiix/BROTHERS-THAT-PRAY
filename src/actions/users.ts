'use server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function updateUserRole(userId: string, role: 'USER' | 'ADMIN') {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return { error: 'Unauthorized' }
  }

  // Prevent admin from demoting themselves
  if (userId === session.user.id && role === 'USER') {
    return { error: 'You cannot demote yourself' }
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role },
  })

  revalidatePath('/admin/users')
  return { success: true }
}

export async function toggleUserStatus(userId: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return { error: 'Unauthorized' }
  }

  // Prevent admin from disabling themselves
  if (userId === session.user.id) {
    return { error: 'You cannot disable your own account' }
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    return { error: 'User not found' }
  }

  await prisma.user.update({
    where: { id: userId },
    data: { isActive: !user.isActive },
  })

  revalidatePath('/admin/users')
  return { success: true }
}

export async function createInviteCode(email?: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return { error: 'Unauthorized' }
  }

  const code = generateInviteCode()

  const invite = await prisma.inviteCode.create({
    data: {
      code,
      email: email || null,
      createdBy: session.user.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  })

  revalidatePath('/admin/users')
  return { success: true, code: invite.code }
}

function generateInviteCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = 'BTP-'
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}
