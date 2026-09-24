import React, { useState, useEffect } from 'react';
import { 
  HistoryItem, 
  PromptTemplate, 
  UserProfile, 
  ContentType,
  DashboardStats 
} from './types';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import SingleWriterView from './components/SingleWriterView';
import StackerView from './components/StackerView';
import PromptLibraryView from './components/PromptLibraryView';
import HistoryView from './components/HistoryView';
import ProfileView from './components/ProfileView';
import AuthOverlay from './components/AuthOverlay';
import TagGuideModal from './components/TagGuideModal';

// Built-in prompt templates
const STOCK_TEMPLATES: PromptTemplate[] = [
  {
    id: 'pas-copywriter',
    title: 'PAS (Problem-Agitate-Solve) Copywriter',
    category: 'marketing',
    description: 'Structure social copywriting addressing a core visitor pain point, agitating it, and positioning your solution.',
    prompt: 'Write a persuasive PAS campaign. Problem: Creators take hours copying a single post into emails, LinkedIn, and threads manually. Agitate: Explain how exhausting, error-prone, and time-wasting this form of manual labor is, taking away from true building. Solve: Introduce Sharp AI - the 5-in-1 Content Studio Stacker that repurposes any idea instantly.'
  },
  {
    id: 'aida-email',
    title: 'AIDA (Attention-Interest-Desire-Action) Pitch',
    category: 'marketing',
    description: 'Acquire high-intent leads using the classic direct-response attention copy format.',
    prompt: 'Write an AIDA series pitching our local virtualization container manager (Acode & Termux workflow setup). Direct readers to try our free CLI tool.'
  },
  {
    id: 'linkedin-failure',
    title: 'Failure-to-Learning Authenticity',
    category: 'personal branding',
    description: 'Synthesize standard startup or software debugging struggles into an engaging, empathetic story.',
    prompt: 'Create a narrative detailing how a server went offline during an critical preview build due to incorrect ES Modules path resolutions, how it was isolated, and the 3 clean architectural lessons implemented.'
  },
  {
    id: 'eli5',
    title: 'Explain Like I\'m 5 (Eli5)',
    category: 'education',
    description: 'Demystify deep tech, cloud run virtual models, or virtualization systems into basic lay terms.',
    prompt: 'Explain what standard virtualization sandboxing containers are, using the intuitive analogy of a restaurant pantry with separate spice lockers.'
  },
  {
    id: 'concept-analogy',
    title: 'System breakdown via Analogy',
    category: 'education',
    description: 'Present complex engineering mechanics through clean, recognizable visual paradigms.',
    prompt: 'Explain how Node.js Asynchronous Non-Blocking Event Loops work. Link this concept directly to a fast-service coffee barista taking orders other than just waiting on the grinder.'
  },
  {
    id: 'tech-assessment',
    title: 'Emergent Tech Trend Audit',
    category: 'technology',
    description: 'Evaluate the commercial impact of AI developer tool chains inside modern setups.',
    prompt: 'Conduct a tech trend audit on Generative AI agent-to-environment interfaces, highlighting multi-edit file configurations, and predicting local client speeds inside the browser over the next 3 years.'
  },
];

