"use client"
import React from 'react'
import DomeGallery from '@/components/ui/DomeGallery'

const Gallery = () => {
  const domeImages = [
    { src: '/landing/dome1.jpeg', alt: 'Kazi Mtaani workers in action' },
    { src: '/landing/dome4.jpeg', alt: 'Community development project' },
    { src: '/landing/dome5.jpeg', alt: 'Youth empowerment initiative' },
    { src: '/landing/dome6.jpeg', alt: 'Environmental cleanup project' },
    { src: '/landing/dome7.jpeg', alt: 'Skills training session' },
    { src: '/landing/dome8.jpeg', alt: 'Infrastructure improvement work' },
    { src: '/landing/hero.jpg', alt: 'Kazi Mtaani program overview' },
  ]

  return (
    <section 
      id="gallery" 
      className="py-20 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-purple-900/10" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Program <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Gallery</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Witness the transformation happening across Kenya&apos;s communities through the Kazi Mtaani program
          </p>
        </div>

        {/* Interactive Dome Gallery */}
        <div className="h-[600px] md:h-[700px] lg:h-[800px] relative">
          <DomeGallery 
            images={domeImages}
            fit={0.6}
            fitBasis="auto"
            minRadius={400}
            maxRadius={800}
            padFactor={0.2}
            overlayBlurColor="#000010"
            maxVerticalRotationDeg={8}
            dragSensitivity={25}
            enlargeTransitionMs={400}
            segments={30}
            dragDampening={1.8}
            openedImageWidth="500px"
            openedImageHeight="400px"
            imageBorderRadius="20px"
            openedImageBorderRadius="20px"
            grayscale={false}
          />
        </div>

        {/* Gallery Description */}
        <div className="text-center mt-12">
          <p className="text-gray-400 max-w-2xl mx-auto">
            Drag to explore • Click to enlarge • Experience the impact of digital innovation in youth empowerment
          </p>
        </div>
      </div>
    </section>
  )
}

export default Gallery
