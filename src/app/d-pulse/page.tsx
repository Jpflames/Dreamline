'use client';

import React from 'react';
import Link from 'next/link';
import { Play } from 'lucide-react';
import Image from 'next/image';

export default function DPulseArticlePage() {
  return (
    <div className="min-h-screen bg-[#0C0B10] flex flex-col font-sans">
      
      {/* Top Navbar */}
      <header className="h-[80px] flex items-center justify-between px-8 shrink-0 z-20 bg-[#0C0B10] border-b border-gray-800">
        {/* Logo */}
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

        <nav className="flex gap-4 lg:gap-6 text-sm font-medium text-white">
          <Link href="/" className="hover:text-[#F4B942]">Home</Link>
          <span className="text-gray-600">|</span>
          <Link href="/dreamflix" className="hover:text-[#F4B942]">Dreamflix</Link>
          <span className="text-gray-600">|</span>
          <Link href="/dplay" className="hover:text-[#F4B942]">DPlay</Link>
          <span className="text-gray-600">|</span>
          <Link href="/courses" className="hover:text-[#F4B942]">Courses</Link>
          <span className="text-gray-600">|</span>
          <Link href="/d-pulse" className="text-[#F4B942]">D-Pulse</Link>
          <span className="text-gray-600">|</span>
          <Link href="/about" className="hover:text-[#F4B942]">About</Link>
        </nav>
      </header>

      {/* Main Content Area (Light Theme) */}
      <main className="flex-1 bg-white relative overflow-hidden flex flex-col items-center">
        {/* Subtle Map Watermark Background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")',
          backgroundSize: '400px'
        }}>
           {/* Fallback to CSS pattern if no image */}
        </div>
        
        <div className="w-full max-w-[1000px] px-8 pt-6 pb-20 relative z-10">
          
          {/* Date Badge */}
          <div className="flex justify-end mb-6">
            <div className="bg-[#F4B942] text-black font-bold py-2 px-6 rounded-full shadow-md">
              25th September 2026
            </div>
          </div>

          {/* Hero Banner Image */}
          <div className="w-full h-[350px] rounded-[40px] overflow-hidden relative mb-8 shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1548625361-9c6bc76313b8?w=1200&q=80" 
              alt="Glory Dome" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-blue-900/40 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-2 tracking-tight shadow-black drop-shadow-lg leading-tight">
                Dunamis Is Just<br/>Getting Started
              </h1>
              <p className="text-[#F4B942] font-semibold text-lg md:text-xl drop-shadow-md italic">
                Dunamis Celebrates a Journey of 30 years That Keeps Growing
              </p>
            </div>
          </div>

          {/* Article Body */}
          <div className="relative text-gray-800 text-base md:text-lg leading-relaxed text-justify">
            
            <p className="mb-4">
              <strong>Abuja, Nigeria —</strong> Three decades after Dr. Paul Enenche and his wife, Dr. Becky Paul-Enenche, walked away from promising 
              medical careers to answer what they described as a divine call, Dunamis International Gospel Centre (DIGC) is heading 
              toward its 30th anniversary this November still expanding rather than slowing down.
            </p>

            {/* Floated Image */}
            <div className="float-right ml-8 mb-4 mt-2 w-[350px]">
              <div className="bg-red-900 rounded-[40px] overflow-hidden shadow-xl border-4 border-white">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&q=80" 
                  alt="Dr. Paul and Dr. Becky Enenche" 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            <h3 className="font-bold text-xl mb-2 text-black mt-6">Humble beginnings</h3>
            <p className="mb-4">
              The ministry traces its roots to November 1996, when Dr. Paul and Dr. Becky Enenche left 
              their jobs, relatives, and medical careers to relocate to Abuja, a city where they knew no one. 
              The church officially began on November 10, 1996, initially worshipping for two weeks 
              before moving to the Sheraton Hotel & Towers in Abuja for about six months, and then to a 
              permanent site at Area 1 in June 1997.
            </p>
            <p className="mb-4">
              From a small gathering to a 100,000-seat auditorium
            </p>
            <p className="mb-4">
              The church's growth culminated in the construction of the Glory Dome, its new international 
              headquarters. Ground was broken for the new structure on September 14, 2014, in a ceremo
              ny presided over by Bishop David Oyedepo, described as Dr. Enenche's spiritual father. The 
              Glory Dome was dedicated on November 24, 2018, and has a capacity of 100,000 worship
              pers, making it one of the largest church auditoriums in Africa.
            </p>

            <h3 className="font-bold text-xl mb-2 text-black mt-6">A ministry with global reach</h3>
            <p className="mb-6">
              DIGC now describes itself as having branches worldwide, with regular events including a midnight prayer service, midweek ser
              vices, a healing and deliverance service, and a monthly Worship, Word and Wonders Night. Beyond Abuja, the church has estab
              lished congregations in cities like London and Manchester, and its media arm broadcasts sermons, devotionals, and music through 
              Dunamis TV and other platforms.
            </p>

            <p className="mb-2">
              The ministry has continued to make headlines in 2025 and 2026:
            </p>
            <p className="mb-2">
              In mid-2025, Dr. Enenche announced an end to domestic live broadcasts of church services, urging members to return to in-person 
              worship, citing the biblical exhortation not to give up meeting together, while making an exception for overseas members without 
              access to a physical branch.
            </p>
            <p className="mb-6">
              The church kicked off 2026 with its annual 21-Days Kings' Fast, running from January 5 to January 25, held daily at 5:00 PM at 
              the Glory Dome, themed around stepping into a "year of dominion, breakthrough, and supernatural encounters."
            </p>

            <h3 className="font-bold text-xl mb-2 text-black">ODM Daily</h3>
            <p className="mb-6">
              The ministry has also expanded its crusade outreach, including healing and deliverance events in locations like Ankpa, and contin
              ues to draw public attention for Dr. Enenche's outspoken commentary on Nigeria's social and spiritual challenges.
            </p>

            <h3 className="font-bold text-xl mb-2 text-black">Looking ahead</h3>
            <p className="mb-8">
              With its 30th anniversary approaching on November 10, 2026, Dunamis International Gospel Centre shows no signs of scaling 
              back — continuing to build congregations abroad, run large-scale prayer and fasting programs, and position the Glory Dome as a 
              hub for what the ministry calls "end-time revival."
            </p>

          </div>
        </div>
        
        {/* Bottom Orange Gradient */}
        <div className="absolute bottom-0 w-full h-[40px] bg-gradient-to-r from-[#D97706] to-[#B45309]" />
      </main>
    </div>
  );
}
