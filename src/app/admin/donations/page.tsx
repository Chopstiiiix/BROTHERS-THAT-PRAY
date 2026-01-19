import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

async function getDonations() {
  const donations = await prisma.donationIntent.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
  })
  return donations
}

async function getDonationStats() {
  const stats = await prisma.donationIntent.aggregate({
    _sum: { amount: true },
    _count: true,
    _avg: { amount: true },
  })

  const statusCounts = await prisma.donationIntent.groupBy({
    by: ['status'],
    _count: true,
    _sum: { amount: true },
  })

  return { stats, statusCounts }
}

export default async function AdminDonationsPage() {
  const donations = await getDonations()
  const { stats, statusCounts } = await getDonationStats()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'failed':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Donations</h1>
        <p className="text-gray-600 mt-1">View and manage donation intents</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-3xl font-bold text-gray-900">
              ${(stats._sum.amount || 0).toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">Total Amount</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-3xl font-bold text-gray-900">{stats._count}</p>
            <p className="text-sm text-gray-500">Total Donations</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-3xl font-bold text-gray-900">
              ${(stats._avg.amount || 0).toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">Average Amount</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-1">
              {statusCounts.map((sc) => (
                <div key={sc.status} className="flex justify-between text-sm">
                  <span className="capitalize">{sc.status}</span>
                  <span className="font-medium">{sc._count}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">By Status</p>
          </CardContent>
        </Card>
      </div>

      {/* Donations Table */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">All Donations</h2>
        </CardHeader>
        <CardContent>
          {donations.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No donations yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-medium text-gray-500">Date</th>
                    <th className="pb-3 font-medium text-gray-500">Donor</th>
                    <th className="pb-3 font-medium text-gray-500">Amount</th>
                    <th className="pb-3 font-medium text-gray-500">Status</th>
                    <th className="pb-3 font-medium text-gray-500">Message</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {donations.map((donation) => (
                    <tr key={donation.id}>
                      <td className="py-4 text-sm text-gray-500">
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {donation.name || donation.user?.name || 'Anonymous'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {donation.email || donation.user?.email || '-'}
                          </p>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="font-semibold text-gray-900">
                          ${donation.amount.toFixed(2)} {donation.currency}
                        </span>
                      </td>
                      <td className="py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(
                            donation.status
                          )}`}
                        >
                          {donation.status}
                        </span>
                      </td>
                      <td className="py-4 text-sm text-gray-500 max-w-xs truncate">
                        {donation.message || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-medium text-yellow-800 mb-2">Stripe Integration TODO</h3>
        <p className="text-sm text-yellow-700">
          Payment processing is not yet integrated. To complete the integration:
        </p>
        <ul className="text-sm text-yellow-700 list-disc ml-5 mt-2 space-y-1">
          <li>Add Stripe API keys to environment variables</li>
          <li>Create a Stripe webhook endpoint</li>
          <li>Update the donation flow to create PaymentIntents</li>
          <li>Handle webhook events to update donation status</li>
        </ul>
      </div>
    </div>
  )
}
