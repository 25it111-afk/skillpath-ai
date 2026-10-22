import React from 'react';
import { Compass, UserCheck, LogOut, LogIn, Sparkles } from 'lucide-react';
import { PageView, User } from '../types';

interface NavbarProps {
  currentView: PageView;
  setCurrentView: (view: PageView) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  targetRole?: string | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  currentUser,
  onOpenAuth,
  onLogout,
  targetRole
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-navy-700/60 bg-navy-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={() => setCurrentView('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-tealDark to-brand-cyan flex items-center justify-center text-navy-950 shadow-lg shadow-brand-teal/20 group-hover:scale-105 transition-transform">
            <Compass className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-white tracking-tight">SkillPath AI</span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-brand-teal/10 text-brand-teal border border-brand-teal/30">
                2026
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Skills First. Barriers Last.</p>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {currentUser && (
            <>
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  currentView === 'dashboard'
                    ? 'bg-navy-800 text-brand-teal border border-brand-teal/30'
                    : 'text-slate-300 hover:text-white hover:bg-navy-900'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setCurrentView('roadmap')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  currentView === 'roadmap'
                    ? 'bg-navy-800 text-brand-teal border border-brand-teal/30'
                    : 'text-slate-300 hover:text-white hover:bg-navy-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                Roadmap
              </button>
              <button
                onClick={() => setCurrentView('roles')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hidden md:block ${
                  currentView === 'roles'
                    ? 'bg-navy-800 text-brand-teal border border-brand-teal/30'
                    : 'text-slate-300 hover:text-white hover:bg-navy-900'
                }`}
              >
                Careers
              </button>
            </>
          )}

          {/* User profile & actions */}
          <div className="ml-2 pl-2 border-l border-navy-800 flex items-center gap-2">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end">
                  <div className="flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-brand-teal" />
                    <span className="text-xs font-medium text-slate-200">{currentUser.name || currentUser.email}</span>
                  </div>
                  {targetRole && (
                    <span className="text-[10px] text-brand-gold font-medium">{targetRole}</span>
                  )}
                </div>
                <button
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-navy-900 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-teal to-brand-cyan text-navy-950 font-semibold text-sm hover:opacity-95 shadow-lg shadow-brand-teal/20 transition-all active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};
