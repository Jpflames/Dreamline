'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { getCollection, Resource, incrementCounter } from '@/lib/db';
import { 
  Search, 
  Download, 
  FileText, 
  Sparkles, 
  Clock, 
  ChevronRight, 
  Filter 
} from 'lucide-react';
import { motion } from 'framer-motion';

function ResourcesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, trackDownload } = useApp();

  // Search/Category filters State
  const initialCategory = searchParams.get('category') || 'All';
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Data State
  const [resources, setResources] = useState<Resource[]>([]);

  // Sync state with URL params
  useEffect(() => {
    const catParam = searchParams.get('category');
    if (catParam) {
      setSelectedCategory(catParam);
    }
  }, [searchParams]);

  // Load Data
  useEffect(() => {
    async function loadResources() {
      const allResources = await getCollection<Resource>('resources');
      setResources(allResources);
    }
    loadResources();
  }, []);

  const categories = ['All', 'Fonts', 'Mockups', 'Icons', 'Templates', 'Color Palettes', 'PSD Files'];

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const params = new URLSearchParams(window.location.search);
    if (category === 'All') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    router.push(`/resources?${params.toString()}`);
  };

  // Filter logic
  const filteredResources = resources.filter((res) => {
    const matchesCategory = selectedCategory === 'All' || res.category === selectedCategory;
    const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDownload = async (res: Resource) => {
    // 1. Log to user's history if logged in
    if (user) {
      await trackDownload(res.id);
    }

    // 2. Increment database downloads counter
    await incrementCounter('resources', res.id, 'downloads');

    // 3. Trigger mock file download
    const dummyContent = `Dreamline Premium Resource Asset: ${res.title}\nCategory: ${res.category}\nFile Size: ${res.size}\nThis is a mock asset package download. enjoy!`;
    const blob = new Blob([dummyContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${res.title.toLowerCase().replace(/ /g, '_')}_dreamline.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Refresh UI data
    const allResources = await getCollection<Resource>('resources');
    setResources(allResources);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      
      {/* Header Summary */}
      <div className="text-center sm:text-left mb-10 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight font-poppins">Asset Download Center</h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">
          Speed up your designs and layouts with our free downloadable mockups, icons, vectors, and font weights.
        </p>
      </div>

      {/* Control filters bar */}
      <div className="bg-card border border-border p-5 rounded-2xl dark:bg-slate-900 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        
        {/* Category Pill tags */}
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

        {/* Search input bar */}
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search resources by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-background pl-9 pr-4 py-2 text-sm focus:border-primary focus:outline-none transition-colors"
          />
        </div>

      </div>

      {/* Resources grid */}
      {filteredResources.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredResources.map((res) => (
            <motion.div
              key={res.id}
              whileHover={{ y: -4 }}
              className="group flex flex-col justify-between p-6 rounded-2xl border border-border bg-card dark:bg-slate-900 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="space-y-4">
                {/* Thumbnail/Icon representation */}
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600/10 text-primary dark:bg-violet-950/40">
                    <FileText className="h-5 w-5" />
                  </div>
                  <span className="rounded-lg bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                    {res.category}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold font-poppins line-clamp-1 group-hover:text-primary transition-colors">
                    {res.title}
                  </h3>
                  <div className="flex items-center text-xs text-muted-foreground space-x-3">
                    <span>Size: <span className="font-semibold text-foreground/80">{res.size}</span></span>
                    <span>&bull;</span>
                    <span>Format: <span className="font-semibold text-foreground/80">{res.fileType}</span></span>
                  </div>
                </div>
              </div>

              {/* Download trigger */}
              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {res.downloads} downloads
                </span>
                <button
                  onClick={() => handleDownload(res)}
                  className="rounded-lg bg-primary hover:bg-violet-700 text-white p-2.5 transition-colors shadow-sm flex items-center gap-1.5 text-xs font-semibold px-4 cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
              </div>

            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-border rounded-3xl mt-10">
          <p className="text-muted-foreground text-sm">No downloadable assets found matching your criteria.</p>
        </div>
      )}

    </div>
  );
}

export default function Resources() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading resources...</div>}>
      <ResourcesContent />
    </Suspense>
  );
}
