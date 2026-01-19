'use server'

import { prisma } from '@/lib/prisma'
import { signUpSchema } from '@/lib/validations'
import bcrypt from 'bcryptjs'

export async function signUp(formData: FormData) {
  try {
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const inviteCode = formData.get('inviteCode') as string | null

    const validation = signUpSchema.safeParse({ name, email, password, inviteCode })

    if (!validation.success) {
      return { error: validation.error.errors[0].message }
    }

    // Check if invite-only mode is enabled
    const isInviteOnly = process.env.INVITE_ONLY === 'true'

    if (isInviteOnly) {
      if (!inviteCode) {
        return { error: 'An invite code is required to sign up' }
      }

      const invite = await prisma.inviteCode.findUnique({
        where: { code: inviteCode },
      })

      if (!invite) {
        return { error: 'Invalid invite code' }
      }

      if (invite.usedAt) {
        return { error: 'This invite code has already been used' }
      }

      if (invite.expiresAt && invite.expiresAt < new Date()) {
        return { error: 'This invite code has expired' }
      }

      if (invite.email && invite.email !== email) {
        return { error: 'This invite code is for a different email address' }
      }
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { error: 'A user with this email already exists' }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    // Mark invite code as used if applicable
    if (isInviteOnly && inviteCode) {
      await prisma.inviteCode.update({
        where: { code: inviteCode },
        data: {
          usedAt: new Date(),
          usedBy: user.id,
        },
      })
    }

    return { success: true }
  } catch (error) {
    console.error('Signup error:', error)
    return { error: 'Unable to create account. Please check if the database is configured correctly.' }
  }
}
