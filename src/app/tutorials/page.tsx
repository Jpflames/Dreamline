'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { 
  getCollection, 
  Tutorial, 
  YouTubeVideo, 
  incrementCounter 
} from '@/lib/db';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Play, 
  ExternalLink, 
  Bookmark, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Filter 
} from 'lucide-react';

function TutorialsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, toggleSaveTutorial, addRecentlyWatched } = useApp();

  // Tab State
  const initialTab = searchParams.get('tab') === 'youtube' ? 'youtube' : 'uploaded';
  const [activeTab, setActiveTab] = useState<'uploaded' | 'youtube'>(initialTab);
  
  // Filtering & Searching State
  const initialCategory = searchParams.get('category') || 'All';
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Data State
  const [uploadedTutorials, setUploadedTutorials] = useState<Tutorial[]>([]);
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeVideo[]>([]);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modals & Active watch
  const [activeWatchTutorial, setActiveWatchTutorial] = useState<Tutorial | null>(null);

  // Sync state with URL params
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'youtube' || tabParam === 'uploaded') {
      setActiveTab(tabParam);
    }
    const catParam = searchParams.get('category');
    if (catParam) {
      setSelectedCategory(catParam);
    }
  }, [searchParams]);

  // Load Data
  useEffect(() => {
    async function loadData() {
      const allTutorials = await getCollection<Tutorial>('tutorials');
      const allYoutube = await getCollection<YouTubeVideo>('youtubeVideos');
      setUploadedTutorials(allTutorials);
      setYoutubeVideos(allYoutube);
    }
    loadData();
  }, []);

  const categories = ['All', 'Photoshop', 'Illustrator', 'Premiere Pro', 'After Effects', 'Canva', 'Figma'];

  // Handle Tab Switch
  const handleTabChange = (tab: 'uploaded' | 'youtube') => {
    setActiveTab(tab);
    setCurrentPage(1);
    const params = new URLSearchParams(window.location.search);
    params.set('tab', tab);
    router.push(`/tutorials?${params.toString()}`);
  };

  // Handle Category Filter
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    const params = new URLSearchParams(window.location.search);
    if (category === 'All') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    router.push(`/tutorials?${params.toString()}`);
  };

  // Filtering Operations
  const filteredUploaded = uploadedTutorials.filter((tut) => {
    const matchesCategory = selectedCategory === 'All' || tut.category === selectedCategory;
    const matchesSearch = tut.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tut.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredYoutube = youtubeVideos.filter((video) => {
    const matchesCategory = selectedCategory === 'All' || video.category === selectedCategory;
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Paginated Slices
  const totalUploadedPages = Math.ceil(filteredUploaded.length / itemsPerPage);
  const totalYoutubePages = Math.ceil(filteredYoutube.length / itemsPerPage);

  const paginatedUploaded = filteredUploaded.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const paginatedYoutube = filteredYoutube.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      
      {/* Header Summary */}
      <div className="space-y-4 text-center sm:text-left mb-10">
        <h1 className="text-4xl font-bold tracking-tight font-poppins">Academy Tutorials</h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">
          Browse our collection of hand-crafted video guides or check out quick tips directly from our YouTube list.
        </p>
      </div>

      {/* Controls: Search, Tabs & Category Pill filters */}
      <div className="space-y-6 bg-card border border-border p-6 rounded-2xl dark:bg-slate-900 shadow-sm">
        
        {/* Search & Tabs row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Tab buttons */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            <button
              onClick={() => handleTabChange('uploaded')}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'uploaded'
                  ? 'bg-white text-primary shadow-sm dark:bg-slate-950 dark:text-white'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Uploaded Tutorials
            </button>
            <button
              onClick={() => handleTabChange('youtube')}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'youtube'
                  ? 'bg-white text-primary shadow-sm dark:bg-slate-950 dark:text-white'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              YouTube Tutorials
            </button>
          </div>

          {/* Search Input bar */}
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tutorials by title, keyword..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm focus:border-primary focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Category Pill Filters list */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-t border-border pt-4 scrollbar-none">
          <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground mr-2">
            <Filter className="h-3.5 w-3.5" />
            <span>Category:</span>
          </div>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === category
                  ? 'bg-primary text-white shadow-sm'
                  : 'border border-border hover:bg-accent'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Content section */}
      <div className="mt-10">
        {activeTab === 'uploaded' ? (
          /* Uploaded Tutorials Grid */
          filteredUploaded.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-3">
              {paginatedUploaded.map((tut) => (
                <motion.div
                  key={tut.id}
                  whileHover={{ y: -6 }}
                  className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card dark:bg-slate-900 shadow-sm transition-all duration-300"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={tut.thumbnail}
                      alt={tut.title}
                      className="h-full w-full object-cover group-hover:scale-102 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => {
                          setActiveWatchTutorial(tut);
                          addRecentlyWatched(tut.id);
                        }}
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white scale-90 group-hover:scale-100 transition-all cursor-pointer"
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
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold font-poppins group-hover:text-primary transition-colors leading-snug line-clamp-1">
                        {tut.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {tut.description}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-border flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Instructor: <span className="font-semibold text-foreground/85">{tut.instructor}</span></span>
                      <button
                        onClick={() => {
                          setActiveWatchTutorial(tut);
                          addRecentlyWatched(tut.id);
                        }}
                        className="text-xs font-semibold text-primary group-hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        Watch now <Play className="h-3 w-3 fill-primary" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-border rounded-3xl">
              <p className="text-muted-foreground text-sm">No uploaded tutorials match your search or filter tags.</p>
            </div>
          )
        ) : (
          /* YouTube Tutorials Grid (Identical Grid dimensions as gallery/uploaded for Symmetrical Balance) */
          filteredYoutube.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {paginatedYoutube.map((video) => (
                <div
                  key={video.id}
                  onClick={() => {
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
          ) : (
            <div className="text-center py-20 border border-dashed border-border rounded-3xl">
              <p className="text-muted-foreground text-sm">No YouTube guides match your search or filter tags.</p>
            </div>
          )
        )}
      </div>

      {/* Pagination Controls */}
      {activeTab === 'uploaded' && totalUploadedPages > 1 && (
        <div className="mt-12 flex items-center justify-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="rounded-xl border border-border p-2 hover:bg-accent disabled:opacity-50 transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          {Array.from({ length: totalUploadedPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`h-10 w-10 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                currentPage === i + 1
                  ? 'bg-primary text-white'
                  : 'border border-border hover:bg-accent'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalUploadedPages))}
            disabled={currentPage === totalUploadedPages}
            className="rounded-xl border border-border p-2 hover:bg-accent disabled:opacity-50 transition-colors cursor-pointer"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {activeTab === 'youtube' && totalYoutubePages > 1 && (
        <div className="mt-12 flex items-center justify-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="rounded-xl border border-border p-2 hover:bg-accent disabled:opacity-50 transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          {Array.from({ length: totalYoutubePages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`h-10 w-10 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                currentPage === i + 1
                  ? 'bg-primary text-white'
                  : 'border border-border hover:bg-accent'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalYoutubePages))}
            disabled={currentPage === totalYoutubePages}
            className="rounded-xl border border-border p-2 hover:bg-accent disabled:opacity-50 transition-colors cursor-pointer"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* WATCH VIDEO LIGHTBOX MODAL */}
      <AnimatePresence>
        {activeWatchTutorial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveWatchTutorial(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
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
                  src={activeWatchTutorial.videoURL}
                  controls
                  autoPlay
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="p-6 bg-slate-900">
                <div className="flex items-center justify-between mb-2">
                  <span className="rounded bg-violet-600/20 text-violet-400 border border-violet-500/20 px-2.5 py-0.5 text-xs font-semibold">
                    {activeWatchTutorial.category}
                  </span>
                  <span className="text-xs text-slate-400">Duration: {activeWatchTutorial.duration}</span>
                </div>
                <h3 className="text-xl font-bold font-poppins text-slate-100">{activeWatchTutorial.title}</h3>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                  {activeWatchTutorial.description}
                </p>
                <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Instructor: <span className="font-semibold text-slate-200">{activeWatchTutorial.instructor}</span></span>
                  <button
                    onClick={() => toggleSaveTutorial(activeWatchTutorial.id)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline cursor-pointer"
                  >
                    <Bookmark className={`h-4 w-4 ${user?.savedTutorials.includes(activeWatchTutorial.id) ? 'fill-primary' : ''}`} />
                    <span>{user?.savedTutorials.includes(activeWatchTutorial.id) ? 'Saved' : 'Bookmark Guide'}</span>
                  </button>
                </div>
              </div>
              <button
                onClick={() => setActiveWatchTutorial(null)}
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

export default function Tutorials() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading tutorials...</div>}>
      <TutorialsContent />
    </Suspense>
  );
}
