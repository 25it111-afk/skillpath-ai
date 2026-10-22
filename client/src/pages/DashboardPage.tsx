import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import { TARGET_ROLES } from '../data/roleData';
import { RoadmapResponse } from '../types';
import {
  Sparkles,
  Trophy,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  Compass
} from 'lucide-react';

interface DashboardPageProps {
  targetRole: string;
  scores: Record<string, number>;
  roadmapData: RoadmapResponse | null;
  onGoToRoadmap: () => void;
  onRetakeAssessment: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  targetRole,
  scores,
  roadmapData,
  onGoToRoadmap,
  onRetakeAssessment
}) => {
  const roleConfig = TARGET_ROLES[targetRole] || TARGET_ROLES['Software Engineer'];
  const benchmarks = roleConfig.benchmarks;

  // Prepare chart data comparing current vs benchmark
  const chartData = Object.keys(benchmarks).map((skill) => {
    const current = scores[skill] ?? 0;
    const required = benchmarks[skill as keyof typeof benchmarks] ?? 60;
    return {
      skill,
      Current: current,
      Benchmark: required,
      gap: Math.max(0, required - current)
    };
  });

  // Calculate career readiness percentage: average of min(1, current / required)
  const skillKeys = Object.keys(benchmarks) as (keyof typeof benchmarks)[];
  const readiness = Math.round(
    (skillKeys.reduce((acc, k) => {
      const cur = scores[k] ?? 0;
      const req = benchmarks[k] || 100;
      return acc + Math.min(cur / req, 1);
    }, 0) /
      skillKeys.length) *
      100
  );

  // Identify strengths & priority gaps
  const strengths = skillKeys.filter((k) => (scores[k] ?? 0) >= benchmarks[k]);
  const gaps = roadmapData?.gaps || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl glass-panel border border-brand-teal/30">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-teal/10 border border-brand-teal/20 text-brand-teal text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
            Verified Career Track
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Career Readiness: <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal to-brand-cyan">{targetRole}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Real-time diagnostic report comparing your verified competencies against industry entry benchmarks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onRetakeAssessment}
            className="px-4 py-2 rounded-xl bg-navy-900 hover:bg-navy-850 border border-navy-700 text-xs font-semibold text-slate-300 transition-all"
          >
            Re-calibrate Skills
          </button>
          <button
            onClick={onGoToRoadmap}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-teal to-brand-cyan text-navy-950 text-xs sm:text-sm font-bold hover:opacity-95 shadow-lg shadow-brand-teal/20 transition-all flex items-center gap-2"
          >
            <span>View AI Roadmap</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Readiness Score Card */}
        <div className="p-6 rounded-2xl glass-panel border border-brand-teal/20 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Role Readiness
            </span>
            <Trophy className="w-5 h-5 text-brand-gold" />
          </div>
          <div className="my-4">
            <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-teal via-brand-cyan to-brand-green">
              {readiness}%
            </div>
            <div className="h-2 w-full bg-navy-950 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-teal to-brand-green rounded-full transition-all duration-500"
                style={{ width: `${readiness}%` }}
              />
            </div>
          </div>
          <p className="text-[11px] text-slate-400">
            {readiness >= 80
              ? 'Excellent! You satisfy prime requirements for campus interviews.'
              : readiness >= 50
              ? 'Solid foundation. Focus on targeted gap revision to reach readiness.'
              : 'Early stage. Follow the personalized weekly roadmap to build confidence.'}
          </p>
        </div>

        {/* Strengths Card */}
        <div className="p-6 rounded-2xl glass-panel border border-brand-teal/20 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Pillars at / above Benchmark
            </span>
            <CheckCircle className="w-5 h-5 text-brand-green" />
          </div>
          <div className="my-3">
            <div className="text-3xl font-bold text-white mb-2">
              {strengths.length} <span className="text-sm font-normal text-slate-400">of {skillKeys.length}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {strengths.length > 0 ? (
                strengths.map((s) => (
                  <span
                    key={s}
                    className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-brand-green/10 text-brand-green border border-brand-green/20"
                  >
                    ✓ {s}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">No pillars at target benchmark yet.</span>
              )}
            </div>
          </div>
          <p className="text-[11px] text-slate-400">Demonstrates strong problem solving in foundational areas.</p>
        </div>

        {/* Priority Gaps Card */}
        <div className="p-6 rounded-2xl glass-panel border border-brand-teal/20 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Priority Skill Gaps
            </span>
            <AlertTriangle className="w-5 h-5 text-brand-gold" />
          </div>
          <div className="my-3">
            <div className="text-3xl font-bold text-brand-gold mb-2">
              {gaps.length} <span className="text-sm font-normal text-slate-400">focus areas</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {gaps.length > 0 ? (
                gaps.map((g) => (
                  <span
                    key={g.skill}
                    className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-brand-gold/10 text-brand-gold border border-brand-gold/20"
                  >
                    {g.skill} (-{g.gap}%)
                  </span>
                ))
              ) : (
                <span className="text-xs text-brand-green font-semibold">🎉 All benchmarks satisfied!</span>
              )}
            </div>
          </div>
          <p className="text-[11px] text-slate-400">These gaps are weighted first in your AI-generated curriculum.</p>
        </div>
      </div>

      {/* Visual Analytics Grid: Radar & Bar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Radar Chart: Skill Profile vs Role Benchmark */}
        <div className="p-6 rounded-2xl glass-panel border border-brand-teal/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-brand-teal" />
              <h3 className="font-bold text-white text-base">Competency Radar</h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Current vs Required</span>
          </div>

          <div className="w-full h-72 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData}>
                <PolarGrid stroke="#1b4b5d" />
                <PolarAngleAxis dataKey="skill" stroke="#9db4bf" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#21505f" />
                <Radar
                  name="Current Score"
                  dataKey="Current"
                  stroke="#2dd4bf"
                  fill="#2dd4bf"
                  fillOpacity={0.45}
                />
                <Radar
                  name="Role Benchmark"
                  dataKey="Benchmark"
                  stroke="#f5b942"
                  fill="#f5b942"
                  fillOpacity={0.15}
                  strokeDasharray="4 4"
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Pillar Comparison */}
        <div className="p-6 rounded-2xl glass-panel border border-brand-teal/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-cyan" />
              <h3 className="font-bold text-white text-base">Benchmark Comparison</h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Percentage Scale (0-100%)</span>
          </div>

          <div className="w-full h-72 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="skill" stroke="#9db4bf" tick={{ fill: '#cbd5e1', fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis stroke="#9db4bf" domain={[0, 100]} tick={{ fill: '#cbd5e1', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#10303c',
                    border: '1px solid #21505f',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#fff'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Current" fill="#2dd4bf" radius={[4, 4, 0, 0]} name="Current Score" />
                <Bar dataKey="Benchmark" fill="#f5b942" radius={[4, 4, 0, 0]} name="Target Requirement" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Roadmap Navigation Teaser */}
      {roadmapData && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-navy-900 to-navy-850 border border-brand-teal/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-teal/20 text-brand-teal flex items-center justify-center shrink-0">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                Personalized {roadmapData.roadmap?.length || 0}-Week Learning Roadmap Ready
              </div>
              <div className="text-xs text-slate-400">
                Generated via {roadmapData.source === 'gemini' ? 'Google Gemini AI' : 'Rule-based Adaptive Fallback'}.
              </div>
            </div>
          </div>

          <button
            onClick={onGoToRoadmap}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-brand-teal text-navy-950 font-bold text-xs sm:text-sm hover:opacity-95 shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Open Roadmap</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
