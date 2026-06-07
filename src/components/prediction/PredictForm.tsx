'use client';
// src/components/prediction/PredictForm.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { ALL_CATEGORIES, BRANCH_GROUPS } from '@/lib/types';
import { cn } from '@/lib/utils/cn';

export function PredictForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Form state
  const [rank, setRank] = useState('');
  const [category, setCategory] = useState('');
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [collegeType, setCollegeType] = useState<string[]>([]);
  const [autonomous, setAutonomous] = useState<string>('any');

  // Fetched options
  const [branches, setBranches] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/branches').then(r => r.json()).then(d => setBranches(d.data ?? []));
    fetch('/api/cities').then(r => r.json()).then(d => setCities(d.data ?? []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rank || !category) return;
    setLoading(true);

    const body = {
      rank: parseInt(rank),
      category,
      branches: selectedBranches,
      branchGroups: selectedGroups,
      city: selectedCities,
      college_type: collegeType,
      autonomous: autonomous === 'yes' ? true : autonomous === 'no' ? false : null,
    };

    // Store in sessionStorage and navigate
    sessionStorage.setItem('kcet_predict_request', JSON.stringify(body));
    router.push('/results');
  };

  const toggleItem = (list: string[], item: string, set: (v: string[]) => void) => {
    set(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);
  };

  const types = ['Government', 'Private', 'Constituent', 'University'];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Rank + Category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            KCET Rank <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min={1}
            value={rank}
            onChange={e => setRank(e.target.value)}
            placeholder="e.g. 12500"
            required
            className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Reservation Category <span className="text-red-500">*</span>
          </label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            required
            className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
          >
            <option value="">Select category</option>
            {ALL_CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Branch Groups */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Branch Groups <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {Object.keys(BRANCH_GROUPS).map(group => (
            <button
              key={group}
              type="button"
              onClick={() => toggleItem(selectedGroups, group, setSelectedGroups)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                selectedGroups.includes(group)
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-600 border-slate-300 hover:border-blue-400'
              )}
            >
              {group}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <div>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          {showFilters ? 'Hide' : 'Show'} Advanced Filters
        </button>
      </div>

      {showFilters && (
        <div className="space-y-5 p-4 bg-slate-50 rounded-xl border border-slate-200 animate-fade-in">
          {/* Specific Branches */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Specific Branches
            </label>
            <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-lg bg-white p-2 space-y-1">
              {branches.map(branch => (
                <label key={branch} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:bg-slate-50 px-2 py-1 rounded">
                  <input
                    type="checkbox"
                    checked={selectedBranches.includes(branch)}
                    onChange={() => toggleItem(selectedBranches, branch, setSelectedBranches)}
                    className="rounded border-slate-300 text-blue-600"
                  />
                  {branch}
                </label>
              ))}
            </div>
          </div>

          {/* Cities */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Cities</label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {cities.map(city => (
                <button
                  key={city}
                  type="button"
                  onClick={() => toggleItem(selectedCities, city, setSelectedCities)}
                  className={cn(
                    'px-2.5 py-1 rounded-full text-xs border transition-all',
                    selectedCities.includes(city)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-600 border-slate-300 hover:border-blue-400'
                  )}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* College Type */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">College Type</label>
            <div className="flex flex-wrap gap-2">
              {types.map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleItem(collegeType, t, setCollegeType)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs border transition-all font-medium',
                    collegeType.includes(t)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-600 border-slate-300 hover:border-blue-400'
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Autonomous */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Autonomous Status</label>
            <div className="flex gap-3">
              {[{ v: 'any', l: 'Any' }, { v: 'yes', l: 'Autonomous Only' }, { v: 'no', l: 'Non-Autonomous Only' }].map(opt => (
                <label key={opt.v} className="flex items-center gap-1.5 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="autonomous"
                    value={opt.v}
                    checked={autonomous === opt.v}
                    onChange={() => setAutonomous(opt.v)}
                    className="text-blue-600"
                  />
                  {opt.l}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || !rank || !category}
        className={cn(
          'w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-sm transition-all',
          loading || !rank || !category
            ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg active:scale-[0.99]'
        )}
      >
        {loading ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Predicting...</>
        ) : (
          <><Search className="w-4 h-4" /> Predict Colleges</>
        )}
      </button>
    </form>
  );
}
