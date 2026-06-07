// src/app/page.tsx
import { PredictForm } from '@/components/prediction/PredictForm';
import { GraduationCap, Target, Shield, Star, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="hero-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
                KEA UGCET 2025 — Round 3 Data
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
              Find Your Perfect<br />Engineering College
            </h1>
            <p className="text-blue-100 text-lg mb-8 max-w-xl">
              Enter your KCET rank and category to get personalized college predictions 
              based on official KEA cutoff data — 229 colleges, 104 branches, 10,949 records.
            </p>
            <div className="flex flex-wrap gap-4">
              {[
                { icon: <Star className="w-4 h-4" />, label: 'Guaranteed', color: 'text-emerald-300' },
                { icon: <Shield className="w-4 h-4" />, label: 'Safe', color: 'text-blue-200' },
                { icon: <Target className="w-4 h-4" />, label: 'Reach', color: 'text-amber-300' },
                { icon: <Sparkles className="w-4 h-4" />, label: 'Dream', color: 'text-rose-300' },
              ].map((item) => (
                <div key={item.label} className={`flex items-center gap-1.5 text-sm font-medium ${item.color}`}>
                  {item.icon}
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Get Your Predictions</h2>
                <p className="text-sm text-slate-500">Fill in your details to see eligible colleges</p>
              </div>
            </div>
            <PredictForm />
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '229', label: 'Colleges' },
              { value: '104', label: 'Branches' },
              { value: '28', label: 'Categories' },
              { value: '10,949', label: 'Cutoff Records' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-extrabold text-blue-700">{stat.value}</div>
                <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
