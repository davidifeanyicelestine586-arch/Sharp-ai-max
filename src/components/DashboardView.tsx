import React from 'react';
import { 
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
  Trash2,
  PieChart,
  BarChart3,
  Calendar
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

export default function DashboardView({ 
  stats, 
  user, 
  setActiveTab, 
  onCopy, 
  onDelete, 
  copiedId, 
  onOpenTagGuide 
}: DashboardViewProps) {
  const items = stats.recentActivity;
  const singleCount = items.filter(x => x.type === 'single').length;
  const stackCount = items.filter(x => x.type === 'stacked').length;
  const totalDrafts = items.length;

  // Real channel breakdown from actual history
  const channelCounts = items.reduce<Record<string, number>>((acc, item) => {
    if (item.type === 'stacked') {
      acc['Blog'] = (acc['Blog'] || 0) + 1;
      acc['LinkedIn'] = (acc['LinkedIn'] || 0) + 1;
      acc['X (Twitter)'] = (acc['X (Twitter)'] || 0) + 1;
      acc['Instagram'] = (acc['Instagram'] || 0) + 1;
      acc['Newsletter'] = (acc['Newsletter'] || 0) + 1;
    } else if (item.contentType) {
      const name = item.contentType.charAt(0).toUpperCase() + item.contentType.slice(1);
      acc[name] = (acc[name] || 0) + 1;
    }
    return acc;
  }, {});

  const channelEntries = Object.entries(channelCounts);
  const totalChannelUnits = channelEntries.reduce((sum, [, count]) => sum + count, 0);

  const getFormatBadge = (type: string, contentType?: string) => {
    if (type === 'stacked') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-semibold rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 leading-none">
          <Layers className="h-3 w-3" /> 5-in-1 Stack
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-semibold rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 leading-none uppercase">
        <PenTool className="h-3 w-3" /> {contentType || 'Single'}
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-100">
      {/* Intentional Workspace Header */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md">
                Workspace Overview
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Welcome back, {user.name}
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Transform single concepts into structured multi-channel campaigns or write targeted single-channel copy.
              {onOpenTagGuide && (
                <>
                  {' '}Need help organizing your campaign drafts? Read the{' '}
                  <button 
                    onClick={onOpenTagGuide} 
                    className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4 cursor-pointer focus:outline-none"
                  >
                    Tagging &amp; Workflow Guide &rarr;
                  </button>
                </>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              id="cta-stacker"
              onClick={() => setActiveTab('stacker')}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold leading-none shadow-sm transition-all duration-200 flex items-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              <span>New Multi-Channel Stack</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Numerical Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Words Produced</span>
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="space-y-0.5">
            <h2 className="text-2xl font-bold tabular-nums font-mono text-white tracking-tight">
              {stats.totalWords.toLocaleString()}
            </h2>
            <p className="text-xs text-slate-500">Cumulative text output</p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">5-in-1 Stacks Built</span>
            <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div className="space-y-0.5">
            <h2 className="text-2xl font-bold tabular-nums font-mono text-white tracking-tight">
              {stats.totalStacks}
            </h2>
            <p className="text-xs text-slate-500">Cross-channel suites</p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Generation Credits</span>
            <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400">
              <Coins className="h-4 w-4" />
            </div>
          </div>
          <div className="space-y-0.5">
            <h2 className="text-2xl font-bold tabular-nums font-mono text-white tracking-tight">
              {stats.creditsRemaining}
            </h2>
            <p className="text-xs text-slate-500">Available of {user.creditsTotal}</p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Current Plan</span>
            <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
              user.tier === 'pro' 
                ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20' 
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}>
              {user.tier}
            </span>
          </div>
          <div className="space-y-0.5">
            <h2 className="text-2xl font-bold font-mono text-white uppercase tracking-tight">
              {user.tier === 'pro' ? 'Pro Member' : 'Free Tier'}
            </h2>
            <p className="text-xs text-slate-500">
              {user.tier === 'pro' ? 'Unlimited volume allocation' : '5,000 monthly allowance'}
            </p>
          </div>
        </div>
      </div>

      {/* Production Distribution & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real Production Distribution */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-indigo-400" />
                <span>Channel Output Distribution</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Calculated from your {totalDrafts} saved drafts in this studio
              </p>
            </div>
            <span className="text-xs font-mono font-semibold text-slate-400 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
              {totalChannelUnits} total deliverables
            </span>
          </div>

          {channelEntries.length === 0 ? (
            <div className="py-10 text-center text-slate-500 space-y-2">
              <p className="text-xs">No draft campaigns recorded yet.</p>
              <p className="text-[11px] text-slate-600">Run the Single Writer or Content Stacker to populate production metrics.</p>
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              {channelEntries.map(([channel, count]) => {
                const percent = totalChannelUnits > 0 ? Math.round((count / totalChannelUnits) * 100) : 0;
                return (
                  <div key={channel} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-300">{channel}</span>
                      <span className="font-mono text-slate-400 tabular-nums">
                        {count} {count === 1 ? 'asset' : 'assets'} ({percent}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-950 rounded-md overflow-hidden border border-slate-800/80">
                      <div 
                        className="h-full bg-indigo-500 rounded-sm transition-all duration-300"
                        style={{ width: `${Math.max(4, percent)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Single posts: {singleCount}</span>
            <span>Stacked suites: {stackCount}</span>
          </div>
        </div>

        {/* Shortcuts & Operations */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-5">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">Studio Workspaces</h3>
            <p className="text-xs text-slate-400">Launch creative generators or browse recipes</p>
          </div>

          <div className="space-y-2.5 flex-1 pt-1">
            <button
              onClick={() => setActiveTab('write')}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <PenTool className="h-4 w-4" />
                </span>
                <div>
                  <h4 className="text-xs font-semibold text-white">Single AI Writer</h4>
                  <p className="text-[11px] text-slate-400">Targeted format copy with live mockup preview</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-slate-300 transition-transform group-hover:translate-x-0.5" />
            </button>

            <button
              onClick={() => setActiveTab('prompts')}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <BookOpen className="h-4 w-4" />
                </span>
                <div>
                  <h4 className="text-xs font-semibold text-white">Prompt Template Library</h4>
                  <p className="text-[11px] text-slate-400">Curated prompts and custom saved recipes</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-slate-300 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between font-mono">
            <span>Quota resets monthly</span>
            <button 
              onClick={() => setActiveTab('profile')}
              className="text-indigo-400 hover:text-indigo-300 font-semibold underline cursor-pointer"
            >
              Account &amp; Billing
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Recent Studio Drafts</h3>
            <p className="text-xs text-slate-400">Directly inspect, copy, or export recently produced outputs</p>
          </div>
          <button
            onClick={() => setActiveTab('history')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer focus:outline-none"
          >
            <span>View All ({stats.recentActivity.length})</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {stats.recentActivity.length === 0 ? (
          <div className="p-10 text-center rounded-xl bg-slate-950/40 border border-slate-800/60 space-y-3">
            <p className="text-xs text-slate-400">No campaigns saved to storage yet.</p>
            <button
              onClick={() => setActiveTab('stacker')}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
            >
              Generate First Campaign
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {stats.recentActivity.slice(0, 4).map((item) => {
              const previewText = item.type === 'single' 
                ? (item.data.singleOutput || '')
                : (item.data.blogPost || item.data.linkedinPost || item.data.instagramCaption || '');

              return (
                <div 
                  key={item.id} 
                  className="p-4 rounded-xl bg-slate-950 hover:bg-slate-900/60 border border-slate-800 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {getFormatBadge(item.type, item.contentType)}
                      <span className="text-[11px] font-mono text-slate-500 tabular-nums">
                        {new Date(item.createdAt).toLocaleDateString(undefined, { 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white truncate">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-1">
                      "{item.input}"
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => exportItemToPDF(item)}
                      className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-indigo-400 hover:text-indigo-300 border border-slate-800 cursor-pointer text-xs"
                      title="Export as PDF document"
                      aria-label="Export as PDF document"
                    >
                      <FileText className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onCopy(previewText)}
                      className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 cursor-pointer text-xs"
                      title="Copy preview text"
                      aria-label="Copy preview text"
                    >
                      {copiedId === previewText ? (
                        <Check className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-800 cursor-pointer text-xs"
                      title="Delete draft"
                      aria-label="Delete draft"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setActiveTab('history')}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-indigo-400 hover:text-indigo-300 border border-slate-800 cursor-pointer text-xs font-semibold"
                    >
                      Open in Studio
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
