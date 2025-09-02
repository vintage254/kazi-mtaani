'use client'

import { useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import Link from 'next/link'

interface Worker {
  name: string
  avatar: string
  handle: string
  status: string
  group: string
  supervisor: string
  workerId?: number
}

interface MobileNavigationProps {
  worker: Worker | null
  currentPath?: string
}

export default function MobileNavigation({ worker, currentPath }: MobileNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useGSAP(() => {
    // Mobile menu animations
    if (isMenuOpen) {
      gsap.fromTo('.mobile-menu',
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      )
      
      gsap.fromTo('.mobile-nav-link',
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out' }
      )
    }
  }, [isMenuOpen])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const navigationItems = [
    { name: 'Dashboard', href: '/worker/dashboard', icon: '🏠' },
    { name: 'Attendance', href: '/worker/attendance', icon: '📋' },
    { name: 'Groups', href: '/worker/groups', icon: '👥' },
    { name: 'Profile', href: '/worker/profile', icon: '👤' },
  ]

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">KM</span>
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">Kazi Mtaani</p>
              <p className="text-gray-500 text-xs">Worker Portal</p>
            </div>
          </div>

          {/* Menu Button */}
          <button
            onClick={toggleMenu}
            className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle menu"
          >
            <div className="space-y-1.5">
              <div className={`w-6 h-0.5 bg-gray-600 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
              <div className={`w-6 h-0.5 bg-gray-600 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
              <div className={`w-6 h-0.5 bg-gray-600 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
            </div>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="mobile-menu absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
            <div className="px-4 py-3 border-b border-gray-100">
              {worker && (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-600 font-medium text-sm">
                      {worker.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{worker.name}</p>
                    <p className="text-gray-500 text-xs">{worker.group}</p>
                  </div>
                </div>
              )}
            </div>
            
            <nav className="py-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeMenu}
                  className={`mobile-nav-link flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-colors ${
                    currentPath === item.href
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Bottom Tab Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
        <nav className="flex">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex-1 flex flex-col items-center py-2 px-1 text-xs font-medium transition-colors ${
                currentPath === item.href
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-blue-600'
              }`}
            >
              <span className="text-xl mb-1">{item.icon}</span>
              <span className="text-xs">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-25 z-40"
          onClick={closeMenu}
        />
      )}
    </>
  )
}
