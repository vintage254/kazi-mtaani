'use client'

import WorkerSidebar from '@/components/WorkerSidebar'

interface Worker {
  name: string
  avatar: string
  handle: string
  status: string
  group: string
  supervisor: string
}

interface GroupDetails {
  group: {
    groupId: number | null
    groupName: string | null
    groupLocation: string | null
    groupDescription: string | null
    groupStatus: string | null
    supervisorName: string | null
    supervisorId: number | null
    createdAt: Date | null
  }
  teamMembers: Array<{
    id: number
    userId: number | null
    position: string | null
    isActive: boolean | null
    firstName: string | null
    lastName: string | null
    phone: string | null
    joinedAt: Date | null
  }>
  stats: {
    totalMembers: number
    presentToday: number
    attendanceRate: number
  }
}

interface WorkerGroupsClientProps {
  worker: Worker
  groupDetails: GroupDetails | null
  currentUserId: number
}

export default function WorkerGroupsClient({ worker, groupDetails, currentUserId }: WorkerGroupsClientProps) {
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
              <h1 className="text-3xl font-bold text-gray-900">My Group</h1>
              <p className="text-gray-600 mt-1">View your team information and group performance.</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{worker.status}</span>
            </div>
          </div>
        </div>

        {/* Group Header */}
        {groupDetails ? (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{groupDetails.group.groupName || 'No Group'}</h2>
                  <p className="text-gray-600">{groupDetails.group.groupDescription || 'Community development and maintenance activities'}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      groupDetails.group.groupStatus === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {groupDetails.group.groupStatus || 'Active'}
                    </span>
                    <span className="text-sm text-gray-500">{groupDetails.stats.totalMembers} members</span>
                    <span className="text-sm text-gray-500">Supervisor: {groupDetails.group.supervisorName || 'No Supervisor'}</span>
                    <p className="text-sm text-gray-600">You&apos;re not assigned to any group yet. Contact your supervisor for group assignment.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <div className="text-center text-gray-500">
              <p>You are not assigned to any group yet.</p>
              <p className="text-sm mt-1">Contact your supervisor to be assigned to a work group.</p>
            </div>
          </div>
        )}

        {/* Group Stats */}
        {groupDetails && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Team Members</p>
                  <p className="text-2xl font-bold text-gray-900">{groupDetails.stats.totalMembers}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Present Today</p>
                  <p className="text-2xl font-bold text-green-600">{groupDetails.stats.presentToday}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{groupDetails.stats.attendanceRate}%</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Location</p>
                  <p className="text-sm font-bold text-purple-600">{groupDetails.group.groupLocation || 'Not Set'}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Group Details and Team */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Group Information */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Group Details</h3>
            </div>
            <div className="p-6 space-y-4">
              {groupDetails ? (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Group Name</label>
                    <p className="text-gray-900">{groupDetails.group.groupName || 'Not Set'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Location</label>
                    <p className="text-gray-900">{groupDetails.group.groupLocation || 'Not Set'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Supervisor</label>
                    <p className="text-gray-900">{groupDetails.group.supervisorName || 'Not Assigned'}</p>
                    <p className="text-xs text-gray-500">Contact for work coordination</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Created</label>
                    <p className="text-gray-900">
                      {groupDetails.group.createdAt 
                        ? new Date(groupDetails.group.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })
                        : 'Not Available'
                      }
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      groupDetails.group.groupStatus === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {groupDetails.group.groupStatus || 'Active'}
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <p>No group information available</p>
                </div>
              )}
            </div>
          </div>

          {/* Team Members */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {groupDetails && groupDetails.teamMembers.length > 0 ? (
                  <>
                    {groupDetails.teamMembers.map((member) => {
                      const isCurrentUser = member.userId === currentUserId
                      const memberName = `${member.firstName || ''} ${member.lastName || ''}`.trim() || 'Unknown'
                      const initials = memberName.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'
                      
                      return (
                        <div 
                          key={member.id} 
                          className={`flex items-center justify-between p-3 border rounded-lg ${
                            isCurrentUser ? 'bg-blue-50 border-blue-200' : ''
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            {isCurrentUser ? (
                              <img 
                                src={worker.avatar} 
                                alt={memberName}
                                className="w-10 h-10 rounded-full"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-medium">{initials}</span>
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {memberName} {isCurrentUser && '(You)'}
                              </p>
                              <p className="text-xs text-gray-500">
                                {member.position || 'Worker'} • 
                                Joined {member.joinedAt 
                                  ? new Date(member.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                                  : 'Unknown'
                                }
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              member.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {member.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                    
                    {groupDetails.teamMembers.length > 5 && (
                      <div className="text-center py-4">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          View All Members ({groupDetails.teamMembers.length})
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <p>No team members found</p>
                    <p className="text-xs mt-1">Contact your supervisor to join a group</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Performance */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">This Week&apos;s Performance</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">Group Attendance</h4>
                <div className="space-y-3">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, index) => {
                    const attendance = [93, 100, 87, 80, 0][index]
                    const present = [14, 15, 13, 12, 0][index]
                    const total = 15
                    
                    return (
                      <div key={day} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{day}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${attendance > 0 ? 'bg-green-500' : 'bg-gray-300'}`}
                              style={{width: `${attendance}%`}}
                            ></div>
                          </div>
                          <span className={`text-sm ${attendance > 0 ? 'text-gray-900' : 'text-gray-500'}`}>
                            {attendance > 0 ? `${present}/${total}` : 'Today'}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">Top Performers</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-yellow-500">🥇</span>
                      <span className="text-sm text-gray-900">Mary Smith</span>
                    </div>
                    <span className="text-sm font-medium text-green-600">98%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400">🥈</span>
                      <span className="text-sm text-gray-900">{worker.name}</span>
                    </div>
                    <span className="text-sm font-medium text-green-600">95%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-orange-500">🥉</span>
                      <span className="text-sm text-gray-900">Peter Johnson</span>
                    </div>
                    <span className="text-sm font-medium text-green-600">92%</span>
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
