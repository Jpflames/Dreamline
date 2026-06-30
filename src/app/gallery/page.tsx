'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { 
  getCollection, 
  GalleryItem, 
  incrementCounter 
} from '@/lib/db';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Heart, 
  Share2, 
  Download, 
  X, 
  Eye, 
  Sparkles, 
  Filter 
} from 'lucide-react';

function GalleryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useApp();

  // URL / State syncing
  const initialCategory = searchParams.get('category') || 'All';
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Data State
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [likedItems, setLikedItems] = useState<string[]>([]);
  const [copiedItemId, setCopiedItemId] = useState<string | null>(null);

  // Active Lightbox Modal Item
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  // Load Data
  useEffect(() => {
    async function loadData() {
      const items = await getCollection<GalleryItem>('gallery');
      setGalleryItems(items);

      // Check URL query parameters to auto-open lightbox if specified (deep linking)
      const itemParam = searchParams.get('item');
      if (itemParam) {
        const matchingItem = items.find(i => i.id === itemParam);
        if (matchingItem) {
          setActiveItem(matchingItem);
        }
      }
    }
    loadData();
  }, [searchParams]);

  const categories = ['All', 'Logos', 'Flyers', 'Branding', 'UI Design', 'Posters', 'Social Media', 'Photography'];

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const params = new URLSearchParams(window.location.search);
    if (category === 'All') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    router.push(`/gallery?${params.toString()}`);
  };

  const handleLike = async (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (likedItems.includes(itemId)) return;

    setLikedItems([...likedItems, itemId]);
    await incrementCounter('gallery', itemId, 'likes');
    
    // Sync UI data
    const items = await getCollection<GalleryItem>('gallery');
    setGalleryItems(items);

    if (activeItem && activeItem.id === itemId) {
      setActiveItem({ ...activeItem, likes: activeItem.likes + 1 });
    }
  };

  const handleShare = (item: GalleryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/gallery?item=${item.id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedItemId(item.id);
    setTimeout(() => setCopiedItemId(null), 2000);
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

    // Sync UI data
    const items = await getCollection<GalleryItem>('gallery');
    setGalleryItems(items);

    if (activeItem && activeItem.id === item.id) {
      setActiveItem({ ...activeItem, downloads: activeItem.downloads + 1 });
    }
  };

  // Filter gallery items
  const filteredItems = galleryItems.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.designer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      
      {/* Header section */}
      <div className="text-center sm:text-left mb-10 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight font-poppins">Creative Gallery</h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">
          Explore stunning corporate layouts, poster ideas, typography logos, and creative photography projects uploaded by our members.
        </p>
      </div>

      {/* Control bar */}
      <div className="bg-card border border-border p-5 rounded-2xl dark:bg-slate-900 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        
        {/* Category tags */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground mr-1.5">
            <Filter className="h-3.5 w-3.5" />
            <span>Category:</span>
          </div>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                selectedCategory === category
                  ? 'bg-primary text-white shadow-sm'
                  : 'border border-border hover:bg-accent'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Search Query input */}
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by title or designer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-background pl-9 pr-4 py-2 text-sm focus:border-primary focus:outline-none transition-colors"
          />
        </div>

      </div>

      {/* Gallery masonry/grid */}
      {filteredItems.length > 0 ? (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setActiveItem(item);
                // Update URL parameter without reloading
                const params = new URLSearchParams(window.location.search);
                params.set('item', item.id);
                router.push(`/gallery?${params.toString()}`, { scroll: false });
              }}
              className="group break-inside-avoid relative overflow-hidden rounded-2xl border border-border bg-card dark:bg-slate-900 cursor-pointer shadow-sm glow-card"
            >
              <img
                src={item.imageURL}
                alt={item.title}
                className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-500"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="rounded bg-primary/95 px-2 py-0.5 text-[10px] sm:text-xs text-white">
                    {item.category}
                  </span>
                  <span className="text-xs text-slate-300">@{item.designer}</span>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-bold font-poppins text-white leading-tight">{item.title}</h4>
                  <div className="flex items-center justify-between text-white border-t border-white/20 pt-2">
                    <button
                      onClick={(e) => handleLike(item.id, e)}
                      className={`flex items-center gap-1 text-xs hover:text-red-400 transition-colors ${
                        likedItems.includes(item.id) ? 'text-red-500' : ''
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${likedItems.includes(item.id) ? 'fill-red-500' : ''}`} />
                      <span>{item.likes}</span>
                    </button>
                    <div className="flex items-center space-x-2.5">
                      <button
                        onClick={(e) => handleShare(item, e)}
                        className="hover:text-primary transition-colors text-xs flex items-center gap-1"
                      >
                        <Share2 className="h-4 w-4" />
                        <span>{copiedItemId === item.id ? 'Copied' : ''}</span>
                      </button>
                      {item.downloadAllowed && (
                        <button
                          onClick={(e) => handleDownload(item, e)}
                          className="hover:text-primary transition-colors"
                          title="Download Image"
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
      ) : (
        <div className="text-center py-20 border border-dashed border-border rounded-3xl mt-10">
          <p className="text-muted-foreground text-sm">No creative showcases found matching your filters.</p>
        </div>
      )}

      {/* DETAILED LIGHTBOX MODAL */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setActiveItem(null);
              // Clean URL query parameter
              const params = new URLSearchParams(window.location.search);
              params.delete('item');
              router.push(`/gallery?${params.toString()}`, { scroll: false });
            }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 text-white shadow-2xl"
            >
              {/* Image box */}
              <div className="relative aspect-video max-h-[70vh] bg-black">
                <img
                  src={activeItem.imageURL}
                  alt={activeItem.title}
                  className="h-full w-full object-contain"
                />
              </div>

              {/* Detail controls block */}
              <div className="p-6 bg-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="rounded bg-violet-600/20 text-violet-400 border border-violet-500/20 px-2.5 py-0.5 text-xs font-semibold">
                      {activeItem.category}
                    </span>
                    <span className="text-xs text-slate-400">Published: {new Date(activeItem.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-poppins text-slate-100">{activeItem.title}</h3>
                  <p className="text-sm text-slate-400">
                    Created by: <span className="font-semibold text-slate-200">@{activeItem.designer}</span>
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Like */}
                  <button
                    onClick={(e) => handleLike(activeItem.id, e)}
                    className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors cursor-pointer ${
                      likedItems.includes(activeItem.id)
                        ? 'bg-red-500/10 text-red-500 border border-red-500/30'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-transparent'
                    }`}
                  >
                    <Heart className={`h-4.5 w-4.5 ${likedItems.includes(activeItem.id) ? 'fill-red-500' : ''}`} />
                    <span>{activeItem.likes} Likes</span>
                  </button>

                  {/* Share link copy */}
                  <button
                    onClick={(e) => handleShare(activeItem, e)}
                    className="flex items-center gap-1.5 rounded-xl bg-slate-800 border border-transparent px-4 py-2.5 text-sm font-semibold text-slate-200 hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    <Share2 className="h-4.5 w-4.5" />
                    <span>{copiedItemId === activeItem.id ? 'Copied' : 'Share'}</span>
                  </button>

                  {/* Download */}
                  {activeItem.downloadAllowed ? (
                    <button
                      onClick={(e) => handleDownload(activeItem, e)}
                      className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 transition-colors cursor-pointer"
                    >
                      <Download className="h-4.5 w-4.5" />
                      <span>Download</span>
                    </button>
                  ) : (
                    <span className="text-xs text-slate-500 italic bg-slate-850 px-3 py-2.5 rounded-xl">
                      Download Restricted
                    </span>
                  )}
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => {
                  setActiveItem(null);
                  const params = new URLSearchParams(window.location.search);
                  params.delete('item');
                  router.push(`/gallery?${params.toString()}`, { scroll: false });
                }}
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

export default function Gallery() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading gallery...</div>}>
      <GalleryContent />
    </Suspense>
  );
}
