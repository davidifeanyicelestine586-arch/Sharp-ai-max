import React, { useState, useEffect } from 'react';
import { 
  Check, 
  Trash2, 
  RefreshCw, 
  Compass,
  Edit2
} from 'lucide-react';
import { UserProfile } from '../types';
import { PageHeader, Card, Button, Badge, Input } from './ui';

interface ProfileViewProps {
  user: UserProfile;
  onUpgrade: () => void;
  onDowngrade: () => void;
  onUpdateName: (name: string) => void;
}

export default function ProfileView({ user, onUpgrade, onDowngrade, onUpdateName }: ProfileViewProps) {
  const [editMode, setEditMode] = useState(false);
  const [inputName, setInputName] = useState(user.name);
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);

  useEffect(() => {
    setInputName(user.name);
  }, [user.name]);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputName.trim()) {
      onUpdateName(inputName);
      setEditMode(false);
    }
  };

  const triggerUpgrade = () => {
    onUpgrade();
    setUpgradeSuccess(true);
    setTimeout(() => setUpgradeSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in text-slate-900 dark:text-slate-100">
      <PageHeader
        kicker="WORKSPACE &amp; USAGE"
        title="Workspace Profile"
        description="Review your local workspace profile and monitor generation usage."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
        {/* Left: Profile & Usage Metrics */}
        <div className="lg:col-span-7 space-y-6">
          {/* Identity Info */}
          <Card variant="default" padding="md" className="space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">
              Profile Details
            </h3>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold font-mono text-base uppercase shrink-0">
                  {user.name.slice(0, 2)}
                </div>
                <div className="min-w-0">
                  {editMode ? (
                    <form onSubmit={handleSaveName} className="flex items-center gap-2">
                      <Input
                        type="text"
                        value={inputName}
                        onChange={e => setInputName(e.target.value)}
                        required
                        autoFocus
                        className="h-8"
                      />
                      <Button type="submit" variant="primary" size="xs">
                        Save
                      </Button>
                    </form>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-none truncate">
                        {user.name}
                      </h4>
                      <button 
                        type="button" 
                        onClick={() => setEditMode(true)}
                        className="text-[11px] text-indigo-500 dark:text-indigo-400 hover:underline cursor-pointer font-semibold flex items-center gap-1"
                      >
                        <Edit2 className="h-3 w-3" />
                        <span>Edit</span>
                      </button>
                    </div>
                  )}
                  <p className="text-xs text-slate-400 mt-1 truncate">{user.email}</p>
                </div>
              </div>

              <Badge 
                variant={user.tier === 'pro' ? 'primary' : 'neutral'} 
                size="sm"
                className="self-start sm:self-center uppercase"
              >
                {user.tier} TIER
              </Badge>
            </div>
          </Card>

          {/* Usage Metrics */}
          <Card variant="default" padding="md" className="space-y-5">
            <h3 className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">
              Usage &amp; Production Stats
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[11px] font-mono text-slate-400 block">MULTI-STACK RUNS</span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                  {user.stackRuns}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[11px] font-mono text-slate-400 block">TOTAL WORDS GENERATED</span>
                <span className="text-xl font-bold font-mono text-indigo-500 dark:text-indigo-400 tabular-nums">
                  {user.wordCountGenerated.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Local Preview Credits</span>
                <span className="font-mono text-slate-400 tabular-nums">
                  {user.creditsUsed.toLocaleString()} / {user.creditsTotal.toLocaleString()} credits used
                </span>
              </div>

              {user.tier === 'free' ? (
                <div className="space-y-1">
                  <div
                    className="w-full bg-slate-200 dark:bg-slate-950 rounded-md h-2 overflow-hidden border border-slate-300 dark:border-slate-800"
                    role="progressbar"
                    aria-label="Local preview credits used"
                    aria-valuemin={0}
                    aria-valuemax={user.creditsTotal}
                    aria-valuenow={Math.min(user.creditsUsed, user.creditsTotal)}
                  >
                    <div
                      className="h-full bg-indigo-500 rounded-sm transition-all duration-300"
                      style={{ width: `${Math.max(2, Math.min(100, Math.round((user.creditsUsed / Math.max(1, user.creditsTotal)) * 100)))}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Credits are local prototype state. They are not secure server-side quota enforcement.
                  </p>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-400 leading-relaxed font-medium">
                  Pro limits, billing, and priority processing are not connected yet. This control only changes local prototype state.
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right: Subscription Plan Comparison */}
        <div className="lg:col-span-5 space-y-6">
          <Card variant="default" padding="md" className="space-y-5">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400">
                PRO PREVIEW
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Sharp AI Pro Preview</h3>
              <p className="text-xs text-slate-400">A local preview of the planned paid workspace experience.</p>
            </div>

            <div className="flex items-baseline gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-4">
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">Planned</span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-indigo-400 shrink-0" />
                <span>Higher generation limits (planned)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-indigo-400 shrink-0" />
                <span>Simultaneous 5-in-1 multi-channel content stacker</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-indigo-400 shrink-0" />
                <span>Custom user prompt recipe authoring &amp; storage</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-indigo-400 shrink-0" />
                <span>Full Markdown (.md) and PDF document exports</span>
              </li>
            </ul>

            <div className="pt-2">
              {upgradeSuccess && (
                <div className="mb-3 p-2 text-center text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  Local preview tier updated.
                </div>
              )}

              {user.tier === 'free' ? (
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={triggerUpgrade}
                >
                  Preview Pro Tier
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="md"
                  fullWidth
                  onClick={onDowngrade}
                  className="hover:text-rose-400 hover:border-rose-500/30"
                >
                  Return to Free Tier
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Cache & Session Management */}
      <Card variant="subtle" padding="md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-indigo-400" />
              <span>Workspace Cache &amp; Client State</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Reset stored session data, drafts, and UI state or jump straight into the redesigned SaaS landing page.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                window.location.hash = '#/overview';
                window.location.reload();
              }}
              leftIcon={<Compass className="h-3.5 w-3.5 text-indigo-400" />}
            >
              Open SaaS Showcase
            </Button>
            <Button
              variant="destructive-outline"
              size="sm"
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                window.location.hash = '#/overview';
                window.location.reload();
              }}
              leftIcon={<Trash2 className="h-3.5 w-3.5" />}
            >
              Clear Cache &amp; Reset App
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
