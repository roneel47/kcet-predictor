'use client';
// src/app/search/page.tsx
import { useState, useEffect, useMemo } from 'react';
import { Search, BookOpen } from 'lucide-react';
import { BRANCH_GROUPS } from '@/lib/types';

export default function BranchSearchPage() {
  const [branches, setBranches] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/branches').then(r => r.json()).then(d => setBranches(d.data ?? []));
  }, []);

  const filtered = useMemo(() => {
    let data = branches;
    if (selectedGroup && BRANCH_GROUPS[selectedGroup]) {
      data = data.filter(b => BRANCH_GROUPS[selectedGroup].includes(b));
    }
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(b => b.toLowerCase().includes(q));
    }
    return data;
  }, [branches, search, selectedGroup]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-600" />
          Branch Directory
        </h1>
        <p className="text-slate-500 text-sm mt-1">Browse all 104 engineering branches offered in Karnataka</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search branches..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Filter by Group</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedGroup(null)}
              className={`px-3 py-1.5 rounded-full text-xs border font-medium transition-all ${!selectedGroup ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-300 hover:border-blue-400'}`}
            >
              All ({branches.length})
            </button>
            {Object.entries(BRANCH_GROUPS).map(([group, brs]) => (
              <button
                key={group}
                onClick={() => setSelectedGroup(selectedGroup === group ? null : group)}
                className={`px-3 py-1.5 rounded-full text-xs border font-medium transition-all ${selectedGroup === group ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-300 hover:border-blue-400'}`}
              >
                {group} ({brs.filter(b => branches.includes(b)).length})
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-3 text-sm text-slate-500">{filtered.length} branches found</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map((branch) => {
          const group = Object.entries(BRANCH_GROUPS).find(([, brs]) => brs.includes(branch))?.[0];
          return (
            <div key={branch} className="bg-white rounded-xl border border-slate-200 px-4 py-3 hover:border-blue-200 hover:shadow-sm transition-all">
              <p className="font-medium text-slate-800 text-sm leading-snug">{branch}</p>
              {group && (
                <p className="text-xs text-blue-600 mt-1">{group}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
