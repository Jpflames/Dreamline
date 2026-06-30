import { isFirebaseEnabled, db } from './firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  setDoc,
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  increment
} from 'firebase/firestore';

let forceMockFallback = false;

export function isFirebaseActive(): boolean {
  return isFirebaseEnabled && !forceMockFallback;
}

export function handleFirestoreError(error: any) {
  console.error('Firestore Database Operation Error:', error);
  if (error && (
    error.code === 'permission-denied' || 
    error.message?.includes('permission') || 
    error.message?.includes('Permission') || 
    error.code === 'unimplemented'
  )) {
    console.warn('Firebase security permissions restricted. Gracefully falling back to mock localStorage database for this session.');
    forceMockFallback = true;
  }
}

// Types Definitions
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'admin' | 'user';
  enrolledCourses: string[]; // Course IDs
  courseProgress: { [courseId: string]: number }; // courseId -> percentage
  completedLessons: { [courseId: string]: string[] }; // courseId -> array of lesson titles/IDs
  savedTutorials: string[]; // Tutorial IDs
  recentlyWatched: string[]; // Tutorial/Video IDs
  downloads: string[]; // Resource IDs
  bio?: string;
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoURL: string;
  category: 'Photoshop' | 'Illustrator' | 'Premiere Pro' | 'After Effects' | 'Canva' | 'Figma';
  duration: string;
  instructor: string;
  featured: boolean;
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  imageURL: string;
  category: 'Logos' | 'Flyers' | 'Branding' | 'UI Design' | 'Posters' | 'Social Media' | 'Photography';
  designer: string;
  likes: number;
  likedBy?: string[]; // User IDs who liked this
  shares: number;
  downloads: number;
  downloadAllowed: boolean; // Admin controlled
  featured: boolean;
  createdAt: string;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  youtubeURL: string;
  thumbnail: string;
  category: string;
  featured: boolean;
  createdAt: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoURL: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  lessons: Lesson[];
  price: string;
  featured: boolean;
  createdAt: string;
}

export interface Resource {
  id: string;
  title: string;
  fileURL: string;
  category: 'Fonts' | 'Mockups' | 'Icons' | 'Templates' | 'Color Palettes' | 'PSD Files';
  downloads: number;
  size: string;
  fileType: string;
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  type: 'announcement' | 'challenge' | 'member';
  title: string;
  content: string;
  author: string;
  authorTitle?: string;
  imageURL?: string;
  linkText?: string;
  linkURL?: string;
  createdAt: string;
}

// Initial Mock Data
const defaultTutorials: Tutorial[] = [
  {
    id: 'tut-1',
    title: 'Advanced Photo Manipulation & Blending',
    description: 'Learn professional workflows for blending multiple elements into a cinematic poster using masks, adjustment layers, and lighting.',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60',
    videoURL: 'https://www.w3schools.com/html/mov_bbb.mp4',
    category: 'Photoshop',
    duration: '24 mins',
    instructor: 'Alex Mercer',
    featured: true,
    createdAt: '2026-06-15T10:00:00Z',
  },
  {
    id: 'tut-2',
    title: 'Vector Brand Identity Design from Scratch',
    description: 'Master the pen tool, shape builder, and typography guidelines to create a high-quality responsive corporate logo.',
    thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=60',
    videoURL: 'https://www.w3schools.com/html/movie.mp4',
    category: 'Illustrator',
    duration: '18 mins',
    instructor: 'Sarah Jenkins',
    featured: true,
    createdAt: '2026-06-18T14:30:00Z',
  },
  {
    id: 'tut-3',
    title: 'Cinematic Color Grading & Audio Design',
    description: 'Elevate your footage using Premiere Pro Lumetri Color panels, adjustment layers, and mixing ambient soundtrack layers.',
    thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=60',
    videoURL: 'https://www.w3schools.com/html/mov_bbb.mp4',
    category: 'Premiere Pro',
    duration: '32 mins',
    instructor: 'Marcus Cole',
    featured: true,
    createdAt: '2026-06-20T09:15:00Z',
  },
  {
    id: 'tut-4',
    title: '3D Text Animations & Camera Tracking',
    description: 'Create premium title cards using camera tracker, text extrusions, and particle elements in After Effects.',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60',
    videoURL: 'https://www.w3schools.com/html/movie.mp4',
    category: 'After Effects',
    duration: '40 mins',
    instructor: 'Elena Rostova',
    featured: true,
    createdAt: '2026-06-22T16:00:00Z',
  },
  {
    id: 'tut-5',
    title: 'Design Eye-Catching Social Media Flyers',
    description: 'Learn grid systems, text hierarchies, and asset styling tools directly within Canva for rapid product promotions.',
    thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=60',
    videoURL: 'https://www.w3schools.com/html/mov_bbb.mp4',
    category: 'Canva',
    duration: '12 mins',
    instructor: 'Clara Hayes',
    featured: false,
    createdAt: '2026-06-25T11:00:00Z',
  },
  {
    id: 'tut-6',
    title: 'Dynamic Web App Prototyping & Variables',
    description: 'Master advanced Figma components, auto layouts, interactive hover variables, and wireframe linking.',
    thumbnail: 'https://images.unsplash.com/photo-1581291518655-9523c932eecf?w=800&auto=format&fit=crop&q=60',
    videoURL: 'https://www.w3schools.com/html/movie.mp4',
    category: 'Figma',
    duration: '28 mins',
    instructor: 'Sarah Jenkins',
    featured: false,
    createdAt: '2026-06-28T10:00:00Z',
  }
];

