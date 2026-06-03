/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Sparkles, 
  Layers, 
  BookOpen, 
  History, 
  TrendingUp, 
  ArrowRight, 
  PenTool, 
  Coins,
  FileText,
  Copy,
  Check,
  Trash2
} from 'lucide-react';
import { HistoryItem, UserProfile } from '../types';
import { exportItemToPDF } from '../utils/pdfGenerator';

interface DashboardViewProps {
  stats: {
    totalWords: number;
    totalStacks: number;
    creditsRemaining: number;
    recentActivity: HistoryItem[];
  };
  user: UserProfile;
  setActiveTab: (tab: string) => void;
  onCopy: (text: string) => void;
  onDelete: (id: string) => void;
  copiedId: string | null;
  onOpenTagGuide?: () => void;
}

export default function DashboardView({ stats, user, setActiveTab, onCopy, onDelete, copiedId, onOpenTagGuide }: DashboardViewProps) {
  
  // Distribute percentages for the chart
  const items = stats.recentActivity;
  const singleCount = items.filter(x => x.type === 'single').length;
  const stackCount = items.filter(x => x.type === 'stacked').length;
  const totalCount = singleCount + stackCount || 1;
  const stackPercent = Math.round((stackCount / totalCount) * 100);
  const singlePercent = 100 - stackPercent;

  // Render format type icons
  const getFormatBadge = (type: string, contentType?: string) => {
    if (type === 'stacked') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-sm leading-none">
          <Layers className="h-3 w-3" /> 5-in-1 Stack
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm leading-none uppercase">
        <PenTool className="h-3 w-3" /> {contentType || 'Content'}
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 border border-slate-900 p-8 md:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.08),transparent)] pointer-events-none" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
              SaaS MVP Active
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-extrabold text-slate-100 tracking-tight">
              Welcome back, <span className="bg-gradient-to-r from-indigo-300 via-indigo-100 to-purple-300 bg-clip-text text-transparent">{user.name}</span>!
            </h1>
            <p className="text-sm md:text-base text-slate-400 max-w-xl leading-relaxed">
              Sharp AI Content Studio has repurposed your ideas. Let's stack some assets for your channels today. Need help organizing your campaign drafts? Learn on our <button onClick={onOpenTagGuide} className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors cursor-pointer inline underline decoration-indigo-400/30 underline-offset-4">Tag Onboarding Guide &rarr;</button>{" "}
            </p>
          </div>
          <div>
            <button
              id="cta-stacker"
              onClick={() => setActiveTab('stacker')}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-slate-100 text-sm font-bold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/35 transition-all duration-300 flex items-center gap-2 cursor-pointer border border-purple-500/20"
            >
              <span>Launch Content Stacker</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1 */}
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-900 space-y-4 shadow-sm hover:border-slate-800 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Words Generated</span>
            <div className="p-2 bg-emerald-500/10 rounded-xl">
              <TrendingUp className="h-4.5 w-4.5 text-emerald-400" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold font-mono text-slate-100 tracking-tight">
              {stats.totalWords.toLocaleString()}
            </h3>
            <p className="text-xs text-slate-500">Live word tally</p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-900 space-y-4 shadow-sm hover:border-slate-800 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Content Stacks Generated</span>
            <div className="p-2 bg-indigo-500/10 rounded-xl font-bold text-indigo-400 text-xs">
              ⚡
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold font-mono text-slate-100 tracking-tight">
              {stats.totalStacks}
            </h3>
            <p className="text-xs text-slate-500">5-in-1 multi-posts</p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-900 space-y-4 shadow-sm hover:border-slate-800 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Credits Remaining</span>
            <div className="p-2 bg-indigo-500/10 rounded-xl">
              <Coins className="h-4.5 w-4.5 text-indigo-400" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold font-mono text-slate-100 tracking-tight">
              {stats.creditsRemaining}
            </h3>
            <p className="text-xs text-slate-500">of {user.creditsTotal} available</p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-900 space-y-4 shadow-sm hover:border-slate-800 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Active Tier Status</span>
            <div className="p-2 bg-purple-500/10 rounded-xl">
              <Sparkles className="h-4.5 w-4.5 text-purple-400" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className={`text-2xl font-bold font-display uppercase tracking-wider ${
              user.tier === 'pro' 
                ? 'bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent' 
                : 'text-slate-100'
            }`}>
              {user.tier}
            </h3>
            <p className="text-xs text-slate-500">
              {user.tier === 'free' ? 'Unlock limitless speed' : 'Premier Studio Access'}
            </p>
          </div>
        </div>
      </div>

      {/* Analytics and Action Segment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* SVG Usage Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/50 border border-slate-900 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-200">Creative Production Speed</h3>
              <p className="text-xs text-slate-500">Overview of recent platform usage distribution</p>
            </div>
            <span className="text-xs text-indigo-400 font-semibold bg-indigo-500/5 px-2.5 py-1 rounded-lg border border-indigo-500/10">
              Weekly Allocation
            </span>
          </div>

          <div className="h-40 w-full flex items-end justify-between px-2 pt-6">
            {/* Monday */}
            <div className="flex flex-col items-center gap-2 group w-full">
              <div className="relative w-8 bg-slate-800/80 rounded-t-lg h-24 overflow-hidden">
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-indigo-600 to-purple-500 h-10 group-hover:h-12 transition-all duration-300" />
              </div>
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider font-mono">Mon</span>
            </div>
            {/* Tuesday */}
            <div className="flex flex-col items-center gap-2 group w-full">
              <div className="relative w-8 bg-slate-800/80 rounded-t-lg h-24 overflow-hidden">
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-indigo-600 to-purple-500 h-16 group-hover:h-20 transition-all duration-300" />
              </div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider font-mono">Tue</span>
            </div>
            {/* Wednesday */}
            <div className="flex flex-col items-center gap-2 group w-full">
              <div className="relative w-8 bg-slate-800/80 rounded-t-lg h-24 overflow-hidden">
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-indigo-600 to-purple-500 h-8 group-hover:h-10 transition-all duration-300" />
              </div>
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider font-mono">Wed</span>
            </div>
            {/* Thursday */}
            <div className="flex flex-col items-center gap-2 group w-full">
              <div className="relative w-8 bg-slate-800/80 rounded-t-lg h-24 overflow-hidden">
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-indigo-600 to-purple-500 h-20 group-hover:h-22 transition-all duration-300" />
              </div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider font-mono">Thu</span>
            </div>
            {/* Friday */}
            <div className="flex flex-col items-center gap-2 group w-full">
              <div className="relative w-8 bg-slate-800/80 rounded-t-lg h-24 overflow-hidden">
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-indigo-600 to-purple-500 h-14 group-hover:h-18 transition-all duration-300" />
              </div>
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider font-mono">Fri</span>
            </div>
            {/* Saturday */}
            <div className="flex flex-col items-center gap-2 group w-full">
              <div className="relative w-8 bg-slate-800/80 rounded-t-lg h-24 overflow-hidden">
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-indigo-600 to-purple-500 h-6 group-hover:h-8 transition-all duration-300" />
              </div>
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider font-mono">Sat</span>
            </div>
            {/* Today */}
            <div className="flex flex-col items-center gap-2 group w-full">
              <div className="relative w-8 bg-slate-800/80 rounded-t-lg h-24 overflow-hidden border border-indigo-500/30">
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-500 via-indigo-500 to-indigo-400 h-24 transition-all duration-500" />
              </div>
              <span className="text-[10px] text-indigo-400 font-extrabold uppercase tracking-widest font-mono">Today</span>
            </div>
          </div>
        </div>

        {/* Short-cuts Bento */}
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-900 flex flex-col justify-between space-y-6">
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-200">Creative Shortcuts</h3>
            <p className="text-xs text-slate-500">Deploy high-converting content with ease</p>
          </div>

          <div className="space-y-3 flex-1 pt-2">
            <button
              onClick={() => setActiveTab('write')}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-900 text-left hover:border-slate-800 transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <PenTool className="h-4 w-4" />
                </span>
                <div>
                  <h4 className="text-sm font-semibold text-slate-200">Single AI Writer</h4>
                  <p className="text-[10px] text-slate-500">Fine-tune individual campaigns</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-slate-300 group-hover:translate-x-1 transition-all" />
            </button>

            <button
              onClick={() => setActiveTab('prompts')}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-900 text-left hover:border-slate-800 transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                  <BookOpen className="h-4 w-4" />
                </span>
                <div>
                  <h4 className="text-sm font-semibold text-slate-200">Prompt Library</h4>
                  <p className="text-[10px] text-slate-500">Access preloaded sales templates</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-slate-300 group-hover:translate-x-1 transition-all" />
            </button>
          </div>

          <div className="pt-4 border-t border-slate-900/60 flex items-center justify-between text-[11px] text-slate-400">
            <span>Stacker runs: {user.stackRuns}</span>
            <span>Channel bias: {stackPercent}% stacker</span>
          </div>
        </div>
      </div>

      {/* Recent Studio Activity */}
      <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-900 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-200">Recent Studio Activity</h3>
            <p className="text-xs text-slate-500">Quick view and access to recently generated drafts</p>
          </div>
          <button
            onClick={() => setActiveTab('history')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
          >
            <span>View All Studio</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {stats.recentActivity.length === 0 ? (
          <div className="p-10 text-center rounded-xl bg-slate-950/60 border border-slate-950/80 space-y-4">
            <span className="inline-block p-3 rounded-full bg-slate-900 text-slate-500 text-xl font-bold">
              ∅
            </span>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-slate-300">No content drafts found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Transform a single concept into a complete multi-channel suite by launching the Content Stacker.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('stacker')}
              className="mt-2 px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-slate-200 cursor-pointer"
            >
              Generate First Campaign
            </button>
          </div>
        ) : (
          <div className="space-y-3.5">
            {stats.recentActivity.slice(0, 3).map((item) => {
              const previewText = item.type === 'single' 
                ? (item.data.singleOutput || '')
                : (item.data.blogPost || item.data.linkedinPost || item.data.instagramCaption || '');

              return (
                <div 
                  key={item.id} 
                  className="p-4 rounded-xl bg-slate-950 hover:bg-slate-900/60 border border-slate-900/60 transition-all duration-200 group flex items-start justify-between gap-4"
                >
                  <div className="space-y-3 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {getFormatBadge(item.type, item.contentType)}
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(item.createdAt).toLocaleDateString(undefined, { 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-200 truncate pr-4">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-400 font-mono line-clamp-1 italic text-slate-500 bg-slate-900/40 py-1 px-2.5 rounded-md border border-slate-900/40">
                        "{item.input}"
                      </p>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed pt-1 select-none">
                        {previewText.replace(/[#*`_-]/g, '').slice(0, 200)}...
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 self-center">
                    <button
                      onClick={() => exportItemToPDF(item)}
                      className="p-2 rounded-lg bg-indigo-950/30 hover:bg-indigo-900/40 text-indigo-400 hover:text-indigo-300 transition-colors border border-indigo-900/20 cursor-pointer"
                      title="Export as Styled PDF"
                    >
                      <FileText className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onCopy(previewText)}
                      className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors border border-slate-900 cursor-pointer"
                      title="Copy content preview text"
                    >
                      {copiedId === previewText ? (
                        <Check className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors border border-slate-900 cursor-pointer"
                      title="Delete draft"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setActiveTab('history')}
                      className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-indigo-400 hover:text-indigo-300 transition-colors border border-slate-900 cursor-pointer font-bold text-xs flex items-center gap-0.5"
                    >
                      Open
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
