'use client'

import { useState } from 'react'
import WorkerSidebar from '@/components/WorkerSidebar'
import Image from 'next/image'

interface Worker {
  name: string
  avatar: string
  handle: string
  status: string
  group: string
  supervisor: string
}

interface User {
  id: number
  firstName?: string | null
  lastName?: string | null
  email: string
  phone?: string | null
  profileImage?: string
}

interface WorkerData {
  id?: number
  position?: string | null
  dailyRate?: string | null
  joinedAt?: Date | null
  isActive?: boolean | null
  groupName?: string | null
  groupLocation?: string | null
  supervisorName?: string | null
}

interface WorkerProfileClientProps {
  worker: Worker
  user: User
  workerData?: WorkerData | null
}

export default function WorkerProfileClient({ worker, user, workerData }: WorkerProfileClientProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email,
    phone: user.phone || ''
  })

  const handleSave = () => {
    // TODO: Implement profile update functionality
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <WorkerSidebar 
        worker={worker}
        notifications={0}
      />

      {/* Main Content */}
      <div className="ml-64 p-8 min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
              <p className="text-gray-600 mt-1">Manage your personal information and work details.</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>{worker.status}</span>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="text-center">
                <div className="relative inline-block">
                  {user.profileImage ? (
                    <Image 
                      src={user.profileImage} 
                      alt={worker.name}
                      width={96}
                      height={96}
                      className="w-24 h-24 rounded-full mx-auto object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full mx-auto bg-gray-300 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-600">
                        {(user.firstName?.[0] || user.email?.[0] || 'W').toUpperCase()}
                      </span>
                    </div>
                  )}
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mt-4">{worker.name}</h3>
                <p className="text-gray-600">@{worker.handle}</p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {worker.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Worker ID: #{workerData?.id || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Work Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Work Information</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Group</label>
                  <p className="text-gray-900">{workerData?.groupName || 'No Group Assigned'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Supervisor</label>
                  <p className="text-gray-900">{workerData?.supervisorName || 'No Supervisor'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Position</label>
                  <p className="text-gray-900">{workerData?.position || 'Worker'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Daily Rate</label>
                  <p className="text-gray-900">
                    {workerData?.dailyRate ? `KSh ${workerData.dailyRate.toLocaleString()}` : 'Not set'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Joined</label>
                  <p className="text-gray-900">
                    {workerData?.joinedAt 
                      ? new Date(workerData.joinedAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })
                      : 'Not available'
                    }
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    workerData?.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {workerData?.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              </div>
              <div className="p-6">
                {isEditing ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="+254..."
                      />
                    </div>
                    <div className="flex space-x-4">
                      <button
                        onClick={handleSave}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          First Name
                        </label>
                        <p className="text-gray-900">{user.firstName || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Last Name
                        </label>
                        <p className="text-gray-900">{user.lastName || 'Not provided'}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Email Address
                      </label>
                      <p className="text-gray-900">{user.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Phone Number
                      </label>
                      <p className="text-gray-900">{user.phone || 'Not provided'}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Account Settings */}
            <div className="bg-white rounded-lg shadow-sm border mt-6">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Account Settings</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                      <p className="text-sm text-gray-600">Receive updates about your work schedule and payments</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">SMS Notifications</h4>
                      <p className="text-sm text-gray-600">Get text messages for important updates</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
