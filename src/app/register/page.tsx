'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Mail, Lock, User, AlertCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Register() {
  const router = useRouter();
  const { user, register, loginWithGoogle, loading } = useApp();

  // Input states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status states
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Redirect if logged in
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) return;

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password should be at least 6 characters.');
      return;
    }

    setErrorMsg(null);
    setSubmitLoading(true);
    try {
      await register(email, password, name);
      // Success redirect happens in useEffect
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Verify credentials.');
      setSubmitLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setSubmitLoading(true);
    try {
      await loginWithGoogle();
      // Redirect handled in useEffect
    } catch (err: any) {
      setErrorMsg(err.message || 'Google signup failed.');
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-muted-foreground">Checking authentication state...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12 relative overflow-hidden">
      
      {/* Cinematic glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-950/20 via-slate-950 to-slate-950 z-0" />
      <div className="absolute top-1/4 left-1/3 h-[250px] w-[250px] rounded-full bg-violet-600/10 blur-[100px] pointer-events-none" />

      {/* Back to home */}
      <Link href="/" className="absolute top-6 left-6 text-sm font-semibold text-slate-400 hover:text-white flex items-center gap-1 z-10">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Home</span>
      </Link>

      {/* Card Wrapper */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl text-slate-100 space-y-6"
      >
        
        {/* Title branding */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center justify-center">
            <img src="/Dreamline-media-Logob.png" alt="Dreamline Logo" className="h-12 w-auto" />
          </Link>
          <h2 className="text-2xl font-bold font-poppins">Create Creative Account</h2>
          <p className="text-xs text-slate-400">Join Dreamline to unlock lessons, bookmarks, and downloads.</p>
        </div>

        {/* Global Error message banner */}
        {errorMsg && (
          <div className="flex items-center gap-2 rounded-xl bg-red-950/40 border border-red-500/30 p-4 text-xs text-red-400">
            <AlertCircle className="h-4.5 w-4.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form elements */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={submitLoading}
            className="w-full rounded-xl bg-linear-to-r from-orange-400 via-yellow-600 to-neutral-950 hover:opacity-90 py-3 text-sm font-semibold text-white transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {submitLoading ? 'Registering Account...' : 'Register'}
          </button>

        </form>

        {/* Divider */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-4 text-slate-500 text-xs font-semibold uppercase">Or signup with</span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        {/* Google sign up */}
        <button
          onClick={handleGoogleLogin}
          disabled={submitLoading}
          className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 text-sm font-semibold hover:bg-slate-900 transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <svg className="h-4.5 w-4.5" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.113-5.136 4.113-3.473 0-6.291-2.818-6.291-6.29 0-3.474 2.818-6.292 6.291-6.292 1.566 0 2.98.574 4.077 1.517l3.078-3.078C18.966 2.052 15.82 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c5.899 0 10.97-4.254 10.97-11.24 0-.648-.057-1.3-.172-1.955H12.24z"
            />
          </svg>
          Google Sign Up
        </button>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline font-semibold">
              Sign In
            </Link>
          </p>
        </div>

      </motion.div>

    </div>
  );
}
