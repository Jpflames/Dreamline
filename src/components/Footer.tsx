'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { addItem } from '@/lib/db';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Github, 
  Send, 
  CheckCircle 
} from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Hide Footer on auth pages
  const isAuthPage = pathname === '/login' || pathname === '/register';
  if (isAuthPage) return null;

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      return;
    }

    setStatus('loading');
    try {
      await addItem('newsletter', {
        email,
        subscribedAt: new Date().toISOString()
      });
      setStatus('success');
      setEmail('');
    } catch (err) {
      console.error('Newsletter subscription error:', err);
      setStatus('error');
    }
  };

  const footerLinks = [
    {
      title: 'Tutorials',
      links: [
        { name: 'Photoshop', path: '/tutorials?category=Photoshop' },
        { name: 'Illustrator', path: '/tutorials?category=Illustrator' },
        { name: 'Premiere Pro', path: '/tutorials?category=Premiere' },
        { name: 'After Effects', path: '/tutorials?category=AfterEffects' },
      ],
    },
    {
      title: 'Courses',
      links: [
        { name: 'Graphic Design Foundations', path: '/courses' },
        { name: 'Premiere Video Lab', path: '/courses' },
        { name: 'After Effects Masterclass', path: '/courses' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Download Fonts', path: '/resources?category=Fonts' },
        { name: 'Device Mockups', path: '/resources?category=Mockups' },
        { name: 'UI Figma Templates', path: '/resources?category=Templates' },
        { name: 'Premium PSD Layers', path: '/resources?category=PSD' },
      ],
    },
    {
      title: 'Community',
      links: [
        { name: 'Announcements', path: '/community' },
        { name: 'Weekly Challenges', path: '/community' },
        { name: 'Featured Members', path: '/community' },
      ],
    },
  ];

  return (
    <footer className="w-full border-t border-border bg-slate-50 dark:bg-slate-950/80 transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          
          {/* Logo & Info */}
          <div className="space-y-6 xl:col-span-1">
            <Link href="/" className="flex items-center">
              <img src="/Dreamline-media-Logob.png" alt="Dreamline Logo" className="h-10 w-auto" />
            </Link>
            <p className="text-sm text-muted-foreground max-w-md">
              Learn creative design, branding, illustration, editing, and animation directly from experts. Master the tools and build a professional portfolio.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links and Newsletter */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0 lg:grid-cols-3">
            
            {/* Split Link lists */}
            <div className="col-span-2 grid grid-cols-2 gap-8 lg:col-span-2">
              {footerLinks.map((group) => (
                <div key={group.title}>
                  <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground/80 dark:text-slate-200">
                    {group.title}
                  </h3>
                  <ul className="mt-4 space-y-2">
                    {group.links.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.path}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Newsletter Subscription */}
            <div className="col-span-2 mt-8 lg:col-span-1 lg:mt-0">
              <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground/80 dark:text-slate-200">
                Join the Newsletter
              </h3>
              <p className="mt-4 text-sm text-muted-foreground">
                Get weekly updates on resources, tutorials, vector assets, and student spotlights.
              </p>
              <form className="mt-4 sm:flex sm:max-w-md lg:block" onSubmit={handleSubscribe}>
                <div className="relative flex-1">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 pr-10 text-sm focus:border-primary focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 flex items-center justify-center rounded-md bg-primary px-3 text-white hover:bg-violet-700 transition-colors cursor-pointer"
                    disabled={status === 'loading'}
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
                {status === 'success' && (
                  <p className="mt-2 flex items-center text-xs text-green-600 gap-1">
                    <CheckCircle className="h-3 w-3" /> Subscribed successfully!
                  </p>
                )}
                {status === 'error' && (
                  <p className="mt-2 text-xs text-red-500">
                    Please enter a valid email address.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="mt-12 border-t border-border/60 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Dreamline Inc. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link href="/about" className="text-xs text-muted-foreground hover:text-primary">About</Link>
            <Link href="/contact" className="text-xs text-muted-foreground hover:text-primary">Contact</Link>
            <a href="#" className="text-xs text-muted-foreground hover:text-primary">Privacy Policy</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-primary">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
