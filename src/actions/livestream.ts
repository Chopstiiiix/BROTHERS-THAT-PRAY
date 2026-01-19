'use server'

import { prisma } from '@/lib/prisma'
import { livestreamSchema } from '@/lib/validations'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function updateLivestream(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return { error: 'Unauthorized' }
  }

  const data = {
    embedUrl: formData.get('embedUrl') as string,
    title: formData.get('title') as string || undefined,
    description: formData.get('description') as string || undefined,
    schedule: formData.get('schedule') as string || undefined,
    isActive: formData.get('isActive') === 'true',
  }

  const validation = livestreamSchema.safeParse(data)

  if (!validation.success) {
    return { error: validation.error.errors[0].message }
  }

  // Get or create default livestream
  const existing = await prisma.liveStream.findFirst()

  if (existing) {
    await prisma.liveStream.update({
      where: { id: existing.id },
      data: validation.data,
    })
  } else {
    await prisma.liveStream.create({
      data: validation.data,
    })
  }

  revalidatePath('/live')
  revalidatePath('/admin/live')
  return { success: true }
}
