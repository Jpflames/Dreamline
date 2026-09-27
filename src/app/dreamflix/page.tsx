'use client';

import React from 'react';
import Link from 'next/link';
import { Play, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import Image from 'next/image';

const MOVIES = [
  { id: 1, title: 'The Back Room', image: '/movie1.jpg' },
  { id: 2, title: 'Abayomi', image: '/movie2.jpg' },
  { id: 3, title: 'Abattoir 3', image: '/movie3.jpg' },
  { id: 4, title: 'Higher Calling', image: '/movie4.jpg' },
  { id: 5, title: 'Abattoir 5', image: '/movie5.jpg' },
  { id: 6, title: 'The Train', image: '/movie6.jpg' },
];

export default function DreamflixPage() {
  return (
    <div className="min-h-screen bg-[#0C0B10] flex text-white font-sans overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-[300px] shrink-0 flex flex-col h-screen overflow-hidden bg-[#0A1118] border-r border-gray-800/50 z-20">
        <div className="p-8">
          <div className="flex flex-col gap-6">
            <button className="bg-[#F4B942] text-black font-bold py-3 px-6 rounded-2xl w-max shadow-lg">
              Home
            </button>
            <a href="#" className="font-semibold text-lg text-white hover:text-[#F4B942] transition-colors px-2">Latest</a>
            <a href="#" className="font-semibold text-lg text-white hover:text-[#F4B942] transition-colors px-2">Popular</a>
            <a href="#" className="font-semibold text-lg text-white hover:text-[#F4B942] transition-colors px-2">Upcoming</a>
          </div>
        </div>

        <div className="mt-auto flex-1 bg-[#101A24] rounded-tr-[40px] p-8 flex flex-col shadow-lg border-t border-r border-gray-700/30 overflow-y-auto">
          <div className="bg-[#F4B942] text-black font-bold py-1.5 px-6 rounded-full w-max mb-6">
            Synopsis
          </div>
          <div className="text-gray-300 text-sm leading-relaxed space-y-4">
            <p>
              The Back Room is a psychological supernatural thriller about desperation, destiny, 
              and the unseen forces that influence a man's journey. After losing his job and being 
              forced out of his home, Samuel finds himself at the lowest point of his life. 
              With nowhere else to go, he accepts a cheap room offered by a landlord, hoping it will 
              give him a chance to rebuild his life.
            </p>
            <p>
              But the room is not what it seems. Soon after settling in, Samuel encounters Bomada, 
              a mysterious woman whose presence raises more questions than answers. As strange 
              events begin to unfold, Samuel finds himself caught between fear...
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative bg-[#09080A]">
        
        {/* Top Navbar */}
        <header className="h-[80px] flex items-center justify-between px-8 shrink-0 z-20">
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

          <nav className="flex gap-4 lg:gap-6 text-sm font-medium">
            <Link href="/" className="hover:text-[#F4B942]">Home</Link>
            <span className="text-gray-600">|</span>
            <Link href="/dreamflix" className="text-[#F4B942]">Dreamflix</Link>
            <span className="text-gray-600">|</span>
            <Link href="/dplay" className="hover:text-[#F4B942]">DPlay</Link>
            <span className="text-gray-600">|</span>
            <Link href="/courses" className="hover:text-[#F4B942]">Courses</Link>
            <span className="text-gray-600">|</span>
            <Link href="/d-pulse" className="hover:text-[#F4B942]">D-Pulse</Link>
            <span className="text-gray-600">|</span>
            <Link href="/about" className="hover:text-[#F4B942]">About</Link>
          </nav>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pb-12">
          
          {/* Featured Hero Banner */}
          <div className="relative w-full h-[50vh] min-h-[400px] bg-black group flex items-center justify-center overflow-hidden">
            <img 
              src="/movie1.jpg" 
              alt="The Back Room" 
              className="absolute inset-0 w-full h-full object-cover object-top opacity-60"
            />
            {/* Dark vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#09080A] via-transparent to-transparent" />
            
            {/* Banner Text Overlay (simulated for WAY TO THE BACK ROOM) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
              <h2 className="text-[#F4B942] text-2xl font-semibold tracking-[0.2em] mb-2 uppercase drop-shadow-lg">Way to the</h2>
              <h1 className="text-7xl md:text-8xl font-black text-red-700 tracking-tighter uppercase drop-shadow-2xl">BACK ROOM</h1>
              <p className="text-white tracking-[0.3em] text-sm mt-2">[ THE MOVIE ]</p>
            </div>

            {/* Play Button */}
            <button className="relative z-20 bg-transparent border-4 border-white rounded-full w-24 h-24 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="w-10 h-10 text-white fill-white ml-2" />
            </button>

            {/* Side Arrows */}
            <button className="absolute left-8 top-1/2 -translate-y-1/2 z-20 text-white/50 hover:text-white transition-colors">
              <ChevronLeft className="w-12 h-12" />
            </button>
            <button className="absolute right-8 top-1/2 -translate-y-1/2 z-20 text-white/50 hover:text-white transition-colors">
              <ChevronRight className="w-12 h-12" />
            </button>
          </div>

          <div className="px-10 mt-6">
            <h2 className="text-3xl font-bold text-white mb-1">The Back Room</h2>
            <p className="text-gray-400 text-sm mb-8">2026 | Trailer | Dreamline Production</p>

            {/* Search & Filter Bar */}
            <div className="flex items-center justify-between mb-8">
              <div className="relative w-full max-w-[500px]">
                <input 
                  type="text" 
                  placeholder="Enter Keyword" 
                  className="w-full bg-[#1A1A1A] border border-gray-700 rounded-full py-3 px-6 text-white placeholder-gray-400 focus:outline-none focus:border-[#F4B942]"
                />
              </div>
              <button className="flex items-center gap-2 text-white hover:text-[#F4B942] transition-colors font-medium">
                <span>Filter</span>
                <Filter className="w-5 h-5" />
              </button>
            </div>

            {/* Movie Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {MOVIES.map((movie) => (
                <div key={movie.id} className="relative aspect-[2/3] rounded-xl overflow-hidden group cursor-pointer border border-gray-800 hover:border-[#F4B942]/50 transition-colors">
                  <img src={movie.image} alt={movie.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-bold text-white text-lg text-center drop-shadow-md">{movie.title.toUpperCase()}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
