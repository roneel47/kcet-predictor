'use client';
// src/app/results/page.tsx
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Download, ArrowLeft, Search, SlidersHorizontal, ChevronUp, ChevronDown } from 'lucide-react';
import { PredictionResult, RecommendationLevel, RECOMMENDATION_ORDER } from '@/lib/types';
import { RecommendationBadge } from '@/components/shared/RecommendationBadge';
import { toCsv } from '@/lib/utils/export';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

type SortKey = 'recommendation' | 'cutoff_rank' | 'college_name' | 'branch_name';
type SortDir = 'asc' | 'desc';

export default function ResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<PredictionResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterLevel, setFilterLevel] = useState<RecommendationLevel | 'All'>('All');
  const [sortKey, setSortKey] = useState<SortKey>('recommendation');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 25;

  useEffect(() => {
    const stored = sessionStorage.getItem('kcet_predict_request');
    if (!stored) { router.push('/'); return; }

    const body = JSON.parse(stored);
    fetch('/api/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
      .then(r => r.json())
      .then(d => {
        if (d.success) setResults(d.results);
        else setError(d.error ?? 'Failed to fetch predictions');
      })
      .catch(() => setError('Network error. Please try again.'))
      .finally(() => setLoading(false));
  }, [router]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
    setPage(1);
  };

  const filtered = useMemo(() => {
    let data = results;
    if (filterLevel !== 'All') data = data.filter(r => r.recommendation === filterLevel);
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(r =>
        r.college_name.toLowerCase().includes(q) ||
        r.branch_name.toLowerCase().includes(q) ||
        r.college_code.toLowerCase().includes(q)
      );
    }
    return [...data].sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'recommendation') {
        cmp = RECOMMENDATION_ORDER.indexOf(a.recommendation) - RECOMMENDATION_ORDER.indexOf(b.recommendation);
      } else if (sortKey === 'cutoff_rank') {
        cmp = a.cutoff_rank - b.cutoff_rank;
      } else if (sortKey === 'college_name') {
        cmp = a.college_name.localeCompare(b.college_name);
      } else if (sortKey === 'branch_name') {
        cmp = a.branch_name.localeCompare(b.branch_name);
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [results, filterLevel, search, sortKey, sortDir]);

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: results.length };
    RECOMMENDATION_ORDER.forEach(level => {
      c[level] = results.filter(r => r.recommendation === level).length;
    });
    return c;
  }, [results]);

  const handleExport = () => {
    const csv = toCsv(filtered);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kcet_predictions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const SortIcon = ({ k }: { k: SortKey }) => {
    if (sortKey !== k) return <span className="opacity-30 text-xs">↕</span>;
    return sortDir === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />;
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-96">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500 text-sm">Calculating predictions...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <p className="text-red-600 font-medium mb-4">{error}</p>
      <Link href="/" className="text-blue-600 hover:underline text-sm">← Back to home</Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <Link href="/" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-2">
            <ArrowLeft className="w-4 h-4" /> Back to form
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">
            {results.length === 0 ? 'No Results Found' : `${results.length} Colleges Found`}
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">Based on your KCET rank and category</p>
        </div>
        <button
          onClick={handleExport}
          disabled={filtered.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 transition disabled:opacity-50"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Level tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {(['All', ...RECOMMENDATION_ORDER] as const).map(level => (
          <button
            key={level}
            onClick={() => { setFilterLevel(level); setPage(1); }}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-semibold border transition-all',
              filterLevel === level
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
            )}
          >
            {level} ({counts[level] ?? 0})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search colleges, branches..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      {paginated.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <SlidersHorizontal className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No results match your filters.</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    {[
                      { key: 'recommendation' as SortKey, label: 'Level' },
                      { key: 'college_name' as SortKey, label: 'College' },
                      { key: 'branch_name' as SortKey, label: 'Branch' },
                      { key: 'cutoff_rank' as SortKey, label: 'Cutoff' },
                    ].map(col => (
                      <th
                        key={col.key}
                        onClick={() => handleSort(col.key)}
                        className="px-4 py-3 text-left text-xs font-semibold text-slate-600 cursor-pointer hover:text-slate-900 select-none"
                      >
                        <span className="flex items-center gap-1">{col.label} <SortIcon k={col.key} /></span>
                      </th>
                    ))}
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">City</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Auto</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Profile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginated.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <RecommendationBadge level={r.recommendation} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900 leading-snug">{r.college_name}</div>
                        <div className="text-xs text-slate-400">{r.college_code}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 max-w-xs">
                        <span className="text-xs leading-snug">{r.branch_name}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="font-semibold text-slate-900">{r.cutoff_rank.toLocaleString()}</div>
                          {/* difference tooltip */}
                          {typeof r.cutoff_rank === 'number' && typeof r.student_rank === 'number' && (
                            (() => {
                              const diff = r.cutoff_rank - r.student_rank;
                              const better = diff > 0;
                              const abs = Math.abs(diff).toLocaleString();
                              const title = better
                                ? `Your rank is ${abs} places better than the previous cutoff.`
                                : `Your rank is ${abs} places worse than the previous cutoff.`;
                              return (
                                <span title={title} className="text-slate-400 text-xs flex items-center gap-1">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" />
                                  </svg>
                                </span>
                              );
                            })()
                          )}
                        </div>
                        <div className="text-xs text-slate-400">vs {r.student_rank.toLocaleString()}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 text-xs">{r.city ?? '—'}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 bg-slate-100 rounded-full text-slate-600">
                          {r.college_type ?? '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {r.autonomous === true ? (
                          <span className="text-emerald-700 font-medium">Yes</span>
                        ) : r.autonomous === false ? (
                          <span className="text-slate-400">No</span>
                        ) : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/college/${r.college_code}`}
                          className="text-blue-600 hover:underline text-xs font-medium"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-slate-500">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm disabled:opacity-40 hover:bg-slate-50"
                >
                  Previous
                </button>
                <span className="px-3 py-1.5 text-sm text-slate-600">{page} / {totalPages}</span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm disabled:opacity-40 hover:bg-slate-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