export default function App() {
  // Navigation Routing Tab State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  // User Authentication State
  const [user, setUser] = useState<UserProfile>({
    id: '',
    email: '',
    name: '',
    tier: 'free',
    creditsTotal: 100,
    creditsUsed: 0,
    wordCountGenerated: 0,
    stackRuns: 0,
    isLoggedIn: false
  });

  // History draft list
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // User Contributing Templates
  const [customPrompts, setCustomPrompts] = useState<PromptTemplate[]>([]);

  // Clipboard Copied Notifications ID indicator
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Guided Tag onboarding modal indicator
  const [isTagGuideOpen, setIsTagGuideOpen] = useState(false);

  // Prepopulated values to feed into content generators on re-generate request
  const [prepopulatedPrompt, setPrepopulatedPrompt] = useState<string>('');
  const [prepopulatedType, setPrepopulatedType] = useState<ContentType | undefined>(undefined);

  // Layout presentation theme (dark/light mode) state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('sharp_ai_theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  // Keep layout element dark-mode settings synced on load and change
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
  }, [theme]);

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('sharp_ai_theme', nextTheme);
  };

  // Sync state with localStorage once at load
  useEffect(() => {
    const savedUser = localStorage.getItem('sharp_ai_user_profile');
    const savedHistory = localStorage.getItem('sharp_ai_studio_history');
    const savedCustomTpl = localStorage.getItem('sharp_ai_custom_prompts');

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Stale profile parsing error:', e);
      }
    }

    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Stale history parsing error:', e);
      }
    }

    if (savedCustomTpl) {
      try {
        setCustomPrompts(JSON.parse(savedCustomTpl));
      } catch (e) {
        console.error('Stale templates parsing error:', e);
      }
    }
  }, []);

  // Auto-onboard new sessions who haven't reviewed the tagging documentation
  useEffect(() => {
    if (user.isLoggedIn) {
      const seenGuide = localStorage.getItem('sharp_ai_seen_tag_guide');
      if (!seenGuide) {
        setIsTagGuideOpen(true);
      }
    }
  }, [user.isLoggedIn]);

  // Utility to update and persist user state
  const updateProfileAndSave = (updatedProfile: Partial<UserProfile>) => {
    setUser(prev => {
      const combined = { ...prev, ...updatedProfile };
      localStorage.setItem('sharp_ai_user_profile', JSON.stringify(combined));
      return combined;
    });
  };

  // Utility to update history
  const saveHistoryList = (newHistoryList: HistoryItem[]) => {
    setHistory(newHistoryList);
    localStorage.setItem('sharp_ai_studio_history', JSON.stringify(newHistoryList));
  };

  // Helper copy notification handler
  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Actions: User Login and auth integration
  const handleLoginSuccess = (name: string, email: string, tier: 'free' | 'pro') => {
    updateProfileAndSave({
      id: `user-${Date.now()}`,
      name,
      email,
      tier,
      creditsTotal: tier === 'pro' ? 1000 : 100,
      creditsUsed: 0,
      wordCountGenerated: 0,
      stackRuns: 0,
      isLoggedIn: true
    });
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setUser({
      id: '',
      email: '',
      name: '',
      tier: 'free',
      creditsTotal: 100,
      creditsUsed: 0,
      wordCountGenerated: 0,
      stackRuns: 0,
      isLoggedIn: false
    });
    localStorage.removeItem('sharp_ai_user_profile');
    setActiveTab('dashboard');
  };

  // Actions: Custom Prompt Recipe Creation
  const handleAddCustomPrompt = (tpl: { title: string; category: any; description: string; prompt: string }) => {
    const freshTemplate: PromptTemplate = {
      id: `custom-${Date.now()}`,
      title: tpl.title,
      category: tpl.category,
      description: tpl.description,
      prompt: tpl.prompt
    };

    const combinedList = [freshTemplate, ...customPrompts];
    setCustomPrompts(combinedList);
    localStorage.setItem('sharp_ai_custom_prompts', JSON.stringify(combinedList));
  };

  const handleDeleteCustomPrompt = (id: string) => {
    const filtered = customPrompts.filter(p => p.id !== id);
    setCustomPrompts(filtered);
    localStorage.setItem('sharp_ai_custom_prompts', JSON.stringify(filtered));
  };

  const handleDeployPromptInEditor = (promptTpl: PromptTemplate) => {
    setPrepopulatedPrompt(promptTpl.prompt);
    if (promptTpl.category === 'marketing') setPrepopulatedType('facebook');
    else if (promptTpl.category === 'personal branding') setPrepopulatedType('linkedin');
    else if (promptTpl.category === 'business') setPrepopulatedType('email');
    else if (promptTpl.category === 'education') setPrepopulatedType('blog');
    else setPrepopulatedType('linkedin');
    setActiveTab('write');
  };

  // Actions: Single Content Generation calling our server endpoint proxy
  const handleGenerateSingleText = async (prompt: string, contentType: ContentType): Promise<string> => {
    // Check credits constraint under Free tier
    if (user.tier === 'free' && user.creditsUsed >= user.creditsTotal) {
      throw new Error('Workspace Quota Exceeded. Open the workspace profile to review the local tier state.');
    }

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, contentType })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || 'Failure during prompt execution.');
      }

      const responseData = await response.json();
      const generatedTextText = responseData.text;

      // Update telemetry state
      const textWordCount = generatedTextText.split(/\s+/).filter(Boolean).length;
      updateProfileAndSave({
        creditsUsed: user.creditsUsed + 1,
        wordCountGenerated: user.wordCountGenerated + textWordCount
      });

      return generatedTextText;

    } catch (e: any) {
      console.error('REST Call error:', e);
      throw e;
    }
  };

  const handleCreateSingleHistoryItem = (prompt: string, outputText: string, contentType: ContentType, tags?: string[]) => {
    const titleSnippet = prompt.split(' ').slice(0, 4).join(' ');
    const freshItem: HistoryItem = {
      id: `draft-single-${Date.now()}`,
      type: 'single',
      title: `${contentType.toUpperCase()} Campaign: ${titleSnippet}...`,
      input: prompt,
      contentType,
      createdAt: new Date().toISOString(),
      tags: tags || [],
      data: {
        singleOutput: outputText
      }
    };

    saveHistoryList([freshItem, ...history]);
  };

  // Actions: Simultaneous Multi-channel repurposer content stacker
  const handleStackMultiChannel = async (idea: string): Promise<{
    blogPost: string;
    linkedinPost: string;
    xThread: string[];
    instagramCaption: string;
    emailNewsletter: string;
  }> => {
    // Check limits
    if (user.tier === 'free' && user.creditsUsed + 5 > user.creditsTotal) {
      throw new Error('Workspace Quota Exceeded. Complete stack takes 5 credits. Open the workspace profile to review the local tier state.');
    }

    try {
      const response = await fetch('/api/stack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea })
      });

      if (!response.ok) {
        const errObj = await response.json();
        throw new Error(errObj?.error || 'Stacking engine failure.');
      }

      const results = await response.json();

      // update tally stats
      const blogWords = (results.blogPost || '').split(/\s+/).filter(Boolean).length;
      const liWords = (results.linkedinPost || '').split(/\s+/).filter(Boolean).length;
      const igWords = (results.instagramCaption || '').split(/\s+/).filter(Boolean).length;
      const emailWords = (results.emailNewsletter || '').split(/\s+/).filter(Boolean).length;
      const tweetWords = (results.xThread || []).join(' ').split(/\s+/).filter(Boolean).length;
      const totalWordsAdd = blogWords + liWords + igWords + emailWords + tweetWords;

      updateProfileAndSave({
        creditsUsed: user.creditsUsed + 5,
        wordCountGenerated: user.wordCountGenerated + totalWordsAdd,
        stackRuns: user.stackRuns + 1
      });

      return results;

    } catch (e: any) {
      console.error('Stack REST Client error:', e);
      throw e;
    }
  };

  const handleCreateMultiHistoryItem = (
    idea: string, 
    assets: {
      blogPost: string;
      linkedinPost: string;
      xThread: string[];
      instagramCaption: string;
      emailNewsletter: string;
    },
    tags?: string[]
  ) => {
    const snippet = idea.split(' ').slice(0, 4).join(' ');
    const freshItem: HistoryItem = {
      id: `draft-stacked-${Date.now()}`,
      type: 'stacked',
      title: `Stacked Suite: "${snippet}..."`,
      input: idea,
      createdAt: new Date().toISOString(),
      tags: tags || [],
      data: assets
    };

    saveHistoryList([freshItem, ...history]);
  };

  const handleUpdateHistoryItemTags = (id: string, tags: string[]) => {
    const updated = history.map(item => {
      if (item.id === id) {
        return { ...item, tags };
      }
      return item;
    });
    saveHistoryList(updated);
  };

  const handleToggleFavoriteHistoryItem = (id: string) => {
    const updated = history.map(item => {
      if (item.id === id) {
        return { ...item, isFavorite: !item.isFavorite };
      }
      return item;
    });
    saveHistoryList(updated);
  };

  const handleRegenerateHistoryItem = (item: HistoryItem) => {
    setPrepopulatedPrompt(item.input);
    if (item.type === 'single') {
      setPrepopulatedType(item.contentType);
      setActiveTab('write');
    } else {
      setActiveTab('stacker');
    }
  };

  // History operations (Delete individual, clear workspace archives)
  const handleDeleteHistoryItem = (id: string) => {
    const updated = history.filter(item => item.id !== id);
    saveHistoryList(updated);
  };

  const handleClearAllHistory = () => {
    saveHistoryList([]);
  };

  // Upgrade / plan handlers
  const handleUpgradeToPro = () => {
    updateProfileAndSave({
      tier: 'pro',
      creditsTotal: 1000,
    });
  };

  const handleDowngradeToFree = () => {
    updateProfileAndSave({
      tier: 'free',
      creditsTotal: 100,
    });
  };

  const handleUpdateUserName = (newName: string) => {
    updateProfileAndSave({
      name: newName
    });
  };

  // Merge preloaded stock templates with user custom contributed ones
  const finalPrompts = [...customPrompts, ...STOCK_TEMPLATES];

  // Dashboard Stats assembler
  const dashboardStats: DashboardStats = {
    totalWords: user.wordCountGenerated,
    totalStacks: user.stackRuns,
    creditsRemaining: Math.max(0, user.creditsTotal - user.creditsUsed),
    recentActivity: history.slice(0, 5)
  };

  // Gate routing: If user is not authenticated, serve the Splash portal
  if (!user.isLoggedIn) {
    return <AuthOverlay onLoginSuccess={handleLoginSuccess} />;
  }

  // Active workspace component selector
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            stats={dashboardStats}
            user={user}
            setActiveTab={setActiveTab}
            onCopy={handleCopyText}
            onDelete={handleDeleteHistoryItem}
            copiedId={copiedId}
            onOpenTagGuide={() => setIsTagGuideOpen(true)}
          />
        );
      case 'write':
        return (
          <SingleWriterView
            prompts={finalPrompts}
            onGenerate={handleGenerateSingleText}
            onAddHistory={handleCreateSingleHistoryItem}
            prepopulatedPrompt={prepopulatedPrompt}
            prepopulatedType={prepopulatedType}
            onResetPrepopulated={() => {
              setPrepopulatedPrompt('');
              setPrepopulatedType(undefined);
            }}
          />
        );
      case 'stacker':
        return (
          <StackerView
            onStack={handleStackMultiChannel}
            onAddMultiHistory={handleCreateMultiHistoryItem}
            prepopulatedPrompt={prepopulatedPrompt}
            onResetPrepopulated={() => {
              setPrepopulatedPrompt('');
            }}
          />
        );
      case 'prompts':
        return (
          <PromptLibraryView
            prompts={finalPrompts}
            onAddCustomPrompt={handleAddCustomPrompt}
            onDeleteCustomPrompt={handleDeleteCustomPrompt}
            onDeployPrompt={handleDeployPromptInEditor}
          />
        );
      case 'history':
        return (
          <HistoryView
            history={history}
            onDelete={handleDeleteHistoryItem}
            onClearAll={handleClearAllHistory}
            onCopy={handleCopyText}
            copiedId={copiedId}
            onUpdateTags={handleUpdateHistoryItemTags}
            onOpenTagGuide={() => setIsTagGuideOpen(true)}
            onToggleFavorite={handleToggleFavoriteHistoryItem}
            onRegenerate={handleRegenerateHistoryItem}
          />
        );
      case 'profile':
        return (
          <ProfileView
            user={user}
            onUpgrade={handleUpgradeToPro}
            onDowngrade={handleDowngradeToFree}
            onUpdateName={handleUpdateUserName}
          />
        );
      default:
        return <div className="text-slate-400">Section not configured.</div>;
    }
  };

  return (
    <div id="sharp-ai-app-shell" className="flex flex-col md:flex-row h-screen w-screen bg-slate-50 dark:bg-slate-950 overflow-hidden text-slate-900 dark:text-slate-100 antialiased font-sans transition-colors duration-300">
      {/* Persisting sidebar / mobile responsive drawer banner */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />
      
      {/* Workspace central work area */}
      <main className="flex-1 h-full md:h-screen overflow-y-auto overflow-x-hidden p-6 md:p-10 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          {renderTabContent()}
        </div>
      </main>

      {/* Guided Tag Overlay Model */}
      <TagGuideModal 
        isOpen={isTagGuideOpen} 
        onClose={() => {
          localStorage.setItem('sharp_ai_seen_tag_guide', 'true');
          setIsTagGuideOpen(false);
        }} 
      />
    </div>
  );
}
