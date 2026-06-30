'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { 
  getCollection, 
  Tutorial, 
  GalleryItem, 
  YouTubeVideo, 
  Course, 
  incrementCounter 
} from '@/lib/db';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Download, 
  Heart, 
  Share2, 
  ArrowRight, 
  BookOpen, 
  Trophy, 
  Sparkles, 
  Eye, 
  ExternalLink 
} from 'lucide-react';

export default function Home() {
  const { user, enrollInCourse, toggleSaveTutorial, addRecentlyWatched } = useApp();
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeVideo[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  // Modals & Interactivity State
  const [activeLightboxImage, setActiveLightboxImage] = useState<GalleryItem | null>(null);
  const [activeWatchVideo, setActiveWatchVideo] = useState<Tutorial | null>(null);
  const [likedGalleryItems, setLikedGalleryItems] = useState<string[]>([]);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Fetch Homepage Content
  useEffect(() => {
    async function loadData() {
      const allTutorials = await getCollection<Tutorial>('tutorials');
      const allGallery = await getCollection<GalleryItem>('gallery');
      const allYoutube = await getCollection<YouTubeVideo>('youtubeVideos');
      const allCourses = await getCollection<Course>('courses');

      // Filter featured or limit for homepage dashboard aesthetics
      setTutorials(allTutorials.filter(t => t.featured).slice(0, 3));
      setGallery(allGallery.slice(0, 8)); // Exactly 8 items for a 4x2 grid
      setYoutubeVideos(allYoutube.slice(0, 8)); // Exactly 8 items for a matching 4x2 grid
      setCourses(allCourses.filter(c => c.featured).slice(0, 3));
    }
    loadData();
  }, []);

  const handleLike = async (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (likedGalleryItems.includes(itemId)) return;
    
    // Add local visual like
    setLikedGalleryItems([...likedGalleryItems, itemId]);
    await incrementCounter('gallery', itemId, 'likes');
    
    // Refresh list
    const allGallery = await getCollection<GalleryItem>('gallery');
    setGallery(allGallery.slice(0, 8));
  };

  const handleShare = (item: GalleryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/gallery?item=${item.id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(item.id);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const handleDownload = async (item: GalleryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.downloadAllowed) return;
    await incrementCounter('gallery', item.id, 'downloads');
    
    // Simulate File Download
    const link = document.createElement('a');
    link.href = item.imageURL;
    link.download = `${item.title.toLowerCase().replace(/ /g, '_')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Refresh data
    const allGallery = await getCollection<GalleryItem>('gallery');
    setGallery(allGallery.slice(0, 8));
  };

  return (
    <div className="w-full pb-20">
      
      {/* 1. Cinematic Hero Section */}
      <section className="relative w-full h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/bg 2.mp4" type="video/mp4" />
        </video>
        {/* Black Shade Overlay */}
        <div className="absolute inset-0 z-0 bg-black/70" />

        <div className="relative z-10 max-w-5xl px-4 text-center sm:px-6 lg:px-8 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 rounded-full border border-violet-500/30 bg-violet-950/40 px-3.5 py-1 text-xs sm:text-sm font-semibold text-violet-300 backdrop-blur-md"
          >
            <Sparkles className="h-4 w-4" />
            <span>Now Launching: Dreamline Creative Academy</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-5xl sm:text-7xl font-bold tracking-tight font-poppins text-white leading-none"
          >
            Learn. Create. <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Inspire.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mx-auto max-w-2xl text-lg sm:text-xl text-slate-300 font-inter leading-relaxed"
          >
            Master graphic design, motion graphics, branding, photography and video editing through practical tutorials and real-world projects.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              href="/tutorials"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-orange-400 via-yellow-600 to-neutral-950 px-8 py-4 text-base font-semibold text-white hover:opacity-90 transition-all shadow-lg"
            >
              Explore Tutorials
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/gallery"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/40 px-8 py-4 text-base font-semibold text-slate-300 hover:bg-slate-800 transition-all backdrop-blur-md"
            >
              Browse Gallery
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. Featured Tutorials Section */}
      <section className="max-w-7xl mx-auto px-4 mt-20 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between border-b border-border pb-5 mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight font-poppins">Featured Tutorials</h2>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">Boost your creative skills with our latest uploaded premium guides.</p>
          </div>
          <Link href="/tutorials" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {tutorials.map((tut) => (
            <motion.div
              key={tut.id}
              whileHover={{ y: -6 }}
              className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm dark:bg-slate-900 transition-all duration-300"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={tut.thumbnail}
                  alt={tut.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => {
                      setActiveWatchVideo(tut);
                      addRecentlyWatched(tut.id);
                    }}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-r from-orange-400 via-yellow-600 to-neutral-950 text-white scale-90 group-hover:scale-100 hover:opacity-90 transition-all cursor-pointer"
                  >
                    <Play className="h-6 w-6 fill-white" />
                  </button>
                </div>
                <span className="absolute bottom-3 left-3 rounded-lg bg-black/70 px-2.5 py-1 text-xs font-semibold text-white">
                  {tut.category}
                </span>
                <span className="absolute bottom-3 right-3 rounded-lg bg-black/70 px-2 py-0.5 text-xs text-slate-200">
                  {tut.duration}
                </span>
              </div>
              <div className="p-5 space-y-3">
                <h3 className="text-lg font-bold font-poppins group-hover:text-primary transition-colors line-clamp-1">
                  {tut.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {tut.description}
                </p>
                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Instructor: <span className="font-semibold text-foreground/80">{tut.instructor}</span></span>
                  <button
                    onClick={() => {
                      setActiveWatchVideo(tut);
                      addRecentlyWatched(tut.id);
                    }}
                    className="text-xs font-semibold text-primary group-hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    Watch Now <Play className="h-3 w-3 fill-primary" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. Creative Gallery Section (uniform grid layout □ □ □ □) */}
      <section className="max-w-7xl mx-auto px-4 mt-24 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between border-b border-border pb-5 mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight font-poppins">Creative Gallery</h2>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">Inspiring design concepts, branding flyers, layouts, and poster artwork.</p>
          </div>
          <Link href="/gallery" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            Explore Gallery <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* 4x2 uniform grid layout */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {gallery.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveLightboxImage(item)}
              className="group relative symmetric-aspect overflow-hidden rounded-2xl border border-border bg-card dark:bg-slate-900 cursor-pointer shadow-sm glow-card"
            >
              <img
                src={item.imageURL}
                alt={item.title}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="rounded bg-primary/80 px-2 py-0.5 text-xs text-white">
                    {item.category}
                  </span>
                  <span className="text-xs text-slate-300">@{item.designer}</span>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-bold font-poppins text-white line-clamp-1">{item.title}</h4>
                  <div className="flex items-center justify-between text-white border-t border-white/20 pt-2">
                    <button
                      onClick={(e) => handleLike(item.id, e)}
                      className={`flex items-center gap-1 text-xs hover:text-red-400 transition-colors ${
                        likedGalleryItems.includes(item.id) ? 'text-red-500' : ''
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${likedGalleryItems.includes(item.id) ? 'fill-red-500' : ''}`} />
                      <span>{item.likes}</span>
                    </button>
                    <div className="flex items-center space-x-2.5">
                      <button
                        onClick={(e) => handleShare(item, e)}
                        className="hover:text-primary transition-colors text-xs flex items-center gap-1"
                        title="Copy Link"
                      >
                        <Share2 className="h-4 w-4" />
                        <span>{copiedLink === item.id ? 'Copied' : ''}</span>
                      </button>
                      {item.downloadAllowed && (
                        <button
                          onClick={(e) => handleDownload(item, e)}
                          className="hover:text-primary transition-colors"
                          title="Download Design"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. YouTube Video Gallery (Symmetric format below gallery) */}
      <section className="max-w-7xl mx-auto px-4 mt-20 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between border-b border-border pb-5 mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight font-poppins">YouTube Tutorials</h2>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">Embedded quick learning guides. Structured symmetrically to match the design grid above.</p>
          </div>
          <Link href="/tutorials?tab=youtube" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            View Youtube Grid <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* 4x2 uniform grid layout - identical sizing to design grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {youtubeVideos.map((video) => (
            <div
              key={video.id}
              onClick={() => {
                // Open YouTube link in new tab or mock modal player
                window.open(video.youtubeURL, '_blank');
              }}
              className="group relative symmetric-aspect overflow-hidden rounded-2xl border border-border bg-card dark:bg-slate-900 cursor-pointer shadow-sm glow-card"
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-600 text-white shadow-md group-hover:scale-110 transition-transform">
                  <Play className="h-5 w-5 fill-white" />
                </div>
              </div>
              {/* Symmetrical Hover Overlay Details */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="rounded bg-red-600 px-2 py-0.5 text-xs text-white font-semibold">
                    YouTube
                  </span>
                  <span className="text-xs text-slate-300">{video.category}</span>
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold font-poppins text-white line-clamp-2 leading-snug">{video.title}</h4>
                  <p className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1">
                    Watch on YouTube <ExternalLink className="h-3 w-3" />
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Featured Courses Section */}
      <section className="max-w-7xl mx-auto px-4 mt-24 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between border-b border-border pb-5 mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight font-poppins">Structured Courses</h2>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">Comprehensive paths to take you from a design beginner to a seasoned professional.</p>
          </div>
          <Link href="/courses" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            View All Courses <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {courses.map((course) => {
            const isEnrolled = user?.enrolledCourses.includes(course.id);
            const progress = user?.courseProgress[course.id] || 0;

            return (
              <div
                key={course.id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card dark:bg-slate-900 transition-all duration-300 hover:shadow-md"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="h-full w-full object-cover group-hover:scale-102 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 rounded-lg bg-black/70 px-2.5 py-1 text-xs font-semibold text-white">
                      {course.difficulty}
                    </div>
                    <div className="absolute top-3 right-3 rounded-lg bg-black/70 px-2.5 py-1 text-xs font-semibold text-white">
                      {course.lessons.length} Lessons
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    <h3 className="text-lg font-bold font-poppins group-hover:text-primary transition-colors leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {course.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  {/* Progress tracker if enrolled */}
                  {isEnrolled ? (
                    <div className="mb-4 space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span>Course Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-violet-600 transition-all duration-500" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  ) : null}

                  <div className="flex items-center gap-3">
                    <Link
                      href={`/courses/${course.id}`}
                      className="flex-1 text-center rounded-xl border border-border py-3 text-sm font-semibold hover:bg-accent transition-colors"
                    >
                      View Details
                    </Link>
                    {isEnrolled ? (
                      <Link
                        href={`/courses/${course.id}`}
                        className="flex-1 text-center rounded-xl bg-violet-600/10 text-violet-600 py-3 text-sm font-semibold hover:bg-violet-600/20 transition-colors"
                      >
                        Continue Learning
                      </Link>
                    ) : (
                      <button
                        onClick={() => {
                          if (user) {
                            enrollInCourse(course.id);
                          } else {
                            // Prompt login
                            window.location.href = '/login';
                          }
                        }}
                        className="flex-1 text-center rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-violet-700 transition-colors cursor-pointer"
                      >
                        Enroll Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Resources Highlights & Community Challenges */}
      <section className="max-w-7xl mx-auto px-4 mt-24 sm:px-6 lg:px-8 grid gap-8 md:grid-cols-2">
        {/* Weekly Challenges Showcase */}
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 dark:bg-slate-900 flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-violet-500/5 blur-[50px]" />
          <div className="space-y-4 relative z-10">
            <div className="inline-flex items-center space-x-1.5 rounded-lg bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-600 dark:text-violet-400">
              <Trophy className="h-3.5 w-3.5" />
              <span>Weekly Creative Challenge</span>
            </div>
            <h3 className="text-2xl font-bold font-poppins">Space Tourism Brand Identity</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Create a modern vector branding package for a lunar transport startup called Orion. Put your layouts, grids, logos, or posters into the Gallery for community reviews.
            </p>
          </div>
          <div className="mt-8 relative z-10 flex items-center justify-between border-t border-border pt-4">
            <span className="text-xs text-muted-foreground">Ends in <span className="font-bold text-foreground/80">3 days</span></span>
            <Link href="/community" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
              Submit Design <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Resources Highlight */}
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 dark:bg-slate-900 flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-indigo-500/5 blur-[50px]" />
          <div className="space-y-4 relative z-10">
            <div className="inline-flex items-center space-x-1.5 rounded-lg bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Asset Download Center</span>
            </div>
            <h3 className="text-2xl font-bold font-poppins">Fonts, Mockups, Icons, and Templates</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Accelerate your editing, branding, and layouts with ready-to-use premium resources. Layered Photoshop assets, Figma template grids, vector packs, and custom font weights.
            </p>
          </div>
          <div className="mt-8 relative z-10 flex items-center justify-between border-t border-border pt-4">
            <span className="text-xs text-muted-foreground">Free Downloads</span>
            <Link href="/resources" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
              Download Assets <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {activeLightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveLightboxImage(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 text-white"
            >
              <div className="relative aspect-video max-h-[70vh] bg-black">
                <img
                  src={activeLightboxImage.imageURL}
                  alt={activeLightboxImage.title}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="p-6 bg-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold font-poppins">{activeLightboxImage.title}</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Designer: @{activeLightboxImage.designer} &bull; Category: {activeLightboxImage.category}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={(e) => handleLike(activeLightboxImage.id, e)}
                    className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-4 py-2 text-sm hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                    <span>{activeLightboxImage.likes} Likes</span>
                  </button>
                  {activeLightboxImage.downloadAllowed && (
                    <button
                      onClick={(e) => handleDownload(activeLightboxImage, e)}
                      className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm hover:bg-violet-700 transition-colors cursor-pointer"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </button>
                  )}
                </div>
              </div>
              <button
                onClick={() => setActiveLightboxImage(null)}
                className="absolute top-4 right-4 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WATCH VIDEO MODAL */}
      <AnimatePresence>
        {activeWatchVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveWatchVideo(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 text-white"
            >
              <div className="relative aspect-video bg-black">
                <video
                  src={activeWatchVideo.videoURL}
                  controls
                  autoPlay
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="p-6 bg-slate-900">
                <div className="flex items-center justify-between mb-2">
                  <span className="rounded bg-violet-600/20 text-violet-400 border border-violet-500/20 px-2.5 py-0.5 text-xs font-semibold">
                    {activeWatchVideo.category}
                  </span>
                  <span className="text-xs text-slate-400">Duration: {activeWatchVideo.duration}</span>
                </div>
                <h3 className="text-xl font-bold font-poppins">{activeWatchVideo.title}</h3>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                  {activeWatchVideo.description}
                </p>
                <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Instructor: <span className="font-semibold text-slate-200">{activeWatchVideo.instructor}</span></span>
                  <button
                    onClick={() => toggleSaveTutorial(activeWatchVideo.id)}
                    className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                  >
                    {user?.savedTutorials.includes(activeWatchVideo.id) ? 'Saved' : 'Bookmark Guide'}
                  </button>
                </div>
              </div>
              <button
                onClick={() => setActiveWatchVideo(null)}
                className="absolute top-4 right-4 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
