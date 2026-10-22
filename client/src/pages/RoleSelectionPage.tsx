import React from 'react';
import { TARGET_ROLES } from '../data/roleData';
import { TargetRoleData } from '../types';
import { Code2, BarChart3, Globe, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';

interface RoleSelectionPageProps {
  selectedRole: string | null;
  onSelectRole: (role: string) => void;
  onContinue: () => void;
}

export const RoleSelectionPage: React.FC<RoleSelectionPageProps> = ({
  selectedRole,
  onSelectRole,
  onContinue
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code2':
        return <Code2 className="w-6 h-6 text-brand-teal" />;
      case 'BarChart3':
        return <BarChart3 className="w-6 h-6 text-brand-cyan" />;
      case 'Globe':
        return <Globe className="w-6 h-6 text-brand-gold" />;
      default:
        return <Code2 className="w-6 h-6 text-brand-teal" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-teal/10 border border-brand-teal/20 text-brand-teal text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Step 1 of 3: Target Career Role
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Choose Your Target Role
        </h2>
        <p className="text-sm text-slate-300 mt-2">
          Each career track comes with industry-calibrated benchmarks across 5 foundational pillars.
        </p>
      </div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {Object.values(TARGET_ROLES).map((role: TargetRoleData) => {
          const isSelected = selectedRole === role.title;

          return (
            <div
              key={role.title}
              onClick={() => onSelectRole(role.title)}
              className={`relative cursor-pointer rounded-2xl p-6 transition-all border ${
                isSelected
                  ? 'bg-navy-800/90 border-brand-teal shadow-xl shadow-brand-teal/20 scale-[1.02]'
                  : 'glass-panel glass-panel-hover'
              }`}
            >
              {isSelected && (
                <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-teal text-navy-950 font-bold text-[10px]">
                  <CheckCircle className="w-3 h-3" />
                  Selected
                </div>
              )}

              <div className="w-12 h-12 rounded-xl bg-navy-900 border border-navy-700 flex items-center justify-center mb-4">
                {getIcon(role.iconName)}
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{role.title}</h3>
              <p className="text-xs text-slate-300 mb-6 leading-relaxed min-h-[48px]">
                {role.description}
              </p>

              {/* Benchmarks List */}
              <div className="space-y-2 mb-6">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Target Proficiency
                </div>
                {Object.entries(role.benchmarks).map(([skill, benchmark]) => (
                  <div key={skill} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300">{skill}</span>
                      <span className="font-mono font-semibold text-brand-teal">{benchmark}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-navy-950 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-brand-teal to-brand-cyan rounded-full"
                        style={{ width: `${benchmark}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Highlights */}
              <div className="pt-4 border-t border-navy-700/60 space-y-1.5">
                {role.keyHighlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-400">
                    <div className="w-1 h-1 rounded-full bg-brand-teal" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="flex justify-center">
        <button
          onClick={onContinue}
          disabled={!selectedRole}
          className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-teal to-brand-cyan text-navy-950 font-bold text-sm hover:opacity-95 shadow-xl shadow-brand-teal/25 transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span>Continue to Skill Assessment</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
