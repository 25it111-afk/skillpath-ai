import React, { useState } from 'react';
import { QUIZ_QUESTIONS, SKILLS_LIST } from '../data/quizData';
import { SkillName } from '../types';
import { Sparkles, Brain, CheckCircle2, Sliders, ArrowRight, Loader2, Info } from 'lucide-react';

interface AssessmentPageProps {
  targetRole: string;
  onSubmitScores: (scores: Record<string, number>) => Promise<void>;
  isLoading: boolean;
}

export const AssessmentPage: React.FC<AssessmentPageProps> = ({
  targetRole,
  onSubmitScores,
  isLoading
}) => {
  // Answers state: questionId -> selectedOptionIndex
  const [answers, setAnswers] = useState<Record<number, number>>({});

  // Self-confidence ratings (0 to 100%) per skill
  const [confidence, setConfidence] = useState<Record<SkillName, number>>({
    DSA: 50,
    Programming: 60,
    SQL: 50,
    Git: 60,
    'CS Fundamentals': 50
  });

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleConfidenceChange = (skill: SkillName, value: number) => {
    setConfidence((prev) => ({
      ...prev,
      [skill]: value
    }));
  };

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = QUIZ_QUESTIONS.length;

  const handleSubmit = async () => {
    // Calculate scores per skill: 60% quiz performance + 40% self rating
    const calculatedScores: Record<string, number> = {};

    SKILLS_LIST.forEach((skill) => {
      const skillQuestions = QUIZ_QUESTIONS.filter((q) => q.skill === skill);
      let correct = 0;

      skillQuestions.forEach((q) => {
        if (answers[q.id] === q.answerIndex) {
          correct += 1;
        }
      });

      const quizPct = skillQuestions.length > 0 ? (correct / skillQuestions.length) * 100 : 50;
      const selfRating = confidence[skill] ?? 50;
      const combined = Math.round(0.6 * quizPct + 0.4 * selfRating);

      calculatedScores[skill] = Math.min(100, Math.max(0, combined));
    });

    await onSubmitScores(calculatedScores);
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="p-8 rounded-3xl glass-panel border border-brand-teal/40 space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-brand-teal/20 text-brand-teal flex items-center justify-center mx-auto animate-pulse">
            <Brain className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Gemini AI is Designing Your Roadmap...
            </h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              Analyzing your skill gaps for <span className="text-brand-teal font-semibold">{targetRole}</span>, calculating priority topics, and generating a customized weekly curriculum.
            </p>
          </div>
          <div className="flex justify-center items-center gap-2 text-xs text-brand-gold font-medium">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Consulting Google Gemini Flash model...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-teal/10 border border-brand-teal/20 text-brand-teal text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Step 2 of 3: Skill Assessment
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Diagnostic Skill Assessment
        </h2>
        <p className="text-sm text-slate-300 mt-2">
          Target Track: <span className="text-brand-teal font-bold">{targetRole}</span>. Answer the diagnostic questions and calibrate your self-confidence slider.
        </p>

        {/* Progress Pill */}
        <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-navy-900 border border-navy-700 text-xs text-slate-300">
          <span>Completed: {answeredCount} / {totalQuestions} questions</span>
          <div className="w-24 h-1.5 bg-navy-950 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-teal rounded-full transition-all duration-300"
              style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Part A: Confidence Sliders */}
      <div className="p-6 sm:p-8 rounded-2xl glass-panel border border-brand-teal/20 space-y-6">
        <div className="flex items-center gap-2.5 text-white font-bold text-lg">
          <Sliders className="w-5 h-5 text-brand-gold" />
          <span>Section 1: Calibrate Your Self-Rating per Pillar</span>
        </div>
        <p className="text-xs text-slate-400">
          Be realistic. Self-rating is weighted with your quiz score to pinpoint accurate baseline recommendations.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {SKILLS_LIST.map((skill) => (
            <div key={skill} className="space-y-2 p-3.5 rounded-xl bg-navy-900/80 border border-navy-700/60">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-200">{skill}</span>
                <span className="font-mono font-bold text-brand-teal">{confidence[skill]}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={confidence[skill]}
                onChange={(e) => handleConfidenceChange(skill, Number(e.target.value))}
                className="w-full accent-brand-teal bg-navy-950 rounded-lg cursor-pointer h-2"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Beginner (0%)</span>
                <span>Proficient (50%)</span>
                <span>Advanced (100%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Part B: Multiple Choice Questions */}
      <div className="space-y-6">
        <div className="flex items-center gap-2.5 text-white font-bold text-lg px-1">
          <Brain className="w-5 h-5 text-brand-cyan" />
          <span>Section 2: Technical Diagnostic Questions</span>
        </div>

        <div className="space-y-4">
          {QUIZ_QUESTIONS.map((q, index) => {
            const isAnswered = answers[q.id] !== undefined;

            return (
              <div
                key={q.id}
                className={`p-6 rounded-2xl transition-all border ${
                  isAnswered
                    ? 'glass-panel border-navy-700'
                    : 'glass-panel border-brand-teal/20 hover:border-brand-teal/40'
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-navy-900 border border-navy-700 font-mono text-xs text-brand-teal font-semibold">
                      Q{index + 1}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20">
                      {q.skill}
                    </span>
                  </div>
                  {isAnswered && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-brand-green">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Recorded
                    </span>
                  )}
                </div>

                <p className="text-sm sm:text-base font-medium text-white mb-4">
                  {q.question}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {q.options.map((option, optIdx) => {
                    const isSelected = answers[q.id] === optIdx;

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        className={`text-left p-3 rounded-xl text-xs sm:text-sm font-medium transition-all border flex items-center justify-between ${
                          isSelected
                            ? 'bg-brand-teal/15 border-brand-teal text-white shadow-sm'
                            : 'bg-navy-900/60 border-navy-700/80 text-slate-300 hover:text-white hover:border-navy-600'
                        }`}
                      >
                        <span>{option}</span>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                            isSelected
                              ? 'border-brand-teal bg-brand-teal text-navy-950'
                              : 'border-slate-500'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-navy-950" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Notice & Submit Action */}
      <div className="p-6 rounded-2xl glass-panel border border-brand-teal/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-teal/10 text-brand-teal flex items-center justify-center shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">Ready for AI Gap Analysis?</div>
            <div className="text-xs text-slate-400">
              Unanswered questions will default to baseline estimates.
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-teal to-brand-cyan text-navy-950 font-bold text-sm hover:opacity-95 shadow-xl shadow-brand-teal/25 transition-all flex items-center justify-center gap-2 group active:scale-95"
        >
          <span>Generate AI Roadmap</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
