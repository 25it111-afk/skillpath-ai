import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { ShieldCheck, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    let mounted = true;
    api.checkHealth()
      .then((res) => {
        if (mounted && res.ok) setBackendStatus('online');
      })
      .catch(() => {
        if (mounted) setBackendStatus('offline');
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <footer className="w-full border-t border-navy-800 bg-navy-950/90 py-8 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-navy-900 border border-navy-700">
            <Award className="w-3.5 h-3.5 text-brand-gold" />
            <span className="font-medium text-slate-300">Hack-A-Throne National Hackathon 2026</span>
          </div>
          <span className="hidden sm:inline text-navy-600">•</span>
          <span className="font-medium text-slate-300">Domain: EdTech & Future of Learning</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Backend API:</span>
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  backendStatus === 'online'
                    ? 'bg-brand-green shadow-sm shadow-brand-green'
                    : backendStatus === 'offline'
                    ? 'bg-rose-500 shadow-sm shadow-rose-500'
                    : 'bg-amber-400 animate-pulse'
                }`}
              />
              <span className="font-mono text-[11px] text-slate-300">
                {backendStatus === 'online' ? 'Connected' : backendStatus === 'offline' ? 'Offline' : 'Connecting...'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-teal" />
            <span>Team AlgoAces</span>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-4 pt-4 border-t border-navy-900 text-center text-[11px] text-slate-400">
        SkillPath AI · Empowering tier-2/3 college students & first-generation learners with adaptive, AI-driven career guidance.
      </div>
    </footer>
  );
};
