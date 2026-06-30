'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Sun, 
  Moon, 
  User, 
  LogOut, 
  LayoutDashboard, 
  Compass, 
  ChevronDown 
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme, user, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tutorialsDropdownOpen, setTutorialsDropdownOpen] = useState(false);

  // Hide Navbar on authentication screens
  const isAuthPage = pathname === '/login' || pathname === '/register';
  if (isAuthPage) return null;

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    {
      name: 'Tutorials',
      path: '/tutorials',
      dropdown: [
        { name: 'Uploaded Tutorials', path: '/tutorials?tab=uploaded' },
        { name: 'YouTube Tutorials', path: '/tutorials?tab=youtube' }
      ]
    },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Courses', path: '/courses' },
    { name: 'Resources', path: '/resources' },
    { name: 'Community', path: '/community' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Branding Logo */}
        <Link href="/" className="flex items-center">
          <img src="/Dreamline-media-Logob.png" alt="Dreamline Logo" className="h-10 w-auto" />
        </Link>

        {/* Desktop Navigation Link Menu */}
        <nav className="hidden md:flex space-x-6">
          {navLinks.map((link) => {
            if (link.dropdown) {
              return (
                <div 
                  key={link.name} 
                  className="relative group"
                  onMouseEnter={() => setTutorialsDropdownOpen(true)}
                  onMouseLeave={() => setTutorialsDropdownOpen(false)}
                >
                  <button className="flex items-center space-x-1 py-2 text-sm font-medium hover:text-primary transition-colors cursor-pointer">
                    <span>{link.name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <AnimatePresence>
                    {tutorialsDropdownOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 mt-1 w-48 rounded-xl border border-border bg-card p-2 shadow-lg dark:bg-slate-900"
                      >
                        {link.dropdown.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.path}
                            className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-all"
                            onClick={() => setTutorialsDropdownOpen(false)}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            const isActive = pathname === link.path;
            return (
              <Link
                key={link.name}
                href={link.path}
                className={`py-2 text-sm font-medium transition-colors hover:text-primary ${
                  isActive ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Nav Utilities */}
        <div className="flex items-center space-x-4">
          {/* Theme Switcher Toggle */}
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 hover:bg-accent transition-colors cursor-pointer"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5 text-yellow-400" />}
          </button>

          {/* User auth details */}
          {user ? (
            <div className="relative group">
              <button className="flex items-center space-x-2 rounded-full border border-border p-1 pr-3 hover:bg-accent transition-all cursor-pointer">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
                    {user.displayName.substring(0, 2).toUpperCase()}
                  </div>
                )}
                <span className="hidden sm:inline text-xs font-medium max-w-[80px] truncate">
                  {user.displayName.split(' ')[0]}
                </span>
              </button>

              {/* User Dropdown */}
              <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl border border-border bg-card p-2 shadow-lg dark:bg-slate-900 invisible group-hover:visible hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
                {user.role === 'admin' ? (
                  <Link
                    href="/admin"
                    className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-left text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-all"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Admin Panel</span>
                  </Link>
                ) : null}
                <Link
                  href="/dashboard"
                  className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-left text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-all"
                >
                  <Compass className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="hidden sm:flex items-center space-x-2">
              <Link
                href="/login"
                className="text-sm font-medium hover:text-primary transition-colors px-3 py-2"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-linear-to-r from-orange-400 via-yellow-600 to-neutral-950 px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-colors shadow-sm"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden rounded-lg p-2 hover:bg-accent transition-colors"
            aria-label="Open Menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Slide-out drawer) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Overlay backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-72 bg-card p-6 shadow-2xl dark:bg-slate-900 border-l border-border md:hidden flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-border">
                  <span className="text-lg font-bold font-poppins text-gradient-purple">Dreamline</span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg p-2 hover:bg-accent transition-all"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <nav className="mt-8 flex flex-col space-y-4">
                  {navLinks.map((link) => {
                    if (link.dropdown) {
                      return (
                        <div key={link.name} className="flex flex-col space-y-2">
                          <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider pl-3">{link.name}</span>
                          {link.dropdown.map(subItem => (
                            <Link
                              key={subItem.name}
                              href={subItem.path}
                              onClick={() => setMobileMenuOpen(false)}
                              className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent transition-all"
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      );
                    }
                    const isActive = pathname === link.path;
                    return (
                      <Link
                        key={link.name}
                        href={link.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`rounded-lg px-3 py-2 text-base font-medium transition-all ${
                          isActive ? 'bg-primary/10 text-primary' : 'hover:bg-accent'
                        }`}
                      >
                        {link.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Profile or Login on Mobile */}
              <div className="pt-6 border-t border-border">
                {user ? (
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center space-x-3">
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user.displayName}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 font-bold text-white">
                          {user.displayName.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-semibold">{user.displayName}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex w-full items-center space-x-2 rounded-lg bg-accent px-3 py-2 text-sm font-medium"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Admin Panel</span>
                      </Link>
                    )}
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex w-full items-center space-x-2 rounded-lg bg-accent px-3 py-2 text-sm font-medium"
                    >
                      <Compass className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="flex w-full items-center space-x-2 rounded-lg bg-red-600/10 text-red-600 px-3 py-2 text-sm font-medium"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center rounded-lg border border-border py-2 text-center text-sm font-medium hover:bg-accent"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center rounded-lg bg-primary py-2 text-center text-sm font-medium text-white hover:bg-violet-700"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
