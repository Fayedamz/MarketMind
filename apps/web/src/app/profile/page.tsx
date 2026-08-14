'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { userAPI } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'

export default function ProfilePage() {
  const { isAuthenticated, user, logout } = useAuth()
  const router = useRouter()
  const [name, setName] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  const { data: achievements } = useQuery({
    queryKey: ['achievements'],
    queryFn: async () => {
      const response = await userAPI.getAchievements()
      return response.data.achievements
    },
    enabled: isAuthenticated,
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
    if (user) {
      setName(user.name)
    }
  }, [isAuthenticated, user, router])

  const handleUpdate = async () => {
    try {
      await userAPI.updateProfile(name)
      setIsEditing(false)
      alert('Profile updated successfully!')
    } catch (error) {
      alert('Failed to update profile')
    }
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Profile</h1>

          {/* Profile Info */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Information</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                {isEditing ? (
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                  />
                ) : (
                  <p className="text-lg text-gray-900">{user.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <p className="text-lg text-gray-900">{user.email}</p>
              </div>

              <div className="flex gap-4">
                {isEditing ? (
                  <>
                    <Button onClick={handleUpdate}>Save Changes</Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                )}
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Achievements</h2>

            {achievements && achievements.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {achievements.map((achievement: any) => (
                  <div
                    key={achievement.id}
                    className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">🏆</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(achievement.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">
                No achievements yet. Complete lessons and trade to earn achievements!
              </p>
            )}
          </div>

          {/* Account Actions */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Actions</h2>

            <div className="space-y-4">
              <Button variant="outline" className="w-full" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