const defaultGallery: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Aether Branding Concept',
    imageURL: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60',
    category: 'Branding',
    designer: 'Elena Rostova',
    likes: 45,
    likedBy: [],
    shares: 12,
    downloads: 8,
    downloadAllowed: true,
    featured: true,
    createdAt: '2026-06-12T08:00:00Z',
  },
  {
    id: 'gal-2',
    title: 'Futuristic Cyberpunk Poster',
    imageURL: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60',
    category: 'Posters',
    designer: 'Marcus Cole',
    likes: 89,
    likedBy: [],
    shares: 34,
    downloads: 24,
    downloadAllowed: true,
    featured: true,
    createdAt: '2026-06-14T11:20:00Z',
  },
  {
    id: 'gal-3',
    title: 'Minimalist Food App UI',
    imageURL: 'https://images.unsplash.com/photo-1581291518655-9523c932eecf?w=800&auto=format&fit=crop&q=60',
    category: 'UI Design',
    designer: 'Sarah Jenkins',
    likes: 56,
    likedBy: [],
    shares: 18,
    downloads: 14,
    downloadAllowed: false,
    featured: true,
    createdAt: '2026-06-16T15:40:00Z',
  },
  {
    id: 'gal-4',
    title: 'Organic Tea Logo Design',
    imageURL: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=60',
    category: 'Logos',
    designer: 'Clara Hayes',
    likes: 38,
    likedBy: [],
    shares: 5,
    downloads: 11,
    downloadAllowed: true,
    featured: true,
    createdAt: '2026-06-18T10:10:00Z',
  },
  {
    id: 'gal-5',
    title: 'Summer Festival Flyer',
    imageURL: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=60',
    category: 'Flyers',
    designer: 'Alex Mercer',
    likes: 72,
    likedBy: [],
    shares: 22,
    downloads: 30,
    downloadAllowed: true,
    featured: false,
    createdAt: '2026-06-20T17:00:00Z',
  },
  {
    id: 'gal-6',
    title: 'Social Media Promotion Template',
    imageURL: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=60',
    category: 'Social Media',
    designer: 'Clara Hayes',
    likes: 29,
    likedBy: [],
    shares: 9,
    downloads: 15,
    downloadAllowed: true,
    featured: false,
    createdAt: '2026-06-22T09:30:00Z',
  },
  {
    id: 'gal-7',
    title: 'Dramatic Portrait Photography',
    imageURL: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=60',
    category: 'Photography',
    designer: 'Marcus Cole',
    likes: 120,
    likedBy: [],
    shares: 41,
    downloads: 0,
    downloadAllowed: false,
    featured: false,
    createdAt: '2026-06-24T12:00:00Z',
  },
  {
    id: 'gal-8',
    title: 'Nova Corporate Identity',
    imageURL: 'https://images.unsplash.com/photo-1618005198143-d366800e4709?w=800&auto=format&fit=crop&q=60',
    category: 'Branding',
    designer: 'Sarah Jenkins',
    likes: 50,
    likedBy: [],
    shares: 11,
    downloads: 6,
    downloadAllowed: true,
    featured: false,
    createdAt: '2026-06-26T14:00:00Z',
  }
];

