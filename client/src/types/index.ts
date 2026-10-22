export type SkillName = 'DSA' | 'Programming' | 'SQL' | 'Git' | 'CS Fundamentals';

export interface User {
  id: string;
  name: string;
  email: string;
  targetRole?: string;
  scores?: Record<string, number>;
  done?: string[];
  weak?: string[];
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface SkillGap {
  skill: string;
  current: number;
  required: number;
  gap: number;
}

export interface RoadmapWeek {
  week: number;
  skill: string;
  topic: string;
  practice: string[];
  project?: string;
}

export interface RoadmapResponse {
  source: 'gemini' | 'fallback';
  geminiError?: string;
  gaps: SkillGap[];
  roadmap: RoadmapWeek[];
}

export interface PracticeResponse {
  scores: Record<string, number>;
  status: 'completed' | 'needs-revision';
}

export interface QuizQuestion {
  id: number;
  skill: SkillName;
  question: string;
  options: string[];
  answerIndex: number;
  explanation?: string;
}

export interface TargetRoleData {
  title: string;
  description: string;
  iconName: string;
  benchmarks: Record<SkillName, number>;
  keyHighlights: string[];
}

export type PageView =
  | 'landing'
  | 'roles'
  | 'assessment'
  | 'dashboard'
  | 'roadmap'
  | 'practice';
