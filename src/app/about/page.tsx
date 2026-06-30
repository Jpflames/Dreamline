'use client';

import React from 'react';
import { Target, Eye, Shield, Users, Trophy, Compass } from 'lucide-react';
import { motion } from 'framer-motion';

export default function About() {
  const teamMembers = [
    {
      name: 'Alex Mercer',
      role: 'Founder & Photoshop Expert',
      image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=60',
      bio: '10+ years of digital artistry. Created branding campaigns for fortune 500 agencies.'
    },
    {
      name: 'Sarah Jenkins',
      role: 'Branding Coordinator & Illustrator',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=60',
      bio: 'Vector geometry specialist. Passionate about typography systems and grid systems.'
    },
    {
      name: 'Marcus Cole',
      role: 'Cinematographer & Video Producer',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=60',
      bio: 'Visual composer. Expert in dynamic Premiere cuts and advanced Lumetri grading.'
    },
    {
      name: 'Elena Rostova',
      role: 'Motion Designer & Animator',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=60',
      bio: 'Particles and Expressions wizard. Bringing complex vector storyboards to life.'
    }
  ];

  const coreValues = [
    {
      title: 'Practical Education',
      desc: 'No fluff. We focus on real-world workflow tutorials, files, and project roadmap milestones.',
      icon: Target
    },
    {
      title: 'Design Excellence',
      desc: 'We advocate for premium aesthetics, layout ratios, auto layouts, and design detail precision.',
      icon: Shield
    },
    {
      title: 'Community Collaboration',
      desc: 'Creatives grow best together. We support open asset downloading, feedback, and weekly challenges.',
      icon: Users
    }
  ];

  return (
    <div className="w-full space-y-24 py-12">
      
      {/* 1. Brand Intro Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl font-bold font-poppins text-gradient-purple">Our Story</h1>
        <p className="mx-auto max-w-3xl text-base sm:text-lg text-muted-foreground leading-relaxed">
          Dreamline was founded in 2026 as a premier design hub. We realized that traditional creative courses are often too theoretical, expensive, and disconnected from the day-to-day work files. We built Dreamline to provide zero-friction practical training, open resource downloads, and visual showcase galleries for creators.
        </p>
      </section>

      {/* 2. Mission & Vision */}
      <section className="w-full bg-slate-50 dark:bg-slate-950/40 py-16 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-8 md:grid-cols-2">
          
          {/* Mission */}
          <div className="rounded-2xl border border-border bg-card p-8 dark:bg-slate-900 shadow-sm flex items-start space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600/10 text-primary dark:bg-violet-950/40 shrink-0">
              <Trophy className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold font-poppins">Our Mission</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                To democratize professional creative education. We empower aspiring designers, photographers, and video editors worldwide to master core software tools, access high-quality templates, and launch successful careers.
              </p>
            </div>
          </div>

          {/* Vision */}
          <div className="rounded-2xl border border-border bg-card p-8 dark:bg-slate-900 shadow-sm flex items-start space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/10 text-primary dark:bg-indigo-950/40 shrink-0">
              <Compass className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold font-poppins">Our Vision</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                To build the largest connected creative workspace. A platform where active studying, asset sharing, peer reviews, and showcase publishing happen seamlessly under a single educational ecosystem.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold font-poppins">Our Core Values</h2>
          <p className="text-muted-foreground text-sm">The principles guiding our curriculum and community growth.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {coreValues.map((val) => {
            const Icon = val.icon;
            return (
              <div
                key={val.title}
                className="text-center p-6 rounded-2xl border border-border bg-card dark:bg-slate-900 shadow-sm space-y-4"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600/10 text-primary dark:bg-violet-950/40">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold font-poppins">{val.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {val.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Meet the Team */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-10">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold font-poppins">Meet the Team</h2>
          <p className="text-muted-foreground text-sm">The software experts, designers, and curators behind Dreamline.</p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((member) => (
            <motion.div
              key={member.name}
              whileHover={{ y: -4 }}
              className="group overflow-hidden rounded-2xl border border-border bg-card dark:bg-slate-900 shadow-sm transition-all duration-300 text-center"
            >
              <div className="p-6 space-y-4">
                <img
                  src={member.image}
                  alt={member.name}
                  className="mx-auto h-24 w-24 rounded-full object-cover border-2 border-primary/20 group-hover:border-primary transition-colors"
                />
                <div className="space-y-1">
                  <h3 className="text-lg font-bold font-poppins">{member.name}</h3>
                  <p className="text-xs font-semibold text-primary">{member.role}</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {member.bio}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
}
