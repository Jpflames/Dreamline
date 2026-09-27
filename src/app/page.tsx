'use client';

import React from 'react';
import Link from 'next/link';
import { Play, ChevronRight, Facebook, Instagram, Youtube, Twitter, Disc } from 'lucide-react';
import Image from 'next/image';

const GALLERY_ITEMS = [
  { id: 1, title: 'Dream it. We Create it.', image: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=500&q=80' },
  { id: 2, title: 'The Best for all PODCAST', image: 'https://images.unsplash.com/photo-1590602847861-f357a9162c6a?w=500&q=80' },
  { id: 3, title: 'Way to the Back Room', image: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=500&q=80' },
  { id: 4, title: 'Credibility you can count on', image: 'https://images.unsplash.com/photo-1555169062-013468b47731?w=500&q=80' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0C0B10] flex flex-col font-sans text-white overflow-x-hidden">
      
      {/* 1. Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center pt-8 pb-32">
        {/* Dark Grid Background Placeholder */}
        <div className="absolute inset-0 z-0 opacity-20 grid grid-cols-4 grid-rows-3 gap-1">
           {[...Array(12)].map((_, i) => (
             <div key={i} className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(https://images.unsplash.com/photo-${1500000000000 + i}?w=400&q=80)` }} />
           ))}
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0C0B10]/80 via-[#0C0B10]/90 to-[#0C0B10]" />

        {/* Navbar */}
        <header className="relative z-20 w-full px-8 flex justify-between items-center mb-24">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 relative flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-[2px] border-dotted border-[#F4B942] animate-[spin_10s_linear_infinite]" />
              <Play className="w-3 h-3 text-[#F4B942] fill-[#F4B942] ml-1" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-xl leading-none tracking-wide">Dreamline</span>
              <span className="text-[#F4B942] text-[0.6rem] tracking-[0.2em] uppercase font-semibold">VISUALS</span>
            </div>
          </div>
          
          <nav className="hidden md:flex gap-4 lg:gap-6 text-sm font-medium">
            <Link href="/" className="hover:text-[#F4B942]">Home</Link>
            <span className="text-gray-600">|</span>
            <Link href="/dreamflix" className="hover:text-[#F4B942]">Dreamflix</Link>
            <span className="text-gray-600">|</span>
            <Link href="/dplay" className="hover:text-[#F4B942]">DPlay</Link>
            <span className="text-gray-600">|</span>
            <Link href="/courses" className="hover:text-[#F4B942]">Courses</Link>
            <span className="text-gray-600">|</span>
            <Link href="/d-pulse" className="hover:text-[#F4B942]">D-Pulse</Link>
            <span className="text-gray-600">|</span>
            <Link href="/about" className="hover:text-[#F4B942]">About</Link>
          </nav>
          
          <Link href="/login">
            <button className="bg-[#F4B942] hover:bg-[#E3A325] text-black font-bold py-2 px-8 rounded-full transition-transform hover:scale-105 shadow-[0_0_15px_rgba(244,185,66,0.3)]">
              Log in
            </button>
          </Link>
        </header>

        {/* Center Logo & Form */}
        <div className="relative z-20 flex flex-col items-center w-full max-w-2xl px-4">
          {/* Large Center Logo */}
          <div className="flex flex-col items-center mb-8 scale-150 transform">
            <div className="w-16 h-16 relative flex items-center justify-center mb-2">
               {/* Dotted Spiral/Circle Approximation */}
              <div className="absolute inset-0 rounded-full border-[3px] border-dotted border-white/80 animate-[spin_20s_linear_infinite]" />
              <div className="absolute inset-2 rounded-full border-[2px] border-dotted border-gray-400/80 animate-[spin_15s_linear_infinite_reverse]" />
              <Play className="w-6 h-6 text-[#F4B942] fill-red-600 ml-1 z-10" />
            </div>
            <div className="flex items-center">
              <span className="text-white font-bold text-5xl tracking-tight leading-none">Dream</span>
              <span className="text-gray-300 font-light text-5xl tracking-tight leading-none">line</span>
            </div>
            <span className="text-[#F4B942] text-[0.85rem] tracking-[0.4em] uppercase font-bold mt-1">VISUALS</span>
          </div>

          <p className="text-lg md:text-xl text-gray-200 mb-6 font-light">
            Enter your email to create or restart your membership.
          </p>

          <div className="w-full relative flex items-center shadow-2xl">
            <input 
              type="email" 
              placeholder="E-mail Address" 
              className="w-full bg-[#1A1820]/90 border border-gray-600 rounded-full py-4 pl-6 pr-[160px] text-white placeholder-gray-400 focus:outline-none focus:border-[#F4B942]"
            />
            <button className="absolute right-1 top-1 bottom-1 bg-[#F4B942] hover:bg-[#E3A325] text-black font-bold px-8 rounded-full flex items-center gap-2 transition-transform hover:scale-[1.02]">
              Get Started <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Waveform Bar */}
        <div className="absolute bottom-16 left-8 right-8 z-20">
          <div className="w-full h-14 bg-[#151218]/80 backdrop-blur-md border border-[#F4B942]/30 rounded-full flex items-center px-2">
            <div className="bg-[#F4B942] rounded-full p-2 mr-4 shrink-0 shadow-lg">
              <Play className="w-6 h-6 text-black fill-black ml-0.5" />
            </div>
            <div className="flex-1 flex items-center gap-[3px] h-8 overflow-hidden opacity-80">
              {[...Array(150)].map((_, i) => (
                <div 
                  key={i} 
                  className="w-1 bg-[#F4B942]/70 rounded-full" 
                  style={{ height: `${Math.round(Math.max(15, Math.abs(Math.sin(i * 0.6)) * 100))}%` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Curve */}
        <div className="absolute bottom-[-10px] left-[-10%] right-[-10%] h-[100px] border-t-2 border-[#F4B942]/70 rounded-[100%] pointer-events-none z-10" />
      </section>

      {/* 2. Gallery Section */}
      <section className="relative py-20 px-8 flex flex-col items-center bg-[#09080A]">
        <div className="w-full max-w-[1400px]">
          <button className="bg-[#F4B942] hover:bg-[#E3A325] text-black font-bold py-3 px-8 rounded-2xl mb-12 shadow-lg hover:scale-105 transition-transform">
            Browse Gallery
          </button>
          
          <div className="relative flex items-center">
            <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x w-full">
              {GALLERY_ITEMS.map((item) => (
                <div key={item.id} className="snap-center shrink-0 w-[280px] h-[400px] rounded-3xl overflow-hidden relative border-2 border-[#F4B942] shadow-[0_0_20px_rgba(244,185,66,0.2)] group cursor-pointer transition-transform hover:scale-[1.02]">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  
                  {/* Top center mini logo */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 scale-75">
                    <Play className="w-3 h-3 text-[#F4B942] fill-red-600" />
                    <span className="text-white font-bold text-sm tracking-wide">Dreamline</span>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6 text-center">
                    <h3 className="font-bold text-white text-xl drop-shadow-lg">{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Right Arrow */}
            <button className="absolute right-[-40px] z-20 text-[#F4B942] hover:scale-125 transition-transform">
              <ChevronRight className="w-12 h-12 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Bottom Curve */}
        <div className="absolute bottom-[-10px] left-[-10%] right-[-10%] h-[100px] border-t-2 border-[#F4B942]/70 rounded-[100%] pointer-events-none z-10" />
      </section>

      {/* 3. Footer Section */}
      <footer className="relative bg-[#060508] pt-24 pb-12 px-8 flex justify-center z-0">
        <div className="w-full max-w-[1400px] flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Left Column */}
          <div className="w-full lg:w-[45%] flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 relative flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-[2px] border-dotted border-[#F4B942]" />
                <Play className="w-3 h-3 text-[#F4B942] fill-[#F4B942] ml-1" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-xl leading-none tracking-wide">Dreamline</span>
                <span className="text-[#F4B942] text-[0.6rem] tracking-[0.2em] uppercase font-semibold">VISUALS</span>
              </div>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed mb-6 text-justify">
              Dreamline Visuals Ltd is a morality rooted film & media production company founded in 2023 and officially registered as a Limited Company in 2026. We exist at the intersection of faith and film, building a world where excellent visuals carry morals to every screen, in every nation.
            </p>
            <p className="text-gray-300 text-sm leading-relaxed mb-8 text-justify">
              Beyond all we are also a graphics designing company for any organization. We cover events, provide branding solutions, and handle all forms of media activity. Whether it's corporate identity, event coverage, or creative storytelling, we deliver visuals that inspire, connect, and leave lasting impact.
            </p>

            <div className="flex gap-4 mb-16">
              <div className="bg-white rounded-full p-1.5 hover:scale-110 transition-transform cursor-pointer"><Facebook className="w-5 h-5 text-black" fill="currentColor"/></div>
              <div className="bg-white rounded-full p-1.5 hover:scale-110 transition-transform cursor-pointer"><Instagram className="w-5 h-5 text-black" /></div>
              <div className="bg-white rounded-full p-1.5 hover:scale-110 transition-transform cursor-pointer"><Youtube className="w-5 h-5 text-black" /></div>
              <div className="bg-white rounded-full p-1.5 hover:scale-110 transition-transform cursor-pointer">
                {/* TikTok Approximation */}
                <Disc className="w-5 h-5 text-black" />
              </div>
              <div className="bg-white rounded-full p-1.5 hover:scale-110 transition-transform cursor-pointer"><Twitter className="w-5 h-5 text-black" fill="currentColor"/></div>
            </div>

            <p className="text-gray-500 text-xs">© 2026 Dreamline inc. All rights reserved.</p>
          </div>

          {/* Right Area */}
          <div className="w-full lg:w-[55%] flex flex-col">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16">
              {/* Tutorials */}
              <div className="flex flex-col">
                <div className="bg-[#F4B942] text-black font-bold py-1.5 px-6 rounded-xl w-max mb-6">
                  TUTORIALS
                </div>
                <ul className="space-y-4 text-sm text-gray-300">
                  <li><a href="#" className="hover:text-[#F4B942] transition-colors">Photoshop</a></li>
                  <li><a href="#" className="hover:text-[#F4B942] transition-colors">Premiere Pro</a></li>
                  <li><a href="#" className="hover:text-[#F4B942] transition-colors">Capcut</a></li>
                  <li><a href="#" className="hover:text-[#F4B942] transition-colors">AI</a></li>
                </ul>
              </div>

              {/* Courses */}
              <div className="flex flex-col">
                <div className="bg-[#F4B942] text-black font-bold py-1.5 px-6 rounded-xl w-max mb-6">
                  COURSES
                </div>
                <ul className="space-y-4 text-sm text-gray-300">
                  <li><a href="#" className="hover:text-[#F4B942] transition-colors">Graphics Design Foundations</a></li>
                  <li><a href="#" className="hover:text-[#F4B942] transition-colors">Video Editing</a></li>
                  <li><a href="#" className="hover:text-[#F4B942] transition-colors">Camera Operations</a></li>
                  <li><a href="#" className="hover:text-[#F4B942] transition-colors">Camera Settings</a></li>
                </ul>
              </div>

              {/* Resources */}
              <div className="flex flex-col">
                <div className="bg-[#F4B942] text-black font-bold py-1.5 px-6 rounded-xl w-max mb-6">
                  RESOURCES
                </div>
                <ul className="space-y-4 text-sm text-gray-300">
                  <li><a href="#" className="hover:text-[#F4B942] transition-colors">Fonts</a></li>
                  <li><a href="#" className="hover:text-[#F4B942] transition-colors">Mockups</a></li>
                  <li><a href="#" className="hover:text-[#F4B942] transition-colors">Vector Assets</a></li>
                  <li><a href="#" className="hover:text-[#F4B942] transition-colors">Photoshop Template</a></li>
                  <li><a href="#" className="hover:text-[#F4B942] transition-colors">Transitions, e.t.c</a></li>
                </ul>
              </div>
            </div>

            {/* Chat Agent Box */}
            <div className="flex flex-col max-w-[600px]">
              <h3 className="text-[#F4B942] font-bold text-lg mb-2">Chat With Our Agent</h3>
              <p className="text-gray-400 text-sm mb-4">Get weekly updates on resources, tutorials, vector assets, and student spotlights.</p>
              
              <div className="w-full h-[180px] bg-[#111015] border border-gray-700 rounded-xl relative overflow-hidden shadow-inner">
                 <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
                 {/* This represents the dark empty box shown in the footer of the design */}
              </div>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}
