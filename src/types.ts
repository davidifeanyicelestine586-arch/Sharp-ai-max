export type ContentType = 'blog' | 'linkedin' | 'x' | 'instagram' | 'facebook' | 'email';

export interface PromptTemplate {
  id: string;
  title: string;
  prompt: string;
  category: 'marketing' | 'business' | 'education' | 'technology' | 'personal branding';
  description: string;
}

export interface HistoryItem {
  id: string;
  type: 'single' | 'stacked';
  title: string;
  input: string;
  contentType?: ContentType; // for single
  category?: string;
  data: {
    blogPost?: string;
    linkedinPost?: string;
    xThread?: string[];
    instagramCaption?: string;
    emailNewsletter?: string;
    facebookPost?: string;
    singleOutput?: string; // for single
  };
  createdAt: string;
  tags?: string[];
  isFavorite?: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  tier: 'free' | 'pro';
  creditsTotal: number;
  creditsUsed: number;
  wordCountGenerated: number;
  stackRuns: number;
  isLoggedIn: boolean;
}

export interface DashboardStats {
  totalWords: number;
  totalStacks: number;
  creditsRemaining: number;
  recentActivity: HistoryItem[];
}
