'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('error');
      return;
    }

    setStatus('loading');
    
    // Simulate contact form submission
    setTimeout(() => {
      setStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1200);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      
      {/* Header section */}
      <div className="text-center sm:text-left space-y-4">
        <h1 className="text-4xl font-bold tracking-tight font-poppins">Get in Touch</h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">
          Have a question about our courses, resource licensing, or gallery submissions? Drop us a line and our moderators will respond.
        </p>
      </div>

      {/* Grid: Details vs Contact Form */}
      <div className="grid gap-8 lg:grid-cols-3">
        
        {/* Contact details cards */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* Email */}
          <div className="rounded-2xl border border-border bg-card p-6 dark:bg-slate-900 shadow-sm flex items-start space-x-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/10 text-primary dark:bg-violet-950/40 shrink-0">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-poppins">Email Support</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">support@dreamline.com</p>
              <p className="text-xs text-slate-400 mt-0.5">Response within 24 hours</p>
            </div>
          </div>

          {/* Phone */}
          <div className="rounded-2xl border border-border bg-card p-6 dark:bg-slate-900 shadow-sm flex items-start space-x-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/10 text-primary dark:bg-indigo-950/40 shrink-0">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-poppins">Call Academy</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">+1 (555) 872-9012</p>
              <p className="text-xs text-slate-400 mt-0.5">Mon - Fri, 9am - 6pm EST</p>
            </div>
          </div>

          {/* Office Address */}
          <div className="rounded-2xl border border-border bg-card p-6 dark:bg-slate-900 shadow-sm flex items-start space-x-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-600/10 text-primary dark:bg-fuchsia-950/40 shrink-0">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-poppins">Studio Office</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                482 Creative Plaza, Suite 900<br />
                San Francisco, CA 94103
              </p>
            </div>
          </div>

        </div>

        {/* Contact Form */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 dark:bg-slate-900 shadow-sm lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold font-poppins">Send a Message</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">Your Name</label>
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">Email Address</label>
                <input
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="How can we help you?"
                className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">Message</label>
              <textarea
                required
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                placeholder="Tell us what you need help with..."
                className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full sm:w-auto rounded-lg bg-linear-to-r from-orange-400 via-yellow-600 to-neutral-950 hover:opacity-90 text-white px-6 py-3 text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Send className="h-4 w-4" />
              {status === 'loading' ? 'Sending Message...' : 'Send Message'}
            </button>

            {status === 'success' && (
              <p className="flex items-center text-xs text-green-600 gap-1 font-semibold justify-center sm:justify-start">
                <CheckCircle2 className="h-4.5 w-4.5" /> Message sent successfully! We will contact you soon.
              </p>
            )}
            {status === 'error' && (
              <p className="flex items-center text-xs text-red-500 gap-1 font-semibold justify-center sm:justify-start">
                <AlertCircle className="h-4.5 w-4.5" /> Something went wrong. Check required fields.
              </p>
            )}

          </form>
        </div>

      </div>

      {/* Office location maps concept */}
      <div className="rounded-2xl border border-border bg-card p-6 dark:bg-slate-900 shadow-sm space-y-4">
        <h3 className="text-lg font-bold font-poppins">Dreamline Location Hub</h3>
        <div className="relative w-full h-80 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-border flex items-center justify-center">
          {/* Symmetrical placeholder card design */}
          <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-600/10 via-slate-100 dark:via-slate-950 to-slate-100 dark:to-slate-950" />
          <div className="relative z-10 text-center space-y-3.5 p-4">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-violet-600 text-white shadow-md">
              <MapPin className="h-5.5 w-5.5" />
            </div>
            <h4 className="font-bold font-poppins text-sm">482 Creative Plaza, San Francisco</h4>
            <p className="text-xs text-muted-foreground max-w-sm">Interactive office maps representation. Come visit us during our creative workshops and meetups.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
