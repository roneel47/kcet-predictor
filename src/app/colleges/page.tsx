'use client';
// src/app/colleges/page.tsx
import { useState, useEffect, useCallback } from 'react';
import { Search, Building2, MapPin, BadgeCheck } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

interface College {
  college_code: string;
  college_name: string;
  city: string | null;
  district: string | null;
  college_type: string | null;
  autonomous: boolean | null;
  naac_grade: string | null;
}

const TYPE_OPTIONS = ['Government', 'Private', 'Constituent', 'University'];

export default function CollegesPage() {
  const [search, setSearch] = useState('');
  const [colleges, setColleges] = useState<College[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState('');
  const [autonomousFilter, setAutonomousFilter] = useState('');
  const PAGE_SIZE = 20;

  const fetchColleges = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (typeFilter) params.set('college_type', typeFilter);
    if (autonomousFilter) params.set('autonomous', autonomousFilter);
    params.set('page', String(page));
    params.set('limit', String(PAGE_SIZE));

    fetch(`/api/colleges?${params}`)
      .then(r => r.json())
      .then(d => {
        setColleges(d.data ?? []);
        setTotal(d.count ?? 0);
      })
      .finally(() => setLoading(false));
  }, [search, page, typeFilter, autonomousFilter]);

  useEffect(() => {
    const timer = setTimeout(fetchColleges, 300);
    return () => clearTimeout(timer);
  }, [fetchColleges]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Building2 className="w-6 h-6 text-blue-600" />
          College Directory
        </h1>
        <p className="text-slate-500 text-sm mt-1">Browse all 229 engineering colleges in Karnataka</p>
      </div>

      {/* Search + Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or college code..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => { setTypeFilter(''); setPage(1); }}
              className={cn('px-3 py-1 rounded-full text-xs border font-medium', !typeFilter ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400')}
            >All Types</button>
            {TYPE_OPTIONS.map(t => (
              <button
                key={t}
                onClick={() => { setTypeFilter(typeFilter === t ? '' : t); setPage(1); }}
                className={cn('px-3 py-1 rounded-full text-xs border font-medium', typeFilter === t ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400')}
              >{t}</button>
            ))}
          </div>
          <div className="flex gap-2">
            {[{ v: '', l: 'All' }, { v: 'true', l: 'Autonomous' }, { v: 'false', l: 'Non-Autonomous' }].map(opt => (
              <button
                key={opt.v}
                onClick={() => { setAutonomousFilter(opt.v); setPage(1); }}
                className={cn('px-3 py-1 rounded-full text-xs border font-medium', autonomousFilter === opt.v ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400')}
              >{opt.l}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mb-3 text-sm text-slate-500">{total} colleges found</div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 h-32 animate-pulse">
              <div className="bg-slate-200 h-4 rounded w-3/4 mb-3" />
              <div className="bg-slate-100 h-3 rounded w-1/2 mb-2" />
              <div className="bg-slate-100 h-3 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {colleges.map(c => (
            <Link
              key={c.college_code}
              href={`/college/${c.college_code}`}
              className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md hover:border-blue-200 transition-all group"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-slate-900 text-sm leading-snug group-hover:text-blue-700 transition-colors">
                  {c.college_name}
                </h3>
                {c.autonomous && (
                  <BadgeCheck className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500 mb-1.5">
                <MapPin className="w-3 h-3" />
                {c.city ?? c.district ?? 'Karnataka'}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                  {c.college_type}
                </span>
                <span className="text-xs text-slate-400">{c.college_code}</span>
                {c.naac_grade && (
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                    NAAC {c.naac_grade}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm disabled:opacity-40 hover:bg-slate-50">
            ← Previous
          </button>
          <span className="text-sm text-slate-600">{page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm disabled:opacity-40 hover:bg-slate-50">
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