const defaultYoutube: YouTubeVideo[] = [
  {
    id: 'yt-1',
    title: 'Premiere Pro Essential Editing Tips in 10 Mins',
    youtubeURL: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Placeholder link
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60',
    category: 'Premiere Pro',
    featured: true,
    createdAt: '2026-06-10T10:00:00Z',
  },
  {
    id: 'yt-2',
    title: 'Create Seamless Loops in After Effects',
    youtubeURL: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60',
    category: 'After Effects',
    featured: true,
    createdAt: '2026-06-12T14:00:00Z',
  },
  {
    id: 'yt-3',
    title: 'Figma Auto-Layout v5 Masterclass Tutorial',
    youtubeURL: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1581291518655-9523c932eecf?w=800&auto=format&fit=crop&q=60',
    category: 'Figma',
    featured: true,
    createdAt: '2026-06-14T09:00:00Z',
  },
  {
    id: 'yt-4',
    title: 'Photoshop Camera Raw Color Grading Trick',
    youtubeURL: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=60',
    category: 'Photoshop',
    featured: true,
    createdAt: '2026-06-16T16:00:00Z',
  },
  {
    id: 'yt-5',
    title: 'Logo Design Grid Secret (Step-by-Step)',
    youtubeURL: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=60',
    category: 'Illustrator',
    featured: false,
    createdAt: '2026-06-18T10:00:00Z',
  },
  {
    id: 'yt-6',
    title: 'Easy Canva Branding Kit Walkthrough',
    youtubeURL: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=60',
    category: 'Canva',
    featured: false,
    createdAt: '2026-06-20T11:00:00Z',
  },
  {
    id: 'yt-7',
    title: 'Cinematic Framing Secrets for Photographers',
    youtubeURL: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=60',
    category: 'Photography',
    featured: false,
    createdAt: '2026-06-22T13:00:00Z',
  },
  {
    id: 'yt-8',
    title: 'Make Millions with These Layout Skills',
    youtubeURL: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1618005198143-d366800e4709?w=800&auto=format&fit=crop&q=60',
    category: 'UI Design',
    featured: false,
    createdAt: '2026-06-24T15:00:00Z',
  }
];

