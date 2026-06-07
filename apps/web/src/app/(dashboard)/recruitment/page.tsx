'use client';

import { useState } from 'react';
import { Briefcase, Plus, Users, Star, Calendar, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

const VACANCIES = [
  { id: 'v1', title: 'Senior React Developer', dept: 'IT', type: 'FULL_TIME', location: 'Tashkent', remote: true, status: 'PUBLISHED', candidates: 12, published: '2024-05-20' },
  { id: 'v2', title: 'HR Specialist', dept: 'Human Resources', type: 'FULL_TIME', location: 'Tashkent', remote: false, status: 'PUBLISHED', candidates: 8, published: '2024-05-22' },
  { id: 'v3', title: 'Financial Analyst', dept: 'Finance', type: 'FULL_TIME', location: 'Samarkand', remote: false, status: 'ON_HOLD', candidates: 5, published: '2024-05-10' },
  { id: 'v4', title: 'Sales Manager', dept: 'Sales', type: 'FULL_TIME', location: 'Tashkent', remote: false, status: 'DRAFT', candidates: 0, published: null },
];

const PIPELINE_STAGES = [
  { key: 'NEW', label: 'New', color: 'bg-gray-100 text-gray-700', count: 5 },
  { key: 'SCREENING', label: 'Screening', color: 'bg-blue-100 text-blue-700', count: 8 },
  { key: 'INTERVIEW_1', label: 'Interview 1', color: 'bg-purple-100 text-purple-700', count: 4 },
  { key: 'INTERVIEW_2', label: 'Interview 2', color: 'bg-indigo-100 text-indigo-700', count: 2 },
  { key: 'OFFER', label: 'Offer', color: 'bg-orange-100 text-orange-700', count: 1 },
  { key: 'HIRED', label: 'Hired', color: 'bg-green-100 text-green-700', count: 3 },
];

const CANDIDATES = [
  { id: 'c1', name: 'Doniyor Yusupov', vacancy: 'Senior React Developer', stage: 'INTERVIEW_1', rating: 4, date: '2024-05-25', source: 'LinkedIn' },
  { id: 'c2', name: 'Sarvinoz Mirzaeva', vacancy: 'HR Specialist', stage: 'SCREENING', rating: 5, date: '2024-05-24', source: 'Direct' },
  { id: 'c3', name: 'Behruz Toshpulatov', vacancy: 'Senior React Developer', stage: 'OFFER', rating: 5, date: '2024-05-23', source: 'Referral' },
  { id: 'c4', name: 'Mohichehra Raximova', vacancy: 'Financial Analyst', stage: 'NEW', rating: 3, date: '2024-05-21', source: 'OLX Jobs' },
  { id: 'c5', name: 'Jahongir Nazarov', vacancy: 'Senior React Developer', stage: 'SCREENING', rating: 4, date: '2024-05-20', source: 'HH.uz' },
];

const VACANCY_STATUS: Record<string, string> = {
  PUBLISHED: 'badge-green', DRAFT: 'badge-gray', ON_HOLD: 'badge-yellow', CLOSED: 'badge-red', FILLED: 'badge-blue',
};

export default function RecruitmentPage() {
  const [activeVacancy, setActiveVacancy] = useState(VACANCIES[0]);
  const [activeTab, setActiveTab] = useState<'pipeline' | 'list'>('pipeline');

  const stageCandidates = PIPELINE_STAGES.map((stage) => ({
    ...stage,
    candidates: CANDIDATES.filter((c) => c.stage === stage.key && c.vacancy === activeVacancy.title),
  }));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Recruitment (ATS)</h1>
          <p className="page-subtitle">Manage vacancies, candidates and hiring pipeline</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary"><Users className="w-4 h-4" />Candidate Pool</button>
          <button className="btn-primary"><Plus className="w-4 h-4" />New Vacancy</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Open Vacancies', value: '4', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Total Candidates', value: '25', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Interviews This Week', value: '6', icon: Calendar, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Hired This Month', value: '3', icon: Star, color: 'text-green-600', bg: 'bg-green-50' },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">{s.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{s.value}</p>
              </div>
              <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center', s.bg)}>
                <s.icon className={cn('w-5 h-5', s.color)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Vacancies list */}
        <div className="card overflow-hidden">
          <div className="px-4 py-3.5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-sm text-gray-900">Vacancies</h3>
            <button className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center hover:bg-blue-100">
              <Plus className="w-3.5 h-3.5 text-blue-600" />
            </button>
          </div>
          <div className="p-2">
            {VACANCIES.map((v) => (
              <button
                key={v.id}
                onClick={() => setActiveVacancy(v)}
                className={cn(
                  'w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors mb-1',
                  activeVacancy.id === v.id && 'bg-blue-50 border border-blue-100',
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-gray-800 truncate">{v.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{v.dept} · {v.location}</div>
                  </div>
                  <span className={VACANCY_STATUS[v.status] + ' flex-shrink-0'}>{v.status}</span>
                </div>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                  <span className="flex items-center gap-0.5"><Users className="w-3 h-3" />{v.candidates}</span>
                  {v.remote && <span className="badge-blue">Remote</span>}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Pipeline */}
        <div className="lg:col-span-3 card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div>
              <h3 className="font-semibold text-sm text-gray-900">{activeVacancy.title}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{activeVacancy.candidates} candidates total</p>
            </div>
            <div className="flex gap-1 bg-gray-100 p-0.5 rounded-lg">
              {(['pipeline', 'list'] as const).map((t) => (
                <button key={t} onClick={() => setActiveTab(t)}
                  className={cn('px-3 py-1.5 text-xs font-medium rounded-md transition-all', activeTab === t ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500')}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {activeTab === 'pipeline' ? (
            <div className="p-4 overflow-x-auto">
              <div className="flex gap-3 min-w-max">
                {stageCandidates.map((stage) => (
                  <div key={stage.key} className="w-52 flex-shrink-0">
                    <div className={cn('flex items-center justify-between px-3 py-2 rounded-lg mb-2', stage.color)}>
                      <span className="text-xs font-semibold">{stage.label}</span>
                      <span className="text-xs font-bold">{stage.count}</span>
                    </div>
                    <div className="space-y-2">
                      {stage.candidates.map((c) => (
                        <div key={c.id} className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm hover:shadow-card-hover cursor-pointer transition-all">
                          <div className="font-medium text-xs text-gray-800">{c.name}</div>
                          <div className="flex items-center gap-1 mt-1.5">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star key={i} className={cn('w-3 h-3', i < c.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200')} />
                            ))}
                          </div>
                          <div className="text-[10px] text-gray-400 mt-1.5">{c.source}</div>
                        </div>
                      ))}
                      {stage.candidates.length === 0 && (
                        <div className="border-2 border-dashed border-gray-100 rounded-lg p-3 text-center text-xs text-gray-300">
                          No candidates
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="table-header">Candidate</th>
                    <th className="table-header">Stage</th>
                    <th className="table-header">Rating</th>
                    <th className="table-header">Source</th>
                    <th className="table-header">Date</th>
                    <th className="table-header w-16">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {CANDIDATES.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50/50">
                      <td className="table-cell font-medium text-gray-800">{c.name}</td>
                      <td className="table-cell">
                        <span className={PIPELINE_STAGES.find(s => s.key === c.stage)?.color || 'badge-gray'}>
                          {PIPELINE_STAGES.find(s => s.key === c.stage)?.label}
                        </span>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star key={i} className={cn('w-3.5 h-3.5', i < c.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200')} />
                          ))}
                        </div>
                      </td>
                      <td className="table-cell text-gray-500">{c.source}</td>
                      <td className="table-cell text-gray-400">{c.date}</td>
                      <td className="table-cell">
                        <button className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center">
                          <MoreHorizontal className="w-3.5 h-3.5 text-gray-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
