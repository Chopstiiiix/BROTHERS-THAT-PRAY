'use server'

import { prisma } from '@/lib/prisma'
import { profileSchema } from '@/lib/validations'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return { error: 'You must be signed in' }
  }

  const data = {
    name: formData.get('name') as string,
  }

  const validation = profileSchema.safeParse(data)

  if (!validation.success) {
    return { error: validation.error.errors[0].message }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name: validation.data.name },
  })

  revalidatePath('/profile')
  return { success: true }
}
