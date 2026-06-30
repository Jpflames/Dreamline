'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { 
  getCollection, 
  Course, 
  Tutorial, 
  Resource,
  updateUserProfile 
} from '@/lib/db';
import { 
  Compass, 
  User, 
  BookOpen, 
  Bookmark, 
  Download, 
  Settings, 
  Moon, 
  Sun, 
  Edit3, 
  Save, 
  ChevronRight, 
  LogOut, 
  Clock 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
  const router = useRouter();
  const { 
    user, 
    loading, 
    theme, 
    toggleTheme, 
    logout, 
    updateUserBio, 
    updateUserProfilePic 
  } = useApp();

  // Tab State
  const [activeTab, setActiveTab] = useState<'profile' | 'courses' | 'saved' | 'downloads' | 'settings'>('profile');

  // Edit Profile Form State
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [editStatus, setEditStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Full Details Mapping State
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [allTutorials, setAllTutorials] = useState<Tutorial[]>([]);
  const [allResources, setAllResources] = useState<Resource[]>([]);

  // Watch Player State (for saved/recent tutorials in dashboard)
  const [activePlayTutorial, setActivePlayTutorial] = useState<Tutorial | null>(null);

  // Sync Form when user loads
  useEffect(() => {
    if (user) {
      setEditName(user.displayName);
      setEditBio(user.bio || '');
      setEditAvatar(user.photoURL || '');
    }
  }, [user]);

  // Load Mapping Datasets
  useEffect(() => {
    async function loadData() {
      const coursesData = await getCollection<Course>('courses');
      const tutorialsData = await getCollection<Tutorial>('tutorials');
      const resourcesData = await getCollection<Resource>('resources');
      setAllCourses(coursesData);
      setAllTutorials(tutorialsData);
      setAllResources(resourcesData);
    }
    loadData();
  }, []);

  // Redirect if guest
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="text-center py-20 text-muted-foreground font-inter">Loading dashboard details...</div>;
  }

  // Filter user specific arrays
  const userCourses = allCourses.filter(c => user.enrolledCourses.includes(c.id));
  const userSavedTutorials = allTutorials.filter(t => user.savedTutorials.includes(t.id));
  const userDownloads = allResources.filter(r => user.downloads.includes(r.id));
  
  // Map Recently watched (can be tutorials or videos, mapped to tutorials for dashboard watch player)
  const userRecentlyWatched = allTutorials.filter(t => user.recentlyWatched.includes(t.id));

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditStatus('idle');
    try {
      // Save details to database
      await updateUserProfile(user.uid, {
        displayName: editName,
        bio: editBio,
        photoURL: editAvatar
      });
      // Sync context values
      await updateUserBio(editBio);
      await updateUserProfilePic(editAvatar);
      
      setEditStatus('success');
      setEditMode(false);
    } catch (err) {
      setEditStatus('error');
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-6">
        <div className="flex items-center space-x-4">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName}
              className="h-16 w-16 rounded-2xl object-cover border border-border"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 font-bold text-white text-xl">
              {user.displayName.substring(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-poppins">{user.displayName}</h1>
            <p className="text-sm text-muted-foreground">{user.email} &bull; Member role: <span className="font-semibold text-primary capitalize">{user.role}</span></p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-xl border border-red-200/50 hover:bg-red-50 text-red-600 px-4 py-2.5 text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 dark:border-red-950/20 dark:hover:bg-red-950/15 cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span>Log Out</span>
        </button>
      </div>

      {/* 2. Main Dashboard Layout Grid */}
      <div className="grid gap-8 lg:grid-cols-4">
        
        {/* Navigation Sidebar */}
        <div className="space-y-2 lg:col-span-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-primary text-white'
                : 'hover:bg-accent text-muted-foreground hover:text-foreground'
            }`}
          >
            <User className="h-4.5 w-4.5" />
            My Profile
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'courses'
                ? 'bg-primary text-white'
                : 'hover:bg-accent text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className="flex items-center gap-3">
              <BookOpen className="h-4.5 w-4.5" />
              Enrolled Courses
            </span>
            <span className="rounded bg-slate-100 dark:bg-slate-800 text-[10px] px-2 py-0.5 text-muted-foreground">
              {userCourses.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'saved'
                ? 'bg-primary text-white'
                : 'hover:bg-accent text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className="flex items-center gap-3">
              <Bookmark className="h-4.5 w-4.5" />
              Saved Tutorials
            </span>
            <span className="rounded bg-slate-100 dark:bg-slate-800 text-[10px] px-2 py-0.5 text-muted-foreground">
              {userSavedTutorials.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('downloads')}
            className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'downloads'
                ? 'bg-primary text-white'
                : 'hover:bg-accent text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className="flex items-center gap-3">
              <Download className="h-4.5 w-4.5" />
              Downloads History
            </span>
            <span className="rounded bg-slate-100 dark:bg-slate-800 text-[10px] px-2 py-0.5 text-muted-foreground">
              {userDownloads.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-primary text-white'
                : 'hover:bg-accent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Settings className="h-4.5 w-4.5" />
            Dashboard Settings
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
              className="bg-card border border-border p-6 sm:p-8 rounded-2xl dark:bg-slate-900 shadow-sm min-h-[400px]"
            >
              
              {/* TAB 1: PROFILE EDIT */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <h3 className="text-xl font-bold font-poppins">My Profile</h3>
                    {!editMode && (
                      <button
                        onClick={() => setEditMode(true)}
                        className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-accent flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        Edit Profile
                      </button>
                    )}
                  </div>

                  {editMode ? (
                    <form onSubmit={handleProfileSave} className="space-y-4 max-w-xl">
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">Display Name</label>
                        <input
                          type="text"
                          required
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="John Doe"
                          className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">Avatar Image URL</label>
                        <input
                          type="text"
                          value={editAvatar}
                          onChange={(e) => setEditAvatar(e.target.value)}
                          placeholder="https://images.unsplash.com/photo-..."
                          className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">Short Bio</label>
                        <textarea
                          value={editBio}
                          onChange={(e) => setEditBio(e.target.value)}
                          placeholder="Tell the community about your software skills..."
                          rows={4}
                          className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm focus:border-primary focus:outline-none"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="submit"
                          className="rounded-lg bg-primary hover:bg-violet-700 text-white px-4 py-2 text-sm font-semibold flex items-center gap-1.5 cursor-pointer"
                        >
                          <Save className="h-4 w-4" />
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditMode(false)}
                          className="rounded-lg border border-border hover:bg-accent px-4 py-2 text-sm font-semibold cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                          <span className="block text-xs font-bold text-muted-foreground uppercase">Display Name</span>
                          <span className="text-base font-semibold mt-1 block">{user.displayName}</span>
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-muted-foreground uppercase">Email Address</span>
                          <span className="text-base font-semibold mt-1 block">{user.email}</span>
                        </div>
                      </div>
                      
                      <div className="border-t border-border pt-4">
                        <span className="block text-xs font-bold text-muted-foreground uppercase">Short Bio</span>
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                          {user.bio || 'No bio added yet. Click edit profile to add bio.'}
                        </p>
                      </div>

                      {/* Recently Watched */}
                      {userRecentlyWatched.length > 0 && (
                        <div className="border-t border-border pt-6 space-y-4">
                          <h4 className="text-sm font-bold font-poppins flex items-center gap-1 text-slate-800 dark:text-slate-200">
                            <Clock className="h-4.5 w-4.5" />
                            Recently Watched Tutorials
                          </h4>
                          <div className="grid gap-4 sm:grid-cols-2">
                            {userRecentlyWatched.map((tut) => (
                              <div
                                key={tut.id}
                                onClick={() => setActivePlayTutorial(tut)}
                                className="flex items-center space-x-3 rounded-xl border border-border p-3 hover:bg-accent cursor-pointer transition-colors"
                              >
                                <img
                                  src={tut.thumbnail}
                                  alt={tut.title}
                                  className="h-10 w-16 object-cover rounded-lg shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <h5 className="text-xs font-semibold text-foreground truncate">{tut.title}</h5>
                                  <span className="text-[10px] text-muted-foreground block mt-0.5">{tut.category} &bull; {tut.duration}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: ENROLLED COURSES */}
              {activeTab === 'courses' && (
                <div className="space-y-6">
                  <div className="border-b border-border pb-4">
                    <h3 className="text-xl font-bold font-poppins">Enrolled Courses</h3>
                  </div>

                  {userCourses.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2">
                      {userCourses.map((course) => {
                        const progress = user.courseProgress[course.id] || 0;
                        return (
                          <div
                            key={course.id}
                            className="group flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card dark:bg-slate-900/50 shadow-sm transition-all duration-300 hover:shadow-md"
                          >
                            <img
                              src={course.thumbnail}
                              alt={course.title}
                              className="h-32 w-full object-cover"
                            />
                            <div className="p-4 space-y-4">
                              <h4 className="font-bold text-sm font-poppins leading-snug line-clamp-1">
                                {course.title}
                              </h4>
                              
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs font-semibold">
                                  <span>Progress</span>
                                  <span>{progress}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                  <div className="h-full bg-violet-600" style={{ width: `${progress}%` }} />
                                </div>
                              </div>

                              <Link
                                href={`/courses/${course.id}`}
                                className="w-full flex items-center justify-center gap-1 rounded-lg bg-primary py-2 text-xs font-semibold text-white hover:bg-violet-700 transition-colors"
                              >
                                Resume Learning
                                <ChevronRight className="h-3.5 w-3.5" />
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-16 border border-dashed border-border rounded-2xl space-y-4">
                      <p className="text-muted-foreground text-sm">You are not enrolled in any structured courses yet.</p>
                      <Link
                        href="/courses"
                        className="inline-flex items-center gap-1 text-xs font-bold bg-primary text-white rounded-lg px-4 py-2.5 hover:bg-violet-700 transition-colors"
                      >
                        Explore Creative Courses
                        <Compass className="h-4 w-4" />
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: SAVED TUTORIALS */}
              {activeTab === 'saved' && (
                <div className="space-y-6">
                  <div className="border-b border-border pb-4">
                    <h3 className="text-xl font-bold font-poppins">Saved Tutorials</h3>
                  </div>

                  {userSavedTutorials.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2">
                      {userSavedTutorials.map((tut) => (
                        <div
                          key={tut.id}
                          className="group rounded-xl border border-border p-4 hover:shadow-sm transition-all duration-300 flex items-start space-x-3 cursor-pointer"
                          onClick={() => setActivePlayTutorial(tut)}
                        >
                          <img
                            src={tut.thumbnail}
                            alt={tut.title}
                            className="h-16 w-24 object-cover rounded-lg shrink-0"
                          />
                          <div className="flex-1 min-w-0 space-y-1">
                            <span className="rounded bg-violet-600/10 text-violet-600 border border-violet-500/10 px-2 py-0.5 text-[9px] font-semibold">
                              {tut.category}
                            </span>
                            <h4 className="font-bold text-sm leading-snug line-clamp-1 text-foreground group-hover:text-primary transition-colors">
                              {tut.title}
                            </h4>
                            <span className="text-[10px] text-muted-foreground block">{tut.duration} &bull; Instructor: {tut.instructor}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 border border-dashed border-border rounded-2xl space-y-4">
                      <p className="text-muted-foreground text-sm">You haven't bookmarked any guides yet.</p>
                      <Link
                        href="/tutorials"
                        className="inline-flex items-center gap-1 text-xs font-bold bg-primary text-white rounded-lg px-4 py-2.5 hover:bg-violet-700 transition-colors"
                      >
                        Explore Academy Tutorials
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: DOWNLOADS HISTORY */}
              {activeTab === 'downloads' && (
                <div className="space-y-6">
                  <div className="border-b border-border pb-4">
                    <h3 className="text-xl font-bold font-poppins">Downloads History</h3>
                  </div>

                  {userDownloads.length > 0 ? (
                    <div className="divide-y divide-border">
                      {userDownloads.map((res) => (
                        <div key={res.id} className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                          <div>
                            <h4 className="font-bold text-sm leading-tight text-foreground">{res.title}</h4>
                            <div className="flex items-center space-x-3 text-xs text-muted-foreground mt-1">
                              <span>Category: <span className="font-semibold text-foreground/80">{res.category}</span></span>
                              <span>&bull;</span>
                              <span>Size: <span className="font-semibold text-foreground/80">{res.size}</span></span>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => {
                              // Re-download file
                              const blob = new Blob([`Dreamline asset: ${res.title}`], { type: 'text/plain' });
                              const link = document.createElement('a');
                              link.href = URL.createObjectURL(blob);
                              link.download = `${res.title.toLowerCase().replace(/ /g, '_')}.zip`;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                            className="rounded-lg border border-border p-2 hover:bg-accent text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                            title="Re-download Asset"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 border border-dashed border-border rounded-2xl space-y-4">
                      <p className="text-muted-foreground text-sm">You haven't downloaded any assets from our center yet.</p>
                      <Link
                        href="/resources"
                        className="inline-flex items-center gap-1 text-xs font-bold bg-primary text-white rounded-lg px-4 py-2.5 hover:bg-violet-700 transition-colors"
                      >
                        Explore Design Assets
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: DASHBOARD SETTINGS */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div className="border-b border-border pb-4">
                    <h3 className="text-xl font-bold font-poppins">Dashboard Settings</h3>
                  </div>

                  <div className="space-y-6">
                    {/* Dark mode card */}
                    <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-slate-50 dark:bg-slate-950/40">
                      <div>
                        <h4 className="font-bold text-sm leading-tight text-foreground">Aesthetic Dark Theme</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">Toggle default styling theme preferences for visual comfort.</p>
                      </div>
                      <button
                        onClick={toggleTheme}
                        className="rounded-lg border border-border p-2.5 hover:bg-accent transition-colors cursor-pointer"
                      >
                        {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5 text-yellow-400" />}
                      </button>
                    </div>

                    {/* Academy level */}
                    <div>
                      <span className="block text-xs font-bold text-muted-foreground uppercase">Academy Member Level</span>
                      <span className="text-sm font-semibold mt-1 block">Level 1 - Creative Explorer</span>
                      <p className="text-xs text-slate-400 mt-1">Enroll in more courses and check off lesson tasks to level up your portfolio ranking badge.</p>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* DASHBOARD WATCH MODAL */}
      <AnimatePresence>
        {activePlayTutorial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePlayTutorial(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
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
                  src={activePlayTutorial.videoURL}
                  controls
                  autoPlay
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="p-6 bg-slate-900">
                <div className="flex items-center justify-between mb-2">
                  <span className="rounded bg-violet-600/20 text-violet-400 border border-violet-500/20 px-2.5 py-0.5 text-xs font-semibold">
                    {activePlayTutorial.category}
                  </span>
                  <span className="text-xs text-slate-400">Duration: {activePlayTutorial.duration}</span>
                </div>
                <h3 className="text-xl font-bold font-poppins">{activePlayTutorial.title}</h3>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                  {activePlayTutorial.description}
                </p>
                <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Instructor: <span className="font-semibold text-slate-200">{activePlayTutorial.instructor}</span></span>
                </div>
              </div>
              <button
                onClick={() => setActivePlayTutorial(null)}
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
