'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { createDonationIntent } from '@/actions/donations'

const presetAmounts = [25, 50, 100, 250, 500]

export default function DonatePage() {
  const [amount, setAmount] = useState<number | ''>('')
  const [customAmount, setCustomAmount] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const selectedAmount = amount || (customAmount ? parseFloat(customAmount) : 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const formData = new FormData()
    formData.append('amount', selectedAmount.toString())
    if (name) formData.append('name', name)
    if (email) formData.append('email', email)
    if (message) formData.append('message', message)

    const result = await createDonationIntent(formData)

    if (result.error) {
      setError(result.error)
    } else {
      setSuccess(true)
    }

    setIsLoading(false)
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
            <p className="text-gray-600 mb-6">
              Your donation intent has been recorded. Payment processing will be available soon.
            </p>
            <p className="text-sm text-gray-500">
              (Stripe integration coming soon)
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Support Our Ministry
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Your generous donations help us expand our mission of building a strong
          community of men united in faith.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Make a Donation</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Preset Amounts */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Amount
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {presetAmounts.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setAmount(preset)
                        setCustomAmount('')
                      }}
                      className={`py-3 px-4 rounded-lg border-2 font-medium transition-colors ${
                        amount === preset
                          ? 'border-primary-600 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      ${preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Or enter a custom amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value)
                      setAmount('')
                    }}
                    placeholder="Enter amount"
                    className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              {/* Donor Info */}
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
                <Input
                  type="email"
                  label="Email (optional)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                />
              </div>

              {/* Message */}
              <Textarea
                label="Message (optional)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a note with your donation..."
                rows={3}
              />

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}

              <div className="pt-4">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-primary-700 text-white hover:bg-primary-800"
                  isLoading={isLoading}
                  disabled={!selectedAmount || selectedAmount < 1}
                >
                  Donate ${selectedAmount || 0}
                </Button>
                <p className="text-center text-sm text-gray-500 mt-3">
                  Stripe payment integration coming soon
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Impact Section */}
        <div className="mt-12 grid sm:grid-cols-3 gap-6 text-center">
          <div>
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Resources</h3>
            <p className="text-sm text-gray-600">Support sermon recordings and educational materials</p>
          </div>
          <div>
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Events</h3>
            <p className="text-sm text-gray-600">Help fund retreats and community gatherings</p>
          </div>
          <div>
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Outreach</h3>
            <p className="text-sm text-gray-600">Expand our ministry and help more brothers</p>
          </div>
        </div>
      </div>
    </div>
  )
}
