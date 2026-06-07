'use client';

import { useState } from 'react';
import {
  BookOpen, Play, Clock, Users, Star, Award, TrendingUp,
  Search, Filter, CheckCircle2, Lock, BarChart3, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'catalog', label: 'Course Catalog' },
  { id: 'my', label: 'My Learning' },
  { id: 'progress', label: 'Team Progress' },
];

const courses = [
  {
    id: '1', title: 'Onboarding: Company Culture & Values', category: 'Onboarding',
    duration: '2h 30m', lessons: 12, enrolled: 48, rating: 4.8,
    level: 'Beginner', thumbnail: '🏢', completed: true, progress: 100,
  },
  {
    id: '2', title: 'Labor Law in Uzbekistan (2024)', category: 'Legal',
    duration: '4h 15m', lessons: 18, enrolled: 32, rating: 4.6,
    level: 'Intermediate', thumbnail: '⚖️', completed: false, progress: 65,
  },
  {
    id: '3', title: 'Leadership & Team Management', category: 'Management',
    duration: '6h 00m', lessons: 24, enrolled: 15, rating: 4.9,
    level: 'Advanced', thumbnail: '🎯', completed: false, progress: 30,
  },
  {
    id: '4', title: 'Excel & Google Sheets for HR', category: 'Tools',
    duration: '3h 45m', lessons: 15, enrolled: 25, rating: 4.5,
    level: 'Beginner', thumbnail: '📊', completed: false, progress: 0, locked: true,
  },
  {
    id: '5', title: 'Performance Management & KPI', category: 'HR',
    duration: '5h 00m', lessons: 20, enrolled: 20, rating: 4.7,
    level: 'Intermediate', thumbnail: '📈', completed: false, progress: 0,
  },
  {
    id: '6', title: 'Communication Skills in the Workplace', category: 'Soft Skills',
    duration: '2h 00m', lessons: 10, enrolled: 40, rating: 4.8,
    level: 'Beginner', thumbnail: '💬', completed: true, progress: 100,
  },
];

const teamProgress = [
  { name: 'Engineering', completed: 85, inProgress: 10, notStarted: 5, members: 18 },
  { name: 'Human Resources', completed: 92, inProgress: 5, notStarted: 3, members: 8 },
  { name: 'Sales', completed: 70, inProgress: 20, notStarted: 10, members: 12 },
  { name: 'Finance', completed: 78, inProgress: 15, notStarted: 7, members: 7 },
];

const levelColors: Record<string, string> = {
  Beginner: 'bg-green-50 text-green-700',
  Intermediate: 'bg-yellow-50 text-yellow-700',
  Advanced: 'bg-red-50 text-red-700',
};

const categoryColors: Record<string, string> = {
  Onboarding: 'bg-blue-50 text-blue-700',
  Legal: 'bg-purple-50 text-purple-700',
  Management: 'bg-orange-50 text-orange-700',
  Tools: 'bg-gray-50 text-gray-700',
  HR: 'bg-indigo-50 text-indigo-700',
  'Soft Skills': 'bg-pink-50 text-pink-700',
};

export default function TrainingPage() {
  const [activeTab, setActiveTab] = useState('catalog');
  const [search, setSearch] = useState('');

  const myCourses = courses.filter((c) => c.progress > 0);
  const filteredCourses = courses.filter((c) =>
    !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.category.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { label: 'Courses Available', value: courses.length, icon: BookOpen, color: 'text-blue-600' },
    { label: 'Completed', value: courses.filter((c) => c.completed).length, icon: CheckCircle2, color: 'text-green-600' },
    { label: 'In Progress', value: myCourses.filter((c) => !c.completed).length, icon: TrendingUp, color: 'text-orange-600' },
    { label: 'Certificates', value: 2, icon: Award, color: 'text-purple-600' },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Training & LMS</h1>
          <p className="page-subtitle">Develop your skills and track team learning progress</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card p-4 flex items-center gap-3">
              <div className={cn('w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center', s.color)}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              activeTab === tab.id ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Course Catalog */}
      {activeTab === 'catalog' && (
        <>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses..."
              className="input-field pl-9 w-72"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {filteredCourses.map((course) => (
              <div key={course.id} className={cn('card p-5 space-y-4 transition-all hover:shadow-md', course.locked && 'opacity-60')}>
                <div className="flex items-start justify-between">
                  <div className="text-3xl">{course.thumbnail}</div>
                  <div className="flex items-center gap-1.5">
                    {course.completed && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                    {course.locked && <Lock className="w-4 h-4 text-gray-400" />}
                    <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', levelColors[course.level])}>
                      {course.level}
                    </span>
                  </div>
                </div>
                <div>
                  <span className={cn('text-xs px-2 py-0.5 rounded-md font-medium', categoryColors[course.category])}>
                    {course.category}
                  </span>
                  <h3 className="text-sm font-semibold text-gray-900 mt-2 leading-snug">{course.title}</h3>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {course.duration}</span>
                  <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {course.lessons} lessons</span>
                  <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400" /> {course.rating}</span>
                </div>
                {course.progress > 0 && (
                  <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Progress</span><span>{course.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={cn('h-full rounded-full', course.completed ? 'bg-green-500' : 'bg-blue-500')}
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                )}
                <button
                  className={cn(
                    'w-full py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2',
                    course.locked ? 'bg-gray-100 text-gray-400 cursor-not-allowed' :
                    course.completed ? 'bg-green-50 text-green-700 hover:bg-green-100' :
                    course.progress > 0 ? 'btn-primary' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                  )}
                  disabled={course.locked}
                >
                  {course.locked ? <><Lock className="w-3.5 h-3.5" /> Locked</> :
                   course.completed ? <><CheckCircle2 className="w-3.5 h-3.5" /> Completed</> :
                   course.progress > 0 ? <><Play className="w-3.5 h-3.5" /> Continue</> :
                   <><Play className="w-3.5 h-3.5" /> Start Course</>}
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* My Learning */}
      {activeTab === 'my' && (
        <div className="space-y-3">
          {myCourses.map((course) => (
            <div key={course.id} className="card p-5 flex items-center gap-5">
              <div className="text-3xl">{course.thumbnail}</div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-900">{course.title}</div>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {course.duration}</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {course.enrolled} enrolled</span>
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full', course.completed ? 'bg-green-500' : 'bg-blue-500')}
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-8 text-right">{course.progress}%</span>
                </div>
              </div>
              <button className="btn-secondary text-sm gap-1.5">
                {course.completed ? 'Review' : 'Continue'} <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Team Progress */}
      {activeTab === 'progress' && (
        <div className="space-y-3">
          {teamProgress.map((dept) => (
            <div key={dept.name} className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm font-semibold text-gray-900">{dept.name}</div>
                  <div className="text-xs text-gray-400">{dept.members} members</div>
                </div>
                <div className="text-sm font-bold text-blue-600">{dept.completed}% complete</div>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden flex">
                <div className="bg-green-500 h-full transition-all" style={{ width: `${dept.completed}%` }} />
                <div className="bg-blue-400 h-full transition-all" style={{ width: `${dept.inProgress}%` }} />
              </div>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> Completed: {dept.completed}%</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400" /> In Progress: {dept.inProgress}%</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-200" /> Not Started: {dept.notStarted}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
