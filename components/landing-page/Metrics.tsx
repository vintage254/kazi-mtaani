"use client"
import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { SignUpButton } from '@clerk/nextjs'
import Prism from '@/components/ui/PrismBackground'
import { ShimmerButton } from '@/components/ui/ShimmerButton'

const Metrics = () => {
  return (
    <motion.section 
      id="metrics" 
      className="py-20 bg-black relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      viewport={{ once: true, margin: "-100px" }}
    >
      {/* Background Prism Effect */}
      <div className="absolute inset-0 opacity-30">
        <Prism 
          height={4}
          baseWidth={6}
          animationType="3drotate"
          glow={1.2}
          noise={0.3}
          scale={2.8}
          hueShift={0.5}
          colorFrequency={1.5}
          timeScale={0.3}
          transparent={true}
        />
      </div>
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-black/60" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Transforming <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Lives</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Real impact, measurable results. See how Kazi Mtaani is empowering Kenya&apos;s youth and transforming communities.
          </p>
        </motion.div>

        {/* Main Metrics Grid */}
        <motion.div 
          className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8 mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, staggerChildren: 0.1 }}
          viewport={{ once: true }}
        >
          {/* Youth Empowered */}
          <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 backdrop-blur-lg rounded-2xl p-8 border border-blue-500/20 text-center group hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-500/30 transition-colors">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="text-4xl font-bold text-white mb-2">200K+</div>
            <div className="text-blue-300 font-medium mb-2">Youth Empowered</div>
            <div className="text-gray-400 text-sm">Across all 47 counties in Kenya</div>
          </div>

          {/* Communities Served */}
          <div className="bg-gradient-to-br from-green-900/40 to-green-800/20 backdrop-blur-lg rounded-2xl p-8 border border-green-500/20 text-center group hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-500/30 transition-colors">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="text-4xl font-bold text-white mb-2">1,200+</div>
            <div className="text-green-300 font-medium mb-2">Communities Served</div>
            <div className="text-gray-400 text-sm">Informal settlements transformed</div>
          </div>

          {/* Projects Completed */}
          <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20 text-center group hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-500/30 transition-colors">
              <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-4xl font-bold text-white mb-2">15K+</div>
            <div className="text-purple-300 font-medium mb-2">Projects Completed</div>
            <div className="text-gray-400 text-sm">Environmental & infrastructure</div>
          </div>

          {/* Income Generated */}
          <div className="bg-gradient-to-br from-yellow-900/40 to-yellow-800/20 backdrop-blur-lg rounded-2xl p-8 border border-yellow-500/20 text-center group hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-yellow-500/30 transition-colors">
              <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="text-4xl font-bold text-white mb-2">KSh 8B+</div>
            <div className="text-yellow-300 font-medium mb-2">Income Generated</div>
            <div className="text-gray-400 text-sm">Direct payments to youth</div>
          </div>
        </motion.div>

        {/* Impact Stories Grid */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, staggerChildren: 0.15 }}
          viewport={{ once: true }}
        >
          {/* Digital Innovation */}
          <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white">Digital Innovation</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Revolutionary QR code attendance system eliminates fraud and ensures accurate payment distribution to deserving youth workers.
            </p>
            <div className="flex items-center text-blue-400 text-sm font-medium">
              <span>99.8% Accuracy Rate</span>
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>

          {/* Skills Development */}
          <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white">Skills Development</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Comprehensive training in entrepreneurship, life skills, and citizenship values prepares youth for sustainable employment beyond the program.
            </p>
            <div className="flex items-center text-green-400 text-sm font-medium">
              <span>85% Employment Rate</span>
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>

          {/* Community Impact */}
          <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 md:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white">Community Impact</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Environmental cleanup, infrastructure improvement, and social cohesion projects create lasting positive change in informal settlements.
            </p>
            <div className="flex items-center text-purple-400 text-sm font-medium">
              <span>92% Community Satisfaction</span>
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 backdrop-blur-lg rounded-2xl p-8 border border-blue-500/20">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Make a Difference?</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Join thousands of young Kenyans who are transforming their communities while building their futures. 
              Be part of the digital revolution in youth empowerment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SignUpButton mode="modal">
                <ShimmerButton 
                  background="linear-gradient(135deg, #3B82F6, #8B5CF6)"
                  shimmerColor="#ffffff"
                  borderRadius="12px"
                  className="px-8 py-3 text-white font-semibold"
                >
                  Join as Worker
                </ShimmerButton>
              </SignUpButton>
              
              <Link href="/sign-up">
                <ShimmerButton 
                  background="rgba(0, 0, 0, 0.4)"
                  shimmerColor="#8B5CF6"
                  borderRadius="12px"
                  className="px-8 py-3 text-white font-semibold border-2 border-white/20"
                >
                  Become Supervisor
                </ShimmerButton>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}

export default Metrics