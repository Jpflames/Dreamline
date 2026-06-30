'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { 
  getCollection, 
  addItem, 
  deleteItem, 
  Tutorial, 
  GalleryItem, 
  YouTubeVideo, 
  Course, 
  Resource,
  UserProfile
} from '@/lib/db';
import { 
  Plus, 
  Trash2, 
  LayoutDashboard, 
  Play, 
  Image as ImageIcon, 
  Youtube, 
  BookOpen, 
  FileDown, 
  Mail, 
  Eye, 
  Users, 
  Check, 
  AlertCircle,
  FilePlus,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading } = useApp();

  // Redirect non-admins
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'admin') {
        router.push('/dashboard');
      }
    }
  }, [user, loading, router]);

  // Tab State
  const [activeTab, setActiveTab] = useState<'analytics' | 'tutorials' | 'youtube' | 'gallery' | 'resources' | 'courses' | 'newsletter'>('analytics');

  // Datasets State
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeVideo[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [newsletter, setNewsletter] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<UserProfile[]>([]);

  // Form states
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // 1. Tutorial Form
  const [tutTitle, setTutTitle] = useState('');
  const [tutDesc, setTutDesc] = useState('');
  const [tutThumb, setTutThumb] = useState('');
  const [tutVideo, setTutVideo] = useState('');
  const [tutCat, setTutCat] = useState<'Photoshop' | 'Illustrator' | 'Premiere Pro' | 'After Effects' | 'Canva' | 'Figma'>('Photoshop');
  const [tutDuration, setTutDuration] = useState('');
  const [tutInstructor, setTutInstructor] = useState('');

  // 2. YouTube Form
  const [ytTitle, setYtTitle] = useState('');
  const [ytURL, setYtURL] = useState('');
  const [ytThumb, setYtThumb] = useState('');
  const [ytCat, setYtCat] = useState('Photoshop');

  // 3. Gallery Form
  const [galTitle, setGalTitle] = useState('');
  const [galImage, setGalImage] = useState('');
  const [galCat, setGalCat] = useState<'Logos' | 'Flyers' | 'Branding' | 'UI Design' | 'Posters' | 'Social Media' | 'Photography'>('Branding');
  const [galDesigner, setGalDesigner] = useState('');
  const [galDownloadAllowed, setGalDownloadAllowed] = useState(true);

  // 4. Resource Form
  const [resTitle, setResTitle] = useState('');
  const [resCat, setResCat] = useState<'Fonts' | 'Mockups' | 'Icons' | 'Templates' | 'Color Palettes' | 'PSD Files'>('Mockups');
  const [resSize, setResSize] = useState('');
  const [resType, setResType] = useState('');

  // 5. Course Form
  const [cTitle, setCTitle] = useState('');
  const [cDesc, setCDesc] = useState('');
  const [cThumb, setCThumb] = useState('');
  const [cDifficulty, setCDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [lessonsList, setLessonsList] = useState<Array<{title: string, duration: string, videoURL: string}>>([
    { title: 'Introductory Overview', duration: '10 mins', videoURL: 'https://www.w3schools.com/html/mov_bbb.mp4' }
  ]);

  // Load Data
  const reloadData = async () => {
    const tuts = await getCollection<Tutorial>('tutorials');
    const yts = await getCollection<YouTubeVideo>('youtubeVideos');
    const gals = await getCollection<GalleryItem>('gallery');
    const res = await getCollection<Resource>('resources');
    const crs = await getCollection<Course>('courses');
    const news = await getCollection<any>('newsletter');
    const users = JSON.parse(localStorage.getItem('dreamline_users') || '[]');

    setTutorials(tuts);
    setYoutubeVideos(yts);
    setGallery(gals);
    setResources(res);
    setCourses(crs);
    setNewsletter(news);
    setUsersList(users);
  };

  useEffect(() => {
    reloadData();
  }, []);

  if (loading || !user || user.role !== 'admin') {
    return <div className="text-center py-20 text-muted-foreground font-inter">Authenticating administrator permissions...</div>;
  }

  // Deletion logic
  const handleDelete = async (collectionName: string, id: string) => {
    if (confirm('Are you sure you want to delete this content?')) {
      const success = await deleteItem(collectionName, id);
      if (success) {
        reloadData();
      }
    }
  };

  // Form Submissions
  const handleAddTutorial = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('idle');
    try {
      await addItem('tutorials', {
        title: tutTitle,
        description: tutDesc,
        thumbnail: tutThumb || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60',
        videoURL: tutVideo || 'https://www.w3schools.com/html/mov_bbb.mp4',
        category: tutCat,
        duration: tutDuration || '15 mins',
        instructor: tutInstructor || 'Dreamline Staff',
        featured: true
      });
      setFormStatus('success');
      setTutTitle('');
      setTutDesc('');
      setTutThumb('');
      setTutVideo('');
      setTutDuration('');
      setTutInstructor('');
      reloadData();
    } catch {
      setFormStatus('error');
    }
  };

  const handleAddYoutube = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('idle');
    try {
      await addItem('youtubeVideos', {
        title: ytTitle,
        youtubeURL: ytURL || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnail: ytThumb || 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=60',
        category: ytCat,
        featured: true
      });
      setFormStatus('success');
      setYtTitle('');
      setYtURL('');
      setYtThumb('');
      reloadData();
    } catch {
      setFormStatus('error');
    }
  };

  const handleAddGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('idle');
    try {
      await addItem('gallery', {
        title: galTitle,
        imageURL: galImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60',
        category: galCat,
        designer: galDesigner || 'Admin',
        likes: 0,
        likedBy: [],
        shares: 0,
        downloads: 0,
        downloadAllowed: galDownloadAllowed,
        featured: true
      });
      setFormStatus('success');
      setGalTitle('');
      setGalImage('');
      setGalDesigner('');
      reloadData();
    } catch {
      setFormStatus('error');
    }
  };

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('idle');
    try {
      await addItem('resources', {
        title: resTitle,
        fileURL: '#',
        category: resCat,
        downloads: 0,
        size: resSize || '5.2 MB',
        fileType: resType || 'ZIP Archive'
      });
      setFormStatus('success');
      setResTitle('');
      setResSize('');
      setResType('');
      reloadData();
    } catch {
      setFormStatus('error');
    }
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('idle');
    try {
      await addItem('courses', {
        title: cTitle,
        description: cDesc,
        thumbnail: cThumb || 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=60',
        difficulty: cDifficulty,
        lessons: lessonsList.map((l, idx) => ({ ...l, id: `lesson-${Date.now()}-${idx}` })),
        price: 'Free',
        featured: true
      });
      setFormStatus('success');
      setCTitle('');
      setCDesc('');
      setCThumb('');
      setLessonsList([{ title: 'Introductory Overview', duration: '10 mins', videoURL: 'https://www.w3schools.com/html/mov_bbb.mp4' }]);
      reloadData();
    } catch {
      setFormStatus('error');
    }
  };

  const addLessonField = () => {
    setLessonsList([
      ...lessonsList,
      { title: '', duration: '', videoURL: 'https://www.w3schools.com/html/mov_bbb.mp4' }
    ]);
  };

  const updateLessonField = (idx: number, field: string, value: string) => {
    const updated = [...lessonsList];
    updated[idx] = { ...updated[idx], [field]: value };
    setLessonsList(updated);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      
      {/* Header Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold font-poppins">Admin Panel</h1>
          <p className="text-sm text-muted-foreground">Manage databases, verify uploads, and view website statistics.</p>
        </div>
        <button
          onClick={() => router.push('/dashboard')}
          className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold hover:bg-accent transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <span>User Dashboard</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Grid: Sidebar Tabs vs Panel */}
      <div className="grid gap-8 lg:grid-cols-4">
        
        {/* Navigation Sidebar */}
        <div className="space-y-1.5 lg:col-span-1">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-primary text-white'
                : 'hover:bg-accent text-muted-foreground hover:text-foreground'
            }`}
          >
            <LayoutDashboard className="h-4.5 w-4.5" />
            Analytics Overview
          </button>
          <button
            onClick={() => setActiveTab('tutorials')}
            className={`w-full flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'tutorials'
                ? 'bg-primary text-white'
                : 'hover:bg-accent text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className="flex items-center gap-3">
              <Play className="h-4.5 w-4.5" />
              Uploaded Tutorials
            </span>
            <span className="rounded bg-slate-100 dark:bg-slate-800 text-[10px] px-2 py-0.5 text-muted-foreground">
              {tutorials.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('youtube')}
            className={`w-full flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'youtube'
                ? 'bg-primary text-white'
                : 'hover:bg-accent text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className="flex items-center gap-3">
              <Youtube className="h-4.5 w-4.5" />
              YouTube Database
            </span>
            <span className="rounded bg-slate-100 dark:bg-slate-800 text-[10px] px-2 py-0.5 text-muted-foreground">
              {youtubeVideos.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`w-full flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'gallery'
                ? 'bg-primary text-white'
                : 'hover:bg-accent text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className="flex items-center gap-3">
              <ImageIcon className="h-4.5 w-4.5" />
              Gallery Artworks
            </span>
            <span className="rounded bg-slate-100 dark:bg-slate-800 text-[10px] px-2 py-0.5 text-muted-foreground">
              {gallery.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`w-full flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'resources'
                ? 'bg-primary text-white'
                : 'hover:bg-accent text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className="flex items-center gap-3">
              <FileDown className="h-4.5 w-4.5" />
              Asset Downloads
            </span>
            <span className="rounded bg-slate-100 dark:bg-slate-800 text-[10px] px-2 py-0.5 text-muted-foreground">
              {resources.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`w-full flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'courses'
                ? 'bg-primary text-white'
                : 'hover:bg-accent text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className="flex items-center gap-3">
              <BookOpen className="h-4.5 w-4.5" />
              Course Catalog
            </span>
            <span className="rounded bg-slate-100 dark:bg-slate-800 text-[10px] px-2 py-0.5 text-muted-foreground">
              {courses.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('newsletter')}
            className={`w-full flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'newsletter'
                ? 'bg-primary text-white'
                : 'hover:bg-accent text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className="flex items-center gap-3">
              <Mail className="h-4.5 w-4.5" />
              Subscribers
            </span>
            <span className="rounded bg-slate-100 dark:bg-slate-800 text-[10px] px-2 py-0.5 text-muted-foreground">
              {newsletter.length}
            </span>
          </button>
        </div>

        {/* Dynamic Display Panel */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="bg-card border border-border p-6 sm:p-8 rounded-2xl dark:bg-slate-900 shadow-sm min-h-[450px] space-y-6"
            >
              
              {/* STATUS LOG */}
              {formStatus === 'success' && (
                <div className="flex items-center gap-2 rounded-xl bg-green-500/10 border border-green-500/20 p-4 text-xs text-green-600 font-semibold">
                  <Check className="h-4.5 w-4.5 shrink-0" />
                  <span>Item added successfully to database collection!</span>
                </div>
              )}
              {formStatus === 'error' && (
                <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-xs text-red-500 font-semibold">
                  <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                  <span>Failed to upload item. Please verify required fields.</span>
                </div>
              )}

              {/* TAB 1: ANALYTICS OVERVIEW */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold font-poppins border-b border-border pb-4">Aesthetic Analytics</h3>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Users */}
                    <div className="rounded-xl border border-border p-4 bg-slate-50 dark:bg-slate-950/40">
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span className="text-xs font-semibold uppercase tracking-wider">Total Users</span>
                        <Users className="h-5 w-5" />
                      </div>
                      <span className="block text-2xl font-bold font-poppins mt-2">{Math.max(usersList.length, 1)}</span>
                    </div>

                    {/* Tutorials */}
                    <div className="rounded-xl border border-border p-4 bg-slate-50 dark:bg-slate-950/40">
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span className="text-xs font-semibold uppercase tracking-wider">Tutorials</span>
                        <Play className="h-5 w-5" />
                      </div>
                      <span className="block text-2xl font-bold font-poppins mt-2">{tutorials.length}</span>
                    </div>

                    {/* Artworks */}
                    <div className="rounded-xl border border-border p-4 bg-slate-50 dark:bg-slate-950/40">
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span className="text-xs font-semibold uppercase tracking-wider">Artworks</span>
                        <ImageIcon className="h-5 w-5" />
                      </div>
                      <span className="block text-2xl font-bold font-poppins mt-2">{gallery.length}</span>
                    </div>

                    {/* Downloads */}
                    <div className="rounded-xl border border-border p-4 bg-slate-50 dark:bg-slate-950/40">
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span className="text-xs font-semibold uppercase tracking-wider">Downloads</span>
                        <FileDown className="h-5 w-5" />
                      </div>
                      <span className="block text-2xl font-bold font-poppins mt-2">
                        {resources.reduce((acc, curr) => acc + curr.downloads, 0)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: MANAGE TUTORIALS */}
              {activeTab === 'tutorials' && (
                <div className="space-y-8">
                  <div className="border-b border-border pb-4">
                    <h3 className="text-xl font-bold font-poppins">Upload New Tutorial</h3>
                  </div>

                  <form onSubmit={handleAddTutorial} className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">Tutorial Title</label>
                      <input
                        type="text" required value={tutTitle} onChange={(e) => setTutTitle(e.target.value)}
                        placeholder="e.g. Cinematic Lighting Masks" className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">Software Category</label>
                      <select
                        value={tutCat} onChange={(e) => setTutCat(e.target.value as any)}
                        className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm"
                      >
                        <option value="Photoshop">Photoshop</option>
                        <option value="Illustrator">Illustrator</option>
                        <option value="Premiere Pro">Premiere Pro</option>
                        <option value="After Effects">After Effects</option>
                        <option value="Canva">Canva</option>
                        <option value="Figma">Figma</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">Duration</label>
                      <input
                        type="text" placeholder="e.g. 15 mins" value={tutDuration} onChange={(e) => setTutDuration(e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">Instructor Name</label>
                      <input
                        type="text" placeholder="e.g. Alex Mercer" value={tutInstructor} onChange={(e) => setTutInstructor(e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">Video File URL</label>
                      <input
                        type="text" placeholder="e.g. https://www.w3schools.com/html/mov_bbb.mp4" value={tutVideo} onChange={(e) => setTutVideo(e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">Cover Image (Thumbnail) URL</label>
                      <input
                        type="text" placeholder="https://images.unsplash.com/photo-..." value={tutThumb} onChange={(e) => setTutThumb(e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">Description</label>
                      <textarea
                        required value={tutDesc} onChange={(e) => setTutDesc(e.target.value)} rows={3}
                        placeholder="Write details about masks, rendering, and vector anchors..." className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm"
                      />
                    </div>

                    <button
                      type="submit"
                      className="rounded-lg bg-primary py-2 px-4 text-sm font-semibold text-white hover:bg-violet-700 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="h-4.5 w-4.5" />
                      Add Tutorial
                    </button>
                  </form>

                  {/* List Tutorials */}
                  <div className="border-t border-border pt-6 space-y-4">
                    <h4 className="text-md font-bold font-poppins">Uploaded Tutorials ({tutorials.length})</h4>
                    <div className="divide-y divide-border">
                      {tutorials.map((tut) => (
                        <div key={tut.id} className="py-3 flex items-center justify-between">
                          <span className="text-sm font-medium line-clamp-1">{tut.title} ({tut.category})</span>
                          <button
                            onClick={() => handleDelete('tutorials', tut.id)}
                            className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: MANAGE YOUTUBE */}
              {activeTab === 'youtube' && (
                <div className="space-y-8">
                  <div className="border-b border-border pb-4">
                    <h3 className="text-xl font-bold font-poppins">Add YouTube Video</h3>
                  </div>

                  <form onSubmit={handleAddYoutube} className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">Video Title</label>
                      <input
                        type="text" required value={ytTitle} onChange={(e) => setYtTitle(e.target.value)}
                        placeholder="e.g. Loops in After Effects" className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">YouTube URL</label>
                      <input
                        type="text" required value={ytURL} onChange={(e) => setYtURL(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..." className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">Category</label>
                      <input
                        type="text" required value={ytCat} onChange={(e) => setYtCat(e.target.value)}
                        placeholder="e.g. Photoshop" className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">Cover Image (Thumbnail) URL</label>
                      <input
                        type="text" value={ytThumb} onChange={(e) => setYtThumb(e.target.value)}
                        placeholder="https://images.unsplash.com/photo-..." className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm"
                      />
                    </div>

                    <button
                      type="submit"
                      className="rounded-lg bg-primary py-2 px-4 text-sm font-semibold text-white hover:bg-violet-700 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="h-4.5 w-4.5" />
                      Add Video
                    </button>
                  </form>

                  {/* List YouTube */}
                  <div className="border-t border-border pt-6 space-y-4">
                    <h4 className="text-md font-bold font-poppins">YouTube Videos ({youtubeVideos.length})</h4>
                    <div className="divide-y divide-border">
                      {youtubeVideos.map((video) => (
                        <div key={video.id} className="py-3 flex items-center justify-between">
                          <span className="text-sm font-medium line-clamp-1">{video.title} ({video.category})</span>
                          <button
                            onClick={() => handleDelete('youtubeVideos', video.id)}
                            className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: MANAGE GALLERY */}
              {activeTab === 'gallery' && (
                <div className="space-y-8">
                  <div className="border-b border-border pb-4">
                    <h3 className="text-xl font-bold font-poppins">Add Gallery Artwork</h3>
                  </div>

                  <form onSubmit={handleAddGallery} className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">Artwork Title</label>
                      <input
                        type="text" required value={galTitle} onChange={(e) => setGalTitle(e.target.value)}
                        placeholder="e.g. Cyberpunk Poster Design" className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">Category</label>
                      <select
                        value={galCat} onChange={(e) => setGalCat(e.target.value as any)}
                        className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm"
                      >
                        <option value="Logos">Logos</option>
                        <option value="Flyers">Flyers</option>
                        <option value="Branding">Branding</option>
                        <option value="UI Design">UI Design</option>
                        <option value="Posters">Posters</option>
                        <option value="Social Media">Social Media</option>
                        <option value="Photography">Photography</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">Designer Name</label>
                      <input
                        type="text" required value={galDesigner} onChange={(e) => setGalDesigner(e.target.value)}
                        placeholder="e.g. Elena Rostova" className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">Image URL</label>
                      <input
                        type="text" required value={galImage} onChange={(e) => setGalImage(e.target.value)}
                        placeholder="https://images.unsplash.com/photo-..." className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm"
                      />
                    </div>
                    <div className="flex items-center space-x-2 pt-2">
                      <input
                        type="checkbox" id="dlAllowed" checked={galDownloadAllowed} onChange={(e) => setGalDownloadAllowed(e.target.checked)}
                        className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                      />
                      <label htmlFor="dlAllowed" className="text-xs font-bold text-muted-foreground uppercase cursor-pointer">
                        Allow Community Downloads
                      </label>
                    </div>

                    <div className="sm:col-span-2">
                      <button
                        type="submit"
                        className="rounded-lg bg-primary py-2 px-4 text-sm font-semibold text-white hover:bg-violet-700 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="h-4.5 w-4.5" />
                        Add Artwork
                      </button>
                    </div>
                  </form>

                  {/* List Gallery */}
                  <div className="border-t border-border pt-6 space-y-4">
                    <h4 className="text-md font-bold font-poppins">Gallery Artworks ({gallery.length})</h4>
                    <div className="divide-y divide-border">
                      {gallery.map((item) => (
                        <div key={item.id} className="py-3 flex items-center justify-between">
                          <span className="text-sm font-medium line-clamp-1">{item.title} (by @{item.designer})</span>
                          <button
                            onClick={() => handleDelete('gallery', item.id)}
                            className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: MANAGE RESOURCES */}
              {activeTab === 'resources' && (
                <div className="space-y-8">
                  <div className="border-b border-border pb-4">
                    <h3 className="text-xl font-bold font-poppins">Add Resource Asset</h3>
                  </div>

                  <form onSubmit={handleAddResource} className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">Asset Title</label>
                      <input
                        type="text" required value={resTitle} onChange={(e) => setResTitle(e.target.value)}
                        placeholder="e.g. Retro Serif Fontavenue" className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">Category</label>
                      <select
                        value={resCat} onChange={(e) => setResCat(e.target.value as any)}
                        className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm"
                      >
                        <option value="Fonts">Fonts</option>
                        <option value="Mockups">Mockups</option>
                        <option value="Icons">Icons</option>
                        <option value="Templates">Templates</option>
                        <option value="Color Palettes">Color Palettes</option>
                        <option value="PSD Files">PSD Files</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">File Size</label>
                      <input
                        type="text" required value={resSize} onChange={(e) => setResSize(e.target.value)}
                        placeholder="e.g. 12.4 MB" className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">Format Details</label>
                      <input
                        type="text" required value={resType} onChange={(e) => setResType(e.target.value)}
                        placeholder="e.g. PSD (layered)" className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <button
                        type="submit"
                        className="rounded-lg bg-primary py-2 px-4 text-sm font-semibold text-white hover:bg-violet-700 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="h-4.5 w-4.5" />
                        Add Resource
                      </button>
                    </div>
                  </form>

                  {/* List Resources */}
                  <div className="border-t border-border pt-6 space-y-4">
                    <h4 className="text-md font-bold font-poppins">Asset Catalog ({resources.length})</h4>
                    <div className="divide-y divide-border">
                      {resources.map((res) => (
                        <div key={res.id} className="py-3 flex items-center justify-between">
                          <span className="text-sm font-medium line-clamp-1">{res.title} ({res.category})</span>
                          <button
                            onClick={() => handleDelete('resources', res.id)}
                            className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: MANAGE COURSES */}
              {activeTab === 'courses' && (
                <div className="space-y-8">
                  <div className="border-b border-border pb-4">
                    <h3 className="text-xl font-bold font-poppins">Add Course Catalog</h3>
                  </div>

                  <form onSubmit={handleAddCourse} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">Course Title</label>
                        <input
                          type="text" required value={cTitle} onChange={(e) => setCTitle(e.target.value)}
                          placeholder="e.g. UI/UX Figma Masterclass" className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">Difficulty</label>
                        <select
                          value={cDifficulty} onChange={(e) => setCDifficulty(e.target.value as any)}
                          className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">Cover Thumbnail Image URL</label>
                        <input
                          type="text" value={cThumb} onChange={(e) => setCThumb(e.target.value)}
                          placeholder="https://images.unsplash.com/photo-..." className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">Description</label>
                        <textarea
                          required value={cDesc} onChange={(e) => setCDesc(e.target.value)} rows={3}
                          placeholder="Comprehensive description of lessons, modules, and vector challenges..." className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm"
                        />
                      </div>
                    </div>

                    {/* Lesson fields timeline */}
                    <div className="border-t border-border pt-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-muted-foreground uppercase">Configure Lessons Timeline</h4>
                        <button
                          type="button" onClick={addLessonField}
                          className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <FilePlus className="h-4 w-4" /> Add Lesson
                        </button>
                      </div>

                      {lessonsList.map((lesson, idx) => (
                        <div key={idx} className="border border-border p-4 rounded-xl space-y-3.5 bg-slate-50 dark:bg-slate-950/20 relative">
                          <span className="absolute top-2 right-4 text-[10px] font-bold text-muted-foreground">Lesson #{idx + 1}</span>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Lesson Title</label>
                              <input
                                type="text" required value={lesson.title} onChange={(e) => updateLessonField(idx, 'title', e.target.value)}
                                placeholder="e.g. Master the pen tool" className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Duration</label>
                              <input
                                type="text" required value={lesson.duration} onChange={(e) => updateLessonField(idx, 'duration', e.target.value)}
                                placeholder="e.g. 12 mins" className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      type="submit"
                      className="rounded-lg bg-primary py-2 px-4 text-sm font-semibold text-white hover:bg-violet-700 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="h-4.5 w-4.5" />
                      Add Course
                    </button>
                  </form>

                  {/* List Courses */}
                  <div className="border-t border-border pt-6 space-y-4">
                    <h4 className="text-md font-bold font-poppins">Course Catalog ({courses.length})</h4>
                    <div className="divide-y divide-border">
                      {courses.map((course) => (
                        <div key={course.id} className="py-3 flex items-center justify-between">
                          <span className="text-sm font-medium line-clamp-1">{course.title} ({course.difficulty})</span>
                          <button
                            onClick={() => handleDelete('courses', course.id)}
                            className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: NEWSLETTER SUBSCRIBERS */}
              {activeTab === 'newsletter' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold font-poppins border-b border-border pb-4">Newsletter Subscriptions ({newsletter.length})</h3>
                  <div className="divide-y divide-border">
                    {newsletter.map((sub, idx) => (
                      <div key={sub.id || idx} className="py-3.5 flex items-center justify-between text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground/80">{sub.email}</span>
                        <span>Joined: {new Date(sub.subscribedAt).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
