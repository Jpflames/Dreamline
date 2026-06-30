'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { getCollection, Course } from '@/lib/db';
import { BookOpen, Award, CheckCircle, ArrowRight, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Courses() {
  const { user, enrollInCourse } = useApp();
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    async function loadCourses() {
      const allCourses = await getCollection<Course>('courses');
      setCourses(allCourses);
    }
    loadCourses();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      
      {/* Header Summary */}
      <div className="text-center sm:text-left mb-10 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight font-poppins">Structured Courses</h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">
          Develop high-paying creative skills. Master design principles, timeline sequencing, camera tracking, and UX prototyping step-by-step.
        </p>
      </div>

      {/* Courses grid */}
      <div className="grid gap-8 md:grid-cols-3">
        {courses.map((course) => {
          const isEnrolled = user?.enrolledCourses.includes(course.id);
          const progress = user?.courseProgress[course.id] || 0;

          return (
            <motion.div
              key={course.id}
              whileHover={{ y: -6 }}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card dark:bg-slate-900 transition-all duration-300 shadow-sm"
            >
              <div>
                {/* Thumbnail aspect-ratio */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="h-full w-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 rounded-lg bg-black/70 px-2.5 py-1 text-xs font-semibold text-white flex items-center gap-1">
                    <Award className="h-3.5 w-3.5" />
                    <span>{course.difficulty}</span>
                  </div>
                  <div className="absolute top-3 right-3 rounded-lg bg-black/70 px-2.5 py-1 text-xs font-semibold text-white flex items-center gap-1">
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>{course.lessons.length} Lessons</span>
                  </div>
                </div>

                {/* Body details */}
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-bold font-poppins leading-snug group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {course.description}
                  </p>
                </div>
              </div>

              {/* Bottom Buttons / Enrollment details */}
              <div className="p-6 pt-0 space-y-4">
                
                {/* Progress bar tracking */}
                {isEnrolled ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <span className="flex items-center gap-1">
                        <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                        Active Progress
                      </span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-violet-600 transition-all duration-500" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <span>Pricing:</span>
                    <span className="font-semibold text-foreground bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-0.5 rounded">Free Access</span>
                  </div>
                )}

                {/* Navigation links */}
                <div className="flex items-center gap-3">
                  <Link
                    href={`/courses/${course.id}`}
                    className="flex-1 text-center rounded-xl border border-border py-3.5 text-sm font-semibold hover:bg-accent transition-colors"
                  >
                    View Details
                  </Link>
                  {isEnrolled ? (
                    <Link
                      href={`/courses/${course.id}`}
                      className="flex-1 text-center rounded-xl bg-violet-600 text-white py-3.5 text-sm font-semibold hover:bg-violet-700 transition-colors flex items-center justify-center gap-1"
                    >
                      Learn
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  ) : (
                    <button
                      onClick={() => {
                        if (user) {
                          enrollInCourse(course.id);
                        } else {
                          window.location.href = '/login';
                        }
                      }}
                      className="flex-1 text-center rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground hover:bg-violet-700 transition-colors cursor-pointer"
                    >
                      Enroll Now
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
