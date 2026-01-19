import { z } from 'zod'

export const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  inviteCode: z.string().optional(),
})

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const prayerRequestSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  content: z.string().min(10, 'Content must be at least 10 characters').max(2000),
  isAnonymous: z.boolean().default(false),
  isPublic: z.boolean().default(true),
})

export const commentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(500),
  prayerRequestId: z.string(),
})

export const sermonSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  speaker: z.string().optional(),
  videoUrl: z.string().url().optional().or(z.literal('')),
  audioUrl: z.string().url().optional().or(z.literal('')),
  thumbnailUrl: z.string().url().optional().or(z.literal('')),
  date: z.string().or(z.date()),
  duration: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isPublished: z.boolean().default(true),
})

export const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()).optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  isPublished: z.boolean().default(true),
})

export const livestreamSchema = z.object({
  embedUrl: z.string().url('Invalid embed URL'),
  title: z.string().optional(),
  description: z.string().optional(),
  schedule: z.string().optional(),
  isActive: z.boolean().default(true),
})

export const donationSchema = z.object({
  amount: z.number().min(1, 'Minimum donation is $1'),
  email: z.string().email().optional(),
  name: z.string().optional(),
  message: z.string().max(500).optional(),
})

export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
})

export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>
export type PrayerRequestInput = z.infer<typeof prayerRequestSchema>
export type CommentInput = z.infer<typeof commentSchema>
export type SermonInput = z.infer<typeof sermonSchema>
export type EventInput = z.infer<typeof eventSchema>
export type LivestreamInput = z.infer<typeof livestreamSchema>
export type DonationInput = z.infer<typeof donationSchema>
export type ProfileInput = z.infer<typeof profileSchema>
