'use client';
import Image from 'next/image';
import React from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useState } from 'react';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';
import { ShimmerButton } from '@/components/ui/ShimmerButton';

// Utility function (you'll need to add this to your utils)
const cn = (...classes: (string | undefined | null | boolean)[]) => {
  return classes.filter(Boolean).join(' ');
};

// Navigation links
const navLinks = [
  { id: 'home', name: 'Home', href: '#home' },
  { id: 'features', name: 'Features', href: '#features' },
  { id: 'about', name: 'About', href: '#about' },
  { id: 'contact', name: 'Contact', href: '#contact' }
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isSignedIn, user } = useUser();

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Initial navbar animation on page load
    gsap.fromTo('nav', 
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.5 }
    );
    
    // Logo animation
    gsap.fromTo('.logo-container', 
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 1, ease: 'power2.out', delay: 0.8 }
    );
    
    // Navigation links stagger animation
    gsap.fromTo('.nav-link', 
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out', delay: 1 }
    );
    
    // Scroll-triggered background change
    const navTween = gsap.timeline({
      scrollTrigger: {
        trigger: 'body',
        start: '100px top',
        end: '200px top',
        scrub: 1,
      }
    });
    
    navTween.to('nav', {
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      backdropFilter: 'blur(15px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      duration: 0.3,
    });
    
    // Mobile menu animations
    if (isMenuOpen) {
      gsap.fromTo('.mobile-menu',
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      );
      
      gsap.fromTo('.mobile-nav-link',
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out' }
      );
    }
    
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 px-4 md:px-6 py-4 transition-all duration-300 font-sans">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          
          {/* Logo Section */}
          <a href="#home" className="logo-container flex items-center gap-3 group">
            <div className="relative overflow-hidden rounded-full">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <span className="text-white font-bold text-lg">KM</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <p className="font-bold text-white text-xl bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Kazi Mtaani
              </p>
              <p className="text-gray-300 text-xs font-light tracking-widest">
                MANAGEMENT SYSTEM
              </p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex space-x-8">
            {navLinks.map((link, index) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  className="nav-link relative text-white hover:text-transparent hover:bg-gradient-to-r hover:from-blue-400 hover:to-blue-600 hover:bg-clip-text transition-all duration-300 font-medium tracking-wide group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
            ))}
          </ul>

          {/* CTA Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            {isSignedIn ? (
              <div className="flex items-center space-x-4">
                <span className="text-white text-sm">
                  Welcome, {user?.firstName || user?.emailAddresses[0]?.emailAddress}
                </span>
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8"
                    }
                  }}
                />
              </div>
            ) : (
              <>
                <SignInButton mode="modal">
                  <button className="text-white hover:text-blue-400 px-4 py-2 text-sm font-medium transition-colors duration-200">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <ShimmerButton
                    shimmerColor="#ffffff"
                    shimmerSize="0.05em"
                    shimmerDuration="2.5s"
                    borderRadius="8px"
                    background="linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
                    className="px-6 py-2 text-sm font-semibold tracking-wide hover:scale-105 transition-transform duration-300"
                  >
                    Sign Up
                  </ShimmerButton>
                </SignUpButton>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-2"
            aria-label="Toggle menu"
          >
            <div className="space-y-1.5">
              <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
              <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
              <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mobile-menu md:hidden mt-4 bg-black/95 backdrop-blur-lg rounded-lg border border-white/10 shadow-2xl">
            <ul className="py-4 space-y-2">
              {navLinks.map((link, index) => (
                <li key={link.id}>
                  <a
                    href={link.href}
                    onClick={closeMenu}
                    className="mobile-nav-link block px-6 py-3 text-white hover:bg-gradient-to-r hover:from-blue-900/20 hover:to-blue-800/20 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-400 hover:to-blue-600 transition-all duration-300 font-medium"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
              <li className="px-6 py-2 space-y-2">
                {isSignedIn ? (
                  <div className="flex items-center justify-center space-x-4 py-2">
                    <span className="text-white text-sm">
                      Welcome, {user?.firstName || user?.emailAddresses[0]?.emailAddress}
                    </span>
                    <UserButton 
                      appearance={{
                        elements: {
                          avatarBox: "w-8 h-8"
                        }
                      }}
                    />
                  </div>
                ) : (
                  <>
                    <SignInButton mode="modal">
                      <button 
                        className="w-full text-white hover:text-blue-400 py-2 text-center font-medium transition-colors duration-200"
                        onClick={closeMenu}
                      >
                        Sign In
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <ShimmerButton
                        shimmerColor="#ffffff"
                        shimmerSize="0.05em"
                        shimmerDuration="2.5s"
                        borderRadius="8px"
                        background="linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
                        className="w-full py-3 text-center font-semibold tracking-wide"
                        onClick={closeMenu}
                      >
                        Sign Up
                      </ShimmerButton>
                    </SignUpButton>
                  </>
                )}
              </li>
            </ul>
          </div>
        )}
      </nav>

      <style jsx>{`
        @keyframes shimmer-slide {
          to {
            transform: translate(calc(100cqw - 100%), calc(100cqh - 100%));
          }
        }
        
        @keyframes spin-around {
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-shimmer-slide {
          animation: shimmer-slide 1s ease-in-out infinite alternate;
        }
        
        .animate-spin-around {
          animation: spin-around var(--speed) linear infinite;
        }
      `}</style>
    </>
  );
};

export default Navbar;