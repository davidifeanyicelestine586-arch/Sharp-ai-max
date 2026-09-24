import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Layers, 
  Copy, 
  Check, 
  FolderPlus, 
  AlertCircle,
  FileText,
  Linkedin,
  Twitter,
  Instagram,
  Mail,
  Download
} from 'lucide-react';

interface StackerViewProps {
  onStack: (idea: string) => Promise<{
    blogPost: string;
    linkedinPost: string;
    xThread: string[];
    instagramCaption: string;
    emailNewsletter: string;
  }>;
  onAddMultiHistory: (
    input: string,
    assets: {
      blogPost: string;
      linkedinPost: string;
      xThread: string[];
      instagramCaption: string;
      emailNewsletter: string;
    },
    tags?: string[]
  ) => void;
  prepopulatedPrompt?: string;
  onResetPrepopulated?: () => void;
}

export default function StackerView({ 
  onStack, 
  onAddMultiHistory, 
  prepopulatedPrompt, 
  onResetPrepopulated 
}: StackerViewProps) {
  const [ideaInput, setIdeaInput] = useState('');
  const [isStacking, setIsStacking] = useState(false);
  const [loadingStep, setLoadingStep] = useState('Analyzing core concepts...');
  const [errorMsg, setErrorMsg] = useState('');
  
  const [stackedAssets, setStackedAssets] = useState<{
    blogPost: string;
    linkedinPost: string;
    xThread: string[];
    instagramCaption: string;
    emailNewsletter: string;
  } | null>(null);

  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<ContentType>('blog');
  const [copiedChannel, setCopiedChannel] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Draft']);
  const [customTagText, setCustomTagText] = useState('');

  // Apply prepopulated values on mount/prop change
  useEffect(() => {
    if (prepopulatedPrompt) {
      setIdeaInput(prepopulatedPrompt);
      onResetPrepopulated?.();
    }
  }, [prepopulatedPrompt, onResetPrepopulated]);

  const loadingSteps = [
    'Deconstructing raw concept outline...',
    'Generating structured SEO blog article...',
    'Formatting LinkedIn post with hook...',
    'Crafting sequential X thread tweets...',
    'Writing email newsletter broadcast...',
    'Curating visual Instagram caption...'
  ];

  const handleStack = async () => {
    if (!ideaInput.trim()) {
      setErrorMsg('Please describe a concept, article thesis, product release, or talk outline.');
      return;
    }

    setIsStacking(true);
    setErrorMsg('');
    setStackedAssets(null);
    setIsSaved(false);

    let stepIndex = 0;
    const interval = setInterval(() => {
      setLoadingStep(loadingSteps[stepIndex % loadingSteps.length]);
      stepIndex++;
    }, 2400);

    try {
      const results = await onStack(ideaInput);
      setStackedAssets(results);
      setActiveWorkspaceTab('blog');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'Stacking generation failed. Check server connection.');
    } finally {
      clearInterval(interval);
      setIsStacking(false);
    }
  };

  const copyToClipboard = (text: string, channelKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedChannel(channelKey);
    setTimeout(() => setCopiedChannel(null), 2000);
  };

  const handleCopyAll = () => {
    if (!stackedAssets) return;
    const fullText = `SHARP AI CONTENT STACK
CONCEPT: "${ideaInput}"
==================================================
1. SEO BLOG POST
==================================================
${stackedAssets.blogPost}

==================================================
2. LINKEDIN POST
==================================================
${stackedAssets.linkedinPost}

==================================================
3. X (TWITTER) THREAD
==================================================
${stackedAssets.xThread.map((tweet, i) => `[${i + 1}/${stackedAssets.xThread.length}]\n${tweet}`).join('\n\n')}

==================================================
4. INSTAGRAM CAPTION
==================================================
${stackedAssets.instagramCaption}

==================================================
5. EMAIL NEWSLETTER
==================================================
${stackedAssets.emailNewsletter}
`;
    copyToClipboard(fullText, 'all');
  };

  const handleSaveToStudio = () => {
    if (!stackedAssets) return;
    onAddMultiHistory(ideaInput, stackedAssets, selectedTags);
    setIsSaved(true);
  };

  const getChannelText = (channel: ContentType): string => {
    if (!stackedAssets) return '';
    switch (channel) {
      case 'blog': return stackedAssets.blogPost;
      case 'linkedin': return stackedAssets.linkedinPost;
      case 'x': return stackedAssets.xThread.join('\n\n--- Next Tweet ---\n\n');
      case 'instagram': return stackedAssets.instagramCaption;
      case 'email': return stackedAssets.emailNewsletter;
      default: return '';
    }
  };

  const channelStats = stackedAssets ? {
    blog: stackedAssets.blogPost.split(/\s+/).filter(Boolean).length,
    linkedin: stackedAssets.linkedinPost.split(/\s+/).filter(Boolean).length,
    x: stackedAssets.xThread.join(' ').split(/\s+/).filter(Boolean).length,
    instagram: stackedAssets.instagramCaption.split(/\s+/).filter(Boolean).length,
    email: stackedAssets.emailNewsletter.split(/\s+/).filter(Boolean).length,
  } : null;

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in text-slate-100">
      {/* Header */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md">
            Multi-Channel Stacker
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
          Content Stacker
        </h1>
        <p className="text-xs md:text-sm text-slate-400 max-w-2xl leading-relaxed">
          Input one core concept to simultaneously generate five publication-ready deliverables: an SEO blog post, LinkedIn narrative, X thread, Instagram caption, and newsletter broadcast.
        </p>
      </div>

      {/* Idea Input Card */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 shadow-sm">
        <div className="space-y-1.5">
          <label htmlFor="stacker-idea-box" className="text-xs font-semibold text-slate-300">
            Core Idea, Thesis, Product Release, or Outline
          </label>
          <textarea
            id="stacker-idea-box"
            value={ideaInput}
            onChange={(e) => setIdeaInput(e.target.value.slice(0, 4000))}
            placeholder="e.g. A developer tool for zero-config distributed SQLite replication on edge nodes with automatic failover and client-side encryption..."
            className="w-full h-32 bg-slate-950 text-slate-100 border border-slate-800 rounded-xl p-3.5 text-xs md:text-sm focus:outline-none focus:border-indigo-500 placeholder-slate-600 resize-none leading-relaxed transition-colors"
          />
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs font-mono text-slate-500 tabular-nums">
            {ideaInput.length}/4000 characters
          </span>
          <button
            id="activate-stacker-button"
            onClick={handleStack}
            disabled={isStacking}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold leading-none shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            {isStacking ? (
              <span className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{loadingStep}</span>
              </span>
            ) : (
              <>
                <Layers className="h-4 w-4 text-white" />
                <span>Generate 5-in-1 Stack</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Output Section */}
      {stackedAssets && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start animate-fade-in">
          {/* Channel Selector Sidebar */}
          <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-white">Generated Deliverables</h3>
              <p className="text-[11px] text-slate-400">Select a channel to review formatted copy</p>
            </div>

            <div className="space-y-1.5">
              {[
                { id: 'blog', label: 'SEO Blog Post', icon: FileText, words: channelStats?.blog },
                { id: 'linkedin', label: 'LinkedIn Article', icon: Linkedin, words: channelStats?.linkedin },
                { id: 'x', label: 'X (Twitter) Thread', icon: Twitter, words: channelStats?.x, extra: `${stackedAssets.xThread.length} tweets` },
                { id: 'instagram', label: 'Instagram Caption', icon: Instagram, words: channelStats?.instagram },
                { id: 'email', label: 'Email Newsletter', icon: Mail, words: channelStats?.email },
              ].map(chan => {
                const Icon = chan.icon;
                const isSelected = activeWorkspaceTab === chan.id;
                return (
                  <button
                    key={chan.id}
                    onClick={() => setActiveWorkspaceTab(chan.id as ContentType)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600/15 border-indigo-500 text-white font-semibold'
                        : 'bg-slate-950 hover:bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`p-1.5 rounded-md ${isSelected ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-900 text-slate-400'}`}>
                        <Icon className="h-4 w-4 shrink-0" />
                      </span>
                      <div className="min-w-0">
                        <span className="block text-xs font-semibold">{chan.label}</span>
                        <span className="block text-[10px] font-mono text-slate-500 tabular-nums">
                          {chan.words} words {chan.extra ? `• ${chan.extra}` : ''}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-indigo-400 font-semibold">&rarr;</span>
                  </button>
                );
              })}
            </div>

            {/* Tag Assigner */}
            <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Assign Labels:</span>
              <div className="flex flex-wrap items-center gap-1.5">
                {['Draft', 'Final', 'Q1-Campaign'].map(t => {
                  const isSelected = selectedTags.includes(t);
                  return (
                    <button
                      key={t}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedTags(prev => prev.filter(x => x !== t));
                        } else {
                          setSelectedTags(prev => [...prev, t]);
                        }
                      }}
                      className={`px-2 py-0.5 text-[10px] font-mono font-semibold rounded-md border transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
                {selectedTags.filter(t => !['Draft', 'Final', 'Q1-Campaign'].includes(t)).map(t => (
                  <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-semibold rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                    {t}
                    <button
                      onClick={() => setSelectedTags(prev => prev.filter(x => x !== t))}
                      className="hover:text-rose-400 cursor-pointer text-xs"
                      aria-label={`Remove ${t} tag`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-1 pt-1">
                <input
                  type="text"
                  placeholder="+ Custom Tag"
                  value={customTagText}
                  onChange={(e) => setCustomTagText(e.target.value.slice(0, 20))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const trimmed = customTagText.trim();
                      if (trimmed && !selectedTags.includes(trimmed)) {
                        setSelectedTags(prev => [...prev, trimmed]);
                      }
                      setCustomTagText('');
                    }
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[10px] focus:outline-none focus:border-indigo-500 text-slate-200 placeholder-slate-600 font-sans"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
              <button
                id="save-studio-stack"
                onClick={handleSaveToStudio}
                disabled={isSaved}
                className={`w-full py-2.5 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  isSaved
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 cursor-default'
                    : 'bg-indigo-600 hover:bg-indigo-500 border-indigo-500 text-white'
                }`}
              >
                <FolderPlus className="h-4 w-4" />
                <span>{isSaved ? 'Suite Saved to Studio' : 'Save Suite to Studio'}</span>
              </button>

              <button
                onClick={handleCopyAll}
                className="w-full py-2 px-4 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                {copiedChannel === 'all' ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span className="text-emerald-400">All Channels Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy All 5 Channels</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Workstation Output Display */}
          <div className="lg:col-span-8 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-indigo-400">
                  {activeWorkspaceTab.toUpperCase()} DELIVERABLE
                </span>
                <h3 className="text-sm font-bold text-white capitalize">
                  {activeWorkspaceTab} Copy Draft
                </h3>
              </div>

              <button
                onClick={() => copyToClipboard(getChannelText(activeWorkspaceTab), activeWorkspaceTab)}
                className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1.5 font-semibold"
                title={`Copy ${activeWorkspaceTab} text`}
                aria-label={`Copy ${activeWorkspaceTab} text`}
              >
                {copiedChannel === activeWorkspaceTab ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-mono">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Channel</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 max-h-[520px] overflow-y-auto leading-relaxed text-xs sm:text-sm text-slate-200 font-sans">
              {activeWorkspaceTab === 'x' ? (
                <div className="space-y-3">
                  <div className="text-[10px] uppercase tracking-wider font-mono font-bold text-indigo-400 mb-2">
                    Numbered Tweet Sequence
                  </div>
                  {stackedAssets.xThread.map((tweet, idx) => (
                    <div key={idx} className="p-3.5 rounded-lg bg-slate-900 border border-slate-800/80 font-sans relative space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span>Tweet {idx + 1} of {stackedAssets.xThread.length}</span>
                        <span className="tabular-nums">{tweet.length} chars</span>
                      </div>
                      <p className="text-slate-200 text-xs leading-normal whitespace-pre-wrap">{tweet}</p>
                    </div>
                  ))}
                </div>
              ) : activeWorkspaceTab === 'blog' ? (
                <div className="whitespace-pre-wrap leading-relaxed space-y-2">
                  {stackedAssets.blogPost}
                </div>
              ) : (
                <div className="whitespace-pre-wrap leading-relaxed">
                  {getChannelText(activeWorkspaceTab)}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