const defaultCourses: Course[] = [
  {
    id: 'course-1',
    title: 'Graphic Design Masterclass: Theory & Practice',
    description: 'Learn typography, color theory, layout composition, and professional workflows in Photoshop and Illustrator through real-world projects.',
    thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=60',
    difficulty: 'Beginner',
    lessons: [
      { id: 'c1-l1', title: 'Introduction to Graphic Design Foundations', duration: '12 mins', videoURL: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { id: 'c1-l2', title: 'Mastering the Pen Tool and Anchor Points', duration: '15 mins', videoURL: 'https://www.w3schools.com/html/movie.mp4' },
      { id: 'c1-l3', title: 'The Anatomy of Typography', duration: '18 mins', videoURL: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { id: 'c1-l4', title: 'Color Theory & Harmonization Schemes', duration: '14 mins', videoURL: 'https://www.w3schools.com/html/movie.mp4' },
      { id: 'c1-l5', title: 'Grid Systems & Visual Hierarchy', duration: '20 mins', videoURL: 'https://www.w3schools.com/html/mov_bbb.mp4' }
    ],
    price: 'Free',
    featured: true,
    createdAt: '2026-05-10T10:00:00Z',
  },
  {
    id: 'course-2',
    title: 'Premiere Pro: Intermediate Video Editing Lab',
    description: 'Develop advanced editing styles, audio balancing, sound dynamics, narrative editing flow, and professional color grading tricks.',
    thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=60',
    difficulty: 'Intermediate',
    lessons: [
      { id: 'c2-l1', title: 'Understanding Editing Rhythms & Pacing', duration: '15 mins', videoURL: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { id: 'c2-l2', title: 'Advanced Lumetri Color Grading Lab', duration: '22 mins', videoURL: 'https://www.w3schools.com/html/movie.mp4' },
      { id: 'c2-l3', title: 'Mixing Ambient & Dialog Tracks', duration: '19 mins', videoURL: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { id: 'c2-l4', title: 'Transitions, Keyframes & Kinetic Motion', duration: '25 mins', videoURL: 'https://www.w3schools.com/html/movie.mp4' }
    ],
    price: 'Free',
    featured: true,
    createdAt: '2026-05-15T12:00:00Z',
  },
  {
    id: 'course-3',
    title: 'Advanced Motion Design in After Effects',
    description: 'Dive deep into expressions, spatial keyframing, particle generation, lighting, camera rigs, and composite rendering pipelines.',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60',
    difficulty: 'Advanced',
    lessons: [
      { id: 'c3-l1', title: 'Getting Started with Spatial Expressions', duration: '18 mins', videoURL: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { id: 'c3-l2', title: 'Orchestrating 3D Camera Rig Control', duration: '26 mins', videoURL: 'https://www.w3schools.com/html/movie.mp4' },
      { id: 'c3-l3', title: 'Generating Premium Particle Systems', duration: '30 mins', videoURL: 'https://www.w3schools.com/html/mov_bbb.mp4' }
    ],
    price: 'Free',
    featured: true,
    createdAt: '2026-05-20T15:00:00Z',
  }
];

const defaultResources: Resource[] = [
  {
    id: 'res-1',
    title: 'Avenue Retro Serif Font',
    fileURL: '#',
    category: 'Fonts',
    downloads: 120,
    size: '12.4 MB',
    fileType: 'OTF / TTF',
    createdAt: '2026-06-10T10:00:00Z',
  },
  {
    id: 'res-2',
    title: 'iPhone 15 Pro Clay Mockup PSD',
    fileURL: '#',
    category: 'Mockups',
    downloads: 342,
    size: '48.2 MB',
    fileType: 'PSD (Smart Objects)',
    createdAt: '2026-06-12T14:00:00Z',
  },
  {
    id: 'res-3',
    title: 'Creative Studio 150+ Line Icon Set',
    fileURL: '#',
    category: 'Icons',
    downloads: 215,
    size: '4.8 MB',
    fileType: 'SVG / Figma',
    createdAt: '2026-06-14T09:00:00Z',
  },
  {
    id: 'res-4',
    title: 'Dark Mode Creative Portfolio Template',
    fileURL: '#',
    category: 'Templates',
    downloads: 419,
    size: '18.1 MB',
    fileType: 'Figma File (.fig)',
    createdAt: '2026-06-16T16:00:00Z',
  },
  {
    id: 'res-5',
    title: 'Cyberpunk Neon Color Palette Swatches',
    fileURL: '#',
    category: 'Color Palettes',
    downloads: 87,
    size: '240 KB',
    fileType: 'ASE / PNG',
    createdAt: '2026-06-18T10:00:00Z',
  },
  {
    id: 'res-6',
    title: 'Cinematic Film Poster PSD Template',
    fileURL: '#',
    category: 'PSD Files',
    downloads: 295,
    size: '124 MB',
    fileType: 'PSD (layered)',
    createdAt: '2026-06-20T11:00:00Z',
  }
];

const defaultCommunity: CommunityPost[] = [
  {
    id: 'post-1',
    type: 'announcement',
    title: 'Welcome to Dreamline MVP Release!',
    content: 'We are thrilled to launch the Dreamline MVP creative platform. Explore design resources, tutorials, courses, and submit your artwork to our gallery. Join us in building the ultimate creative academy!',
    author: 'Admin Team',
    authorTitle: 'Platform Founders',
    createdAt: '2026-06-01T10:00:00Z',
  },
  {
    id: 'post-2',
    type: 'challenge',
    title: 'Weekly Challenge: Space Tourism Branding',
    content: 'Create a logo and color scheme for "Orion Travels", a hypothetical space tourism startup. Upload your final banner design to the gallery and tag it #SpaceBranding. Top submissions will be featured on the homepage next week!',
    author: 'Design Moderators',
    authorTitle: 'Dreamline Creative Council',
    imageURL: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60',
    linkText: 'Submit Artwork',
    linkURL: '/gallery',
    createdAt: '2026-06-28T09:00:00Z',
  },
  {
    id: 'post-3',
    type: 'member',
    title: 'Designer Showcase: Elena Rostova',
    content: 'Elena has contributed multiple premium branding templates and creative vectors to our Resources this month. Her UI designs are setting a high benchmark for layout grid systems on the platform. Read her story.',
    author: 'Dreamline Editors',
    authorTitle: 'Member Spotlight',
    imageURL: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=60',
    createdAt: '2026-06-25T14:00:00Z',
  }
];

// Initialize Mock database in LocalStorage
const isServer = typeof window === 'undefined';

function getMockStorage(key: string, defaultValue: any) {
  if (isServer) return defaultValue;
  const stored = localStorage.getItem(`dreamline_${key}`);
  if (!stored) {
    localStorage.setItem(`dreamline_${key}`, JSON.stringify(defaultValue));
    return defaultValue;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return defaultValue;
  }
}

function setMockStorage(key: string, value: any) {
  if (isServer) return;
  localStorage.setItem(`dreamline_${key}`, JSON.stringify(value));
}

// Database client helpers
export async function getCollection<T>(name: string): Promise<T[]> {
  if (isFirebaseActive()) {
    try {
      const q = collection(db, name);
      const querySnapshot = await getDocs(q);
      const data: any[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      // If Firestore collection is empty, fallback to default mock data (to populate database)
      if (data.length === 0) {
        const defaults = getDefaultMockData(name);
        try {
          for (const item of defaults) {
            const { id, ...rest } = item;
            await addDoc(collection(db, name), rest);
          }
        } catch (seedError) {
          console.warn(`Firestore seeding skipped for ${name} due to permissions. Returning offline dataset.`);
        }
        return defaults as T[];
      }
      return data as T[];
    } catch (error) {
      handleFirestoreError(error);
    }
  }

  // LocalStorage Mock
  return getMockStorage(name, getDefaultMockData(name)) as T[];
}

function getDefaultMockData(name: string): any[] {
  switch (name) {
    case 'tutorials': return defaultTutorials;
    case 'gallery': return defaultGallery;
    case 'youtubeVideos': return defaultYoutube;
    case 'courses': return defaultCourses;
    case 'resources': return defaultResources;
    case 'communityPosts': return defaultCommunity;
    default: return [];
  }
}

export async function getItemById<T>(name: string, id: string): Promise<T | null> {
  if (isFirebaseActive()) {
    try {
      const docRef = doc(db, name, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error);
    }
  }

  const items = await getCollection<any>(name);
  return items.find(item => item.id === id) || null;
}

export async function addItem<T>(name: string, item: any): Promise<T> {
  const newItem = {
    ...item,
    id: item.id || `${name.substring(0,3)}-${Date.now()}`,
    createdAt: item.createdAt || new Date().toISOString()
  };

  if (isFirebaseActive()) {
    try {
      const { id, ...rest } = newItem;
      const docRef = await addDoc(collection(db, name), rest);
      return { id: docRef.id, ...rest } as T;
    } catch (error) {
      handleFirestoreError(error);
    }
  }

  const items = await getCollection<any>(name);
  items.unshift(newItem);
  setMockStorage(name, items);
  return newItem as T;
}

export async function updateItem(name: string, id: string, data: any): Promise<boolean> {
  if (isFirebaseActive()) {
    try {
      const docRef = doc(db, name, id);
      await updateDoc(docRef, data);
      return true;
    } catch (error) {
      handleFirestoreError(error);
    }
  }

  const items = await getCollection<any>(name);
  const index = items.findIndex(item => item.id === id);
  if (index !== -1) {
    items[index] = { ...items[index], ...data };
    setMockStorage(name, items);
    return true;
  }
  return false;
}

export async function deleteItem(name: string, id: string): Promise<boolean> {
  if (isFirebaseActive()) {
    try {
      const docRef = doc(db, name, id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      handleFirestoreError(error);
    }
  }

  const items = await getCollection<any>(name);
  const filtered = items.filter(item => item.id !== id);
  if (filtered.length !== items.length) {
    setMockStorage(name, filtered);
    return true;
  }
  return false;
}

export async function incrementCounter(name: string, id: string, field: string): Promise<boolean> {
  if (isFirebaseActive()) {
    try {
      const docRef = doc(db, name, id);
      await updateDoc(docRef, {
        [field]: increment(1)
      });
      return true;
    } catch (error) {
      handleFirestoreError(error);
    }
  }

  const items = await getCollection<any>(name);
  const index = items.findIndex(item => item.id === id);
  if (index !== -1) {
    items[index][field] = (items[index][field] || 0) + 1;
    setMockStorage(name, items);
    return true;
  }
  return false;
}

// User Profiles helpers
const MOCK_PROFILE_KEY = 'dreamline_active_profile';

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (isFirebaseActive()) {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error);
    }
  }

  // LocalStorage mock
  const profiles = getMockStorage('users', []);
  return profiles.find((p: UserProfile) => p.uid === uid) || null;
}

export async function createUserProfile(profile: UserProfile): Promise<UserProfile> {
  if (isFirebaseActive()) {
    try {
      const docRef = doc(db, 'users', profile.uid);
      await setDoc(docRef, profile as any); // Set profile info
      return profile;
    } catch (error) {
      handleFirestoreError(error);
    }
  }

  // Mock persistence
  const profiles = getMockStorage('users', []);
  const index = profiles.findIndex((p: UserProfile) => p.uid === profile.uid);
  if (index !== -1) {
    profiles[index] = profile;
  } else {
    profiles.push(profile);
  }
  setMockStorage('users', profiles);
  return profile;
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<boolean> {
  if (isFirebaseActive()) {
    try {
      const docRef = doc(db, 'users', uid);
      await updateDoc(docRef, data);
      return true;
    } catch (error) {
      handleFirestoreError(error);
    }
  }

  const profiles = getMockStorage('users', []);
  const index = profiles.findIndex((p: UserProfile) => p.uid === uid);
  if (index !== -1) {
    profiles[index] = { ...profiles[index], ...data };
    setMockStorage('users', profiles);
    return true;
  }
  return false;
}
