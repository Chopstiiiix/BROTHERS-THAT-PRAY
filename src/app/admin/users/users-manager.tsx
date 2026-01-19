'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { updateUserRole, toggleUserStatus, createInviteCode } from '@/actions/users'

type User = {
  id: string
  name: string | null
  email: string
  role: string
  isActive: boolean
  createdAt: Date
}

type InviteCode = {
  id: string
  code: string
  email: string | null
  usedAt: Date | null
  createdAt: Date
}

export function UsersManager({
  users,
  inviteCodes,
}: {
  users: User[]
  inviteCodes: InviteCode[]
}) {
  const [inviteEmail, setInviteEmail] = useState('')
  const [isCreatingInvite, setIsCreatingInvite] = useState(false)
  const [newCode, setNewCode] = useState<string | null>(null)

  const handleRoleChange = async (userId: string, newRole: 'USER' | 'ADMIN') => {
    await updateUserRole(userId, newRole)
  }

  const handleToggleStatus = async (userId: string) => {
    await toggleUserStatus(userId)
  }

  const handleCreateInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreatingInvite(true)

    const result = await createInviteCode(inviteEmail || undefined)

    if (result.code) {
      setNewCode(result.code)
      setInviteEmail('')
    }

    setIsCreatingInvite(false)
  }

  return (
    <div className="space-y-8">
      {/* Invite Codes Section */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Invite Codes</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateInvite} className="flex gap-4 mb-6">
            <Input
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="Optional: email@example.com"
              type="email"
              className="flex-1"
            />
            <Button type="submit" isLoading={isCreatingInvite}>
              Generate Code
            </Button>
          </form>

          {newCode && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
              <p className="text-sm text-green-700 mb-2">New invite code created:</p>
              <code className="text-lg font-mono font-bold text-green-900">{newCode}</code>
            </div>
          )}

          <div className="space-y-2">
            {inviteCodes.map((code) => (
              <div
                key={code.id}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  code.usedAt ? 'bg-gray-50' : 'bg-primary-50'
                }`}
              >
                <div>
                  <code className="font-mono font-medium">{code.code}</code>
                  {code.email && (
                    <span className="text-sm text-gray-500 ml-2">({code.email})</span>
                  )}
                </div>
                <span className={`text-sm ${code.usedAt ? 'text-gray-500' : 'text-primary-600'}`}>
                  {code.usedAt ? 'Used' : 'Available'}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">All Users ({users.length})</h2>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium text-gray-500">User</th>
                  <th className="pb-3 font-medium text-gray-500">Role</th>
                  <th className="pb-3 font-medium text-gray-500">Status</th>
                  <th className="pb-3 font-medium text-gray-500">Joined</th>
                  <th className="pb-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-700 font-medium">
                            {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name || 'No name'}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value as 'USER' | 'ADMIN')}
                        className="text-sm border rounded px-2 py-1"
                      >
                        <option value="USER">User</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </td>
                    <td className="py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          user.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {user.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4">
                      <Button
                        size="sm"
                        variant={user.isActive ? 'danger' : 'primary'}
                        onClick={() => handleToggleStatus(user.id)}
                      >
                        {user.isActive ? 'Disable' : 'Enable'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
