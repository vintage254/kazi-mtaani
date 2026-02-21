'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import the map to avoid SSR issues with Leaflet
const MapView = dynamic(() => import('./MapView'), { ssr: false })

interface Site {
  id: number
  name: string
  location: string
  latitude: string
  longitude: string
  geofenceRadius: number | null
  status: string | null
}

interface CheckIn {
  id: number
  workerId: number | null
  workerName: string | null
  workerLastName: string | null
  groupName: string | null
  checkInTime: Date | null
  checkInLatitude: string | null
  checkInLongitude: string | null
  gpsVerified: boolean | null
  gpsDistanceMeters: string | null
  attendanceMethod: string | null
  status: string | null
}

export interface MapData {
  sites: Site[]
  checkIns: CheckIn[]
}

export default function WorkSiteMap() {
  const [mapData, setMapData] = useState<MapData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const res = await fetch('/api/dashboard/map', {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' },
        })
        if (res.ok) {
          const data = await res.json()
          setMapData(data)
        } else {
          setError('Failed to load map data')
        }
      } catch {
        setError('Failed to load map data')
      } finally {
        setLoading(false)
      }
    }

    fetchMapData()
    const interval = setInterval(fetchMapData, 60000) // refresh every minute
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-[400px] bg-gray-100 rounded-lg"></div>
        </div>
      </div>
    )
  }

  if (error || !mapData) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Work Site Map</h3>
        <div className="h-[400px] bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">{error || 'No map data available'}</p>
        </div>
      </div>
    )
  }

  const totalCheckIns = mapData.checkIns.length
  const gpsVerifiedCount = mapData.checkIns.filter(c => c.gpsVerified).length
  const outsideGeofence = totalCheckIns - gpsVerifiedCount

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Work Site Map</h3>
            <p className="text-sm text-gray-600 mt-1">Live view of work sites and worker check-ins</p>
          </div>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-gray-600">{mapData.sites.length} Sites</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-gray-600">{gpsVerifiedCount} Verified</span>
            </div>
            {outsideGeofence > 0 && (
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-red-600 font-medium">{outsideGeofence} Outside</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="h-[450px]">
        <MapView data={mapData} />
      </div>
    </div>
  )
}
