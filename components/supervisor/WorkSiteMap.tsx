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
  const [currentSiteIndex, setCurrentSiteIndex] = useState(0)

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

  const sites = mapData.sites
  const hasSites = sites.length > 0
  const hasMultipleSites = sites.length > 1
  const currentSite = hasSites ? sites[currentSiteIndex] : null

  // Filter check-ins for the current site
  const siteCheckIns = currentSite
    ? mapData.checkIns.filter(c => c.groupName === currentSite.name)
    : mapData.checkIns

  const gpsVerifiedCount = siteCheckIns.filter(c => c.gpsVerified).length
  const outsideGeofence = siteCheckIns.length - gpsVerifiedCount

  // Build single-site data for MapView
  const currentMapData: MapData = {
    sites: currentSite ? [currentSite] : [],
    checkIns: siteCheckIns,
  }

  const goToPrev = () => {
    setCurrentSiteIndex(i => (i === 0 ? sites.length - 1 : i - 1))
  }

  const goToNext = () => {
    setCurrentSiteIndex(i => (i === sites.length - 1 ? 0 : i + 1))
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Work Site Map</h3>
            <p className="text-sm text-gray-600 mt-1">
              {currentSite ? currentSite.name : 'Live view of work sites and worker check-ins'}
              {currentSite && (
                <span className="text-gray-400 ml-1">- {currentSite.location}</span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Stats */}
            <div className="flex gap-3 text-sm">
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

            {/* Navigation */}
            {hasMultipleSites && (
              <div className="flex items-center gap-2">
                <button
                  onClick={goToPrev}
                  className="p-1.5 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
                  aria-label="Previous site"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="text-sm text-gray-600 min-w-[60px] text-center">
                  {currentSiteIndex + 1} of {sites.length}
                </span>
                <button
                  onClick={goToNext}
                  className="p-1.5 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
                  aria-label="Next site"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="h-[450px]">
        <MapView key={currentSite?.id ?? 'no-site'} data={currentMapData} />
      </div>
    </div>
  )
}
