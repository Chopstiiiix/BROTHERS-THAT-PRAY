'use server'

import { prisma } from '@/lib/prisma'
import { prayerRequestSchema, commentSchema } from '@/lib/validations'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function createPrayerRequest(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return { error: 'You must be signed in to create a prayer request' }
  }

  const data = {
    title: formData.get('title') as string,
    content: formData.get('content') as string,
    isAnonymous: formData.get('isAnonymous') === 'true',
    isPublic: formData.get('isPublic') !== 'false',
  }

  const validation = prayerRequestSchema.safeParse(data)

  if (!validation.success) {
    return { error: validation.error.errors[0].message }
  }

  await prisma.prayerRequest.create({
    data: {
      ...validation.data,
      userId: session.user.id,
    },
  })

  revalidatePath('/prayer')
  return { success: true }
}

export async function addComment(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return { error: 'You must be signed in to comment' }
  }

  const data = {
    content: formData.get('content') as string,
    prayerRequestId: formData.get('prayerRequestId') as string,
  }

  const validation = commentSchema.safeParse(data)

  if (!validation.success) {
    return { error: validation.error.errors[0].message }
  }

  await prisma.comment.create({
    data: {
      content: validation.data.content,
      prayerRequestId: validation.data.prayerRequestId,
      userId: session.user.id,
    },
  })

  revalidatePath('/prayer')
  return { success: true }
}

export async function togglePrayed(prayerRequestId: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return { error: 'You must be signed in' }
  }

  const existing = await prisma.prayedFor.findUnique({
    where: {
      userId_prayerRequestId: {
        userId: session.user.id,
        prayerRequestId,
      },
    },
  })

  if (existing) {
    await prisma.prayedFor.delete({
      where: { id: existing.id },
    })
  } else {
    await prisma.prayedFor.create({
      data: {
        userId: session.user.id,
        prayerRequestId,
      },
    })
  }

  revalidatePath('/prayer')
  return { success: true }
}

export async function deletePrayerRequest(id: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return { error: 'You must be signed in' }
  }

  const request = await prisma.prayerRequest.findUnique({
    where: { id },
  })

  if (!request) {
    return { error: 'Prayer request not found' }
  }

  if (request.userId !== session.user.id && session.user.role !== 'ADMIN') {
    return { error: 'You can only delete your own prayer requests' }
  }

  await prisma.prayerRequest.delete({
    where: { id },
  })

  revalidatePath('/prayer')
  return { success: true }
}
