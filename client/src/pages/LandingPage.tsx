import React from 'react';
import { Sparkles, Target, Brain, RefreshCw, BarChart2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { PageView } from '../types';

interface LandingPageProps {
  onStart: () => void;
  setCurrentView: (view: PageView) => void;
  isLoggedIn: boolean;
  onOpenAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStart,
  setCurrentView,
  isLoggedIn,
  onOpenAuth
}) => {
  return (
    <div className="space-y-24 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden text-center max-w-4xl mx-auto px-4 pt-10 sm:pt-16">
        {/* Ambient glow backgrounds */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-teal/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-brand-cyan/10 rounded-full blur-2xl pointer-events-none" />

        {/* Hackathon Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-800/90 border border-brand-teal/30 text-xs font-semibold text-brand-teal mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
          <span>Hack-A-Throne National Hackathon 2026 · EdTech & Future of Learning</span>
        </div>

        {/* Main Tagline & Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
          Skills First. <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal via-brand-cyan to-brand-green">Barriers Last.</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          SkillPath AI bridges the career mentorship divide for first-generation learners and tier-2/3 college students with personalized AI roadmaps that adapt dynamically as you practice.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStart}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-teal to-brand-cyan text-navy-950 font-bold text-base hover:opacity-95 shadow-xl shadow-brand-teal/25 transition-all flex items-center justify-center gap-2 group active:scale-95"
          >
            <span>Launch Your Career Path</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          {!isLoggedIn ? (
            <button
              onClick={onOpenAuth}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-navy-800/80 hover:bg-navy-800 border border-navy-700 text-white font-semibold text-base transition-all"
            >
              Sign In to Resume
            </button>
          ) : (
            <button
              onClick={() => setCurrentView('dashboard')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-navy-800/80 hover:bg-navy-800 border border-navy-700 text-white font-semibold text-base transition-all"
            >
              View My Dashboard
            </button>
          )}
        </div>

        {/* Quick Highlights */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-brand-green" />
            <span>Target Role Benchmarks</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-brand-green" />
            <span>Google Gemini AI Roadmaps</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-brand-green" />
            <span>Dynamic Adaptive Feedback</span>
          </div>
        </div>
      </section>

      {/* The Core Problem & Solution */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl bg-navy-900/60 border border-rose-500/20 relative overflow-hidden">
            <div className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-2">The Challenge</div>
            <h3 className="text-xl font-bold text-white mb-3">Generic Advice & Discovery Too Late</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Students know the career they want but lack direct mentorship on where they stand. Generic syllabi ignore individual starting levels, static roadmaps never adapt, and skill gaps are only uncovered during rejection emails in campus placement season.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-navy-900/60 border border-brand-teal/30 relative overflow-hidden">
            <div className="text-xs font-bold uppercase tracking-wider text-brand-teal mb-2">The SkillPath AI Solution</div>
            <h3 className="text-xl font-bold text-white mb-3">Continuous, Adaptive Career Navigation</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              SkillPath AI maps your exact competencies against realistic role benchmarks, highlights high-priority skill gaps, and employs Google Gemini to craft custom weekly milestones. Practice performance immediately reshapes future weeks.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Engineered for Real-World Learning
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Every step is designed to convert uncertain aspirants into interview-ready engineers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl glass-panel glass-panel-hover flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-brand-teal/15 text-brand-teal flex items-center justify-center mb-4">
              <Target className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">Role Benchmarking</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Compare yourself against calibrated requirements across DSA, Programming, SQL, Git, and CS Fundamentals.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel glass-panel-hover flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-brand-cyan/15 text-brand-cyan flex items-center justify-center mb-4">
              <Brain className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">AI Roadmap (Gemini)</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Generates customized weekly study topics and hands-on projects, backed by an infallible fallback engine.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel glass-panel-hover flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-brand-gold/15 text-brand-gold flex items-center justify-center mb-4">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">Adaptive Learning</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Practice scores automatically recalculate skill percentages, flag weak areas, and adjust subsequent roadmap weeks.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel glass-panel-hover flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-brand-green/15 text-brand-green flex items-center justify-center mb-4">
              <BarChart2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">Readiness Dashboard</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Interactive Recharts radar and bar charts give you a transparent look at your interview readiness at all times.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-navy-900 to-navy-850 border border-brand-teal/30 text-center relative overflow-hidden">
          <div className="max-w-xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Ready to verify your readiness?
            </h3>
            <p className="text-sm text-slate-300 mt-2 mb-6">
              Select your dream role, take a 5-minute diagnostic quiz, and receive your tailored learning path.
            </p>
            <button
              onClick={onStart}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-teal to-brand-cyan text-navy-950 font-bold text-sm hover:opacity-95 shadow-xl shadow-brand-teal/25 transition-all inline-flex items-center gap-2"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
