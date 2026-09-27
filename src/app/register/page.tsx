'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Play, EyeOff, Eye, ChevronDown } from 'lucide-react';
import Image from 'next/image';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden bg-[#0A0710]">
      {/* Background Gradient & Curve */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#0a0710] via-[#1a0b16] to-[#2a0815]" />
      <div 
        className="absolute bottom-[-50%] left-[-20%] right-[-20%] h-[60%] z-0 rounded-[100%] border-t-[3px] border-[#F4B942]"
        style={{
          background: 'linear-gradient(180deg, rgba(20,10,15,1) 0%, rgba(10,5,5,1) 100%)',
          boxShadow: '0 -10px 40px rgba(244, 185, 66, 0.1)'
        }}
      />

      {/* Header Logo */}
      <div className="absolute top-8 left-8 z-20 flex items-center gap-2">
        <div className="w-8 h-8 relative flex items-center justify-center">
          {/* Logo icon approximation */}
          <div className="absolute inset-0 rounded-full border-[2px] border-dotted border-[#F4B942] animate-[spin_10s_linear_infinite]" />
          <Play className="w-3 h-3 text-[#F4B942] fill-[#F4B942] ml-1" />
        </div>
        <div className="flex flex-col">
          <span className="text-white font-bold text-xl leading-none tracking-wide">Dreamline</span>
          <span className="text-[#F4B942] text-[0.6rem] tracking-[0.2em] uppercase font-semibold">VISUALS</span>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-[1000px] px-6 pt-16 pb-8 flex flex-col items-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-wide">Let's Go</h1>
        
        <div className="text-center text-sm md:text-base text-gray-300 mb-10 space-y-1 font-light">
          <p>Start discovering Dreamline Visuals</p>
          <p>- Download free stock Clips</p>
          <p>- Download Fonts, Mockups, Flyer</p>
          <p>- Get the latest news & updates</p>
        </div>

        <div className="w-full flex flex-col lg:flex-row items-center lg:items-start justify-center gap-12 lg:gap-20">
          
          {/* Left Side - Form */}
          <div className="w-full max-w-[450px] space-y-4">
            <input 
              type="email" 
              placeholder="E-mail Address" 
              className="w-full bg-[#201824]/60 border border-gray-500/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#F4B942] transition-colors"
            />
            
            <div className="flex gap-4">
              <input 
                type="text" 
                placeholder="Last Name" 
                className="w-1/2 bg-[#201824]/60 border border-gray-500/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#F4B942] transition-colors"
              />
              <input 
                type="text" 
                placeholder="Full name" 
                className="w-1/2 bg-[#201824]/60 border border-gray-500/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#F4B942] transition-colors"
              />
            </div>

            <div className="flex gap-4">
              <div className="relative w-[100px] shrink-0">
                <select className="w-full appearance-none bg-[#201824]/60 border border-gray-500/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F4B942] transition-colors cursor-pointer">
                  <option value="US">US</option>
                  <option value="UK">UK</option>
                  <option value="NG">NG</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
              </div>
              <input 
                type="tel" 
                placeholder="Enter phone number" 
                className="flex-1 bg-[#201824]/60 border border-gray-500/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#F4B942] transition-colors"
              />
            </div>

            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Password" 
                className="w-full bg-[#201824]/60 border border-gray-500/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#F4B942] transition-colors pr-12"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </div>

            <div className="relative">
              <input 
                type={showConfirmPassword ? 'text' : 'password'} 
                placeholder="Re-Enter Password" 
                className="w-full bg-[#201824]/60 border border-gray-500/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#F4B942] transition-colors pr-12"
              />
              <button 
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showConfirmPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </div>

            <div className="pt-4">
              <button className="bg-[#F4B942] hover:bg-[#F4B942]/90 text-black font-semibold py-2 px-6 rounded-lg transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-[#F4B942]/20">
                Free Sign Up
              </button>
            </div>
          </div>

          {/* Right Side - Actions */}
          <div className="flex flex-col justify-center gap-6 mt-8 lg:mt-0 w-full max-w-[300px]">
            <button className="w-full bg-gradient-to-r from-[#F4B942] to-[#E3A325] hover:brightness-110 text-black font-semibold py-4 rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]">
              E-mail address
            </button>
            <button className="w-full bg-gradient-to-b from-gray-100 to-gray-300 hover:brightness-110 text-black font-medium py-4 rounded-xl flex items-center justify-center gap-3 shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]">
              <div className="bg-white p-1 rounded-full">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </div>
              <span className="text-lg">Google</span>
            </button>
          </div>

        </div>
      </div>

      {/* Floating Bottom Left Button */}
      <div className="absolute bottom-6 left-6 z-20">
        <button className="bg-gradient-to-br from-[#F4B942] to-[#D49820] p-4 rounded-xl shadow-lg border border-[#F4B942]/50 hover:scale-105 transition-transform">
          <Play className="w-6 h-6 text-black fill-black" />
        </button>
      </div>

      {/* Bottom Login Link */}
      <div className="absolute bottom-8 z-20 text-white font-light">
        Already have an account? <Link href="/login" className="font-bold hover:text-[#F4B942] transition-colors">log in</Link>
      </div>
    </div>
  );
}
