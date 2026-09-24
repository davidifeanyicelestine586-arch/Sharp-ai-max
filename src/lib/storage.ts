import { HistoryItem, PromptTemplate, UserProfile } from '../types';

export const STORAGE_KEYS = {
  user: 'sharp_ai_user_profile',
  history: 'sharp_ai_studio_history',
  customPrompts: 'sharp_ai_custom_prompts',
  theme: 'sharp_ai_theme',
  tagGuide: 'sharp_ai_seen_tag_guide',
} as const;

export const EMPTY_USER: UserProfile = {
  id: '',
  email: '',
  name: '',
  tier: 'free',
  creditsTotal: 100,
  creditsUsed: 0,
  wordCountGenerated: 0,
  stackRuns: 0,
  isLoggedIn: false,
};

function readJson<T>(key: string, fallback: T, validate: (value: unknown) => value is T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed: unknown = JSON.parse(raw);
    return validate(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function isUserProfile(value: unknown): value is UserProfile {
  if (!value || typeof value !== 'object') return false;
  const user = value as Partial<UserProfile>;
  return (
    typeof user.id === 'string' &&
    typeof user.email === 'string' &&
    typeof user.name === 'string' &&
    (user.tier === 'free' || user.tier === 'pro') &&
    typeof user.creditsTotal === 'number' &&
    typeof user.creditsUsed === 'number' &&
    typeof user.wordCountGenerated === 'number' &&
    typeof user.stackRuns === 'number' &&
    Number.isFinite(user.creditsTotal) &&
    Number.isFinite(user.creditsUsed) &&
    Number.isFinite(user.wordCountGenerated) &&
    Number.isFinite(user.stackRuns) &&
    typeof user.isLoggedIn === 'boolean' &&
    user.creditsTotal >= 0 &&
    user.creditsUsed >= 0 &&
    user.wordCountGenerated >= 0 &&
    user.stackRuns >= 0
  );
}

function isHistory(value: unknown): value is HistoryItem[] {
  return Array.isArray(value) && value.every(item => {
    if (!item || typeof item !== 'object') return false;
    const candidate = item as Partial<HistoryItem>;
    return (
      typeof candidate.id === 'string' &&
      typeof candidate.title === 'string' &&
      typeof candidate.input === 'string' &&
      typeof candidate.createdAt === 'string' &&
      (candidate.type === 'single' || candidate.type === 'stacked') &&
      Array.isArray(candidate.tags)
    );
  });
}

function isPromptTemplates(value: unknown): value is PromptTemplate[] {
  return Array.isArray(value) && value.every(item => {
    if (!item || typeof item !== 'object') return false;
    const candidate = item as Partial<PromptTemplate>;
    return (
      typeof candidate.id === 'string' &&
      typeof candidate.title === 'string' &&
      typeof candidate.description === 'string' &&
      typeof candidate.prompt === 'string'
    );
  });
}

export function loadUser(): UserProfile {
  return readJson(STORAGE_KEYS.user, EMPTY_USER, isUserProfile);
}

export function loadHistory(): HistoryItem[] {
  return readJson(STORAGE_KEYS.history, [], isHistory);
}

export function loadCustomPrompts(): PromptTemplate[] {
  return readJson(STORAGE_KEYS.customPrompts, [], isPromptTemplates);
}

export function saveUser(user: UserProfile): void {
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
}

export function saveHistory(history: HistoryItem[]): void {
  localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history));
}

export function saveCustomPrompts(prompts: PromptTemplate[]): void {
  localStorage.setItem(STORAGE_KEYS.customPrompts, JSON.stringify(prompts));
}

export function clearWorkspaceStorage(): void {
  localStorage.removeItem(STORAGE_KEYS.user);
  localStorage.removeItem(STORAGE_KEYS.history);
  localStorage.removeItem(STORAGE_KEYS.customPrompts);
  localStorage.removeItem(STORAGE_KEYS.tagGuide);
  localStorage.removeItem('sharp_ai_single_prompt_autosave');
  localStorage.removeItem('sharp_ai_single_prompt_autosave_type');
}
