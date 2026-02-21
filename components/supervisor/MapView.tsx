'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { MapData } from './WorkSiteMap'

// Fix Leaflet default icon paths for Next.js bundling
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

function createIcon(color: string) {
  return L.divIcon({
    className: '',
    html: `<div style="
      width: 14px; height: 14px; border-radius: 50%;
      background: ${color}; border: 2px solid white;
      box-shadow: 0 1px 4px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -10],
  })
}

function createSiteIcon() {
  return L.divIcon({
    className: '',
    html: `<div style="
      width: 24px; height: 24px; border-radius: 4px;
      background: #3B82F6; border: 2px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      display: flex; align-items: center; justify-content: center;
      color: white; font-size: 12px; font-weight: bold;
    ">S</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -14],
  })
}

interface MapViewProps {
  data: MapData
}

export default function MapView({ data }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Default center: Nairobi, Kenya
    const defaultCenter: [number, number] = [-1.2921, 36.8219]

    // Find center from data
    let center = defaultCenter
    if (data.sites.length > 0) {
      const firstSite = data.sites[0]
      center = [parseFloat(firstSite.latitude), parseFloat(firstSite.longitude)]
    }

    const map = L.map(mapRef.current).setView(center, 13)
    mapInstanceRef.current = map

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    // Add work sites with geofence circles
    const bounds = L.latLngBounds([])

    data.sites.forEach((site) => {
      const lat = parseFloat(site.latitude)
      const lng = parseFloat(site.longitude)
      if (isNaN(lat) || isNaN(lng)) return

      bounds.extend([lat, lng])

      // Geofence circle
      const radius = site.geofenceRadius || 100
      L.circle([lat, lng], {
        radius,
        color: '#3B82F6',
        fillColor: '#3B82F6',
        fillOpacity: 0.1,
        weight: 2,
        dashArray: '5, 5',
      }).addTo(map)

      // Site marker
      L.marker([lat, lng], { icon: createSiteIcon() })
        .bindPopup(`
          <div style="min-width: 150px">
            <strong>${site.name}</strong><br/>
            <span style="color: #666">${site.location}</span><br/>
            <span style="color: #3B82F6; font-size: 12px">Geofence: ${radius}m radius</span>
          </div>
        `)
        .addTo(map)
    })

    // Add check-in markers
    data.checkIns.forEach((checkIn) => {
      if (!checkIn.checkInLatitude || !checkIn.checkInLongitude) return
      const lat = parseFloat(checkIn.checkInLatitude)
      const lng = parseFloat(checkIn.checkInLongitude)
      if (isNaN(lat) || isNaN(lng)) return

      bounds.extend([lat, lng])

      const isVerified = checkIn.gpsVerified
      const icon = createIcon(isVerified ? '#22C55E' : '#EF4444')
      const name = [checkIn.workerName, checkIn.workerLastName].filter(Boolean).join(' ') || 'Worker'
      const time = checkIn.checkInTime
        ? new Date(checkIn.checkInTime).toLocaleTimeString('en-US', {
            hour: 'numeric', minute: '2-digit', hour12: true
          })
        : ''
      const distance = checkIn.gpsDistanceMeters
        ? `${Math.round(parseFloat(checkIn.gpsDistanceMeters))}m`
        : 'N/A'

      L.marker([lat, lng], { icon })
        .bindPopup(`
          <div style="min-width: 160px">
            <strong>${name}</strong><br/>
            <span style="color: #666">${checkIn.groupName || 'Unknown group'}</span><br/>
            <span style="font-size: 12px; color: ${isVerified ? '#22C55E' : '#EF4444'}">
              ${isVerified ? 'GPS Verified' : 'Outside Geofence'}
            </span><br/>
            <span style="font-size: 12px; color: #666">
              Distance: ${distance} | ${time}
            </span><br/>
            <span style="font-size: 11px; color: #999">
              Method: ${checkIn.attendanceMethod || 'Unknown'}
            </span>
          </div>
        `)
        .addTo(map)
    })

    // Fit map to show all markers
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [30, 30] })
    }

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [data])

  return <div ref={mapRef} className="w-full h-full rounded-b-lg" />
}
