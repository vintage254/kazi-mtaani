"use client"
import React from 'react'
import ElectricBorder from '@/components/ui/ElectricBorder'

const About = () => {
  return (
    <section 
      id="about" 
      className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Kazi Mtaani</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Empowering Kenya&apos;s youth through digital innovation and sustainable employment opportunities
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">The Program</h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                Kazi Mtaani is a transformative government initiative designed to cushion vulnerable youth 
                in informal settlements. Originally launched to address COVID-19 economic impacts, the program 
                has evolved into a comprehensive youth empowerment platform.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Through environmental improvement projects and skills training, over 200,000 youth have 
                gained entrepreneurship skills, life skills, and citizenship values while earning income 
                and contributing to community development.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">200K+</div>
                <div className="text-gray-300 text-sm">Youth Trained</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">47</div>
                <div className="text-gray-300 text-sm">Counties Covered</div>
              </div>
            </div>
          </div>

          {/* Right Content - Electric Border Card */}
          <div className="relative">
            <ElectricBorder 
              color="#3B82F6" 
              speed={1.2} 
              chaos={0.8}
              thickness={2}
              className="p-8 bg-black/40 backdrop-blur-lg rounded-2xl"
            >
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-white">Our Digital Solution</h4>
                </div>
                
                <p className="text-gray-300 leading-relaxed">
                  We&apos;ve revolutionized the Kazi Mtaani program with cutting-edge technology, 
                  providing seamless attendance tracking, automated payments, and comprehensive 
                  analytics to ensure transparency and efficiency.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <div className="text-white font-medium">QR Code Attendance</div>
                      <div className="text-gray-400 text-sm">Secure, contactless check-in system</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <div className="text-white font-medium">Smart Analytics</div>
                      <div className="text-gray-400 text-sm">Real-time performance insights</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <div className="text-white font-medium">Group Management</div>
                      <div className="text-gray-400 text-sm">Efficient worker organization</div>
                    </div>
                  </div>
                </div>
              </div>
            </ElectricBorder>
          </div>
        </div>

        {/* Impact Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          <ElectricBorder 
            color="#10B981" 
            speed={0.8} 
            chaos={0.6}
            thickness={1}
            className="p-6 bg-black/30 backdrop-blur-lg rounded-xl text-center"
          >
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Community Impact</h4>
            <p className="text-gray-300 text-sm">
              Environmental improvement projects in informal settlements across Kenya
            </p>
          </ElectricBorder>

          <ElectricBorder 
            color="#8B5CF6" 
            speed={1.0} 
            chaos={0.7}
            thickness={1}
            className="p-6 bg-black/30 backdrop-blur-lg rounded-xl text-center"
          >
            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Skills Development</h4>
            <p className="text-gray-300 text-sm">
              Entrepreneurship, life skills, and citizenship training for sustainable growth
            </p>
          </ElectricBorder>

          <ElectricBorder 
            color="#F59E0B" 
            speed={1.4} 
            chaos={0.9}
            thickness={1}
            className="p-6 bg-black/30 backdrop-blur-lg rounded-xl text-center"
          >
            <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Economic Empowerment</h4>
            <p className="text-gray-300 text-sm">
              Income generation and access to government affirmative funds for youth
            </p>
          </ElectricBorder>
        </div>
      </div>
    </section>
  )
}

export default About