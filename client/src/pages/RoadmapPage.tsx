import React, { useState } from 'react';
import { RoadmapResponse, RoadmapWeek, User } from '../types';
import {
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  FolderGit2,
  RefreshCw,
  Award,
  Layers
} from 'lucide-react';
import { PracticeModal } from '../components/PracticeModal';

interface RoadmapPageProps {
  targetRole: string;
  scores: Record<string, number>;
  roadmapData: RoadmapResponse | null;
  user: User | null;
  onRefreshRoadmap: () => void;
  onScoresUpdated: (scores: Record<string, number>, logMessage: string) => void;
}

export const RoadmapPage: React.FC<RoadmapPageProps> = ({
  targetRole,
  scores,
  roadmapData,
  user,
  onRefreshRoadmap,
  onScoresUpdated
}) => {
  const [selectedWeek, setSelectedWeek] = useState<RoadmapWeek | null>(null);
  const [isPracticeModalOpen, setIsPracticeModalOpen] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  const toggleTask = (taskKey: string) => {
    setCompletedTasks((prev) => ({
      ...prev,
      [taskKey]: !prev[taskKey]
    }));
  };

  const handleOpenPractice = (week: RoadmapWeek) => {
    setSelectedWeek(week);
    setIsPracticeModalOpen(true);
  };

  const handlePracticeFinished = (
    updatedScores: Record<string, number>,
    status: 'completed' | 'needs-revision'
  ) => {
    const topic = selectedWeek?.topic || 'Topic';
    const skill = selectedWeek?.skill || 'Skill';
    const log =
      status === 'completed'
        ? `✅ Mastery confirmed in ${topic}! ${skill} score elevated to ${updatedScores[skill]}%. Roadmap moves ahead.`
        : `⚠ Needs revision on ${topic}. Adaptive engine adjusted ${skill} to ${updatedScores[skill]}% and retained topic for review.`;

    onScoresUpdated(updatedScores, log);
    onRefreshRoadmap();
  };

  const weeks = roadmapData?.roadmap || [];
  const doneSet = new Set(user?.done || []);
  const weakSet = new Set(user?.weak || []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl glass-panel border border-brand-teal/30">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-teal/10 border border-brand-teal/20 text-brand-teal text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
            {roadmapData?.source === 'gemini' ? 'Google Gemini AI Powered ✨' : 'Rule-Based Resilient Fallback 🛟'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Personalized Learning Roadmap
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Tailored weekly curriculum bridging your verified skill gaps for <span className="text-brand-teal font-semibold">{targetRole}</span>.
          </p>
        </div>

        <button
          onClick={onRefreshRoadmap}
          className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-850 border border-navy-700 text-xs font-semibold text-slate-300 flex items-center gap-2 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5 text-brand-teal" />
          <span>Regenerate Roadmap</span>
        </button>
      </div>

      {/* Fallback Notice if Gemini hit rate limits */}
      {roadmapData?.source === 'fallback' && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>
            Notice: Generated via rule-based fallback curriculum. Gemini will automatically re-engage on next regeneration.
          </span>
        </div>
      )}

      {/* Timeline of Weeks */}
      <div className="space-y-6">
        {weeks.length === 0 ? (
          <div className="p-12 rounded-3xl glass-panel text-center space-y-4">
            <Award className="w-12 h-12 text-brand-gold mx-auto" />
            <h3 className="text-xl font-bold text-white">All Benchmarks Satisfied!</h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              You meet or exceed every required proficiency benchmark for {targetRole}. Continue practicing mock interviews or target another career track!
            </p>
          </div>
        ) : (
          weeks.map((weekItem, index) => {
            const key = `${weekItem.skill}|${weekItem.topic}`;
            const isDone = doneSet.has(key);
            const isWeak = weakSet.has(key);

            return (
              <div
                key={index}
                className={`p-6 sm:p-7 rounded-2xl transition-all border relative overflow-hidden ${
                  isDone
                    ? 'glass-panel border-brand-green/30 bg-navy-950/70'
                    : isWeak
                    ? 'glass-panel border-brand-gold/40 bg-navy-900/80 shadow-lg shadow-brand-gold/5'
                    : 'glass-panel border-brand-teal/20 hover:border-brand-teal/40'
                }`}
              >
                {/* Week Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-navy-900 border border-navy-700 flex items-center justify-center font-mono font-bold text-sm text-brand-teal">
                      W{weekItem.week || index + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg font-bold text-white tracking-tight">
                          {weekItem.topic}
                        </h4>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20">
                          {weekItem.skill}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">
                        Pillar Baseline: {scores[weekItem.skill] ?? 0}%
                      </span>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center gap-2">
                    {isDone ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-green/10 border border-brand-green/30 text-brand-green font-semibold text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Mastered
                      </span>
                    ) : isWeak ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold font-semibold text-xs animate-pulse">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Priority Revision
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-900 border border-navy-700 text-slate-400 font-semibold text-xs">
                        <Calendar className="w-3.5 h-3.5 text-brand-teal" />
                        In Progress
                      </span>
                    )}

                    <button
                      onClick={() => handleOpenPractice(weekItem)}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-brand-teal to-brand-cyan text-navy-950 font-bold text-xs hover:opacity-95 shadow-md shadow-brand-teal/20 transition-all flex items-center gap-1.5"
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>Practice Topic</span>
                    </button>
                  </div>
                </div>

                {/* Practice Tasks Checklist */}
                <div className="mt-4 pt-4 border-t border-navy-800 space-y-2">
                  <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-brand-teal" />
                    <span>Weekly Action Checklist:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(weekItem.practice || []).map((task, tIdx) => {
                      const taskKey = `${index}-${tIdx}`;
                      const isTaskDone = completedTasks[taskKey];

                      return (
                        <div
                          key={tIdx}
                          onClick={() => toggleTask(taskKey)}
                          className={`flex items-start gap-2.5 p-2.5 rounded-xl cursor-pointer transition-all border text-xs ${
                            isTaskDone
                              ? 'bg-navy-950/60 border-brand-green/20 text-slate-400 line-through'
                              : 'bg-navy-900/60 border-navy-800 text-slate-200 hover:border-navy-700'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                              isTaskDone
                                ? 'bg-brand-green border-brand-green text-navy-950'
                                : 'border-slate-500'
                            }`}
                          >
                            {isTaskDone && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <span>{task}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Mini Project Tag if present */}
                {weekItem.project && (
                  <div className="mt-3.5 p-3 rounded-xl bg-navy-900/90 border border-brand-cyan/20 flex items-start gap-2.5 text-xs text-brand-cyan">
                    <FolderGit2 className="w-4 h-4 shrink-0 mt-0.5 text-brand-gold" />
                    <div>
                      <span className="font-semibold text-slate-200">Milestone Mini-Project: </span>
                      <span className="text-slate-300">{weekItem.project}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Practice Modal */}
      <PracticeModal
        isOpen={isPracticeModalOpen}
        onClose={() => setIsPracticeModalOpen(false)}
        weekItem={selectedWeek}
        currentSkillScore={selectedWeek ? scores[selectedWeek.skill] ?? 50 : 50}
        onPracticeCompleted={handlePracticeFinished}
      />
    </div>
  );
};
