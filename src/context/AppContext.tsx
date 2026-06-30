'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, getUserProfile, createUserProfile, updateUserProfile } from '@/lib/db';
import { auth, isFirebaseEnabled } from '@/lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  signInWithPopup, 
  GoogleAuthProvider,
  onAuthStateChanged
} from 'firebase/auth';

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserBio: (bio: string) => Promise<void>;
  updateUserProfilePic: (photoURL: string) => Promise<void>;
  enrollInCourse: (courseId: string) => Promise<void>;
  completeLesson: (courseId: string, lessonId: string) => Promise<void>;
  toggleSaveTutorial: (tutorialId: string) => Promise<void>;
  addRecentlyWatched: (id: string) => Promise<void>;
  trackDownload: (resourceId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark'); // Default to dark for cinematic creative feel
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Theme handler
  useEffect(() => {
    const savedTheme = localStorage.getItem('dreamline_theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || 'dark';
    setTheme(initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('dreamline_theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // 2. Authentication Monitor
  useEffect(() => {
    if (isFirebaseEnabled && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          // Fetch user profile from Firestore
          let profile = await getUserProfile(firebaseUser.uid);
          if (!profile) {
            // Create user profile in Firestore
            profile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || 'Creative Maker',
              photoURL: firebaseUser.photoURL || '',
              role: firebaseUser.email === 'admin@dreamline.com' ? 'admin' : 'user', // Basic admin override check
              enrolledCourses: [],
              courseProgress: {},
              completedLessons: {},
              savedTutorials: [],
              recentlyWatched: [],
              downloads: []
            };
            await createUserProfile(profile);
          }
          setUser(profile);
        } else {
          setUser(null);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // Mock Authentication Mode load
      const savedUserStr = localStorage.getItem('dreamline_active_user');
      if (savedUserStr) {
        try {
          setUser(JSON.parse(savedUserStr));
        } catch (e) {
          setUser(null);
        }
      }
      setLoading(false);
    }
  }, []);

  // Update mock user helpers
  const saveMockUser = (mockProfile: UserProfile | null) => {
    setUser(mockProfile);
    if (mockProfile) {
      localStorage.setItem('dreamline_active_user', JSON.stringify(mockProfile));
      // Sync with mock list
      const mockProfiles = JSON.parse(localStorage.getItem('dreamline_users') || '[]');
      const idx = mockProfiles.findIndex((p: any) => p.uid === mockProfile.uid);
      if (idx !== -1) {
        mockProfiles[idx] = mockProfile;
      } else {
        mockProfiles.push(mockProfile);
      }
      localStorage.setItem('dreamline_users', JSON.stringify(mockProfiles));
    } else {
      localStorage.removeItem('dreamline_active_user');
    }
  };

  // Login handler
  const login = async (email: string, password: string) => {
    if (isFirebaseEnabled && auth) {
      await signInWithEmailAndPassword(auth, email, password);
      return;
    }

    // Mock Login
    const mockProfiles = JSON.parse(localStorage.getItem('dreamline_users') || '[]');
    const profile = mockProfiles.find((p: any) => p.email === email);
    if (profile) {
      // If password matches (any password accepted for mock development, simple)
      saveMockUser(profile);
    } else {
      // Auto register for convenience in testing mock mode, or throw error
      if (email === 'admin@dreamline.com' || email.startsWith('admin')) {
        const adminProfile: UserProfile = {
          uid: `mock-admin-${Date.now()}`,
          email,
          displayName: 'Administrator',
          role: 'admin',
          enrolledCourses: [],
          courseProgress: {},
          completedLessons: {},
          savedTutorials: [],
          recentlyWatched: [],
          downloads: []
        };
        saveMockUser(adminProfile);
      } else {
        throw new Error('User not found. Please click Register to create an account.');
      }
    }
  };

  // Register handler
  const register = async (email: string, password: string, displayName: string) => {
    if (isFirebaseEnabled && auth) {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const profile: UserProfile = {
        uid: result.user.uid,
        email,
        displayName,
        role: email === 'admin@dreamline.com' ? 'admin' : 'user',
        enrolledCourses: [],
        courseProgress: {},
        completedLessons: {},
        savedTutorials: [],
        recentlyWatched: [],
        downloads: []
      };
      await createUserProfile(profile);
      setUser(profile);
      return;
    }

    // Mock Register
    const profile: UserProfile = {
      uid: `mock-user-${Date.now()}`,
      email,
      displayName,
      role: email === 'admin@dreamline.com' ? 'admin' : 'user',
      enrolledCourses: [],
      courseProgress: {},
      completedLessons: {},
      savedTutorials: [],
      recentlyWatched: [],
      downloads: []
    };
    saveMockUser(profile);
  };

  // Google Signin
  const loginWithGoogle = async () => {
    if (isFirebaseEnabled && auth) {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      return;
    }

    // Mock Google Login
    const googleProfile: UserProfile = {
      uid: `mock-google-${Date.now()}`,
      email: 'google.creator@dreamline.com',
      displayName: 'Google Creative Creator',
      photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60',
      role: 'user',
      enrolledCourses: [],
      courseProgress: {},
      completedLessons: {},
      savedTutorials: [],
      recentlyWatched: [],
      downloads: []
    };
    saveMockUser(googleProfile);
  };

  // Logout handler
  const logout = async () => {
    if (isFirebaseEnabled && auth) {
      await signOut(auth);
      setUser(null);
      return;
    }

    // Mock Logout
    saveMockUser(null);
  };

  // User details modifiers
  const updateUserBio = async (bio: string) => {
    if (!user) return;
    const updated = { ...user, bio };
    if (isFirebaseEnabled) {
      await updateUserProfile(user.uid, { bio });
      setUser(updated);
    } else {
      saveMockUser(updated);
    }
  };

  const updateUserProfilePic = async (photoURL: string) => {
    if (!user) return;
    const updated = { ...user, photoURL };
    if (isFirebaseEnabled) {
      await updateUserProfile(user.uid, { photoURL });
      setUser(updated);
    } else {
      saveMockUser(updated);
    }
  };

  // Enroll in Course
  const enrollInCourse = async (courseId: string) => {
    if (!user) return;
    if (user.enrolledCourses.includes(courseId)) return;

    const updatedCourses = [...user.enrolledCourses, courseId];
    const updatedProgress = { ...user.courseProgress, [courseId]: 0 };
    const updatedLessons = { ...user.completedLessons, [courseId]: [] };

    const updatedProfile = {
      ...user,
      enrolledCourses: updatedCourses,
      courseProgress: updatedProgress,
      completedLessons: updatedLessons
    };

    if (isFirebaseEnabled) {
      await updateUserProfile(user.uid, {
        enrolledCourses: updatedCourses,
        courseProgress: updatedProgress,
        completedLessons: updatedLessons
      });
      setUser(updatedProfile);
    } else {
      saveMockUser(updatedProfile);
    }
  };

  // Track Lesson Progress
  const completeLesson = async (courseId: string, lessonId: string) => {
    if (!user) return;
    
    const currentCompleted = user.completedLessons[courseId] || [];
    if (currentCompleted.includes(lessonId)) return; // Already completed

    const newCompleted = [...currentCompleted, lessonId];
    
    // We need to know total lessons for this course to calculate percentage progress
    // We will do a generic calculation, e.g., assuming 4/5 lessons depending on course,
    // or set a default progress percentage. 
    // In our course mock schema: Graphic Design has 5 lessons, Premiere has 4, After Effects has 3.
    let totalLessons = 5;
    if (courseId === 'course-2') totalLessons = 4;
    if (courseId === 'course-3') totalLessons = 3;

    const progressPercentage = Math.round((newCompleted.length / totalLessons) * 100);

    const updatedLessons = {
      ...user.completedLessons,
      [courseId]: newCompleted
    };

    const updatedProgress = {
      ...user.courseProgress,
      [courseId]: progressPercentage
    };

    const updatedProfile = {
      ...user,
      completedLessons: updatedLessons,
      courseProgress: updatedProgress
    };

    if (isFirebaseEnabled) {
      await updateUserProfile(user.uid, {
        completedLessons: updatedLessons,
        courseProgress: updatedProgress
      });
      setUser(updatedProfile);
    } else {
      saveMockUser(updatedProfile);
    }
  };

  // Saved Tutorials bookmarks
  const toggleSaveTutorial = async (tutorialId: string) => {
    if (!user) return;

    let updatedSaved: string[];
    if (user.savedTutorials.includes(tutorialId)) {
      updatedSaved = user.savedTutorials.filter(id => id !== tutorialId);
    } else {
      updatedSaved = [...user.savedTutorials, tutorialId];
    }

    const updatedProfile = {
      ...user,
      savedTutorials: updatedSaved
    };

    if (isFirebaseEnabled) {
      await updateUserProfile(user.uid, { savedTutorials: updatedSaved });
      setUser(updatedProfile);
    } else {
      saveMockUser(updatedProfile);
    }
  };

  // Recently watched tracking
  const addRecentlyWatched = async (id: string) => {
    if (!user) return;
    
    // Maintain a list of max 5 recently watched
    const current = user.recentlyWatched.filter(item => item !== id);
    const updated = [id, ...current].slice(0, 5);

    const updatedProfile = {
      ...user,
      recentlyWatched: updated
    };

    if (isFirebaseEnabled) {
      await updateUserProfile(user.uid, { recentlyWatched: updated });
      setUser(updatedProfile);
    } else {
      saveMockUser(updatedProfile);
    }
  };

  // Track asset downloads
  const trackDownload = async (resourceId: string) => {
    if (!user) return;
    if (user.downloads.includes(resourceId)) return;

    const updatedDownloads = [...user.downloads, resourceId];
    const updatedProfile = {
      ...user,
      downloads: updatedDownloads
    };

    if (isFirebaseEnabled) {
      await updateUserProfile(user.uid, { downloads: updatedDownloads });
      setUser(updatedProfile);
    } else {
      saveMockUser(updatedProfile);
    }
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        user,
        loading,
        login,
        register,
        loginWithGoogle,
        logout,
        updateUserBio,
        updateUserProfilePic,
        enrollInCourse,
        completeLesson,
        toggleSaveTutorial,
        addRecentlyWatched,
        trackDownload
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
