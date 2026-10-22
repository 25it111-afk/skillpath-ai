import { AuthResponse, PracticeResponse, RoadmapResponse, User } from '../types';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '');
const TOKEN_KEY = 'skillpath_auth_token';
const USER_KEY = 'skillpath_user_profile';

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setAuthSession = (token: string, user: User) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearAuthSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getStoredUser = (): User | null => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const url = `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;

  let res: Response;
  try {
    res = await fetch(url, {
      ...options,
      headers
    });
  } catch (err: unknown) {
    throw new Error(
      'Unable to connect to SkillPath AI server. Please ensure the backend is running on http://localhost:5000.'
    );
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errorMessage = data?.error || `Request failed with status ${res.status}`;
    throw new Error(errorMessage);
  }

  return data as T;
}

export const api = {
  // Health
  checkHealth: () => request<{ ok: boolean; timestamp: string }>('/health'),

  // Auth
  register: (name: string, email: string, password: string): Promise<AuthResponse> =>
    request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    }),

  login: (email: string, password: string): Promise<AuthResponse> =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),

  // Roadmap & AI
  generateRoadmap: (
    targetRole: string,
    scores: Record<string, number>
  ): Promise<RoadmapResponse> =>
    request<RoadmapResponse>('/roadmap/generate', {
      method: 'POST',
      body: JSON.stringify({ targetRole, scores })
    }),

  submitPractice: (
    skill: string,
    topic: string,
    solved: number
  ): Promise<PracticeResponse> =>
    request<PracticeResponse>('/roadmap/practice', {
      method: 'POST',
      body: JSON.stringify({ skill, topic, solved })
    }),

  getSavedRoadmap: (): Promise<{
    targetRole?: string;
    scores?: Record<string, number>;
    roadmap?: RoadmapResponse['roadmap'];
  }> => request('/roadmap/me')
};
