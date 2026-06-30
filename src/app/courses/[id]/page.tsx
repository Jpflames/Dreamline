'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { getItemById, Course, Lesson } from '@/lib/db';
import { 
  Lock, 
  Play, 
  CheckCircle2, 
  ArrowLeft, 
  BookOpen, 
  Award, 
  Trophy, 
  PlayCircle,
  FileVideo
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Link from 'next/link';

export default function CourseDetail() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const { user, enrollInCourse, completeLesson, addRecentlyWatched } = useApp();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [loadingCourse, setLoadingCourse] = useState(true);
  
  // Active Video Lesson player state
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  // Load Course Details
  useEffect(() => {
    async function loadCourse() {
      const data = await getItemById<Course>('courses', courseId);
      if (data) {
        setCourse(data);
        // By default, set the first lesson as active
        if (data.lessons.length > 0) {
          setActiveLesson(data.lessons[0]);
        }
      }
      setLoadingCourse(false);
    }
    loadCourse();
  }, [courseId]);

  if (loadingCourse) {
    return <div className="text-center py-20 font-inter text-muted-foreground">Loading course content roadmap...</div>;
  }

  if (!course) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold font-poppins">Course Not Found</h2>
        <p className="text-muted-foreground text-sm">The course you are looking for does not exist or has been deleted.</p>
        <Link href="/courses" className="inline-flex items-center text-primary font-semibold hover:underline">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to Courses
        </Link>
      </div>
    );
  }

  const isEnrolled = user?.enrolledCourses.includes(course.id);
  const completedList = user?.completedLessons[course.id] || [];
  const progress = user?.courseProgress[course.id] || 0;

  const handleLessonSelect = (lesson: Lesson) => {
    if (!isEnrolled) return; // Locked
    setActiveLesson(lesson);
    addRecentlyWatched(lesson.id);
  };

  const handleCompleteLesson = async () => {
    if (!activeLesson || !isEnrolled) return;
    
    // Complete lesson in Context
    await completeLesson(course.id, activeLesson.id);
    
    // Check if course is 100% completed
    const updatedCompletedCount = completedList.includes(activeLesson.id) 
      ? completedList.length 
      : completedList.length + 1;
      
    if (updatedCompletedCount === course.lessons.length) {
      // Fire confetti celebrating course completion
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      
      {/* Back button */}
      <div>
        <Link href="/courses" className="inline-flex items-center text-sm font-semibold text-primary hover:underline">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to Courses
        </Link>
      </div>

      {/* Hero Banner Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        
        {/* Course Info Header block */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-border shadow-sm bg-black">
            {isEnrolled && activeLesson ? (
              <video
                key={activeLesson.id}
                src={activeLesson.videoURL}
                controls
                autoPlay
                className="h-full w-full object-contain"
              />
            ) : (
              <>
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="h-full w-full object-cover filter brightness-[0.4]"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white space-y-4">
                  <Lock className="h-12 w-12 text-slate-400" />
                  <h3 className="text-xl font-bold font-poppins max-w-md">Enroll to Unlock this Course</h3>
                  <p className="text-sm text-slate-300 max-w-sm">Access structured lessons, download resource assets, and track progress.</p>
                  <button
                    onClick={() => {
                      if (user) {
                        enrollInCourse(course.id);
                      } else {
                        router.push('/login');
                      }
                    }}
                    className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-violet-700 transition-colors shadow-lg cursor-pointer"
                  >
                    Enroll Now (Free)
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-lg bg-violet-600/10 text-violet-600 border border-violet-500/10 px-2.5 py-0.5 text-xs font-semibold">
                {course.difficulty}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5" />
                {course.lessons.length} Lessons
              </span>
            </div>
            <h1 className="text-3xl font-bold font-poppins leading-tight">{course.title}</h1>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">{course.description}</p>
          </div>
        </div>

        {/* Sidebar Controls: Lessons List & Enroll box */}
        <div className="space-y-6">
          
          {/* Enrollment / Progress Box */}
          <div className="rounded-2xl border border-border bg-card p-6 dark:bg-slate-900 shadow-sm space-y-4">
            <h3 className="text-lg font-bold font-poppins">Course Progress</h3>
            
            {isEnrolled ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span className="flex items-center gap-1">
                    <Trophy className="h-4.5 w-4.5 text-yellow-500" />
                    Completed
                  </span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-violet-600 transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-xs text-muted-foreground">
                  {completedList.length} of {course.lessons.length} lessons checked off.
                </p>
                {/* Complete current lesson button */}
                {activeLesson && !completedList.includes(activeLesson.id) && (
                  <button
                    onClick={handleCompleteLesson}
                    className="w-full rounded-xl bg-green-600 py-3 text-sm font-semibold text-white hover:bg-green-700 transition-colors shadow-sm cursor-pointer"
                  >
                    Mark Lesson as Completed
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Start learning today. Study vector geometry, composition grids, keyframe tracks, and variables variables at your own pace.
                </p>
                <button
                  onClick={() => {
                    if (user) {
                      enrollInCourse(course.id);
                    } else {
                      router.push('/login');
                    }
                  }}
                  className="w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-white hover:bg-violet-700 transition-colors shadow-md cursor-pointer"
                >
                  Enroll in Course
                </button>
              </div>
            )}
          </div>

          {/* Lessons Timeline List */}
          <div className="rounded-2xl border border-border bg-card dark:bg-slate-900 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border bg-slate-50 dark:bg-slate-950/40">
              <h3 className="text-md font-bold font-poppins">Lessons Roadmap</h3>
            </div>
            
            <div className="divide-y divide-border">
              {course.lessons.map((lesson, idx) => {
                const isCompleted = completedList.includes(lesson.id);
                const isSelected = activeLesson?.id === lesson.id;

                return (
                  <div
                    key={lesson.id}
                    onClick={() => handleLessonSelect(lesson)}
                    className={`flex items-start space-x-3 p-4 transition-colors ${
                      !isEnrolled 
                        ? 'opacity-60 cursor-not-allowed' 
                        : 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-950/20'
                    } ${isSelected && isEnrolled ? 'bg-violet-500/10 text-primary dark:bg-violet-950/20' : ''}`}
                  >
                    <div className="mt-0.5">
                      {!isEnrolled ? (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      ) : isCompleted ? (
                        <CheckCircle2 className="h-4.5 w-4.5 text-green-500 fill-green-500/10" />
                      ) : (
                        <PlayCircle className={`h-4.5 w-4.5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <div className="text-xs font-semibold text-muted-foreground">Lesson {idx + 1}</div>
                      <div className="text-sm font-bold line-clamp-1 leading-snug">{lesson.title}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <FileVideo className="h-3 w-3" />
                        {lesson.duration}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
