import React, { useState } from 'react';
import { X, CheckCircle, AlertTriangle, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { RoadmapWeek } from '../types';

interface PracticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  weekItem: RoadmapWeek | null;
  currentSkillScore: number;
  onPracticeCompleted: (updatedScores: Record<string, number>, status: 'completed' | 'needs-revision') => void;
}

export const PracticeModal: React.FC<PracticeModalProps> = ({
  isOpen,
  onClose,
  weekItem,
  currentSkillScore,
  onPracticeCompleted
}) => {
  const [solvedCount, setSolvedCount] = useState<number>(4);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !weekItem) return null;

  // Real-time projected score calculation based on adaptive formula:
  // new_score = round(0.7 * old + 0.3 * (solved / 5 * 100))
  const ratio = solvedCount / 5;
  const projectedScore = Math.round(0.7 * currentSkillScore + 0.3 * ratio * 100);
  const isMastered = ratio >= 0.6;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await api.submitPractice(weekItem.skill, weekItem.topic, solvedCount);
      onPracticeCompleted(res.scores, res.status);
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to record practice session.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl glass-panel border border-brand-teal/30 p-6 sm:p-8 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-navy-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-teal/10 border border-brand-teal/20 text-brand-teal text-xs font-semibold mb-3">
            <RefreshCw className="w-3.5 h-3.5 text-brand-gold" />
            Adaptive Learning Engine
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight">
            Practice: {weekItem.topic}
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Skill Category: <span className="text-brand-teal font-semibold">{weekItem.skill}</span> · Current Score: <span className="font-mono text-brand-gold font-bold">{currentSkillScore}%</span>
          </p>
        </div>

        {/* Practice Tasks Description */}
        <div className="mb-6 p-4 rounded-xl bg-navy-900/80 border border-navy-700/80 space-y-2">
          <div className="text-xs font-semibold text-slate-300">Prescribed Practice Tasks:</div>
          <ul className="text-xs text-slate-400 space-y-1">
            {weekItem.practice?.map((item, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-brand-teal">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Performance Recording Input */}
        <div className="mb-6 space-y-3">
          <label className="block text-xs font-semibold text-slate-200">
            How many problems did you solve independently? (Out of 5)
          </label>
          <div className="grid grid-cols-6 gap-2">
            {[0, 1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setSolvedCount(num)}
                className={`py-3 rounded-xl font-bold text-sm transition-all border ${
                  solvedCount === num
                    ? 'bg-brand-teal text-navy-950 border-brand-teal shadow-md shadow-brand-teal/20 scale-105'
                    : 'bg-navy-900 border-navy-700 text-slate-300 hover:text-white hover:border-navy-600'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
          <div className="text-center text-[11px] text-slate-400">
            {solvedCount}/5 problems solved ({Math.round(ratio * 100)}% accuracy)
          </div>
        </div>

        {/* Real-time Adaptive Engine Projection */}
        <div className="mb-6 p-4 rounded-xl bg-navy-900/90 border border-navy-700/80 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">Adaptive Score Projection:</span>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">{currentSkillScore}%</span>
              <span className="text-brand-teal">→</span>
              <span className="font-bold text-sm text-brand-teal">{projectedScore}%</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {isMastered ? (
              <div className="flex items-center gap-1.5 text-brand-green font-semibold">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>Topic will be marked MASTERED & roadmap advances.</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-brand-gold font-semibold">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Topic flagged as WEAK. Prioritized for revision in next cycle.</span>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* Submit Action */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-brand-teal to-brand-cyan text-navy-950 font-bold text-sm hover:opacity-95 shadow-xl shadow-brand-teal/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Updating Adaptive Engine...</span>
            </>
          ) : (
            <>
              <span>Submit & Recalibrate Roadmap</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
