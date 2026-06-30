'use client';

import React, { useState, useEffect } from 'react';
import { getCollection, CommunityPost, addItem } from '@/lib/db';
import { useApp } from '@/context/AppContext';
import { 
  Megaphone, 
  Trophy, 
  Users, 
  Calendar, 
  Send, 
  ExternalLink,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Community() {
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState<'announcements' | 'challenges' | 'members'>('announcements');
  const [posts, setPosts] = useState<CommunityPost[]>([]);

  // Challenge Submission concepts
  const [challengeTitle, setChallengeTitle] = useState('');
  const [challengeLink, setChallengeLink] = useState('');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    async function loadPosts() {
      const allPosts = await getCollection<CommunityPost>('communityPosts');
      setPosts(allPosts);
    }
    loadPosts();
  }, []);

  const filteredPosts = posts.filter(post => {
    if (activeTab === 'announcements') return post.type === 'announcement';
    if (activeTab === 'challenges') return post.type === 'challenge';
    if (activeTab === 'members') return post.type === 'member';
    return false;
  });

  const handleChallengeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      window.location.href = '/login';
      return;
    }
    if (!challengeTitle || !challengeLink) {
      setSubmitStatus('error');
      return;
    }

    try {
      // Simulate adding a user submission to the community logs or gallery review
      await addItem('communityPosts', {
        type: 'member',
        title: `Challenge Submission: ${challengeTitle}`,
        content: `Community user @${user.displayName} has submitted an entry link for the active Space challenge: ${challengeLink}`,
        author: user.displayName,
        authorTitle: 'Academy Member',
        createdAt: new Date().toISOString()
      });
      
      setSubmitStatus('success');
      setChallengeTitle('');
      setChallengeLink('');
      setTimeout(() => setSubmitStatus('idle'), 3000);

      // Reload
      const allPosts = await getCollection<CommunityPost>('communityPosts');
      setPosts(allPosts);
    } catch (err) {
      setSubmitStatus('error');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      
      {/* Header section */}
      <div className="text-center sm:text-left space-y-4">
        <h1 className="text-4xl font-bold tracking-tight font-poppins">Dreamline Community</h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">
          Connect with designers, take part in design challenges, view member showcases, and read official updates.
        </p>
      </div>

      {/* Tab controls */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('announcements')}
          className={`flex items-center gap-2 border-b-2 py-4 px-6 text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'announcements'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Megaphone className="h-4.5 w-4.5" />
          Announcements
        </button>
        <button
          onClick={() => setActiveTab('challenges')}
          className={`flex items-center gap-2 border-b-2 py-4 px-6 text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'challenges'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Trophy className="h-4.5 w-4.5" />
          Creative Challenges
        </button>
        <button
          onClick={() => setActiveTab('members')}
          className={`flex items-center gap-2 border-b-2 py-4 px-6 text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'members'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Users className="h-4.5 w-4.5" />
          Featured Members
        </button>
      </div>

      {/* Tab Contents Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        
        {/* Main Feed Column */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    className="group rounded-2xl border border-border bg-card p-6 sm:p-8 dark:bg-slate-900 shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-md"
                  >
                    <div className="space-y-4">
                      {/* Post Meta */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5 font-semibold text-foreground/80">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                        <span>Author: <span className="font-semibold text-foreground/80">{post.author}</span> ({post.authorTitle})</span>
                      </div>

                      {/* Header Title */}
                      <h3 className="text-xl sm:text-2xl font-bold font-poppins group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>

                      {/* Cover image if available */}
                      {post.imageURL && (
                        <div className="relative aspect-video rounded-xl overflow-hidden border border-border">
                          <img
                            src={post.imageURL}
                            alt={post.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}

                      {/* Paragraph content */}
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        {post.content}
                      </p>

                      {/* Link Action details */}
                      {post.linkURL && post.linkText && (
                        <div className="pt-2">
                          <a
                            href={post.linkURL}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 border border-primary/20 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/20 transition-all"
                          >
                            {post.linkText}
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 border border-dashed border-border rounded-3xl">
                  <p className="text-muted-foreground text-sm">No community logs posted in this category yet.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sidebar Concepts Column */}
        <div className="space-y-6">
          
          {/* Active Creative Challenge Submission form */}
          {activeTab === 'challenges' && (
            <div className="rounded-2xl border border-border bg-card p-6 dark:bg-slate-900 shadow-sm space-y-4">
              <h3 className="text-lg font-bold font-poppins flex items-center gap-1.5">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Submit Challenge Entry
              </h3>
              
              <p className="text-xs text-muted-foreground leading-relaxed">
                Working on the "Space Tourism branding" challenge? Submit your Figma prototype URL or gallery image title to join the leaderboard!
              </p>

              <form onSubmit={handleChallengeSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">Artwork Title</label>
                  <input
                    type="text"
                    required
                    value={challengeTitle}
                    onChange={(e) => setChallengeTitle(e.target.value)}
                    placeholder="e.g. Orion Travels Branding Logo"
                    className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">Artwork Link / URL</label>
                  <input
                    type="url"
                    required
                    value={challengeLink}
                    onChange={(e) => setChallengeLink(e.target.value)}
                    placeholder="e.g. https://figma.com/file/..."
                    className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-violet-700 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                  Submit Entry
                </button>

                {submitStatus === 'success' && (
                  <p className="text-xs text-green-600 text-center font-medium">Entry logged successfully!</p>
                )}
                {submitStatus === 'error' && (
                  <p className="text-xs text-red-500 text-center font-medium">Failed to submit entry. Check inputs.</p>
                )}
              </form>
            </div>
          )}

          {/* Slogans / Leaderboard info */}
          <div className="rounded-2xl border border-border bg-card p-6 dark:bg-slate-900 shadow-sm space-y-4">
            <h3 className="text-lg font-bold font-poppins flex items-center gap-1.5">
              <Sparkles className="h-5 w-5 text-indigo-500" />
              Community Guidelines
            </h3>
            <ul className="text-xs text-muted-foreground space-y-2.5 list-disc pl-4 leading-relaxed">
              <li>Be supportive: Provide constructive feedback to other members' designs.</li>
              <li>No plagiarism: Only upload gallery assets and challenge items that you created.</li>
              <li>Respect copyrights: List references for font files or vector packages if utilized.</li>
              <li>Collaborate: Join discussion channels on our Discord academy space.</li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
}
