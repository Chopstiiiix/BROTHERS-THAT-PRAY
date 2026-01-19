'use server'

import { prisma } from '@/lib/prisma'
import { sermonSchema } from '@/lib/validations'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function createSermon(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return { error: 'Unauthorized' }
  }

  const data = {
    title: formData.get('title') as string,
    description: formData.get('description') as string || undefined,
    speaker: formData.get('speaker') as string || undefined,
    videoUrl: formData.get('videoUrl') as string || undefined,
    audioUrl: formData.get('audioUrl') as string || undefined,
    thumbnailUrl: formData.get('thumbnailUrl') as string || undefined,
    date: formData.get('date') as string,
    duration: formData.get('duration') as string || undefined,
    tags: (formData.get('tags') as string)?.split(',').map(t => t.trim()).filter(Boolean) || [],
    isPublished: formData.get('isPublished') !== 'false',
  }

  const validation = sermonSchema.safeParse(data)

  if (!validation.success) {
    return { error: validation.error.errors[0].message }
  }

  await prisma.sermon.create({
    data: {
      ...validation.data,
      date: new Date(validation.data.date as string),
      videoUrl: validation.data.videoUrl || null,
      audioUrl: validation.data.audioUrl || null,
      thumbnailUrl: validation.data.thumbnailUrl || null,
    },
  })

  revalidatePath('/sermons')
  revalidatePath('/admin/sermons')
  return { success: true }
}

export async function updateSermon(id: string, formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return { error: 'Unauthorized' }
  }

  const data = {
    title: formData.get('title') as string,
    description: formData.get('description') as string || undefined,
    speaker: formData.get('speaker') as string || undefined,
    videoUrl: formData.get('videoUrl') as string || undefined,
    audioUrl: formData.get('audioUrl') as string || undefined,
    thumbnailUrl: formData.get('thumbnailUrl') as string || undefined,
    date: formData.get('date') as string,
    duration: formData.get('duration') as string || undefined,
    tags: (formData.get('tags') as string)?.split(',').map(t => t.trim()).filter(Boolean) || [],
    isPublished: formData.get('isPublished') === 'true',
  }

  const validation = sermonSchema.safeParse(data)

  if (!validation.success) {
    return { error: validation.error.errors[0].message }
  }

  await prisma.sermon.update({
    where: { id },
    data: {
      ...validation.data,
      date: new Date(validation.data.date as string),
      videoUrl: validation.data.videoUrl || null,
      audioUrl: validation.data.audioUrl || null,
      thumbnailUrl: validation.data.thumbnailUrl || null,
    },
  })

  revalidatePath('/sermons')
  revalidatePath('/admin/sermons')
  return { success: true }
}

export async function deleteSermon(id: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return { error: 'Unauthorized' }
  }

  await prisma.sermon.delete({
    where: { id },
  })

  revalidatePath('/sermons')
  revalidatePath('/admin/sermons')
  return { success: true }
}
