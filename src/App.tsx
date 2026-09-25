import React, { useState, useEffect } from 'react';
import { 
  HistoryItem, 
  PromptTemplate, 
  UserProfile, 
  ContentType,
  PromptCategory,
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
import LandingView from './components/LandingView';
import { generateContent, stackContent } from './lib/api';
import {
  clearWorkspaceStorage,
  EMPTY_USER,
  loadCustomPrompts,
  loadHistory,
  loadUser,
  saveCustomPrompts,
  saveHistory,
  saveUser,
  STORAGE_KEYS,
} from './lib/storage';

// Built-in prompt templates
const STOCK_TEMPLATES: PromptTemplate[] = [
  {
    id: 'pas-copywriter',
    title: 'PAS (Problem-Agitate-Solve) Copywriter',
    category: 'marketing',
    description: 'Structure social copywriting addressing a core visitor pain point, agitating it, and positioning your solution.',
    prompt: 'Write a persuasive PAS campaign. Problem: Creators take hours copying a single post into emails, LinkedIn, and threads manually. Agitate: Explain how exhausting, error-prone, and time-wasting this form of manual labor is, taking away from true building. Solve: Introduce the product or workflow being discussed and explain its concrete value without inventing capabilities.'
  },
  {
    id: 'aida-email',
    title: 'AIDA (Attention-Interest-Desire-Action) Pitch',
    category: 'marketing',
    description: 'Acquire high-intent leads using the classic direct-response attention copy format.',
    prompt: 'Write an AIDA series for a fictional developer workflow product. Clearly label the product as fictional and avoid invented pricing, links, or availability.'
  },
  {
    id: 'linkedin-failure',
    title: 'Failure-to-Learning Authenticity',
    category: 'personal branding',
    description: 'Synthesize standard startup or software debugging struggles into an engaging, empathetic story.',
    prompt: 'Create a narrative about a fictional software debugging incident involving an ES module path issue. Clearly distinguish the scenario from a real event and extract three architectural lessons.'
  },
  {
    id: 'eli5',
    title: 'Explain Like I\'m 5 (Eli5)',
    category: 'education',
    description: 'Demystify deep tech, cloud run virtual models, or virtualization systems into basic lay terms.',
    prompt: 'Explain virtualization and sandboxed containers using a simple restaurant-pantry analogy with separate storage areas.'
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
    prompt: 'Conduct a technology trend audit on AI agent-to-environment interfaces, distinguishing documented evidence from forecasts and uncertainty.'
  },
];

const VALID_TABS = ['overview', 'dashboard', 'write', 'stacker', 'prompts', 'history', 'profile', 'landing'] as const;
type AppTab = typeof VALID_TABS[number];

const getTabFromHash = (): string => {
  if (typeof window === 'undefined') return 'overview';
  const hash = window.location.hash.replace(/^#\/?/, '').trim().toLowerCase();
  if (!hash || hash === 'landing' || hash === 'overview') return 'overview';
  return VALID_TABS.includes(hash as AppTab) ? hash : 'overview';
};

export default function App() {
  // Navigation Routing Tab State synchronized with browser URL hash
  const [activeTab, setActiveTabState] = useState<string>(getTabFromHash);

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    if (typeof window !== 'undefined' && window.location.hash !== `#/${tab}`) {
      window.location.hash = `#/${tab}`;
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const targetTab = getTabFromHash();
      setActiveTabState(targetTab);
    };
    window.addEventListener('hashchange', handleHashChange);
    // Ensure initial URL hash is present
    if (window.location.hash !== `#/${activeTab}`) {
      window.location.hash = `#/${activeTab}`;
    }
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [activeTab]);
  
  // User Authentication State
  const [user, setUser] = useState<UserProfile>(EMPTY_USER);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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
    const saved = localStorage.getItem(STORAGE_KEYS.theme);
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
    localStorage.setItem(STORAGE_KEYS.theme, nextTheme);
  };

  // Sync state with localStorage once at load
  useEffect(() => {
    setUser(loadUser());
    setHistory(loadHistory());
    setCustomPrompts(loadCustomPrompts());
  }, []);

  // Auto-onboard new sessions who haven't reviewed the tagging documentation
  useEffect(() => {
    if (user.isLoggedIn) {
      const seenGuide = localStorage.getItem(STORAGE_KEYS.tagGuide);
      if (!seenGuide) {
        setIsTagGuideOpen(true);
      }
    }
  }, [user.isLoggedIn]);

  // Utility to update and persist user state
  const updateProfileAndSave = (
    update: Partial<UserProfile> | ((prev: UserProfile) => Partial<UserProfile>)
  ) => {
    setUser(prev => {
      const combined = { ...prev, ...(typeof update === 'function' ? update(prev) : update) };
      saveUser(combined);
      return combined;
    });
  };

  // Utility to update history
  const saveHistoryList = (newHistoryList: HistoryItem[]) => {
    setHistory(newHistoryList);
    saveHistory(newHistoryList);
  };

  // Helper copy notification handler
  const handleCopyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(text);
      window.setTimeout(() => setCopiedId(null), 2000);
    } catch {
      console.error('Clipboard copy failed.');
    }
  };

  // Actions: User Login and auth integration
  const handleLoginSuccess = (name: string, email: string, tier: 'free' | 'pro') => {
    updateProfileAndSave({
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
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
    clearWorkspaceStorage();
    setUser(EMPTY_USER);
    setHistory([]);
    setCustomPrompts([]);
    setIsTagGuideOpen(false);
    setPrepopulatedPrompt('');
    setPrepopulatedType(undefined);
    setActiveTab('dashboard');
  };

  // Actions: Custom Prompt Recipe Creation
  const handleAddCustomPrompt = (tpl: { title: string; category: PromptCategory; description: string; prompt: string }) => {
    const freshTemplate: PromptTemplate = {
      id: `custom-${Date.now()}`,
      title: tpl.title,
      category: tpl.category,
      description: tpl.description,
      prompt: tpl.prompt
    };

    const combinedList = [freshTemplate, ...customPrompts];
    setCustomPrompts(combinedList);
    saveCustomPrompts(combinedList);
  };

  const handleDeleteCustomPrompt = (id: string) => {
    const filtered = customPrompts.filter(p => p.id !== id);
    setCustomPrompts(filtered);
    saveCustomPrompts(filtered);
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
    if (user.tier === 'free' && user.creditsUsed >= user.creditsTotal) {
      throw new Error('Workspace quota reached. Review the local workspace usage state.');
    }

    try {
      const generatedTextText = await generateContent(prompt, contentType);
      const textWordCount = generatedTextText.split(/\s+/).filter(Boolean).length;

      updateProfileAndSave(prev => ({
        creditsUsed: prev.creditsUsed + 1,
        wordCountGenerated: prev.wordCountGenerated + textWordCount,
      }));

      return generatedTextText;
    } catch (error: unknown) {
      console.error('Content generation request failed.');
      throw error instanceof Error ? error : new Error('Content generation failed.');
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
  const handleStackMultiChannel = async (idea: string) => {
    if (user.tier === 'free' && user.creditsUsed + 5 > user.creditsTotal) {
      throw new Error('Workspace quota reached. A complete stack uses 5 local preview credits.');
    }

    try {
      const results = await stackContent(idea);
      const totalWordsAdd = [
        results.blogPost,
        results.linkedinPost,
        results.instagramCaption,
        results.emailNewsletter,
        results.xThread.join(' '),
      ].join(' ').split(/\s+/).filter(Boolean).length;

      updateProfileAndSave(prev => ({
        creditsUsed: prev.creditsUsed + 5,
        wordCountGenerated: prev.wordCountGenerated + totalWordsAdd,
        stackRuns: prev.stackRuns + 1,
      }));

      return results;
    } catch (error: unknown) {
      console.error('Content stacking request failed.');
      throw error instanceof Error ? error : new Error('Content stacking failed.');
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

  // Gate routing: If user is not authenticated, serve the full SaaS Landing & Product Showcase
  if (!user.isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
        <LandingView
          onEnterStudio={(tier) => {
            handleLoginSuccess('Studio Creator', 'creator@sharp-ai.local', tier || 'free');
          }}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          user={user}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />
        {isAuthModalOpen && (
          <AuthOverlay
            onLoginSuccess={handleLoginSuccess}
            onClose={() => setIsAuthModalOpen(false)}
          />
        )}
      </div>
    );
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
      case 'overview':
      case 'landing':
        return (
          <div className="-m-6 md:-m-10">
            <LandingView
              onEnterStudio={(tier) => {
                if (tier === 'pro' && user.tier !== 'pro') {
                  handleUpgradeToPro();
                }
                setActiveTab('dashboard');
              }}
              onOpenAuthModal={() => setActiveTab('profile')}
              user={user}
              theme={theme}
              onToggleTheme={handleToggleTheme}
            />
          </div>
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
          localStorage.setItem(STORAGE_KEYS.tagGuide, 'true');
          setIsTagGuideOpen(false);
        }} 
      />
    </div>
  );
}
