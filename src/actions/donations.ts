'use server'

import { prisma } from '@/lib/prisma'
import { donationSchema } from '@/lib/validations'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function createDonationIntent(formData: FormData) {
  const session = await getServerSession(authOptions)

  const data = {
    amount: parseFloat(formData.get('amount') as string),
    email: formData.get('email') as string || undefined,
    name: formData.get('name') as string || undefined,
    message: formData.get('message') as string || undefined,
  }

  const validation = donationSchema.safeParse(data)

  if (!validation.success) {
    return { error: validation.error.errors[0].message }
  }

  const donation = await prisma.donationIntent.create({
    data: {
      ...validation.data,
      userId: session?.user?.id || null,
      status: 'pending',
    },
  })

  // TODO: Integrate with Stripe here
  // const paymentIntent = await stripe.paymentIntents.create({
  //   amount: validation.data.amount * 100,
  //   currency: 'usd',
  //   metadata: { donationIntentId: donation.id },
  // })

  revalidatePath('/admin/donations')

  return {
    success: true,
    donationId: donation.id,
    // clientSecret: paymentIntent.client_secret, // TODO: Return when Stripe is integrated
  }
}

export async function updateDonationStatus(id: string, status: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return { error: 'Unauthorized' }
  }

  await prisma.donationIntent.update({
    where: { id },
    data: { status },
  })

  revalidatePath('/admin/donations')
  return { success: true }
}
