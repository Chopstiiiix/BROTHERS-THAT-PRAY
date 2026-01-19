import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('Admin123!', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@btp.app' },
    update: {},
    create: {
      email: 'admin@btp.app',
      name: 'Admin',
      password: hashedPassword,
      role: 'ADMIN',
      isActive: true,
    },
  })
  console.log('✅ Admin user created:', admin.email)

  // Create a test user
  const testUserPassword = await bcrypt.hash('Test123!', 12)
  const testUser = await prisma.user.upsert({
    where: { email: 'user@btp.app' },
    update: {},
    create: {
      email: 'user@btp.app',
      name: 'Test User',
      password: testUserPassword,
      role: 'USER',
      isActive: true,
    },
  })
  console.log('✅ Test user created:', testUser.email)

  // Create livestream
  const livestream = await prisma.liveStream.upsert({
    where: { id: 'default-livestream' },
    update: {},
    create: {
      id: 'default-livestream',
      embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      title: 'Sunday Service',
      description: 'Join us for our weekly Sunday service',
      schedule: 'Every Sunday at 10:00 AM EST',
      isActive: true,
    },
  })
  console.log('✅ Livestream created:', livestream.title)

  // Create sermons
  const sermons = [
    {
      title: 'Walking in Faith',
      description: 'A powerful message about trusting God in uncertain times. Learn how to strengthen your faith and walk boldly in His promises.',
      speaker: 'Pastor John',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      date: new Date('2024-01-07'),
      duration: '45:30',
      tags: ['faith', 'trust', 'encouragement'],
      isPublished: true,
    },
    {
      title: 'The Power of Prayer',
      description: 'Discover the transformative power of prayer in your daily life. This sermon explores different types of prayer and how to develop a consistent prayer life.',
      speaker: 'Pastor John',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      date: new Date('2024-01-14'),
      duration: '52:15',
      tags: ['prayer', 'spiritual growth', 'discipline'],
      isPublished: true,
    },
    {
      title: 'Brotherhood in Christ',
      description: 'Understanding the importance of brotherhood and community in our faith journey. Learn how to build meaningful relationships with fellow believers.',
      speaker: 'Pastor Michael',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      date: new Date('2024-01-21'),
      duration: '38:45',
      tags: ['community', 'brotherhood', 'fellowship'],
      isPublished: true,
    },
  ]

  for (const sermon of sermons) {
    await prisma.sermon.create({ data: sermon })
  }
  console.log('✅ Sermons created:', sermons.length)

  // Create events
  const events = [
    {
      title: 'Men\'s Prayer Breakfast',
      description: 'Join us for a morning of prayer, fellowship, and a hearty breakfast. All men are welcome!',
      location: 'BTP Community Center, Room 101',
      startDate: new Date('2024-02-10T08:00:00'),
      endDate: new Date('2024-02-10T10:00:00'),
      isPublished: true,
    },
    {
      title: 'Annual Brotherhood Retreat',
      description: 'A weekend retreat focused on deepening our faith and strengthening our bonds as brothers in Christ. Includes worship, teaching sessions, and outdoor activities.',
      location: 'Mountain View Retreat Center',
      startDate: new Date('2024-03-15T17:00:00'),
      endDate: new Date('2024-03-17T14:00:00'),
      isPublished: true,
    },
  ]

  for (const event of events) {
    await prisma.event.create({ data: event })
  }
  console.log('✅ Events created:', events.length)

  // Create prayer requests
  const prayerRequests = [
    {
      title: 'Prayer for my family',
      content: 'Please pray for unity and peace in my family. We have been going through some challenging times and need God\'s guidance.',
      isAnonymous: false,
      isPublic: true,
      userId: testUser.id,
    },
    {
      title: 'Job opportunity',
      content: 'I have a job interview next week. Please pray that God\'s will be done and that I find favor with the hiring team.',
      isAnonymous: false,
      isPublic: true,
      userId: testUser.id,
    },
    {
      title: 'Health concerns',
      content: 'Asking for prayers for healing and strength as I go through some health challenges. Trusting in God\'s healing power.',
      isAnonymous: true,
      isPublic: true,
      userId: admin.id,
    },
  ]

  for (const request of prayerRequests) {
    await prisma.prayerRequest.create({ data: request })
  }
  console.log('✅ Prayer requests created:', prayerRequests.length)

  // Create some invite codes for testing
  const inviteCodes = [
    { code: 'BTPWELCOME2024', email: null },
    { code: 'BROTHERSUNITE', email: null },
  ]

  for (const invite of inviteCodes) {
    await prisma.inviteCode.create({ data: invite })
  }
  console.log('✅ Invite codes created:', inviteCodes.length)

  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
