/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from 'react';
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
  ChevronDown,
  ChevronUp,
  Download
} from 'lucide-react';
import { ContentType } from '../types';

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
    }
  ) => void;
}

export default function StackerView({ onStack, onAddMultiHistory }: StackerViewProps) {
  const [ideaInput, setIdeaInput] = useState('');
  const [isStacking, setIsStacking] = useState(false);
  const [loadingStep, setLoadingStep] = useState('Extracting core concepts...');
  const [errorMsg, setErrorMsg] = useState('');
  
  // Active outputs
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

  const loadingSteps = [
    'Deconstructing raw concept outline...',
    'Generating comprehensive SEO Blog markdown structure...',
    'Crafting attention-grabbing LinkedIn hook sequence...',
    'Structuring value-packed 4-tweet Twitter thread...',
    'Writing conversational educational email newsletter copy...',
    'Curating visual Instagram prompt tags...',
    'Proofreading multi-channel assets with copywriter intelligence...'
  ];

  const handleStack = async () => {
    if (!ideaInput.trim()) {
      setErrorMsg('Submit a raw idea, draft post topic, or article thesis to run stacking.');
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
    }, 2800);

    try {
      const results = await onStack(ideaInput);
      setStackedAssets(results);
      // default tab
      setActiveWorkspaceTab('blog');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'Gemini multi-generation failed. Check if API credentials exist.');
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
IDEA: "${ideaInput}"
--------------------------------------------------
1. SEO BLOG POST:
${stackedAssets.blogPost}

--------------------------------------------------
2. LINKEDIN POST:
${stackedAssets.linkedinPost}

--------------------------------------------------
3. X (TWITTER) THREAD:
${stackedAssets.xThread.join('\n\n')}

--------------------------------------------------
4. INSTAGRAM CAPTION:
${stackedAssets.instagramCaption}

--------------------------------------------------
5. EMAIL NEWSLETTER:
${stackedAssets.emailNewsletter}
`;
    copyToClipboard(fullText, 'all');
  };

  const handleSaveToStudio = () => {
    if (!stackedAssets) return;
    onAddMultiHistory(ideaInput, stackedAssets);
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

  return (
    <div className="space-y-8 animate-fade-in text-slate-100">
      {/* Introduction Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-gradient-to-r from-purple-500/10 to-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20">
          <Layers className="h-3.5 w-3.5 shrink-0" />
          Core Differentiator Feature
        </div>
        <h1 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight">
          Content Stacker <span className="bg-gradient-to-r from-indigo-300 to-indigo-100 bg-clip-text text-transparent">⚡</span>
        </h1>
        <p className="text-xs md:text-sm text-slate-400 max-w-2xl">
          Instantly formulate five native publication drafts tailored for major distribution channels out of a single core concept or educational spark.
        </p>
      </div>

      {/* Concept Creator area */}
      <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-900 space-y-6 shadow-sm">
        <div className="space-y-2 text-xs font-semibold">
          <label className="text-slate-400">Describe your core idea, thesis, startup product, or news spark</label>
          <textarea
            id="stacker-idea-box"
            value={ideaInput}
            onChange={(e) => setIdeaInput(e.target.value)}
            placeholder="e.g. A digital nomad's workspace planner with time-blocking calendar APIs that recalculate timezone differences automatically for remote software teams..."
            className="w-full h-28 bg-slate-950 text-slate-200 border border-slate-900 rounded-xl p-4 text-xs md:text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 placeholder-slate-700 resize-none leading-relaxed transition-all"
          />
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-500/5 border border-rose-500/10 p-3 rounded-xl animate-fade-in">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <button
          id="activate-stacker-button"
          onClick={handleStack}
          disabled={isStacking}
          className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-500 hover:from-purple-500 hover:to-indigo-500 text-slate-100 text-xs font-bold leading-none shadow-lg shadow-purple-600/10 hover:shadow-purple-600/25 transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
        >
          {isStacking ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>{loadingStep}</span>
            </span>
          ) : (
            <>
              <span>Activate Content Stacker</span>
              <span className="text-sm">⚡</span>
            </>
          )}
        </button>
      </div>

      {/* Active Output Section */}
      {stackedAssets && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
          {/* Channel Selector Sidebar column */}
          <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-900/50 border border-slate-900 space-y-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-200">Constructed Channels</h3>
              <p className="text-[11px] text-slate-500">Pick raw channels to view formatted workspace copy</p>
            </div>

            <div className="space-y-1.5">
              {[
                { id: 'blog', label: 'SEO Blog Post', icon: FileText, preview: stackedAssets.blogPost },
                { id: 'linkedin', label: 'LinkedIn Article', icon: Linkedin, preview: stackedAssets.linkedinPost },
                { id: 'x', label: 'X (Twitter) Thread', icon: Twitter, preview: stackedAssets.xThread.join(' ') },
                { id: 'instagram', label: 'Instagram Caption', icon: Instagram, preview: stackedAssets.instagramCaption },
                { id: 'email', label: 'Email Newsletter', icon: Mail, preview: stackedAssets.emailNewsletter },
              ].map(chan => {
                const Icon = chan.icon;
                const isSelected = activeWorkspaceTab === chan.id;
                return (
                  <button
                    key={chan.id}
                    onClick={() => setActiveWorkspaceTab(chan.id as ContentType)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-300 shadow-sm'
                        : 'bg-slate-950 hover:bg-slate-900 border-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`p-2 rounded-lg ${isSelected ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-900 text-slate-400'}`}>
                        <Icon className="h-4 w-4 shrink-0" />
                      </span>
                      <div className="min-w-0">
                        <span className="block text-xs font-bold">{chan.label}</span>
                        <span className="block text-[9px] text-slate-500 truncate mt-0.5">{chan.preview.slice(0, 45)}...</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-600 font-bold">→</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-900 flex flex-col gap-2">
              <button
                id="save-studio-stack"
                onClick={handleSaveToStudio}
                disabled={isSaved}
                className={`w-full py-3 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  isSaved
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 cursor-default'
                    : 'bg-slate-950 hover:bg-slate-900 border-slate-900 text-indigo-400 hover:text-indigo-300'
                }`}
              >
                <FolderPlus className="h-4 w-4" />
                <span>{isSaved ? 'Drafts Backed Up' : 'Save Full Stack (5)'}</span>
              </button>

              <button
                onClick={handleCopyAll}
                className="w-full py-3 px-4 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-900 text-slate-350 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                {copiedChannel === 'all' ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span className="text-emerald-400">Stack Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy Complete Suite</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Active Workstation Output column */}
          <div className="lg:col-span-8 p-6 rounded-2xl bg-slate-900/50 border border-slate-900 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-900/60 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 font-mono">WORKSPACE EDITOR</span>
                <h3 className="text-sm font-bold text-slate-200 capitalize mt-0.5">{activeWorkspaceTab} Channel Outline</h3>
              </div>

              <button
                onClick={() => copyToClipboard(getChannelText(activeWorkspaceTab), activeWorkspaceTab)}
                className="p-2 px-3 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-900 text-slate-400 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1.5 font-semibold"
                title={`Copy ${activeWorkspaceTab} text`}
              >
                {copiedChannel === activeWorkspaceTab ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold font-mono">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Channel</span>
                  </>
                )}
              </button>
            </div>

            {/* Custom content display formatting depending on channel */}
            <div className="p-5 md:p-6 rounded-xl bg-slate-950 border border-slate-900/80 max-h-[500px] overflow-y-auto leading-relaxed text-xs sm:text-sm text-slate-300 font-sans">
              
              {activeWorkspaceTab === 'x' ? (
                <div className="space-y-4">
                  <div className="text-[10px] uppercase tracking-wider font-extrabold text-blue-400 bg-blue-500/5 border border-blue-500/10 px-2.5 py-1 rounded inline-block font-mono mb-2">
                    Simulated 𝕏 Tweet Thread
                  </div>
                  {stackedAssets.xThread.map((tweet, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-900/20 border border-slate-900 font-sans relative">
                      <span className="absolute top-3 right-4 font-mono text-[10px] text-slate-600 font-bold">
                        {idx + 1} / {stackedAssets.xThread.length}
                      </span>
                      <p className="pr-12 text-slate-200 leading-normal">{tweet}</p>
                    </div>
                  ))}
                </div>
              ) : activeWorkspaceTab === 'blog' ? (
                <div className="space-y-4 font-sans prose prose-invert max-w-none">
                  {/* Styled block of blog elements manually for display elegance */}
                  <div className="whitespace-pre-wrap leading-relaxed text-slate-300">
                    {stackedAssets.blogPost}
                  </div>
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
