'use client';

import React from 'react';
import Link from 'next/link';
import { Play, Search, SkipBack, SkipForward, Pause } from 'lucide-react';
import Image from 'next/image';

const SIDEBAR_TOP_LINKS = ['Home', 'Popular', 'Podcast', 'Radio'];
const SIDEBAR_BOTTOM_LINKS = ['Trending', 'Artist', 'Playlist', 'Recommended', 'Genres', 'Favorite', 'My Library'];
const CATEGORIES = ['All', 'Afrosounds', 'Hip-Hop/Rap', 'Jazz/Blues', 'Pop', 'R&B', 'Rock', 'Country', 'Instrumental', 'Podcast', 'Electronic'];

const ALBUMS = [
  { id: 1, title: 'Always Good', artist: 'Michael Bassey ft Travis Greene', image: '/album1.jpg' },
  { id: 2, title: 'Lord Have Your Way', artist: 'Efe Grace', image: '/album2.jpg' },
  { id: 3, title: 'Giver of Good Things', artist: 'Joseph Briggs', image: '/album3.jpg' },
  { id: 4, title: 'City of God', artist: 'Dunsin Oyekan', image: '/album4.jpg' },
  { id: 5, title: 'Favour Favour', artist: 'Lawrence Oyor', image: '/album5.jpg' },
  { id: 6, title: 'Testimony', artist: 'Efe Grace', image: '/album6.jpg' },
];

export default function DPlayPage() {
  return (
    <div className="min-h-screen bg-[#0C0B10] flex text-white font-sans overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-[240px] shrink-0 flex flex-col h-screen overflow-hidden bg-transparent z-20">
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 relative flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-[2px] border-dotted border-[#F4B942] animate-[spin_10s_linear_infinite]" />
              <Play className="w-3 h-3 text-[#F4B942] fill-[#F4B942] ml-1" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-xl leading-none tracking-wide">Dreamline</span>
              <span className="text-[#F4B942] text-[0.6rem] tracking-[0.2em] uppercase font-semibold">VISUALS</span>
            </div>
          </div>

          <div className="bg-[#0B1521] rounded-2xl p-4 flex flex-col gap-4 shadow-lg border border-gray-800/50">
            {SIDEBAR_TOP_LINKS.map(link => (
              <a key={link} href="#" className="font-bold text-lg hover:text-[#F4B942] transition-colors px-2">
                {link}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-4 flex-1 bg-[#F4B942] rounded-tr-[40px] text-black p-8 flex flex-col gap-4 shadow-[0_-10px_40px_rgba(244,185,66,0.15)] overflow-y-auto">
          {SIDEBAR_BOTTOM_LINKS.map(link => (
            <a key={link} href="#" className="font-bold text-xl hover:text-white transition-colors">
              {link}
            </a>
          ))}
          <div className="mt-auto pt-6 border-t border-black/10">
            <p className="font-bold text-sm truncate">Release your Fire By st. Fe</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Top Navbar */}
        <header className="h-[80px] flex items-center justify-between px-8 shrink-0 z-20">
          <div className="relative w-full max-w-[400px]">
            <input 
              type="text" 
              placeholder="Enter Keyword" 
              className="w-full bg-[#1A1820] border border-gray-700/50 rounded-full py-2.5 px-6 text-white placeholder-gray-400 focus:outline-none focus:border-[#F4B942]"
            />
          </div>
          <nav className="flex gap-4 lg:gap-6 text-sm font-medium">
            <Link href="/" className="hover:text-[#F4B942]">Home</Link>
            <span className="text-gray-600">|</span>
            <Link href="/dreamflix" className="hover:text-[#F4B942]">Dreamflix</Link>
            <span className="text-gray-600">|</span>
            <Link href="/dplay" className="text-[#F4B942]">DPlay</Link>
            <span className="text-gray-600">|</span>
            <Link href="/courses" className="hover:text-[#F4B942]">Courses</Link>
            <span className="text-gray-600">|</span>
            <Link href="/d-pulse" className="hover:text-[#F4B942]">D-Pulse</Link>
            <span className="text-gray-600">|</span>
            <Link href="/about" className="hover:text-[#F4B942]">About</Link>
          </nav>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-8 pb-[100px]">
          {/* Banner */}
          <div className="w-full min-h-[350px] py-12 rounded-2xl overflow-hidden relative mb-8 flex items-center">
            <img 
              src="/dplaybanner.jpg" 
              alt="DJ Setup" 
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
            
            <div className="relative z-10 w-full md:w-1/2 pl-12 pr-6">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Give Your Sound a <span className="text-[#F4B942]">Place to Live</span>
              </h1>
              <p className="text-sm md:text-base text-gray-200 mb-6 font-light leading-relaxed">
                A music platform created to empower gospel artists, inspire hearts, 
                and spread the message of faith through music across the world.
                We believe every song carries a message, every voice has a purpose,
                and every sound can touch a life. <br/><br/>
                <strong>Your sound. Your ministry. His message.</strong>
              </p>
              <button className="bg-[#F4B942] hover:bg-[#E3A325] text-black font-bold py-2.5 px-8 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95">
                upload your Music for free
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-6 overflow-x-auto pb-4 mb-4 scrollbar-hide text-sm md:text-base whitespace-nowrap">
            {CATEGORIES.map((cat, i) => (
              <React.Fragment key={cat}>
                <button className={`hover:text-[#F4B942] font-semibold transition-colors ${i === 0 ? 'text-white' : 'text-gray-300'}`}>
                  {cat}
                </button>
                {i < CATEGORIES.length - 1 && <span className="text-gray-600">|</span>}
              </React.Fragment>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {ALBUMS.map(album => (
              <div key={album.id} className="group cursor-pointer">
                <div className="aspect-square rounded-xl overflow-hidden relative mb-3">
                  <img src={album.image} alt={album.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-[#F4B942] rounded-full p-3">
                      <Play className="w-6 h-6 text-black fill-black ml-1" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* Bottom Player Bar */}
      <div className="fixed bottom-0 left-[240px] right-0 h-[80px] bg-black/80 backdrop-blur-md border-t border-gray-800/50 flex items-center px-4 z-50">
        <div className="flex items-center gap-4 mr-6">
          <img src={ALBUMS[0].image} alt="Playing" className="w-14 h-14 rounded-md object-cover" />
        </div>
        
        <div className="flex items-center gap-2 bg-[#F4B942] rounded-full px-6 py-2 mr-6 text-black shadow-lg">
          <button className="hover:scale-110 transition-transform"><SkipBack className="w-6 h-6 fill-black" /></button>
          <button className="hover:scale-110 transition-transform p-1 border-2 border-black rounded-full"><Play className="w-6 h-6 fill-black ml-0.5" /></button>
          <button className="hover:scale-110 transition-transform"><SkipForward className="w-6 h-6 fill-black" /></button>
        </div>

        <div className="flex-1 flex items-center h-full px-4 overflow-hidden opacity-80">
           {/* Fake waveform using repeating SVG or divs */}
           <div className="w-full h-8 flex items-center gap-[2px]">
             {[...Array(100)].map((_, i) => (
               <div 
                 key={i} 
                 className="w-1 bg-[#F4B942]/60 rounded-full" 
                 style={{ height: `${Math.round(Math.max(15, Math.abs(Math.sin(i * 0.6)) * 100))}%` }}
               />
             ))}
           </div>
        </div>
      </div>
    </div>
  );
}
