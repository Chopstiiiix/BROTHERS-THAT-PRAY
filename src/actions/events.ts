'use server'

import { prisma } from '@/lib/prisma'
import { eventSchema } from '@/lib/validations'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function createEvent(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return { error: 'Unauthorized' }
  }

  const data = {
    title: formData.get('title') as string,
    description: formData.get('description') as string || undefined,
    location: formData.get('location') as string || undefined,
    startDate: formData.get('startDate') as string,
    endDate: formData.get('endDate') as string || undefined,
    imageUrl: formData.get('imageUrl') as string || undefined,
    isPublished: formData.get('isPublished') !== 'false',
  }

  const validation = eventSchema.safeParse(data)

  if (!validation.success) {
    return { error: validation.error.errors[0].message }
  }

  await prisma.event.create({
    data: {
      ...validation.data,
      startDate: new Date(validation.data.startDate as string),
      endDate: validation.data.endDate ? new Date(validation.data.endDate as string) : null,
      imageUrl: validation.data.imageUrl || null,
    },
  })

  revalidatePath('/events')
  revalidatePath('/admin/events')
  return { success: true }
}

export async function updateEvent(id: string, formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return { error: 'Unauthorized' }
  }

  const data = {
    title: formData.get('title') as string,
    description: formData.get('description') as string || undefined,
    location: formData.get('location') as string || undefined,
    startDate: formData.get('startDate') as string,
    endDate: formData.get('endDate') as string || undefined,
    imageUrl: formData.get('imageUrl') as string || undefined,
    isPublished: formData.get('isPublished') === 'true',
  }

  const validation = eventSchema.safeParse(data)

  if (!validation.success) {
    return { error: validation.error.errors[0].message }
  }

  await prisma.event.update({
    where: { id },
    data: {
      ...validation.data,
      startDate: new Date(validation.data.startDate as string),
      endDate: validation.data.endDate ? new Date(validation.data.endDate as string) : null,
      imageUrl: validation.data.imageUrl || null,
    },
  })

  revalidatePath('/events')
  revalidatePath('/admin/events')
  return { success: true }
}

export async function deleteEvent(id: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return { error: 'Unauthorized' }
  }

  await prisma.event.delete({
    where: { id },
  })

  revalidatePath('/events')
  revalidatePath('/admin/events')
  return { success: true }
}
