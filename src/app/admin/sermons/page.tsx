import { prisma } from '@/lib/prisma'
import { SermonsManager } from './sermons-manager'

export const dynamic = 'force-dynamic'

async function getSermons() {
  const sermons = await prisma.sermon.findMany({
    orderBy: { date: 'desc' },
  })
  return sermons
}

export default async function AdminSermonsPage() {
  const sermons = await getSermons()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Sermons</h1>
        <p className="text-gray-600 mt-1">Manage your sermon library</p>
      </div>

      <SermonsManager sermons={sermons} />
    </div>
  )
}
