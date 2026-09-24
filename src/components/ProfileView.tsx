import React, { useState } from 'react';
import { 
  User, 
  Check, 
  Coins, 
  Layers, 
  CreditCard,
  FileText
} from 'lucide-react';
import { UserProfile } from '../types';

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

  const wordPercentage = Math.min(100, Math.round((user.wordCountGenerated / 5000) * 100));

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
    <div className="space-y-6 md:space-y-8 animate-fade-in text-slate-100">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md">
            Workspace &amp; Usage
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
          Workspace Profile
        </h1>
        <p className="text-xs md:text-sm text-slate-400 max-w-xl">
          Review your local workspace profile and monitor generation usage.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
        {/* Left: Profile & Usage Metrics */}
        <div className="lg:col-span-7 space-y-6">
          {/* Identity Info */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">
              Profile Details
            </h3>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 flex items-center justify-center font-bold font-mono text-base uppercase shrink-0">
                  {user.name.slice(0, 2)}
                </div>
                <div className="min-w-0">
                  {editMode ? (
                    <form onSubmit={handleSaveName} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={inputName}
                        onChange={e => setInputName(e.target.value)}
                        className="bg-slate-950 text-white border border-slate-800 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-indigo-500"
                        required
                        autoFocus
                      />
                      <button 
                        type="submit" 
                        className="px-2.5 py-1 bg-indigo-600 rounded text-xs font-bold text-white hover:bg-indigo-500 cursor-pointer"
                      >
                        Save
                      </button>
                    </form>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white leading-none truncate">{user.name}</h4>
                      <button 
                        onClick={() => setEditMode(true)}
                        className="text-[11px] text-indigo-400 hover:text-indigo-300 cursor-pointer font-semibold"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                  <p className="text-xs text-slate-400 mt-1 truncate">{user.email}</p>
                </div>
              </div>

              <span className={`self-start sm:self-center px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider ${
                user.tier === 'pro' 
                  ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30' 
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {user.tier.toUpperCase()} TIER
              </span>
            </div>
          </div>

          {/* Usage Metrics */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
            <h3 className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">
              Usage &amp; Production Stats
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[11px] font-mono text-slate-400 block">MULTI-STACK RUNS</span>
                <span className="text-xl font-bold font-mono text-white tabular-nums">{user.stackRuns}</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[11px] font-mono text-slate-400 block">TOTAL WORDS GENERATED</span>
                <span className="text-xl font-bold font-mono text-indigo-400 tabular-nums">{user.wordCountGenerated.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-300">Monthly Word Budget</span>
                <span className="font-mono text-slate-400 tabular-nums">
                  {user.tier === 'pro' 
                    ? `${user.wordCountGenerated.toLocaleString()} words (Unlimited)` 
                    : `${user.wordCountGenerated.toLocaleString()} / 5,000 words`
                  }
                </span>
              </div>

              {user.tier === 'free' ? (
                <div className="space-y-1">
                  <div className="w-full bg-slate-950 rounded-md h-2 overflow-hidden border border-slate-800">
                    <div 
                      className="h-full bg-indigo-500 rounded-sm transition-all duration-300" 
                      style={{ width: `${Math.max(2, wordPercentage)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Free tier includes 5,000 generated words per month. Upgrading to Pro unlocks unmetered volume.
                  </p>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 leading-relaxed font-medium">
                  Pro limits, billing, and priority processing are not connected yet. This control only changes local prototype state.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Subscription Plan Comparison */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400">
                PRO PREVIEW
              </span>
              <h3 className="text-base font-bold text-white">Sharp AI Pro Preview</h3>
              <p className="text-xs text-slate-400">A local preview of the planned paid workspace experience.</p>
            </div>

            <div className="flex items-baseline gap-1.5 border-b border-slate-800 pb-4">
              <span className="text-2xl font-bold font-mono text-white">Planned</span>
              
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300">
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
                <div className="mb-3 p-2 text-center text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                  Local preview tier updated.
                </div>
              )}

              {user.tier === 'free' ? (
                <button
                  onClick={triggerUpgrade}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold leading-none cursor-pointer transition-colors shadow-sm"
                >
                  Preview Pro Tier
                </button>
              ) : (
                <button
                  onClick={onDowngrade}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 text-xs font-semibold leading-none cursor-pointer transition-colors"
                >
                  Return to Free Tier
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
