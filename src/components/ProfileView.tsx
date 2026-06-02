/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  User, 
  Sparkles, 
  Lock, 
  Check, 
  CreditCard, 
  Terminal, 
  Activity, 
  Coins, 
  Zap,
  Users,
  Building
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

  const wordPercentage = Math.round((user.wordCountGenerated / 5000) * 100);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputName.trim()) {
      onUpdateName(inputName);
      setEditMode(false);
    }
  };

  const triggerUpgradeSim = () => {
    onUpgrade();
    setUpgradeSuccess(true);
    setTimeout(() => setUpgradeSuccess(false), 3500);
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-100">
      {/* Introduction Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20">
          <User className="h-3.5 w-3.5 shrink-0" />
          Subscriber Identity
        </div>
        <h1 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight">Billing &amp; Active Account</h1>
        <p className="text-xs md:text-sm text-slate-400">
          Manage your subscription plans, monitor workspace usage, and toggle team workspace collaboration parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Account Info & Usage Stats */}
        <div className="lg:col-span-7 space-y-6">
          {/* Identity Card */}
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-900 space-y-5">
            <h3 className="text-xs font-extrabold uppercase text-slate-500 font-mono tracking-wider">Subscriber Identity Record</h3>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold font-display text-lg select-none">
                  🧑‍💻
                </div>
                <div>
                  {editMode ? (
                    <form onSubmit={handleSaveName} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={inputName}
                        onChange={e => setInputName(e.target.value)}
                        className="bg-slate-950 text-slate-200 border border-slate-900 rounded px-2.5 py-1.5 text-xs focus:outline-none"
                        required
                        autoFocus
                      />
                      <button 
                        type="submit" 
                        className="px-2.5 py-1.5 bg-indigo-600 rounded text-[10px] font-bold text-slate-200 hover:bg-indigo-500 cursor-pointer"
                      >
                        Save
                      </button>
                    </form>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-200 leading-none">{user.name}</h4>
                      <button 
                        onClick={() => setEditMode(true)}
                        className="text-[9px] text-indigo-400 hover:underline cursor-pointer font-bold uppercase"
                      >
                        (Edit)
                      </button>
                    </div>
                  )}
                  <p className="text-[11px] text-slate-500 leading-none mt-1.5">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider ${
                  user.tier === 'pro' 
                    ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20' 
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {user.tier} ACCOUNT MEMBER
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Usage */}
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-900 space-y-6">
            <h3 className="text-xs font-extrabold uppercase text-slate-500 font-mono tracking-wider">Workspace Usage Log Details</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-900 space-y-1">
                <span className="text-[10px] font-extrabold text-slate-550 block font-mono">STACKS COMPILED</span>
                <span className="text-lg font-bold font-mono text-slate-200">{user.stackRuns}</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-900 space-y-1">
                <span className="text-[10px] font-extrabold text-slate-550 block font-mono">TOTAL IDEAS REPURPOSED</span>
                <span className="text-lg font-bold font-mono text-indigo-400">{user.stackRuns * 5} draft assets</span>
              </div>
            </div>

            {/* Word count target progress */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-400">Monthly Word Allocation Progress</span>
                <span className="text-slate-500 font-bold font-mono">
                  {user.tier === 'pro' ? 'Unlimited PRO Words' : `${user.wordCountGenerated.toLocaleString()} / 5,000 allowance`}
                </span>
              </div>

              {user.tier === 'free' ? (
                <div className="space-y-1">
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-900/50">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-300" 
                      style={{ width: `${Math.min(100, wordPercentage)}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 text-left leading-relaxed">
                    Under Free tier, your monthly word generation budget resets soon. Upgrade to Pro for limitless outputs.
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 flex items-center gap-3">
                  <span className="text-base">🚀</span>
                  <p className="text-xs text-indigo-300 leading-normal font-medium">
                    You have unlocked **unlimited premium copy output generation**, custom user recipes, and double speed generation!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: subscription pricing and locks */}
        <div className="lg:col-span-5 space-y-6">
          {/* Pro Subscription Offer */}
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-900 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-3 select-none">
              <Sparkles className="h-6 w-6 text-indigo-500/20 fill-indigo-400/5" />
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-indigo-400 bg-indigo-500/5 border border-indigo-500/10 px-2 py-0.5 rounded inline-block font-mono">
                  MEMBERSHIP plans
                </span>
                <h3 className="text-lg font-extrabold text-slate-200">The Sharp AI Pro Plan</h3>
                <p className="text-xs text-slate-500 leading-relaxed">Elevate your content workflow to a powerful modern automated system.</p>
              </div>

              <div className="flex items-baseline gap-1 pt-1 border-b border-slate-950 pb-4">
                <span className="text-3xl font-black font-display text-slate-100">$15</span>
                <span className="text-xs text-slate-500 font-semibold uppercase">/ month</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-400 pt-2 font-medium">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span>Unlimited High-Volume Word Outputs</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span>Direct Workspace Stacking Action (5-in-1 tool)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span>Uncapped Custom Prompt Recipes</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span>Multi-channel HTML &amp; MD Document Downloads</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              {upgradeSuccess && (
                <div className="mb-3 p-2.5 text-center text-[11px] font-bold text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 rounded-xl animate-fade-in flex items-center justify-center gap-1.5">
                  <span>✓ Subscription upgraded! Welcome to PRO.</span>
                </div>
              )}

              {user.tier === 'free' ? (
                <button
                  onClick={triggerUpgradeSim}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-500 hover:from-purple-500 hover:to-indigo-500 text-slate-100 text-xs font-bold leading-none shadow-md shadow-indigo-600/10 cursor-pointer flex items-center justify-center gap-1.5 border border-indigo-500/20"
                >
                  <Zap className="h-3.5 w-3.5" />
                  <span>Upgrade Workspace to Pro</span>
                </button>
              ) : (
                <button
                  onClick={onDowngrade}
                  className="w-full py-3 px-4 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-900 text-slate-500 hover:text-rose-400 text-xs font-bold leading-none cursor-pointer transition-colors"
                >
                  Downgrade Account back to Free (Cancel)
                </button>
              )}
            </div>
          </div>

          {/* locked team space */}
          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-900 space-y-4 relative overflow-hidden">
            {user.tier === 'free' && (
              <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[1px] flex flex-col items-center justify-center p-4 text-center z-10 shrink-0 select-none animate-fade-in">
                <Lock className="h-5 w-5 text-slate-600 mb-2 shrink-0 animate-bounce" />
                <span className="block text-xs font-bold text-slate-300">Team Workspaces Locked</span>
                <span className="block text-[10px] text-slate-500 max-w-[200px] leading-relaxed mt-1">Upgrade your personal space to Pro to unlock real collaborative team folders.</span>
              </div>
            )}

            <div className="flex items-center gap-3">
              <span className="p-2 rounded-lg bg-pink-500/15 text-pink-400 border border-pink-500/20">
                <Users className="h-4.5 w-4.5 shrink-0" />
              </span>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Shared Collaborative Workspaces</h4>
                <p className="text-[9px] text-slate-500">Enable real-time content feedback loops for teams</p>
              </div>
            </div>

            <div className="space-y-2 pt-1 text-[11px] text-slate-400 font-medium">
              <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg border border-slate-900/60">
                <span className="font-semibold">Active workspace collaborators</span>
                <span className="font-mono font-bold text-slate-500">1 (Just You)</span>
              </div>
              <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg border border-slate-900/60">
                <span className="font-semibold">Cross-Workspace Shared Projects</span>
                <span className="font-mono font-bold text-slate-500">0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
