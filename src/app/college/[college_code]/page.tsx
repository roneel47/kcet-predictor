'use client';
// src/app/college/[college_code]/page.tsx
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  MapPin, Globe, BadgeCheck, GraduationCap,
  Award, Hash, ArrowLeft, ChevronDown, ChevronUp
} from 'lucide-react';
import Link from 'next/link';
import { ALL_CATEGORIES } from '@/lib/types';
import { cn } from '@/lib/utils/cn';

interface CollegeDetail {
  college_code: string;
  college_name: string;
  city: string | null;
  district: string | null;
  college_type: string | null;
  autonomous: boolean | null;
  university: string | null;
  naac_grade: string | null;
  nirf_rank: number | null;
  website: string | null;
  branches: {
    branch_name: string;
    cutoffs: { category: string; cutoff_rank: number }[];
  }[];
}

export default function CollegeDetailPage() {
  const { college_code } = useParams<{ college_code: string }>();
  const [college, setCollege] = useState<CollegeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedBranch, setExpandedBranch] = useState<string | null>(null);
  const [branchSearch, setBranchSearch] = useState('');

  useEffect(() => {
    fetch(`/api/college/${college_code}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) setCollege(d.data);
        else setError('College not found');
      })
      .catch(() => setError('Failed to load college data'))
      .finally(() => setLoading(false));
  }, [college_code]);

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-slate-200 rounded w-1/2" />
        <div className="h-4 bg-slate-100 rounded w-1/3" />
        <div className="grid grid-cols-3 gap-4 mt-6">
          {Array(3).fill(0).map((_, i) => <div key={i} className="h-24 bg-slate-100 rounded-xl" />)}
        </div>
      </div>
    </div>
  );

  if (error || !college) return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <p className="text-red-600 mb-4">{error}</p>
      <Link href="/colleges" className="text-blue-600 hover:underline text-sm">← Back to colleges</Link>
    </div>
  );

  const filteredBranches = college.branches.filter(b =>
    b.branch_name.toLowerCase().includes(branchSearch.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/colleges" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6">
        <ArrowLeft className="w-4 h-4" /> All Colleges
      </Link>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white/20 text-white text-xs px-2.5 py-0.5 rounded-full font-mono">
                {college.college_code}
              </span>
              {college.autonomous && (
                <span className="bg-emerald-500/30 text-emerald-100 text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <BadgeCheck className="w-3 h-3" /> Autonomous
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold leading-tight mb-3">{college.college_name}</h1>
            <div className="flex flex-wrap gap-3 text-blue-100 text-sm">
              {college.city && (
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{college.city}, {college.district}</span>
              )}
              {college.college_type && (
                <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" />{college.college_type}</span>
              )}
              {college.website && (
                <a href={college.website.startsWith('http') ? college.website : `https://${college.website}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-white underline">
                  <Globe className="w-3.5 h-3.5" />Website
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { icon: <Hash className="w-4 h-4" />, label: 'Branches', value: college.branches.length },
          { icon: <Award className="w-4 h-4" />, label: 'NAAC Grade', value: college.naac_grade ?? 'N/A' },
          { icon: <Award className="w-4 h-4" />, label: 'NIRF Rank', value: college.nirf_rank ? `#${college.nirf_rank}` : 'N/A' },
          { icon: <GraduationCap className="w-4 h-4" />, label: 'University', value: college.university || 'VTU' },
        ].map((card, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <div className="flex justify-center text-blue-600 mb-2">{card.icon}</div>
            <div className="font-bold text-slate-900 text-lg">{card.value}</div>
            <div className="text-xs text-slate-500">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Branches & Cutoffs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Branches & Cutoffs (2025 Round 3)</h2>
          <span className="text-sm text-slate-500">{college.branches.length} branches</span>
        </div>

        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search branches..."
            value={branchSearch}
            onChange={e => setBranchSearch(e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          {filteredBranches.map((branch) => {
            const isOpen = expandedBranch === branch.branch_name;
            return (
              <div key={branch.branch_name} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <button
                  onClick={() => setExpandedBranch(isOpen ? null : branch.branch_name)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors text-left"
                >
                  <span className="font-medium text-slate-800 text-sm">{branch.branch_name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">{branch.cutoffs.length} categories</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 border-t border-slate-100">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-3">
                      {branch.cutoffs.sort((a, b) => a.cutoff_rank - b.cutoff_rank).map(c => (
                        <div key={c.category} className="bg-slate-50 rounded-lg px-3 py-2">
                          <div className="text-xs font-semibold text-slate-500">{c.category}</div>
                          <div className="text-base font-bold text-slate-900">{c.cutoff_rank.toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
